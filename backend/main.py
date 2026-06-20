import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from routers import admin, chat, emergency, profile, upload

load_dotenv()

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Vaidya API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/chat", tags=["chat"])
app.include_router(profile.router, prefix="/health-profile", tags=["profile"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(upload.router, prefix="/upload-docs", tags=["upload"])
app.include_router(emergency.router, prefix="/emergency-check", tags=["emergency"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "vaidya-api"}
