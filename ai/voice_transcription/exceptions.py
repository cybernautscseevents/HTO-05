"""
Custom exceptions for the voice transcription module.
All exceptions derive from TranscriptionError for unified error handling.
"""

class TranscriptionError(Exception):
    """Base exception for all transcription errors."""
    pass


class AudioValidationError(TranscriptionError):
    """Raised when the audio payload fails validation (empty, oversized, unsupported mime type)."""
    pass


class ProviderUnavailableError(TranscriptionError):
    """Raised when an audio transcription provider is unconfigured or unavailable."""
    pass


class TranscriptionFailedError(TranscriptionError):
    """Raised when all transcription providers fail to transcribe the audio."""
    pass
