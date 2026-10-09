from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List, Any
from pydantic import BaseModel, Field, model_validator

class ConfidenceTier(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class SkillConfidence(BaseModel):
    skill_name: str
    tier: ConfidenceTier = ConfidenceTier.LOW
    evidence_score: int = Field(
        default=0,
        description="Deterministic strength of available evidence (0-100). NOT a measure of innate skill ability."
    )
    confidence: int = Field(
        default=0,
        description="Backward-compatible alias for evidence_score."
    )
    work_count: int = 0
    confirmation_count: int = 0
    photo_count: int = 0
    document_count: int = 0
    explanation: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def sync_evidence_score(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "confidence" in data and ("evidence_score" not in data or data["evidence_score"] == 0):
                data["evidence_score"] = data["confidence"]
            elif "evidence_score" in data and ("confidence" not in data or data["confidence"] == 0):
                data["confidence"] = data["evidence_score"]
        return data

class PassportCompleteness(BaseModel):
    score: int  # 0 to 100 percentage
    profile_complete: bool = True
    has_work_history: bool = True
    has_evidence: bool = True
    has_confirmations: bool = True
    breakdown: Optional[str] = None

class WorkerBase(BaseModel):
    name: str
    trade: str
    experience_years: int
    location: str
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    languages: List[str] = Field(default_factory=list)

class WorkerProfileCreate(WorkerBase):
    user_id: str
    public_slug: Optional[str] = None

class WorkerProfile(WorkerBase):
    id: str
    user_id: Optional[str] = None  # FK to User; separate from authentication
    public_slug: Optional[str] = None
    work_count: int = 0
    confirmation_count: int = 0
    overall_evidence_confidence: int = 0
    overall_confidence: int = 0  # Backward-compatible alias
    demonstrated_skills: List[SkillConfidence] = []
    passport_completeness: Optional[PassportCompleteness] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def sync_overall_confidence(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "overall_confidence" in data and ("overall_evidence_confidence" not in data or data["overall_evidence_confidence"] == 0):
                data["overall_evidence_confidence"] = data["overall_confidence"]
            elif "overall_evidence_confidence" in data and ("overall_confidence" not in data or data["overall_confidence"] == 0):
                data["overall_confidence"] = data["overall_evidence_confidence"]
        return data

class InitialWorkRecord(BaseModel):
    title: str
    description: Optional[str] = None
    employer: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    imageUrl: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    verifierName: Optional[str] = None
    verifierRole: Optional[str] = None
    # Supporting Evidence
    evidence_url: Optional[str] = None
    evidence_title: Optional[str] = None
    evidence_type: Optional[str] = "PHOTO"
    evidence_description: Optional[str] = None

class WorkerOnboardingRequest(BaseModel):
    name: str
    trade: str
    experience_years: int = Field(default=0)
    location: str
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    skills: List[str] = Field(default_factory=list)
    languages: Optional[Any] = None
    initial_work: Optional[InitialWorkRecord] = None
    initial_works: Optional[List[InitialWorkRecord]] = None

    @model_validator(mode="before")
    @classmethod
    def handle_onboarding_aliases(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "experienceYears" in data and ("experience_years" not in data or not data["experience_years"]):
                try:
                    data["experience_years"] = int(data["experienceYears"])
                except (ValueError, TypeError):
                    data["experience_years"] = 0
            if "photoUrl" in data and "profile_photo_url" not in data:
                data["profile_photo_url"] = data["photoUrl"]
            # Normalize languages to list of strings
            raw_langs = data.get("languages")
            if isinstance(raw_langs, str):
                cleaned = [l.strip() for l in raw_langs.split(",") if l.strip()]
                data["languages"] = cleaned
            elif isinstance(raw_langs, list):
                data["languages"] = [str(l).strip() for l in raw_langs if str(l).strip()]
            # Phone cleanup
            if data.get("phone") and isinstance(data["phone"], str):
                data["phone"] = data["phone"].strip() or None
        return data

