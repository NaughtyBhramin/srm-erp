"""Attendance API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, User
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_attendance(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"message": "Attendance records", "data": []}
