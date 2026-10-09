from typing import List, Optional
from pydantic import BaseModel
from app.schemas.worker import WorkerProfile, SkillConfidence
from app.schemas.work import WorkRecord

class WorkRecordPublic(BaseModel):
    title: str
    description: str
    date: str
    location: Optional[str] = None
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    trade: Optional[str] = None
    skills: List[str] = []
    employer_name: Optional[str] = None
    status: str
    evidence_count: int = 0
    confirmed_by_types: List[str] = []

class PassportPublic(BaseModel):
    name: str
    trade: str
    experience_years: int
    location: str
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    public_slug: str
    share_url: str
    overall_evidence_confidence: int
    demonstrated_skills: List[SkillConfidence]
    work_history: List[WorkRecordPublic]
    total_evidence_count: int
    total_confirmations_count: int
    passport_completeness: Optional[int] = None

# Internal / Full Representation (preserves backward compatibility)
class PassportData(BaseModel):
    worker: WorkerProfile
    overall_evidence_confidence: int
    demonstrated_skills: List[SkillConfidence]
    work_history: List[WorkRecord]
    total_evidence_count: int
    total_confirmations_count: int
    public_slug: str
    share_url: str
    passport_completeness: Optional[int] = None
