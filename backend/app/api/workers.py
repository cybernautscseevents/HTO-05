from typing import Optional, List
from fastapi import APIRouter, HTTPException, Header, Query
from app.schemas.worker import WorkerProfile, WorkerOnboardingRequest
from app.services.data_service import (
    get_current_worker, 
    create_worker_profile, 
    update_worker_profile,
    get_worker_by_email,
    get_all_workers
)
from app.api.auth import get_token_from_headers
from app.services.auth_service import get_user_by_token, mark_onboarding_completed

router = APIRouter(prefix="/workers", tags=["Workers"])

@router.get("", response_model=List[WorkerProfile])
def list_workers():
    """Returns all verified and registered workers in the VOUCH directory."""
    return get_all_workers()

@router.post("", response_model=WorkerProfile, status_code=201)
def create_worker(
    payload: WorkerOnboardingRequest,
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
):
    data = payload.model_dump()
    token = get_token_from_headers(authorization, x_auth_token)
    if token:
        user = get_user_by_token(token)
        if user and user.get("worker_id"):
            # Update the existing worker profile provisioned during registration
            updated = update_worker_profile(user["worker_id"], data)
            mark_onboarding_completed(user["id"])
            return updated

    created = create_worker_profile(data)
    return created

@router.put("/me", response_model=WorkerProfile)
def update_my_profile(
    payload: WorkerOnboardingRequest,
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
):
    token = get_token_from_headers(authorization, x_auth_token)
    if not token:
        raise HTTPException(status_code=401, detail="Authentication token required")
    user = get_user_by_token(token)
    if not user or not user.get("worker_id"):
        raise HTTPException(status_code=404, detail="Worker profile not found for user")
    updated = update_worker_profile(user["worker_id"], payload.model_dump())
    mark_onboarding_completed(user["id"])
    return updated

@router.get("/lookup", response_model=WorkerProfile)
def lookup_worker_by_email(email: str = Query(..., description="Worker registered email address")):
    if not email or not email.strip():
        raise HTTPException(status_code=400, detail="Email query parameter is required")
    worker = get_worker_by_email(email)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker with specified email not found")
    return worker

@router.get("/me", response_model=WorkerProfile)
def get_my_profile(
    worker_id: Optional[str] = Query(None),
    x_worker_id: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
):
    token = get_token_from_headers(authorization, x_auth_token)
    if token:
        user = get_user_by_token(token)
        if user:
            # AUTHENTICATED USER IS THE SOURCE OF TRUTH
            # NEVER fall back to Ravi Kumar for an authenticated user!
            user_worker_id = user.get("worker_id")
            if user_worker_id:
                profile = get_current_worker(user_worker_id, allow_ravi_fallback=False)
                if profile:
                    return profile
                # If worker profile was not found in store, provision/return for this user
                fallback_record = {
                    "id": user_worker_id,
                    "user_id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "trade": "Tradesperson",
                    "experience_years": 0,
                    "location": "India",
                    "skills": []
                }
                return create_worker_profile(fallback_record)
            raise HTTPException(status_code=404, detail="Worker profile not found for authenticated user")

    # Unauthenticated public/demo access fallback (for legacy tests)
    target = worker_id or x_worker_id or "ravi_kumar_001"
    profile = get_current_worker(target, allow_ravi_fallback=True)
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    return profile

@router.get("/{worker_id}", response_model=WorkerProfile)
def get_worker_profile(worker_id: str):
    profile = get_current_worker(worker_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Worker not found")
    return profile
