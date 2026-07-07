import os
import sys
import json
import re
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import easyocr
from groq import Groq

# Path setup
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database import engine, get_db
from app.models import AnalysisReport, Base

app = FastAPI(title="Verdant AI Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

reader = easyocr.Reader(['en'], gpu=False)
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def format_to_string(data):
    if isinstance(data, list):
        return ", ".join(map(str, data))
    elif isinstance(data, dict):
        return json.dumps(data)
    return str(data) if data else ""

def to_float(value):
    try:
        if isinstance(value, dict):
            return float(value.get("score", 0.0))
        return float(value)
    except (ValueError, TypeError):
        return 0.0

def to_score_out_of_10(value):
   
    v = to_float(value)
    if v > 10:
        v = v / 10
    return round(min(max(v, 0), 10), 1)


@app.post("/analyze")
async def analyze_product(
    file: UploadFile = File(None),
    ingredients: str = Form(None),
    product_name: str = Form(None),
    company_name: str = Form(None),
    username: str = Form(None),
    db: Session = Depends(get_db)

):
    try:
        extracted_text = ""
        if file:
            image_data = await file.read()
            results = reader.readtext(image_data, detail=0)
            extracted_text = " ".join(results)
        
        final_ingredients = ingredients if (ingredients and len(ingredients) > 10) else extracted_text

        analysis_prompt = f"""Analyze the following product for its environmental impact, health risks, and sustainability.

Product Name: {product_name or "Unknown"}
Company Name: {company_name or "Unknown"}
Ingredients: {final_ingredients}

Return ONLY a JSON object with these exact keys:
- product_name (string)
- company_name (string)
- eco_score (integer, STRICTLY on a scale of 1 to 10, where 10 is best)
- environmental_score (integer, STRICTLY on a scale of 1 to 10, where 10 is best)
- confidence_score (integer, STRICTLY on a scale of 1 to 10, where 10 is most confident)
- health_risk (one of: "Low", "Medium", "High")
- greenwashing_verdict (short string describing likelihood of greenwashing)
- hidden_chemicals (list of chemical name strings, or empty list if none)
- safe_alternatives (list of alternative product suggestion strings)
- summary (2-3 sentence string summarizing the overall assessment)

Do not use any scale other than 1-10 for the numeric scores."""

        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": analysis_prompt}],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"}
        )

        content = chat_completion.choices[0].message.content
        parsed_result = json.loads(re.search(r'\{.*\}', content, re.DOTALL).group())

        db_report = AnalysisReport(
            username=username,
            product_name=str(parsed_result.get("product_name", product_name or "Unknown")),
            company_name=str(parsed_result.get("company_name", company_name or "Unknown")),
            image_path=file.filename if file else "Manual",
            ocr_text=extracted_text,
            ingredients=final_ingredients,
            eco_score=to_score_out_of_10(parsed_result.get("eco_score", 5)),
            health_risk=str(parsed_result.get("health_risk", "Low")),
            environmental_score=to_score_out_of_10(parsed_result.get("environmental_score", 5)),
            greenwashing_verdict=str(parsed_result.get("greenwashing_verdict", "N/A")),
            hidden_chemicals=format_to_string(parsed_result.get("hidden_chemicals", [])),
            safe_alternatives=format_to_string(parsed_result.get("safe_alternatives", [])),
            confidence_score=to_score_out_of_10(parsed_result.get("confidence_score", 5)),
            ai_summary=str(parsed_result.get("summary", "No summary.")),
            analysis_json=content
        )
        
        db.add(db_report)
        db.commit()

        
        parsed_result["eco_score"] = db_report.eco_score
        parsed_result["environmental_score"] = db_report.environmental_score
        parsed_result["confidence_score"] = db_report.confidence_score
        parsed_result["ingredients"] = final_ingredients

        return {"status": "success", "data": parsed_result}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------------------------------------------------
# 📜 HISTORY ENDPOINT — 
# ----------------------------------------------------------------------
@app.get("/history")
async def get_history(db: Session = Depends(get_db)):
    try:
        reports = db.query(AnalysisReport).order_by(AnalysisReport.id.desc()).all()
        return [
            {
                "id": r.id,
                "username": r.username,
                "product_name": r.product_name,
                "company_name": r.company_name,
                "image_path": r.image_path,
                "ingredients": r.ingredients,
                "eco_score": r.eco_score,
                "health_risk": r.health_risk,
                "environmental_score": r.environmental_score,
                "greenwashing_verdict": r.greenwashing_verdict,
                "hidden_chemicals": r.hidden_chemicals,
                "safe_alternatives": r.safe_alternatives,
                "confidence_score": r.confidence_score,
                "ai_summary": r.ai_summary,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in reports
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ----------------------------------------------------------------------
# ❌ DELETE HISTORY ITEM — api.js-ல் deleteHistoryItem() இதை expect பண்றது
# ----------------------------------------------------------------------
@app.delete("/history/{report_id}")
async def delete_history_item(report_id: int, db: Session = Depends(get_db)):
    try:
        report = db.query(AnalysisReport).filter(AnalysisReport.id == report_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="Record not found")
        db.delete(report)
        db.commit()
        return {"status": "success", "message": f"Record {report_id} deleted"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"status": "healthy", "engine": "FastAPI Verdant AI Backend Active"}