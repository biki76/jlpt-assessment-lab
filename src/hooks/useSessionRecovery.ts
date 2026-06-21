import { useState, useEffect } from 'react';
import { useExamStore } from '../stores/examStore';
import { validateSession } from '../utils/sessionValidation';
import type { ExamSession } from '../types';

type RecoveryStatus = 'checking' | 'found' | 'none' | 'error';

interface UseSessionRecoveryResult {
  status: RecoveryStatus;
  existingSession: ExamSession | null;
  onResume: () => void;
  onStartFresh: () => void;
}

export function useSessionRecovery(setId: string): UseSessionRecoveryResult {
  const [status, setStatus] = useState<RecoveryStatus>('checking');
  const [existingSession, setExistingSession] = useState<ExamSession | null>(null);
  const currentSession = useExamStore((s) => s.currentSession);
  const resumeSession = useExamStore((s) => s.resumeSession);
  const initSession = useExamStore((s) => s.initSession);
  const clearSession = useExamStore((s) => s.clearSession);

  useEffect(() => {
    // Check Zustand persisted session
    if (currentSession && currentSession.set_id === setId && !currentSession.is_completed && !currentSession.is_abandoned) {
      const valid = validateSession(currentSession);
      if (valid) {
        setExistingSession(valid);
        setStatus('found');
        return;
      }
    }

    // No valid session found
    setStatus('none');
  }, [setId, currentSession]);

  const onResume = () => {
    if (existingSession) {
      resumeSession();
    }
  };

  const onStartFresh = () => {
    if (existingSession) {
      clearSession();
    }
    initSession(setId);
  };

  return { status, existingSession, onResume, onStartFresh };
}
