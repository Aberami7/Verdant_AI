import os
import cv2
import logging
import easyocr

logger = logging.getLogger("app.ocr")

# Singleton EasyOCR reader
_reader = None


def get_reader():
    """
    Lazy load EasyOCR model only once.
    """

    global _reader

    if _reader is None:
        try:
            logger.info("=" * 60)
            logger.info("Initializing EasyOCR Engine...")

            _reader = easyocr.Reader(
                ['en'],
                gpu=False
            )

            logger.info("EasyOCR initialized successfully.")
            logger.info("=" * 60)

        except Exception as e:
            logger.exception(
                f"EasyOCR initialization failed: {str(e)}"
            )
            raise

    return _reader



def preprocess_image(image_path):
    """
    Improve image quality before OCR.
    """

    image = cv2.imread(image_path)

    if image is None:
        raise ValueError(
            f"OpenCV cannot read image: {image_path}"
        )


    # Convert to grayscale
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )


    # Improve contrast
    clahe = cv2.createCLAHE(
        clipLimit=3.0,
        tileGridSize=(8,8)
    )

    enhanced = clahe.apply(gray)


    return enhanced



def extract_text(image_path: str) -> str:
    """
    Extract ingredient text using EasyOCR.
    """

    if not os.path.exists(image_path):
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )


    logger.info("=" * 60)
    logger.info("Starting EasyOCR")
    logger.info(f"Image Path: {image_path}")


    try:

        # Image preprocessing
        processed_image = preprocess_image(image_path)


        # Load OCR engine
        reader = get_reader()


        logger.info("Running OCR detection...")


        result = reader.readtext(
            processed_image,
            detail=0,
            paragraph=True,
            contrast_ths=0.1,
            adjust_contrast=0.5
        )


        extracted_text = "\n".join(result).strip()


        logger.info(
            f"OCR detected {len(result)} text blocks"
        )


        if not extracted_text:
            logger.warning(
                "No text detected from image"
            )


        logger.info("EasyOCR completed successfully")
        logger.info("=" * 60)


        return extracted_text


    except Exception as e:

        logger.exception(
            f"OCR processing failed: {str(e)}"
        )

        raise
