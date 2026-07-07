import os
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services import analyze_product_service
from app.utils import allowed_image
from app.models import AnalysisReport

router = APIRouter(
    prefix="/api",
    tags=["Eco Checker"]
)


@router.post("/analyze", status_code=status.HTTP_201_CREATED)
async def analyze_product(
    username: str = Form(...),
    product_name: str = Form(...),
    company_name: str = Form(""),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Early validation check
    if not allowed_image(image.filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    image_path = None
    try:
        # 2. Async file save to keep the event loop non-blocking
        UPLOAD_DIR = "uploads"
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        image_path = os.path.join(UPLOAD_DIR, f"{username}_{image.filename}")
        
        contents = await image.read()
        with open(image_path, "wb") as f:
            f.write(contents)
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process file upload safely: {str(e)}"
        )

    # 3. Process the ingredients via service wrapper safely
    try:
        result = analyze_product_service(
            db=db,
            username=username,
            product_name=product_name,
            company_name=company_name,
            image_path=image_path
        )
        return result
        
    except Exception as e:
        # Cleanup temporary image file if processing completely falls over
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline failed mid-execution: {str(e)}"
        )


@router.get("/history")
def get_history(
    username: str,  # Filter histories to keep user profiles clean
    limit: int = 20, # Avoid unbounded massive loads
    skip: int = 0,
    db: Session = Depends(get_db)
):
    reports = (
        db.query(AnalysisReport)
        .filter(AnalysisReport.username == username)
        .order_by(AnalysisReport.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return reports


@router.get("/history/{report_id}")
def get_single_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(AnalysisReport)
        .filter(AnalysisReport.id == report_id)
        .first()
    )
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found."
        )
    return report


@router.delete("/history/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db)
):
    report = (
        db.query(AnalysisReport)
        .filter(AnalysisReport.id == report_id)
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
        "message": "Report deleted successfully."
    }