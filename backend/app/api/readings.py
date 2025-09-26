from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from pydantic import BaseModel

from ..core.database import SessionLocal
from ..models.user import User
from ..models.reading import ReadingSession, SessionType, SessionStatus
from .auth import security, verify_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SessionRequest(BaseModel):
    reader_id: int
    session_type: SessionType

@router.get("/")
async def get_readers(
    specialty: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Get all reader users
    query = db.query(User).filter(User.role == "reader")
    
    if status:
        # Filter by online status if provided
        pass  # Would join with reader status table
    
    readers = query.all()
    
    reader_list = []
    for reader in readers:
        reader_list.append({
            "id": reader.id,
            "name": f"{reader.first_name} {reader.last_name}",
            "specialty": "Tarot",  # Would come from reader profile
            "rating": 4.8,  # Would be calculated
            "rate": 4.99,  # Would come from reader rates
            "status": "online"  # Would come from reader status
        })
    
    return reader_list

@router.post("/request")
async def request_reading(
    session_data: SessionRequest,
    token: str = Depends(security),
    db: Session = Depends(get_db)
):
    user_info = await verify_token(token, db)
    client_id = user_info["user"]["id"]
    
    # Check client balance
    client = db.query(User).filter(User.id == client_id).first()
    if client.balance < 5.0:  # Minimum balance check
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create reading session
    session = ReadingSession(
        client_id=client_id,
        reader_id=session_data.reader_id,
        type=session_data.session_type,
        status=SessionStatus.PENDING,
        rate_per_minute=4.99  # Would get from reader rates
    )
    
    db.add(session)
    db.commit()
    db.refresh(session)
    
    return {"session_id": session.id, "status": "pending"}

@router.get("/online")
async def get_online_readers(db: Session = Depends(get_db)):
    # Would typically check reader status table
    readers = db.query(User).filter(User.role == "reader").limit(10).all()
    
    online_readers = []
    for reader in readers:
        online_readers.append({
            "id": reader.id,
            "name": f"{reader.first_name} {reader.last_name}",
            "specialty": "Tarot Reading",
            "rating": 4.8,
            "rate": 4.99,
            "status": "online"
        })
    
    return online_readers
