import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../stores/examStore';
import { ScoreSummary } from '../features/results/ScoreSummary';
import { SectionBreakdownTable } from '../features/results/SectionBreakdownTable';
import { QuestionReviewAccordion } from '../features/results/QuestionReviewAccordion';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useEffect, useState } from 'react';
import type { ScoringResult } from '../types';

export function ResultsDashboardScreen() {
  const navigate = useNavigate();
  const scoringResult = useExamStore((s) => s.scoringResult);
  const currentQuestions = useExamStore((s) => s.currentQuestions);
  const currentSession = useExamStore((s) => s.currentSession);

  const [result, setResult] = useState<ScoringResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scoringResult) {
      setResult(scoringResult);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [scoringResult]);

  if (loading) {
    return <div className="min-h-screen bg-dark-900 text-white"><LoadingSkeleton /></div>;
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Results Found</h2>
          <p className="text-gray-400 mb-6">Complete an exam to see your results here.</p>
          <button onClick={() => navigate('/')} className="tap-min px-6 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors">
            Back to Sets
          </button>
        </div>
      </div>
    );
  }

  const setTitle = currentSession?.set_id 
    ? `JLPT ${currentSession.set_id.split('-')[0]?.toUpperCase() || 'N5'} Practice Set`
    : 'JLPT Practice Set';
  const setLevel = currentSession?.set_id?.split('-')[0]?.toUpperCase() || 'N5';

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Results</h1>
          <button onClick={() => navigate('/')} className="tap-min text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Done
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        <ScoreSummary result={result} setTitle={setTitle} setLevel={setLevel} />
        <SectionBreakdownTable breakdowns={result.section_breakdown} />
        {currentQuestions.length > 0 && result.question_results.length > 0 && (
          <QuestionReviewAccordion results={result.question_results} questions={currentQuestions} />
        )}
        <div className="flex gap-3 pt-4">
          <button onClick={() => navigate('/')} className="flex-1 tap-min px-4 py-3.5 rounded-xl text-sm font-bold text-gray-300 bg-dark-800 hover:bg-dark-700 transition-colors">
            Try Another Set
          </button>
          <button onClick={() => {
            if (currentSession?.set_id) {
              navigate(`/exam/${currentSession.set_id}`);
            } else {
              navigate('/');
            }
          }} className="flex-1 tap-min px-4 py-3.5 rounded-xl text-sm font-bold bg-primary-600 text-white hover:bg-primary-500 transition-colors shadow-lg shadow-primary-600/20">
            Retake This Set
          </button>
        </div>
      </main>
    </div>
  );
}
