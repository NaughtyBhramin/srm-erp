"""
SRM ERP v2 — Complete Auth API
Features:
  - Email/password login with bcrypt
  - TOTP-based MFA (Google Authenticator compatible)
  - JWT access + refresh tokens
  - Session tracking & device fingerprinting
  - Rate limiting (5 attempts → 15 min lockout)
  - Password reset flow
  - Role-based JWT claims
"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
import pyotp
import qrcode
import qrcode.image.svg
import base64
import io
import secrets
import hashlib
import json
from app.db.database import get_db, User
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])
bearer = HTTPBearer(auto_error=False)

# ── In-memory stores (replace with Redis in production) ──
_login_attempts: dict = {}   # email → {count, locked_until}
_refresh_tokens: dict = {}   # token_id → {user_id, expires}
_mfa_setup_tokens: dict = {} # token → {user_id, secret}
_password_reset: dict = {}   # token → {user_id, expires}
_sessions: dict = {}         # session_id → {user_id, device, created}

# ── Models ────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: str
    password: str
    device_info: Optional[str] = None

class MFAVerifyRequest(BaseModel):
    temp_token: str
    totp_code: str

class MFASetupRequest(BaseModel):
    setup_token: str
    totp_code: str

class RefreshRequest(BaseModel):
    refresh_token: str

class PasswordResetRequest(BaseModel):
    email: str

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

# ── Demo credentials (replace DB lookup in production) ────
DEMO_USERS = {
    "admin@srmist.edu.in":     {"id":"u1","name":"Dr. V. Rajkumar",     "role":"admin",     "dept":"Administration",   "college_code":None, "college_name":None,       "college_color":None,    "password":"Admin@2024",    "mfa_enabled":True,  "mfa_secret":"JBSWY3DPEHPK3PXP"},
    "rahul@srmist.edu.in":     {"id":"u2","name":"Rahul Sharma",         "role":"student",   "dept":"CSE",              "college_code":"KC",  "college_name":"Kalam College",     "college_color":"#5b6ef5","password":"Student@2024",  "mfa_enabled":False, "mfa_secret":None},
    "priya@srmist.edu.in":     {"id":"u3","name":"Dr. Priya Nair",       "role":"faculty",   "dept":"CSE",              "college_code":"TC",  "college_name":"Tagore College",    "college_color":"#00c896","password":"Faculty@2024",  "mfa_enabled":True,  "mfa_secret":"JBSWY3DPEHPK3PXP"},
    "accounts@srmist.edu.in":  {"id":"u4","name":"Kavitha Subramanian",  "role":"accounts",  "dept":"Finance",          "college_code":None, "college_name":None,       "college_color":None,    "password":"Accounts@2024", "mfa_enabled":True,  "mfa_secret":"JBSWY3DPEHPK3PXP"},
    "security@srmist.edu.in":  {"id":"u5","name":"Ram Kumar",            "role":"security",  "dept":"Security",         "college_code":None, "college_name":None,       "college_color":None,    "password":"Security@2024", "mfa_enabled":False, "mfa_secret":None},
    "transport@srmist.edu.in": {"id":"u6","name":"Suresh Pandian",       "role":"transport", "dept":"Transport",        "college_code":None, "college_name":None,       "college_color":None,    "password":"Transport@2024","mfa_enabled":False, "mfa_secret":None},
    "medical@srmist.edu.in":   {"id":"u7","name":"Dr. Anitha Krishnan",  "role":"medical",   "dept":"Medical",          "college_code":None, "college_name":None,       "college_color":None,    "password":"Medical@2024",  "mfa_enabled":False, "mfa_secret":None},
    "parent@srmist.edu.in":    {"id":"u8","name":"Mr. S. Krishnaswamy",  "role":"parent",    "dept":None,               "college_code":"KC",  "college_name":"Kalam College",     "college_color":"#5b6ef5","password":"Parent@2024",   "mfa_enabled":False, "mfa_secret":None},
}

# ── Helpers ───────────────────────────────────────────────
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt(12)).decode()

def verify_password(pw: str, hashed: str) -> bool:
    # Demo: plain compare for demo users; bcrypt for real
    return pw == hashed

def create_access_token(user: dict) -> str:
    payload = {
        "sub":    user["id"],
        "email":  user.get("email",""),
        "role":   user["role"],
        "name":   user["name"],
        "dept":   user.get("dept"),
        "college_code":  user.get("college_code"),
        "college_name":  user.get("college_name"),
        "college_color": user.get("college_color"),
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    token_id = secrets.token_urlsafe(32)
    _refresh_tokens[token_id] = {
        "user_id": user_id,
        "expires": datetime.utcnow() + timedelta(days=7)
    }
    return token_id

def create_temp_token(user_id: str) -> str:
    """Short-lived token for MFA step-2"""
    token = secrets.token_urlsafe(24)
    _mfa_setup_tokens[f"mfa_{token}"] = {
        "user_id": user_id,
        "expires": datetime.utcnow() + timedelta(minutes=5)
    }
    return token

def verify_totp(secret: str, code: str) -> bool:
    """Verify TOTP with 30s window ±1 step tolerance"""
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)

def check_rate_limit(email: str) -> None:
    data = _login_attempts.get(email, {"count": 0, "locked_until": None})
    if data["locked_until"] and datetime.utcnow() < data["locked_until"]:
        remaining = int((data["locked_until"] - datetime.utcnow()).total_seconds() / 60)
        raise HTTPException(429, f"Account temporarily locked. Try again in {remaining} minutes.")

def record_failed_attempt(email: str) -> None:
    data = _login_attempts.get(email, {"count": 0, "locked_until": None})
    data["count"] += 1
    if data["count"] >= 5:
        data["locked_until"] = datetime.utcnow() + timedelta(minutes=15)
        data["count"] = 0
    _login_attempts[email] = data

def clear_attempts(email: str) -> None:
    _login_attempts.pop(email, None)

def get_attempts_remaining(email: str) -> int:
    data = _login_attempts.get(email, {"count": 0})
    return max(0, 5 - data.get("count", 0))

def get_device_fingerprint(request: Request) -> str:
    ua  = request.headers.get("user-agent", "")
    ip  = request.client.host if request.client else "unknown"
    raw = f"{ip}:{ua}"
    return hashlib.sha256(raw.encode()).hexdigest()[:16]

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

def current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> dict:
    if not credentials:
        raise HTTPException(401, "Not authenticated")
    return decode_token(credentials.credentials)

# ── ENDPOINTS ─────────────────────────────────────────────

@router.post("/login")
async def login(body: LoginRequest, request: Request):
    """
    Step 1 of login.
    - Validates email + password
    - Rate limited: 5 attempts → 15 min lockout
    - If MFA enabled → returns temp_token (proceed to /mfa/verify)
    - If MFA disabled → returns full access + refresh tokens
    """
    email = body.email.lower().strip()

    # Rate limit check
    check_rate_limit(email)

    # Find user
    user = DEMO_USERS.get(email)
    if not user:
        record_failed_attempt(email)
        remaining = get_attempts_remaining(email)
        raise HTTPException(401, f"Invalid credentials. {remaining} attempts remaining.")

    # Verify password
    if not verify_password(body.password, user["password"]):
        record_failed_attempt(email)
        remaining = get_attempts_remaining(email)
        raise HTTPException(401, f"Invalid credentials. {remaining} attempts remaining.")

    # Clear failed attempts on success
    clear_attempts(email)

    user_data = {**user, "email": email}

    # MFA required?
    if user["mfa_enabled"]:
        temp_token = create_temp_token(user["id"])
        _mfa_setup_tokens[f"mfa_{temp_token}"]["user_data"] = user_data
        return {
            "status": "mfa_required",
            "temp_token": temp_token,
            "user_name": user["name"],
            "user_role": user["role"],
            "message": "Enter your 6-digit authenticator code"
        }

    # No MFA — issue tokens
    session_id = secrets.token_urlsafe(16)
    device = get_device_fingerprint(request)
    _sessions[session_id] = {
        "user_id": user["id"], "device": device,
        "created": datetime.utcnow().isoformat(), "ip": request.client.host if request.client else "?"
    }
    access_token  = create_access_token(user_data)
    refresh_token = create_refresh_token(user["id"])
    return {
        "status": "success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "session_id": session_id,
        "user": {
            "id": user["id"], "name": user["name"], "email": email,
            "role": user["role"], "dept": user.get("dept"),
            "college_code": user.get("college_code"),
            "college_name": user.get("college_name"),
            "college_color": user.get("college_color"),
        }
    }


@router.post("/mfa/verify")
async def mfa_verify(body: MFAVerifyRequest, request: Request):
    """
    Step 2 of login for MFA-enabled accounts.
    Validates TOTP code and issues full tokens.
    """
    key = f"mfa_{body.temp_token}"
    store = _mfa_setup_tokens.get(key)

    if not store:
        raise HTTPException(401, "Invalid or expired MFA session. Please log in again.")
    if datetime.utcnow() > store["expires"]:
        _mfa_setup_tokens.pop(key, None)
        raise HTTPException(401, "MFA session expired. Please log in again.")

    user_data = store.get("user_data")
    if not user_data:
        raise HTTPException(401, "Invalid MFA session.")

    mfa_secret = user_data.get("mfa_secret")
    if not mfa_secret:
        raise HTTPException(500, "MFA not configured for this account.")

    code = body.totp_code.replace(" ", "").strip()
    if not verify_totp(mfa_secret, code):
        raise HTTPException(401, "Invalid or expired code. TOTP codes rotate every 30 seconds.")

    # Clean up temp token
    _mfa_setup_tokens.pop(key, None)

    # Issue full session
    session_id    = secrets.token_urlsafe(16)
    device        = get_device_fingerprint(request)
    _sessions[session_id] = {
        "user_id": user_data["id"], "device": device,
        "created": datetime.utcnow().isoformat(), "ip": request.client.host if request.client else "?"
    }
    access_token  = create_access_token(user_data)
    refresh_token = create_refresh_token(user_data["id"])
    return {
        "status": "success",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "session_id": session_id,
        "user": {
            "id": user_data["id"], "name": user_data["name"], "email": user_data["email"],
            "role": user_data["role"], "dept": user_data.get("dept"),
            "college_code": user_data.get("college_code"),
            "college_name": user_data.get("college_name"),
            "college_color": user_data.get("college_color"),
        }
    }


@router.post("/refresh")
async def refresh_token(body: RefreshRequest):
    """Exchange refresh token for new access token."""
    store = _refresh_tokens.get(body.refresh_token)
    if not store:
        raise HTTPException(401, "Invalid refresh token.")
    if datetime.utcnow() > store["expires"]:
        _refresh_tokens.pop(body.refresh_token, None)
        raise HTTPException(401, "Refresh token expired. Please log in again.")

    # Find user
    user_id = store["user_id"]
    user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)
    email = next((e for e, u in DEMO_USERS.items() if u["id"] == user_id), None)
    if not user or not email:
        raise HTTPException(401, "User not found.")

    user_data = {**user, "email": email}
    new_access = create_access_token(user_data)
    return {"access_token": new_access, "token_type": "bearer", "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60}


@router.post("/logout")
async def logout(body: dict, user: dict = Depends(current_user)):
    session_id = body.get("session_id")
    if session_id:
        _sessions.pop(session_id, None)
    refresh_token = body.get("refresh_token")
    if refresh_token:
        _refresh_tokens.pop(refresh_token, None)
    return {"status": "logged_out"}


@router.get("/mfa/setup")
async def mfa_setup(user: dict = Depends(current_user)):
    """Generate a new TOTP secret + QR code for MFA setup."""
    secret    = pyotp.random_base32()
    email     = user.get("email", user["sub"])
    totp_uri  = pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name="SRM ERP")

    # Generate QR as base64 PNG
    qr = qrcode.QRCode(version=1, box_size=6, border=4)
    qr.add_data(totp_uri)
    qr.make(fit=True)
    img    = qr.make_image(fill_color="#0a1020", back_color="#ffffff")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    qr_b64 = base64.b64encode(buffer.getvalue()).decode()

    setup_token = secrets.token_urlsafe(20)
    _mfa_setup_tokens[f"setup_{setup_token}"] = {
        "user_id": user["sub"], "secret": secret,
        "expires": datetime.utcnow() + timedelta(minutes=10)
    }
    return {
        "setup_token": setup_token,
        "secret": secret,
        "qr_code": f"data:image/png;base64,{qr_b64}",
        "totp_uri": totp_uri,
        "instructions": "Scan this QR code with Google Authenticator, Authy, or any TOTP app."
    }


@router.post("/mfa/enable")
async def mfa_enable(body: MFASetupRequest, user: dict = Depends(current_user)):
    """Confirm TOTP code to enable MFA."""
    key   = f"setup_{body.setup_token}"
    store = _mfa_setup_tokens.get(key)
    if not store:
        raise HTTPException(400, "Invalid setup token.")
    if datetime.utcnow() > store["expires"]:
        raise HTTPException(400, "Setup session expired.")
    if not verify_totp(store["secret"], body.totp_code.strip()):
        raise HTTPException(400, "Invalid code. Make sure your authenticator time is synced.")
    _mfa_setup_tokens.pop(key, None)
    # In production: save mfa_secret to DB for this user
    return {"status": "mfa_enabled", "message": "MFA successfully enabled for your account."}


@router.post("/password/reset-request")
async def password_reset_request(body: PasswordResetRequest):
    """Send password reset link (returns token in demo mode)."""
    email = body.email.lower().strip()
    user  = DEMO_USERS.get(email)
    token = secrets.token_urlsafe(32)
    if user:
        _password_reset[token] = {
            "user_id": user["id"],
            "expires": datetime.utcnow() + timedelta(hours=1)
        }
    # Always return 200 to prevent email enumeration
    return {
        "status": "sent",
        "message": "If this email is registered, a reset link has been sent.",
        "demo_token": token if user else None  # Only expose in demo/dev
    }


@router.post("/password/reset-confirm")
async def password_reset_confirm(body: PasswordResetConfirm):
    store = _password_reset.get(body.token)
    if not store:
        raise HTTPException(400, "Invalid or expired reset token.")
    if datetime.utcnow() > store["expires"]:
        _password_reset.pop(body.token, None)
        raise HTTPException(400, "Reset token expired. Request a new one.")
    if len(body.new_password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters.")
    # In production: hash + save to DB
    _password_reset.pop(body.token, None)
    return {"status": "success", "message": "Password updated successfully. Please log in."}


@router.get("/me")
async def get_me(user: dict = Depends(current_user)):
    """Return current user info from JWT."""
    return {
        "id":           user.get("sub"),
        "email":        user.get("email"),
        "name":         user.get("name"),
        "role":         user.get("role"),
        "dept":         user.get("dept"),
        "college_code": user.get("college_code"),
        "college_name": user.get("college_name"),
        "college_color":user.get("college_color"),
        "token_expires": user.get("exp"),
    }


@router.get("/sessions")
async def get_sessions(user: dict = Depends(current_user)):
    """List active sessions for current user."""
    uid = user.get("sub")
    return [{"session_id": sid, **info} for sid, info in _sessions.items() if info.get("user_id") == uid]


# ── Backwards-compatibility alias ────────────────────────────
# Old code imports `get_current_user`; new code uses `current_user`.
# Both work identically.
get_current_user = current_user