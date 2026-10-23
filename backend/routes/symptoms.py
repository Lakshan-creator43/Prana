"""Symptom analysis endpoint."""

from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from models import SymptomRequest
from services.llm_service import analyze_symptoms as llm_analyze
from services.safety_checker import assess_symptom_risk
import traceback

symptoms_bp = Blueprint("symptoms", __name__)


@symptoms_bp.route("/api/analyze-symptoms", methods=["POST"])
def analyze_symptoms():
    """Analyze user symptoms for risk level and red flags.

    POST body: { "symptoms": "text describing symptoms" }
    Returns: { "riskLevel", "redFlags", "symptoms", "identifiedSymptoms", "summary" }
    """
    try:
        # Validate input with Pydantic
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        try:
            validated_input = SymptomRequest(**data)
        except ValidationError as e:
            return jsonify({"error": "Invalid input", "details": e.errors()}), 400

        symptoms_text = validated_input.symptoms

        # Call LLM for analysis
        llm_result = llm_analyze(symptoms_text)

        # Combine with rule-based safety check
        final_result = assess_symptom_risk(symptoms_text, llm_result)

        return jsonify(final_result), 200

    except Exception as e:
        print(f"[PRANA API] Error in analyze-symptoms: {e}")
        traceback.print_exc()
        return jsonify({"error": "Analysis failed", "message": str(e)}), 500
