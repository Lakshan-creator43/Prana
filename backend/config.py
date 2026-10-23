import os
from dotenv import load_dotenv

# Only load .env file in local development (not on Vercel)
if not os.getenv("VERCEL"):
    load_dotenv()


class Config:
    """Application configuration loaded from .env file."""

    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "prana-default-secret")
    # On Vercel serverless, force /tmp (only writable dir); locally use configured path
    DATABASE_PATH = "/tmp/prana.db" if os.getenv("VERCEL") else os.getenv("DATABASE_PATH", "prana.db")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")
    LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-20b")
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))

    # Scraping settings
    SCRAPE_TIMEOUT = 10  # seconds
    SCRAPE_USER_AGENT = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )

    # LLM settings
    LLM_MAX_TOKENS = 4096
    LLM_TEMPERATURE = 0.3  # Low temperature for factual, consistent output
