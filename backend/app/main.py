import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.firebase import init_firebase
from app.services.data_service import sync_seed_to_firestore

from app.api.workers import router as workers_router
from app.api.work import router as work_router
from app.api.evidence import router as evidence_router
from app.api.confirmations import router as confirmations_router
from app.api.passport import router as passport_router
from app.api.ai import router as ai_router
from app.api.auth import router as auth_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Evidence-backed professional identity for skilled trades."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists and mount static files
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

# Include Routers under /api
api_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_prefix)
app.include_router(workers_router, prefix=api_prefix)
app.include_router(work_router, prefix=api_prefix)
app.include_router(evidence_router, prefix=api_prefix)
app.include_router(confirmations_router, prefix=api_prefix)
app.include_router(passport_router, prefix=api_prefix)
app.include_router(ai_router, prefix=api_prefix)

@app.on_event("startup")
async def startup_event():
    init_firebase()
    sync_seed_to_firestore()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION
    }
