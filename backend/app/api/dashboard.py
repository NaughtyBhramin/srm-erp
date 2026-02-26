"""Dashboard API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date
from app.db.database import get_db, User, Student, Faculty, Vehicle, ParkingSession, ParkingZone
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_students = db.query(Student).count()
    total_faculty = db.query(Faculty).count()
    total_vehicles = db.query(Vehicle).filter(Vehicle.is_active == True).count()
    active_parking = db.query(ParkingSession).filter(ParkingSession.status == "active").count()
    total_slots = db.query(func.sum(ParkingZone.total_slots)).scalar() or 0
    available_slots = db.query(func.sum(ParkingZone.available_slots)).scalar() or 0
    
    return {
        "total_students": total_students,
        "total_faculty": total_faculty,
        "total_vehicles": total_vehicles,
        "active_parking_sessions": active_parking,
        "total_parking_slots": int(total_slots),
        "available_parking_slots": int(available_slots),
        "parking_occupancy": round(((total_slots - available_slots) / total_slots * 100) if total_slots > 0 else 0, 1),
        "today": str(date.today()),
    }
