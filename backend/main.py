"""
SRM University ERP System - FastAPI Backend
Main Application Entry Point
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import HTTPBearer
import uvicorn
import logging

from app.api import auth, students, faculty, parking, attendance, fees, dashboard, notifications
from app.db.database import engine, Base
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="SRM University ERP System",
    description="Complete Enterprise Resource Planning System for SRM University with Vehicle Parking Management",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(faculty.router, prefix="/api/faculty", tags=["Faculty"])
app.include_router(parking.router, prefix="/api/parking", tags=["Vehicle Parking"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(fees.router, prefix="/api/fees", tags=["Fee Management"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])


@app.on_event("startup")
async def startup_event():
    logger.info("🚀 SRM ERP System starting up...")
    logger.info(f"📊 Environment: {settings.ENVIRONMENT}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("🛑 SRM ERP System shutting down...")


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "SRM University ERP System API",
        "version": "1.0.0",
        "status": "operational",
        "university": "SRM Institute of Science and Technology"
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "SRM ERP API",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1
    )
