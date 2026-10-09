import os
import logging
from typing import Optional, Union
from .constants import (
    MAX_AUDIO_SIZE_BYTES,
    SUPPORTED_MIME_TYPES,
    EXTENSION_TO_MIME,
)
from .exceptions import (
    TranscriptionError,
    AudioValidationError,
    ProviderUnavailableError,
    TranscriptionFailedError,
)
from .providers import (
    BaseTranscriptionProvider,
    GeminiTranscriptionProvider,
    OpenAITranscriptionProvider,
)

logger = logging.getLogger("vouch.voice")


def _resolve_mime_type(filename: Optional[str], mime_type: Optional[str]) -> str:
    """Infers and validates the audio MIME type."""
    resolved = None
    if mime_type and mime_type.strip():
        resolved = mime_type.strip().lower()
    elif filename and "." in filename:
        ext = os.path.splitext(filename)[1].lower()
        resolved = EXTENSION_TO_MIME.get(ext)
    
    # Default to audio/wav if undetermined
    if not resolved:
        resolved = "audio/wav"

    if resolved not in SUPPORTED_MIME_TYPES:
        raise AudioValidationError(
            f"Unsupported audio MIME type: '{resolved}'. "
            f"Supported types: {sorted(list(SUPPORTED_MIME_TYPES))}"
        )
    return resolved


def transcribe_audio(
    audio_bytes: Union[bytes, bytearray],
    filename: Optional[str] = None,
    mime_type: Optional[str] = None,
    primary_provider: Optional[BaseTranscriptionProvider] = None,
    fallback_provider: Optional[BaseTranscriptionProvider] = None,
) -> str:
    """
    Independent Voice-to-Text adapter entry point.
    Converts audio bytes into plain verbatim transcript text.

    Architecture:
      Audio bytes
          ↓
      Gemini Transcription Provider (PRIMARY)
          ↓ (if Gemini fails or is unconfigured, and OpenAI is available)
      OpenAI Whisper Provider (OPTIONAL FALLBACK)
          ↓
      Plain text transcript

    Parameters:
      audio_bytes: Raw binary audio data.
      filename: Optional filename (e.g. 'recording.wav').
      mime_type: Optional MIME type (e.g. 'audio/wav', 'audio/mp3').
      primary_provider: Optional override for primary provider (defaults to Gemini).
      fallback_provider: Optional override for fallback provider (defaults to OpenAI).

    Returns:
      Transcribed text string in the original spoken language.

    Raises:
      AudioValidationError: Empty, oversized, or unsupported audio data.
      ProviderUnavailableError: When no providers have valid credentials configured.
      TranscriptionFailedError: When transcription attempts fail.
    """
    # 1. Audio validation
    if not isinstance(audio_bytes, (bytes, bytearray)):
        raise AudioValidationError("Audio data must be non-empty bytes or bytearray.")

    if len(audio_bytes) == 0:
        raise AudioValidationError("Audio payload is empty (0 bytes).")

    if len(audio_bytes) > MAX_AUDIO_SIZE_BYTES:
        max_mb = MAX_AUDIO_SIZE_BYTES // (1024 * 1024)
        raise AudioValidationError(
            f"Audio payload size ({len(audio_bytes)} bytes) exceeds the maximum limit of {max_mb} MB."
        )

    resolved_mime = _resolve_mime_type(filename, mime_type)
    resolved_name = filename or ("audio." + resolved_mime.split("/")[-1].replace("x-", ""))

    # 2. Instantiate default providers if not supplied
    gemini = primary_provider or GeminiTranscriptionProvider()
    openai = fallback_provider or OpenAITranscriptionProvider()

    # Check if at least one provider is configured
    if not gemini.is_available() and not openai.is_available():
        raise ProviderUnavailableError(
            "No transcription providers configured. Please set GEMINI_API_KEY (primary) or OPENAI_API_KEY (fallback)."
        )

    errors = []

    # 3. Try Gemini (Primary)
    if gemini.is_available():
        try:
            logger.info("Attempting audio transcription via Gemini (Primary)...")
            transcript = gemini.transcribe(audio_bytes, resolved_mime, resolved_name)
            if transcript and transcript.strip():
                return transcript.strip()
        except Exception as e:
            logger.warning(f"Gemini transcription failed: {e}")
            errors.append(f"Gemini: {e}")
    else:
        logger.info("Gemini provider not configured; skipping to fallback.")

    # 4. Try OpenAI (Optional Fallback)
    if openai.is_available():
        try:
            logger.info("Attempting audio transcription via OpenAI Whisper (Fallback)...")
            transcript = openai.transcribe(audio_bytes, resolved_mime, resolved_name)
            if transcript and transcript.strip():
                return transcript.strip()
        except Exception as e:
            logger.warning(f"OpenAI transcription fallback failed: {e}")
            errors.append(f"OpenAI: {e}")
    else:
        logger.info("OpenAI fallback provider is not configured.")

    # 5. All configured attempts failed
    error_summary = "; ".join(errors) if errors else "No provider succeeded."
    raise TranscriptionFailedError(f"Audio transcription failed: {error_summary}")
