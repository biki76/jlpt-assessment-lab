import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../stores/examStore';
import { ScoreSummary } from '../features/results/ScoreSummary';
import { SectionBreakdownTable } from '../features/results/SectionBreakdownTable';
import { QuestionReviewAccordion } from '../features/results/QuestionReviewAccordion';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useEffect, useState } from 'react';
import type { ScoringResult } from '../types';

// Mock result for development until Edge Function is working
const MOCK_RESULT: ScoringResult = {
  session_id: 'mock-session',
  score: 20,
  total: 25,
  percentage: 80,
  performance_band: 'Proficient',
  section_breakdown: [
    { section: 'Vocabulary', correct: 8, total: 10, percentage: 80 },
    { section: 'Grammar', correct: 7, total: 8, percentage: 87.5 },
    { section: 'Reading', correct: 5, total: 7, percentage: 71.4 },
  ],
  question_results: [],
  calculated_at: new Date().toISOString(),
};

export function ResultsDashboardScreen() {
  const navigate = useNavigate();
  // const { sessionId } = useParams<{ sessionId: string }>();
  const scoringResult = useExamStore((s) => s.scoringResult);
  const currentQuestions = useExamStore((s) => s.currentQuestions);

  const [result, setResult] = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production: fetch from Supabase if not in Zustand
    // For now: use Zustand result or mock
    const finalResult = scoringResult || MOCK_RESULT;
    setResult(finalResult);
    setLoading(false);
  }, [scoringResult]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No results found.</p>
          <button
            onClick={() => navigate('/')}
            className="tap-min px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors"
          >
            Back to Sets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">Results</h1>
          <button
            onClick={() => navigate('/')}
            className="tap-min text-sm text-gray-400 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Score Summary */}
        <ScoreSummary
          result={result}
          setTitle="JLPT N5 Practice Set 1"
          setLevel="N5"
        />

        {/* Section Breakdown */}
        <SectionBreakdownTable breakdowns={result.section_breakdown} />

        {/* Question Review */}
        {currentQuestions.length > 0 && result.question_results.length > 0 && (
          <QuestionReviewAccordion
            results={result.question_results}
            questions={currentQuestions}
          />
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            Try Another Set
          </button>
          <button
            onClick={() => {
              // Retake same set — would need set_id from result
              navigate('/');
            }}
            className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
          >
            Retake This Set
          </button>
        </div>
      </main>
    </div>
  );
}
