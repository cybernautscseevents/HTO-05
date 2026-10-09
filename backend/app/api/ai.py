from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.schemas.ai import WorkExtractionRequest, WorkExtractionResponse
from app.services.ai_service import extract_work_from_text
from app.services.worker_profile_extractor import extract_worker_profile, WorkerProfileExtraction
from app.services.voice_service import transcribe_audio, TranscriptionError, AudioValidationError

router = APIRouter(prefix="/ai", tags=["AI"])

class ProfileExtractionRequest(BaseModel):
    text: str

class AudioTranscriptionResponse(BaseModel):
    transcript: str

@router.post("/extract-work", response_model=WorkExtractionResponse)
def extract_work_details(payload: WorkExtractionRequest):
    return extract_work_from_text(payload.text)

@router.post("/extract-profile", response_model=WorkerProfileExtraction)
def extract_worker_profile_endpoint(payload: ProfileExtractionRequest):
    return extract_worker_profile(payload.text)

@router.post("/transcribe-audio", response_model=AudioTranscriptionResponse)
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    try:
        content = await file.read()
        transcript = transcribe_audio(
            audio_bytes=content,
            filename=file.filename,
            mime_type=file.content_type
        )
        return AudioTranscriptionResponse(transcript=transcript)
    except AudioValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except TranscriptionError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription error: {str(e)}")

