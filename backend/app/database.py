import os
import logging
from urllib.parse import quote_plus
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, Integer, String, Text, Float
from sqlalchemy.orm import declarative_base, sessionmaker

# Setup logger
logger = logging.getLogger("app.database")
logging.basicConfig(level=logging.INFO)

# Load .env
load_dotenv()

# Database Config
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_USER = os.getenv("DB_USER", "root")
DB_NAME = os.getenv("DB_NAME", "eco_checker")
RAW_PASSWORD = os.getenv("DB_PASSWORD")

if not all([DB_USER, DB_NAME, RAW_PASSWORD]):
    raise RuntimeError("Database startup failed. Missing critical environment variables.")

DB_PASSWORD = quote_plus(RAW_PASSWORD)
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Engine & Base
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
Base = declarative_base()

# DATABASE MODEL
class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), nullable=True)
    product_name = Column(String(255), nullable=True)
    company_name = Column(String(255), nullable=True)
    image_path = Column(String(500), nullable=True)
    ocr_text = Column(Text, nullable=True)
    ingredients = Column(Text, nullable=True)
    
   
    eco_score = Column(Float, nullable=True)
    health_risk = Column(String(50), nullable=True)
    environmental_score = Column(Float, nullable=True)
    
    greenwashing_verdict = Column(Text, nullable=True)
    hidden_chemicals = Column(Text, nullable=True)
    safe_alternatives = Column(Text, nullable=True)
    confidence_score = Column(Float, nullable=True)
    ai_summary = Column(Text, nullable=True)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()