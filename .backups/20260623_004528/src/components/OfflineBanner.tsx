import { useUIStore } from '../stores/uiStore';

export function OfflineBanner() {
  const isOffline = useUIStore((s) => s.isOffline);

  if (!isOffline) return null;

  return (
    <div className="sticky top-0 z-50 bg-amber-500/20 border-b border-amber-500/30 px-4 py-2">
      <p className="text-xs text-amber-400 text-center">
        You're offline. Your answers are saved locally.
      </p>
    </div>
  );
}
