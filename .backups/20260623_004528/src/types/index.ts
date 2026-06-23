// ─── Question & Content ─────────────────────────────────────────────────────

export type JLPTLevel = 'N5' | 'N4' | 'N3';
export type SetStatus = 'draft' | 'published' | 'archived';
export type Section = 'Vocabulary' | 'Grammar' | 'Reading';
export type PerformanceBand = 'Excellent' | 'Proficient' | 'Developing' | 'Needs Work';
export type UserType = 'guest' | 'authenticated';
export type AdOutcome = 'completed' | 'skipped' | 'timeout' | 'error';
export type ScoringErrorCode = 'FUNCTION_TIMEOUT' | 'FUNCTION_ERROR' | 'NETWORK_ERROR' | 'PARSE_ERROR';

export interface QuestionOption {
  id: string;
  text: string;
  japanese?: string;
  is_correct?: boolean;
}

export interface Question {
  id: string;
  set_id: string;
  question_number: number;
  question_text: string;
  japanese_text?: string;
  options: QuestionOption[];
  section: Section;
  difficulty: 1 | 2 | 3;
  created_at: string;
  updated_at: string;
  // correct_answer_id and explanation intentionally absent from client
}

export interface QuestionSet {
  id: string;
  title: string;
  level: JLPTLevel;
  status: SetStatus;
  question_count: number;
  created_at: string;
  updated_at: string;
}

// ─── Session & Answers ──────────────────────────────────────────────────────

export type QuestionState = 'unvisited' | 'visited' | 'answered' | 'current';

export interface ExamAnswer {
  question_id: string;
  selected_option_id: string;
  time_spent_ms: number;
}

export interface ExamSession {
  id: string;
  set_id: string;
  user_id?: string;
  user_type: UserType;
  current_question_index: number;
  answers: Record<string, ExamAnswer>;
  is_completed: boolean;
  is_abandoned: boolean;
  result_id?: string;
  started_at: string;
  updated_at: string;
}

// ─── Scoring ────────────────────────────────────────────────────────────────

export interface ScoringRequest {
  session_id: string;
  set_id: string;
  answers: Record<string, string>;
  function_version: 'v1';
}

export interface SectionBreakdown {
  section: Section;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuestionResult {
  question_id: string;
  question_number: number;
  is_correct: boolean;
  selected_option_id: string;
  correct_option_id: string;
  explanation: string;
  time_spent_ms: number;

}
export interface ScoringResult {
  session_id: string;
  score: number;
  total: number;
  percentage: number;
  performance_band: PerformanceBand;
  section_breakdown: SectionBreakdown[];
  question_results: QuestionResult[];
  calculated_at: string;
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface AnalyticsEvent {
  id?: string;
  event_name: string;
  session_id: string;
  user_type: UserType;
  properties: Record<string, unknown>;
  timestamp: string;
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

// ─── Admin Types ────────────────────────────────────────────────────────────

export interface AdminQuestion extends Question {
  correct_answer_id: string;
  explanation: string;
}
