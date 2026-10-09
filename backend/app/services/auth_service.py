import uuid
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from app.core.firebase import get_db
from app.core.security import hash_password, verify_password, generate_session_token
from app.services.data_service import create_worker_profile

logger = logging.getLogger("vouch.auth")

class AuthError(Exception):
    pass

class EmailAlreadyExistsError(AuthError):
    pass

class InvalidCredentialsError(AuthError):
    pass

# In-memory store for fallback/fast lookups and testing
_AUTH_STORE: Dict[str, Any] = {
    "users": {},          # user_id -> user dict
    "emails": {},         # clean_email -> user_id
    "firebase_uids": {},  # firebase_uid -> user_id
    "sessions": {}        # token -> {"user_id": user_id, "created_at": ...}
}

def register_user(
    name: str,
    email: str,
    password: str,
    role: str = "worker"
) -> Dict[str, Any]:
    if not email or not isinstance(email, str) or not email.strip():
        raise InvalidCredentialsError("Email is required.")
    if not password or len(password) < 8:
        raise InvalidCredentialsError("Password must be at least 8 characters.")

    clean_email = email.strip().lower()
    clean_name = name.strip() or "User"
    norm_role = role.strip().lower() if role else "worker"
    if norm_role in ["employer", "contractor"]:
        norm_role = "contractor"
    else:
        norm_role = "worker"

    # Check for existing account
    existing = get_user_by_email(clean_email)
    if existing:
        raise EmailAlreadyExistsError(f"An account with email '{clean_email}' already exists.")

    user_id = f"user_{uuid.uuid4().hex[:8]}"
    pwd_hash = hash_password(password)
    now_iso = datetime.now(timezone.utc).isoformat()
    worker_id: Optional[str] = None

    # If registering as worker, create the linked Worker profile
    if norm_role == "worker":
        worker_record = create_worker_profile({
            "user_id": user_id,
            "name": clean_name,
            "email": clean_email,
            "trade": "Tradesperson",
            "experience_years": 0,
            "location": "India",
            "skills": []
        })
        worker_id = worker_record["id"]

    user_data = {
        "id": user_id,
        "name": clean_name,
        "email": clean_email,
        "password_hash": pwd_hash,
        "role": norm_role,
        "worker_id": worker_id,
        "onboarding_completed": False,
        "is_active": True,
        "created_at": now_iso
    }

    # Store in memory
    _AUTH_STORE["users"][user_id] = user_data
    _AUTH_STORE["emails"][clean_email] = user_id

    # Store in Firestore
    db = get_db()
    if db:
        try:
            db.collection("users").document(user_id).set(user_data)
            logger.info(f"Registered user {user_id} ({clean_email}) in Firestore")
        except Exception as e:
            logger.warning(f"Error persisting user to Firestore: {e}")

    # Generate session token
    token = generate_session_token()
    session_data = {
        "token": token,
        "user_id": user_id,
        "created_at": now_iso
    }
    _AUTH_STORE["sessions"][token] = session_data

    if db:
        try:
            db.collection("sessions").document(token).set(session_data)
        except Exception as e:
            logger.warning(f"Error persisting session to Firestore: {e}")

    return {
        "token": token,
        "user_id": user_id,
        "name": clean_name,
        "email": clean_email,
        "role": norm_role,
        "worker_id": worker_id,
        "is_new_user": True,
        "onboarding_completed": False
    }

def login_user(email: str, password: str) -> Dict[str, Any]:
    if not email or not password:
        raise InvalidCredentialsError("Invalid email or password.")

    clean_email = email.strip().lower()
    user = get_user_by_email(clean_email)
    if not user:
        # Generic error message: do not expose whether email exists
        raise InvalidCredentialsError("Invalid email or password.")

    pwd_hash = user.get("password_hash")
    if not pwd_hash or not verify_password(password, pwd_hash):
        raise InvalidCredentialsError("Invalid email or password.")

    now_iso = datetime.now(timezone.utc).isoformat()
    token = generate_session_token()
    session_data = {
        "token": token,
        "user_id": user["id"],
        "created_at": now_iso
    }
    _AUTH_STORE["sessions"][token] = session_data

    db = get_db()
    if db:
        try:
            db.collection("sessions").document(token).set(session_data)
        except Exception as e:
            logger.warning(f"Error persisting session to Firestore: {e}")

    return {
        "token": token,
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user.get("role", "worker"),
        "worker_id": user.get("worker_id"),
        "is_new_user": False,
        "onboarding_completed": user.get("onboarding_completed", True)
    }

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    if not email:
        return None
    clean_email = email.strip().lower()

    # 1. Check in-memory store
    user_id = _AUTH_STORE["emails"].get(clean_email)
    if user_id and user_id in _AUTH_STORE["users"]:
        return dict(_AUTH_STORE["users"][user_id])

    # 2. Check Firestore
    db = get_db()
    if db:
        try:
            from google.cloud.firestore_v1.base_query import FieldFilter
            docs = list(db.collection("users").where(filter=FieldFilter("email", "==", clean_email)).limit(1).stream())
            if docs:
                u_data = docs[0].to_dict()
                _AUTH_STORE["users"][u_data["id"]] = u_data
                _AUTH_STORE["emails"][clean_email] = u_data["id"]
                return dict(u_data)
        except Exception as e:
            logger.warning(f"Error querying user by email in Firestore: {e}")

    return None

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    if not user_id:
        return None
    if user_id in _AUTH_STORE["users"]:
        return dict(_AUTH_STORE["users"][user_id])

    db = get_db()
    if db:
        try:
            doc = db.collection("users").document(user_id).get()
            if doc.exists:
                u_data = doc.to_dict()
                _AUTH_STORE["users"][user_id] = u_data
                if u_data.get("email"):
                    _AUTH_STORE["emails"][u_data["email"].strip().lower()] = user_id
                return dict(u_data)
        except Exception as e:
            logger.warning(f"Error querying user by id in Firestore: {e}")

    return None

def get_user_by_token(token: str) -> Optional[Dict[str, Any]]:
    if not token or not isinstance(token, str):
        return None

    clean_token = token.strip()
    session = _AUTH_STORE["sessions"].get(clean_token)

    if not session:
        db = get_db()
        if db:
            try:
                doc = db.collection("sessions").document(clean_token).get()
                if doc.exists:
                    session = doc.to_dict()
                    _AUTH_STORE["sessions"][clean_token] = session
            except Exception as e:
                logger.warning(f"Error reading session from Firestore: {e}")

    if not session:
        return None

    user_id = session.get("user_id")
    if not user_id:
        return None

    return get_user_by_id(user_id)

def logout_token(token: str) -> bool:
    if not token:
        return False
    clean_token = token.strip()
    _AUTH_STORE["sessions"].pop(clean_token, None)

    db = get_db()
    if db:
        try:
            db.collection("sessions").document(clean_token).delete()
        except Exception as e:
            logger.warning(f"Error deleting session from Firestore: {e}")

    return True
    
def get_user_by_firebase_uid(firebase_uid: str) -> Optional[Dict[str, Any]]:
    if not firebase_uid:
        return None
        
    clean_uid = firebase_uid.strip()
    # 1. Check in-memory store
    user_id = _AUTH_STORE.get("firebase_uids", {}).get(clean_uid)
    if user_id and user_id in _AUTH_STORE["users"]:
        return dict(_AUTH_STORE["users"][user_id])

    for u in _AUTH_STORE["users"].values():
        if u.get("firebase_uid") == clean_uid:
            _AUTH_STORE.setdefault("firebase_uids", {})[clean_uid] = u["id"]
            return dict(u)

    # 2. Check Firestore
    db = get_db()
    if db:
        try:
            from google.cloud.firestore_v1.base_query import FieldFilter
            docs = list(db.collection("users").where(filter=FieldFilter("firebase_uid", "==", clean_uid)).limit(1).stream())
            if docs:
                u_data = docs[0].to_dict()
                _AUTH_STORE["users"][u_data["id"]] = u_data
                _AUTH_STORE.setdefault("firebase_uids", {})[clean_uid] = u_data["id"]
                if u_data.get("email"):
                    _AUTH_STORE["emails"][u_data["email"].strip().lower()] = u_data["id"]
                return dict(u_data)
        except Exception as e:
            logger.warning(f"Error querying user by firebase_uid in Firestore: {e}")

    return None

def authenticate_google_user(id_token: str) -> Dict[str, Any]:
    if not id_token or not isinstance(id_token, str) or not id_token.strip():
        raise InvalidCredentialsError("Google ID token is required.")

    clean_token = id_token.strip()

    # 1. Verify Firebase ID Token on the backend
    try:
        from firebase_admin import auth as fb_auth
        decoded = fb_auth.verify_id_token(clean_token)
    except Exception as e:
        logger.warning(f"Firebase ID token verification failed: {e}")
        raise InvalidCredentialsError("Invalid or expired Google authentication token.")

    firebase_uid = decoded.get("uid")
    if not firebase_uid:
        raise InvalidCredentialsError("Unable to verify Google identity.")

    google_email = (decoded.get("email") or "").strip().lower()
    google_name = (decoded.get("name") or "").strip()
    now_iso = datetime.now(timezone.utc).isoformat()
    db = get_db()

    # CASE 1: EXISTING VOUCH USER (explicitly linked with Google)
    existing_user = get_user_by_firebase_uid(firebase_uid)
    if existing_user:
        user_id = existing_user["id"]
        token = generate_session_token()
        session_data = {
            "token": token,
            "user_id": user_id,
            "created_at": now_iso
        }
        _AUTH_STORE["sessions"][token] = session_data
        if db:
            try:
                db.collection("sessions").document(token).set(session_data)
            except Exception as e:
                logger.warning(f"Error persisting session to Firestore: {e}")

        return {
            "token": token,
            "user_id": user_id,
            "name": existing_user["name"],
            "email": existing_user["email"],
            "role": existing_user.get("role", "worker"),
            "worker_id": existing_user.get("worker_id"),
            "is_new_user": False,
            "onboarding_completed": existing_user.get("onboarding_completed", False)
        }

    # ACCOUNT LINKING SAFETY: Prevent automatic account takeover
    # If the email belongs to an existing password account that is not linked to this Google UID
    if google_email:
        colliding_user = get_user_by_email(google_email)
        if colliding_user:
            if colliding_user.get("firebase_uid") != firebase_uid:
                raise EmailAlreadyExistsError(
                    f"An account with email '{google_email}' already exists. Please sign in with your email and password."
                )

    # CASE 2: NEW GOOGLE USER
    # Create brand new VOUCH user with no seeded or previous worker data
    user_id = f"user_{uuid.uuid4().hex[:8]}"
    clean_name = google_name or "Google User"
    clean_email = google_email or f"{firebase_uid}@google.vouch.work"

    # Create empty, unconfigured worker identity for this new user
    worker_record = create_worker_profile({
        "user_id": user_id,
        "name": clean_name,
        "email": clean_email,
        "trade": "Tradesperson",
        "experience_years": 0,
        "location": "India",
        "skills": []
    })
    worker_id = worker_record["id"]

    user_data = {
        "id": user_id,
        "name": clean_name,
        "email": clean_email,
        "password_hash": None,
        "role": "worker",
        "worker_id": worker_id,
        "firebase_uid": firebase_uid,
        "auth_provider": "google",
        "onboarding_completed": False,
        "is_active": True,
        "created_at": now_iso
    }

    _AUTH_STORE["users"][user_id] = user_data
    _AUTH_STORE["emails"][clean_email] = user_id
    _AUTH_STORE.setdefault("firebase_uids", {})[firebase_uid] = user_id

    if db:
        try:
            db.collection("users").document(user_id).set(user_data)
            logger.info(f"Registered new Google user {user_id} ({clean_email}) in Firestore")
        except Exception as e:
            logger.warning(f"Error persisting Google user to Firestore: {e}")

    token = generate_session_token()
    session_data = {
        "token": token,
        "user_id": user_id,
        "created_at": now_iso
    }
    _AUTH_STORE["sessions"][token] = session_data
    if db:
        try:
            db.collection("sessions").document(token).set(session_data)
        except Exception as e:
            logger.warning(f"Error persisting session to Firestore: {e}")

    return {
        "token": token,
        "user_id": user_id,
        "name": clean_name,
        "email": clean_email,
        "role": "worker",
        "worker_id": worker_id,
        "is_new_user": True,
        "onboarding_completed": False
    }

def mark_onboarding_completed(user_id: str) -> None:
    if not user_id:
        return
    if user_id in _AUTH_STORE["users"]:
        _AUTH_STORE["users"][user_id]["onboarding_completed"] = True
    db = get_db()
    if db:
        try:
            db.collection("users").document(user_id).set({"onboarding_completed": True}, merge=True)
            logger.info(f"Marked onboarding completed for user {user_id}")
        except Exception as e:
            logger.warning(f"Error marking onboarding completed for user {user_id}: {e}")

