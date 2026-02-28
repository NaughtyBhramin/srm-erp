"""
SRM ERP v2 — Main Application
Role-based: Admin, Student, Faculty, Accounts, Security, Transport, Medical, Parent
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.api import auth, students, faculty, parking, dashboard, notifications
from app.api.hostel import router as hostel_router
from app.api.medical import router as medical_router
from app.api.social import router as social_router
from app.api.colleges import router as colleges_router
from app.api.transport_v2 import router as transport_router
from app.api.accounts_v2 import router as accounts_router

app = FastAPI(
    title="SRM ERP API v2",
    description="Campus Intelligence Platform — Role-Based ERP",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"]
)

# Core routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(faculty.router)
app.include_router(parking.router)
app.include_router(dashboard.router)
app.include_router(notifications.router)

# New v2 routers
app.include_router(hostel_router)
app.include_router(medical_router)
app.include_router(social_router)
app.include_router(colleges_router)
app.include_router(transport_router)
app.include_router(accounts_router)

@app.get("/")
def root():
    return {"status": "online", "version": "2.0.0", "platform": "SRM ERP Campus Intelligence"}

@app.get("/health")
def health():
    return {"status": "healthy"}
