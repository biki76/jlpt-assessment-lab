export const PERFORMANCE_BANDS = {
  Excellent: { min: 90, max: 100, color: '#10B981', message: "Outstanding! You're well-prepared for this level." },
  Proficient: { min: 70, max: 89, color: '#3B82F6', message: 'Strong performance. A few areas to refine.' },
  Developing: { min: 50, max: 69, color: '#F59E0B', message: 'Making progress. Review the sections below.' },
  'Needs Work': { min: 0, max: 49, color: '#EF4444', message: 'Keep practicing. Focus on your weakest sections first.' },
} as const;

export const LOCAL_STORAGE_KEYS = {
  EXAM_SESSION: 'nihonsync-exam-session',
  CONSENT: 'nihonsync-consent-v1',
  PENDING_SUBMISSION: 'nihonsync-pending-submission',
  ADMIN_PUBLISHES: 'nihonsync-admin-publishes',
} as const;

export const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;
export const ABORT_TIMEOUT_MS = 8000;
export const AUTO_SAVE_INTERVAL_MS = 30000;
export const PING_INTERVAL_MS = 240000;
export const AD_TIMEOUT_MS = 4000;
export const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const QUESTIONS_PER_SET = 25;
export const REQUIRED_QUESTIONS_FOR_PUBLISH = 25;
