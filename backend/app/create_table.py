from app.database import Base, engine
from app.models import AnalysisReport

print("Creating tables...")

Base.metadata.create_all(bind=engine)

print("Done!")