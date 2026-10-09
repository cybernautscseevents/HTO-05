"""
VOUCH Voice Transcription Module
---------------------------------
Independent voice-to-text adapter for transcribing blue-collar worker audio
in English, Hindi, and mixed Hindi-English (Hinglish).
"""

from .transcriber import transcribe_audio
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
from .constants import (
    MAX_AUDIO_SIZE_BYTES,
    SUPPORTED_MIME_TYPES,
)

__all__ = [
    "transcribe_audio",
    "TranscriptionError",
    "AudioValidationError",
    "ProviderUnavailableError",
    "TranscriptionFailedError",
    "BaseTranscriptionProvider",
    "GeminiTranscriptionProvider",
    "OpenAITranscriptionProvider",
    "MAX_AUDIO_SIZE_BYTES",
    "SUPPORTED_MIME_TYPES",
]
