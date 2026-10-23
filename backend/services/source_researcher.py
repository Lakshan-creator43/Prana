"""Source researcher — orchestrates scraping + LLM to produce validated remedies."""

import hashlib
import traceback
from services.scraper import gather_context_for_symptoms
from services.llm_service import research_remedies as llm_research
from models import RemedyOutput
from database import get_cached_remedy, set_cached_remedy


def research_remedies(symptoms_text: str) -> dict:
    """Full research pipeline: scrape → LLM → validate → cache.

    Returns:
        {
            "remedies": [validated remedy dicts],
            "sourcesUsed": ["who", "nccih", ...]
        }
    """
    # Check cache first
    cache_key = _make_cache_key(symptoms_text)
    cached = get_cached_remedy(cache_key)
    if cached:
        print(f"[PRANA Research] Cache hit for: {symptoms_text[:40]}...")
        return {
            "remedies": cached["remedies"],
            "sourcesUsed": _extract_sources(cached["remedies"]),
        }

    # Step 1: Scrape trusted sources for context
    print(f"[PRANA Research] Gathering context for: {symptoms_text[:40]}...")
    scraped_context = gather_context_for_symptoms(symptoms_text)
    print(f"[PRANA Research] Gathered {len(scraped_context)} chars of context")

    # Step 2: Call LLM with scraped context
    print("[PRANA Research] Calling LLM for remedy research...")
    try:
        raw_remedies = llm_research(symptoms_text, scraped_context)
    except Exception as e:
        print(f"[PRANA Research] LLM error: {e}")
        traceback.print_exc()
        return {"remedies": [], "sourcesUsed": []}

    # Step 3: Validate each remedy through Pydantic
    validated_remedies = []
    for raw in raw_remedies:
        try:
            validated = RemedyOutput(**raw)
            validated_remedies.append(validated.model_dump())
        except Exception as e:
            print(f"[PRANA Research] Validation error for remedy: {e}")
            # Try to salvage with relaxed validation
            try:
                # Ensure minimum required fields
                if "name" in raw and "description" in raw:
                    raw.setdefault("id", _slugify(raw["name"]))
                    raw.setdefault("sourceIds", ["pubmed"])
                    raw.setdefault("ingredients", [])
                    raw.setdefault("steps", [])
                    raw.setdefault("precautions", [])
                    raw.setdefault("whoShouldAvoid", [])
                    validated = RemedyOutput(**raw)
                    validated_remedies.append(validated.model_dump())
            except Exception as e2:
                print(f"[PRANA Research] Could not salvage remedy: {e2}")
                continue

    # Step 4: Cache results
    if validated_remedies:
        sources_used = _extract_sources(validated_remedies)
        set_cached_remedy(cache_key, validated_remedies, sources_used)
        print(f"[PRANA Research] Cached {len(validated_remedies)} remedies")
    else:
        sources_used = []

    return {
        "remedies": validated_remedies,
        "sourcesUsed": sources_used,
    }


def _make_cache_key(symptoms: str) -> str:
    """Create a stable cache key from symptoms text."""
    normalized = " ".join(symptoms.lower().split())
    return hashlib.md5(normalized.encode()).hexdigest()


def _extract_sources(remedies: list) -> list:
    """Extract unique source IDs from a list of remedies."""
    sources = set()
    for r in remedies:
        for sid in r.get("sourceIds", []):
            sources.add(sid)
    return list(sources)


def _slugify(text: str) -> str:
    """Create a URL-friendly slug from text."""
    import re
    slug = text.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s]+", "-", slug)
    return slug[:50]
