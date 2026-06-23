import type { SectionBreakdown } from '../../types';

interface SectionBreakdownTableProps {
  breakdowns: SectionBreakdown[];
}

export function SectionBreakdownTable({ breakdowns }: SectionBreakdownTableProps) {
  return (
    <div className="rounded-xl bg-dark-800 border border-dark-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-dark-700">
        <h3 className="text-sm font-semibold text-gray-300">Section Breakdown</h3>
      </div>
      <div className="divide-y divide-dark-700">
        {breakdowns.map((b) => (
          <div key={b.section} className="px-4 py-3 flex items-center justify-between">
            <div className="flex-1">
              <span className="text-sm text-white font-medium">{b.section}</span>
              <div className="mt-1 h-2 w-full bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all"
                  style={{ width: `${b.percentage}%` }}
                />
              </div>
            </div>
            <div className="ml-4 text-right">
              <span className="text-sm font-bold text-white">{b.correct}/{b.total}</span>
              <span className="block text-xs text-gray-400">{b.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
