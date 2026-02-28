"""Accounts v2 — Fees, Salary, Payroll"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, FeePayment, SalaryPayment, Student, Faculty, User

router = APIRouter(prefix="/api/accounts", tags=["accounts"])

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_fees = db.query(FeePayment).count()
    paid_fees = db.query(FeePayment).filter(FeePayment.status == 'paid').count()
    pending_fees = db.query(FeePayment).filter(FeePayment.status == 'pending').count()
    return {
        "total_fee_records": total_fees, "fees_collected": paid_fees,
        "fees_pending": pending_fees, "overdue": 0,
        "total_revenue_cr": 128.4, "collected_cr": 94.2,
        "outstanding_cr": 12.8, "operating_cost_cr": 82.1,
        "salary_paid_this_month": 0
    }

@router.get("/fees")
def get_fees(db: Session = Depends(get_db)):
    payments = db.query(FeePayment).order_by(FeePayment.created_at.desc()).limit(50).all()
    result = []
    for p in payments:
        student = db.query(Student).filter(Student.id == p.student_id).first()
        user = db.query(User).filter(User.id == student.user_id).first() if student else None
        result.append({
            "id": str(p.id), "student_name": user.full_name if user else "Unknown",
            "reg_number": student.reg_number if student else None,
            "amount": float(p.amount), "status": p.status,
            "payment_mode": p.payment_mode, "transaction_id": p.transaction_id,
            "due_date": str(p.due_date) if p.due_date else None,
            "paid_at": p.paid_at.isoformat() if p.paid_at else None,
        })
    return result

@router.get("/salary")
def get_salary(db: Session = Depends(get_db)):
    salaries = db.query(SalaryPayment).order_by(SalaryPayment.created_at.desc()).limit(50).all()
    result = []
    for s in salaries:
        faculty = db.query(Faculty).filter(Faculty.id == s.faculty_id).first()
        user = db.query(User).filter(User.id == faculty.user_id).first() if faculty else None
        result.append({
            "id": str(s.id), "faculty_name": user.full_name if user else "Unknown",
            "employee_id": faculty.employee_id if faculty else None,
            "month": s.month, "basic": float(s.basic_salary),
            "allowances": float(s.allowances), "deductions": float(s.deductions),
            "status": s.status,
        })
    return result
