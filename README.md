<div align="center">

<!-- SOCIAL PREVIEW -->
<img src="social-preview.png" alt="SRM ERP — Campus Intelligence Platform" width="100%" />

<br/><br/>

<!-- STATUS BADGES -->
![Version](https://img.shields.io/badge/VERSION-2.0.0-6378ff?style=for-the-badge&labelColor=0a0f1a&logo=github)
![Status](https://img.shields.io/badge/STATUS-LIVE-00e5a0?style=for-the-badge&labelColor=0a0f1a)
![License](https://img.shields.io/badge/LICENSE-MIT-f5a623?style=for-the-badge&labelColor=0a0f1a)
![Python](https://img.shields.io/badge/PYTHON-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white&labelColor=0a0f1a)
![React](https://img.shields.io/badge/REACT-18-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0f1a)
![Java](https://img.shields.io/badge/JAVA-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white&labelColor=0a0f1a)
![PostgreSQL](https://img.shields.io/badge/POSTGRESQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=0a0f1a)
![Docker](https://img.shields.io/badge/DOCKER-READY-2496ED?style=for-the-badge&logo=docker&logoColor=white&labelColor=0a0f1a)

<br/>

```
  ███████╗██████╗ ███╗   ███╗    ███████╗██████╗ ██████╗ 
  ██╔════╝██╔══██╗████╗ ████║    ██╔════╝██╔══██╗██╔══██╗
  ███████╗██████╔╝██╔████╔██║    █████╗  ██████╔╝██████╔╝
  ╚════██║██╔══██╗██║╚██╔╝██║    ██╔══╝  ██╔══██╗██╔═══╝ 
  ███████║██║  ██║██║ ╚═╝ ██║    ███████╗██║  ██║██║     
  ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝    ╚══════╝╚═╝  ╚═╝╚═╝     
```

### ◈ SRM Institute of Science and Technology ◈
### **Campus Intelligence Platform — Enterprise Resource Planning v2.0**

*One unified platform powering 30,000+ students, faculty, administration & staff*

[🚀 Live Demo](http://localhost:3000) · [📖 API Docs](http://localhost:8000/api/docs) · [☕ Java Service](http://localhost:8080/swagger-ui.html) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## ◈ Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Feature Matrix](#-feature-matrix)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Production & Load Balancing](#-production--load-balancing)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ◈ Overview

> **SRM ERP** is a next-generation, full-stack enterprise resource planning system engineered for the SRM Institute of Science and Technology. It unifies every campus operation — real-time vehicle parking, social networking with streaks, live bus GPS tracking, virtual meeting rooms, study material hub, and full financial administration — into a single blazing-fast platform.

```
┌─────────────────────────────────────────────────────────────────────┐
│                   CAMPUS INTELLIGENCE PLATFORM v2.0                  │
│                                                                       │
│  🅿 Parking  ·  🔥 Social Feed  ·  🚌 Transport  ·  📚 Study Hub  │
│  🎥 Meeting Rooms  ·  💰 Accounts  ·  👥 Students  ·  📊 Analytics │
└─────────────────────────────────────────────────────────────────────┘
```

### Why SRM ERP?

| ⚡ Performance | 🔴 Real-time | 🔐 Security | 📱 UX |
|---|---|---|---|
| Sub-100ms API responses | Live parking slot grid | JWT + RBAC auth | Futuristic dark UI |
| Async FastAPI + connection pooling | Live bus GPS tracking | bcrypt password hashing | Space Grotesk + Bebas Neue |
| PostgreSQL 16 with query optimization | Live notifications | Role-based route guards | Fully responsive SPA |

---

## ◈ System Architecture

```
                         ┌──────────────────────┐
                         │      Cloudflare       │
                         │  CDN · WAF · DDoS     │
                         └──────────┬────────────┘
                                    │ HTTPS / HTTP2
                         ┌──────────▼────────────┐
                         │   Nginx (Layer 7)      │
                         │   Load Balancer        │
                         │   SSL Termination      │
                         │   Rate Limiting        │
                         └────┬──────────────┬───┘
                              │              │
              ┌───────────────▼──┐      ┌────▼──────────────┐
              │   FastAPI #1     │      │   FastAPI #2       │
              │   Uvicorn ASGI   │      │   Uvicorn ASGI     │
              │   Python 3.12    │      │   Python 3.12      │
              └────────┬─────────┘      └──────┬─────────────┘
                       │                       │
              ┌────────▼───────────────────────▼────────────┐
              │              PostgreSQL 16                    │
              │   Primary Write ──► 2x Read Replicas         │
              │   PgBouncer Connection Pool (max 100)         │
              └────────────────────┬────────────────────────┘
                                   │
              ┌────────────────────▼────────────────────────┐
              │        Java Spring Boot 3.2 Microservice     │
              │   Parking Analytics · Scheduled Jobs         │
              │   @Every30s: Refresh occupancy cache         │
              │   @Every1hr: Flag long-parked vehicles       │
              │   @11PM:     Generate daily reports          │
              └─────────────────────────────────────────────┘

              ┌─────────────────────────────────────────────┐
              │          React 18 SPA (Vite 5)               │
              │   React Router · Recharts · Lucide Icons     │
              │   Space Grotesk + Bebas Neue Typography      │
              └─────────────────────────────────────────────┘
```

---

## ◈ Feature Matrix

| Module | Description | Tech Highlights | Status |
|--------|-------------|-----------------|--------|
| 🅿 **Vehicle Parking** | Real-time slot grid, entry/exit recording, permits, violations, zone analytics | Postgres, Java analytics microservice | ✅ Live |
| 🔥 **Social Feed** | Instagram-style posts, daily streak leaderboard 🔥, whistleblower column 🔔, trending hashtags | React state, optimistic UI | ✅ Live |
| 📚 **Study Hub** | Upload/download materials by subject, star bookmarks, drag-drop upload, sort by rating | File metadata, filtering | ✅ Live |
| 🚌 **Transport** | Live GPS bus tracking with pulsing dot, route stop timeline, seat booking, attendance marking | Real-time simulation | ✅ Live |
| 🎥 **Meeting Rooms** | Video grid, mute/camera controls, live chat bubbles, room types (study/social/fun) | WebRTC-ready UI | ✅ Live |
| 💰 **Accounts** | Finance charts, resource utilization bars, headcount stacked viz, transaction ledger, export | Recharts, 3 sub-sections | ✅ Live |
| 👥 **Students** | Registration tracking, CGPA display, department/year filters | SQLAlchemy ORM | ✅ Live |
| 📊 **Analytics** | Hourly traffic bars, weekly trend lines, zone distribution pie chart | Recharts, Java analytics | ✅ Live |
| 🔐 **Auth / RBAC** | JWT stateless auth, 4 roles, bcrypt hashing, demo mode | PyJWT, bcrypt | ✅ Live |
| 🔔 **Notifications** | Real-time alerts, unread badge, type-based icons | FastAPI, Postgres | ✅ Live |

---

## ◈ Tech Stack

### 🖥 Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2 | UI component framework |
| **Vite** | 5.x | Lightning-fast build tool & HMR |
| **React Router** | 6.x | Client-side routing with guards |
| **Recharts** | 2.x | Data visualization (area, bar, pie, line) |
| **Lucide React** | 0.3x | Consistent icon library |
| **Axios** | 1.x | HTTP client with interceptors |
| **Space Grotesk** | — | Body typography |
| **Bebas Neue** | — | Display / heading typography |
| **JetBrains Mono** | — | Monospaced numbers & code |

### ⚙ Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **FastAPI** | 0.115 | Async REST API framework |
| **Uvicorn** | 0.30 | ASGI production server |
| **SQLAlchemy** | 2.0 | ORM with async support |
| **Pydantic** | 2.9 | Request/response validation |
| **PyJWT** | 2.9 | Stateless JWT authentication |
| **bcrypt** | 4.2 | Password hashing (12 rounds) |
| **psycopg2-binary** | 2.9 | PostgreSQL adapter |
| **email-validator** | 2.2 | Email field validation |
| **python-multipart** | 0.0.12 | File upload support |

### ☕ Java Microservice

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Spring Boot** | 3.2.2 | Microservice foundation |
| **Spring Data JPA** | 3.2 | Repository pattern ORM |
| **Spring Scheduler** | 3.2 | Cron-based analytics refresh |
| **Hibernate** | 6.x | JPA provider |
| **Lombok** | 1.18 | Boilerplate reduction |
| **SpringDoc OpenAPI** | 2.x | Auto Swagger docs |
| **Maven** | 3.9 | Build & dependency management |

### 🏗 Infrastructure

| Technology | Purpose |
|-----------|---------|
| **PostgreSQL 16** | Primary relational database |
| **Docker + Compose** | Container orchestration |
| **Nginx** | Reverse proxy, load balancer, SSL |
| **Redis** *(planned)* | Live occupancy cache + sessions |
| **Kafka** *(planned)* | Parking event streaming |
| **Kubernetes** *(planned)* | Auto-scaling orchestration |

---

## ◈ Quick Start

### 🐳 Option 1 — Docker Compose (One Command)

```bash
# Clone
git clone https://github.com/your-org/srm-erp.git
cd srm-erp

# Launch everything
docker-compose up -d

# Verify services
docker-compose ps
```

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 📖 API Swagger | http://localhost:8000/api/docs |
| ☕ Java Swagger | http://localhost:8080/swagger-ui.html |
| 🐘 PgAdmin | http://localhost:5050 |

---

### 💻 Option 2 — Local Development

**Prerequisites:** Python 3.12 · Node.js 20+ · Java 17+ · PostgreSQL 16

#### Step 1 — Database

```bash
# Create user and database
sudo -u postgres psql -c "CREATE USER srm_user WITH PASSWORD 'srm_password';"
sudo -u postgres psql -c "CREATE DATABASE srm_erp OWNER srm_user;"

# Load schema + seed data
cd database/
psql -U srm_user -d srm_erp -h localhost -f schema.sql
```

#### Step 2 — Backend (FastAPI)

```bash
cd backend/

# Create virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies (Python 3.12 compatible)
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --port 8000
```
> ✅ API running at `http://127.0.0.1:8000`  
> ✅ Interactive docs at `http://127.0.0.1:8000/api/docs`

#### Step 3 — Java Microservice

```bash
cd java-microservice/
mvn spring-boot:run
```
> ✅ Analytics service at `http://localhost:8080`

#### Step 4 — Frontend

```bash
cd frontend/
npm install
npm run dev
```
> ✅ App running at `http://localhost:3000`

---

## ◈ Environment Setup

### `backend/.env`

```env
# ── Database ─────────────────────────────
DATABASE_URL=postgresql://srm_user:srm_password@localhost:5432/srm_erp

# ── Security (CHANGE IN PRODUCTION!) ────
JWT_SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters-long
SECRET_KEY=your-application-secret-key-change-this

# ── App Config ───────────────────────────
ENVIRONMENT=development
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# ── Java Microservice ────────────────────
JAVA_SERVICE_URL=http://localhost:8080

# ── Parking Config ───────────────────────
MAX_SESSION_HOURS=12
DEFAULT_RATE_PER_HOUR=20
```

### `java-microservice/src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/srm_erp
spring.datasource.username=srm_user
spring.datasource.password=srm_password
spring.jpa.hibernate.ddl-auto=validate

# Server
server.port=8080

# Scheduler
parking.analytics.refresh-rate=30000
parking.long-park.threshold-hours=8
```

---

## ◈ API Reference

### Authentication

```http
POST   /api/auth/login              → { token, user }
POST   /api/auth/register           → { token, user }
GET    /api/auth/me                 → Current user profile
POST   /api/auth/logout             → Invalidate session
POST   /api/auth/change-password    → Update password
```

### Vehicle Parking

```http
# Zones
GET    /api/parking/zones                      → All zones + live availability
GET    /api/parking/zones/{id}/slots           → Slot grid for a zone

# Vehicles
GET    /api/parking/vehicles                   → My registered vehicles
POST   /api/parking/vehicles                   → Register a vehicle
PUT    /api/parking/vehicles/{id}/verify       → Admin: verify vehicle
DELETE /api/parking/vehicles/{id}              → Remove vehicle

# Sessions
POST   /api/parking/entry                      → Record vehicle entry
POST   /api/parking/exit                       → Record vehicle exit + charge
GET    /api/parking/sessions/active            → Currently parked vehicles
GET    /api/parking/sessions/history           → Past sessions

# Permits
GET    /api/parking/permits                    → My permits
POST   /api/parking/permits                    → Issue new permit

# Violations
GET    /api/parking/violations                 → Violations list
POST   /api/parking/violations                 → Report violation
PUT    /api/parking/violations/{id}/pay        → Mark fine as paid

# Analytics (Java Microservice)
GET    /api/parking/analytics/summary          → Occupancy summary
GET    /api/parking/analytics/peak-hours       → 7-day hourly analysis
GET    /api/parking/analytics/daily-report     → Daily report
```

### Academic & Admin

```http
GET    /api/students/              → Student list (search, filter by dept/year)
GET    /api/students/stats         → Aggregate statistics
GET    /api/faculty/               → Faculty list
GET    /api/dashboard/stats        → ERP-wide KPIs
GET    /api/notifications/         → User notifications
PUT    /api/notifications/{id}/read
```

### Example Request — Record Vehicle Entry

```bash
curl -X POST http://localhost:8000/api/parking/entry \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicle_number": "TN07CD1234",
    "zone_id":        "uuid-of-zone",
    "notes":          "Semester permit holder"
  }'
```

---

## ◈ Database Schema

```
┌──────────────┐    ┌───────────────┐    ┌──────────────┐
│    users     │───►│   students    │    │  departments │
│ id (UUID PK) │    │ user_id (FK)  │◄───│ id (UUID PK) │
│ email        │    │ reg_number    │    │ name / code  │
│ role         │    │ year / sem    │    └──────────────┘
│ full_name    │    │ cgpa          │
└──────┬───────┘    └───────────────┘
       │
       │  ┌──────────────────┐    ┌───────────────────┐
       ├─►│  parking_zones   │───►│  parking_slots    │
       │  │ zone_name / code │    │ slot_number       │
       │  │ total_slots      │    │ is_occupied       │
       │  │ available_slots  │    │ slot_type         │
       │  │ hourly_rate      │    └───────────────────┘
       │  └─────────┬────────┘
       │            │
       │  ┌─────────▼────────┐    ┌───────────────────┐
       ├─►│    vehicles      │───►│ parking_sessions  │
       │  │ vehicle_number   │    │ entry_time        │
       │  │ vehicle_type     │    │ exit_time         │
       │  │ is_verified      │    │ amount_charged    │
       │  └──────────────────┘    └───────────────────┘
       │
       │  ┌──────────────────┐    ┌───────────────────┐
       ├─►│ parking_permits  │    │parking_violations │
       │  │ permit_number    │    │ violation_type    │
       │  │ permit_type      │    │ fine_amount       │
       │  │ valid_until      │    │ status            │
       │  └──────────────────┘    └───────────────────┘
       │
       └─►│ notifications    │
          │ title / message  │
          │ is_read / type   │
          └──────────────────┘
```

---

## ◈ Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🔴 **Admin** | admin@srmist.edu.in | admin123 | Full system access |
| 🟡 **Faculty** | faculty@srmist.edu.in | faculty123 | Academic + social |
| 🟢 **Student** | student@srmist.edu.in | student123 | Campus features |
| 🔵 **Security** | security@srmist.edu.in | security123 | Parking operations |

> ⚠️ **Change all default passwords before any production deployment.**

---

## ◈ Production & Load Balancing

```nginx
# nginx.conf — Production upstream
upstream srm_api_pool {
    least_conn;                                    # Route to least busy server
    server 10.0.0.10:8000 weight=3;               # Primary API
    server 10.0.0.11:8000 weight=3;               # Secondary API
    server 10.0.0.12:8000 weight=1 backup;        # Hot standby
    keepalive 64;
}

server {
    listen 443 ssl http2;
    server_name erp.srmist.edu.in;

    ssl_certificate     /etc/ssl/srmist.crt;
    ssl_certificate_key /etc/ssl/srmist.key;
    ssl_protocols TLSv1.3;

    # Rate limiting — 100 req/min per IP
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    # Gzip compression
    gzip on;
    gzip_types application/json text/html text/css application/javascript;

    location /api/ {
        proxy_pass         http://srm_api_pool;
        proxy_http_version 1.1;
        proxy_set_header   Connection "";
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_connect_timeout 5s;
        proxy_read_timeout    30s;
    }

    location / {
        root  /var/www/srm-erp/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache static assets aggressively
        location ~* \.(js|css|png|jpg|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Production infrastructure blueprint:**

| Layer | Technology | Config |
|-------|-----------|--------|
| 🌐 CDN / WAF | Cloudflare | Edge caching + DDoS protection |
| ⚖ Load Balancer | Nginx / AWS ALB | Least-connections algorithm |
| 🐍 API Servers | 2–4 × Uvicorn | 4 workers each, gunicorn supervisor |
| 🐘 Database Write | PostgreSQL 16 Primary | 32GB RAM, NVMe SSD |
| 📖 Database Read | 2 × Read Replicas | Streaming replication |
| 🔌 Connection Pool | PgBouncer | Max 200 connections, transaction mode |
| ⚡ Cache | Redis 7 | Parking state + JWT blacklist |
| 📨 Queue | Kafka / Celery | Async tasks, report generation |
| 📦 Orchestration | Kubernetes | HPA, auto-scaling, rolling deploys |
| 📈 Monitoring | Prometheus + Grafana | Alerts on API latency > 200ms |
| 📝 Logging | ELK Stack | Centralized log aggregation |

---

## ◈ Project Structure

```
srm-erp/
│
├── 📁 frontend/                          # React 18 + Vite SPA
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx             # KPI cards + live charts
│   │   │   ├── LoginPage.jsx             # Futuristic auth screen
│   │   │   ├── ParkingDashboard.jsx      # Slot grid + zone overview
│   │   │   ├── VehicleManagement.jsx     # CRUD with verify/delete
│   │   │   ├── ParkingZones.jsx          # Zone config cards
│   │   │   ├── ParkingPermits.jsx        # Permit issuance + tracking
│   │   │   ├── ParkingViolations.jsx     # Violation reports + fines
│   │   │   ├── SocialFeed.jsx            # Feed + streaks + whistleblower
│   │   │   ├── StudyMaterials.jsx        # Upload/browse materials
│   │   │   ├── Transport.jsx             # Live bus GPS + booking
│   │   │   ├── MeetingRooms.jsx          # Video rooms + chat
│   │   │   ├── Accounts.jsx              # Finance / Resources / Headcount
│   │   │   ├── StudentManagement.jsx     # Student registry
│   │   │   └── Analytics.jsx            # Charts dashboard
│   │   ├── 📁 components/
│   │   │   └── Layout.jsx                # Collapsible sidebar + topbar
│   │   ├── 📁 context/
│   │   │   └── AuthContext.jsx           # JWT auth state + demo login
│   │   ├── 📁 services/
│   │   │   └── api.js                    # Axios client + 401 interceptor
│   │   ├── index.css                     # Full design system (CSS vars)
│   │   ├── App.jsx                       # Router + route guards
│   │   └── main.jsx                      # React 18 entry point
│   ├── index.html
│   ├── vite.config.js                    # Proxy /api → :8000
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── nginx.conf
│
├── 📁 backend/                           # FastAPI Python 3.12
│   ├── main.py                           # App factory + routers
│   ├── 📁 app/
│   │   ├── 📁 api/
│   │   │   ├── auth.py                   # Login / register / JWT
│   │   │   ├── parking.py                # Full parking API (zones, sessions, analytics)
│   │   │   ├── students.py
│   │   │   ├── faculty.py
│   │   │   ├── dashboard.py
│   │   │   ├── fees.py
│   │   │   ├── attendance.py
│   │   │   └── notifications.py
│   │   ├── 📁 db/
│   │   │   └── database.py               # SQLAlchemy 2.0 models (Numeric, not Decimal)
│   │   └── 📁 core/
│   │       └── config.py                 # Pydantic v2 settings
│   ├── requirements.txt                  # Pinned for Python 3.12
│   └── Dockerfile
│
├── 📁 java-microservice/                 # Spring Boot 3.2
│   ├── 📁 src/main/java/com/srm/parking/
│   │   ├── ParkingMicroserviceApplication.java
│   │   ├── 📁 controller/
│   │   │   └── ParkingController.java    # REST endpoints + Swagger
│   │   ├── 📁 service/
│   │   │   └── ParkingAnalyticsService.java  # @Scheduled jobs
│   │   ├── 📁 model/
│   │   │   ├── ParkingSession.java
│   │   │   └── ParkingZone.java
│   │   └── 📁 repository/
│   │       └── ParkingSessionRepository.java
│   ├── 📁 src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── Dockerfile
│
├── 📁 database/
│   └── schema.sql                        # Full schema + seed data (6 zones, departments)
│
├── docker-compose.yml                    # Full stack: pg + api + java + frontend + nginx
├── README.md                             # This file
├── .gitignore                            # Comprehensive ignore rules
├── social-preview.png                    # GitHub social preview (1280×640)
└── FIXES_AND_UPGRADES.md                 # Patch notes v2.0
```

---

## ◈ Roadmap

- [x] Vehicle Parking System (zones, slots, permits, violations)
- [x] Social Feed with Streaks + Whistleblower
- [x] Transport Live Tracking + Attendance
- [x] Meeting Rooms with Video Grid + Chat
- [x] Accounts: Finance / Resources / Headcount
- [x] Study Hub with Upload + Bookmarks
- [ ] WebSocket real-time parking slot updates
- [ ] Redis caching for live occupancy state
- [ ] Biometric / QR-code based parking gate entry
- [ ] Mobile app — React Native (iOS + Android)
- [ ] AI-powered parking demand prediction (ML model)
- [ ] Kafka event streaming pipeline
- [ ] Kubernetes Helm chart for 1-command cluster deploy
- [ ] E2E test suite with Playwright
- [ ] Multi-campus support (SRM Chennai, Delhi, Amaravati)
- [ ] Parent portal with fee payment integration

---

## ◈ Contributing

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/<your-username>/srm-erp.git
cd srm-erp

# 3. Create a feature branch
git checkout -b feat/your-feature-name

# 4. Make your changes, then commit
git add .
git commit -m "feat: add WebSocket parking updates"

# 5. Push and open a Pull Request
git push origin feat/your-feature-name
```

**Commit message convention:**

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation update |
| `refactor:` | Code restructure (no behavior change) |
| `perf:` | Performance improvement |
| `test:` | Adding or updating tests |
| `chore:` | Build process / dependency updates |

---

## ◈ License

```
MIT License

Copyright (c) 2025 SRM Institute of Science and Technology

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**◈ Built for SRM Institute of Science and Technology ◈**

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=flat-square&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white)

*SRM ERP — Campus Intelligence Platform · v2.0.0*

</div>
