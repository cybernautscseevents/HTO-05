from datetime import datetime, timezone
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field

class VerifierRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    SUPERVISOR = "SUPERVISOR"
    EMPLOYER = "EMPLOYER"
    COLLEAGUE = "COLLEAGUE"

# Backward compatibility alias
VerifierType = VerifierRole

class ConfirmationStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"
    NOT_SURE = "NOT_SURE"
    REVOKED = "REVOKED"

class ConfirmationRequest(BaseModel):
    work_record_id: str
    verifier_name: str
    verifier_type: VerifierRole = VerifierRole.CUSTOMER
    relationship: Optional[str] = None
    note: Optional[str] = None

class ConfirmationDecision(BaseModel):
    decision: ConfirmationStatus
    note: Optional[str] = None

class Confirmation(BaseModel):
    id: str
    work_record_id: str
    worker_id: Optional[str] = None
    verifier_name: str
    verifier_type: VerifierRole
    relationship: Optional[str] = None
    status: ConfirmationStatus
    token: str
    note: Optional[str] = None
    requested_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    responded_at: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    verified_at: Optional[str] = None
