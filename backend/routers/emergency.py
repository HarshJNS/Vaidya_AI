from fastapi import APIRouter

from models.schemas import ChatRequest
from services.safety_service import check_safety

router = APIRouter()


@router.post("/")
async def emergency_check(body: ChatRequest):
    return check_safety(body.message, body.language)

