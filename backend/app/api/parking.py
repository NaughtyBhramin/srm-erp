"""
Vehicle Parking System API
Handles all parking-related operations for SRM University
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
import uuid
import random
import string

from app.db.database import (
    get_db, ParkingZone, ParkingSlot, Vehicle, ParkingPermit,
    ParkingSession, ParkingViolation, User
)
from app.api.auth import get_current_user

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────

class VehicleCreate(BaseModel):
    vehicle_number: str
    vehicle_type: str
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    vehicle_color: Optional[str] = None
    registration_year: Optional[int] = None

class PermitCreate(BaseModel):
    vehicle_id: str
    zone_id: str
    permit_type: str
    valid_from: date
    valid_until: date
    amount_paid: float = 0
    payment_reference: Optional[str] = None

class EntryRequest(BaseModel):
    vehicle_number: str
    zone_id: str
    slot_id: Optional[str] = None
    notes: Optional[str] = None

class ExitRequest(BaseModel):
    session_id: str
    payment_status: str = "paid"

class ViolationCreate(BaseModel):
    vehicle_number: str
    zone_id: Optional[str] = None
    violation_type: str
    description: Optional[str] = None
    fine_amount: float = 500


# ── Helpers ───────────────────────────────────────────────────

def generate_permit_number() -> str:
    chars = string.ascii_uppercase + string.digits
    suffix = ''.join(random.choices(chars, k=8))
    return f"SRM-PRM-{suffix}"


# ── Zone Endpoints ─────────────────────────────────────────────

@router.get("/zones")
async def get_parking_zones(
    vehicle_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ParkingZone).filter(ParkingZone.is_active == True)
    if vehicle_type:
        query = query.filter(ParkingZone.vehicle_type == vehicle_type)
    zones = query.all()
    return [{
        "id": str(z.id),
        "zone_name": z.zone_name,
        "zone_code": z.zone_code,
        "total_slots": z.total_slots,
        "available_slots": z.available_slots,
        "occupied_slots": z.total_slots - z.available_slots,
        "vehicle_type": z.vehicle_type,
        "hourly_rate": float(z.hourly_rate),
        "location_description": z.location_description,
        "occupancy_percent": round(((z.total_slots - z.available_slots) / z.total_slots * 100) if z.total_slots > 0 else 0, 1)
    } for z in zones]


@router.get("/zones/{zone_id}/slots")
async def get_zone_slots(zone_id: str, db: Session = Depends(get_db)):
    slots = db.query(ParkingSlot).filter(
        ParkingSlot.zone_id == zone_id,
        ParkingSlot.is_active == True
    ).all()
    return [{
        "id": str(s.id),
        "slot_number": s.slot_number,
        "slot_type": s.slot_type,
        "is_occupied": s.is_occupied,
        "floor_level": s.floor_level
    } for s in slots]


# ── Vehicle Endpoints ──────────────────────────────────────────

@router.get("/vehicles")
async def get_my_vehicles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vehicles = db.query(Vehicle).filter(
        Vehicle.user_id == current_user.id,
        Vehicle.is_active == True
    ).all()
    return [{
        "id": str(v.id),
        "vehicle_number": v.vehicle_number,
        "vehicle_type": v.vehicle_type,
        "vehicle_make": v.vehicle_make,
        "vehicle_model": v.vehicle_model,
        "vehicle_color": v.vehicle_color,
        "registration_year": v.registration_year,
        "is_verified": v.is_verified,
        "created_at": v.created_at
    } for v in vehicles]


@router.post("/vehicles", status_code=201)
async def register_vehicle(
    data: VehicleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Vehicle).filter(Vehicle.vehicle_number == data.vehicle_number.upper()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle already registered")
    
    vehicle = Vehicle(
        user_id=current_user.id,
        vehicle_number=data.vehicle_number.upper(),
        vehicle_type=data.vehicle_type,
        vehicle_make=data.vehicle_make,
        vehicle_model=data.vehicle_model,
        vehicle_color=data.vehicle_color,
        registration_year=data.registration_year,
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return {"message": "Vehicle registered successfully", "id": str(vehicle.id)}


@router.delete("/vehicles/{vehicle_id}")
async def remove_vehicle(
    vehicle_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(
        Vehicle.id == vehicle_id,
        Vehicle.user_id == current_user.id
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle.is_active = False
    db.commit()
    return {"message": "Vehicle removed successfully"}


# ── Permit Endpoints ───────────────────────────────────────────

@router.get("/permits")
async def get_my_permits(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    permits = db.query(ParkingPermit).filter(ParkingPermit.user_id == current_user.id).all()
    return [{
        "id": str(p.id),
        "permit_number": p.permit_number,
        "permit_type": p.permit_type,
        "valid_from": p.valid_from,
        "valid_until": p.valid_until,
        "status": p.status,
        "amount_paid": float(p.amount_paid),
        "vehicle_id": str(p.vehicle_id),
        "zone_id": str(p.zone_id),
        "days_remaining": (p.valid_until - date.today()).days if p.valid_until > date.today() else 0
    } for p in permits]


@router.post("/permits", status_code=201)
async def create_permit(
    data: PermitCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    permit = ParkingPermit(
        user_id=current_user.id,
        vehicle_id=data.vehicle_id,
        zone_id=data.zone_id,
        permit_number=generate_permit_number(),
        permit_type=data.permit_type,
        valid_from=data.valid_from,
        valid_until=data.valid_until,
        amount_paid=data.amount_paid,
        payment_reference=data.payment_reference,
    )
    db.add(permit)
    db.commit()
    db.refresh(permit)
    return {"message": "Permit created successfully", "permit_number": permit.permit_number}


# ── Session Endpoints (Entry/Exit) ─────────────────────────────

@router.post("/entry")
async def vehicle_entry(
    data: EntryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record vehicle entry into parking"""
    vehicle = db.query(Vehicle).filter(
        Vehicle.vehicle_number == data.vehicle_number.upper(),
        Vehicle.is_active == True
    ).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not registered in the system")
    
    # Check if already parked
    existing_session = db.query(ParkingSession).filter(
        ParkingSession.vehicle_id == vehicle.id,
        ParkingSession.status == "active"
    ).first()
    if existing_session:
        raise HTTPException(status_code=400, detail="Vehicle is already in the parking")
    
    # Find an available slot
    zone = db.query(ParkingZone).filter(ParkingZone.id == data.zone_id).first()
    if not zone:
        raise HTTPException(status_code=404, detail="Parking zone not found")
    if zone.available_slots <= 0:
        raise HTTPException(status_code=400, detail="No available slots in this zone")
    
    # Get or assign slot
    if data.slot_id:
        slot = db.query(ParkingSlot).filter(
            ParkingSlot.id == data.slot_id,
            ParkingSlot.is_occupied == False
        ).first()
        if not slot:
            raise HTTPException(status_code=400, detail="Slot not available")
    else:
        slot = db.query(ParkingSlot).filter(
            ParkingSlot.zone_id == data.zone_id,
            ParkingSlot.is_occupied == False,
            ParkingSlot.is_active == True
        ).first()
        if not slot:
            raise HTTPException(status_code=400, detail="No available slots found")
    
    # Create session
    session = ParkingSession(
        vehicle_id=vehicle.id,
        slot_id=slot.id,
        zone_id=zone.id,
        entry_by=current_user.id,
        notes=data.notes,
    )
    db.add(session)
    
    # Update slot and zone availability
    slot.is_occupied = True
    zone.available_slots -= 1
    
    db.commit()
    db.refresh(session)
    
    return {
        "message": "Vehicle entry recorded",
        "session_id": str(session.id),
        "slot_number": slot.slot_number,
        "zone": zone.zone_name,
        "entry_time": session.entry_time,
        "vehicle_number": vehicle.vehicle_number
    }


@router.post("/exit")
async def vehicle_exit(
    data: ExitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Record vehicle exit from parking"""
    session = db.query(ParkingSession).filter(
        ParkingSession.id == data.session_id,
        ParkingSession.status == "active"
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Active parking session not found")
    
    exit_time = datetime.utcnow()
    duration = int((exit_time - session.entry_time).total_seconds() / 60)
    
    # Calculate charges
    zone = db.query(ParkingZone).filter(ParkingZone.id == session.zone_id).first()
    hourly_rate = float(zone.hourly_rate) if zone else 0
    amount = round((duration / 60) * hourly_rate, 2)
    
    # Update session
    session.exit_time = exit_time
    session.duration_minutes = duration
    session.amount_charged = amount
    session.payment_status = data.payment_status
    session.exit_by = current_user.id
    session.status = "completed"
    
    # Free up slot
    slot = db.query(ParkingSlot).filter(ParkingSlot.id == session.slot_id).first()
    if slot:
        slot.is_occupied = False
    if zone:
        zone.available_slots += 1
    
    db.commit()
    
    return {
        "message": "Vehicle exit recorded",
        "duration_minutes": duration,
        "amount_charged": amount,
        "payment_status": data.payment_status
    }


@router.get("/sessions/active")
async def get_active_sessions(
    zone_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ParkingSession).filter(ParkingSession.status == "active")
    if zone_id:
        query = query.filter(ParkingSession.zone_id == zone_id)
    
    sessions = query.limit(100).all()
    result = []
    for s in sessions:
        vehicle = db.query(Vehicle).filter(Vehicle.id == s.vehicle_id).first()
        slot = db.query(ParkingSlot).filter(ParkingSlot.id == s.slot_id).first()
        zone = db.query(ParkingZone).filter(ParkingZone.id == s.zone_id).first()
        duration = int((datetime.utcnow() - s.entry_time).total_seconds() / 60)
        result.append({
            "id": str(s.id),
            "vehicle_number": vehicle.vehicle_number if vehicle else "Unknown",
            "vehicle_type": vehicle.vehicle_type if vehicle else "Unknown",
            "slot_number": slot.slot_number if slot else "Unknown",
            "zone_name": zone.zone_name if zone else "Unknown",
            "entry_time": s.entry_time,
            "duration_minutes": duration,
            "status": s.status
        })
    return result


@router.get("/sessions/history")
async def get_session_history(
    limit: int = Query(50, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ParkingSession).filter(
        ParkingSession.status == "completed"
    ).order_by(ParkingSession.entry_time.desc()).limit(limit).all()
    
    result = []
    for s in sessions:
        vehicle = db.query(Vehicle).filter(Vehicle.id == s.vehicle_id).first()
        result.append({
            "id": str(s.id),
            "vehicle_number": vehicle.vehicle_number if vehicle else "Unknown",
            "entry_time": s.entry_time,
            "exit_time": s.exit_time,
            "duration_minutes": s.duration_minutes,
            "amount_charged": float(s.amount_charged) if s.amount_charged else 0,
            "payment_status": s.payment_status,
        })
    return result


# ── Violations ─────────────────────────────────────────────────

@router.get("/violations")
async def get_violations(
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(ParkingViolation)
    if status:
        query = query.filter(ParkingViolation.status == status)
    violations = query.order_by(ParkingViolation.reported_at.desc()).limit(100).all()
    return [{
        "id": str(v.id),
        "vehicle_number": v.vehicle_number,
        "violation_type": v.violation_type,
        "description": v.description,
        "fine_amount": float(v.fine_amount),
        "reported_at": v.reported_at,
        "status": v.status,
    } for v in violations]


@router.post("/violations", status_code=201)
async def report_violation(
    data: ViolationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_number == data.vehicle_number.upper()).first()
    
    violation = ParkingViolation(
        vehicle_id=vehicle.id if vehicle else None,
        vehicle_number=data.vehicle_number.upper(),
        zone_id=data.zone_id,
        violation_type=data.violation_type,
        description=data.description,
        fine_amount=data.fine_amount,
        reported_by=current_user.id,
    )
    db.add(violation)
    db.commit()
    return {"message": "Violation reported successfully"}


# ── Analytics ─────────────────────────────────────────────────

@router.get("/analytics/summary")
async def parking_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_zones = db.query(ParkingZone).filter(ParkingZone.is_active == True).count()
    total_slots = db.query(func.sum(ParkingZone.total_slots)).scalar() or 0
    available_slots = db.query(func.sum(ParkingZone.available_slots)).scalar() or 0
    occupied_slots = total_slots - available_slots
    
    active_sessions = db.query(ParkingSession).filter(ParkingSession.status == "active").count()
    today_sessions = db.query(ParkingSession).filter(
        func.date(ParkingSession.entry_time) == date.today()
    ).count()
    
    pending_violations = db.query(ParkingViolation).filter(
        ParkingViolation.status == "pending"
    ).count()
    
    total_revenue = db.query(func.sum(ParkingSession.amount_charged)).filter(
        ParkingSession.payment_status == "paid",
        func.date(ParkingSession.exit_time) == date.today()
    ).scalar() or 0
    
    registered_vehicles = db.query(Vehicle).filter(Vehicle.is_active == True).count()
    
    return {
        "total_zones": total_zones,
        "total_slots": int(total_slots),
        "available_slots": int(available_slots),
        "occupied_slots": int(occupied_slots),
        "occupancy_rate": round((occupied_slots / total_slots * 100) if total_slots > 0 else 0, 1),
        "active_sessions": active_sessions,
        "today_sessions": today_sessions,
        "pending_violations": pending_violations,
        "today_revenue": float(total_revenue),
        "registered_vehicles": registered_vehicles,
    }
