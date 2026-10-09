import os
import base64
import logging
from abc import ABC, abstractmethod
from typing import Optional
import requests
from .constants import DEFAULT_TIMEOUT_SECONDS
from .exceptions import ProviderUnavailableError, TranscriptionFailedError

logger = logging.getLogger("vouch.voice")


class BaseTranscriptionProvider(ABC):
    """Abstract interface isolating speech-to-text providers."""
    
    @abstractmethod
    def is_available(self) -> bool:
        """Returns True if the provider is properly configured with credentials."""
        pass

    @abstractmethod
    def transcribe(self, audio_bytes: bytes, mime_type: str, filename: str) -> str:
        """
        Transcribes audio bytes to plain text verbatim.
        Raises TranscriptionFailedError if transcription fails.
        """
        pass


class GeminiTranscriptionProvider(BaseTranscriptionProvider):
    """
    Primary transcription provider using Google Gemini multimodal audio API.
    Natively supports English, Hindi, and mixed Hindi-English without prior translation.
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "gemini-3.8-flash",
        timeout: int = DEFAULT_TIMEOUT_SECONDS
    ):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "").strip()
        self.model = model
        self.timeout = timeout

    def is_available(self) -> bool:
        return bool(self.api_key)

    def transcribe(self, audio_bytes: bytes, mime_type: str, filename: str) -> str:
        if not self.is_available():
            raise ProviderUnavailableError("GeminiTranscriptionProvider: GEMINI_API_KEY is not configured.")

        # Normalize mime_type for Gemini if needed (e.g. audio/x-wav -> audio/wav)
        normalized_mime = "audio/wav" if mime_type == "audio/x-wav" else mime_type
        b64_data = base64.b64encode(audio_bytes).decode("utf-8")

        prompt = (
            "Transcribe the following audio speech verbatim in its original spoken language "
            "(preserving English, Hindi, or mixed Hindi-English / Hinglish exactly as spoken). "
            "Output ONLY the plain transcribed text without markdown, timestamps, speaker labels, "
            "introductory phrases, or notes."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt},
                        {
                            "inline_data": {
                                "mime_type": normalized_mime,
                                "data": b64_data
                            }
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.0
            }
        }

        try:
            resp = requests.post(url, json=payload, timeout=self.timeout)
            if resp.status_code == 200:
                res_data = resp.json()
                candidates = res_data.get("candidates", [])
                if not candidates:
                    raise TranscriptionFailedError("Gemini returned empty transcription candidates.")
                
                parts = candidates[0].get("content", {}).get("parts", [])
                if not parts:
                    raise TranscriptionFailedError("Gemini response missing content parts.")
                
                transcript = parts[0].get("text", "").strip()
                if not transcript:
                    raise TranscriptionFailedError("Gemini returned blank transcript.")
                return transcript
            else:
                logger.warning(f"Gemini transcription failed HTTP {resp.status_code}: {resp.text}")
                raise TranscriptionFailedError(f"Gemini API returned status code {resp.status_code}")
        except TranscriptionFailedError:
            raise
        except Exception as e:
            logger.warning(f"Gemini transcription request error: {e}")
            raise TranscriptionFailedError(f"Gemini connection failed: {e}") from e


class OpenAITranscriptionProvider(BaseTranscriptionProvider):
    """
    Optional fallback transcription provider using OpenAI Whisper API.
    """
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "whisper-1",
        timeout: int = DEFAULT_TIMEOUT_SECONDS
    ):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "").strip()
        self.model = model
        self.timeout = timeout

    def is_available(self) -> bool:
        return bool(self.api_key)

    def transcribe(self, audio_bytes: bytes, mime_type: str, filename: str) -> str:
        if not self.is_available():
            raise ProviderUnavailableError("OpenAITranscriptionProvider: OPENAI_API_KEY is not configured.")

        url = "https://api.openai.com/v1/audio/transcriptions"
        headers = {
            "Authorization": f"Bearer {self.api_key}"
        }
        
        # Whisper requires a filename with extension
        upload_name = filename or "audio.wav"
        files = {
            "file": (upload_name, audio_bytes, mime_type)
        }
        data = {
            "model": self.model,
            "response_format": "text",
            "temperature": "0.0"
        }

        try:
            resp = requests.post(url, headers=headers, files=files, data=data, timeout=self.timeout)
            if resp.status_code == 200:
                transcript = resp.text.strip()
                if not transcript:
                    raise TranscriptionFailedError("OpenAI returned blank transcript.")
                return transcript
            else:
                logger.warning(f"OpenAI Whisper transcription failed HTTP {resp.status_code}: {resp.text}")
                raise TranscriptionFailedError(f"OpenAI API returned status code {resp.status_code}")
        except TranscriptionFailedError:
            raise
        except Exception as e:
            logger.warning(f"OpenAI transcription request error: {e}")
            raise TranscriptionFailedError(f"OpenAI connection failed: {e}") from e
