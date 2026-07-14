from typing import List

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
    status,
    Request,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.services import analyze_product_service, AnalysisError
from app.utils import allowed_image, save_uploaded_file
from app.models import AnalysisReport
from app.schemas import AnalysisReportOut, report_to_schema
from app.auth_utils import (
    verify_session_token,
    SESSION_COOKIE_NAME,
)

router = APIRouter(
    prefix="/api",
    tags=["Verdant AI"]
)


# -----------------------------
# Analyze Product
# -----------------------------
@router.post("/analyze", response_model=AnalysisReportOut, status_code=status.HTTP_201_CREATED)
async def analyze_product(
    username: str = Form(...),
    product_name: str = Form(...),
    company_name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not allowed_image(image.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    try:
        image_path = save_uploaded_file(image)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file upload safely: {str(e)}"
        )

    try:
        report_out = analyze_product_service(
            db=db,
            username=username,
            product_name=product_name,
            company_name=company_name,
            image_path=image_path
        )

        return report_out

    except AnalysisError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline failed mid-execution: {str(e)}"
        )


# -----------------------------
# User History
# -----------------------------
@router.get("/history", response_model=List[AnalysisReportOut])
def get_history(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not logged in."
        )

    user_id = verify_session_token(token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    # Get username from cookie/session
    from app.models import User

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )

    reports = (
        db.query(AnalysisReport)
        .filter(AnalysisReport.username == user.username)
        .order_by(AnalysisReport.created_at.desc())
        .all()
    )

    return [report_to_schema(r) for r in reports]


# -----------------------------
# Single Report
# -----------------------------
@router.get("/history/{report_id}", response_model=AnalysisReportOut)
def get_single_report(
    report_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not logged in."
        )

    user_id = verify_session_token(token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    from app.models import User

    user = db.query(User).filter(User.id == user_id).first()

    report = (
        db.query(AnalysisReport)
        .filter(
            AnalysisReport.id == report_id,
            AnalysisReport.username == user.username
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found."
        )

    return report_to_schema(report)


# -----------------------------
# Delete Report
# -----------------------------
@router.delete("/history/{report_id}")
def delete_report(
    report_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get(SESSION_COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not logged in."
        )

    user_id = verify_session_token(token)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session."
        )

    from app.models import User

    user = db.query(User).filter(User.id == user_id).first()

    report = (
        db.query(AnalysisReport)
        .filter(
            AnalysisReport.id == report_id,
            AnalysisReport.username == user.username
        )
        .first()
    )

    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found."
        )

    db.delete(report)
    db.commit()

    return {
        "success": True,
        "message": f"Record {report_id} deleted"
    }