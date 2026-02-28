"""Social Feed & Chat API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db, Post, UserStreak, User, ResidentialCollege, ChatRoom, Message
from datetime import datetime

router = APIRouter(prefix="/api/social", tags=["social"])

@router.get("/feed")
def get_feed(college_id: str = None, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(Post).order_by(Post.created_at.desc())
    if college_id:
        q = q.filter(Post.college_id == college_id)
    posts = q.limit(limit).all()
    result = []
    for p in posts:
        author = db.query(User).filter(User.id == p.author_id).first()
        college = db.query(ResidentialCollege).filter(ResidentialCollege.id == p.college_id).first() if p.college_id else None
        result.append({
            "id": str(p.id),
            "author_name": "Anonymous" if p.is_anonymous else (author.full_name if author else "Unknown"),
            "author_role": author.role if author and not p.is_anonymous else None,
            "author_avatar": author.avatar_url if author else None,
            "college_name": college.name if college else None,
            "college_color": college.color if college else None,
            "college_code": college.code if college else None,
            "post_type": p.post_type,
            "content": p.content,
            "likes_count": p.likes_count,
            "comments_count": p.comments_count,
            "is_pinned": p.is_pinned,
            "created_at": p.created_at.isoformat(),
        })
    return result

@router.get("/streaks/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    streaks = db.query(UserStreak).order_by(UserStreak.current_streak.desc()).limit(10).all()
    result = []
    for s in streaks:
        user = db.query(User).filter(User.id == s.user_id).first()
        college = db.query(ResidentialCollege).filter(ResidentialCollege.id == user.college_id).first() if user and user.college_id else None
        result.append({
            "user_name": user.full_name if user else "Unknown",
            "role": user.role if user else None,
            "college_name": college.name if college else None,
            "college_color": college.color if college else None,
            "current_streak": s.current_streak,
            "longest_streak": s.longest_streak,
            "total_posts": s.total_posts,
        })
    return result

@router.get("/colleges")
def get_colleges(db: Session = Depends(get_db)):
    colleges = db.query(ResidentialCollege).all()
    return [{"id": str(c.id), "name": c.name, "code": c.code,
             "color": c.color, "motto": c.motto, "warden_name": c.warden_name,
             "total_capacity": c.total_capacity, "current_strength": c.current_strength} for c in colleges]

@router.get("/messages/{room_id}")
def get_messages(room_id: str, db: Session = Depends(get_db)):
    msgs = db.query(Message).filter(
        Message.room_id == room_id, Message.is_deleted == False
    ).order_by(Message.created_at.desc()).limit(50).all()
    result = []
    for m in msgs:
        sender = db.query(User).filter(User.id == m.sender_id).first()
        result.append({
            "id": str(m.id), "content": m.content,
            "sender_name": sender.full_name if sender else "Unknown",
            "sender_role": sender.role if sender else None,
            "message_type": m.message_type,
            "created_at": m.created_at.isoformat()
        })
    return list(reversed(result))

@router.get("/rooms")
def get_chat_rooms(db: Session = Depends(get_db)):
    rooms = db.query(ChatRoom).filter(ChatRoom.is_active == True).all()
    result = []
    for r in rooms:
        college = db.query(ResidentialCollege).filter(ResidentialCollege.id == r.college_id).first() if r.college_id else None
        result.append({
            "id": str(r.id), "name": r.name, "room_type": r.room_type,
            "college_name": college.name if college else None,
            "college_color": college.color if college else None,
        })
    return result
