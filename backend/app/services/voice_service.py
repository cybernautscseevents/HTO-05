"""
Voice Service Bridge
--------------------
Allows backend services and API routes to invoke the isolated ai.voice_transcription module
without architectural entanglement.
"""

import sys
from pathlib import Path

# Ensure project root is in sys.path
ROOT_DIR = Path(__file__).resolve().parents[3]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

try:
    from ai.voice_transcription import (
        transcribe_audio,
        TranscriptionError,
        AudioValidationError,
        ProviderUnavailableError,
        TranscriptionFailedError,
    )
except ImportError:
    from ai.voice_transcription.transcriber import transcribe_audio
    from ai.voice_transcription.exceptions import (
        TranscriptionError,
        AudioValidationError,
        ProviderUnavailableError,
        TranscriptionFailedError,
    )

__all__ = [
    "transcribe_audio",
    "TranscriptionError",
    "AudioValidationError",
    "ProviderUnavailableError",
    "TranscriptionFailedError",
]
