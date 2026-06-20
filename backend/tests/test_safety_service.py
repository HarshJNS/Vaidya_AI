from services.safety_service import check_safety


def test_detects_chest_pain_as_emergency():
    result = check_safety("Papa has chest pain and left arm pain", "en")

    assert result["is_emergency"] is True
    assert result["is_hard_block"] is False
    assert result["category"] == "chest_pain"
    assert result["trigger"] == "chest pain"
    assert "Call 112" in result["response"]


def test_returns_hindi_emergency_message_for_hindi_user():
    result = check_safety("Dadi ko saans nahi aa rahi", "hi")

    assert result["is_emergency"] is True
    assert result["category"] == "breathing"
    assert "112" in result["response"]
    assert "इमरजेंसी" in result["response"]


def test_blocks_prescription_change_requests_without_marking_emergency():
    result = check_safety("Can I stop diabetes medicine from tomorrow?", "en")

    assert result["is_emergency"] is False
    assert result["is_hard_block"] is True
    assert result["category"] == "prescription_request"
    assert "consult your doctor" in result["response"]


def test_allows_normal_wellness_question():
    result = check_safety("What should I eat for better sleep?", "en")

    assert result == {
        "is_emergency": False,
        "is_hard_block": False,
        "category": None,
        "trigger": None,
        "response": None,
    }

