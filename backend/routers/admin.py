from fastapi import APIRouter, HTTPException

from models.database import get_supabase

router = APIRouter()


def verify_admin(user_id: str):
    res = get_supabase().table("profiles").select("is_admin").eq("user_id", user_id).single().execute()
    if not res.data or not res.data.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")


@router.get("/dashboard/{admin_user_id}")
async def get_dashboard(admin_user_id: str):
    verify_admin(admin_user_id)
    supabase = get_supabase()

    members = supabase.table("profiles").select("*").execute()
    health = supabase.table("health_details").select("*").execute()
    flags = (
        supabase.table("safety_logs")
        .select("*")
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )
    activity = (
        supabase.table("chat_history")
        .select("user_id, message, created_at, safety_flagged")
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )

    return {
        "members": members.data,
        "health_summary": health.data,
        "recent_flags": flags.data,
        "recent_activity": activity.data,
    }

