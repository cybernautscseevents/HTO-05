import { WorkRecord, SkillConfidenceLevel, WorkerProfile } from '../types';

/**
 * Evidence Engine based on VOUCH core product model:
 * 1. PASSPORT COMPLETENESS: Measures how complete the worker's professional record is.
 * 2. SKILL CONFIDENCE: Measures empirical strength of independent evidence (HIGH / MEDIUM / LOW).
 * Never implies an objective rating or score of worker ability.
 */

export interface SkillEvidenceCalculation {
  confidenceLevel: SkillConfidenceLevel;
  workRecordsCount: number;
  evidenceCount: number;
  confirmationsCount: number;
  supervisorConfirmationsCount: number;
  explanation: string;
}

export function calculateSkillConfidence(
  skillName: string,
  records: WorkRecord[]
): SkillEvidenceCalculation {
  // Find work records that explicitly support this skill
  const relevantRecords = records.filter(r => r.skills.includes(skillName));
  const workRecordsCount = relevantRecords.length;

  let photosCount = 0;
  let documentsCount = 0;
  let supervisorConfirmationsCount = 0;
  let totalConfirmationsCount = 0;

  for (const record of relevantRecords) {
    // Count evidence items that support this skill
    for (const ev of record.evidenceItems) {
      if (ev.skillsSupported.includes(skillName) || ev.skillsSupported.length === 0) {
        if (ev.type === 'PHOTO' || ev.type === 'VIDEO') {
          photosCount++;
        } else {
          documentsCount++;
        }
      }
    }

    // Count independent confirmations with provenance
    for (const conf of record.confirmations) {
      if (conf.status === 'CONFIRMED') {
        totalConfirmationsCount++;
        if (conf.verifierType === 'SUPERVISOR' || conf.verifierType === 'EMPLOYER') {
          supervisorConfirmationsCount++;
        }
      }
    }
  }

  const evidenceCount = photosCount + documentsCount;

  // Determine explainable confidence tier based strictly on evidence provenance
  let confidenceLevel: SkillConfidenceLevel = 'LOW';

  if (supervisorConfirmationsCount >= 2 && workRecordsCount >= 3 && evidenceCount >= 3) {
    confidenceLevel = 'HIGH';
  } else if ((supervisorConfirmationsCount >= 1 || totalConfirmationsCount >= 1) && workRecordsCount >= 1) {
    confidenceLevel = 'MEDIUM';
  } else if (workRecordsCount >= 2 && evidenceCount >= 2) {
    confidenceLevel = 'MEDIUM';
  } else {
    confidenceLevel = 'LOW';
  }

  // Construct transparent human explanation
  const parts: string[] = [];
  parts.push(`${workRecordsCount} work record${workRecordsCount === 1 ? '' : 's'}`);
  parts.push(`${evidenceCount} evidence item${evidenceCount === 1 ? '' : 's'}`);
  if (supervisorConfirmationsCount > 0) {
    parts.push(`${supervisorConfirmationsCount} supervisor confirmation${supervisorConfirmationsCount === 1 ? '' : 's'}`);
  } else if (totalConfirmationsCount > 0) {
    parts.push(`${totalConfirmationsCount} confirmation${totalConfirmationsCount === 1 ? '' : 's'}`);
  } else {
    parts.push('0 confirmations (self-reported)');
  }

  return {
    confidenceLevel,
    workRecordsCount,
    evidenceCount,
    confirmationsCount: totalConfirmationsCount,
    supervisorConfirmationsCount,
    explanation: parts.join(' · '),
  };
}

/**
 * Calculates Passport Completeness (0-100%).
 * Evaluates record completeness, NOT worker talent or quality.
 */
export function calculatePassportCompleteness(
  records: WorkRecord[],
  profile?: WorkerProfile
): number {
  let score = 0;

  // 1. Core Profile Details (20%)
  if (profile?.name && profile?.trade && profile?.location) score += 10;
  if (profile?.languages && profile.languages.length > 0) score += 5;
  if (profile?.bio) score += 5;

  // 2. Work Records (25%)
  if (records.length >= 1) score += 10;
  if (records.length >= 3) score += 15;

  // 3. Evidence Attached (25%)
  const totalEvidence = records.reduce((sum, r) => sum + r.evidenceItems.length, 0);
  if (totalEvidence >= 2) score += 10;
  if (totalEvidence >= 5) score += 15;

  // 4. Independent Confirmations (20%)
  const confirmedCount = records.reduce(
    (sum, r) => sum + r.confirmations.filter(c => c.status === 'CONFIRMED').length,
    0
  );
  if (confirmedCount >= 1) score += 10;
  if (confirmedCount >= 3) score += 10;

  // 5. Categorized Skills (10%)
  const uniqueSkills = new Set(records.flatMap(r => r.skills));
  if (uniqueSkills.size >= 2) score += 10;

  return Math.min(100, Math.max(20, score));
}
