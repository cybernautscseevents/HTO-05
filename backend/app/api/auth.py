from typing import Optional
from fastapi import APIRouter, HTTPException, Header, Depends, status
from app.schemas.user import UserRegisterRequest, UserLoginRequest, GoogleLoginRequest, AuthResponse, UserOut
from app.services.auth_service import (
    register_user,
    login_user,
    authenticate_google_user,
    get_user_by_token,
    logout_token,
    EmailAlreadyExistsError,
    InvalidCredentialsError
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_token_from_headers(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
) -> Optional[str]:
    if x_auth_token and x_auth_token.strip():
        return x_auth_token.strip()
    if authorization:
        parts = authorization.strip().split(" ")
        if len(parts) == 2 and parts[0].lower() == "bearer":
            return parts[1].strip()
        if len(parts) == 1:
            return parts[0].strip()
    return None

def get_current_user_required(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
) -> dict:
    token = get_token_from_headers(authorization, x_auth_token)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is required."
        )
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token."
        )
    return user

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_endpoint(payload: UserRegisterRequest):
    try:
        res = register_user(
            name=payload.name,
            email=payload.email,
            password=payload.password,
            role=payload.role
        )
        return AuthResponse(**res)
    except EmailAlreadyExistsError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Registration error: {str(e)}")

@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
def login_endpoint(payload: UserLoginRequest):
    try:
        res = login_user(
            email=payload.email,
            password=payload.password
        )
        return AuthResponse(**res)
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Login error: {str(e)}")

@router.post("/google", response_model=AuthResponse, status_code=status.HTTP_200_OK)
def google_auth_endpoint(payload: GoogleLoginRequest):
    try:
        res = authenticate_google_user(payload.id_token)
        return AuthResponse(**res)
    except EmailAlreadyExistsError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except InvalidCredentialsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication error: {str(e)}"
        )

@router.get("/me", response_model=UserOut, status_code=status.HTTP_200_OK)
def me_endpoint(current_user: dict = Depends(get_current_user_required)):
    return UserOut(
        user_id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user.get("role", "worker"),
        worker_id=current_user.get("worker_id"),
        auth_provider=current_user.get("auth_provider", "password"),
        onboarding_completed=current_user.get("onboarding_completed", False)
    )

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout_endpoint(
    authorization: Optional[str] = Header(None),
    x_auth_token: Optional[str] = Header(None)
):
    token = get_token_from_headers(authorization, x_auth_token)
    if token:
        logout_token(token)
    return {"success": True, "message": "Session invalidated successfully."}
