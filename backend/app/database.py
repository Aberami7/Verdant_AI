import os
import logging
from urllib.parse import quote_plus
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Setup logger
logger = logging.getLogger("app.database")
logging.basicConfig(level=logging.INFO)

# Load .env
load_dotenv()

# Database Config
# Cloud MySQL providers (AWS RDS, PlanetScale, etc.) give you a single connection
# string — set DATABASE_URL and everything below is skipped.
# Example: mysql+pymysql://user:pass@your-db.abcdefg.us-east-1.rds.amazonaws.com:3306/verdant_ai
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fallback: build the URL from individual pieces (useful for local dev)
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_NAME = os.getenv("DB_NAME", "verdant_ai")
    RAW_PASSWORD = os.getenv("DB_PASSWORD")

    if not all([DB_USER, DB_NAME, RAW_PASSWORD]):
        raise RuntimeError(
            "Database startup failed. Set either DATABASE_URL (e.g. AWS RDS MySQL) "
            "or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME (local MySQL)."
        )

    DB_PASSWORD = quote_plus(RAW_PASSWORD)
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Cloud MySQL providers (Aiven, AWS RDS, PlanetScale, etc.) require SSL/TLS.
# Set DB_SSL=true to enable it. If you have a CA certificate (Aiven gives you
# one to download from the console), set DB_SSL_CA_PATH to its file path for
# full certificate verification; otherwise SSL is still enforced, just without
# verifying the server's certificate chain.
FORCE_SSL = os.getenv("DB_SSL", "").lower() == "true"
connect_args = {}
if FORCE_SSL:
    ca_path = os.getenv("DB_SSL_CA_PATH")
    if ca_path and os.path.exists(ca_path):
        connect_args = {"ssl": {"ca": ca_path}}
    else:
        connect_args = {"ssl": {}}  # still enforces TLS via PyMySQL, no CA verification

# Engine & Base
engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=3600, connect_args=connect_args)
Base = declarative_base()

# NOTE: the AnalysisReport model itself lives in app/models.py (single source of
# truth). It used to be duplicated here too, which is what caused SQLAlchemy's
# "Table already defined" issue that __table_args__ = {'extend_existing': True}
# was papering over. Keeping the model in exactly one place fixes that at the root.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
