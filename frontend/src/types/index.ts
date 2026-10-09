export type VerifierType = 'EMPLOYER' | 'SUPERVISOR' | 'CUSTOMER' | 'COLLEAGUE' | 'SELF_ADDED';
export type WorkStatus = 'CONFIRMED' | 'ADDED' | 'PENDING' | 'REJECTED';
export type SkillConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Confirmation {
  id: string;
  verifierName: string;
  verifierRole: string;
  verifierType: VerifierType;
  organization?: string;
  workTitle?: string;
  status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
  date: string;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  type: 'PHOTO' | 'DOCUMENT' | 'CERTIFICATE' | 'WORK_ORDER' | 'VIDEO';
  title: string;
  url: string;
  timestamp: string;
  fileSize?: string;
  description?: string;
  skillsSupported: string[]; // Key requirement: each evidence item indicates which skills it supports
}

export interface WorkRecord {
  id: string;
  title: string;
  employer: string;
  role?: string;
  date: string;
  description: string;
  location: string;
  quantity?: number;
  quantityUnit?: string;
  status: WorkStatus;
  imageUrl: string;
  skills: string[];
  evidenceCount: number;
  evidenceItems: EvidenceItem[];
  confirmations: Confirmation[];
  createdAt: string;
}

export interface SkillEvidenceBreakdown {
  id: string;
  name: string;
  confidenceLevel: SkillConfidenceLevel;
  workRecordsCount: number;
  evidenceCount: number;
  confirmationsCount: number;
  supervisorConfirmationsCount: number;
  explanation: string; // e.g. "8 work records · 12 evidence items · 3 supervisor confirmations"
  category: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
  skillsSupported: string[];
}

export interface WorkerProfile {
  id: string;
  name: string;
  trade: string;
  specialization?: string;
  experienceYears: number;
  location: string;
  email?: string;
  phone?: string;
  languages: string[];
  bio: string;
  avatarUrl: string;
  portraitUrl: string;
  passportId: string;
  passportCompleteness: number; // Measures record completeness, NOT worker quality
  isWorkerOwned: boolean;
  certifications: Certification[];
}

export interface AIExtractionResult {
  title: string;
  trade: string;
  skills: string[];
  quantity?: number;
  quantity_unit?: string;
  date?: string;
  location?: string;
  confidence: number;
}

export type ViewRole = 'worker' | 'contractor';
