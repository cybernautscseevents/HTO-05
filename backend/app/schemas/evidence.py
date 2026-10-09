from datetime import datetime, timezone
from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, Field

class EvidenceType(str, Enum):
    PHOTO = "PHOTO"
    DOCUMENT = "DOCUMENT"
    CERTIFICATE = "CERTIFICATE"
    WORK_ORDER = "WORK_ORDER"
    INVOICE = "INVOICE"
    VIDEO = "VIDEO"
    DECLARATION = "DECLARATION"
    OTHER = "OTHER"

class VerificationStatus(str, Enum):
    SELF_SUBMITTED = "SELF_SUBMITTED"
    INDEPENDENTLY_CONFIRMED = "INDEPENDENTLY_CONFIRMED"
    DISPUTED = "DISPUTED"
    REVOKED = "REVOKED"

class EvidenceCreate(BaseModel):
    work_record_id: str
    type: EvidenceType
    url: str
    description: Optional[str] = ""
    supports_skills: List[str] = []
    added_by_user_id: Optional[str] = None
    added_by_name: Optional[str] = None
    is_private: bool = False

class Evidence(EvidenceCreate):
    id: str
    is_self_submitted: bool = True
    verification_status: VerificationStatus = VerificationStatus.SELF_SUBMITTED
    confirmed_by_name: Optional[str] = None
    confirmed_by_role: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None
