from fastapi import APIRouter, HTTPException, Request
from app.schemas.passport import PassportData
from app.services.data_service import get_current_worker, get_work_records, get_worker_by_slug

router = APIRouter(prefix="/passport", tags=["Passport"])

@router.get("/{public_slug}", response_model=PassportData)
def get_public_passport(public_slug: str, request: Request):
    # Support lookup either by public_slug or worker_id
    worker = get_worker_by_slug(public_slug)
    if not worker:
        worker = get_current_worker(public_slug, allow_ravi_fallback=False)
    if not worker:
        if public_slug in ["ravi-kumar-82a7", "ravi_kumar_001"]:
            worker = get_current_worker("ravi_kumar_001", allow_ravi_fallback=True)
        else:
            raise HTTPException(status_code=404, detail="Public passport profile not found")
        
    works = get_work_records(worker["id"])
    
    total_ev = sum(len(w.get("evidence", [])) for w in works)
    total_conf = sum(len([c for c in w.get("confirmations", []) if c.get("status") == "CONFIRMED"]) for w in works)
    
    base_url = str(request.base_url).rstrip("/")
    resolved_slug = worker.get("public_slug") or worker.get("id") or public_slug
    share_url = f"{base_url}/passport/{resolved_slug}"
    
    completeness_score = worker["passport_completeness"].score if worker.get("passport_completeness") else None

    return PassportData(
        worker=worker,
        overall_evidence_confidence=worker.get("overall_confidence", 0),
        demonstrated_skills=worker.get("demonstrated_skills", []),
        work_history=works,
        total_evidence_count=total_ev,
        total_confirmations_count=total_conf,
        public_slug=resolved_slug,
        share_url=share_url,
        passport_completeness=completeness_score
    )
