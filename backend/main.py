import os
import logging
import traceback

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from app.database import Base, engine
from app.models import AnalysisReport, User  # noqa: F401
from app.routes import router
from app.auth_routes import router as auth_router
from app.utils import create_upload_folder

# ----------------------------------------------------------------------
# LOGGING CONFIGURATION
# ----------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

logger = logging.getLogger("verdant.main")

logger.info("=" * 70)
logger.info("Starting Verdant AI Backend")
logger.info("=" * 70)

logger.info("Creating database tables...")
Base.metadata.create_all(bind=engine)
logger.info("Database ready.")

logger.info("Creating uploads directory if missing...")
create_upload_folder()
logger.info("Uploads directory ready.")

app = FastAPI(title="Verdant AI Backend")

logger.info("Configuring CORS middleware...")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://localhost:3000"
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("CORS configured.")


# ----------------------------------------------------------------------
# HTTP EXCEPTION HANDLER
# ----------------------------------------------------------------------
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(
        f"HTTPException | {request.method} {request.url.path} | "
        f"Status={exc.status_code} | Detail={exc.detail}"
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail
        }
    )


# ----------------------------------------------------------------------
# GLOBAL EXCEPTION HANDLER
# ----------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("=" * 70)
    logger.error("UNHANDLED EXCEPTION DETECTED")
    logger.error(f"Request : {request.method} {request.url}")
    logger.error(f"Exception Type : {type(exc).__name__}")
    logger.error(f"Exception : {str(exc)}")
    logger.error("Full Traceback:")
    logger.error(traceback.format_exc())
    logger.error("=" * 70)

    return JSONResponse(
        status_code=500,
        content={
            "error": str(exc)
        }
    )


# ----------------------------------------------------------------------
# STATIC FILES
# ----------------------------------------------------------------------
logger.info("Mounting uploads directory...")

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

if os.path.exists("dist/assets"):
    logger.info("Mounting React assets...")
    app.mount(
        "/assets",
        StaticFiles(directory="dist/assets"),
        name="assets"
    )
else:
    logger.warning("dist/assets not found. Running backend-only mode.")


# ----------------------------------------------------------------------
# ROUTERS
# ----------------------------------------------------------------------
logger.info("Registering API routers...")

app.include_router(router)
app.include_router(auth_router)

logger.info("Routers registered successfully.")


# ----------------------------------------------------------------------
# HEALTH CHECK
# ----------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    logger.info("Health endpoint called.")
    return {"status": "healthy"}


# ----------------------------------------------------------------------
# SERVE REACT FRONTEND
# ----------------------------------------------------------------------
@app.get("/{full_path:path}")
async def serve_react(full_path: str):

    logger.info(f"Frontend request: /{full_path}")

    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")

    logger.warning("React build not found.")

    return {
        "status": "healthy",
        "message": "Frontend not found here (running backend-only). Point your Vite dev server's /api proxy at this service."
    }


logger.info("=" * 70)
logger.info("Verdant AI Backend started successfully.")
logger.info("=" * 70)
