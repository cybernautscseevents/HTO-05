from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field

class ContractorProfileBase(BaseModel):
    company_name: str
    contact_person: str
    industry: str
    location: str

class ContractorProfileCreate(ContractorProfileBase):
    user_id: str

class ContractorProfile(ContractorProfileBase):
    id: str
    user_id: str
    saved_worker_ids: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None

class SavedWorker(BaseModel):
    id: str
    contractor_id: str
    worker_id: str
    saved_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    notes: Optional[str] = None
