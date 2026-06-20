from services import ai_service


def test_uses_openai_placeholder_name_when_no_provider_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)

    response = ai_service.get_ai_response("hello", "profile", "", "en")

    assert "OPENAI_API_KEY" in response
    assert "GEMINI_API_KEY" in response


def test_prefers_openai_when_openai_key_exists(monkeypatch):
    class FakeResponse:
        output_text = "OpenAI response"

    class FakeResponses:
        def create(self, **kwargs):
            assert kwargs["model"] == "gpt-4o-mini"
            assert "USER QUESTION" in kwargs["input"]
            return FakeResponse()

    class FakeOpenAI:
        def __init__(self, api_key):
            assert api_key == "test-key"
            self.responses = FakeResponses()

    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.delenv("OPENAI_MODEL", raising=False)
    monkeypatch.setattr(ai_service, "OpenAI", FakeOpenAI)

    response = ai_service.get_ai_response("hello", "profile", "", "en")

    assert response == "OpenAI response"


def test_gemini_model_uses_supported_default(monkeypatch):
    created = {}

    class FakeGenerativeModel:
        def __init__(self, model_name):
            created["model_name"] = model_name

    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    monkeypatch.delenv("GEMINI_MODEL", raising=False)
    monkeypatch.setattr(ai_service.genai, "configure", lambda api_key: None)
    monkeypatch.setattr(ai_service.genai, "GenerativeModel", FakeGenerativeModel)

    ai_service._gemini_model()

    assert created["model_name"] == "models/gemini-2.5-flash"
