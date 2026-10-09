"""
Real API Smoke Test for Voice Transcription
--------------------------------------------
Generates a small valid WAV byte stream and attempts real transcription
against Gemini (primary) and OpenAI (fallback) if API keys are set.
"""

import os
import sys
import io
import wave
import struct
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Load .env
try:
    from dotenv import load_dotenv
    load_dotenv(PROJECT_ROOT / "backend" / ".env")
    load_dotenv(PROJECT_ROOT / ".env")
except ImportError:
    pass

from ai.voice_transcription import (
    transcribe_audio,
    GeminiTranscriptionProvider,
    OpenAITranscriptionProvider,
    ProviderUnavailableError,
    TranscriptionFailedError,
)


def generate_synthetic_wav() -> bytes:
    """Generates 1.5 seconds of a 440Hz sine wave in valid PCM WAV format."""
    import math
    buffer = io.BytesIO()
    sample_rate = 16000
    duration = 1.5
    num_samples = int(sample_rate * duration)
    
    with wave.open(buffer, 'wb') as wav:
        wav.setnchannels(1)        # Mono
        wav.setsampwidth(2)       # 16-bit
        wav.setframerate(sample_rate)
        
        for i in range(num_samples):
            # 440 Hz tone
            value = int(32767.0 * 0.5 * math.sin(2.0 * math.pi * 440.0 * i / sample_rate))
            wav.writeframesraw(struct.pack('<h', value))
            
    return buffer.getvalue()


def run_smoke_test():
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    openai_key = os.getenv("OPENAI_API_KEY", "").strip()

    print("=" * 60)
    print("VOUCH VOICE TRANSCRIPTION — REAL API SMOKE TEST")
    print("=" * 60)
    print(f"GEMINI_API_KEY configured: {'YES' if gemini_key else 'NO'}")
    print(f"OPENAI_API_KEY configured: {'YES' if openai_key else 'NO'}")
    print("-" * 60)

    audio_bytes = generate_synthetic_wav()
    print(f"Generated synthetic test WAV audio: {len(audio_bytes)} bytes.")

    # 1. Test Gemini (Primary)
    if gemini_key:
        print("\n[1] Testing Real Gemini API Call...")
        try:
            gemini = GeminiTranscriptionProvider(api_key=gemini_key)
            result = gemini.transcribe(audio_bytes, mime_type="audio/wav", filename="test.wav")
            print(f"SUCCESS: Gemini returned transcript: '{result}'")
        except Exception as e:
            print(f"FAILED: Gemini real API call failed: {e}")
    else:
        print("\n[1] Gemini: SKIPPED (GEMINI_API_KEY unavailable in environment).")

    # 2. Test OpenAI (Fallback)
    if openai_key:
        print("\n[2] Testing Real OpenAI Whisper API Call...")
        try:
            openai = OpenAITranscriptionProvider(api_key=openai_key)
            result = openai.transcribe(audio_bytes, mime_type="audio/wav", filename="test.wav")
            print(f"SUCCESS: OpenAI returned transcript: '{result}'")
        except Exception as e:
            print(f"FAILED: OpenAI real API call failed: {e}")
    else:
        print("\n[2] OpenAI: SKIPPED (OPENAI_API_KEY unavailable in environment).")

    # 3. Test Full Adapter Pipeline
    print("\n[3] Testing Full Adapter Pipeline (`transcribe_audio`)...")
    if gemini_key or openai_key:
        try:
            transcript = transcribe_audio(audio_bytes, filename="worker_audio.wav", mime_type="audio/wav")
            print(f"SUCCESS: Adapter returned transcript: '{transcript}'")
        except Exception as e:
            print(f"FAILED: Adapter pipeline error: {e}")
    else:
        print("Expected behavior with no keys: ProviderUnavailableError raised.")
        try:
            transcribe_audio(audio_bytes)
            print("ERROR: Should have raised ProviderUnavailableError!")
        except ProviderUnavailableError as e:
            print(f"VERIFIED: Correctly raised ProviderUnavailableError: {e}")

    print("=" * 60)


if __name__ == "__main__":
    run_smoke_test()
