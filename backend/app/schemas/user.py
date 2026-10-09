from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class UserRole(str, Enum):
    WORKER = "WORKER"
    CONTRACTOR = "CONTRACTOR"
    VERIFIER = "VERIFIER"
    ADMIN = "ADMIN"

class UserBase(BaseModel):
    name: str
    role: UserRole
    email: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    password_hash: Optional[str] = None
    worker_id: Optional[str] = None
    firebase_uid: Optional[str] = None
    auth_provider: str = "password"
    onboarding_completed: bool = False
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: Optional[str] = None

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str = Field(..., min_length=8, description="Minimum 8 characters")
    role: str = Field(default="worker", description="'worker' or 'contractor'")

class UserLoginRequest(BaseModel):
    email: str
    password: str

class GoogleLoginRequest(BaseModel):
    id_token: str = Field(..., description="Firebase ID Token verified on the backend")

class AuthResponse(BaseModel):
    token: str
    user_id: str
    name: str
    email: str
    role: str
    worker_id: Optional[str] = None
    is_new_user: bool = False
    onboarding_completed: bool = False

class UserOut(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    worker_id: Optional[str] = None
    auth_provider: Optional[str] = "password"
    onboarding_completed: bool = False
