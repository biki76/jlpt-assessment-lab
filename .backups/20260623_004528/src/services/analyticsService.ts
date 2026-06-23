import { sha256 } from '../utils/sha256';
import type { UserType } from '../types';

const ALLOWED_EVENTS = [
  'exam_started',
  'question_answered',
  'question_time_spent',
  'exam_abandoned',
  'exam_submitted',
  'scoring_error',
  'ad_outcome',
  'session_recovered',
  'session_recovery_failed',
  'publish_set',
  'publish_attempt_failed',
] as const;

type EventName = typeof ALLOWED_EVENTS[number];

function getConsentStatus(): boolean {
  const consent = localStorage.getItem('nihonsync-consent-v1');
  return consent === 'accepted';
}

export async function logEvent(
  eventName: EventName,
  properties: Record<string, unknown>,
  sessionId: string,
  userType: UserType
): Promise<void> {
  if (!getConsentStatus()) return;

  if (!ALLOWED_EVENTS.includes(eventName)) {
    console.warn(`Unknown analytics event: ${eventName}`);
    return;
  }

  try {
    const hashedSessionId = await sha256(sessionId);

    // In production: send to Supabase Edge Function or directly insert
    // For now: console log (replace with actual API call)
    console.log('[Analytics]', {
      event_name: eventName,
      session_id: hashedSessionId,
      user_type: userType,
      properties,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // Silently discard analytics errors
  }
}
