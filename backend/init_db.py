#!/usr/bin/env python3
"""
Database initialization script for SoulSeer
Run this after setting up your database to create tables
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine
from app.models.user import Base
from app.models.reading import Base as ReadingBase
from app.models.payment import Base as PaymentBase
from app.models.product import Base as ProductBase
from app.models.stream import Base as StreamBase

def create_tables():
    """Create all database tables"""
    print("🔮 Creating SoulSeer database tables...")
    
    # Import all models to ensure they're registered
    from app.models import user, reading, payment, product, stream
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    ReadingBase.metadata.create_all(bind=engine)
    PaymentBase.metadata.create_all(bind=engine)
    ProductBase.metadata.create_all(bind=engine)
    StreamBase.metadata.create_all(bind=engine)
    
    print("✅ Database tables created successfully!")
    print("🌙 You can now start the SoulSeer application!")

if __name__ == "__main__":
    create_tables()
