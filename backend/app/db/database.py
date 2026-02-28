"""
SRM ERP v2 — Complete Database Models
All 8 roles: Admin, Student, Faculty, Accounts, Security, Transport, Medical, Parent
"""
from sqlalchemy import (
    create_engine, Column, String, Integer, Boolean, DateTime, 
    ForeignKey, Numeric, Date, Text, Float, SmallInteger, Time,
    ARRAY, Enum as SAEnum
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY as PG_ARRAY
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

# ─── CORE ────────────────────────────────────────────────────

class ResidentialCollege(Base):
    __tablename__ = "residential_colleges"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(10), nullable=False, unique=True)
    color = Column(String(7), nullable=False, default="#6378ff")
    motto = Column(Text)
    warden_name = Column(String(150))
    total_capacity = Column(Integer, default=0)
    current_strength = Column(Integer, default=0)
    block = Column(String(10))
    created_at = Column(DateTime, default=datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(10), nullable=False, unique=True)
    head_name = Column(String(150))
    building = Column(String(50))
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    college = relationship("ResidentialCollege")

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(15))
    avatar_url = Column(Text)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    department = relationship("Department")
    college = relationship("ResidentialCollege")
    vehicles = relationship("Vehicle", back_populates="user")

# ─── STUDENTS ────────────────────────────────────────────────

class Student(Base):
    __tablename__ = "students"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reg_number = Column(String(20), nullable=False, unique=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    year = Column(SmallInteger, nullable=False)
    semester = Column(SmallInteger, nullable=False)
    batch = Column(String(10))
    cgpa = Column(Numeric(4, 2), default=0.00)
    hostel_room_id = Column(UUID(as_uuid=True), ForeignKey("hostel_rooms.id"))
    is_hosteller = Column(Boolean, default=False)
    parent_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    address = Column(Text)
    date_of_birth = Column(Date)
    blood_group = Column(String(5))
    emergency_contact = Column(String(15))
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", foreign_keys=[user_id])
    department = relationship("Department")
    college = relationship("ResidentialCollege")

class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    employee_id = Column(String(20), nullable=False, unique=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    designation = Column(String(100))
    specialization = Column(String(200))
    joining_date = Column(Date)
    salary = Column(Numeric(12, 2), default=0)
    is_warden = Column(Boolean, default=False)
    warden_college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")
    department = relationship("Department")

class Course(Base):
    __tablename__ = "courses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String(15), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=False)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("faculty.id"))
    credits = Column(SmallInteger, default=3)
    semester = Column(SmallInteger)
    year = Column(SmallInteger)
    max_students = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── HOSTEL ──────────────────────────────────────────────────

class HostelBlock(Base):
    __tablename__ = "hostel_blocks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    block_code = Column(String(5), nullable=False)
    gender = Column(String(10))
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    warden_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    total_rooms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    college = relationship("ResidentialCollege")

class HostelRoom(Base):
    __tablename__ = "hostel_rooms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    block_id = Column(UUID(as_uuid=True), ForeignKey("hostel_blocks.id"), nullable=False)
    room_number = Column(String(10), nullable=False)
    floor = Column(SmallInteger, default=1)
    capacity = Column(SmallInteger, default=2)
    current_occupancy = Column(SmallInteger, default=0)
    room_type = Column(String(20), default='shared')
    monthly_rent = Column(Numeric(8, 2), default=0)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    block = relationship("HostelBlock")

class HostelAllocation(Base):
    __tablename__ = "hostel_allocations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    room_id = Column(UUID(as_uuid=True), ForeignKey("hostel_rooms.id"), nullable=False)
    allocated_from = Column(Date, nullable=False)
    allocated_until = Column(Date)
    status = Column(String(20), default='active')
    allocated_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── MEDICAL ─────────────────────────────────────────────────

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    blood_group = Column(String(5))
    emergency_contact = Column(String(15))
    insurance_number = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User")

class MedicalVisit(Base):
    __tablename__ = "medical_visits"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    doctor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    visit_type = Column(String(30), default='consultation')
    symptoms = Column(Text)
    diagnosis = Column(Text)
    prescription = Column(Text)
    follow_up_date = Column(Date)
    visit_date = Column(DateTime, default=datetime.utcnow)
    patient = relationship("User", foreign_keys=[patient_id])

class MedicineInventory(Base):
    __tablename__ = "medicine_inventory"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    category = Column(String(100))
    stock_quantity = Column(Integer, default=0)
    unit = Column(String(20), default='tablets')
    expiry_date = Column(Date)
    reorder_level = Column(Integer, default=10)
    updated_at = Column(DateTime, default=datetime.utcnow)

# ─── PARKING ─────────────────────────────────────────────────

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
    slot_type = Column(String(20), default='standard')
    is_occupied = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    floor_level = Column(SmallInteger, default=1)
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
    status = Column(String(20), default='active')
    amount_paid = Column(Numeric(10, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ParkingSession(Base):
    __tablename__ = "parking_sessions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_id = Column(UUID(as_uuid=True), ForeignKey("vehicles.id"), nullable=False)
    slot_id = Column(UUID(as_uuid=True), ForeignKey("parking_slots.id"), nullable=False)
    zone_id = Column(UUID(as_uuid=True), ForeignKey("parking_zones.id"), nullable=False)
    entry_time = Column(DateTime, default=datetime.utcnow)
    exit_time = Column(DateTime)
    duration_minutes = Column(Integer)
    amount_charged = Column(Numeric(10, 2), default=0)
    payment_status = Column(String(20), default='pending')
    status = Column(String(20), default='active')

class ParkingViolation(Base):
    __tablename__ = "parking_violations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vehicle_number = Column(String(20))
    zone_id = Column(UUID(as_uuid=True), ForeignKey("parking_zones.id"))
    violation_type = Column(String(50), nullable=False)
    description = Column(Text)
    fine_amount = Column(Numeric(10, 2), default=0)
    reported_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    reported_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default='pending')

# ─── TRANSPORT ───────────────────────────────────────────────

class BusRoute(Base):
    __tablename__ = "bus_routes"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_name = Column(String(100), nullable=False)
    route_number = Column(String(10), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    buses = relationship("Bus", back_populates="route")

class Bus(Base):
    __tablename__ = "buses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bus_number = Column(String(20), nullable=False, unique=True)
    route_id = Column(UUID(as_uuid=True), ForeignKey("bus_routes.id"))
    driver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    capacity = Column(Integer, default=52)
    current_occupancy = Column(Integer, default=0)
    vehicle_reg = Column(String(20))
    gps_lat = Column(Numeric(10, 7))
    gps_lng = Column(Numeric(10, 7))
    speed_kmh = Column(Integer, default=0)
    status = Column(String(20), default='on_time')
    last_updated = Column(DateTime, default=datetime.utcnow)
    route = relationship("BusRoute", back_populates="buses")

# ─── SOCIAL ──────────────────────────────────────────────────

class Post(Base):
    __tablename__ = "posts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    post_type = Column(String(20), default='post')
    content = Column(Text, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    author = relationship("User")
    college = relationship("ResidentialCollege")

class UserStreak(Base):
    __tablename__ = "user_streaks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity = Column(Date)
    total_posts = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)

# ─── CHAT ────────────────────────────────────────────────────

class ChatRoom(Base):
    __tablename__ = "chat_rooms"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100))
    room_type = Column(String(20), default='direct')
    college_id = Column(UUID(as_uuid=True), ForeignKey("residential_colleges.id"))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey("chat_rooms.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    content = Column(Text)
    message_type = Column(String(20), default='text')
    reply_to = Column(UUID(as_uuid=True), ForeignKey("messages.id"))
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    sender = relationship("User")

# ─── FEE & ACCOUNTS ──────────────────────────────────────────

class FeePayment(Base):
    __tablename__ = "fee_payments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_mode = Column(String(30))
    transaction_id = Column(String(100))
    status = Column(String(20), default='pending')
    due_date = Column(Date)
    paid_at = Column(DateTime)
    processed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    remarks = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class SalaryPayment(Base):
    __tablename__ = "salary_payments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faculty_id = Column(UUID(as_uuid=True), ForeignKey("faculty.id"), nullable=False)
    month = Column(String(7), nullable=False)
    basic_salary = Column(Numeric(12, 2), default=0)
    allowances = Column(Numeric(10, 2), default=0)
    deductions = Column(Numeric(10, 2), default=0)
    status = Column(String(20), default='pending')
    paid_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── NOTIFICATIONS ───────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(30), default='info')
    link = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# ─── STUDY MATERIALS ─────────────────────────────────────────

class StudyMaterial(Base):
    __tablename__ = "study_materials"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(300), nullable=False)
    subject = Column(String(100))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    file_url = Column(Text)
    file_type = Column(String(20))
    file_size_mb = Column(Numeric(8, 2))
    description = Column(Text)
    downloads = Column(Integer, default=0)
    rating = Column(Numeric(3, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    uploader = relationship("User")
