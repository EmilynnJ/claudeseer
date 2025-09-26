from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
import stripe

from ..core.database import SessionLocal
from ..models.user import User
from ..models.reading import ReadingSession
from ..models.payment import Transaction
from ..core.config import settings
from .auth import security, verify_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/balance")
async def get_user_balance(token: str = Depends(security), db: Session = Depends(get_db)):
    user_info = await verify_token(token, db)
    user = db.query(User).filter(User.id == user_info["user"]["id"]).first()
    
    return {"balance": user.balance}

@router.get("/sessions")
async def get_user_sessions(token: str = Depends(security), db: Session = Depends(get_db)):
    user_info = await verify_token(token, db)
    
    sessions = db.query(ReadingSession).filter(
        ReadingSession.client_id == user_info["user"]["id"],
        ReadingSession.status == "completed"
    ).order_by(desc(ReadingSession.end_time)).limit(20).all()
    
    session_list = []
    for session in sessions:
        reader = db.query(User).filter(User.id == session.reader_id).first()
        session_list.append({
            "id": session.id,
            "readerName": f"{reader.first_name} {reader.last_name}",
            "type": session.type,
            "duration": session.duration_minutes,
            "totalCost": session.total_cost,
            "endTime": session.end_time.isoformat(),
            "rating": session.client_rating
        })
    
    return session_list

@router.get("/favorites")
async def get_user_favorites(token: str = Depends(security), db: Session = Depends(get_db)):
    user_info = await verify_token(token, db)
    
    # This would typically come from a favorites table
    # For now, return empty array
    return []

@router.get("/upcoming")
async def get_upcoming_sessions(token: str = Depends(security), db: Session = Depends(get_db)):
    user_info = await verify_token(token, db)
    
    sessions = db.query(ReadingSession).filter(
        ReadingSession.client_id == user_info["user"]["id"],
        ReadingSession.status == "pending"
    ).order_by(ReadingSession.start_time).all()
    
    session_list = []
    for session in sessions:
        reader = db.query(User).filter(User.id == session.reader_id).first()
        session_list.append({
            "id": session.id,
            "reader": f"{reader.first_name} {reader.last_name}",
            "scheduledTime": session.start_time.isoformat(),
            "type": session.type
        })
    
    return session_list
