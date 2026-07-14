import logging
import os

logger = logging.getLogger("app.ocr")


def extract_text(image_path: str) -> str:
    """
    TEMPORARY OCR BYPASS

    This function skips EasyOCR completely and returns
    dummy ingredients for testing the remaining pipeline.
    """

    logger.info("=" * 60)
    logger.info("OCR BYPASS ENABLED")
    logger.info(f"Image Path: {image_path}")

    if not os.path.exists(image_path):
        logger.error(f"Image not found: {image_path}")
        raise FileNotFoundError(
            f"Target label file not found on disk: {image_path}"
        )

    dummy_text = """
Water
Glycerin
Sodium Benzoate
Citric Acid
Fragrance
"""

    logger.info("Returning dummy OCR output:")
    logger.info(dummy_text)
    logger.info("=" * 60)

    return dummy_text
