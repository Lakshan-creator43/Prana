"""Remedy research and retrieval endpoints."""

from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from models import SymptomRequest, SaveRemedyRequest
from services.source_researcher import research_remedies
from database import save_search, save_remedy, get_all_saved_remedies, delete_saved_remedy
import traceback

remedies_bp = Blueprint("remedies", __name__)


@remedies_bp.route("/api/research-remedies", methods=["POST"])
def research():
    """Research remedies for given symptoms.

    POST body: { "symptoms": "text describing symptoms" }
    Returns: { "remedies": [...], "sourcesUsed": [...] }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        try:
            validated_input = SymptomRequest(**data)
        except ValidationError as e:
            return jsonify({"error": "Invalid input", "details": e.errors()}), 400

        # Run the full research pipeline
        result = research_remedies(validated_input.symptoms)

        # Save to history
        try:
            save_search(
                symptoms=validated_input.symptoms,
                risk_level="low",  # Will be updated by analyze-symptoms
                red_flags=[],
                remedies_found=len(result.get("remedies", [])),
                results=result.get("remedies", []),
                sources_used=result.get("sourcesUsed", []),
            )
        except Exception as db_err:
            print(f"[PRANA API] Could not save to history: {db_err}")

        return jsonify(result), 200

    except Exception as e:
        print(f"[PRANA API] Error in research-remedies: {e}")
        traceback.print_exc()
        return jsonify({"error": "Research failed", "message": str(e)}), 500


@remedies_bp.route("/api/save-remedy", methods=["POST"])
def save():
    """Save a remedy for later reference.

    POST body: { "search_id": 1, "remedy_id": "ginger-honey", "remedy_name": "...", "remedy_data": {...} }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        try:
            validated = SaveRemedyRequest(**data)
        except ValidationError as e:
            return jsonify({"error": "Invalid input", "details": e.errors()}), 400

        save_remedy(
            search_id=validated.search_id,
            remedy_id=validated.remedy_id,
            remedy_name=validated.remedy_name,
            remedy_json=validated.remedy_data,
        )

        return jsonify({"status": "saved"}), 200

    except Exception as e:
        print(f"[PRANA API] Error saving remedy: {e}")
        return jsonify({"error": "Save failed", "message": str(e)}), 500


@remedies_bp.route("/api/saved-remedies", methods=["GET"])
def get_saved():
    """Get all saved remedies.

    Returns: { "savedRemedies": [...] }
    """
    try:
        saved = get_all_saved_remedies()
        return jsonify({"savedRemedies": saved}), 200
    except Exception as e:
        print(f"[PRANA API] Error fetching saved remedies: {e}")
        return jsonify({"error": "Failed to fetch saved remedies", "savedRemedies": []}), 500


@remedies_bp.route("/api/saved-remedies/<int:remedy_db_id>", methods=["DELETE"])
def remove_saved(remedy_db_id):
    """Delete a saved remedy.

    Returns: { "status": "deleted" }
    """
    try:
        deleted = delete_saved_remedy(remedy_db_id)
        if deleted:
            return jsonify({"status": "deleted"}), 200
        return jsonify({"error": "Remedy not found"}), 404
    except Exception as e:
        print(f"[PRANA API] Error deleting saved remedy: {e}")
        return jsonify({"error": "Delete failed", "message": str(e)}), 500
