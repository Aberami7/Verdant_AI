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
    """
    create_upload_folder()

    if not file.filename or not allowed_image(file.filename):
        raise ValueError("Invalid file type. Only images are allowed.")

    # Generate a completely random filename keeping the original extension
    extension = Path(file.filename).suffix.lower()
    unique_filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_FOLDER / unique_filename

    # Stream file copy to prevent high RAM consumption on large files
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(file_path)


def delete_uploaded_file(file_path: str):
    """Safely removes a file from the server without crashing if it doesn't exist."""
    if not file_path:
        return
        
    try:
        # missing_ok=True prevents errors if the file was already deleted
        Path(file_path).unlink(missing_ok=True)
    except Exception as e:
        print(f"Logging: Failed to delete file at {file_path}. Reason: {e}")