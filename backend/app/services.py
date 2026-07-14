import json
import logging
from sqlalchemy.orm import Session

from app.ocr import extract_text
from app.agent import analyze_ingredients
from app.models import AnalysisReport
from app.utils import delete_uploaded_file
from app.schemas import report_to_schema

logger = logging.getLogger("app.services")


class AnalysisError(Exception):
    """Raised when the pipeline cannot produce a valid analysis (e.g. empty OCR)."""


def analyze_product_service(
    db: Session,
    username: str,
    product_name: str,
    company_name: str,
    image_path: str
):
    """
    Complete orchestrated workflow:
    Image Upload ──> Adaptive OCR ──> LangGraph LLM Safety Analysis ──> Database Sync

    Returns an AnalysisReportOut (matching the frontend's AnalysisReport type) on
    success. Raises AnalysisError on failure so the router can turn it into a
    proper HTTP error response.
    """
    # 1. Run Text Extraction
    ingredients_raw = extract_text(image_path)

    if not ingredients_raw or not ingredients_raw.strip():
        delete_uploaded_file(image_path)
        raise AnalysisError(
            "No text detected from image labels. Ensure good lighting and crisp text focus."
        )

    # 2. Run LangGraph Multi-Agent Safety Analysis
    result = analyze_ingredients(
        product_name=product_name,
        company_name=company_name,
        ingredients=ingredients_raw
    )

    # 3. Create DB Record (lists/objects stored as JSON text columns)
    report = AnalysisReport(
        username=username,
        product_name=product_name,
        company_name=company_name,
        image_path=image_path,
        ingredients_raw=ingredients_raw,
        ingredients_list=json.dumps(result.get("ingredients_list", [])),
        ingredients_details=json.dumps(result.get("ingredients_details", [])),
        safety_score=float(result.get("safety_score", 0.0)),
        safety_level=result.get("safety_level", "Hazardous"),
        allergens=json.dumps(result.get("allergens", [])),
        summary=result.get("summary", ""),
        recommendations=json.dumps(result.get("recommendations", [])),
    )

    try:
        db.add(report)
        db.commit()
        db.refresh(report)
    except Exception as db_err:
        db.rollback()
        logger.error(f"Database write barrier hit: {str(db_err)}")
        delete_uploaded_file(image_path)
        raise AnalysisError(f"Failed to save analysis: {str(db_err)}")

    # Note: image is intentionally KEPT on disk (not deleted) — the frontend's
    # History detail panel renders it via <img src={report.image_path}>.
    return report_to_schema(report)
