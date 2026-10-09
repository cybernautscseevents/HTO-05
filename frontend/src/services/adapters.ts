/**
 * VOUCH — Frontend ↔ Backend Data Adapters
 * Normalizes FastAPI backend responses into frontend UI models.
 */

import { 
  WorkerProfileResponse, 
  WorkRecordResponse, 
  SkillConfidenceResponse, 
  EvidenceResponse, 
  ConfirmationResponse 
} from './api';
import { 
  WorkerProfile, 
  WorkRecord, 
  SkillEvidenceBreakdown, 
  EvidenceItem, 
  Confirmation,
  SkillConfidenceLevel 
} from '../types';

/**
 * Maps 0-100 numerical evidence confidence into explainable Vouch confidence tiers
 */
export function getConfidenceTier(score: number): SkillConfidenceLevel {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

/**
 * Normalizes backend Evidence item to frontend model
 */
export function mapEvidenceItem(item: EvidenceResponse, supportedSkills: string[] = []): EvidenceItem {
  return {
    id: item.id,
    type: item.type as any,
    title: item.description || `${item.type.charAt(0) + item.type.slice(1).toLowerCase()} Proof`,
    url: item.url,
    timestamp: item.created_at ? item.created_at.split('T')[0] : 'Recent',
    description: item.description,
    skillsSupported: supportedSkills,
  };
}

/**
 * Normalizes backend Confirmation item to frontend model
 */
export function mapConfirmationItem(conf: ConfirmationResponse, workTitle?: string): Confirmation {
  return {
    id: conf.id,
    verifierName: conf.verifier_name,
    verifierRole: conf.verifier_type === 'SUPERVISOR' 
      ? 'Site Supervisor' 
      : conf.verifier_type === 'EMPLOYER' 
      ? 'Direct Contractor' 
      : 'Client / Owner',
    verifierType: conf.verifier_type as any,
    organization: conf.verifier_type === 'SUPERVISOR' ? 'Site Management' : undefined,
    workTitle: workTitle,
    status: (conf.status === 'NOT_SURE' ? 'PENDING' : conf.status) as any,
    date: conf.verified_at ? conf.verified_at.split('T')[0] : conf.created_at.split('T')[0],
    notes: conf.status === 'CONFIRMED' ? 'Independently confirmed work execution and quality.' : undefined,
  };
}

/**
 * Normalizes backend WorkRecord to frontend WorkRecord model
 */
export function mapWorkRecord(backendRecord: WorkRecordResponse): WorkRecord {
  const supportedSkills = backendRecord.skills || [];
  const evidenceItems = (backendRecord.evidence || []).map(e => mapEvidenceItem(e, supportedSkills));
  const confirmations = (backendRecord.confirmations || []).map(c => mapConfirmationItem(c, backendRecord.title));

  // Determine fallback image from attached photos or default
  const photoEvidence = evidenceItems.find(e => e.type === 'PHOTO');
  const imageUrl = photoEvidence 
    ? photoEvidence.url 
    : 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80';

  return {
    id: backendRecord.id,
    title: backendRecord.title,
    employer: backendRecord.employer_name || 'Independent / Client Site',
    role: backendRecord.trade || 'Lead Technician',
    date: backendRecord.date,
    description: backendRecord.description,
    location: backendRecord.location || 'Mangaluru',
    quantity: backendRecord.quantity || undefined,
    quantityUnit: backendRecord.quantity_unit || undefined,
    status: backendRecord.status as any,
    imageUrl: imageUrl,
    skills: supportedSkills,
    evidenceCount: evidenceItems.length,
    evidenceItems: evidenceItems,
    confirmations: confirmations,
    confidence: backendRecord.confidence,
    createdAt: backendRecord.created_at,
  };
}

/**
 * Normalizes backend SkillConfidence to frontend SkillEvidenceBreakdown model
 */
export function mapSkillConfidence(
  skill: SkillConfidenceResponse, 
  index: number
): SkillEvidenceBreakdown {
  const tier = getConfidenceTier(skill.confidence);
  const totalEvidence = (skill.photo_count || 0) + (skill.document_count || 0);

  const defaultExplanation = `${skill.work_count} work record${skill.work_count === 1 ? '' : 's'} · ${totalEvidence} evidence item${totalEvidence === 1 ? '' : 's'} · ${skill.confirmation_count} supervisor confirmation${skill.confirmation_count === 1 ? '' : 's'}`;

  return {
    id: `skill_${index}_${skill.skill_name.toLowerCase().replace(/\s+/g, '_')}`,
    name: skill.skill_name,
    confidenceLevel: tier,
    workRecordsCount: skill.work_count,
    evidenceCount: totalEvidence,
    confirmationsCount: skill.confirmation_count,
    supervisorConfirmationsCount: skill.confirmation_count,
    explanation: skill.explanation || defaultExplanation,
    category: 'Electrical Trade',
    description: `Verified competency in ${skill.skill_name} supported by empirical jobsite evidence and supervisor vouchers.`,
  };
}

/**
 * Normalizes backend WorkerProfile to frontend WorkerProfile model
 */
export function mapWorkerProfile(
  backendWorker: WorkerProfileResponse, 
  completenessScore: number = 85
): WorkerProfile {
  const photo = backendWorker.profile_photo_url || 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&auto=format&fit=crop&q=80';

  return {
    id: backendWorker.id,
    name: backendWorker.name,
    trade: backendWorker.trade,
    specialization: `${backendWorker.trade} Specialist`,
    experienceYears: backendWorker.experience_years,
    location: backendWorker.location,
    email: backendWorker.email || undefined,
    phone: backendWorker.phone || undefined,
    languages: backendWorker.languages || [],
    bio: backendWorker.bio || `Skilled ${backendWorker.trade} with ${backendWorker.experience_years} years experience.`,
    avatarUrl: photo,
    portraitUrl: photo,
    passportId: backendWorker.public_slug ? `VOUCH-${backendWorker.public_slug.toUpperCase()}` : `VOUCH-IN-${backendWorker.id.slice(-4).toUpperCase()}`,
    passportCompleteness: completenessScore,
    overallEvidenceConfidence: backendWorker.overall_confidence,
    isWorkerOwned: true,
    certifications: [],
  };
}
