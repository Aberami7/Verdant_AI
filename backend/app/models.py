from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from app.database import Base
import datetime

class AnalysisReport(Base):
    __tablename__ = 'analysis_reports'
    
    # Prevents "Table already defined" errors
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100))
    product_name = Column(String(255))
    company_name = Column(String(255))
    image_path = Column(String(255))
    ocr_text = Column(Text)
    ingredients = Column(Text)
    eco_score = Column(Float)
    health_risk = Column(Text)
    environmental_score = Column(Float)
    greenwashing_verdict = Column(Text)
    hidden_chemicals = Column(Text)
    safe_alternatives = Column(Text)
    confidence_score = Column(Float)
    ai_summary = Column(Text)
    analysis_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)