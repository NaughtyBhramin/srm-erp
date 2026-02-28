"""Residential Colleges API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, ResidentialCollege, Student, Faculty, User

router = APIRouter(prefix="/api/colleges", tags=["colleges"])

@router.get("/")
def get_all(db: Session = Depends(get_db)):
    colleges = db.query(ResidentialCollege).all()
    result = []
    for c in colleges:
        student_count = db.query(Student).filter(Student.college_id == c.id).count()
        faculty_count = db.query(Faculty).filter(Faculty.college_id == c.id).count()
        result.append({
            "id": str(c.id), "name": c.name, "code": c.code,
            "color": c.color, "motto": c.motto, "warden_name": c.warden_name,
            "total_capacity": c.total_capacity, "current_strength": student_count,
            "faculty_count": faculty_count,
        })
    return result

@router.get("/{college_id}/members")
def get_members(college_id: str, db: Session = Depends(get_db)):
    students = db.query(Student).filter(Student.college_id == college_id).limit(20).all()
    result = []
    for s in students:
        user = db.query(User).filter(User.id == s.user_id).first()
        result.append({
            "id": str(s.id), "name": user.full_name if user else "Unknown",
            "reg_number": s.reg_number, "year": s.year, "role": "student"
        })
    return result
