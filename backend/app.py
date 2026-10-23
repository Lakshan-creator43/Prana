"""PRANA — Flask application entry point."""

import sys
import os

# Fix Windows console encoding — LLM responses often contain Unicode
# characters that cp1252 can't handle
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure backend directory is on the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db, get_search_history
from data.sources import get_all_sources

# Import route blueprints
from routes.symptoms import symptoms_bp
from routes.remedies import remedies_bp
from routes.safety import safety_bp
from routes.comments import comments_bp


def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config["SECRET_KEY"] = Config.SECRET_KEY

    # Enable CORS for React dev server (Vite runs on 5173)
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:5175",
                "http://127.0.0.1:5176",
            ],
            "methods": ["GET", "POST", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    })

    # Register blueprints
    app.register_blueprint(symptoms_bp)
    app.register_blueprint(remedies_bp)
    app.register_blueprint(safety_bp)
    app.register_blueprint(comments_bp)

    # ──────────────────────────────────────────────
    # Additional routes (history, sources, health)
    # ──────────────────────────────────────────────

    @app.route("/api/health", methods=["GET"])
    def health_check():
        """Health check endpoint."""
        return jsonify({
            "status": "ok",
            "service": "PRANA Backend",
            "model": Config.LLM_MODEL,
        }), 200

    @app.route("/api/history", methods=["GET"])
    def get_history():
        """Return search history from the database."""
        try:
            history = get_search_history()
            return jsonify({"history": history}), 200
        except Exception as e:
            print(f"[PRANA API] Error fetching history: {e}")
            return jsonify({"error": "Failed to fetch history", "history": []}), 500

    @app.route("/api/sources", methods=["GET"])
    def get_sources():
        """Return the list of trusted sources."""
        try:
            sources = get_all_sources()
            return jsonify({"sources": sources}), 200
        except Exception as e:
            print(f"[PRANA API] Error fetching sources: {e}")
            return jsonify({"error": "Failed to fetch sources", "sources": []}), 500

    # Initialize database on first request
    with app.app_context():
        init_db()

    return app


# ──────────────────────────────────────────────
# Run the server
# ──────────────────────────────────────────────

if __name__ == "__main__":
    app = create_app()
    print(f"\n[PRANA] Backend starting on port {Config.FLASK_PORT}")
    print(f"   Model: {Config.LLM_MODEL}")
    print(f"   Debug: {Config.FLASK_DEBUG}")
    print(f"   Groq API Key: {'configured' if Config.GROQ_API_KEY else 'MISSING'}")
    print(f"   Tavily API Key: {'configured' if Config.TAVILY_API_KEY else 'MISSING'}\n")
    app.run(
        host="0.0.0.0",
        port=Config.FLASK_PORT,
        debug=Config.FLASK_DEBUG,
    )
