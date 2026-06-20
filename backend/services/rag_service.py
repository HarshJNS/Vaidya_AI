import os

import google.generativeai as genai

from models.database import get_supabase


def _configure_gemini() -> None:
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)


def get_embedding(text: str) -> list:
    _configure_gemini()
    result = genai.embed_content(
        model=os.getenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001"),
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]


def search_knowledge_base(query: str, top_k: int = 4) -> list:
    if not os.getenv("GEMINI_API_KEY"):
        return []

    try:
        query_embedding = get_embedding(query)
        res = get_supabase().rpc(
            "match_knowledge_chunks",
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.72,
                "match_count": top_k,
            },
        ).execute()
        return res.data or []
    except Exception as exc:
        print(f"Knowledge search skipped: {exc}")
        return []


def build_rag_context(chunks: list) -> tuple[str, list[str]]:
    if not chunks:
        return "", []

    context_parts = []
    sources = []
    for chunk in sorted(chunks, key=lambda x: x.get("trust_level", 1), reverse=True):
        context_parts.append(f"[Source: {chunk['source']}]\n{chunk['content']}")
        if chunk["source"] not in sources:
            sources.append(chunk["source"])

    return "\n\n---\n\n".join(context_parts), sources
