import pytest
from starlette.testclient import TestClient
from app.main import app
from app.schemas.worker import ConfidenceTier

@pytest.fixture
def client():
    return TestClient(app)

def test_vouch_golden_path_loop(client):
    # -------------------------------------------------------------
    # Step 1: Worker retrieves their profile
    # -------------------------------------------------------------
    res = client.get("/api/workers/me")
    assert res.status_code == 200
    worker = res.json()
    assert worker["name"] == "Ravi Kumar"
    assert worker["trade"] == "Electrical Technician"
    assert "demonstrated_skills" in worker
    assert len(worker["demonstrated_skills"]) > 0
    # Verify skill confidence uses tiers and evidence score
    first_skill = worker["demonstrated_skills"][0]
    assert "tier" in first_skill
    assert first_skill["tier"] in ["LOW", "MEDIUM", "HIGH"]
    assert "evidence_score" in first_skill
    assert "explanation" in first_skill

    # -------------------------------------------------------------
    # Step 2: Worker views existing work history
    # -------------------------------------------------------------
    res_works = client.get("/api/work")
    assert res_works.status_code == 200
    works = res_works.json()
    assert len(works) >= 3
    panel_work = next(w for w in works if "Panel" in w["title"])
    assert panel_work["worker_id"] == worker["id"]
    # Verify evidence remains embedded in work record
    assert "evidence" in panel_work
    assert len(panel_work["evidence"]) >= 1

    # -------------------------------------------------------------
    # Step 3: Worker describes new work -> AI extracts structured JSON
    # -------------------------------------------------------------
    ai_input = {
        "text": "I replaced three heavy induction pump motors at the coastal warehouse facility yesterday"
    }
    res_ai = client.post("/api/ai/extract-work", json=ai_input)
    assert res_ai.status_code == 200
    extracted = res_ai.json()
    assert extracted["trade"] == "Electrical"
    assert any("Motor" in s or "Repair" in s for s in extracted["skills"])
    assert extracted["quantity"] == 3.0

    # -------------------------------------------------------------
    # Step 4: Worker saves the structured work record
    # -------------------------------------------------------------
    new_work_payload = {
        "title": extracted["title"],
        "description": "Replaced three heavy induction pump motors at coastal warehouse.",
        "date": "2026-10-07",
        "location": "Baikampady Coastal Warehouse",
        "quantity": 3.0,
        "quantity_unit": "motors",
        "trade": extracted["trade"],
        "skills": extracted["skills"],
        "employer_name": "Coastal Foods Ltd",
        "project_name": "Warehouse Pump Overhaul"
    }
    res_create = client.post("/api/work", json=new_work_payload)
    assert res_create.status_code == 200
    created_work = res_create.json()
    new_work_id = created_work["id"]
    assert created_work["employer_name"] == "Coastal Foods Ltd"
    assert created_work["status"] == "PENDING"

    # -------------------------------------------------------------
    # Step 5: Worker attaches photo evidence to the work record
    # -------------------------------------------------------------
    evidence_payload = {
        "work_record_id": new_work_id,
        "type": "PHOTO",
        "url": "https://images.example.com/pump-repair-01.jpg",
        "description": "Replaced bearings and aligned motor shaft",
        "supports_skills": extracted["skills"]
    }
    res_ev = client.post("/api/evidence", json=evidence_payload)
    assert res_ev.status_code == 200
    attached_ev = res_ev.json()
    assert attached_ev["work_record_id"] == new_work_id
    assert attached_ev["is_self_submitted"] is True

    # -------------------------------------------------------------
    # Step 6: Worker requests confirmation from supervisor
    # -------------------------------------------------------------
    conf_request_payload = {
        "work_record_id": new_work_id,
        "verifier_name": "Praveen Rao",
        "verifier_type": "SUPERVISOR",
        "relationship": "Warehouse Maintenance Supervisor",
        "note": "Please confirm replacement of 3 pump motors"
    }
    res_conf_req = client.post("/api/confirmations/request", json=conf_request_payload)
    assert res_conf_req.status_code == 200
    conf_record = res_conf_req.json()
    token = conf_record["token"]
    assert conf_record["status"] == "PENDING"
    assert token.startswith("tok_")

    # -------------------------------------------------------------
    # Step 7: Verifier uses direct token lookup
    # -------------------------------------------------------------
    res_ver_view = client.get(f"/api/confirmations/{token}")
    assert res_ver_view.status_code == 200
    ver_view = res_ver_view.json()
    assert ver_view["token"] == token
    assert ver_view["verifier_name"] == "Praveen Rao"
    assert ver_view["verifier_type"] == "SUPERVISOR"
    assert ver_view["status"] == "PENDING"
    assert ver_view["work"]["title"] == new_work_payload["title"]

    # -------------------------------------------------------------
    # Step 8: Verifier submits CONFIRMED decision
    # -------------------------------------------------------------
    decision_payload = {
        "decision": "CONFIRMED",
        "note": "Inspected and confirmed operational at full capacity."
    }
    res_decision = client.post(f"/api/confirmations/{token}/confirm", json=decision_payload)
    assert res_decision.status_code == 200
    assert res_decision.json()["success"] is True

    # Verify updated state on direct token lookup
    res_after = client.get(f"/api/confirmations/{token}")
    assert res_after.status_code == 200
    assert res_after.json()["status"] == "CONFIRMED"

    # -------------------------------------------------------------
    # Step 9: Worker's Passport reflects the confirmed evidence
    # -------------------------------------------------------------
    res_passport = client.get("/api/passport/ravi-kumar-82a7")
    assert res_passport.status_code == 200
    passport = res_passport.json()
    assert passport["public_slug"] == "ravi-kumar-82a7"
    assert passport["overall_evidence_confidence"] > 0
    assert "demonstrated_skills" in passport
    # Confirm passport completeness is separate from skill confidence
    assert "passport_completeness" in passport
    assert passport["passport_completeness"] >= 50
