import type { ExamSession } from '../types';

export function validateSession(raw: unknown): ExamSession | null {
  if (!raw || typeof raw !== 'object') return null;

  const session = raw as Record<string, unknown>;

  if (
    typeof session.id !== 'string' ||
    typeof session.set_id !== 'string' ||
    typeof session.user_type !== 'string' ||
    typeof session.current_question_index !== 'number' ||
    typeof session.is_completed !== 'boolean' ||
    typeof session.is_abandoned !== 'boolean' ||
    typeof session.started_at !== 'string' ||
    typeof session.updated_at !== 'string'
  ) {
    return null;
  }

  if (session.user_type !== 'guest' && session.user_type !== 'authenticated') {
    return null;
  }

  if (!session.answers || typeof session.answers !== 'object') {
    return null;
  }

  return session as unknown as ExamSession;
}
