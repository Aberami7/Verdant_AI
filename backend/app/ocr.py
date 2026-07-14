import os
import cv2
import logging
import easyocr

logger = logging.getLogger("app.ocr")


# Singleton EasyOCR model
_reader = None


def get_reader():
    """
    Load EasyOCR model only once.
    """

    global _reader

    if _reader is None:

        try:
            logger.info("=" * 60)
            logger.info("Initializing EasyOCR Engine...")

            _reader = easyocr.Reader(
                ['en'],
                gpu=False,
                verbose=False
            )

            logger.info("EasyOCR initialized successfully.")
            logger.info("=" * 60)

        except Exception as e:
            logger.exception(
                f"EasyOCR initialization failed: {str(e)}"
            )
            raise

    return _reader



def preprocess_image(image_path: str):
    """
    Resize and improve image quality
    before OCR processing.
    """

    image = cv2.imread(image_path)


    if image is None:
        raise ValueError(
            f"Cannot open image: {image_path}"
        )


    # Convert to grayscale
    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )


    # Resize large images to reduce OCR time
    height, width = gray.shape

    if width > 1200:

        scale = 1200 / width

        gray = cv2.resize(
            gray,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_AREA
        )


    # Improve contrast
    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
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
    logger.info("OCR Started")
    logger.info(f"Image: {image_path}")


    try:

        # Preprocess image
        processed_image = preprocess_image(
            image_path
        )


        # Load EasyOCR
        reader = get_reader()


        logger.info("Before readtext")


        # Lightweight OCR configuration
        result = reader.readtext(
            processed_image,
            detail=0,
            paragraph=False
        )


        logger.info("After readtext")


        extracted_text = "\n".join(
            result
        ).strip()


        logger.info(
            f"Detected text blocks: {len(result)}"
        )


        if not extracted_text:

            logger.warning(
                "No text detected from image"
            )


        logger.info(
            "OCR completed successfully"
        )

        logger.info("=" * 60)


        return extracted_text



    except Exception as e:

        logger.exception(
            f"OCR failed: {str(e)}"
        )

        raise
