# SRM University ERP System
## Complete Enterprise Resource Planning System with Vehicle Parking Management

---

### 🏫 Overview

A full-stack ERP system built for **SRM Institute of Science and Technology**, featuring:

- 🚗 **Vehicle Parking Management System** — real-time slot tracking, entry/exit management, permits, violations
- 🎓 **Student Management** — registration, CGPA tracking, attendance
- 👨‍🏫 **Faculty Management** — employee profiles, courses
- 💰 **Fee Management** — payment tracking, receipts
- 📊 **Analytics Dashboard** — charts, occupancy trends, reports

---

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      SRM ERP System                      │
├──────────────┬──────────────────┬───────────────────────┤
│   Frontend   │   FastAPI Backend │  Java Microservice    │
│  React + Vite│   Python 3.11    │  Spring Boot 3.2      │
│  Tailwind CSS│   SQLAlchemy     │  JPA + Hibernate      │
│  Recharts    │   JWT Auth       │  Analytics Engine     │
└──────┬───────┴────────┬─────────┴───────────┬───────────┘
       │                │                     │
       └────────────────┴─────────────────────┘
                         │
                  ┌──────▼───────┐
                  │  PostgreSQL   │
                  │   Database   │
                  └──────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, React Router |
| Backend | Python 3.11, FastAPI, SQLAlchemy 2.0, JWT |
| Microservice | Java 17, Spring Boot 3.2, JPA, Scheduled Tasks |
| Database | PostgreSQL 16 |
| DevOps | Docker, Docker Compose, Nginx |

---

### 📁 Project Structure

```
srm-erp/
├── frontend/                    # React Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ParkingDashboard.jsx    # Main parking view
│   │   │   ├── VehicleManagement.jsx
│   │   │   ├── ParkingZones.jsx
│   │   │   ├── ParkingPermits.jsx
│   │   │   ├── ParkingViolations.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   └── Analytics.jsx
│   │   ├── components/Layout.jsx       # Sidebar navigation
│   │   ├── context/AuthContext.jsx     # JWT auth context
│   │   └── services/api.js             # Axios HTTP client
│   └── Dockerfile
│
├── backend/                     # FastAPI Python Backend
│   ├── main.py                  # Application entry point
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py          # JWT auth endpoints
│   │   │   ├── parking.py       # Parking system API
│   │   │   ├── students.py
│   │   │   ├── faculty.py
│   │   │   ├── dashboard.py
│   │   │   └── notifications.py
│   │   ├── db/database.py       # SQLAlchemy models
│   │   └── core/config.py       # App configuration
│   └── Dockerfile
│
├── java-microservice/           # Spring Boot Microservice
│   ├── src/main/java/com/srm/parking/
│   │   ├── ParkingMicroserviceApplication.java
│   │   ├── controller/ParkingController.java   # REST endpoints
│   │   ├── service/ParkingAnalyticsService.java # Analytics + Scheduled tasks
│   │   ├── model/ParkingSession.java
│   │   ├── model/ParkingZone.java
│   │   └── repository/ParkingSessionRepository.java
│   ├── pom.xml
│   └── Dockerfile
│
├── database/
│   └── schema.sql               # Full PostgreSQL schema with seed data
│
└── docker-compose.yml           # Full stack orchestration
```

---

### 🚀 Quick Start

#### Option 1: Docker Compose (Recommended)

```bash
# Clone and start everything
git clone <repo>
cd srm-erp
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/api/docs
# Java Service: http://localhost:8080/swagger-ui.html
```

#### Option 2: Local Development

**1. Database**
```bash
psql -U postgres -c "CREATE USER srm_user WITH PASSWORD 'srm_password';"
psql -U postgres -c "CREATE DATABASE srm_erp OWNER srm_user;"
psql -U srm_user -d srm_erp -f database/schema.sql
```

**2. Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**3. Java Microservice**
```bash
cd java-microservice
mvn spring-boot:run
```

**4. Frontend**
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

---

### 🔐 Authentication

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@srm.edu.in | admin123 | Full access |
| Student | student@srm.edu.in | student123 | Limited |
| Security | security@srm.edu.in | security123 | Parking ops |

> **Demo Mode**: Click the demo login buttons on the login page to bypass the backend.

---

### 🅿️ Parking System Features

| Feature | Description |
|---------|-------------|
| **Zone Management** | 6 zones: Staff 2W/4W, Student 2W/4W, Bus, Visitor |
| **Real-time Slots** | Visual grid showing free/occupied/reserved/handicap slots |
| **Entry/Exit** | Quick vehicle entry/exit with slot auto-assignment |
| **Permits** | Daily/Monthly/Semester/Annual permit issuance |
| **Violations** | Report, track, and collect fines |
| **Analytics** | Hourly traffic, weekly trends, zone distribution charts |

---

### 📊 API Endpoints

**Authentication**
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/me` — Get current user profile

**Parking**
- `GET /api/parking/zones` — List all parking zones with availability
- `GET /api/parking/zones/{id}/slots` — Get slot grid for a zone
- `POST /api/parking/vehicles` — Register a vehicle
- `POST /api/parking/entry` — Record vehicle entry
- `POST /api/parking/exit` — Record vehicle exit
- `GET /api/parking/sessions/active` — Active parking sessions
- `POST /api/parking/violations` — Report a violation
- `GET /api/parking/analytics/summary` — Parking analytics

**Students**
- `GET /api/students/` — List students
- `GET /api/students/stats` — Student statistics

**Dashboard**
- `GET /api/dashboard/stats` — Overall ERP statistics

---

### 🔧 Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://srm_user:srm_password@localhost:5432/srm_erp
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=your-app-secret-key
ENVIRONMENT=development
JAVA_SERVICE_URL=http://localhost:8080
```

**Java (application.properties)**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/srm_erp
spring.datasource.username=srm_user
spring.datasource.password=srm_password
```

---

### 🏛️ Database Schema

**Core Tables**
- `users` — All system users (students, faculty, admin, security)
- `students` — Student profiles with reg numbers and CGPA
- `faculty` — Faculty profiles with employee IDs
- `departments` — University departments

**Parking Tables**
- `parking_zones` — Parking zone configuration
- `parking_slots` — Individual slot status
- `vehicles` — Registered vehicles
- `parking_permits` — Issued permits
- `parking_sessions` — Entry/exit records
- `parking_violations` — Violation reports

**Academic Tables**
- `courses` — Course catalog
- `attendance` — Student attendance records
- `fee_structures` — Fee definitions
- `fee_payments` — Payment records

---

### 📱 Screenshots

**Dashboard** — Live stats, zone occupancy, recent activity  
**Parking Dashboard** — Visual slot grid with real-time status  
**Analytics** — Hourly traffic charts, weekly trends, zone distribution pie chart  
**Vehicle Management** — Search, filter, verify vehicles  

---

*SRM Institute of Science and Technology — ERP System v1.0*
