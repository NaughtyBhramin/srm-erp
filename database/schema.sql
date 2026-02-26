-- SRM University ERP Database Schema
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    head_of_department VARCHAR(100),
    building VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin','student','faculty','security')),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(15),
    department_id UUID REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reg_number VARCHAR(20) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES departments(id),
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 5),
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 10),
    batch VARCHAR(10),
    cgpa DECIMAL(4,2) DEFAULT 0.00,
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES departments(id),
    designation VARCHAR(100),
    specialization VARCHAR(200),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- VEHICLE PARKING SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS parking_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_name VARCHAR(50) NOT NULL UNIQUE,
    zone_code VARCHAR(10) NOT NULL UNIQUE,
    total_slots INTEGER NOT NULL DEFAULT 0,
    available_slots INTEGER NOT NULL DEFAULT 0,
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('two_wheeler','four_wheeler','bus')),
    hourly_rate DECIMAL(8,2) DEFAULT 0,
    location_description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID NOT NULL REFERENCES parking_zones(id),
    slot_number VARCHAR(20) NOT NULL,
    slot_type VARCHAR(20) NOT NULL CHECK (slot_type IN ('standard','handicap','reserved','faculty')),
    is_occupied BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    floor_level INTEGER DEFAULT 1,
    UNIQUE(zone_id, slot_number)
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('two_wheeler','four_wheeler','bus')),
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(50),
    vehicle_color VARCHAR(30),
    registration_year INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parking_permits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    zone_id UUID NOT NULL REFERENCES parking_zones(id),
    permit_number VARCHAR(30) NOT NULL UNIQUE,
    permit_type VARCHAR(20) NOT NULL CHECK (permit_type IN ('daily','monthly','semester','annual')),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','suspended','pending')),
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS parking_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    slot_id UUID NOT NULL REFERENCES parking_slots(id),
    zone_id UUID NOT NULL REFERENCES parking_zones(id),
    entry_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    exit_time TIMESTAMP,
    duration_minutes INTEGER,
    entry_by UUID REFERENCES users(id),
    exit_by UUID REFERENCES users(id),
    amount_charged DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','waived')),
    entry_image_url VARCHAR(500),
    exit_image_url VARCHAR(500),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','completed','cancelled'))
);

CREATE TABLE IF NOT EXISTS parking_violations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id),
    vehicle_number VARCHAR(20),
    zone_id UUID REFERENCES parking_zones(id),
    violation_type VARCHAR(50) NOT NULL,
    description TEXT,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    reported_by UUID REFERENCES users(id),
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','paid','disputed','dismissed'))
);

-- ============================================================
-- ATTENDANCE SYSTEM
-- ============================================================

CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(200) NOT NULL,
    department_id UUID REFERENCES departments(id),
    credits INTEGER DEFAULT 3,
    year INTEGER,
    semester INTEGER,
    faculty_id UUID REFERENCES faculty(id)
);

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'absent' CHECK (status IN ('present','absent','late','excused')),
    marked_by UUID REFERENCES faculty(id),
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FEE MANAGEMENT
-- ============================================================

CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    year INTEGER,
    fee_type VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id),
    fee_structure_id UUID REFERENCES fee_structures(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_mode VARCHAR(30) DEFAULT 'online',
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success','failed','pending','refunded')),
    receipt_number VARCHAR(50) UNIQUE
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info','warning','alert','success')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_parking_sessions_vehicle ON parking_sessions(vehicle_id);
CREATE INDEX idx_parking_sessions_status ON parking_sessions(status);
CREATE INDEX idx_parking_sessions_entry_time ON parking_sessions(entry_time);
CREATE INDEX idx_vehicles_user ON vehicles(user_id);
CREATE INDEX idx_parking_slots_zone ON parking_slots(zone_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_students_regnum ON students(reg_number);

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO departments (name, code, head_of_department, building) VALUES
('Computer Science & Engineering', 'CSE', 'Dr. R. Kumar', 'Tech Block A'),
('Electronics & Communication', 'ECE', 'Dr. S. Patel', 'Tech Block B'),
('Mechanical Engineering', 'MECH', 'Dr. A. Singh', 'Engg Block'),
('Civil Engineering', 'CIVIL', 'Dr. P. Nair', 'Engg Block'),
('Business Administration', 'MBA', 'Dr. M. Sharma', 'Management Block'),
('Administration', 'ADMIN', 'Dr. Vice Chancellor', 'Admin Block')
ON CONFLICT DO NOTHING;

INSERT INTO parking_zones (zone_name, zone_code, total_slots, available_slots, vehicle_type, hourly_rate, location_description) VALUES
('Zone A - Staff Two Wheeler', 'ZA-2W', 200, 200, 'two_wheeler', 0, 'Near Admin Block, Gate 1'),
('Zone B - Student Two Wheeler', 'ZB-2W', 500, 500, 'two_wheeler', 5, 'East Campus, Near Library'),
('Zone C - Staff Four Wheeler', 'ZC-4W', 100, 100, 'four_wheeler', 0, 'Near Admin Block'),
('Zone D - Student Four Wheeler', 'ZD-4W', 150, 150, 'four_wheeler', 20, 'West Campus Parking'),
('Zone E - Bus Parking', 'ZE-BUS', 30, 30, 'bus', 0, 'Main Gate Bus Bay'),
('Zone F - Visitor Parking', 'ZF-VIS', 50, 50, 'four_wheeler', 30, 'Main Entrance')
ON CONFLICT DO NOTHING;
