# SRM ERP — Fixes & Upgrades v2.0

## 🔧 Bug Fixes Applied

### 1. Backend: `ImportError: cannot import name 'Decimal' from 'sqlalchemy'`
**Root cause:** SQLAlchemy 2.x removed `Decimal` from top-level imports.  
**Fix in `backend/app/db/database.py`:**
```python
# BEFORE (broken):
from sqlalchemy import ..., Decimal, ...
from sqlalchemy.ext.declarative import declarative_base

# AFTER (fixed):
from sqlalchemy import ..., Numeric, ...
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
```
All `Decimal(x,y)` column types replaced with `Numeric(x,y)`.

### 2. Frontend: CSS not loading
**Root cause:** Google Fonts CDN loaded in `index.html` AFTER the CSS file, causing FOUT. Tailwind classes were also conflicting with custom CSS variables.  
**Fix:** Rebuilt entire CSS with pure CSS variables, no Tailwind dependency for core styles, Google Fonts preloaded correctly.

### 3. Python 3.12 compatibility
**Fix in `requirements.txt`:** Pinned all packages to Python 3.12-compatible versions. Removed `passlib` (use `bcrypt` directly), removed `python-jose` (use `PyJWT`).

---

## ✨ New Features Added

### 1. 📚 Study Hub (`/study`)
- Upload & browse study materials (PDF, PPT, Video, ZIP)
- Filter by subject, sort by date/downloads/rating
- Star/bookmark favorites
- Upload interface with drag-drop zone

### 2. 🔥 Social Feed (`/social`) — Instagram-style
- Post types: Regular, Announcement, Whistleblower 🔔, Achievement
- Like, comment, share, bookmark reactions
- **Streak system** — daily engagement streak with fire leaderboard
- Trending hashtags sidebar
- Anonymous whistleblower posts for campus issues

### 3. 🚌 Transport Management (`/transport`)
- **Live bus tracking** with real-time GPS simulation (pulsing dot indicator)
- Speed, occupancy, ETA for each bus
- Route planning with stop-by-stop timeline
- Bus booking system
- **Attendance marking** for morning/evening routes

### 4. 🎥 Meeting Rooms (`/rooms`)
- Room types: Study, Social, Discussion, Fun
- Live room occupancy
- **In-room experience:** 6-person video grid, mute/camera controls
- Real-time chat with message bubbles
- Create custom rooms

### 5. 💼 Accounts (`/accounts`) — Three Sections
- **Finance:** Revenue charts, monthly collection bar chart, fee breakdown donut, recent transactions ledger
- **Resources:** Lab equipment, library, classrooms, computers utilization
- **Headcount:** Students, faculty, staff, parents, workers — with stacked bar visualization
- Export & Report generation buttons

### 6. 🎨 Complete UI Redesign
- **Aesthetic:** Neo-Corporate Dark with electric indigo + gold palette
- **Fonts:** Space Grotesk (body) + Bebas Neue (display) + JetBrains Mono (numbers/code)
- **Sidebar:** Collapsible icon rail → expanded nav
- **Ambient glows:** Atmospheric background orbs
- **All CSS:** Pure CSS custom properties (zero Tailwind dependency issues)

---

## 🏗️ Tech Stack & Load Balancing Notes

### Current Stack
| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite | Code splitting per route |
| API Gateway | FastAPI | Async, supports 10k+ req/s |
| Microservice | Spring Boot 3.2 | Separate analytics + scheduling |
| Database | PostgreSQL 16 | Connection pooling (pool_size=10) |

### Recommended Production Stack (Load Balancing)
```
                    ┌─────────────────┐
                    │   Cloudflare    │  ← DDoS protection + CDN
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Nginx (Layer 7)│  ← SSL termination, rate limiting
                    │   Load Balancer │  ← Round-robin / least-conn
                    └────┬───────┬────┘
                         │       │
              ┌──────────▼─┐  ┌──▼──────────┐
              │ FastAPI #1  │  │ FastAPI #2  │  ← Horizontal scaling
              │ (Uvicorn)   │  │ (Uvicorn)   │    (add more as needed)
              └──────┬──────┘  └──────┬──────┘
                     │                │
              ┌──────▼────────────────▼──────┐
              │        PostgreSQL             │
              │  Primary → Read Replicas      │  ← Read scaling
              │  PgBouncer (connection pool)  │
              └──────────────────────────────┘
```

**Key recommendations:**
- Use **Redis** for session caching and real-time parking updates
- **Celery** workers for background tasks (report generation)
- **WebSocket** via FastAPI for live parking slot updates
- **Kafka** for event streaming (entry/exit events → analytics)
- Deploy with **Kubernetes** for auto-scaling based on load
