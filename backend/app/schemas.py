from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AnalyzeRequest(BaseModel):
    username: str = Field(..., description="The user submitting the request")
    product_name: str = Field(..., description="The brand name of the product")
    company_name: Optional[str] = Field(None, description="The manufacturing brand or parent company")


class AnalyzeResponse(BaseModel):
    success: bool
    message: str
    eco_score: int = Field(..., description="Overall eco rating on a 1-10 scale")
    health_risk: str
    environment_score: int = Field(..., description="Environmental footprint rating on a 1-10 scale")
    greenwashing_verdict: str
    hidden_chemicals: str
    safe_alternatives: str
    confidence_score: float
    ai_summary: str

    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    id: int
    username: str
    product_name: str
    company_name: Optional[str]
    eco_score: int
    health_risk: str
    environment_score: int
    greenwashing_verdict: str
    # Typed as datetime so Pydantic handles standard database timestamp objects natively
    created_at: datetime 

    class Config:
        # Allows Pydantic to read ORM models directly (e.g., history_item.product_name)
        from_attributes = True


class DeleteResponse(BaseModel):
    success: bool
    message: str