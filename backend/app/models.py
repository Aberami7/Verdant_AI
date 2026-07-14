from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.database import Base
import datetime


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), nullable=False)
    product_name = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False)
    image_path = Column(String(500), nullable=True)

    # Raw OCR text plus a cleaned, structured ingredient breakdown.
    ingredients_raw = Column(Text, nullable=False)
    ingredients_list = Column(Text, nullable=False)       # JSON-encoded list[str]
    ingredients_details = Column(Text, nullable=False)    # JSON-encoded list[IngredientDetail]

    safety_score = Column(Float, nullable=False)          # 0-100
    safety_level = Column(String(20), nullable=False)     # Safe | Moderate | Hazardous
    allergens = Column(Text, nullable=False)              # JSON-encoded list[str]
    summary = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)        # JSON-encoded list[str]

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
