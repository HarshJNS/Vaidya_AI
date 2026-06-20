from models.database import get_supabase


def build_user_context(user_id: str) -> str:
    try:
        supabase = get_supabase()
        profile_res = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
        health_res = supabase.table("health_details").select("*").eq("user_id", user_id).single().execute()

        p = profile_res.data or {}
        h = health_res.data or {}

        medicines = h.get("medicines") or []
        medicines_str = "none recorded"
        if medicines:
            medicines_str = ", ".join(
                f"{m.get('name', '?')} {m.get('dose', '')} {m.get('frequency', '')}".strip()
                for m in medicines
            )

        return f"""
USER HEALTH PROFILE:
- Name: {p.get('name', 'Unknown')}
- Relation: {p.get('relation', 'Family member')}
- Age: {p.get('age', 'Unknown')} years old
- Gender: {p.get('gender', 'Unknown')}
- Height: {p.get('height_cm', '?')} cm | Weight: {p.get('weight_kg', '?')} kg
- Blood group: {p.get('blood_group', 'Unknown')}
- Activity level: {p.get('activity_level', 'light')}
- Sleep: {p.get('sleep_hours', '?')} hours/night
- Diet: {h.get('diet_type', 'omnivore')}
- Smoking: {'yes' if h.get('smoking') else 'no'} | Alcohol: {'yes' if h.get('alcohol') else 'no'}

MEDICAL CONDITIONS: {', '.join(h.get('conditions', [])) or 'none recorded'}
CURRENT MEDICINES: {medicines_str}
ALLERGIES: {', '.join(h.get('allergies', [])) or 'none recorded'}
PAST SURGERIES: {', '.join(h.get('past_surgeries', [])) or 'none'}
FAMILY HISTORY: {', '.join(h.get('family_history', [])) or 'none recorded'}
DOCTOR'S NOTES: {h.get('notes', 'none')}
""".strip()
    except Exception as exc:
        print(f"Profile fetch error: {exc}")
        return "User health profile: not available"


def get_all_members_for_admin() -> list:
    supabase = get_supabase()
    res = supabase.table("profiles").select("id, name, relation, age, profile_pct, user_id").execute()
    return res.data or []

