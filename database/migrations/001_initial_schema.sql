-- SRM University ERP System - Complete Database Schema
-- PostgreSQL Database

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    head_of_dept VARCHAR(100),
    established_year INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('admin', 'faculty', 'student', 'security', 'parking_manager')),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    profile_image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    semester INTEGER CHECK (semester BETWEEN 1 AND 8),
    batch_year INTEGER,
    section VARCHAR(5),
    cgpa DECIMAL(4,2),
    hostel_resident BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    department_id UUID REFERENCES departments(id),
    designation VARCHAR(100),
    specialization TEXT,
    joining_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- VEHICLE PARKING SYSTEM
-- ============================================================

CREATE TABLE parking_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    zone_code VARCHAR(10) UNIQUE NOT NULL,
    zone_type VARCHAR(20) CHECK (zone_type IN ('faculty', 'student', 'visitor', 'two_wheeler', 'four_wheeler', 'mixed')),
    total_capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    location_description TEXT,
    is_covered BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_occupancy CHECK (current_occupancy >= 0 AND current_occupancy <= total_capacity)
);

CREATE TABLE parking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES parking_zones(id),
    slot_number VARCHAR(20) NOT NULL,
    slot_type VARCHAR(20) CHECK (slot_type IN ('two_wheeler', 'four_wheeler', 'ev', 'handicap', 'reserved')),
    is_occupied BOOLEAN DEFAULT FALSE,
    is_reserved BOOLEAN DEFAULT FALSE,
    reserved_for UUID REFERENCES users(id),
    has_ev_charging BOOLEAN DEFAULT FALSE,
    floor_level INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(zone_id, slot_number)
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(20) CHECK (vehicle_type IN ('two_wheeler', 'four_wheeler', 'ev_two', 'ev_four')),
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(30),
    year INTEGER,
    is_registered BOOLEAN DEFAULT FALSE,
    registration_sticker VARCHAR(50) UNIQUE,
    registration_expiry DATE,
    insurance_expiry DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parking_passes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    zone_id UUID REFERENCES parking_zones(id),
    pass_number VARCHAR(30) UNIQUE NOT NULL,
    pass_type VARCHAR(20) CHECK (pass_type IN ('monthly', 'semester', 'annual', 'daily', 'visitor')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    amount_paid DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    issued_by UUID REFERENCES users(id),
    issued_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parking_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    slot_id UUID REFERENCES parking_slots(id),
    zone_id UUID REFERENCES parking_zones(id),
    user_id UUID REFERENCES users(id),
    pass_id UUID REFERENCES parking_passes(id),
    entry_time TIMESTAMP NOT NULL DEFAULT NOW(),
    exit_time TIMESTAMP,
    duration_minutes INTEGER,
    amount_charged DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'waived', 'pass')),
    entry_gate VARCHAR(20),
    exit_gate VARCHAR(20),
    entry_operator UUID REFERENCES users(id),
    exit_operator UUID REFERENCES users(id),
    vehicle_image_entry TEXT,
    vehicle_image_exit TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE parking_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES parking_sessions(id),
    vehicle_id UUID REFERENCES vehicles(id),
    user_id UUID REFERENCES users(id),
    violation_type VARCHAR(50),
    description TEXT,
    fine_amount DECIMAL(10,2),
    is_paid BOOLEAN DEFAULT FALSE,
    reported_by UUID REFERENCES users(id),
    reported_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE TABLE gate_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gate_id VARCHAR(20) NOT NULL,
    vehicle_registration VARCHAR(20),
    vehicle_id UUID REFERENCES vehicles(id),
    action VARCHAR(10) CHECK (action IN ('entry', 'exit', 'denied')),
    timestamp TIMESTAMP DEFAULT NOW(),
    reason TEXT,
    operator_id UUID REFERENCES users(id),
    is_auto BOOLEAN DEFAULT FALSE
);

-- ============================================================
-- ACADEMIC TABLES
-- ============================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    department_id UUID REFERENCES departments(id),
    credits INTEGER,
    semester INTEGER,
    is_elective BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    course_id UUID REFERENCES courses(id),
    faculty_id UUID REFERENCES faculty(id),
    date DATE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('present', 'absent', 'late', 'excused')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, course_id, date)
);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    fee_type VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    paid_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
    transaction_id VARCHAR(100),
    payment_method VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50),
    target_audience VARCHAR(30) CHECK (target_audience IN ('all', 'students', 'faculty', 'admin')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    published_by UUID REFERENCES users(id),
    published_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- VIEWS & FUNCTIONS
-- ============================================================

CREATE VIEW parking_zone_stats AS
SELECT 
    pz.id,
    pz.name,
    pz.zone_code,
    pz.zone_type,
    pz.total_capacity,
    pz.current_occupancy,
    ROUND((pz.current_occupancy::DECIMAL / pz.total_capacity * 100), 2) AS occupancy_percentage,
    pz.total_capacity - pz.current_occupancy AS available_slots,
    COUNT(ps.id) FILTER (WHERE ps.is_occupied = false AND ps.is_reserved = false) AS free_slots,
    COUNT(ps.id) FILTER (WHERE ps.has_ev_charging = true) AS ev_slots
FROM parking_zones pz
LEFT JOIN parking_slots ps ON ps.zone_id = pz.id
GROUP BY pz.id, pz.name, pz.zone_code, pz.zone_type, pz.total_capacity, pz.current_occupancy;

CREATE VIEW active_parking_sessions AS
SELECT 
    s.id,
    s.entry_time,
    EXTRACT(EPOCH FROM (NOW() - s.entry_time))/60 AS duration_minutes,
    v.registration_number,
    v.vehicle_type,
    v.make,
    v.model,
    pz.name AS zone_name,
    ps.slot_number,
    u.first_name || ' ' || u.last_name AS owner_name,
    u.email AS owner_email
FROM parking_sessions s
JOIN vehicles v ON v.id = s.vehicle_id
JOIN parking_zones pz ON pz.id = s.zone_id
JOIN parking_slots ps ON ps.id = s.slot_id
JOIN users u ON u.id = s.user_id
WHERE s.exit_time IS NULL;

-- Function to update zone occupancy
CREATE OR REPLACE FUNCTION update_zone_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE parking_zones SET current_occupancy = current_occupancy + 1 WHERE id = NEW.zone_id;
        UPDATE parking_slots SET is_occupied = TRUE WHERE id = NEW.slot_id;
    ELSIF TG_OP = 'UPDATE' AND NEW.exit_time IS NOT NULL AND OLD.exit_time IS NULL THEN
        UPDATE parking_zones SET current_occupancy = current_occupancy - 1 WHERE id = NEW.zone_id;
        UPDATE parking_slots SET is_occupied = FALSE WHERE id = NEW.slot_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parking_session_occupancy_trigger
AFTER INSERT OR UPDATE ON parking_sessions
FOR EACH ROW EXECUTE FUNCTION update_zone_occupancy();

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX idx_parking_sessions_vehicle ON parking_sessions(vehicle_id);
CREATE INDEX idx_parking_sessions_active ON parking_sessions(exit_time) WHERE exit_time IS NULL;
CREATE INDEX idx_parking_slots_zone ON parking_slots(zone_id, is_occupied);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_dept ON students(department_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_gate_logs_timestamp ON gate_logs(timestamp);
