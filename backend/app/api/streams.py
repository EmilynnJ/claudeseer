from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..core.database import SessionLocal
from ..models.stream import LiveStream
from ..models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/live")
async def get_live_streams(db: Session = Depends(get_db)):
    streams = db.query(LiveStream).filter(LiveStream.is_live == True).all()
    
    stream_list = []
    for stream in streams:
        reader = db.query(User).filter(User.id == stream.reader_id).first()
        stream_list.append({
            "id": stream.id,
            "reader": f"{reader.first_name} {reader.last_name}",
            "title": stream.title,
            "viewers": stream.viewer_count,
            "category": "Tarot"
        })
    
    return stream_list

@router.get("/scheduled")
async def get_scheduled_streams(db: Session = Depends(get_db)):
    streams = db.query(LiveStream).filter(
        LiveStream.is_live == False,
        LiveStream.scheduled_start.isnot(None)
    ).all()
    
    stream_list = []
    for stream in streams:
        reader = db.query(User).filter(User.id == stream.reader_id).first()
        stream_list.append({
            "id": stream.id,
            "reader": f"{reader.first_name} {reader.last_name}",
            "title": stream.title,
            "scheduledFor": stream.scheduled_start.isoformat(),
            "category": "Astrology"
        })
    
    return stream_list
