from datetime import datetime, timezone
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.evidence import Evidence
from app.schemas.confirmation import Confirmation

class WorkStatus(str, Enum):
    DRAFT = "DRAFT"
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"

class WorkRecordCreate(BaseModel):
    title: str
    description: str
    date: str
    location: Optional[str] = None
    quantity: Optional[float] = None
    quantity_unit: Optional[str] = None
    trade: Optional[str] = None
    skills: List[str] = []
    # Employer / organization context (worker retains ownership)
    employer_name: Optional[str] = None
    organization_id: Optional[str] = None
    project_name: Optional[str] = None

class WorkRecord(WorkRecordCreate):
    id: str
    worker_id: str
    status: WorkStatus = WorkStatus.PENDING
    evidence: List[Evidence] = []
    confirmations: List[Confirmation] = []
    confidence: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None
