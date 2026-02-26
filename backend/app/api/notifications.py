"""Notifications API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, User, Notification
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).limit(20).all()
    return [{
        "id": str(n.id),
        "title": n.title,
        "message": n.message,
        "type": n.type,
        "is_read": n.is_read,
        "created_at": n.created_at
    } for n in notifications]

@router.put("/{notification_id}/read")
async def mark_read(notification_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    n = db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == current_user.id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"message": "Marked as read"}
