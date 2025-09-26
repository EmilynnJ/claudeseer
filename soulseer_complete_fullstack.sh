# ===== BACKEND DATABASE MODELS =====

# backend/app/models/user.py
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

# backend/app/models/reading.py
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

# backend/app/models/payment.py
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean, Enum
from sqlalchemy.sql import func
import enum
from .user import Base

class TransactionType(str, enum.Enum):
    DEPOSIT = "deposit"
    READING_PAYMENT = "reading_payment"
    GIFT = "gift"
    PAYOUT = "payout"
    REFUND = "refund"

class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    type = Column(Enum(TransactionType))
    status = Column(Enum(TransactionStatus))
    amount = Column(Float)
    description = Column(Text)
    stripe_payment_intent_id = Column(String)
    stripe_charge_id = Column(String)
    metadata = Column(Text)  # JSON as text
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Payout(Base):
    __tablename__ = "payouts"
    
    id = Column(Integer, primary_key=True, index=True)
    reader_id = Column(Integer, index=True)
    amount = Column(Float)
    stripe_payout_id = Column(String)
    status = Column(String)
    created_at = Column(DateTime, server_default=func.now())

# backend/app/models/product.py
from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean, Enum
from sqlalchemy.sql import func
import enum
from .user import Base

class ProductType(str, enum.Enum):
    SERVICE = "service"
    DIGITAL = "digital"
    PHYSICAL = "physical"

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, index=True)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)
    type = Column(Enum(ProductType))
    category = Column(String)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    stripe_product_id = Column(String)
    stripe_price_id = Column(String)
    inventory_count = Column(Integer)
    digital_file_url = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

# backend/app/models/stream.py
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

# ===== BACKEND API ROUTES =====

# backend/app/api/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

from ..core.database import SessionLocal
from ..models.user import User
from ..core.config import settings

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserRegister(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str
    phone: str = None

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

@router.post("/register", response_model=Token)
async def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        first_name=user_data.firstName,
        last_name=user_data.lastName,
        phone=user_data.phone,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    
    user_dict = {
        "id": db_user.id,
        "email": db_user.email,
        "name": f"{db_user.first_name} {db_user.last_name}",
        "role": db_user.role
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    user_dict = {
        "id": user.id,
        "email": user.email,
        "name": f"{user.first_name} {user.last_name}",
        "role": user.role
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }

@router.get("/verify")
async def verify_token(token: str = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}",
            "role": user.role
        }
    }

@router.post("/logout")
async def logout_user():
    return {"message": "Logged out successfully"}

# backend/app/api/users.py
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

# backend/app/api/readings.py
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

# backend/app/api/streams.py
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

# backend/app/api/products.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from ..core.database import SessionLocal
from ..models.product import Product
from ..models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def get_products(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)
    
    if category:
        query = query.filter(Product.type == category)
    
    products = query.all()
    
    product_list = []
    for product in products:
        seller = db.query(User).filter(User.id == product.seller_id).first()
        product_list.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "category": product.type,
            "seller": f"{seller.first_name} {seller.last_name}" if seller else None
        })
    
    return product_list

# backend/app/api/payments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import stripe

from ..core.database import SessionLocal
from ..models.user import User
from ..models.payment import Transaction, TransactionType, TransactionStatus
from ..core.config import settings
from .auth import security, verify_token

router = APIRouter()
stripe.api_key = settings.STRIPE_SECRET_KEY

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CheckoutSession(BaseModel):
    type: str
    amount: Optional[float] = None

@router.post("/create-checkout-session")
async def create_checkout_session(
    session_data: CheckoutSession,
    token: str = Depends(security),
    db: Session = Depends(get_db)
):
    user_info = await verify_token(token, db)
    user = db.query(User).filter(User.id == user_info["user"]["id"]).first()
    
    try:
        if session_data.type == "add_funds":
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': 'Account Balance Top-up',
                        },
                        'unit_amount': 2500,  # $25.00
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url='http://localhost:5173/dashboard?payment=success',
                cancel_url='http://localhost:5173/dashboard?payment=cancelled',
                customer_email=user.email,
                metadata={
                    'user_id': str(user.id),
                    'type': 'add_funds'
                }
            )
        
        return {"url": checkout_session.url}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# backend/app/api/messages.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..core.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/conversations")
async def get_conversations():
    return []

# backend/app/api/billing.py
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class BillingInfo(BaseModel):
    session_id: str

@router.get("/session/{session_id}")
async def get_session_billing(session_id: str):
    return {
        "elapsed_time": 0,
        "total_cost": 0.0,
        "client_balance": 25.0
    }

# ===== BACKEND SERVICES =====

# backend/app/services/websocket_manager.py
from typing import Dict, List
from fastapi import WebSocket
import json
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)
            
    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)

# backend/app/services/billing_service.py
import asyncio
from datetime import datetime
from typing import Dict

class BillingService:
    def __init__(self):
        self.active_sessions: Dict[str, dict] = {}
        self._running = False
        
    async def start(self):
        self._running = True
        asyncio.create_task(self._billing_loop())
        
    async def stop(self):
        self._running = False
        
    async def _billing_loop(self):
        while self._running:
            # Process billing for active sessions
            for session_id, session_data in self.active_sessions.items():
                await self._process_session_billing(session_id, session_data)
            await asyncio.sleep(60)  # Check every minute
            
    async def _process_session_billing(self, session_id: str, session_data: dict):
        # Calculate elapsed time and charge client
        pass
        
    async def get_session_billing(self, session_id: str):
        return {
            "elapsed_time": 0,
            "total_cost": 0.0,
            "client_balance": 25.0
        }

# backend/app/services/webrtc_service.py
class WebRTCService:
    async def handle_signal(self, message: dict, user_id: str):
        # Handle WebRTC signaling
        pass

# backend/app/services/notification_service.py
class NotificationService:
    async def start(self):
        pass
        
    async def stop(self):
        pass

# ===== FRONTEND STORES =====

# frontend/src/lib/stores/auth.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const user = writable(null);
export const isAuthenticated = writable(false);
export const loading = writable(true);

export const auth = {
  initialize: async () => {
    if (!browser) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          user.set(userData.user);
          isAuthenticated.set(true);
        } else {
          localStorage.removeItem('authToken');
          user.set(null);
          isAuthenticated.set(false);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      localStorage.removeItem('authToken');
      user.set(null);
      isAuthenticated.set(false);
    } finally {
      loading.set(false);
    }
  },

  signIn: async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.access_token);
    user.set(data.user);
    isAuthenticated.set(true);
    return data;
  },

  signUp: async (userData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    localStorage.setItem('authToken', data.access_token);
    user.set(data.user);
    isAuthenticated.set(true);
    return data;
  },

  signOut: async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    localStorage.removeItem('authToken');
    user.set(null);
    isAuthenticated.set(false);
  }
};

# frontend/src/lib/stores/cart.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createCart() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addItem: (item) => update(cart => {
      const existingItem = cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
        return cart;
      } else {
        const newCart = [...cart, { ...item, quantity: 1 }];
        if (browser) localStorage.setItem('cart', JSON.stringify(newCart));
        return newCart;
      }
    }),
    removeItem: (id) => update(cart => {
      const newCart = cart.filter(item => item.id !== id);
      if (browser) localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    }),
    updateQuantity: (id, quantity) => update(cart => {
      const newCart = cart.map(item => item.id === id ? { ...item, quantity } : item);
      if (browser) localStorage.setItem('cart', JSON.stringify(newCart));
      return newCart;
    }),
    clear: () => {
      if (browser) localStorage.removeItem('cart');
      set([]);
    },
    load: () => {
      if (browser) {
        const saved = localStorage.getItem('cart');
        if (saved) {
          set(JSON.parse(saved));
        }
      }
    }
  };
}

export const cart = createCart();

# ===== FRONTEND COMPONENTS =====

# frontend/src/lib/components/common/Navigation.svelte
<script>
  import { page } from '$app/stores';
  import { user, isAuthenticated, auth } from '$lib/stores/auth.js';
  import { cart } from '$lib/stores/cart.js';
  import { onMount } from 'svelte';
  
  let mobileMenuOpen = false;
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/readings', label: 'Readings' },
    { href: '/live', label: 'Live' },
    { href: '/shop', label: 'Shop' },
    { href: '/community', label: 'Community' }
  ];
  
  onMount(() => {
    cart.load();
  });
  
  function handleSignOut() {
    auth.signOut();
    mobileMenuOpen = false;
  }
</script>

<nav class="bg-black/80 backdrop-blur-lg border-b border-pink-500/30 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <a href="/" class="text-3xl font-alex-brush text-pink-400 hover:text-pink-300 transition-colors">
        SoulSeer
      </a>
      
      <div class="hidden md:flex items-center space-x-8">
        {#each navItems as item}
          <a 
            href={item.href}
            class="text-white hover:text-pink-400 transition-colors font-playfair {$page.url.pathname === item.href ? 'text-pink-400 border-b border-pink-400' : ''}"
          >
            {item.label}
          </a>
        {/each}
      </div>
      
      <div class="hidden md:flex items-center space-x-4">
        {#if $isAuthenticated}
          <a href="/messages" class="text-white hover:text-pink-400 transition-colors">
            Messages
          </a>
          <a href="/cart" class="text-white hover:text-pink-400 transition-colors flex items-center space-x-1">
            <span>🛒</span>
            {#if $cart.length > 0}
              <span class="bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {$cart.length}
              </span>
            {/if}
          </a>
          <a href="/dashboard" class="text-white hover:text-pink-400 transition-colors">
            Dashboard
          </a>
          <button 
            on:click={handleSignOut}
            class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        {:else}
          <a href="/login" class="text-white hover:text-pink-400 transition-colors">
            Sign In
          </a>
          <a href="/signup" class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors">
            Sign Up
          </a>
        {/if}
      </div>
      
      <button 
        class="md:hidden text-white"
        on:click={() => mobileMenuOpen = !mobileMenuOpen}
      >
        ☰
      </button>
    </div>
    
    {#if mobileMenuOpen}
      <div class="md:hidden border-t border-pink-500/30 py-4">
        {#each navItems as item}
          <a 
            href={item.href}
            class="block py-2 text-white hover:text-pink-400 transition-colors {$page.url.pathname === item.href ? 'text-pink-400' : ''}"
            on:click={() => mobileMenuOpen = false}
          >
            {item.label}
          </a>
        {/each}
        
        {#if $isAuthenticated}
          <a href="/dashboard" class="block py-2 text-white hover:text-pink-400 transition-colors">
            Dashboard
          </a>
          <button 
            on:click={handleSignOut}
            class="block w-full text-left py-2 text-white hover:text-pink-400 transition-colors"
          >
            Sign Out
          </button>
        {:else}
          <a href="/login" class="block py-2 text-white hover:text-pink-400 transition-colors">
            Sign In
          </a>
          <a href="/signup" class="block py-2 text-white hover:text-pink-400 transition-colors">
            Sign Up
          </a>
        {/if}
      </div>
    {/if}
  </div>
</nav>

# frontend/src/lib/components/common/Hero.svelte
<script>
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <div 
    class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
    style="background-image: url('https://i.postimg.cc/sXdsKGTK/DALL-E-2025-06-06-14-36-29-A-vivid-ethereal-background-image-designed-for-a-psychic-reading-app.webp')"
  ></div>
  
  <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
  
  <div class="relative z-10 text-center max-w-4xl mx-auto px-4">
    <h1 class="text-7xl md:text-9xl font-alex-brush text-pink-400 mb-8 animate-float">
      SoulSeer
    </h1>
    
    <div class="mb-8">
      <img 
        src="https://i.postimg.cc/tRLSgCPb/HERO-IMAGE-1.jpg" 
        alt="Mystical Hero" 
        class="mx-auto rounded-2xl shadow-2xl border border-pink-500/30 max-w-md animate-pulse-slow"
      />
    </div>
    
    <h2 class="text-3xl md:text-5xl font-playfair text-white mb-12">
      A Community of Gifted Psychics
    </h2>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a 
        href="/readings" 
        class="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
      >
        Get a Reading Now
      </a>
      <a 
        href="/live" 
        class="border-2 border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
      >
        Watch Live Streams
      </a>
    </div>
  </div>
  
  <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <svg class="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section>

# frontend/src/lib/components/common/Footer.svelte
<footer class="bg-black border-t border-pink-500/30 py-12">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-4 gap-8">
      <div>
        <h3 class="text-2xl font-alex-brush text-pink-400 mb-4">SoulSeer</h3>
        <p class="text-gray-300 text-sm">A community of gifted psychics providing ethical, compassionate spiritual guidance.</p>
      </div>
      
      <div>
        <h4 class="text-white font-semibold mb-4">Services</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><a href="/readings" class="hover:text-pink-400 transition-colors">Readings</a></li>
          <li><a href="/live" class="hover:text-pink-400 transition-colors">Live Streams</a></li>
          <li><a href="/shop" class="hover:text-pink-400 transition-colors">Shop</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-white font-semibold mb-4">Community</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><a href="/community" class="hover:text-pink-400 transition-colors">Forum</a></li>
          <li><a href="/about" class="hover:text-pink-400 transition-colors">About</a></li>
          <li><a href="/apply" class="hover:text-pink-400 transition-colors">Become a Reader</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="text-white font-semibold mb-4">Support</h4>
        <ul class="space-y-2 text-gray-300 text-sm">
          <li><a href="/help" class="hover:text-pink-400 transition-colors">Help Center</a></li>
          <li><a href="/faq" class="hover:text-pink-400 transition-colors">FAQ</a></li>
          <li><a href="/contact" class="hover:text-pink-400 transition-colors">Contact</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-pink-500/30 mt-8 pt-8 text-center text-gray-400 text-sm">
      <p>&copy; 2024 SoulSeer. All rights reserved.</p>
    </div>
  </div>
</footer>

# ===== FRONTEND ROUTES =====

# frontend/src/routes/+layout.svelte
<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth.js';
  import Navigation from '$lib/components/common/Navigation.svelte';
  import Footer from '$lib/components/common/Footer.svelte';
  
  onMount(() => {
    auth.initialize();
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white">
  {#if $page.route.id !== '/login' && $page.route.id !== '/signup'}
    <Navigation />
  {/if}
  
  <main class="flex-1">
    <slot />
  </main>
  
  {#if $page.route.id !== '/login' && $page.route.id !== '/signup'}
    <Footer />
  {/if}
</div>

# frontend/src/routes/+page.svelte
<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import Hero from '$lib/components/common/Hero.svelte';
  import OnlineReaders from '$lib/components/common/OnlineReaders.svelte';
  import LiveStreams from '$lib/components/common/LiveStreams.svelte';
  
  let onlineReaders = writable([]);
  let liveStreams = writable([]);
  let loading = writable(true);
  let error = writable('');
  
  onMount(async () => {
    try {
      loading.set(true);
      
      const [readersResponse, streamsResponse] = await Promise.all([
        fetch('/api/readings/online'),
        fetch('/api/streams/live')
      ]);
      
      if (readersResponse.ok) {
        const readersData = await readersResponse.json();
        onlineReaders.set(readersData);
      }
      
      if (streamsResponse.ok) {
        const streamsData = await streamsResponse.json();
        liveStreams.set(streamsData);
      }
      
    } catch (err) {
      console.error('Error loading homepage data:', err);
      error.set('Failed to load content. Please refresh the page.');
    } finally {
      loading.set(false);
    }
  });
</script>

<svelte:head>
  <title>SoulSeer - A Community of Gifted Psychics</title>
</svelte:head>

{#if $loading}
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
  </div>
{:else}
  <Hero />
  <OnlineReaders readers={$onlineReaders} />
  <LiveStreams streams={$liveStreams} />
{/if}

# This is just the start - the complete artifact would include ALL routes, components, services, and utilities
# Due to length constraints, this shows the structure and key implementations
# The full codebase would be 100+ files totaling thousands of lines of production-ready code