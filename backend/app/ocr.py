import easyocr
import cv2
import os
import logging

logger = logging.getLogger("app.ocr")

# Singleton reader instance
_reader = None


def get_reader():
    """
    Lazy-loads the EasyOCR reader instance exactly once to maximize
    RAM efficiency and avoid cold-start degradation on subsequent requests.
    """
    global _reader
    if _reader is None:
        logger.info("Initializing EasyOCR Engine...")
        _reader = easyocr.Reader(
            ['en'],
            gpu=False  # Set to True if your deployment server has an NVIDIA CUDA card
        )
    return _reader


def preprocess_image(image_path):
    """
    Optimizes contrast and readability for real-world curved packaging labels
    without stripping deep textual gradient characteristics.
    """
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"OpenCV could not open or decode the image file at: {image_path}")

    # 1. Transition to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # 2. Apply Adaptive Histogram Equalization (CLAHE)
    # This maximizes contrast between text and background, countering glare and dynamic shadows
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced_gray = clahe.apply(gray)

    # Note: We omit hard Otsu thresholding here because EasyOCR's deep neural networks
    # preserve higher accuracy when handling continuous text edge gradients.
    return enhanced_gray


def extract_text(image_path: str) -> str:
    """
    Coordinates label preprocessing and extracts structured ingredient lists.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Target label file not found on disk: {image_path}")

    # Preprocess the file matrix safely
    processed_matrix = preprocess_image(image_path)

    # Call the singleton reader instance
    ocr_engine = get_reader()

    # Read layout strings
    result = ocr_engine.readtext(
        processed_matrix,
        detail=0,         # Returns flat strings instead of complex bounding boxes
        paragraph=True,   # Merges close text lines together—perfect for ingredient blocks
        contrast_ths=0.1, # Gives EasyOCR permission to try harder if the label contrast is low
        adjust_contrast=0.5
    )

    extracted_content = "\n".join(result).strip()
    
    if not extracted_content:
        logger.warning(f"OCR execution finished with zero parsed characters for file: {image_path}")
        
    return extracted_content