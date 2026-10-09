import uuid
import pytest
from starlette.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_auth_registration_and_login_flow(client):
    uid = uuid.uuid4().hex[:6]
    unique_email = f"vikram.{uid}@example.com"
    password = "SecurePassword123!"

    # 1. Register new worker
    reg_res = client.post("/api/auth/register", json={
        "name": "Vikram Sharma",
        "email": unique_email,
        "password": password,
        "role": "worker"
    })
    assert reg_res.status_code == 201
    reg_data = reg_res.json()
    assert "token" in reg_data
    assert reg_data["email"] == unique_email
    assert reg_data["role"] == "worker"
    assert reg_data["worker_id"] is not None
    vikram_token = reg_data["token"]
    vikram_worker_id = reg_data["worker_id"]

    # 2. Duplicate registration rejected
    dup_res = client.post("/api/auth/register", json={
        "name": "Vikram Clone",
        "email": unique_email,
        "password": password,
        "role": "worker"
    })
    assert dup_res.status_code == 409

    # 3. Short password rejected
    short_pwd_res = client.post("/api/auth/register", json={
        "name": "Short Pwd",
        "email": "short@example.com",
        "password": "short",
        "role": "worker"
    })
    assert short_pwd_res.status_code == 422

    # 4. Login with correct credentials
    login_res = client.post("/api/auth/login", json={
        "email": unique_email.upper(),  # test case insensitivity
        "password": password
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "token" in login_data
    assert login_data["worker_id"] == vikram_worker_id

    # 5. Login with wrong password returns 401
    bad_pwd_res = client.post("/api/auth/login", json={
        "email": unique_email,
        "password": "WrongPassword999!"
    })
    assert bad_pwd_res.status_code == 401
    assert "Invalid email or password" in bad_pwd_res.json()["detail"]

    # 6. Login with nonexistent email returns 401
    no_user_res = client.post("/api/auth/login", json={
        "email": "nonexistent_person_xyz@example.com",
        "password": password
    })
    assert no_user_res.status_code == 401
    assert "Invalid email or password" in no_user_res.json()["detail"]

    # 7. Access /api/auth/me with Bearer token
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {vikram_token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == unique_email
    assert me_data["name"] == "Vikram Sharma"
    assert me_data["worker_id"] == vikram_worker_id

    # 8. Access /api/workers/me with Vikram's token -> resolves Vikram's profile, NOT Ravi Kumar
    worker_me_res = client.get("/api/workers/me", headers={"Authorization": f"Bearer {vikram_token}"})
    assert worker_me_res.status_code == 200
    worker_me_data = worker_me_res.json()
    assert worker_me_data["id"] == vikram_worker_id
    assert worker_me_data["name"] == "Vikram Sharma"
    assert worker_me_data["email"] == unique_email

    # 9. Register second user (Deepak) -> User Isolation Verification
    deepak_email = f"deepak.{uid}@example.com"
    deepak_reg = client.post("/api/auth/register", json={
        "name": "Deepak Patel",
        "email": deepak_email,
        "password": "ContractorPass2026!",
        "role": "contractor"
    })
    assert deepak_reg.status_code == 201
    deepak_data = deepak_reg.json()
    deepak_token = deepak_data["token"]
    assert deepak_data["role"] == "contractor"

    # Deepak's /api/auth/me returns Deepak
    deepak_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {deepak_token}"})
    assert deepak_me.status_code == 200
    assert deepak_me.json()["name"] == "Deepak Patel"
    assert deepak_me.json()["email"] == deepak_email

    # Vikram's token still returns Vikram (No cross-contamination)
    vikram_recheck = client.get("/api/auth/me", headers={"Authorization": f"Bearer {vikram_token}"})
    assert vikram_recheck.status_code == 200
    assert vikram_recheck.json()["email"] == unique_email

    # 10. Logout invalidates session
    logout_res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {vikram_token}"})
    assert logout_res.status_code == 200

    # Subsequent /api/auth/me fails with 401
    revoked_me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {vikram_token}"})
    assert revoked_me.status_code == 401

def test_google_auth_new_user_and_isolation(client, monkeypatch):
    import firebase_admin.auth as fb_auth

    uid_1 = uuid.uuid4().hex[:6]
    google_uid_1 = f"fb_google_uid_{uid_1}"
    google_email_1 = f"google.user.{uid_1}@example.com"

    def mock_verify_1(token, **kwargs):
        if token == "token_user_1":
            return {"uid": google_uid_1, "email": google_email_1, "name": "Aarav Sharma"}
        raise ValueError("Invalid token")

    monkeypatch.setattr(fb_auth, "verify_id_token", mock_verify_1)

    # 1. New Google user signs in
    res = client.post("/api/auth/google", json={"id_token": "token_user_1"})
    assert res.status_code == 200
    data = res.json()
    assert data["is_new_user"] is True
    assert data["onboarding_completed"] is False
    assert data["email"] == google_email_1
    assert data["name"] == "Aarav Sharma"
    assert "token" in data
    assert data["worker_id"] is not None
    user1_token = data["token"]
    user1_worker_id = data["worker_id"]
    assert user1_worker_id != "ravi_kumar_001"

    # Verify /api/auth/me also reflects onboarding_completed is False
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {user1_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["onboarding_completed"] is False

    # 2. Verify worker profile is clean and unconfigured (NOT Ravi Kumar)
    profile_res = client.get("/api/workers/me", headers={"Authorization": f"Bearer {user1_token}"})
    assert profile_res.status_code == 200
    p_data = profile_res.json()
    assert p_data["id"] == user1_worker_id
    assert p_data["name"] == "Aarav Sharma"
    assert p_data["email"] == google_email_1
    assert p_data["experience_years"] == 0
    assert p_data["demonstrated_skills"] == []

    # 3. Verify work history is empty (NOT Ravi's work records)
    work_res = client.get("/api/work", headers={"Authorization": f"Bearer {user1_token}"})
    assert work_res.status_code == 200
    assert work_res.json() == []

    # 4. Worker completes employee details / onboarding form (POST /api/workers)
    onboard_res = client.post(
        "/api/workers",
        json={
            "name": "Aarav Sharma",
            "trade": "Master Electrician",
            "experience_years": 5,
            "location": "Bengaluru",
            "skills": ["Industrial Wiring", "PLC Maintenance"],
            "languages": ["Kannada", "English", "Hindi"],
        },
        headers={"Authorization": f"Bearer {user1_token}"}
    )
    assert onboard_res.status_code == 201
    updated_profile = onboard_res.json()
    assert updated_profile["trade"] == "Master Electrician"
    assert updated_profile["experience_years"] == 5

    # Verify /api/auth/me now reflects onboarding_completed is True
    me_res_after = client.get("/api/auth/me", headers={"Authorization": f"Bearer {user1_token}"})
    assert me_res_after.status_code == 200
    assert me_res_after.json()["onboarding_completed"] is True

    # 5. Completed Google user signs in again: resolves existing user, onboarding already complete
    res_existing = client.post("/api/auth/google", json={"id_token": "token_user_1"})
    assert res_existing.status_code == 200
    data_existing = res_existing.json()
    assert data_existing["is_new_user"] is False
    assert data_existing["onboarding_completed"] is True
    assert data_existing["worker_id"] == user1_worker_id
    assert data_existing["email"] == google_email_1

def test_google_auth_email_collision_safety(client, monkeypatch):
    import firebase_admin.auth as fb_auth

    uid = uuid.uuid4().hex[:6]
    collision_email = f"standard.user.{uid}@example.com"
    pwd = "StandardPassword123!"

    # 1. Register normal email/password account
    reg_res = client.post("/api/auth/register", json={
        "name": "Standard User",
        "email": collision_email,
        "password": pwd,
        "role": "worker"
    })
    assert reg_res.status_code == 201

    # 2. Attempt Google login with same email but unlinked Google UID
    def mock_verify_collision(token, **kwargs):
        return {"uid": f"different_google_uid_{uid}", "email": collision_email, "name": "Fake Takeover"}

    monkeypatch.setattr(fb_auth, "verify_id_token", mock_verify_collision)

    collision_res = client.post("/api/auth/google", json={"id_token": "collision_token"})
    assert collision_res.status_code == 409
    detail = collision_res.json()["detail"]
    assert "already exists" in detail
    assert "sign in with your email and password" in detail

def test_google_auth_invalid_token(client, monkeypatch):
    import firebase_admin.auth as fb_auth

    def mock_verify_bad(token, **kwargs):
        raise ValueError("Token is expired or invalid")

    monkeypatch.setattr(fb_auth, "verify_id_token", mock_verify_bad)

    bad_res = client.post("/api/auth/google", json={"id_token": "bad_token"})
    assert bad_res.status_code == 401

