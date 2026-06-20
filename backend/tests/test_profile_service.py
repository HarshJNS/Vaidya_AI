from models.schemas import HealthDetails, HealthProfile
from routers.profile import calculate_completeness


def test_profile_completeness_scores_filled_medical_fields():
    profile = HealthProfile(
        name="Papa",
        relation="Father",
        age=58,
        gender="male",
        height_cm=170,
        weight_kg=78,
        blood_group="B+",
        activity_level="light",
        sleep_hours=7,
        preferred_lang="hi",
    )
    health = HealthDetails(
        conditions=["Type 2 diabetes"],
        medicines=[{"name": "Metformin", "dose": "500mg", "frequency": "daily"}],
        allergies=["Penicillin"],
        past_surgeries=[],
        family_history=[],
        diet_type="vegetarian",
        smoking=False,
        alcohol=False,
        notes="Walks after dinner.",
    )

    assert calculate_completeness(profile, health) == 100


def test_profile_completeness_handles_sparse_profile():
    profile = HealthProfile(name="Dadi", relation="Grandmother")
    health = HealthDetails()

    assert calculate_completeness(profile, health) == 0
