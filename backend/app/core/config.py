from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Clerk Authentication
    CLERK_SECRET_KEY: str
    VITE_CLERK_PUBLISHABLE_KEY: str
    
    # Stripe
    STRIPE_SECRET_KEY: str
    STRIPE_PUBLISHABLE_KEY: str
    STRIPE_WEBHOOK_SECRET: str
    
    # WebRTC
    TURN_SERVERS: str
    TURN_USERNAME: str
    TURN_CREDENTIAL: str
    WEBRTC_ICE_SERVERS: str
    
    # JWT
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # App Settings
    DEBUG: bool = True
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
