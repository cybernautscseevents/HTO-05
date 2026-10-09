import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
import pytest

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ai.voice_transcription import (
    transcribe_audio,
    TranscriptionError,
    AudioValidationError,
    ProviderUnavailableError,
    TranscriptionFailedError,
    GeminiTranscriptionProvider,
    OpenAITranscriptionProvider,
    MAX_AUDIO_SIZE_BYTES,
)
from app.services.worker_profile_extractor import extract_worker_profile, WorkerProfileExtraction


DUMMY_AUDIO_BYTES = b"RIFF....WAVEfmt ....data...."


def test_1_successful_gemini_transcription():
    """1. Test successful Gemini transcription (Primary provider)."""
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {"text": "I have been working as an electrician for 10 years in Bangalore."}
                    ]
                }
            }
        ]
    }

    with patch("requests.post", return_value=mock_resp):
        gemini = GeminiTranscriptionProvider(api_key="mock_gemini_key")
        transcript = transcribe_audio(
            DUMMY_AUDIO_BYTES,
            filename="sample.wav",
            mime_type="audio/wav",
            primary_provider=gemini
        )

        assert transcript == "I have been working as an electrician for 10 years in Bangalore."


def test_2_gemini_failure_openai_fallback():
    """2. Test Gemini failure triggering OpenAI Whisper fallback."""
    # Gemini fails with 500 error
    mock_gemini_resp = MagicMock()
    mock_gemini_resp.status_code = 500
    mock_gemini_resp.text = "Internal Gemini Error"

    # OpenAI succeeds with 200 text response
    mock_openai_resp = MagicMock()
    mock_openai_resp.status_code = 200
    mock_openai_resp.text = "Main 5 saal se plumber ka kaam kar raha hu Delhi me."

    def mock_requests_post(url, *args, **kwargs):
        if "generativelanguage" in url:
            return mock_gemini_resp
        return mock_openai_resp

    with patch("requests.post", side_effect=mock_requests_post):
        gemini = GeminiTranscriptionProvider(api_key="mock_gemini_key")
        openai = OpenAITranscriptionProvider(api_key="mock_openai_key")

        transcript = transcribe_audio(
            DUMMY_AUDIO_BYTES,
            primary_provider=gemini,
            fallback_provider=openai
        )

        assert transcript == "Main 5 saal se plumber ka kaam kar raha hu Delhi me."


def test_3_gemini_failure_no_fallback_configured():
    """3. Test Gemini failure when no fallback provider is configured."""
    mock_gemini_resp = MagicMock()
    mock_gemini_resp.status_code = 500
    mock_gemini_resp.text = "Gemini Unavailable"

    with patch("requests.post", return_value=mock_gemini_resp):
        gemini = GeminiTranscriptionProvider(api_key="mock_gemini_key")
        openai = OpenAITranscriptionProvider(api_key="")  # Unconfigured fallback

        with pytest.raises(TranscriptionFailedError) as exc_info:
            transcribe_audio(
                DUMMY_AUDIO_BYTES,
                primary_provider=gemini,
                fallback_provider=openai
            )

        assert "Audio transcription failed" in str(exc_info.value)


def test_4_empty_audio_rejected():
    """4. Test that empty audio bytes are rejected immediately."""
    with pytest.raises(AudioValidationError) as exc_info:
        transcribe_audio(b"")

    assert "empty" in str(exc_info.value).lower()


def test_5_unsupported_mime_type_rejected():
    """5. Test that unsupported MIME types are rejected with AudioValidationError."""
    with pytest.raises(AudioValidationError) as exc_info:
        transcribe_audio(
            DUMMY_AUDIO_BYTES,
            mime_type="application/pdf"
        )

    assert "unsupported audio mime type" in str(exc_info.value).lower()


def test_6_oversized_input_rejected():
    """6. Test that audio larger than MAX_AUDIO_SIZE_BYTES is rejected."""
    oversized = b"0" * (MAX_AUDIO_SIZE_BYTES + 1)
    with pytest.raises(AudioValidationError) as exc_info:
        transcribe_audio(oversized)

    assert "exceeds the maximum limit" in str(exc_info.value).lower()


def test_7_provider_timeout_or_error():
    """7. Test bounded provider timeout / network connection error handling."""
    with patch("requests.post", side_effect=TimeoutError("Connection timed out")):
        gemini = GeminiTranscriptionProvider(api_key="mock_gemini_key")
        openai = OpenAITranscriptionProvider(api_key="")

        with pytest.raises(TranscriptionFailedError) as exc_info:
            transcribe_audio(
                DUMMY_AUDIO_BYTES,
                primary_provider=gemini,
                fallback_provider=openai
            )

        assert "Audio transcription failed" in str(exc_info.value)


def test_8_provider_independent_interface():
    """8. Test that the interface returns a plain string without exposing internal provider details."""
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "candidates": [{"content": {"parts": [{"text": "Verbatim transcript text."}]}}]
    }

    with patch("requests.post", return_value=mock_resp):
        gemini = GeminiTranscriptionProvider(api_key="mock_gemini_key")
        result = transcribe_audio(DUMMY_AUDIO_BYTES, primary_provider=gemini)

        assert isinstance(result, str)
        assert result == "Verbatim transcript text."


def test_9_api_keys_read_from_environment(monkeypatch):
    """9. Test that API keys are read securely from environment variables."""
    monkeypatch.setenv("GEMINI_API_KEY", "env_gemini_secret")
    monkeypatch.setenv("OPENAI_API_KEY", "env_openai_secret")

    gemini = GeminiTranscriptionProvider()
    openai = OpenAITranscriptionProvider()

    assert gemini.is_available() is True
    assert gemini.api_key == "env_gemini_secret"

    assert openai.is_available() is True
    assert openai.api_key == "env_openai_secret"


def test_10_downstream_worker_extraction_compatibility():
    """10. Test downstream compatibility: transcript fed directly into extract_worker_profile."""
    # Step A: Voice transcription returns Hindi/Hinglish speech verbatim
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {"text": "Main pichle 8 saal se plumber ka kaam kar raha hoon aur pipe fitting aati hai."}
                    ]
                }
            }
        ]
    }

    with patch("requests.post", return_value=mock_resp):
        gemini = GeminiTranscriptionProvider(api_key="mock_key")
        transcript = transcribe_audio(DUMMY_AUDIO_BYTES, primary_provider=gemini)

    # Step B: Pass verbatim transcript directly into worker profile extractor
    profile = extract_worker_profile(transcript)

    assert isinstance(profile, WorkerProfileExtraction)
    assert profile.occupation == "plumber"
    assert profile.experience_years_claimed == 8
    assert "pipe fitting" in profile.skills
    # Check claim origin preservation
    assert len(profile.claims) > 0
    for claim in profile.claims:
        assert claim.source == "worker_statement"
