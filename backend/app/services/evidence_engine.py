from typing import List, Dict, Any, Tuple
from app.schemas.evidence import Evidence, EvidenceType
from app.schemas.confirmation import Confirmation, ConfirmationStatus, VerifierType
from app.schemas.worker import SkillConfidence, ConfidenceTier


WEIGHTS = {
    "DECLARATION": 10,
    "PHOTO": 15,
    "DOCUMENT": 20,
    "CERTIFICATE": 25,
    "WORK_ORDER": 20,
    "CUSTOMER": 25,
    "SUPERVISOR": 35,
    "EMPLOYER": 35,
}

def calculate_work_confidence(evidence_list: List[Any], confirmations: List[Any]) -> int:
    """
    Computes a 0-100 bounded confidence score for a single work record.
    Base starts at 10 for worker declaration.
    """
    score = WEIGHTS["DECLARATION"]
    
    # Add evidence weight with diminishing returns
    photos = [e for e in evidence_list if getattr(e, 'type', None) == EvidenceType.PHOTO or (isinstance(e, dict) and e.get('type') == 'PHOTO')]
    docs = [e for e in evidence_list if getattr(e, 'type', None) in [EvidenceType.DOCUMENT, EvidenceType.CERTIFICATE, EvidenceType.WORK_ORDER] or (isinstance(e, dict) and e.get('type') in ['DOCUMENT', 'CERTIFICATE', 'WORK_ORDER'])]
    
    # Cap photo contribution at 30
    photo_score = min(len(photos) * WEIGHTS["PHOTO"], 30)
    # Cap doc contribution at 35
    doc_score = min(len(docs) * WEIGHTS["DOCUMENT"], 35)
    
    score += photo_score + doc_score
    
    # Add confirmations
    confirmed = [c for c in confirmations if getattr(c, 'status', None) == ConfirmationStatus.CONFIRMED or (isinstance(c, dict) and c.get('status') == 'CONFIRMED')]
    for c in confirmed:
        v_type = getattr(c, 'verifier_type', None) or (c.get('verifier_type') if isinstance(c, dict) else 'CUSTOMER')
        if v_type == VerifierType.SUPERVISOR or v_type == "SUPERVISOR":
            score += WEIGHTS["SUPERVISOR"]
        elif v_type == VerifierType.EMPLOYER or v_type == "EMPLOYER":
            score += WEIGHTS["EMPLOYER"]
        else:
            score += WEIGHTS["CUSTOMER"]
            
    # Bound between 10 and 98 (100 is reserved for formal audits)
    return max(10, min(score, 98))

def calculate_skill_confidence(skill_name: str, relevant_works: List[Dict[str, Any]]) -> SkillConfidence:
    """
    Computes aggregate evidence confidence for a specific skill across all relevant work records.
    """
    if not relevant_works:
        return SkillConfidence(
            skill_name=skill_name,
            confidence=0,
            work_count=0,
            confirmation_count=0,
            photo_count=0,
            document_count=0,
            explanation="No work records recorded yet."
        )
        
    work_count = len(relevant_works)
    total_photos = 0
    total_docs = 0
    total_confirmations = 0
    
    for w in relevant_works:
        ev = w.get("evidence", [])
        conf = w.get("confirmations", [])
        
        total_photos += sum(1 for e in ev if e.get("type") == "PHOTO")
        total_docs += sum(1 for e in ev if e.get("type") in ["DOCUMENT", "CERTIFICATE", "WORK_ORDER"])
        total_confirmations += sum(1 for c in conf if c.get("status") == "CONFIRMED")
        
    # Asymptotic formula approaching 95%
    # Base from works: up to 35
    work_pts = min(work_count * 8, 35)
    # Confirmations: up to 40
    conf_pts = min(total_confirmations * 15, 40)
    # Media evidence: up to 20
    media_pts = min((total_photos * 3) + (total_docs * 5), 20)
    
    final_confidence = min(work_pts + conf_pts + media_pts, 95)
    
    explanation = (
        f"{work_count} project{'s' if work_count > 1 else ''}, "
        f"{total_confirmations} confirmation{'s' if total_confirmations > 1 else ''}, "
        f"{total_photos} photo{'s' if total_photos > 1 else ''}"
    )
    if total_docs > 0:
        explanation += f", {total_docs} document{'s' if total_docs > 1 else ''}"
        
    tier = ConfidenceTier.HIGH if final_confidence >= 70 else (ConfidenceTier.MEDIUM if final_confidence >= 40 else ConfidenceTier.LOW)

    return SkillConfidence(
        skill_name=skill_name,
        tier=tier,
        confidence=final_confidence,
        work_count=work_count,
        confirmation_count=total_confirmations,
        photo_count=total_photos,
        document_count=total_docs,
        explanation=explanation
    )
