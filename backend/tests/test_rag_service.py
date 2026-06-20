from services import rag_service


def test_search_knowledge_base_returns_empty_when_embedding_fails(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")

    def fail_embedding(_query):
        raise RuntimeError("embedding unavailable")

    monkeypatch.setattr(rag_service, "get_embedding", fail_embedding)

    assert rag_service.search_knowledge_base("diet for diabetes") == []

