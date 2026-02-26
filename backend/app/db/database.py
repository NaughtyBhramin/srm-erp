"""
Database Configuration & SQLAlchemy Setup
Fixed: Numeric instead of Decimal, updated declarative_base import
"""
from sqlalchemy import create_engine, Column, String, Integer, Boolean, DateTime, ForeignKey, Numeric, Date, Text, Float
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─────────────────────────────────────────────────────
# ORM MODELS
# ─────────────────────────────────────────────────────

class Department(Base):
    __tablename__ = "departments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(10), nullable=False, unique=True)
    head_of_department = Column(String(100))
    building = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(15))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    department = relationship("Department")
    vehicles = relationship("Vehicle", back_populates="user")


class Student(Base):
    __tablename__ = "students"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reg_number = Column(String(20), nullable=False, unique=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    year = Column(Integer, nullable=False)
    semester = Column(Integer, nullable=False)
    batch = Column(String(10))
    cgpa = Column(Numeric(4, 2), default=0.00)
    address = Column(Text)
    date_of_birth = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")
    department = relationship("Department")


class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    employee_id = Column(String(20), nullable=False, unique=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    designation = Column(String(100))
    specialization = Column(String(200))
    joining_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")
    department = relationship("Department")


class ParkingZone(Base):
    __tablename__ = "parking_zones"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_name = Column(String(50), nullable=False, unique=True)
    zone_code = Column(String(10), nullable=False, unique=True)
    total_slots = Column(Integer, default=0)
    available_slots = Column(Integer, default=0)
    vehicle_type = Column(String(20), nullable=False)
    hourly_rate = Column(Numeric(8, 2), default=0)
    location_description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    slots = relationship("ParkingSlot", back_populates="zone")


class ParkingSlot(Base):
    __tablename__ = "parking_slots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("parking_zones.id"), nullable=False)
    slot_number = Column(String(20), nullable=False)
    slot_type = Column(String(20), nullable=False)
    is_occupied = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    floor_level = Column(Integer, default=1)
    zone = relationship("ParkingZone", back_populates="slots")


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    vehicle_number = Column(String(20), nullable=False, unique=True)
    vehicle_type = Column(String(20), nullable=False)
    vehicle_make = Column(String(50))
    vehicle_model = Column(String(50))
    vehicle_color = Column(String(30))
    registration_year = Column(Integer)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="vehicles")


class ParkingPermit(Base):
    __tablename__ = "parking_permits"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("parking_zones.id"), nullable=False)
    permit_number = Column(String(30), nullable=False, unique=True)
    permit_type = Column(String(20), nullable=False)
    valid_from = Column(Date, nullable=False)
    valid_until = Column(Date, nullable=False)
    status = Column(String(20), default="active")
    amount_paid = Column(Numeric(10, 2), default=0)
    payment_reference = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")
    vehicle = relationship("Vehicle")
    zone = relationship("ParkingZone")


class ParkingSession(Base):
    __tablename__ = "parking_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    slot_id = Column(UUID(as_uuid=True), ForeignKey("parking_slots.id"), nullable=False)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("parking_zones.id"), nullable=False)
    entry_time = Column(DateTime, default=datetime.utcnow)
    exit_time = Column(DateTime)
    duration_minutes = Column(Integer)
    entry_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    exit_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    amount_charged = Column(Numeric(10, 2), default=0)
    payment_status = Column(String(20), default="pending")
    notes = Column(Text)
    status = Column(String(20), default="active")
    vehicle = relationship("Vehicle")
    slot = relationship("ParkingSlot")
    zone = relationship("ParkingZone")


class ParkingViolation(Base):
    __tablename__ = "parking_violations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"))
    vehicle_number = Column(String(20))
    zone_id = Column(UUID(as_uuid=True), ForeignKey("parking_zones.id"))
    violation_type = Column(String(50), nullable=False)
    description = Column(Text)
    fine_amount = Column(Numeric(10, 2), default=0)
    reported_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    reported_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="pending")


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(30), default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
