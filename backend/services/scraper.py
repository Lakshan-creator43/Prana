"""Tavily-powered search service for trusted medical and traditional-medicine sources.

Replaces the old manual web scraper with Tavily Search API for faster,
more relevant data retrieval. Tavily handles the crawling and extraction.
"""

import traceback
from tavily import TavilyClient
from config import Config
from database import get_cached_scrape, set_cached_scrape


# Initialize Tavily client (lazy)
_tavily_client = None


def _get_tavily_client() -> TavilyClient:
    """Lazy-initialize the Tavily client."""
    global _tavily_client
    if _tavily_client is None:
        _tavily_client = TavilyClient(api_key=Config.TAVILY_API_KEY)
    return _tavily_client


def tavily_search(query: str, max_results: int = 5, search_depth: str = "advanced") -> str:
    """Search using Tavily API and return combined text content.

    Args:
        query: The search query
        max_results: Number of results to return (default 5)
        search_depth: 'basic' or 'advanced' (default 'advanced' for better results)

    Returns:
        Combined text content from search results
    """
    # Check cache first
    cache_key = f"tavily:{query[:100]}"
    cached = get_cached_scrape(cache_key)
    if cached:
        print(f"[PRANA Tavily] Cache hit: {query[:60]}...")
        return cached

    try:
        client = _get_tavily_client()
        print(f"[PRANA Tavily] Searching: {query[:80]}...")

        response = client.search(
            query=query,
            search_depth=search_depth,
            max_results=max_results,
            include_answer=True,
            include_raw_content=False,
        )

        # Build context from results
        context_parts = []

        # Include Tavily's generated answer if available
        if response.get("answer"):
            context_parts.append(f"=== Tavily Summary ===\n{response['answer']}")

        # Include individual search results
        for result in response.get("results", []):
            title = result.get("title", "")
            url = result.get("url", "")
            content = result.get("content", "")
            if content:
                context_parts.append(
                    f"=== {title} ===\n"
                    f"Source: {url}\n"
                    f"{content}"
                )

        combined = "\n\n".join(context_parts)
        clean_text = combined[:8000]  # Cap total context

        # Cache the result
        if clean_text:
            set_cached_scrape(cache_key, clean_text)

        print(f"[PRANA Tavily] Got {len(response.get('results', []))} results, {len(clean_text)} chars")
        return clean_text

    except Exception as e:
        print(f"[PRANA Tavily] Search error: {e}")
        traceback.print_exc()
        return ""


def gather_context_for_symptoms(symptoms: str) -> str:
    """Gather search context from Tavily for the given symptoms.

    Performs targeted searches to find relevant traditional/home remedy
    information from trusted medical sources.
    """
    context_parts = []

    # Search 1: Direct symptom + traditional remedy search
    primary_query = f"{symptoms} traditional home remedy natural treatment evidence-based"
    primary_results = tavily_search(primary_query, max_results=5)
    if primary_results:
        context_parts.append(primary_results)

    # Search 2: Scientific/medical context for the symptoms
    medical_query = f"{symptoms} herbal remedy PubMed NCCIH research evidence"
    medical_results = tavily_search(medical_query, max_results=3)
    if medical_results:
        context_parts.append(medical_results)

    combined = "\n\n".join(context_parts)
    return combined[:8000]  # Cap total context
