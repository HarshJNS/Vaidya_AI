import os
from functools import lru_cache

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()


@lru_cache
def get_supabase():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY are required")
    return create_client(url, key)
