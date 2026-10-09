from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Header
from app.schemas.work import WorkRecord, WorkRecordCreate
from app.services.data_service import (
    get_work_records,
    get_work_record_by_id,
    create_work_record,
    get_active_worker_id
)
from app.api.auth import get_token_from_headers
from app.services.auth_service import get_user_by_token

router = APIRouter(prefix="/work", tags=["Work"])

@router.get("", response_model=List[WorkRecord])
def list_work_records(
    worker_id: Optional[str] = Query(None),
    x_worker_id: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
):
    token = get_token_from_headers(authorization, x_auth_token)
    if token:
        user = get_user_by_token(token)
        if user and user.get("worker_id"):
            return get_work_records(user["worker_id"])

    target = worker_id or x_worker_id or get_active_worker_id()
    return get_work_records(target)

@router.post("", response_model=WorkRecord)
def add_work_record(
    payload: WorkRecordCreate,
    worker_id: Optional[str] = Query(None),
    x_worker_id: Optional[str] = Header(None),
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
):
    token = get_token_from_headers(authorization, x_auth_token)
    target = None
    if token:
        user = get_user_by_token(token)
        if user and user.get("worker_id"):
            target = user["worker_id"]
    if not target:
        target = worker_id or x_worker_id or get_active_worker_id()
    created = create_work_record(target, payload.model_dump())
    return created

@router.get("/{work_id}", response_model=WorkRecord)
def get_work_record(work_id: str):
    record = get_work_record_by_id(work_id)
    if not record:
        raise HTTPException(status_code=404, detail="Work record not found")
    return record
