import json
from typing import List, Literal, Optional
from pydantic import BaseModel

SafetyLevel = Literal["Safe", "Moderate", "Hazardous"]


class IngredientDetail(BaseModel):
    name: str
    safety: SafetyLevel
    description: str
    category: str


class AnalysisReportOut(BaseModel):
    """Mirrors src/types.ts `AnalysisReport` field-for-field. Do not rename fields —
    the frontend is not being changed, so this contract is the source of truth."""
    id: str
    username: str
    product_name: str
    company_name: str
    image_path: Optional[str] = None
    ingredients_raw: str
    ingredients_list: List[str]
    safety_score: float
    safety_level: SafetyLevel
    allergens: List[str]
    ingredients_details: List[IngredientDetail]
    summary: str
    recommendations: List[str]
    created_at: str


def report_to_schema(report) -> AnalysisReportOut:
    """Converts a SQLAlchemy AnalysisReport row (with JSON-text columns) into the
    exact shape the frontend expects."""
    image_path = report.image_path
    if image_path and not image_path.startswith("/") and not image_path.startswith("http"):
        image_path = "/" + image_path.replace("\\", "/")

    return AnalysisReportOut(
        id=str(report.id),
        username=report.username,
        product_name=report.product_name,
        company_name=report.company_name,
        image_path=image_path,
        ingredients_raw=report.ingredients_raw,
        ingredients_list=json.loads(report.ingredients_list),
        safety_score=report.safety_score,
        safety_level=report.safety_level,
        allergens=json.loads(report.allergens),
        ingredients_details=[
            IngredientDetail(**d) for d in json.loads(report.ingredients_details)
        ],
        summary=report.summary,
        recommendations=json.loads(report.recommendations),
        created_at=report.created_at.isoformat() if report.created_at else "",
    )


class ErrorResponse(BaseModel):
    error: str


class SignupRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    identifier: str  # username or email
    password: str


class UserOut(BaseModel):
    username: str
    email: str
    token: Optional[str] = None


class AuthResponse(BaseModel):
    user: UserOut
    token: str
    error: Optional[str] = None
