from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    CLIENT = "client"
    READER = "reader"
    ADMIN = "admin"

class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CLIENT)
    status = Column(Enum(UserStatus), default=UserStatus.ACTIVE)
    balance = Column(Float, default=0.0)
    auto_reload_enabled = Column(Boolean, default=False)
    auto_reload_amount = Column(Float, default=25.0)
    auto_reload_threshold = Column(Float, default=5.0)
    stripe_customer_id = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Reader(Base):
    __tablename__ = "readers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    display_name = Column(String)
    bio = Column(Text)
    specialties = Column(Text)  # JSON array as text
    chat_rate = Column(Float)
    phone_rate = Column(Float)
    video_rate = Column(Float)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_sessions = Column(Integer, default=0)
    status = Column(String, default="offline")  # online, offline, busy
    stripe_account_id = Column(String)
    profile_image = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
