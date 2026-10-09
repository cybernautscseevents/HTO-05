"""
Constants and constraints for audio transcription safety.
"""

# Maximum file size: 25 MB (matches Gemini inline audio and OpenAI Whisper limits)
MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024

# Supported MIME types for speech transcription
SUPPORTED_MIME_TYPES = {
    "audio/wav",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/webm",
    "audio/m4a",
    "audio/x-m4a",
    "audio/mp4",
    "audio/flac",
    "audio/aac",
}

# File extension to MIME type map fallback
EXTENSION_TO_MIME = {
    ".wav": "audio/wav",
    ".mp3": "audio/mp3",
    ".ogg": "audio/ogg",
    ".webm": "audio/webm",
    ".m4a": "audio/m4a",
    ".flac": "audio/flac",
    ".aac": "audio/aac",
    ".mp4": "audio/mp4",
}

DEFAULT_TIMEOUT_SECONDS = 30
