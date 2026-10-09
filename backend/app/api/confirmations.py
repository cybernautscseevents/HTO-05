from fastapi import APIRouter, HTTPException
from app.schemas.confirmation import Confirmation, ConfirmationRequest, ConfirmationDecision
from app.services.data_service import (
    request_confirmation,
    get_confirmation_by_token,
    resolve_confirmation,
    get_work_record_by_id
)

router = APIRouter(prefix="/confirmations", tags=["Confirmations"])

@router.post("/request", response_model=Confirmation)
def create_confirmation_request(payload: ConfirmationRequest):
    record = get_work_record_by_id(payload.work_record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Work record not found")
        
    created = request_confirmation(
        payload.work_record_id,
        payload.verifier_name,
        payload.verifier_type,
        payload.relationship,
        payload.note
    )
    return created

@router.get("/{token}")
def get_verification_details(token: str):
    data = get_confirmation_by_token(token)
    if not data:
        raise HTTPException(status_code=404, detail="Invalid or expired verification token")
        
    conf = data["confirmation"]
    work = data["work_record"]
    
    # Return minimal safe details for verifier review
    return {
        "token": token,
        "verifier_name": conf["verifier_name"],
        "verifier_type": conf["verifier_type"],
        "relationship": conf.get("relationship"),
        "status": conf["status"],
        "note": conf.get("note"),
        "work": {
            "title": work["title"],
            "description": work["description"],
            "date": work["date"],
            "location": work["location"],
            "quantity": work.get("quantity"),
            "quantity_unit": work.get("quantity_unit"),
            "trade": work.get("trade"),
            "skills": work.get("skills", []),
            "evidence_count": len(work.get("evidence", []))
        }
    }

@router.post("/{token}/confirm")
def submit_verification_decision(token: str, payload: ConfirmationDecision):
    resolved = resolve_confirmation(token, payload.decision, payload.note)
    if not resolved:
        raise HTTPException(status_code=404, detail="Invalid or expired verification token")
        
    return {
        "success": True,
        "decision": payload.decision,
        "message": f"Work record has been marked as {payload.decision}."
    }
