import os
import cv2
import logging
from paddleocr import PaddleOCR

logger = logging.getLogger("app.ocr")

# Singleton PaddleOCR instance
_reader = None


def get_reader():
    """
    Lazy-load PaddleOCR only once.
    """
    global _reader

    if _reader is None:
        logger.info("=" * 60)
        logger.info("Initializing PaddleOCR Engine...")

        _reader = PaddleOCR(
            lang="en",
            use_doc_orientation_classify=False,
            use_doc_unwarping=False,
            use_textline_orientation=False
        )

        logger.info("PaddleOCR initialized successfully.")
        logger.info("=" * 60)

    return _reader


def preprocess_image(image_path):
    """
    Improve contrast for better OCR accuracy.
    """
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"OpenCV could not open image: {image_path}"
        )

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    clahe = cv2.createCLAHE(
        clipLimit=3.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    return enhanced


def extract_text(image_path: str) -> str:
    """
    Extract ingredient text using PaddleOCR.
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    logger.info("=" * 60)
    logger.info("Starting OCR...")
    logger.info(f"Image: {image_path}")

    processed = preprocess_image(image_path)

    temp_path = image_path + "_processed.jpg"

    cv2.imwrite(temp_path, processed)

    try:

        reader = get_reader()

        result = reader.predict(temp_path)

        extracted_lines = []

        for page in result:

            texts = page.get("rec_texts", [])

            for text in texts:
                if text.strip():
                    extracted_lines.append(text.strip())

        extracted_content = "\n".join(extracted_lines)

        logger.info(f"Detected {len(extracted_lines)} text lines.")

        if not extracted_content.strip():
            logger.warning("No text detected.")

        logger.info("OCR completed successfully.")
        logger.info("=" * 60)

        return extracted_content

    finally:

        if os.path.exists(temp_path):
            os.remove(temp_path)
