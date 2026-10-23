"""Safety checker service — combines red-flag detection with LLM safety analysis."""

from data.red_flags import check_red_flags
from services.llm_service import check_safety as llm_check_safety
from models import SafetyOutput, SymptomAnalysisOutput
import traceback


def assess_symptom_risk(symptoms_text: str, llm_analysis: dict) -> dict:
    """Combine rule-based red-flag detection with LLM analysis.

    The rule-based check runs FIRST. If it detects red flags, risk is
    automatically HIGH regardless of LLM output. This ensures dangerous
    symptoms are never missed even if the LLM under-estimates risk.
    """
    # Rule-based red flag check (always runs first)
    rule_flags = check_red_flags(symptoms_text)

    # Merge with LLM-detected flags
    llm_flags = llm_analysis.get("redFlags", [])
    all_flags = list(set(rule_flags + llm_flags))

    # Determine final risk level
    if all_flags:
        risk_level = "high"
    else:
        risk_level = llm_analysis.get("riskLevel", "low")

    # Validate through Pydantic
    try:
        validated = SymptomAnalysisOutput(
            riskLevel=risk_level,
            redFlags=all_flags,
            symptoms=symptoms_text,
            identifiedSymptoms=llm_analysis.get("identifiedSymptoms", []),
            summary=llm_analysis.get("summary", ""),
        )
        return validated.model_dump()
    except Exception as e:
        print(f"[PRANA Safety] Validation error: {e}")
        return {
            "riskLevel": risk_level,
            "redFlags": all_flags,
            "symptoms": symptoms_text,
            "identifiedSymptoms": [],
            "summary": "",
        }


def assess_remedy_safety(remedy_data: dict, user_profile: dict = None) -> dict:
    """Run LLM safety check on a remedy and validate through Pydantic."""
    try:
        raw_result = llm_check_safety(remedy_data, user_profile)

        # Validate through Pydantic
        validated = SafetyOutput(**raw_result)
        return validated.model_dump()
    except Exception as e:
        print(f"[PRANA Safety] Error in safety check: {e}")
        traceback.print_exc()

        # Return safe fallback with generic warnings
        return SafetyOutput(
            allergyWarnings=[],
            conditionWarnings=[],
            medicationInteractions=[],
            overallRisk="moderate",
        ).model_dump()
