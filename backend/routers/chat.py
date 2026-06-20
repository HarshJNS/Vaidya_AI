import json

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.database import get_supabase
from models.schemas import ChatRequest
from services.ai_service import get_ai_response_stream
from services.profile_service import build_user_context
from services.rag_service import build_rag_context, search_knowledge_base
from services.safety_service import check_safety

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/")
@limiter.limit("30/minute")
async def chat(request: Request, body: ChatRequest):
    safety = check_safety(body.message, body.language)

    if safety["is_emergency"] or safety["is_hard_block"]:
        try:
            supabase = get_supabase()
            supabase.table("safety_logs").insert(
                {
                    "user_id": body.user_id,
                    "trigger_phrase": safety["trigger"],
                    "category": safety["category"],
                    "full_message": body.message,
                    "action_taken": "redirected_to_emergency" if safety["is_emergency"] else "hard_block",
                }
            ).execute()
            supabase.table("chat_history").insert(
                {
                    "user_id": body.user_id,
                    "message": body.message,
                    "response": safety["response"],
                    "language": body.language,
                    "safety_flagged": True,
                    "safety_reason": safety["category"],
                }
            ).execute()
        except Exception as exc:
            print(f"Safety audit logging failed: {exc}")

        async def safety_stream():
            yield f"data: {json.dumps({'text': safety['response'], 'done': False})}\n\n"
            yield f"data: {json.dumps({'text': '', 'done': True, 'safety': True})}\n\n"

        return StreamingResponse(safety_stream(), media_type="text/event-stream")

    user_context = build_user_context(body.user_id)
    chunks = search_knowledge_base(body.message)
    rag_context, sources = build_rag_context(chunks)
    full_response = []

    async def generate():
        async for chunk in get_ai_response_stream(body.message, user_context, rag_context, body.language):
            full_response.append(chunk)
            yield f"data: {json.dumps({'text': chunk, 'done': False})}\n\n"

        complete_response = "".join(full_response)
        try:
            get_supabase().table("chat_history").insert(
                {
                    "user_id": body.user_id,
                    "message": body.message,
                    "response": complete_response,
                    "language": body.language,
                    "sources": sources,
                    "safety_flagged": False,
                }
            ).execute()
        except Exception as exc:
            print(f"Chat history logging failed: {exc}")

        yield f"data: {json.dumps({'text': '', 'done': True, 'sources': sources})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/history/{user_id}")
async def get_history(user_id: str, limit: int = 20):
    res = (
        get_supabase()
        .table("chat_history")
        .select("id, message, response, created_at, sources, safety_flagged")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return {"history": res.data}

