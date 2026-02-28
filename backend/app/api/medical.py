"""Medical Room API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, MedicalVisit, MedicalRecord, MedicineInventory, User
from datetime import datetime, date

router = APIRouter(prefix="/api/medical", tags=["medical"])

@router.get("/visits")
def get_visits(db: Session = Depends(get_db)):
    visits = db.query(MedicalVisit).order_by(MedicalVisit.visit_date.desc()).limit(50).all()
    result = []
    for v in visits:
        patient = db.query(User).filter(User.id == v.patient_id).first()
        result.append({
            "id": str(v.id),
            "patient_name": patient.full_name if patient else "Unknown",
            "visit_type": v.visit_type,
            "symptoms": v.symptoms,
            "diagnosis": v.diagnosis,
            "prescription": v.prescription,
            "visit_date": v.visit_date.isoformat() if v.visit_date else None,
            "follow_up_date": str(v.follow_up_date) if v.follow_up_date else None,
        })
    return result

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    today = date.today()
    total = db.query(MedicalVisit).count()
    today_visits = db.query(MedicalVisit).filter(
        MedicalVisit.visit_date >= datetime.combine(today, datetime.min.time())
    ).count()
    inventory = db.query(MedicineInventory).all()
    low_stock = [m for m in inventory if m.stock_quantity <= m.reorder_level]
    return {
        "total_visits": total, "today_visits": today_visits,
        "total_medicines": len(inventory), "low_stock_count": len(low_stock),
        "emergency_today": 0
    }

@router.get("/inventory")
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(MedicineInventory).all()
    return [{"id": str(i.id), "name": i.name, "category": i.category,
             "stock": i.stock_quantity, "unit": i.unit,
             "expiry": str(i.expiry_date) if i.expiry_date else None,
             "low_stock": i.stock_quantity <= i.reorder_level} for i in items]

@router.get("/records/{user_id}")
def get_record(user_id: str, db: Session = Depends(get_db)):
    rec = db.query(MedicalRecord).filter(MedicalRecord.user_id == user_id).first()
    if not rec:
        return {"found": False}
    return {"found": True, "blood_group": rec.blood_group,
            "emergency_contact": rec.emergency_contact, "insurance_number": rec.insurance_number}
