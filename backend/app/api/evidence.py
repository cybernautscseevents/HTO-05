from fastapi import APIRouter, HTTPException
from app.schemas.evidence import Evidence, EvidenceCreate
from app.services.data_service import add_evidence, get_work_record_by_id

router = APIRouter(prefix="/evidence", tags=["Evidence"])

@router.post("", response_model=Evidence)
def create_evidence(payload: EvidenceCreate):
    record = get_work_record_by_id(payload.work_record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Associated work record not found")
        
    created = add_evidence(payload.work_record_id, payload.dict())
    return created
