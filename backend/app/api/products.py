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
