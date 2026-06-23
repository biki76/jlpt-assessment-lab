import type { PerformanceBand } from '../../types';

const BAND_STYLES: Record<PerformanceBand, { bg: string; text: string; ring: string }> = {
  Excellent: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', ring: 'ring-emerald-500/50' },
  Proficient: { bg: 'bg-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/50' },
  Developing: { bg: 'bg-amber-500/20', text: 'text-amber-400', ring: 'ring-amber-500/50' },
  'Needs Work': { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500/50' },
};

interface PerformanceBadgeProps {
  band: PerformanceBand;
}

export function PerformanceBadge({ band }: PerformanceBadgeProps) {
  const styles = BAND_STYLES[band];

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full ${styles.bg} ${styles.text} ring-2 ${styles.ring}`}>
      <span className="text-sm font-bold tracking-wide">{band}</span>
    </div>
  );
}
