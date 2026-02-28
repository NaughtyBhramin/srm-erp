-- ═══════════════════════════════════════════════════════════════
--  SRM ERP v2 — Complete Role-Based Schema
--  8 Roles: Admin, Student, Faculty, Accounts, Security, 
--           Transport, Medical, Parent
--  New: Hostels, Food/Mess, Medical, Residential Colleges,
--       Chat Messaging, Daily Workers
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin','student','faculty','accounts','security','transport','medical','parent','worker');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type AS ENUM ('two_wheeler','four_wheeler','bus','bicycle');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE permit_type AS ENUM ('daily','monthly','semester','annual');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE violation_status AS ENUM ('pending','paid','disputed','dismissed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('post','announcement','achievement','whistleblower','event','study');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE fee_status AS ENUM ('pending','paid','overdue','waived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE attendance_status AS ENUM ('present','absent','late','excused');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE hostel_block AS ENUM ('A','B','C','D','E','F','G','H');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE medical_visit_type AS ENUM ('consultation','emergency','first_aid','checkup','pharmacy');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE bus_status AS ENUM ('on_time','delayed','cancelled','completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── CORE ────────────────────────────────────────────────────

-- Residential Colleges (Oxford-style)
CREATE TABLE IF NOT EXISTS residential_colleges (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL UNIQUE,  -- "Vivekananda College", "Kalam College"
  code          VARCHAR(10) NOT NULL UNIQUE,   -- "VC", "KC"
  color         VARCHAR(7) NOT NULL,           -- "#ff6b35" hex color
  motto         TEXT,
  established   DATE,
  warden_name   VARCHAR(150),
  total_capacity INT DEFAULT 0,
  current_strength INT DEFAULT 0,
  block         VARCHAR(10),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Academic Departments
CREATE TABLE IF NOT EXISTS departments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100) NOT NULL UNIQUE,
  code          VARCHAR(10) NOT NULL UNIQUE,
  head_name     VARCHAR(150),
  building      VARCHAR(50),
  college_id    UUID REFERENCES residential_colleges(id),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Users (master table for all roles)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  phone         VARCHAR(15),
  avatar_url    TEXT,
  department_id UUID REFERENCES departments(id),
  college_id    UUID REFERENCES residential_colleges(id),
  is_active     BOOLEAN DEFAULT TRUE,
  last_login    TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_college ON users(college_id);

-- ─── STUDENTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reg_number     VARCHAR(20) NOT NULL UNIQUE,
  department_id  UUID NOT NULL REFERENCES departments(id),
  college_id     UUID REFERENCES residential_colleges(id),
  year           SMALLINT NOT NULL CHECK (year BETWEEN 1 AND 5),
  semester       SMALLINT NOT NULL CHECK (semester BETWEEN 1 AND 10),
  batch          VARCHAR(10),
  cgpa           NUMERIC(4,2) DEFAULT 0.00,
  hostel_room_id UUID,  -- FK added after hostels table
  is_hosteller   BOOLEAN DEFAULT FALSE,
  parent_user_id UUID REFERENCES users(id),
  address        TEXT,
  date_of_birth  DATE,
  blood_group    VARCHAR(5),
  emergency_contact VARCHAR(15),
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_students_college ON students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_dept ON students(department_id);

-- ─── FACULTY ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faculty (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employee_id    VARCHAR(20) NOT NULL UNIQUE,
  department_id  UUID NOT NULL REFERENCES departments(id),
  college_id     UUID REFERENCES residential_colleges(id),
  designation    VARCHAR(100),
  specialization VARCHAR(200),
  joining_date   DATE,
  salary         NUMERIC(12,2) DEFAULT 0,
  is_warden      BOOLEAN DEFAULT FALSE,
  warden_college_id UUID REFERENCES residential_colleges(id),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ─── COURSES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code           VARCHAR(15) NOT NULL UNIQUE,
  name           VARCHAR(200) NOT NULL,
  department_id  UUID NOT NULL REFERENCES departments(id),
  faculty_id     UUID REFERENCES faculty(id),
  credits        SMALLINT DEFAULT 3,
  semester       SMALLINT,
  year           SMALLINT,
  max_students   INT DEFAULT 60,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- Course Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id),
  course_id      UUID NOT NULL REFERENCES courses(id),
  enrolled_at    TIMESTAMP DEFAULT NOW(),
  grade          VARCHAR(5),
  grade_point    NUMERIC(3,2),
  UNIQUE(student_id, course_id)
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id),
  course_id      UUID NOT NULL REFERENCES courses(id),
  date           DATE NOT NULL,
  status         attendance_status DEFAULT 'present',
  marked_by      UUID REFERENCES users(id),
  created_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, course_id, date)
);

-- ─── HOSTEL ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hostel_blocks (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(50) NOT NULL,
  block_code     hostel_block NOT NULL,
  gender         VARCHAR(10) CHECK (gender IN ('male','female','mixed')),
  college_id     UUID REFERENCES residential_colleges(id),
  warden_id      UUID REFERENCES users(id),
  total_rooms    INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hostel_rooms (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id       UUID NOT NULL REFERENCES hostel_blocks(id),
  room_number    VARCHAR(10) NOT NULL,
  floor          SMALLINT DEFAULT 1,
  capacity       SMALLINT DEFAULT 2,
  current_occupancy SMALLINT DEFAULT 0,
  room_type      VARCHAR(20) DEFAULT 'shared',  -- shared, single, double
  amenities      TEXT[],
  monthly_rent   NUMERIC(8,2) DEFAULT 0,
  is_available   BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(block_id, room_number)
);

-- Add FK back to students
ALTER TABLE students ADD COLUMN IF NOT EXISTS hostel_room_id UUID REFERENCES hostel_rooms(id);

CREATE TABLE IF NOT EXISTS hostel_allocations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id),
  room_id        UUID NOT NULL REFERENCES hostel_rooms(id),
  allocated_from DATE NOT NULL,
  allocated_until DATE,
  status         VARCHAR(20) DEFAULT 'active',
  allocated_by   UUID REFERENCES users(id),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ─── FOOD / MESS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mess_menu (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week    SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type      VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast','lunch','snacks','dinner')),
  items          TEXT[],
  college_id     UUID REFERENCES residential_colleges(id),
  created_by     UUID REFERENCES users(id),
  week_start     DATE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mess_attendance (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id),
  date           DATE NOT NULL,
  meal_type      VARCHAR(20) NOT NULL,
  attended       BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, date, meal_type)
);

CREATE TABLE IF NOT EXISTS mess_billing (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id),
  month          VARCHAR(7) NOT NULL,  -- "2025-01"
  total_meals    INT DEFAULT 0,
  amount_due     NUMERIC(8,2) DEFAULT 0,
  status         fee_status DEFAULT 'pending',
  paid_at        TIMESTAMP,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ─── MEDICAL ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medical_records (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  blood_group    VARCHAR(5),
  allergies      TEXT[],
  chronic_conditions TEXT[],
  emergency_contact VARCHAR(15),
  insurance_number VARCHAR(50),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_visits (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id     UUID NOT NULL REFERENCES users(id),
  doctor_id      UUID REFERENCES users(id),
  visit_type     medical_visit_type DEFAULT 'consultation',
  symptoms       TEXT,
  diagnosis      TEXT,
  prescription   TEXT,
  follow_up_date DATE,
  visit_date     TIMESTAMP DEFAULT NOW(),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicine_inventory (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(200) NOT NULL,
  category       VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  unit           VARCHAR(20) DEFAULT 'tablets',
  expiry_date    DATE,
  reorder_level  INT DEFAULT 10,
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- ─── PARKING ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parking_zones (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_name      VARCHAR(50) NOT NULL UNIQUE,
  zone_code      VARCHAR(10) NOT NULL UNIQUE,
  total_slots    INT DEFAULT 0,
  available_slots INT DEFAULT 0,
  vehicle_type   vehicle_type NOT NULL,
  hourly_rate    NUMERIC(8,2) DEFAULT 0,
  location_description TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_slots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id        UUID NOT NULL REFERENCES parking_zones(id),
  slot_number    VARCHAR(20) NOT NULL,
  slot_type      VARCHAR(20) DEFAULT 'standard',
  is_occupied    BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  floor_level    SMALLINT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS vehicles (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type   vehicle_type NOT NULL,
  vehicle_make   VARCHAR(50),
  vehicle_model  VARCHAR(50),
  vehicle_color  VARCHAR(30),
  registration_year INT,
  is_verified    BOOLEAN DEFAULT FALSE,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_permits (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  vehicle_id     UUID NOT NULL REFERENCES vehicles(id),
  zone_id        UUID NOT NULL REFERENCES parking_zones(id),
  permit_number  VARCHAR(30) NOT NULL UNIQUE,
  permit_type    permit_type NOT NULL,
  valid_from     DATE NOT NULL,
  valid_until    DATE NOT NULL,
  status         VARCHAR(20) DEFAULT 'active',
  amount_paid    NUMERIC(10,2) DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS parking_sessions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id     UUID NOT NULL REFERENCES vehicles(id),
  slot_id        UUID NOT NULL REFERENCES parking_slots(id),
  zone_id        UUID NOT NULL REFERENCES parking_zones(id),
  entry_time     TIMESTAMP DEFAULT NOW(),
  exit_time      TIMESTAMP,
  duration_minutes INT,
  entry_by       UUID REFERENCES users(id),
  exit_by        UUID REFERENCES users(id),
  amount_charged NUMERIC(10,2) DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending',
  status         VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS parking_violations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id     UUID REFERENCES vehicles(id),
  vehicle_number VARCHAR(20),
  zone_id        UUID REFERENCES parking_zones(id),
  violation_type VARCHAR(50) NOT NULL,
  description    TEXT,
  fine_amount    NUMERIC(10,2) DEFAULT 0,
  reported_by    UUID REFERENCES users(id),
  reported_at    TIMESTAMP DEFAULT NOW(),
  status         violation_status DEFAULT 'pending'
);

-- ─── TRANSPORT ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bus_routes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_name     VARCHAR(100) NOT NULL,
  route_number   VARCHAR(10) NOT NULL UNIQUE,
  stops          TEXT[] NOT NULL,
  departure_times TEXT[],
  total_distance NUMERIC(8,2),
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bus_number     VARCHAR(20) NOT NULL UNIQUE,
  route_id       UUID REFERENCES bus_routes(id),
  driver_id      UUID REFERENCES users(id),
  capacity       INT DEFAULT 52,
  current_occupancy INT DEFAULT 0,
  vehicle_reg    VARCHAR(20),
  gps_lat        NUMERIC(10,7),
  gps_lng        NUMERIC(10,7),
  speed_kmh      INT DEFAULT 0,
  status         bus_status DEFAULT 'on_time',
  last_updated   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_bookings (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  route_id       UUID NOT NULL REFERENCES bus_routes(id),
  bus_id         UUID REFERENCES buses(id),
  booking_date   DATE NOT NULL,
  boarding_stop  VARCHAR(100),
  seat_number    VARCHAR(5),
  status         VARCHAR(20) DEFAULT 'confirmed',
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bus_attendance (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  bus_id         UUID NOT NULL REFERENCES buses(id),
  date           DATE NOT NULL,
  trip_type      VARCHAR(10) DEFAULT 'morning',
  boarded        BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, bus_id, date, trip_type)
);

-- ─── FEES & ACCOUNTS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fee_structures (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(100) NOT NULL,
  department_id  UUID REFERENCES departments(id),
  year           SMALLINT,
  semester       SMALLINT,
  tuition_fee    NUMERIC(10,2) DEFAULT 0,
  hostel_fee     NUMERIC(10,2) DEFAULT 0,
  transport_fee  NUMERIC(10,2) DEFAULT 0,
  exam_fee       NUMERIC(10,2) DEFAULT 0,
  misc_fee       NUMERIC(10,2) DEFAULT 0,
  total          NUMERIC(10,2) GENERATED ALWAYS AS (tuition_fee+hostel_fee+transport_fee+exam_fee+misc_fee) STORED,
  academic_year  VARCHAR(10),
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id     UUID NOT NULL REFERENCES students(id),
  structure_id   UUID REFERENCES fee_structures(id),
  amount         NUMERIC(10,2) NOT NULL,
  payment_mode   VARCHAR(30),
  transaction_id VARCHAR(100),
  status         fee_status DEFAULT 'pending',
  due_date       DATE,
  paid_at        TIMESTAMP,
  processed_by   UUID REFERENCES users(id),
  remarks        TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salary_payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id     UUID NOT NULL REFERENCES faculty(id),
  month          VARCHAR(7) NOT NULL,
  basic_salary   NUMERIC(12,2) DEFAULT 0,
  allowances     NUMERIC(10,2) DEFAULT 0,
  deductions     NUMERIC(10,2) DEFAULT 0,
  net_salary     NUMERIC(12,2) GENERATED ALWAYS AS (basic_salary+allowances-deductions) STORED,
  status         fee_status DEFAULT 'pending',
  paid_at        TIMESTAMP,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ─── DAILY WORKERS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workers (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  employee_id    VARCHAR(20) NOT NULL UNIQUE,
  category       VARCHAR(50),  -- cleaning, security, maintenance, canteen
  department_id  UUID REFERENCES departments(id),
  daily_wage     NUMERIC(8,2) DEFAULT 0,
  joining_date   DATE,
  supervisor_id  UUID REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS worker_attendance (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id      UUID NOT NULL REFERENCES workers(id),
  date           DATE NOT NULL,
  status         attendance_status DEFAULT 'present',
  check_in       TIME,
  check_out      TIME,
  overtime_hours NUMERIC(4,2) DEFAULT 0,
  UNIQUE(worker_id, date)
);

-- ─── SOCIAL FEED ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id      UUID NOT NULL REFERENCES users(id),
  college_id     UUID REFERENCES residential_colleges(id),
  post_type      post_type DEFAULT 'post',
  content        TEXT NOT NULL,
  media_urls     TEXT[],
  tags           TEXT[],
  is_anonymous   BOOLEAN DEFAULT FALSE,
  likes_count    INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  shares_count   INT DEFAULT 0,
  is_pinned      BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_college ON posts(college_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);

CREATE TABLE IF NOT EXISTS post_likes (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id        UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id),
  created_at     TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS post_comments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id        UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id      UUID NOT NULL REFERENCES users(id),
  content        TEXT NOT NULL,
  parent_id      UUID REFERENCES post_comments(id),
  created_at     TIMESTAMP DEFAULT NOW()
);

-- Streaks
CREATE TABLE IF NOT EXISTS user_streaks (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity  DATE,
  total_posts    INT DEFAULT 0,
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- ─── CHAT MESSENGER ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_rooms (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(100),
  room_type      VARCHAR(20) DEFAULT 'direct',  -- direct, group, college, department
  college_id     UUID REFERENCES residential_colleges(id),
  department_id  UUID REFERENCES departments(id),
  created_by     UUID REFERENCES users(id),
  avatar         TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_members (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id        UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES users(id),
  role           VARCHAR(20) DEFAULT 'member',
  joined_at      TIMESTAMP DEFAULT NOW(),
  last_read      TIMESTAMP,
  UNIQUE(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id        UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id      UUID NOT NULL REFERENCES users(id),
  content        TEXT,
  media_url      TEXT,
  message_type   VARCHAR(20) DEFAULT 'text',  -- text, image, file, voice
  reply_to       UUID REFERENCES messages(id),
  is_deleted     BOOLEAN DEFAULT FALSE,
  read_by        UUID[],
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room_id, created_at DESC);

-- ─── NOTIFICATIONS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id),
  title          VARCHAR(200) NOT NULL,
  message        TEXT NOT NULL,
  type           VARCHAR(30) DEFAULT 'info',
  link           TEXT,
  is_read        BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notif_user ON notifications(user_id, is_read);

-- ─── STUDY MATERIALS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_materials (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          VARCHAR(300) NOT NULL,
  subject        VARCHAR(100),
  course_id      UUID REFERENCES courses(id),
  department_id  UUID REFERENCES departments(id),
  uploaded_by    UUID NOT NULL REFERENCES users(id),
  file_url       TEXT,
  file_type      VARCHAR(20),
  file_size_mb   NUMERIC(8,2),
  description    TEXT,
  tags           TEXT[],
  downloads      INT DEFAULT 0,
  rating         NUMERIC(3,2) DEFAULT 0,
  created_at     TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--  SEED DATA
-- ═══════════════════════════════════════════════════════════════

-- Residential Colleges
INSERT INTO residential_colleges (name, code, color, motto, warden_name, total_capacity) VALUES
  ('Vivekananda College',  'VC', '#ff6b35', 'Strength Through Knowledge', 'Dr. Meera Krishnan', 800),
  ('Kalam College',        'KC', '#6378ff', 'Dream, Aspire, Achieve',     'Dr. Suresh Nair',    750),
  ('Tagore College',       'TC', '#00d4aa', 'Where Art Meets Science',    'Dr. Priya Sharma',   700),
  ('Bose College',         'BC', '#f5c518', 'Curiosity Drives Excellence','Dr. Anand Kumar',    650)
ON CONFLICT (code) DO NOTHING;

-- Departments
INSERT INTO departments (name, code, head_name, building) VALUES
  ('Computer Science & Engineering', 'CSE',  'Dr. V. Rajkumar',    'Tech Block A'),
  ('Electronics & Communication',    'ECE',  'Dr. K. Sundaram',    'Tech Block B'),
  ('Mechanical Engineering',         'MECH', 'Dr. P. Rajan',       'Engg Block'),
  ('Civil Engineering',              'CIVIL','Dr. S. Mohan',        'Engg Block'),
  ('Business Administration',        'MBA',  'Dr. L. Preethi',     'Mgmt Block'),
  ('Physics',                        'PHY',  'Dr. R. Venkat',      'Science Block'),
  ('Administration',                 'ADMIN','Mr. K. Balaji',       'Admin Block')
ON CONFLICT (code) DO NOTHING;

-- Parking Zones
INSERT INTO parking_zones (zone_name, zone_code, total_slots, available_slots, vehicle_type, hourly_rate, location_description) VALUES
  ('Zone A — Staff Two Wheeler',    'ZA-2W', 200, 45,  'two_wheeler',  0, 'Near Admin Block, Gate 1'),
  ('Zone B — Student Two Wheeler',  'ZB-2W', 500, 82,  'two_wheeler',  5, 'East Campus, Near Library'),
  ('Zone C — Staff Four Wheeler',   'ZC-4W', 100, 28,  'four_wheeler', 0, 'Near Admin Block'),
  ('Zone D — Student Four Wheeler', 'ZD-4W', 150, 12,  'four_wheeler', 20,'West Campus Parking'),
  ('Zone E — Bus Bay',              'ZE-BUS', 30, 16,  'bus',          0, 'Main Gate Bus Bay'),
  ('Zone F — Visitor',              'ZF-VIS', 50, 22,  'four_wheeler', 30,'Main Entrance')
ON CONFLICT (zone_code) DO NOTHING;

-- Bus Routes
INSERT INTO bus_routes (route_name, route_number, stops, departure_times) VALUES
  ('Tambaram Express',  'R01', ARRAY['SRM Gate','Potheri','Vandalur','Tambaram','Pallavaram'], ARRAY['05:30','17:30']),
  ('Velachery Shuttle', 'R02', ARRAY['SRM Gate','Medavakkam','Perungudi','Velachery','OMR'],   ARRAY['05:45','17:45']),
  ('Chrompet Link',     'R03', ARRAY['SRM Gate','Guduvanchery','Urapakkam','Chrompet'],        ARRAY['06:00','18:00']),
  ('Porur Connect',     'R04', ARRAY['SRM Gate','Potheri','Vandalur','Porur','Koyambedu'],    ARRAY['06:15','18:15']),
  ('Saidapet Fast',     'R05', ARRAY['SRM Gate','Perungudi','Kotturpuram','Saidapet'],         ARRAY['06:30','18:30'])
ON CONFLICT (route_number) DO NOTHING;

