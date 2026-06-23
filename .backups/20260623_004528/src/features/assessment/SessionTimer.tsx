import { useState, useEffect, useMemo } from 'react';

interface SessionTimerProps {
  startedAt: string;
  durationMinutes?: number;
}

const DEFAULT_DURATION_MINUTES = 20;

export function SessionTimer({ 
  startedAt, 
  durationMinutes = DEFAULT_DURATION_MINUTES 
}: SessionTimerProps) {
  const durationMs = durationMinutes * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState(durationMs);

  useEffect(() => {
    const startTime = new Date(startedAt).getTime();

    const tick = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, durationMs - elapsed);
      setTimeLeft(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationMs]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const timerStyles = useMemo(() => {
    if (timeLeft > 300000) {
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
    if (timeLeft > 60000) {
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
    return 'text-red-400 bg-red-400/10 border-red-400/20 animate-pulse';
  }, [timeLeft]);

  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${timerStyles} transition-colors duration-500`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-lg font-bold tabular-nums tracking-wider">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
}
