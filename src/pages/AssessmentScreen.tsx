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
import type { Question } from '../types';

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

  useAutoSave();
  const answerStartTime = useRef<number>(Date.now());

  // Check for existing session on mount
  useEffect(() => {
    if (!setId || sessionChecked) return;

    // Only show recovery if there's a session with ACTUAL answers for THIS set
    const hasValidSession = currentSession && 
      currentSession.set_id === setId && 
      !currentSession.is_completed && 
      !currentSession.is_abandoned &&
      Object.keys(currentSession.answers).length > 0;

    if (hasValidSession) {
      setShowRecoveryModal(true);
    } else {
      // Clear any stale session and start fresh
      clearSession();
      initSession(setId);
    }
    setSessionChecked(true);
  }, [setId, currentSession, sessionChecked, clearSession, initSession]);

  // Load questions
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

  // Reset answer timer when question changes
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

  const handleConfirmSubmit = useCallback(() => {
    setShowSubmitModal(false);
    navigate(`/results/${currentSession?.id || 'mock'}`);
  }, [navigate, currentSession]);

  const handleStartNew = useCallback(() => {
    setShowRecoveryModal(false);
    clearSession();
    if (setId) initSession(setId);
  }, [clearSession, initSession, setId]);

  const handleResume = useCallback(() => {
    setShowRecoveryModal(false);
  }, []);

  // Show recovery modal
  if (showRecoveryModal && currentSession) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <SessionRecoveryModal
          session={currentSession}
          onResume={handleResume}
          onStartNew={handleStartNew}
        />
      </div>
    );
  }

  // Loading state
  if (loading || !currentSession || !sessionChecked) {
    return (
      <div className="min-h-screen bg-dark-900 text-white">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-4">
        <ErrorModal
          title="Couldn't load questions"
          body={error}
          primaryAction={{ label: 'Retry', onClick: () => window.location.reload() }}
          secondaryAction={{ label: 'Back to Sets', onClick: () => navigate('/') }}
        />
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

  return (
    <div className="min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="tap-min text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Exit
          </button>
          <SessionTimer startedAt={currentSession.started_at} />
        </div>
      </header>

      {/* Navigation Dots */}
      <div className="max-w-lg mx-auto w-full px-4 pt-2">
        <NavigationDotGrid
          total={questions.length}
          currentIndex={currentSession.current_question_index}
          answeredIndices={answeredIndices}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Question */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            selectedOptionId={currentSelectedOption}
            onSelectOption={handleSelectOption}
            questionNumber={currentSession.current_question_index + 1}
            totalQuestions={questions.length}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 bg-dark-900/95 backdrop-blur border-t border-dark-700 safe-bottom">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => handleNavigate(Math.max(0, currentSession.current_question_index - 1))}
            disabled={currentSession.current_question_index === 0}
            className="tap-min px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentSession.current_question_index === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="tap-min px-6 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => handleNavigate(currentSession.current_question_index + 1)}
              className="tap-min px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </footer>

      {/* Submit Modal */}
      {showSubmitModal && (
        <SubmitConfirmationModal
          answeredCount={Object.keys(currentSession.answers).length}
          totalQuestions={questions.length}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}
    </div>
  );
}
