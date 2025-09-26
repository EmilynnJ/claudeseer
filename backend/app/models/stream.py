from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean
from sqlalchemy.sql import func
from .user import Base

class LiveStream(Base):
    __tablename__ = "live_streams"
    
    id = Column(Integer, primary_key=True, index=True)
    reader_id = Column(Integer, index=True)
    title = Column(String)
    description = Column(Text)
    is_live = Column(Boolean, default=False)
    viewer_count = Column(Integer, default=0)
    total_gifts = Column(Float, default=0.0)
    stream_key = Column(String)
    thumbnail_url = Column(String)
    scheduled_start = Column(DateTime)
    started_at = Column(DateTime)
    ended_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())

class StreamGift(Base):
    __tablename__ = "stream_gifts"
    
    id = Column(Integer, primary_key=True, index=True)
    stream_id = Column(Integer, index=True)
    sender_id = Column(Integer, index=True)
    gift_type = Column(String)
    amount = Column(Float)
    message = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
