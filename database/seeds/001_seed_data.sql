-- SRM University ERP - Seed Data

-- Departments
INSERT INTO departments (name, code, head_of_dept, established_year) VALUES
('Computer Science & Engineering', 'CSE', 'Dr. Rajesh Kumar', 1985),
('Electronics & Communication', 'ECE', 'Dr. Priya Sharma', 1988),
('Mechanical Engineering', 'MECH', 'Dr. Arun Patel', 1985),
('Civil Engineering', 'CIVIL', 'Dr. Suresh Nair', 1986),
('Information Technology', 'IT', 'Dr. Meena Iyer', 2000),
('Business Administration', 'MBA', 'Dr. Kavitha Rajan', 1995),
('Biotechnology', 'BIOTECH', 'Dr. Anand Krishnan', 2002),
('Physics', 'PHY', 'Dr. Lakshmi Rao', 1985);

-- Admin user (password: Admin@SRM2024)
INSERT INTO users (username, email, password_hash, role, first_name, last_name, phone) VALUES
('admin', 'admin@srm.edu.in', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniKDCBbBqY.ZP5rXZJM6OZXWC', 'admin', 'System', 'Administrator', '9876543210');

-- Parking Zones
INSERT INTO parking_zones (name, zone_code, zone_type, total_capacity, hourly_rate, location_description, is_covered) VALUES
('Faculty Parking Block A', 'FPK-A', 'faculty', 150, 0, 'Near Main Administrative Block', TRUE),
('Student Parking Block B', 'SPK-B', 'student', 400, 5, 'Near Academic Block 1', FALSE),
('Student Two-Wheeler Zone', 'STW-C', 'two_wheeler', 800, 2, 'Near Hostel Blocks', FALSE),
('Visitor Parking', 'VIS-D', 'visitor', 80, 20, 'Near Main Entrance Gate 1', FALSE),
('Faculty Two-Wheeler', 'FTW-E', 'two_wheeler', 200, 0, 'Near Staff Quarters', FALSE),
('EV Charging Zone', 'EV-F', 'mixed', 50, 10, 'Near Science Block', TRUE),
('Event Parking', 'EVT-G', 'mixed', 300, 15, 'Near Auditorium', FALSE);

-- Parking Slots for Block A (Faculty)
INSERT INTO parking_slots (zone_id, slot_number, slot_type, floor_level)
SELECT 
    (SELECT id FROM parking_zones WHERE zone_code = 'FPK-A'),
    'A-' || LPAD(gs::TEXT, 3, '0'),
    CASE WHEN gs <= 5 THEN 'handicap' ELSE 'four_wheeler' END,
    FLOOR((gs-1) / 50)
FROM generate_series(1, 150) gs;

-- Parking Slots for Block B (Student)
INSERT INTO parking_slots (zone_id, slot_number, slot_type, floor_level)
SELECT 
    (SELECT id FROM parking_zones WHERE zone_code = 'SPK-B'),
    'B-' || LPAD(gs::TEXT, 3, '0'),
    'four_wheeler',
    FLOOR((gs-1) / 100)
FROM generate_series(1, 400) gs;

-- Parking Slots for Two-Wheeler Zone C
INSERT INTO parking_slots (zone_id, slot_number, slot_type)
SELECT 
    (SELECT id FROM parking_zones WHERE zone_code = 'STW-C'),
    'C-' || LPAD(gs::TEXT, 4, '0'),
    'two_wheeler'
FROM generate_series(1, 800) gs;

-- EV Slots
INSERT INTO parking_slots (zone_id, slot_number, slot_type, has_ev_charging)
SELECT 
    (SELECT id FROM parking_zones WHERE zone_code = 'EV-F'),
    'EV-' || LPAD(gs::TEXT, 2, '0'),
    CASE WHEN gs <= 25 THEN 'ev_two' ELSE 'ev' END,
    TRUE
FROM generate_series(1, 50) gs;

-- Announcements
INSERT INTO announcements (title, content, category, target_audience, priority, published_by) VALUES
('Parking Registration Deadline', 'All students must register their vehicles before March 31st. Unregistered vehicles will be penalized.', 'parking', 'students', 'high', (SELECT id FROM users WHERE username = 'admin')),
('New EV Charging Zone Open', 'The new EV charging zone (EV-F) near Science Block is now operational with 50 charging points.', 'infrastructure', 'all', 'normal', (SELECT id FROM users WHERE username = 'admin')),
('Semester Registration Open', 'Semester VI registration is now open. Complete before the deadline.', 'academic', 'students', 'urgent', (SELECT id FROM users WHERE username = 'admin'));
