"""Faculty API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, Faculty, User
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_faculty(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    faculty_list = db.query(Faculty).join(User).all()
    return [{
        "id": str(f.id),
        "employee_id": f.employee_id,
        "full_name": f.user.full_name,
        "email": f.user.email,
        "designation": f.designation,
        "specialization": f.specialization,
    } for f in faculty_list]
