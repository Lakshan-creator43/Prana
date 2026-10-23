"""Vercel serverless function entry point — wraps the Flask app."""

import sys
import os

# Fix encoding
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "backend")
sys.path.insert(0, backend_dir)

# Load .env from backend directory if it exists (local dev)
from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, ".env"))

from app import create_app

app = create_app()
