from datetime import datetime, timezone
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class AuditEvent(BaseModel):
    id: str
    entity_type: str  # e.g., "work_record", "evidence", "confirmation"
    entity_id: str
    action: str  # e.g., "CREATE", "UPDATE", "CONFIRM", "REJECT", "REVOKE", "DELETE"
    performed_by_id: str
    performed_by_name: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    details: Optional[Dict[str, Any]] = None
