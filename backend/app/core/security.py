import hashlib
import secrets

def hash_password(password: str) -> str:
    """
    Hashes a password using PBKDF2-HMAC-SHA256 with 100,000 iterations.
    Returns format: salt_hex:hash_hex
    """
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        bytes.fromhex(salt),
        100000
    )
    return f"{salt}:{key.hex()}"

def verify_password(password: str, password_hash: str) -> bool:
    """
    Verifies a plaintext password against a stored PBKDF2-HMAC-SHA256 hash.
    Safe against timing attacks via secrets.compare_digest.
    """
    try:
        if not password or not password_hash or ":" not in password_hash:
            return False
        salt, key_hex = password_hash.split(":", 1)
        key = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            bytes.fromhex(salt),
            100000
        )
        return secrets.compare_digest(key.hex(), key_hex)
    except Exception:
        return False

def generate_session_token() -> str:
    """Generates a cryptographically random URL-safe session token."""
    return f"vouch_sess_{secrets.token_urlsafe(32)}"
