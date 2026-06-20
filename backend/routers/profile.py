from fastapi import APIRouter

from models.schemas import HealthDetails, HealthProfile
from models.database import get_supabase

router = APIRouter()


@router.get("/{user_id}")
async def get_profile(user_id: str):
    supabase = get_supabase()
    profile = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
    health = supabase.table("health_details").select("*").eq("user_id", user_id).single().execute()
    return {"profile": profile.data, "health": health.data}


@router.post("/{user_id}")
async def upsert_profile(user_id: str, profile: HealthProfile, health: HealthDetails):
    supabase = get_supabase()
    supabase.table("profiles").upsert({"user_id": user_id, **profile.model_dump()}).execute()
    supabase.table("health_details").upsert({"user_id": user_id, **health.model_dump()}).execute()

    pct = calculate_completeness(profile, health)
    supabase.table("profiles").update({"profile_pct": pct}).eq("user_id", user_id).execute()
    return {"success": True, "completeness": pct}


def calculate_completeness(profile: HealthProfile, health: HealthDetails) -> int:
    score = 0
    if profile.age:
        score += 15
    if profile.height_cm:
        score += 10
    if profile.weight_kg:
        score += 10
    if profile.blood_group:
        score += 10
    if health.conditions:
        score += 20
    if health.medicines:
        score += 20
    if health.allergies:
        score += 15
    return min(score, 100)

