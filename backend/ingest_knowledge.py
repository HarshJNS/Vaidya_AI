import os
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv

from models.database import get_supabase

load_dotenv()


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> list[str]:
    words = text.split()
    step = chunk_size - overlap
    return [" ".join(words[i : i + chunk_size]) for i in range(0, len(words), step) if words[i : i + chunk_size]]


def embed_and_store(text: str, source: str, chapter: str = "", trust_level: int = 2, language: str = "en") -> None:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    result = genai.embed_content(
        model=os.getenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001"),
        content=text,
        task_type="retrieval_document",
    )
    get_supabase().table("knowledge_chunks").insert(
        {
            "content": text,
            "embedding": result["embedding"],
            "source": source,
            "chapter": chapter,
            "trust_level": trust_level,
            "language": language,
        }
    ).execute()


def ingest_file(path: str, source: str, trust_level: int = 2, language: str = "en") -> None:
    text = Path(path).read_text(encoding="utf-8")
    for chunk in chunk_text(text):
        embed_and_store(chunk, source=source, trust_level=trust_level, language=language)
        print(f"Stored {source}: {chunk[:72]}...")


if __name__ == "__main__":
    print("Usage from Python: ingest_file('ashtanga_hridayam.txt', 'ashtanga_hridayam', 3)")
