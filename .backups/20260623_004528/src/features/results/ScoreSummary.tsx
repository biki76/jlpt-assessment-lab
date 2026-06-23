import { PerformanceBadge } from './PerformanceBadge';
import type { ScoringResult } from '../../types';

interface ScoreSummaryProps {
  result: ScoringResult;
  setTitle: string;
  setLevel: string;
}

export function ScoreSummary({ result, setTitle, setLevel }: ScoreSummaryProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          setLevel === 'N5' ? 'bg-emerald-500/20 text-emerald-400' :
          setLevel === 'N4' ? 'bg-blue-500/20 text-blue-400' :
          'bg-purple-500/20 text-purple-400'
        }`}>
          {setLevel}
        </span>
        <span className="text-sm text-gray-400 truncate max-w-[200px]">{setTitle}</span>
      </div>

      <div className="space-y-1">
        <div className="text-5xl font-bold text-white tracking-tight">
          {result.score}<span className="text-2xl text-gray-500">/{result.total}</span>
        </div>
        <div className="text-xl font-semibold text-primary-400">{result.percentage}%</div>
      </div>

      <PerformanceBadge band={result.performance_band} />
    </div>
  );
}
