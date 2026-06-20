from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    user_id: str
    language: str = "en"


class ChatResponse(BaseModel):
    response: str
    sources: list[str] = []
    safety_flagged: bool = False
    safety_message: Optional[str] = None


class HealthProfile(BaseModel):
    name: str
    relation: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    blood_group: Optional[str] = None
    activity_level: str = "light"
    sleep_hours: Optional[float] = None
    preferred_lang: str = "en"


class HealthDetails(BaseModel):
    conditions: list[str] = []
    medicines: list[dict] = []
    allergies: list[str] = []
    past_surgeries: list[str] = []
    family_history: list[str] = []
    diet_type: str = "omnivore"
    smoking: bool = False
    alcohol: bool = False
    notes: Optional[str] = None

