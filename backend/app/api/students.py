"""Students API"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db, Student, User, Department
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_students(
    search: Optional[str] = None,
    department_id: Optional[str] = None,
    year: Optional[int] = None,
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Student).join(User).join(Department)
    if search:
        query = query.filter(
            (User.full_name.ilike(f"%{search}%")) | 
            (Student.reg_number.ilike(f"%{search}%"))
        )
    if department_id:
        query = query.filter(Student.department_id == department_id)
    if year:
        query = query.filter(Student.year == year)
    
    students = query.limit(limit).all()
    return [{
        "id": str(s.id),
        "reg_number": s.reg_number,
        "full_name": s.user.full_name,
        "email": s.user.email,
        "department": s.department.name if s.department else None,
        "year": s.year,
        "semester": s.semester,
        "cgpa": float(s.cgpa) if s.cgpa else 0,
        "batch": s.batch
    } for s in students]

@router.get("/stats")
async def student_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total = db.query(Student).count()
    by_year = {}
    for y in range(1, 5):
        by_year[f"year_{y}"] = db.query(Student).filter(Student.year == y).count()
    return {"total_students": total, "by_year": by_year}
