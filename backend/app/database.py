import os
from functools import lru_cache

from dotenv import load_dotenv
from supabase import Client, create_client

from pathlib import Path

# load .env from backend root folder
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

load_dotenv()


@lru_cache()
def get_supabase_client() -> Client:
    """
    Lazily initialize and cache the Supabase client.

    Requires SUPABASE_URL and SUPABASE_KEY to be set in the environment.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")

    if not url or not key:
        raise RuntimeError(
            "Supabase credentials are not set. "
            "Please configure SUPABASE_URL and SUPABASE_KEY in your environment."
        )
    print("SUPABASE_URL =", repr(url))
    print("SUPABASE_KEY starts with =", key[:10] if key else None)
    return create_client(url, key)
