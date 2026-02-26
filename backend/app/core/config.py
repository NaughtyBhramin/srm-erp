"""
Application Configuration Settings
"""
from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "SRM University ERP System"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "srm-erp-secret-key-2024-change-in-production")
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://srm_user:srm_password@localhost:5432/srm_erp"
    )
    
    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "srm-jwt-secret-2024")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8  # 8 hours
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    
    # Java Microservice
    JAVA_SERVICE_URL: str = os.getenv("JAVA_SERVICE_URL", "http://localhost:8080")
    
    # Parking Settings
    PARKING_GRACE_PERIOD_MINUTES: int = 15
    MAX_VIOLATIONS_BEFORE_SUSPENSION: int = 3
    
    # University Info
    UNIVERSITY_NAME: str = "SRM Institute of Science and Technology"
    UNIVERSITY_CODE: str = "SRMIST"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
