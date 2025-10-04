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
    transaction_metadata = Column(Text)  # JSON as text
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
