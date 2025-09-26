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
