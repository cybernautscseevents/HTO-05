import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
import requests
from .prompts import SYSTEM_PROMPT
from .fallback import extract_claims_fallback

logger = logging.getLogger("vouch.worker_extraction")


class BaseLLMProvider(ABC):
    """Abstract interface isolating LLM providers from business logic."""
    @abstractmethod
    def extract(self, text: str) -> Optional[Dict[str, Any]]:
        pass


class GeminiProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, timeout: int = 25):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.model = model or os.getenv("GEMINI_EXTRACTION_MODEL") or os.getenv("GEMINI_MODEL") or "gemini-3.5-flash-lite"
        self.timeout = timeout

    def extract(self, text: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            logger.debug("GeminiProvider: GEMINI_API_KEY not configured.")
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                f"{SYSTEM_PROMPT}\n\n"
                                f"Worker Natural Language Statement:\n\"\"\"{text}\"\"\"\n\n"
                                f"Extract and return purely the JSON object:"
                            )
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "responseMimeType": "application/json"
            }
        }

        try:
            resp = requests.post(url, json=payload, timeout=self.timeout)
            if resp.status_code == 200:
                res_data = resp.json()
                cand_text = res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
                # Parse JSON string
                return json.loads(cand_text)
            else:
                logger.warning(f"GeminiProvider error {resp.status_code}: {resp.text}")
                return None
        except Exception as e:
            logger.warning(f"GeminiProvider request failed: {e}")
            return None


class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o-mini", timeout: int = 10):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.timeout = timeout

    def extract(self, text: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            logger.debug("OpenAIProvider: OPENAI_API_KEY not configured.")
            return None

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Worker Statement: \"\"\"{text}\"\"\""}
            ],
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=self.timeout)
            if resp.status_code == 200:
                res_data = resp.json()
                content = res_data["choices"][0]["message"]["content"]
                return json.loads(content)
            else:
                logger.warning(f"OpenAIProvider error {resp.status_code}: {resp.text}")
                return None
        except Exception as e:
            logger.warning(f"OpenAIProvider request failed: {e}")
            return None


class FallbackProvider(BaseLLMProvider):
    """Deterministic multilingual rule-based extractor."""
    def extract(self, text: str) -> Optional[Dict[str, Any]]:
        result = extract_claims_fallback(text)
        return result.model_dump()
