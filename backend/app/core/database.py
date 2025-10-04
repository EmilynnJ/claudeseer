from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import os

# Use SQLite for development if no DATABASE_URL is provided
if settings.DATABASE_URL.startswith("postgresql://"):
    # PostgreSQL database
    engine = create_engine(settings.DATABASE_URL)
else:
    # SQLite database for development
    engine = create_engine("sqlite:///./soulseer.db", connect_args={"check_same_thread": False})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
