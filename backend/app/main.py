from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .core.config import settings
from .api import auth, users, readings, streams, products, payments

app = FastAPI(
    title="SoulSeer API",
    description="Mystical Psychic Reading Platform API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(readings.router, prefix="/api/readings", tags=["readings"])
app.include_router(streams.router, prefix="/api/streams", tags=["streams"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])

@app.get("/")
async def root():
    return {"message": "SoulSeer API - Welcome to the mystical realm"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "soulseer-api"}
