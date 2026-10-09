import pytest
from starlette.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_workers_directory_endpoint():
    """Verify GET /api/workers returns the directory of real verified workers."""
    response = client.get("/api/workers")
    assert response.status_code == 200
    workers = response.json()
    assert isinstance(workers, list)
    assert len(workers) >= 5

    # Check Ravi Kumar presence
    worker_ids = [w["id"] for w in workers]
    assert "ravi_kumar_001" in worker_ids

    # Check other trade workers presence
    trades = [w["trade"] for w in workers]
    assert "Electrical Technician" in trades or "Electrician" in trades
    assert "Plumber" in trades
    assert "Welder" in trades
    assert "Carpenter" in trades

    # Verify score and breakdown contracts
    for w in workers:
        assert "overall_confidence" in w
        assert isinstance(w["overall_confidence"], int)
        assert 0 <= w["overall_confidence"] <= 100
        assert "work_count" in w
        assert "confirmation_count" in w
        assert "demonstrated_skills" in w

def test_passport_by_slug_and_id():
    """Verify GET /api/passport/{slug_or_id} resolves both slugs and worker IDs."""
    # Lookup by Ravi's slug
    res_slug = client.get("/api/passport/ravi-kumar-82a7")
    assert res_slug.status_code == 200
    data_slug = res_slug.json()
    assert data_slug["worker"]["name"] == "Ravi Kumar"
    assert "work_history" in data_slug
    assert len(data_slug["work_history"]) > 0

    # Lookup by worker ID
    res_id = client.get("/api/passport/worker_anil")
    assert res_id.status_code == 200
    data_id = res_id.json()
    assert data_id["worker"]["name"] == "Anil Joseph"
    assert data_id["worker"]["trade"] == "Electrician"

    # Lookup by non-existent slug returns 404 (no silent fallback to Ravi)
    res_404 = client.get("/api/passport/non-existent-worker-xyz99")
    assert res_404.status_code == 404

def test_employer_registration_isolation():
    """Verify employer accounts are created cleanly without worker profile pollution."""
    import uuid
    random_email = f"contractor_{uuid.uuid4().hex[:6]}@apexbuild.in"
    res = client.post("/api/auth/register", json={
        "name": "Vikram Contractor",
        "email": random_email,
        "password": "Password123!",
        "role": "contractor"
    })
    assert res.status_code == 201
    auth_data = res.json()
    assert auth_data["role"] == "contractor"
    assert auth_data.get("worker_id") is None

    token = auth_data["token"]
    # Check GET /api/auth/me
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["role"] == "contractor"
    assert me_data.get("worker_id") is None
