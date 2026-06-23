import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../stores/examStore';
import { useAutoSave } from '../hooks/useAutoSave';
import { fetchQuestionsForSet } from '../services/questionService';
import { SessionRecoveryModal } from '../features/assessment/SessionRecoveryModal';
import { QuestionCard } from '../features/assessment/QuestionCard';
import { NavigationDotGrid } from '../features/assessment/NavigationDotGrid';
import { SessionTimer } from '../features/assessment/SessionTimer';
import { SubmitConfirmationModal } from '../features/assessment/SubmitConfirmationModal';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorModal } from '../components/ErrorModal';
import type { Question, ScoringResult, Section, QuestionResult } from '../types';

const EXAM_DURATION_MINUTES = 20;

export function AssessmentScreen() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const currentSession = useExamStore((s) => s.currentSession);
  const setQuestionsInStore = useExamStore((s) => s.setQuestions);
  const setCurrentQuestion = useExamStore((s) => s.setCurrentQuestion);
  const recordAnswer = useExamStore((s) => s.recordAnswer);
  const initSession = useExamStore((s) => s.initSession);
  const clearSession = useExamStore((s) => s.clearSession);
  const setScoringResult = useExamStore((s) => s.setScoringResult);
  const markSessionComplete = useExamStore((s) => s.markSessionComplete);

  useAutoSave();
  const answerStartTime = useRef<number>(Date.now());

  useEffect(() => {
    if (!setId || sessionChecked) return;
    const hasValidSession = currentSession &&
      currentSession.set_id === setId &&
      !currentSession.is_completed &&
      !currentSession.is_abandoned &&
      Object.keys(currentSession.answers).length > 0;
    if (hasValidSession) {
      setShowRecoveryModal(true);
    } else {
      clearSession();
      initSession(setId);
    }
    setSessionChecked(true);
  }, [setId, currentSession, sessionChecked, clearSession, initSession]);

  useEffect(() => {
    if (!setId || !sessionChecked) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchQuestionsForSet(setId);
        setQuestions(data);
        setQuestionsInStore(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setId, sessionChecked, setQuestionsInStore]);

  useEffect(() => {
    answerStartTime.current = Date.now();
  }, [currentSession?.current_question_index]);

  const handleSelectOption = useCallback((optionId: string) => {
    if (!currentSession || !setId) return;
    const timeSpent = Date.now() - answerStartTime.current;
    const question = questions[currentSession.current_question_index];
    if (!question) return;
    recordAnswer(question.id, optionId, timeSpent);
  }, [currentSession, questions, recordAnswer, setId]);

  const handleNavigate = useCallback((index: number) => {
    setCurrentQuestion(index);
  }, [setCurrentQuestion]);

  const handleSubmit = useCallback(() => {
    setShowSubmitModal(true);
  }, []);

  const calculateScore = useCallback((): ScoringResult => {
    if (!currentSession || !questions.length) {
      return {
        session_id: currentSession?.id || 'unknown',
        score: 0,
        total: 0,
        percentage: 0,
        performance_band: 'Needs Work',
        section_breakdown: [],
        question_results: [],
        calculated_at: new Date().toISOString(),
      };
    }

    let correct = 0;
    const sectionMap: Record<string, { correct: number; total: number }> = {};
    const questionResults: QuestionResult[] = [];

    questions.forEach((q) => {
      const answer = currentSession.answers[q.id];
      const correctOption = q.options.find(opt => opt.is_correct);
      const isCorrect = answer ? answer.selected_option_id === correctOption?.id : false;
      
      if (!sectionMap[q.section]) {
        sectionMap[q.section] = { correct: 0, total: 0 };
      }
      sectionMap[q.section].total++;
      
      if (isCorrect) {
        correct++;
        sectionMap[q.section].correct++;
      }

      questionResults.push({
        question_id: q.id,
        question_number: q.question_number,
        selected_option_id: answer?.selected_option_id || '',
        correct_option_id: correctOption?.id || '',
        is_correct: isCorrect,
        explanation: '',
        time_spent_ms: answer?.time_spent_ms || 0,
      });
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    const sectionBreakdown = Object.entries(sectionMap).map(([section, data]) => ({
      section: section as Section,
      correct: data.correct,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }));

    const band: ScoringResult['performance_band'] =
      percentage >= 90 ? 'Excellent' :
      percentage >= 70 ? 'Proficient' :
      percentage >= 50 ? 'Developing' : 'Needs Work';

    return {
      session_id: currentSession.id,
      score: correct,
      total,
      percentage,
      performance_band: band,
      section_breakdown: sectionBreakdown,
      question_results: questionResults,
      calculated_at: new Date().toISOString(),
    };
  }, [currentSession, questions]);

  const handleConfirmSubmit = useCallback(() => {
    setShowSubmitModal(false);
    const result = calculateScore();
    setScoringResult(result);
    if (currentSession) {
      markSessionComplete(result.session_id);
    }
    navigate(`/results/${currentSession?.id || 'mock'}`);
  }, [navigate, currentSession, calculateScore, setScoringResult, markSessionComplete]);

  const handleStartNew = useCallback(() => {
    setShowRecoveryModal(false);
    clearSession();
    if (setId) initSession(setId);
  }, [clearSession, initSession, setId]);

  const handleResume = useCallback(() => {
    setShowRecoveryModal(false);
  }, []);

  if (showRecoveryModal && currentSession) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <SessionRecoveryModal session={currentSession} onResume={handleResume} onStartNew={handleStartNew} />
      </div>
    );
  }

  if (loading || !currentSession || !sessionChecked) {
    return <div className="min-h-screen bg-dark-900 text-white"><LoadingSkeleton /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-4">
        <ErrorModal title="Couldn't load questions" body={error}
          primaryAction={{ label: 'Retry', onClick: () => window.location.reload() }}
          secondaryAction={{ label: 'Back to Sets', onClick: () => navigate('/') }} />
      </div>
    );
  }

  const currentQuestion = questions[currentSession.current_question_index];
  const answeredIndices = Object.values(currentSession.answers).map((a) => {
    const qIndex = questions.findIndex((q) => q.id === a.question_id);
    return qIndex >= 0 ? qIndex : -1;
  }).filter((i) => i >= 0);

  const currentSelectedOption = currentQuestion
    ? currentSession.answers[currentQuestion.id]?.selected_option_id
    : undefined;

  const progressPercent = questions.length > 0 
    ? ((currentSession.current_question_index + 1) / questions.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="tap-min p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="text-center flex-1 mx-2">
            <h1 className="text-sm font-bold text-white truncate">N5 Test Set</h1>
            <p className="text-xs text-gray-500 mt-0.5">{currentSession.current_question_index + 1} / {questions.length}</p>
          </div>
          <SessionTimer startedAt={currentSession.started_at} durationMinutes={EXAM_DURATION_MINUTES} />
        </div>
        <div className="h-1.5 bg-dark-800">
          <div className="h-full bg-primary-600 rounded-r-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
        <div className="max-w-lg mx-auto w-full">
          <NavigationDotGrid total={questions.length} currentIndex={currentSession.current_question_index}
            answeredIndices={answeredIndices} onNavigate={handleNavigate} />
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-5">
        {currentQuestion && (
          <QuestionCard question={currentQuestion} selectedOptionId={currentSelectedOption}
            onSelectOption={handleSelectOption} questionNumber={currentSession.current_question_index + 1}
            totalQuestions={questions.length} />
        )}
      </main>

      <footer className="sticky bottom-0 z-40 bg-dark-900/95 backdrop-blur-md border-t border-white/5 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => handleNavigate(Math.max(0, currentSession.current_question_index - 1))}
            disabled={currentSession.current_question_index === 0}
            className={`tap-min flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              currentSession.current_question_index === 0 ? 'bg-dark-800 text-gray-600 cursor-not-allowed' : 'bg-dark-800 text-white hover:bg-dark-700'
            }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {currentSession.current_question_index === questions.length - 1 ? (
            <button onClick={handleSubmit} className="tap-min flex-1 h-12 rounded-2xl bg-primary-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-500 transition-all shadow-lg shadow-primary-600/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit
            </button>
          ) : (
            <button onClick={() => handleNavigate(currentSession.current_question_index + 1)} className="tap-min flex-1 h-12 rounded-2xl bg-dark-800 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-dark-700 transition-all">
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </footer>

      {showSubmitModal && (
        <SubmitConfirmationModal answeredCount={Object.keys(currentSession.answers).length}
          totalQuestions={questions.length} onConfirm={handleConfirmSubmit} onCancel={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
}
