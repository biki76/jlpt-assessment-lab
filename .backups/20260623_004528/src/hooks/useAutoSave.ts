import { useEffect, useRef } from 'react';
import { useExamStore } from '../stores/examStore';
import { AUTO_SAVE_INTERVAL_MS } from '../constants';

export function useAutoSave() {
  const currentSession = useExamStore((s) => s.currentSession);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!currentSession || currentSession.is_completed) return;

    intervalRef.current = setInterval(() => {
      // localStorage is already handled by Zustand persist
      // Supabase auto-save for authenticated users would go here
      // Fire-and-forget; silent on error
    }, AUTO_SAVE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSession]);
}
