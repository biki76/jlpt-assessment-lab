import type { PerformanceBand } from '../types';

export function calculatePerformanceBand(percentage: number): PerformanceBand {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 70) return 'Proficient';
  if (percentage >= 50) return 'Developing';
  return 'Needs Work';
}
