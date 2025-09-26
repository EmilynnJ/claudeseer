from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean, Enum
from sqlalchemy.sql import func
import enum
from .user import Base

class SessionType(str, enum.Enum):
    CHAT = "chat"
    PHONE = "phone"
    VIDEO = "video"

class SessionStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class ReadingSession(Base):
    __tablename__ = "reading_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, index=True)
    reader_id = Column(Integer, index=True)
    type = Column(Enum(SessionType))
    status = Column(Enum(SessionStatus), default=SessionStatus.PENDING)
    rate_per_minute = Column(Float)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    duration_minutes = Column(Integer, default=0)
    total_cost = Column(Float, default=0.0)
    session_notes = Column(Text)
    client_rating = Column(Integer)
    client_review = Column(Text)
    reader_notes = Column(Text)
    webrtc_room_id = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, index=True)
    sender_id = Column(Integer, index=True)
    content = Column(Text)
    timestamp = Column(DateTime, server_default=func.now())
