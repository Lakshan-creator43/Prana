"""Pydantic models for validating all API inputs and LLM outputs."""

from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field, field_validator


# ──────────────────────────────────────────────
# Request Models (API Input Validation)
# ──────────────────────────────────────────────

class SymptomRequest(BaseModel):
    """Validate incoming symptom analysis requests."""
    symptoms: str = Field(..., min_length=1, max_length=2000)

    @field_validator("symptoms")
    @classmethod
    def clean_symptoms(cls, v: str) -> str:
        return v.strip()


class SafetyRequest(BaseModel):
    """Validate incoming safety check requests."""
    allergies: list[str] = Field(default_factory=list)
    conditions: list[str] = Field(default_factory=list)
    medications: list[str] = Field(default_factory=list)


class SaveRemedyRequest(BaseModel):
    """Validate remedy save requests."""
    search_id: int
    remedy_id: str
    remedy_name: str
    remedy_data: dict = Field(default_factory=dict)


# ──────────────────────────────────────────────
# LLM Output Models (Validate AI responses)
# ──────────────────────────────────────────────

class SourceCitation(BaseModel):
    """A single source citation."""
    id: str = Field(..., description="Source ID: who, nccih, ayush, pubmed, mayo")
    citation: str = Field(..., description="Specific citation text")


class IngredientOutput(BaseModel):
    """A single ingredient from LLM output."""
    name: str
    amount: str
    allergens: list[str] = Field(default_factory=list)
    source: SourceCitation


class StepOutput(BaseModel):
    """A single preparation step from LLM output."""
    instruction: str
    source: SourceCitation


class PrecautionOutput(BaseModel):
    """A precaution or who-should-avoid entry."""
    text: str
    source: SourceCitation


class RemedyOutput(BaseModel):
    """Full remedy as validated from LLM output."""
    id: str
    name: str
    traditionalName: str = ""
    tradition: str = ""
    description: str
    traditionalUse: str = ""
    prepTime: str = "15 min"
    difficulty: str = "Easy"
    servings: str = "1 cup"
    riskLevel: str = "low"
    sourceIds: list[str] = Field(default_factory=list)
    ingredients: list[IngredientOutput] = Field(default_factory=list)
    steps: list[StepOutput] = Field(default_factory=list)
    usage: str = ""
    precautions: list[PrecautionOutput] = Field(default_factory=list)
    whoShouldAvoid: list[PrecautionOutput] = Field(default_factory=list)

    @field_validator("riskLevel")
    @classmethod
    def validate_risk(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ("low", "moderate", "high"):
            return "moderate"
        return v

    @field_validator("sourceIds")
    @classmethod
    def validate_sources(cls, v: list[str]) -> list[str]:
        valid = {"who", "nccih", "ayush", "pubmed", "mayo"}
        return [s for s in v if s in valid] or ["pubmed"]


class SymptomAnalysisOutput(BaseModel):
    """Validated LLM output for symptom analysis."""
    riskLevel: str = "low"
    redFlags: list[str] = Field(default_factory=list)
    symptoms: str = ""
    identifiedSymptoms: list[str] = Field(default_factory=list)
    summary: str = ""

    @field_validator("riskLevel")
    @classmethod
    def validate_risk(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ("low", "moderate", "high"):
            return "moderate"
        return v


class AllergyWarning(BaseModel):
    """Allergy warning from safety check."""
    allergen: str
    severity: str = "moderate"
    source: SourceCitation


class ConditionWarning(BaseModel):
    """Condition warning from safety check."""
    condition: str
    note: str
    source: SourceCitation


class MedicationInteraction(BaseModel):
    """Medication interaction from safety check."""
    medication: str
    interaction: str
    severity: str = "moderate"
    source: SourceCitation

    @field_validator("severity")
    @classmethod
    def validate_severity(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ("low", "moderate", "high"):
            return "moderate"
        return v


class SafetyOutput(BaseModel):
    """Validated LLM output for safety assessment."""
    allergyWarnings: list[AllergyWarning] = Field(default_factory=list)
    conditionWarnings: list[ConditionWarning] = Field(default_factory=list)
    medicationInteractions: list[MedicationInteraction] = Field(default_factory=list)
    overallRisk: str = "low"

    @field_validator("overallRisk")
    @classmethod
    def validate_risk(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ("low", "moderate", "high"):
            return "moderate"
        return v


# ──────────────────────────────────────────────
# Response Models (API output shapes)
# ──────────────────────────────────────────────

class AnalysisResponse(BaseModel):
    """Response for /api/analyze-symptoms."""
    riskLevel: str
    redFlags: list[str]
    symptoms: str
    identifiedSymptoms: list[str] = Field(default_factory=list)
    summary: str = ""


class ResearchResponse(BaseModel):
    """Response for /api/research-remedies."""
    remedies: list[dict] = Field(default_factory=list)
    sourcesUsed: list[str] = Field(default_factory=list)


class SafetyResponse(BaseModel):
    """Response for /api/safety/<remedy_id>."""
    allergyWarnings: list[dict] = Field(default_factory=list)
    conditionWarnings: list[dict] = Field(default_factory=list)
    medicationInteractions: list[dict] = Field(default_factory=list)
    overallRisk: str = "low"


class HistoryResponse(BaseModel):
    """Response for /api/history."""
    history: list[dict] = Field(default_factory=list)


# ──────────────────────────────────────────────
# Comment & Feedback Request Models
# ──────────────────────────────────────────────

class CommentRequest(BaseModel):
    """Validate incoming comment submissions."""
    remedy_id: str = Field(..., min_length=1)
    author_name: str = Field(default="Anonymous", max_length=100)
    content: str = Field(..., min_length=1, max_length=2000)
    parent_id: Optional[int] = None

    @field_validator("author_name")
    @classmethod
    def clean_name(cls, v: str) -> str:
        v = v.strip()
        return v if v else "Anonymous"

    @field_validator("content")
    @classmethod
    def clean_content(cls, v: str) -> str:
        return v.strip()


class FeedbackRequest(BaseModel):
    """Validate incoming research feedback."""
    rating: int = Field(..., ge=1, le=5)
    helpful: str = Field(default="", max_length=2000)
    improve: str = Field(default="", max_length=2000)
    search_id: Optional[int] = None

