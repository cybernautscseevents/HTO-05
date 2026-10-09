import logging
from typing import Optional, Union, Dict, Any
from .models import WorkerProfileExtraction, WorkerClaim
from .providers import BaseLLMProvider, GeminiProvider, OpenAIProvider, FallbackProvider
from .fallback import extract_claims_fallback

logger = logging.getLogger("vouch.worker_extraction")

MAX_INPUT_LENGTH = 4000  # Guard against extremely long input/denial of service


def _sanitize_and_validate(raw_data: Dict[str, Any], raw_text: str) -> WorkerProfileExtraction:
    """
    Strict post-model validation:
    1. Validates schema using Pydantic.
    2. Strips any unauthorized fields or prompt-injected keys (e.g., 'verified', 'score').
    3. Guarantees claims list matches extracted fields with source='worker_statement'.
    """
    # Defensive cleanup against injected root keys
    prohibited_keys = ["verified", "is_verified", "credibility", "score", "rating", "truthful", "status"]
    for pk in prohibited_keys:
        raw_data.pop(pk, None)

    # Validate with Pydantic
    extraction = WorkerProfileExtraction.model_validate(raw_data)

    # Ensure claims list is populated for all stated claims
    if not extraction.claims:
        claims = []
        if extraction.occupation:
            claims.append(WorkerClaim(field="occupation", value=extraction.occupation, source="worker_statement"))
        if extraction.experience_years_claimed is not None:
            claims.append(WorkerClaim(field="experience_years_claimed", value=extraction.experience_years_claimed, source="worker_statement"))
        if extraction.skills:
            claims.append(WorkerClaim(field="skills", value=extraction.skills, source="worker_statement"))
        if extraction.location:
            claims.append(WorkerClaim(field="location", value=extraction.location, source="worker_statement"))
        if extraction.languages:
            claims.append(WorkerClaim(field="languages", value=extraction.languages, source="worker_statement"))
        if extraction.employers:
            claims.append(WorkerClaim(field="employers", value=extraction.employers, source="worker_statement"))
        extraction.claims = claims
    else:
        # Strictly enforce source='worker_statement' on every claim
        for claim in extraction.claims:
            claim.source = "worker_statement"

    return extraction


def extract_worker_profile(
    text: Union[str, None],
    provider: Optional[BaseLLMProvider] = None
) -> WorkerProfileExtraction:
    """
    Extracts structured worker claims from natural-language descriptions.
    Supports English, Hindi, and mixed Hindi-English.

    Guarantees:
    - Never raises an unhandled exception.
    - Always returns a valid WorkerProfileExtraction object.
    - Claims are strictly identified as worker_statement (never verified).
    - Falls back safely on API or parsing failures.
    """
    # 1. Handle empty or whitespace input
    if text is None or not isinstance(text, str) or not text.strip():
        return WorkerProfileExtraction()

    clean_text = text.strip()

    # 2. Guard against extreme input lengths
    if len(clean_text) > MAX_INPUT_LENGTH:
        clean_text = clean_text[:MAX_INPUT_LENGTH]

    # 3. Provider resolution
    # If a specific provider instance is supplied, try it first
    if provider is not None:
        try:
            raw_result = provider.extract(clean_text)
            if raw_result and isinstance(raw_result, dict):
                return _sanitize_and_validate(raw_result, clean_text)
        except Exception as e:
            logger.warning(f"Specified LLM provider failed: {e}. Falling back.")

    # 4. Standard provider pipeline: Gemini -> OpenAI -> Deterministic Fallback
    # 4a. Gemini
    gemini = GeminiProvider()
    if gemini.api_key:
        try:
            raw_result = gemini.extract(clean_text)
            if raw_result and isinstance(raw_result, dict):
                return _sanitize_and_validate(raw_result, clean_text)
        except Exception as e:
            logger.warning(f"Gemini extraction failed: {e}")

    # 4b. OpenAI
    openai = OpenAIProvider()
    if openai.api_key:
        try:
            raw_result = openai.extract(clean_text)
            if raw_result and isinstance(raw_result, dict):
                return _sanitize_and_validate(raw_result, clean_text)
        except Exception as e:
            logger.warning(f"OpenAI extraction failed: {e}")

    # 4c. Deterministic Multilingual Fallback
    try:
        return extract_claims_fallback(clean_text)
    except Exception as e:
        logger.error(f"Fallback extraction encountered unexpected error: {e}")
        return WorkerProfileExtraction()


# Alias adhering to camelCase naming requested in specifications
def extractWorkerProfile(text: Union[str, None]) -> Dict[str, Any]:
    """
    CamelCase convenience function returning a JSON-serializable dictionary.
    """
    extraction = extract_worker_profile(text)
    return extraction.model_dump()
