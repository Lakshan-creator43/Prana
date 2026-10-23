"""Safety check endpoint."""

from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from models import SafetyRequest
from services.safety_checker import assess_remedy_safety
import traceback

safety_bp = Blueprint("safety", __name__)


@safety_bp.route("/api/safety/<remedy_id>", methods=["POST"])
def check_safety(remedy_id):
    """Check safety of a specific remedy.

    POST body (optional): { "allergies": [], "conditions": [], "medications": [] }
    Returns: { "allergyWarnings", "conditionWarnings", "medicationInteractions", "overallRisk" }
    """
    try:
        # Parse optional user profile
        data = request.get_json() or {}
        try:
            user_profile = SafetyRequest(**data)
        except ValidationError:
            user_profile = SafetyRequest()

        # Build remedy data for safety check
        # In a full implementation, we'd look up the remedy from cache/DB
        # For now, we pass the remedy_id and let the LLM work with it
        remedy_data = {
            "id": remedy_id,
            "name": remedy_id.replace("-", " ").title(),
            "ingredients": data.get("ingredients", []),
            "precautions": data.get("precautions", []),
        }

        result = assess_remedy_safety(
            remedy_data,
            user_profile.model_dump() if user_profile else None,
        )

        return jsonify(result), 200

    except Exception as e:
        print(f"[PRANA API] Error in safety check: {e}")
        traceback.print_exc()
        return jsonify({"error": "Safety check failed", "message": str(e)}), 500
