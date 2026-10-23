"""Groq LLM service for PRANA — handles all AI calls with Pydantic validation."""

import json
import time
import traceback
from groq import Groq
from config import Config


def _safe_print(msg: str) -> None:
    """Print with fallback encoding to avoid Windows cp1252 crashes."""
    try:
        print(msg)
    except UnicodeEncodeError:
        print(msg.encode("ascii", errors="replace").decode("ascii"))


# Initialize Groq client
_client = None


def _get_client() -> Groq:
    """Lazy-initialize the Groq client."""
    global _client
    if _client is None:
        _client = Groq(api_key=Config.GROQ_API_KEY)
    return _client


# Retry settings
MAX_RETRIES = 3
BASE_DELAY = 2  # seconds


def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = None) -> str:
    """Make a raw LLM call with retry logic for transient errors."""
    client = _get_client()
    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.chat.completions.create(
                model=Config.LLM_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=Config.LLM_TEMPERATURE,
                max_tokens=max_tokens or Config.LLM_MAX_TOKENS,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            last_error = e
            error_str = str(e).lower()
            # Retry on transient errors (rate limit, overloaded, timeout, 503)
            is_transient = any(keyword in error_str for keyword in [
                "overloaded", "rate_limit", "rate limit", "429", "503",
                "timeout", "service_unavailable", "temporarily",
            ])
            if is_transient and attempt < MAX_RETRIES:
                delay = BASE_DELAY * (2 ** (attempt - 1))  # exponential backoff
                _safe_print(
                    f"[PRANA LLM] Attempt {attempt}/{MAX_RETRIES} failed "
                    f"(transient error), retrying in {delay}s..."
                )
                time.sleep(delay)
            else:
                _safe_print(f"[PRANA LLM] Error calling Groq: {e}")
                traceback.print_exc()
                raise


def call_llm_json(system_prompt: str, user_prompt: str, max_tokens: int = None) -> dict:
    """Call LLM and parse the response as JSON. Handles markdown code fences."""
    raw = call_llm(system_prompt, user_prompt, max_tokens)

    # Strip markdown code fences if present
    text = raw.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        _safe_print(f"[PRANA LLM] JSON parse error: {e}")
        _safe_print(f"[PRANA LLM] Raw response:\n{raw[:500]}")
        # Try to extract JSON from the response
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
        # Try array
        start = text.find("[")
        end = text.rfind("]") + 1
        if start != -1 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
        raise ValueError(f"Could not parse LLM response as JSON: {raw[:200]}")


# ──────────────────────────────────────────────
# Specific LLM Prompts
# ──────────────────────────────────────────────

SYMPTOM_ANALYSIS_SYSTEM = """You are PRANA's medical symptom analyzer. You analyze symptoms described by a user and return a structured JSON assessment.

RULES:
- You do NOT diagnose or prescribe. You only assess risk level and identify symptoms.
- ALWAYS accept and process ANY input, even single words like "cold", "fever", "headache". NEVER refuse to analyze.
- If the input is vague or a single word, do your best to interpret it as a symptom and analyze it. For example:
  * "cold" → interpret as common cold symptoms (runny nose, congestion, sore throat)
  * "fever" → interpret as elevated body temperature
  * "headache" → interpret as head pain
- If the symptom description is too vague to give specific remedies, include a helpful message in the "summary" field asking the user to provide more details for better-targeted remedies. Example: "You mentioned 'cold'. This could include symptoms like runny nose, congestion, sore throat, or sneezing. For more targeted remedies, try describing your specific symptoms in more detail (e.g., 'runny nose and sore throat for 2 days')."
- Risk levels: "low" (common mild symptoms like mild cold, minor headache), "moderate" (symptoms needing monitoring like persistent cough, mild fever), "high" (potentially dangerous, needs professional care).
- CRITICAL: You MUST classify as "high" risk if the user mentions ANY of the following:
  * ANY type of cancer, tumor, malignancy, leukemia, lymphoma
  * Stroke, heart attack, cardiac issues
  * Diabetes, thyroid disorders, epilepsy
  * HIV, AIDS, hepatitis, tuberculosis, malaria, dengue
  * Kidney/liver/organ failure
  * Fractures, head injuries, spinal injuries
  * Pneumonia, asthma attacks, severe infections
  * Any diagnosed chronic disease or serious medical condition
  * Chest pain, difficulty breathing, seizures, loss of consciousness
  * Blood in cough/stool/urine, severe bleeding
  * Suicidal thoughts, self-harm
  * Any condition that requires prescription medication or hospital care
- Red flags: any symptom matching serious conditions. Add ALL matched serious conditions to the redFlags array.
- If ANY red flag is detected, riskLevel MUST be "high". NEVER classify a serious disease as "moderate".
- When in doubt between "moderate" and "high", ALWAYS choose "high". Patient safety is paramount.
- Only use "low" for clearly minor, self-limiting symptoms (e.g., "mild runny nose", "slight headache").

Return ONLY valid JSON with this exact structure:
{
  "riskLevel": "low|moderate|high",
  "redFlags": ["list of matched red flag symptoms, empty if none"],
  "symptoms": "original symptoms text",
  "identifiedSymptoms": ["individual symptom 1", "individual symptom 2"],
  "summary": "Brief clinical summary. If the input was vague, include a suggestion to describe symptoms in more detail for better-targeted remedies."
}"""


REMEDY_RESEARCH_SYSTEM = """You are PRANA's traditional remedy researcher. Your job is to find SPECIFIC remedies that directly target the user's exact symptoms — not generic wellness remedies.

CRITICAL RULES:
1. SYMPTOM SPECIFICITY IS MANDATORY. Each remedy MUST directly address the user's specific symptoms. For example:
   - If the user has "sore throat + dry cough", recommend remedies that specifically soothe throat inflammation and suppress dry cough — NOT generic "immunity boosting" teas.
   - If the user has "headache + nausea", recommend remedies known to relieve headache pain and calm nausea — NOT general digestive tonics.
2. In the "description" field, you MUST explain exactly HOW and WHY this remedy targets the user's specific symptoms (e.g., "Ginger's gingerols inhibit prostaglandin synthesis, reducing the inflammation causing your sore throat, while honey coats and soothes irritated mucous membranes").
3. DO NOT return generic remedies like "golden milk for general wellness" or "tulsi tea for immunity" unless they specifically target the stated symptoms.
4. You do NOT invent remedies. Base them on documented traditional medicine from: WHO, NCCIH, Ministry of AYUSH, PubMed, Mayo Clinic.
5. Source IDs: "who", "nccih", "ayush", "pubmed", "mayo"
6. Every ingredient, step, and precaution MUST have a source citation referencing real publications.
7. Include allergen warnings on ingredients (e.g., "dairy", "bee products", "citrus", "nuts").
8. Include who should avoid each remedy with source.
9. Remedies must be traditional/home remedies, NOT pharmaceutical drugs.
10. Generate a URL-friendly ID (lowercase, hyphens) for each remedy.
11. Provide EXACT measurements (e.g., "1/2 teaspoon" not "some"), EXACT temperatures (e.g., "70°C/160°F" not "warm"), and EXACT durations (e.g., "steep for 5 minutes" not "steep briefly").

CONTEXT: You will be given scraped content from trusted sources. Use this to ground your remedies in real data. If scraped content lacks relevant information, use your knowledge of documented traditional remedies, but always cite accurately.

Return ONLY valid JSON array of remedies:
[
  {
    "id": "url-friendly-id",
    "name": "Remedy Name (specific to the symptom)",
    "traditionalName": "Traditional name if applicable",
    "tradition": "e.g., Ayurveda (Indian Traditional Medicine)",
    "description": "2-3 sentences explaining EXACTLY how this remedy targets the user's specific symptoms and the mechanism of action",
    "traditionalUse": "Historical context and how this remedy has been traditionally used for these specific symptoms",
    "prepTime": "15 min",
    "difficulty": "Easy|Medium|Hard",
    "servings": "1 cup",
    "riskLevel": "low|moderate",
    "sourceIds": ["ayush", "nccih"],
    "ingredients": [
      {
        "name": "Ingredient name",
        "amount": "Exact specific amount (e.g., 1/2 teaspoon, 2 cm piece)",
        "allergens": ["allergen1"],
        "source": {"id": "source_id", "citation": "Specific citation from real publication"}
      }
    ],
    "steps": [
      {
        "instruction": "Detailed step with exact temperatures, times, and techniques",
        "source": {"id": "source_id", "citation": "Specific citation"}
      }
    ],
    "usage": "Exact dosage, frequency, and timing (e.g., 'Drink 1 cup 3 times daily, 30 minutes before meals, for up to 5 days')",
    "precautions": [
      {"text": "Specific precaution text", "source": {"id": "source_id", "citation": "Specific citation"}}
    ],
    "whoShouldAvoid": [
      {"text": "Specific group and reason", "source": {"id": "source_id", "citation": "Specific citation"}}
    ]
  }
]

Return 2-4 remedies. Each MUST be specifically targeted at the user's symptoms — NOT generic wellness remedies."""


SAFETY_CHECK_SYSTEM = """You are PRANA's safety assessment engine. You analyze a traditional remedy for potential safety concerns including allergies, existing conditions, and medication interactions.

RULES:
- Every warning MUST have a source citation from: "who", "nccih", "ayush", "pubmed", "mayo"
- Severity levels: "low", "moderate", "high"
- Be thorough but not alarmist. Focus on documented, evidence-based interactions.
- If the remedy contains common allergens (honey, dairy, nuts, citrus), flag them.
- Check for interactions with common medications (blood thinners, diabetes meds, blood pressure meds).

Return ONLY valid JSON:
{
  "allergyWarnings": [
    {"allergen": "Name", "severity": "low|moderate|high", "source": {"id": "source_id", "citation": "citation"}}
  ],
  "conditionWarnings": [
    {"condition": "Condition name", "note": "Explanation", "source": {"id": "source_id", "citation": "citation"}}
  ],
  "medicationInteractions": [
    {"medication": "Medication name", "interaction": "Explanation", "severity": "low|moderate|high", "source": {"id": "source_id", "citation": "citation"}}
  ],
  "overallRisk": "low|moderate|high"
}"""


def analyze_symptoms(symptoms_text: str) -> dict:
    """Analyze symptoms using LLM and return structured assessment."""
    return call_llm_json(
        SYMPTOM_ANALYSIS_SYSTEM,
        f"Analyze these symptoms:\n\n{symptoms_text}",
    )


def research_remedies(symptoms_text: str, scraped_context: str = "") -> list:
    """Research remedies using LLM with optional scraped context."""
    context_section = ""
    if scraped_context:
        context_section = f"\n\nSCRAPED CONTEXT FROM TRUSTED SOURCES (use this to ground your remedies):\n{scraped_context[:4000]}"

    user_prompt = (
        f"The user is experiencing the following symptoms:\n"
        f"\"\"\"\n{symptoms_text}\n\"\"\"\n\n"
        f"Find 2-4 traditional/home remedies that SPECIFICALLY target these exact symptoms. "
        f"Each remedy must directly address the symptoms listed above — do NOT suggest generic wellness remedies. "
        f"In each remedy's description, explain the specific mechanism by which it helps these symptoms."
        f"{context_section}"
    )

    try:
        result = call_llm_json(
            REMEDY_RESEARCH_SYSTEM,
            user_prompt,
            max_tokens=8192,
        )
    except (ValueError, Exception) as e:
        _safe_print(f"[PRANA LLM] First attempt failed ({e}), retrying with shorter prompt...")
        # Retry without scraped context to keep response shorter
        try:
            result = call_llm_json(
                REMEDY_RESEARCH_SYSTEM,
                f"The user has these symptoms: {symptoms_text}\n\n"
                f"Find 2 traditional remedies that SPECIFICALLY treat these exact symptoms. "
                f"Explain how each remedy targets these symptoms. Keep JSON concise.",
                max_tokens=8192,
            )
        except Exception as e2:
            _safe_print(f"[PRANA LLM] Retry also failed: {e2}")
            return []

    # Handle both list and dict responses
    if isinstance(result, dict):
        if "remedies" in result:
            return result["remedies"]
        return [result]
    return result


def check_safety(remedy_data: dict, user_profile: dict = None) -> dict:
    """Check safety of a remedy using LLM."""
    profile_text = ""
    if user_profile:
        parts = []
        if user_profile.get("allergies"):
            parts.append(f"Known allergies: {', '.join(user_profile['allergies'])}")
        if user_profile.get("conditions"):
            parts.append(f"Existing conditions: {', '.join(user_profile['conditions'])}")
        if user_profile.get("medications"):
            parts.append(f"Current medications: {', '.join(user_profile['medications'])}")
        if parts:
            profile_text = f"\n\nUSER PROFILE:\n" + "\n".join(parts)

    remedy_summary = (
        f"Remedy: {remedy_data.get('name', 'Unknown')}\n"
        f"Ingredients: {json.dumps(remedy_data.get('ingredients', []), indent=2)}\n"
        f"Precautions: {json.dumps(remedy_data.get('precautions', []), indent=2)}"
    )

    return call_llm_json(
        SAFETY_CHECK_SYSTEM,
        f"Assess the safety of this remedy:\n\n{remedy_summary}{profile_text}",
    )
