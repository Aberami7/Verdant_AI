import json
import logging
from sqlalchemy.orm import Session

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
    Image Upload ──> OCR (Bypassed for Testing) ──> LangGraph LLM Safety Analysis ──> Database Sync

    Returns an AnalysisReportOut on success.
    """

    logger.info("=" * 60)
    logger.info("OCR BYPASS ENABLED")
    logger.info(f"Image Path: {image_path}")

    # ------------------------------------------------------------------
    # OCR BYPASS (TESTING ONLY)
    # ------------------------------------------------------------------
    ingredients_raw = """
    Water,
    Glycerin,
    Sodium Benzoate,
    Citric Acid,
    Fragrance
    """

    logger.info(f"Dummy Ingredients:\n{ingredients_raw}")

    if not ingredients_raw or not ingredients_raw.strip():
        delete_uploaded_file(image_path)
        raise AnalysisError(
            "No text detected from image labels. Ensure good lighting and crisp text focus."
        )

    # ------------------------------------------------------------------
    # AI ANALYSIS
    # ------------------------------------------------------------------
    logger.info("Starting AI Analysis...")

    result = analyze_ingredients(
        product_name=product_name,
        company_name=company_name,
        ingredients=ingredients_raw
    )

    logger.info("AI Analysis Completed")

    # ------------------------------------------------------------------
    # DATABASE SAVE
    # ------------------------------------------------------------------
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
        logger.info("Saving report to database...")

        db.add(report)
        db.commit()
        db.refresh(report)

        logger.info("Database save successful.")

    except Exception as db_err:
        db.rollback()
        logger.exception("Database save failed.")
        delete_uploaded_file(image_path)

        raise AnalysisError(
            f"Failed to save analysis: {str(db_err)}"
        )

    logger.info("Analysis completed successfully.")
    logger.info("=" * 60)

    return report_to_schema(report)
