import logging
from sqlalchemy.orm import Session

from app.ocr import extract_text
from app.agent import analyze_ingredients
from app.models import AnalysisReport
from app.utils import delete_uploaded_file

logger = logging.getLogger("app.services")


def analyze_product_service(
    db: Session,
    username: str,
    product_name: str,
    company_name: str,
    image_path: str
) -> dict:
    """
    Complete orchestrated workflow:
    Image Processing ──> Adaptive OCR ──> LangGraph LLM Analytics ──> Database Sync
    """
    try:
        # 1. Run Text Extraction
        ingredients = extract_text(image_path)

        if not ingredients or not ingredients.strip():
            delete_uploaded_file(image_path)
            return {
                "success": False,
                "message": "No text detected from image labels. Ensure good lighting and crisp text focus.",
                "eco_score": 0,
                "health_risk": "Unknown",
                "environment_score": 0,
                "greenwashing_verdict": "Unanalyzed",
                "hidden_chemicals": "",
                "safe_alternatives": "",
                "confidence_score": 0.0,
                "ai_summary": "OCR processing returned empty text characters."
            }

        # 2. Run LangGraph Multi-Agent Audit Analysis
        result = analyze_ingredients(
            product_name=product_name,
            company_name=company_name,
            ingredients=ingredients
        )

        # 3. Create Model Record with Safe Default Fallbacks
        report = AnalysisReport(
            username=username,
            product_name=product_name,
            company_name=company_name,
            ingredients=ingredients,
            eco_score=result.get("eco_score", 0),
            health_risk=result.get("health_risk", "Unknown"),
            environment_score=result.get("environment_score", 0),
            greenwashing_verdict=result.get("greenwashing_verdict", "Unknown"),
            hidden_chemicals=result.get("hidden_chemicals", ""),
            safe_alternatives=result.get("safe_alternatives", ""),
            confidence_score=result.get("confidence_score", 0.0),
            ai_summary=result.get("ai_summary", "")
        )

        # 4. Transaction Block
        try:
            db.add(report)
            db.commit()
            db.refresh(report)
        except Exception as db_err:
            db.rollback()  # Erase session footprints cleanly
            logger.error(f"Database write barrier hit: {str(db_err)}")
            raise db_err

        # 5. Clean up temporary server storage files
        delete_uploaded_file(image_path)

        # 6. Flat Response layout mirroring your AnalyzeResponse schema
        return {
            "success": True,
            "message": "Analysis completed successfully.",
            "id": report.id,
            "eco_score": report.eco_score,
            "health_risk": report.health_risk,
            "environment_score": report.environment_score,
            "greenwashing_verdict": report.greenwashing_verdict,
            "hidden_chemicals": report.hidden_chemicals,
            "safe_alternatives": report.safe_alternatives,
            "confidence_score": report.confidence_score,
            "ai_summary": report.ai_summary
        }

    except Exception as e:
        logger.error(f"Pipeline processing failed: {str(e)}")
        # Safeguard file system from clogging on terminal execution drops
        delete_uploaded_file(image_path)
        return {
            "success": False,
            "message": f"Pipeline dropped connection: {str(e)}",
            "eco_score": 0,
            "health_risk": "Unknown",
            "environment_score": 0,
            "greenwashing_verdict": "Analysis Aborted",
            "hidden_chemicals": "",
            "safe_alternatives": "",
            "confidence_score": 0.0,
            "ai_summary": "System error encountered during data collection."
        }