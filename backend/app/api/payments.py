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
