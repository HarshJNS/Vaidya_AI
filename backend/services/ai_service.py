import os

import google.generativeai as genai
from openai import OpenAI

SYSTEM_PROMPT = """You are Vaidya, a private personal health assistant for one family.
You combine traditional Ayurvedic wisdom with practical modern health awareness.

STRICT RULES - NEVER VIOLATE:
1. Never suggest stopping or changing any prescribed medicine
2. Never give exact prescription dosages
3. Never claim guaranteed cures
4. Never diagnose serious conditions definitively
5. Always add "please consult your doctor" for significant health concerns
6. If user writes in Hindi, reply in Hindi
7. Keep responses concise - 3-5 sentences max unless detail is truly needed

At the end of every answer, add:
"Always consult your doctor before making health decisions."
"""


def _gemini_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash"))


def build_prompt(message: str, user_context: str, rag_context: str, language: str = "en") -> str:
    lang_instruction = (
        "The user is writing in Hindi. Respond in Hindi using Devanagari script."
        if language == "hi"
        else "Respond in English."
    )
    return f"""{SYSTEM_PROMPT}

{lang_instruction}

--- USER HEALTH PROFILE ---
{user_context}

--- RELEVANT KNOWLEDGE BASE ---
{rag_context if rag_context else "No specific texts retrieved for this query."}

--- USER QUESTION ---
{message}
"""


def get_ai_response(message: str, user_context: str, rag_context: str, language: str = "en") -> str:
    prompt = build_prompt(message, user_context, rag_context, language)

    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        client = OpenAI(api_key=openai_key)
        response = client.responses.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            input=prompt,
        )
        return response.output_text

    model = _gemini_model()
    if model is None:
        return (
            "I can help with general wellness guidance once an AI provider is configured. "
            "Please add OPENAI_API_KEY or GEMINI_API_KEY on the backend. "
            "Always consult your doctor before making health decisions."
        )
    response = model.generate_content(prompt)
    return response.text


async def get_ai_response_stream(message: str, user_context: str, rag_context: str, language: str = "en"):
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        yield get_ai_response(message, user_context, rag_context, language)
        return

    model = _gemini_model()
    if model is None:
        yield get_ai_response(message, user_context, rag_context, language)
        return

    async for chunk in await model.generate_content_async(
        build_prompt(message, user_context, rag_context, language),
        stream=True,
    ):
        if chunk.text:
            yield chunk.text
