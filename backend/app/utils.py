import uuid
from pathlib import Path
import shutil

# Using Path objects makes cross-platform path handling much safer
UPLOAD_FOLDER = Path("uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}


def create_upload_folder():
    """Creates the upload directory if it doesn't exist."""
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)


def allowed_image(filename: str) -> bool:
    """Checks if the file extension is inside the allowed whitelist."""
    if not filename or "." not in filename:
        return False

    # Path.suffix extracts '.jpg' or '.png', lower()[1:] drops the dot
    extension = Path(filename).suffix.lower()[1:]
    return extension in ALLOWED_EXTENSIONS


def save_uploaded_file(file) -> str:
    """
    Saves an uploaded file stream using a secure, unique UUID name.
    Compatible with FastAPI's UploadFile object.
    Returns a path like "uploads/<uuid>.jpg" (used both for OCR and for the
    /uploads static mount so the frontend can render it back).
    """
    create_upload_folder()

    if not file.filename or not allowed_image(file.filename):
        raise ValueError("Invalid file type. Only images are allowed.")

    extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_FOLDER / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


def delete_uploaded_file(file_path: str):
    """Safely removes a file from the server without crashing if it doesn't exist.
    Only used on the failure path now (e.g. OCR found no text) — successful
    analyses keep the image so the frontend's history detail panel can display it."""
    if not file_path:
        return

    try:
        Path(file_path).unlink(missing_ok=True)
    except Exception as e:
        print(f"Logging: Failed to delete file at {file_path}. Reason: {e}")
