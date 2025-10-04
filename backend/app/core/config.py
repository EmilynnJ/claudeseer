from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./soulseer.db"
    
    # Clerk Authentication (Optional)
    CLERK_SECRET_KEY: Optional[str] = None
    VITE_CLERK_PUBLISHABLE_KEY: Optional[str] = None
    
    # Stripe (Optional for development)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    
    # WebRTC
    TURN_SERVERS: str = "relay1.expressturn.com:3480"
    TURN_USERNAME: str = "your_username"
    TURN_CREDENTIAL: str = "your_credential"
    WEBRTC_ICE_SERVERS: str = '[{"urls":"stun:stun.l.google.com:19302"}]'
    
    # JWT
    JWT_SECRET: str = "your-super-secret-jwt-key-change-this-in-production"
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
