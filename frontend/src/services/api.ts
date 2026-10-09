/**
 * VOUCH — Centralized Frontend API Client
 * Connects the React application to the FastAPI backend.
 * 
 * Source of Truth: FastAPI Backend Schemas & Contract (backend/app/schemas)
 * Base URL: Configurable via import.meta.env.VITE_API_URL (defaults to http://127.0.0.1:8000/api)
 */

// Base API URL configuration
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '');

// ============================================================================
// Data Contracts & Schema Types (Exact match with backend/app/schemas)
// ============================================================================

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export interface SkillConfidenceResponse {
  skill_name: string;
  confidence: number; // 0 to 100 percentage
  work_count: number;
  confirmation_count: number;
  photo_count: number;
  document_count: number;
  explanation?: string | null;
}

export interface WorkerProfileResponse {
  id: string;
  name: string;
  trade: string;
  experience_years: number;
  location: string;
  email?: string | null;
  phone?: string | null;
  languages?: string[];
  bio?: string | null;
  profile_photo_url?: string | null;
  public_slug?: string | null;
  work_count: number;
  confirmation_count: number;
  overall_confidence: number;
  demonstrated_skills: SkillConfidenceResponse[];
}

export type EvidenceType = 'PHOTO' | 'DOCUMENT' | 'CERTIFICATE' | 'WORK_ORDER' | 'DECLARATION';

export interface EvidenceCreatePayload {
  work_record_id: string;
  type: EvidenceType;
  url: string;
  description?: string;
  supports_skills?: string[];
  added_by_name?: string;
  is_private?: boolean;
}

export interface EvidenceResponse {
  id: string;
  work_record_id: string;
  type: EvidenceType;
  url: string;
  description?: string;
  created_at: string;
}

export type VerifierType = 'CUSTOMER' | 'SUPERVISOR' | 'EMPLOYER' | 'COLLEAGUE';
export type ConfirmationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'NOT_SURE' | 'REVOKED';

export interface ConfirmationRequestPayload {
  work_record_id: string;
  verifier_name: string;
  verifier_type: VerifierType;
  relationship?: string;
  note?: string;
}

export interface ConfirmationDecisionPayload {
  decision: ConfirmationStatus;
  note?: string;
}

export interface ConfirmationResponse {
  id: string;
  work_record_id: string;
  verifier_name: string;
  verifier_type: VerifierType;
  status: ConfirmationStatus;
  token: string;
  created_at: string;
  verified_at?: string | null;
}

export interface VerificationDetailsResponse {
  token: string;
  verifier_name: string;
  verifier_type: VerifierType;
  status: ConfirmationStatus;
  work: {
    title: string;
    description: string;
    date: string;
    location?: string | null;
    quantity?: number | null;
    quantity_unit?: string | null;
    trade?: string | null;
    skills: string[];
    evidence_count: number;
  };
}

export interface ConfirmationDecisionResponse {
  success: boolean;
  decision: ConfirmationStatus;
  message: string;
}

export type WorkStatus = 'DRAFT' | 'PENDING' | 'CONFIRMED' | 'REJECTED';

export interface WorkRecordCreatePayload {
  title: string;
  description: string;
  date: string;
  location?: string | null;
  quantity?: number | null;
  quantity_unit?: string | null;
  trade?: string | null;
  skills?: string[];
  employer_name?: string | null;
  project_name?: string | null;
}

export interface WorkRecordResponse extends WorkRecordCreatePayload {
  id: string;
  worker_id: string;
  status: WorkStatus;
  evidence: EvidenceResponse[];
  confirmations: ConfirmationResponse[];
  confidence: number;
  created_at: string;
}

export interface WorkExtractionRequestPayload {
  text: string;
}

export interface WorkExtractionResponse {
  title: string;
  trade: string;
  skills: string[];
  quantity?: number | null;
  quantity_unit?: string | null;
  date?: string | null;
  location?: string | null;
  confidence: number;
  summary?: string | null;
}

export interface PassportDataResponse {
  worker: WorkerProfileResponse;
  overall_evidence_confidence: number;
  demonstrated_skills: SkillConfidenceResponse[];
  work_history: WorkRecordResponse[];
  total_evidence_count: number;
  total_confirmations_count: number;
  public_slug: string;
  share_url: string;
}

export interface UserRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'worker' | 'contractor';
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user_id: string;
  name: string;
  email: string;
  role: 'worker' | 'contractor';
  worker_id?: string | null;
  is_new_user?: boolean;
  onboarding_completed?: boolean;
}

export interface AuthUser {
  user_id: string;
  name: string;
  email: string;
  role: 'worker' | 'contractor';
  worker_id?: string | null;
  auth_provider?: string;
  onboarding_completed?: boolean;
}

export type CurrentUserResponse = AuthUser;

// ============================================================================
// Centralized Error Handling
// ============================================================================

export interface FastApiValidationErrorItem {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export class ApiError extends Error {
  public status: number;
  public validationErrors?: FastApiValidationErrorItem[];
  public isNetworkError: boolean;

  constructor(
    message: string,
    status: number = 500,
    validationErrors?: FastApiValidationErrorItem[],
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Generic HTTP Request Executor with Centralized Error Handling
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE_URL}${cleanPath}`;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('vouch_auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
      defaultHeaders['X-Auth-Token'] = token;
    }
    const activeWorkerId = localStorage.getItem('vouch_active_worker_id');
    if (activeWorkerId) {
      defaultHeaders['X-Worker-Id'] = activeWorkerId;
    }
  }

  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  const config: RequestInit = {
    ...options,
    signal: options.signal || controller.signal,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. Please check your network connection.',
        0,
        undefined,
        true
      );
    }
    throw new ApiError(
      'Vouch could not connect to the backend server. Please verify your connection or ensure the backend is running.',
      0,
      undefined,
      true
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // Parse response body
  let responseData: any = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    try {
      responseData = await response.text();
    } catch {
      responseData = null;
    }
  }

  if (!response.ok) {
    // 422 Validation Error handling (FastAPI schema)
    if (response.status === 422 && responseData?.detail && Array.isArray(responseData.detail)) {
      const errorList = responseData.detail as FastApiValidationErrorItem[];
      const firstErrorMsg = errorList[0]?.msg || 'Validation failed';
      const firstField = errorList[0]?.loc?.slice(-1)[0] || 'input';
      throw new ApiError(
        `Invalid ${firstField}: ${firstErrorMsg}`,
        response.status,
        errorList
      );
    }

    // 404 / 400 / 500 String Detail handling
    if (responseData?.detail && typeof responseData.detail === 'string') {
      throw new ApiError(responseData.detail, response.status);
    }

    if (responseData?.error?.message && typeof responseData.error.message === 'string') {
      throw new ApiError(responseData.error.message, response.status);
    }

    if (response.status === 404) {
      throw new ApiError('The requested resource was not found.', 404);
    }

    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  }

  return responseData as T;
}

// ============================================================================
export interface InitialWorkRecordPayload {
  title: string;
  description?: string;
  employer?: string;
  role?: string;
  location?: string;
  imageUrl?: string;
  skills?: string[];
  verifierName?: string;
  verifierRole?: string;
  evidence_url?: string;
  evidence_title?: string;
  evidence_type?: string;
  evidence_description?: string;
}

export interface WorkerOnboardingPayload {
  name: string;
  trade: string;
  experience_years: number;
  location: string;
  email?: string;
  phone?: string;
  bio?: string;
  profile_photo_url?: string;
  skills?: string[];
  languages?: string[] | string;
  initial_work?: InitialWorkRecordPayload;
  initial_works?: InitialWorkRecordPayload[];
}

export interface WorkerClaimResponse {
  field: string;
  value: any;
  source: string;
}

export interface WorkerProfileExtractionResponse {
  occupation?: string | null;
  experience_years_claimed?: number | null;
  skills: string[];
  location?: string | null;
  languages: string[];
  employers: string[];
  claims: WorkerClaimResponse[];
}

export interface AudioTranscriptionResponse {
  transcript: string;
}

// ============================================================================
// Centralized API Service Methods
// ============================================================================

export const api = {
  /**
   * Register: Creates a new user account and associated worker profile
   * POST /api/auth/register
   */
  register(payload: UserRegisterPayload): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Login: Authenticates user credentials and returns session token
   * POST /api/auth/login
   */
  login(payload: UserLoginPayload): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Continue with Google: Authenticates verified Firebase ID token on backend
   * POST /api/auth/google
   */
  loginWithGoogle(idToken: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  },

  /**
   * Current Authenticated User: Returns authenticated user identity
   * GET /api/auth/me
   */
  getMe(): Promise<CurrentUserResponse> {
    return request<CurrentUserResponse>('/auth/me');
  },

  /**
   * Logout: Invalidates session token
   * POST /api/auth/logout
   */
  logout(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Health Check: Verifies frontend ↔ backend connectivity
   * GET /api/health
   */
  healthCheck(): Promise<HealthResponse> {
    return request<HealthResponse>('/health');
  },

  /**
   * Worker Profile: Retrieves the authenticated, active or default worker profile
   * GET /api/workers/me
   */
  getMyProfile(workerId?: string): Promise<WorkerProfileResponse> {
    if (workerId) {
      return request<WorkerProfileResponse>(`/workers/me?worker_id=${encodeURIComponent(workerId)}`);
    }
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('vouch_auth_token') : null;
    if (token) {
      return request<WorkerProfileResponse>('/workers/me');
    }
    const activeId = typeof localStorage !== 'undefined' ? localStorage.getItem('vouch_active_worker_id') : null;
    const query = activeId ? `?worker_id=${encodeURIComponent(activeId)}` : '';
    return request<WorkerProfileResponse>(`/workers/me${query}`);
  },

  /**
   * Lookup Worker by Email: Finds worker profile matching registered email
   * GET /api/workers/lookup?email={email}
   */
  lookupWorkerByEmail(email: string): Promise<WorkerProfileResponse> {
    const cleanEmail = email.trim().toLowerCase();
    return request<WorkerProfileResponse>(`/workers/lookup?email=${encodeURIComponent(cleanEmail)}`);
  },

  /**
   * Create Worker: Persists new worker profile and optional initial work to Firestore
   * POST /api/workers
   */
  createWorker(payload: WorkerOnboardingPayload): Promise<WorkerProfileResponse> {
    return request<WorkerProfileResponse>('/workers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update My Worker Profile: Updates authenticated worker profile
   * PUT /api/workers/me
   */
  updateMyProfile(payload: WorkerOnboardingPayload): Promise<WorkerProfileResponse> {
    return request<WorkerProfileResponse>('/workers/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Worker Profile by ID: Retrieves public-safe worker information
   * GET /api/workers/{worker_id}
   */
  getWorker(workerId: string): Promise<WorkerProfileResponse> {
    return request<WorkerProfileResponse>(`/workers/${encodeURIComponent(workerId)}`);
  },

  /**
   * List Workers: Retrieves all verified workers in the VOUCH directory
   * GET /api/workers
   */
  getWorkers(): Promise<WorkerProfileResponse[]> {
    return request<WorkerProfileResponse[]>('/workers');
  },

  /**
   * List Work: Retrieves all work records for the active worker
   * GET /api/work
   */
  getWork(workerId?: string): Promise<WorkRecordResponse[]> {
    if (workerId) {
      return request<WorkRecordResponse[]>(`/work?worker_id=${encodeURIComponent(workerId)}`);
    }
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('vouch_auth_token') : null;
    if (token) {
      return request<WorkRecordResponse[]>('/work');
    }
    const activeId = typeof localStorage !== 'undefined' ? localStorage.getItem('vouch_active_worker_id') : null;
    const query = activeId ? `?worker_id=${encodeURIComponent(activeId)}` : '';
    return request<WorkRecordResponse[]>(`/work${query}`);
  },

  /**
   * Get Work Record: Retrieves a specific work record with evidence and confirmations
   * GET /api/work/{work_id}
   */
  getWorkById(workId: string): Promise<WorkRecordResponse> {
    return request<WorkRecordResponse>(`/work/${encodeURIComponent(workId)}`);
  },

  /**
   * AI Work Extraction: Parses natural language text into a structured work draft
   * POST /api/ai/extract-work
   */
  extractWork(text: string): Promise<WorkExtractionResponse> {
    return request<WorkExtractionResponse>('/ai/extract-work', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /**
   * AI Profile Claim Extraction: Parses multilingual description into structured worker claims
   * POST /api/ai/extract-profile
   */
  extractProfile(text: string): Promise<WorkerProfileExtractionResponse> {
    return request<WorkerProfileExtractionResponse>('/ai/extract-profile', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /**
   * AI Voice Transcription: Sends recorded audio to Gemini for speech-to-text transcription
   * POST /api/ai/transcribe-audio
   */
  async transcribeAudio(file: Blob | File, filename?: string): Promise<AudioTranscriptionResponse> {
    const formData = new FormData();
    formData.append('file', file, filename || 'audio.webm');
    const url = `${API_BASE_URL}/ai/transcribe-audio`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new ApiError(errData?.detail || `Audio transcription failed (${res.status})`, res.status);
    }
    return res.json();
  },

  /**
   * Create Work Record: Persists a reviewed work record
   * POST /api/work
   */
  createWork(payload: WorkRecordCreatePayload): Promise<WorkRecordResponse> {
    return request<WorkRecordResponse>('/work', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Add Evidence: Attaches photographic or documentary evidence to a work record
   * POST /api/evidence
   */
  addEvidence(payload: EvidenceCreatePayload): Promise<EvidenceResponse> {
    return request<EvidenceResponse>('/evidence', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Request Confirmation: Generates an independent confirmation token for a work record
   * POST /api/confirmations/request
   */
  requestConfirmation(payload: ConfirmationRequestPayload): Promise<ConfirmationResponse> {
    return request<ConfirmationResponse>('/confirmations/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get Verification Details: Retrieves minimal, safe review details for a verifier via token
   * GET /api/confirmations/{token}
   */
  getConfirmation(token: string): Promise<VerificationDetailsResponse> {
    return request<VerificationDetailsResponse>(`/confirmations/${encodeURIComponent(token)}`);
  },

  /**
   * Submit Confirmation Decision: Verifier confirms, rejects, or flags a work record
   * POST /api/confirmations/{token}/confirm
   */
  submitConfirmation(token: string, decision: ConfirmationStatus, note?: string): Promise<ConfirmationDecisionResponse> {
    const payload: ConfirmationDecisionPayload = { decision };
    if (note) payload.note = note;
    return request<ConfirmationDecisionResponse>(`/confirmations/${encodeURIComponent(token)}/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Get Public Passport: Retrieves public-facing passport data by slug
   * GET /api/passport/{public_slug}
   */
  getPassport(publicSlug: string): Promise<PassportDataResponse> {
    return request<PassportDataResponse>(`/passport/${encodeURIComponent(publicSlug)}`);
  },
};

export default api;
