import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from app.database import Base, engine
from app.models import AnalysisReport, User  # noqa: F401 — ensures models are registered on Base
from app.routes import router
from app.auth_routes import router as auth_router
from app.utils import create_upload_folder

# Create database tables if they don't already exist
Base.metadata.create_all(bind=engine)

# Make sure the local uploads folder exists before we try to serve/write to it
create_upload_folder()

app = FastAPI(title="Verdant AI Backend")

app.add_middleware(
    CORSMiddleware,
    # Wildcard ("*") origins are rejected by browsers when allow_credentials=True
    # (required for the auth session cookie to work), so use an explicit list.
    # Set FRONTEND_ORIGINS as a comma-separated env var in production.
    allow_origins=os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """
    FastAPI's default error body is {"detail": "..."}. The frontend's
    safeFetchJson() (src/lib/api.ts) looks for {"error": "..."} or
    {"message": "..."} — without this, every backend error would fall back to
    a generic "HTTP error! Status: xxx" instead of showing the real message.
    Fixed here (backend) rather than touching the frontend file.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail},
    )

# Serve uploaded ingredient-panel images so the frontend's
# <img src={report.image_path} /> (e.g. "/uploads/xxx.jpg") resolves correctly.
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Serve built React assets if present (populated by a Docker/CI build step
# that copies the frontend's `dist/` folder next to this backend).
if os.path.exists("dist/assets"):
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

# All /api/* routes (analyze, history, history/{id})
app.include_router(router)

# All /api/auth/* routes (signup, login, logout)
app.include_router(auth_router)


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


# ----------------------------------------------------------------------
# SERVE REACT FRONTEND (catch-all, must be defined LAST so it never
# shadows /api/*, /uploads/*, or /assets/*)
# ----------------------------------------------------------------------
@app.get("/{full_path:path}")
async def serve_react(full_path: str):
    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")
    return {
        "status": "healthy",
        "message": "Frontend not found here (running backend-only). Point your Vite dev server's /api proxy at this service."
    }
