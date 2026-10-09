import pytest
from app.schemas.user import User, UserRole
from app.schemas.worker import WorkerProfile, SkillConfidence, ConfidenceTier, PassportCompleteness
from app.schemas.contractor import ContractorProfile, SavedWorker
from app.schemas.work import WorkRecord, WorkStatus
from app.schemas.evidence import Evidence, EvidenceType, VerificationStatus
from app.schemas.confirmation import Confirmation, ConfirmationStatus, VerifierRole
from app.schemas.passport import PassportData, PassportPublic, WorkRecordPublic
from app.schemas.audit import AuditEvent

def test_user_and_profile_separation():
    # User represents auth/identity and role; created_at auto-populated via default_factory
    user = User(
        id="usr_001",
        name="Ravi Kumar",
        role=UserRole.WORKER,
        email="ravi@example.com"
    )
    assert user.role == UserRole.WORKER
    assert user.is_active is True
    assert user.created_at is not None
    assert "T" in user.created_at

    # WorkerProfile represents domain/trade attributes, referencing user_id
    profile = WorkerProfile(
        id="wp_001",
        user_id=user.id,
        name=user.name,
        trade="Electrical Technician",
        experience_years=9,
        location="Mangaluru",
        public_slug="ravi-kumar-82a7"
    )
    assert profile.user_id == "usr_001"
    assert profile.trade == "Electrical Technician"
    assert profile.created_at is not None

def test_work_record_worker_ownership_and_employer_context():
    # A worker owns their work record even across different employers
    work = WorkRecord(
        id="work_001",
        worker_id="wp_001",
        title="Commercial Switchgear Servicing",
        description="Main breaker inspection",
        date="2026-10-02",
        employer_name="Metro Infra Contracting",
        project_name="Trade Center Phase 1",
        status=WorkStatus.CONFIRMED,
        skills=["Panel Installation"]
    )
    assert work.worker_id == "wp_001"
    assert work.employer_name == "Metro Infra Contracting"
    assert work.status == WorkStatus.CONFIRMED
    assert work.created_at is not None

def test_evidence_provenance_and_verification_status():
    evidence = Evidence(
        id="ev_001",
        work_record_id="work_001",
        type=EvidenceType.PHOTO,
        url="https://images.example.com/panel.jpg",
        description="Completed wiring photo",
        supports_skills=["Panel Installation"],
        added_by_user_id="usr_001",
        added_by_name="Ravi Kumar",
        is_self_submitted=True,
        verification_status=VerificationStatus.INDEPENDENTLY_CONFIRMED,
        confirmed_by_name="Anil Sharma",
        confirmed_by_role="SUPERVISOR"
    )
    assert evidence.verification_status == VerificationStatus.INDEPENDENTLY_CONFIRMED
    assert evidence.supports_skills == ["Panel Installation"]
    assert evidence.confirmed_by_role == "SUPERVISOR"
    assert evidence.created_at is not None

def test_confirmation_lifecycle_statuses_and_direct_references():
    # Verify all enum values including REVOKED
    statuses = [s.value for s in ConfirmationStatus]
    assert "PENDING" in statuses
    assert "CONFIRMED" in statuses
    assert "REJECTED" in statuses
    assert "NOT_SURE" in statuses
    assert "REVOKED" in statuses

    conf = Confirmation(
        id="conf_001",
        work_record_id="work_001",
        worker_id="wp_001",
        verifier_name="Anil Sharma",
        verifier_type=VerifierRole.SUPERVISOR,
        relationship="Site Supervisor",
        status=ConfirmationStatus.REVOKED,
        token="tok_test_123",
        note="Work scope changed on site"
    )
    assert conf.status == ConfirmationStatus.REVOKED
    assert conf.worker_id == "wp_001"
    assert conf.work_record_id == "work_001"
    assert conf.relationship == "Site Supervisor"
    assert conf.note == "Work scope changed on site"
    assert conf.created_at is not None
    assert conf.requested_at is not None

def test_skill_confidence_tiers_vs_passport_completeness():
    # Skill confidence emphasizes tiers (LOW/MEDIUM/HIGH) and explicit evidence_score
    skill_conf = SkillConfidence(
        skill_name="Panel Installation",
        tier=ConfidenceTier.HIGH,
        evidence_score=87,
        work_count=6,
        confirmation_count=4,
        photo_count=8,
        document_count=2,
        explanation="6 projects, 4 confirmations"
    )
    assert skill_conf.tier == ConfidenceTier.HIGH
    assert skill_conf.evidence_score == 87
    assert skill_conf.confidence == 87  # backward compatible alias

    # Passport completeness is 0-100% record completeness, separate from skill
    completeness = PassportCompleteness(
        score=75,
        profile_complete=True,
        has_work_history=True,
        has_evidence=True,
        has_confirmations=False,
        breakdown="Missing supervisor confirmations"
    )
    assert completeness.score == 75
    assert completeness.has_confirmations is False

def test_public_passport_redaction_model():
    public_work = WorkRecordPublic(
        title="Commercial Panel Installation",
        description="Main switchgear alignment",
        date="2026-10-02",
        trade="Electrical",
        skills=["Panel Installation"],
        employer_name="Metro Infra Contracting",
        status="CONFIRMED",
        evidence_count=3,
        confirmed_by_types=["SUPERVISOR", "EMPLOYER"]
    )
    public_passport = PassportPublic(
        name="Ravi Kumar",
        trade="Electrical Technician",
        experience_years=9,
        location="Mangaluru",
        public_slug="ravi-kumar-82a7",
        share_url="https://vouch.app/passport/ravi-kumar-82a7",
        overall_evidence_confidence=87,
        demonstrated_skills=[],
        work_history=[public_work],
        total_evidence_count=3,
        total_confirmations_count=2
    )
    # Ensure public passport does not contain internal user_id, private emails or tokens
    assert not hasattr(public_passport, "user_id")
    assert not hasattr(public_passport, "email")
    assert public_passport.work_history[0].evidence_count == 3
