"""Hostel Management API"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db, HostelBlock, HostelRoom, HostelAllocation, ResidentialCollege
from typing import List
import uuid

router = APIRouter(prefix="/api/hostel", tags=["hostel"])

@router.get("/blocks")
def get_blocks(db: Session = Depends(get_db)):
    blocks = db.query(HostelBlock).all()
    result = []
    for b in blocks:
        rooms = db.query(HostelRoom).filter(HostelRoom.block_id == b.id).all()
        available = sum(1 for r in rooms if r.is_available)
        result.append({
            "id": str(b.id), "name": b.name, "block_code": b.block_code,
            "gender": b.gender, "total_rooms": b.total_rooms,
            "available_rooms": available, "occupied_rooms": b.total_rooms - available,
            "occupancy_pct": round((b.total_rooms - available) / max(b.total_rooms, 1) * 100, 1)
        })
    return result

@router.get("/rooms/{block_id}")
def get_rooms(block_id: str, db: Session = Depends(get_db)):
    rooms = db.query(HostelRoom).filter(HostelRoom.block_id == block_id).all()
    return [{"id": str(r.id), "room_number": r.room_number, "floor": r.floor,
             "capacity": r.capacity, "current_occupancy": r.current_occupancy,
             "room_type": r.room_type, "monthly_rent": float(r.monthly_rent),
             "is_available": r.is_available} for r in rooms]

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    blocks = db.query(HostelBlock).all()
    rooms = db.query(HostelRoom).all()
    return {
        "total_blocks": len(blocks),
        "total_rooms": len(rooms),
        "available_rooms": sum(1 for r in rooms if r.is_available),
        "occupied_rooms": sum(1 for r in rooms if not r.is_available),
        "occupancy_pct": round(sum(1 for r in rooms if not r.is_available) / max(len(rooms),1) * 100, 1)
    }

@router.get("/my-room/{student_id}")
def get_my_room(student_id: str, db: Session = Depends(get_db)):
    alloc = db.query(HostelAllocation).filter(
        HostelAllocation.student_id == student_id,
        HostelAllocation.status == 'active'
    ).first()
    if not alloc:
        return {"allocated": False}
    room = db.query(HostelRoom).filter(HostelRoom.id == alloc.room_id).first()
    block = db.query(HostelBlock).filter(HostelBlock.id == room.block_id).first() if room else None
    return {
        "allocated": True,
        "room_number": room.room_number if room else None,
        "block": block.name if block else None,
        "floor": room.floor if room else None,
        "room_type": room.room_type if room else None,
        "monthly_rent": float(room.monthly_rent) if room else 0,
        "allocated_from": str(alloc.allocated_from),
        "allocated_until": str(alloc.allocated_until) if alloc.allocated_until else None,
    }
