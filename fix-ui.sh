#!/bin/bash
# ============================================================
# NihonSync JLPT — UI/UX Fixes Script
# Run: bash fix-ui.sh
# ============================================================

echo "🔧 NihonSync UI/UX Fixes — Starting..."

# ──────────────────────────────────────────────────────────
# FIX 1: Typography & Hierarchy (Global CSS)
# ──────────────────────────────────────────────────────────

echo "📐 Applying typography fixes..."

cat > src/index.css << 'CSSEOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    @apply bg-slate-900 text-slate-100;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

@layer components {
  .app-title {
    @apply text-2xl font-bold tracking-tight text-white sm:text-3xl;
    line-height: 1.2;
  }
  .question-text {
    @apply text-lg font-semibold leading-relaxed text-white sm:text-xl;
    letter-spacing: -0.01em;
  }
  .option-text {
    @apply text-base font-medium leading-relaxed;
  }
  .timer-display {
    @apply text-xl font-bold tabular-nums tracking-wide;
    font-variant-numeric: tabular-nums;
  }
}
CSSEOF

echo "✅ Global CSS created."

# ──────────────────────────────────────────────────────────
# FIX 2, 3, 4: ExamScreen.tsx — All 3 fixes in one file
# ──────────────────────────────────────────────────────────

echo "🔧 Rewriting ExamScreen.tsx with fixes 2, 3, 4..."

cp src/screens/ExamScreen.tsx src/screens/ExamScreen.tsx.bak 2>/dev/null

cat > src/screens/ExamScreen.tsx << 'EXAMEOF'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '../stores/examStore';
import { useUIStore } from '../stores/uiStore';
import { fetchQuestionsBySetId } from '../services/questionService';
import { autoSaveSession, abandonSession } from '../services/sessionService';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorModal } from '../components/ErrorModal';
import { formatTime } from '../utils/formatTime';
import { ArrowLeft, Clock, CheckCircle2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const EXAM_DURATION_MINUTES = 20;
const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60;

export function ExamScreen() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { currentSession, currentQuestions, initSession, setCurrentQuestion, recordAnswer, abandonSession: storeAbandon, setQuestions, clearSession } = useExamStore();
  const { isOffline } = useUIStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION_SECONDS);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const navigatorRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!setId) { setError('Invalid exam link'); setLoading(false); return; }
    async function init() {
      try {
        if (!currentSession || currentSession.set_id !== setId) initSession(setId);
        if (currentQuestions.length === 0) {
          const questions = await fetchQuestionsBySetId(setId);
          setQuestions(questions);
        }
      } catch (err) { setError(err instanceof Error ? err.message : 'Failed to load exam'); }
      finally { setLoading(false); }
    }
    init();
  }, [setId]);

  useEffect(() => {
    if (loading || !currentSession) return;
    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [loading, currentSession]);

  // FIX #4: Auto-scroll navigator to center active question
  useEffect(() => {
    if (activeButtonRef.current && navigatorRef.current) {
      const container = navigatorRef.current;
      const btn = activeButtonRef.current;
      const scrollTarget = btn.offsetLeft - container.clientWidth / 2 + btn.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, [currentSession?.current_question_index]);

  useEffect(() => { setQuestionStartTime(Date.now()); }, [currentSession?.current_question_index]);

  const currentQuestion = currentQuestions[currentSession?.current_question_index ?? 0];
  const totalQuestions = currentQuestions.length;
  const currentIndex = currentSession?.current_question_index ?? 0;
  const currentAnswer = currentSession?.answers?.[currentQuestion?.id];

  const handleSelectOption = useCallback((optionId: string) => {
    if (!currentQuestion || !currentSession) return;
    const timeSpent = Date.now() - questionStartTime;
    recordAnswer(currentQuestion.id, optionId, timeSpent);
    setTimeout(() => { if (currentIndex < totalQuestions - 1) setCurrentQuestion(currentIndex + 1); }, 400);
  }, [currentQuestion, currentSession, currentIndex, totalQuestions, questionStartTime]);

  const handleNavigate = useCallback((index: number) => { if (index >= 0 && index < totalQuestions) setCurrentQuestion(index); }, [totalQuestions]);
  const handlePrevious = useCallback(() => handleNavigate(currentIndex - 1), [currentIndex, handleNavigate]);
  const handleNext = useCallback(() => handleNavigate(currentIndex + 1), [currentIndex, handleNavigate]);
  const handleSubmit = useCallback(async () => { if (!currentSession) return; navigate(`/results/${currentSession.id}`); }, [currentSession, navigate]);
  const handleExit = useCallback(async () => {
    if (!currentSession) return; storeAbandon();
    try { await abandonSession(currentSession.id); } catch { /* silent */ }
    clearSession(); navigate('/');
  }, [currentSession, storeAbandon, clearSession, navigate]);

  // FIX #3: Timer color logic
  const getTimerColor = () => {
    const ratio = timeRemaining / EXAM_DURATION_SECONDS;
    if (ratio > 0.5) return 'text-emerald-400';
    if (ratio > 0.25) return 'text-amber-400';
    return 'text-rose-400 animate-pulse';
  };
  const getTimerBorder = () => {
    const ratio = timeRemaining / EXAM_DURATION_SECONDS;
    if (ratio > 0.5) return 'border-emerald-500/30';
    if (ratio > 0.25) return 'border-amber-500/30';
    return 'border-rose-500/30';
  };

  if (loading) return <LoadingSkeleton />;
  if (!currentQuestion || !currentSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-400 mb-3" />
          <p className="text-lg font-semibold text-slate-300">Exam not available</p>
          <button onClick={() => navigate('/')} className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">Back to Sets</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowExitConfirm(true)} className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700/40 px-3.5 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white">
              <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Exit</span>
            </button>
            {/* FIX #3: Prominent timer */}
            <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 bg-slate-800/60 ${getTimerBorder()}`}>
              <Clock className={`h-5 w-5 ${getTimerColor()}`} strokeWidth={2.5} />
              <span className={`timer-display ${getTimerColor()}`}>{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FIX #4: Question Navigator */}
      <div className="sticky top-[60px] z-20 border-b border-slate-800/60 bg-slate-900/90 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div ref={navigatorRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {currentQuestions.map((q, idx) => {
              const isActive = idx === currentIndex;
              const isAnswered = !!currentSession.answers[q.id];
              return (
                <button key={q.id} ref={isActive ? activeButtonRef : null} onClick={() => handleNavigate(idx)}
                  className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110 ring-2 ring-blue-400/50'
                    : isAnswered ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/40 hover:bg-slate-700 hover:text-slate-300'
                  }`} aria-label={`Question ${idx + 1}`} aria-current={isActive ? 'true' : undefined}>
                  {isAnswered && !isActive ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400 border border-slate-700/40">{currentQuestion.section}</span>
            <span className="text-xs text-slate-600">•</span>
            <span className="text-xs font-medium text-slate-500">Difficulty {currentQuestion.difficulty}</span>
          </div>
          <span className="text-sm font-semibold text-slate-400 tabular-nums">{currentIndex + 1} / {totalQuestions}</span>
        </div>

        {/* FIX #1: Question text */}
        <h2 className="question-text mb-2">{currentQuestion.question_text}</h2>
        {currentQuestion.target_word && <p className="mb-8 text-lg font-medium text-slate-400 leading-relaxed">{currentQuestion.target_word}</p>}

        {/* FIX #2: Options — clean letter badges, no overlap */}
        <div className="space-y-3 mb-10">
          {currentQuestion.options.map((option, optIdx) => {
            const isSelected = currentAnswer?.optionId === option.id;
            const letter = String.fromCharCode(65 + optIdx);
            return (
              <button key={option.id} onClick={() => handleSelectOption(option.id)}
                className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                  isSelected ? 'bg-blue-600/15 border-blue-500/40 shadow-md shadow-blue-900/20' : 'bg-slate-800/60 border-slate-700/40 hover:bg-slate-800 hover:border-slate-600/60'
                }`}>
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                  isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700/60 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300'
                }`}>
                  {isSelected ? <CheckCircle2 className="h-5 w-5" /> : letter}
                </div>
                <span className={`pt-1.5 option-text ${isSelected ? 'text-blue-100' : 'text-slate-300'}`}>{option.option_text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={handlePrevious} disabled={currentIndex === 0}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${currentIndex === 0 ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed' : 'bg-slate-800 text-slate-300 border border-slate-700/40 hover:bg-slate-700 hover:text-white'}`}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          {currentIndex === totalQuestions - 1 ? (
            <button onClick={handleSubmit} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-500 shadow-lg shadow-emerald-900/30">Submit Exam</button>
          ) : (
            <button onClick={handleNext} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500 shadow-lg shadow-blue-900/20">Next <ChevronRight className="h-4 w-4" /></button>
          )}
        </div>
      </main>

      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700/50 p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Exit Exam?</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">Your progress will be saved locally. You can resume this exam later from the home screen.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700/50">Keep Going</button>
              <button onClick={handleExit} className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500">Exit</button>
            </div>
          </div>
        </div>
      )}

      <ErrorModal isOpen={!!error} message={error || ''} onClose={() => setError(null)} onRetry={() => window.location.reload()} />
      {isOffline && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-amber-500/10 border-t border-amber-500/20 px-4 py-2">
          <div className="mx-auto max-w-2xl flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-400">Offline mode — answers saved locally</span>
          </div>
        </div>
      )}
    </div>
  );
}
EXAMEOF

echo "✅ ExamScreen.tsx rewritten."

# ──────────────────────────────────────────────────────────
# FIX 1 (cont): SetCatalogueScreen — typography
# ──────────────────────────────────────────────────────────

echo "📐 Fixing SetCatalogueScreen typography..."

cp src/screens/SetCatalogueScreen.tsx src/screens/SetCatalogueScreen.tsx.bak 2>/dev/null

cat > src/screens/SetCatalogueScreen.tsx << 'CATEOF'
import React, { useState, useEffect } from 'react';
import { fetchPublishedQuestionSets } from '../services/questionService';
import { useExamStore } from '../stores/examStore';
import { useUIStore } from '../stores/uiStore';
import { QuestionSet } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorModal } from '../components/ErrorModal';
import { BookOpen, ChevronRight, Layers } from 'lucide-react';

const LEVELS = ['All', 'N5', 'N4', 'N3'] as const;
const LEVEL_COLORS: Record<string, string> = {
  N5: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  N4: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  N3: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export function SetCatalogueScreen() {
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [filteredSets, setFilteredSets] = useState<QuestionSet[]>([]);
  const [activeLevel, setActiveLevel] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { initSession, setQuestions } = useExamStore();
  const { isOffline } = useUIStore();

  useEffect(() => { loadSets(); }, []);
  useEffect(() => { setFilteredSets(activeLevel === 'All' ? sets : sets.filter((s) => s.level === activeLevel)); }, [activeLevel, sets]);

  async function loadSets() {
    try { setLoading(true); const data = await fetchPublishedQuestionSets(); setSets(data); setFilteredSets(data); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to load question sets'); }
    finally { setLoading(false); }
  }

  function handleStartExam(setId: string) { initSession(setId); setQuestions([]); window.location.href = `/exam/${setId}`; }

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="app-title">NihonSync Test Lab</h1>
              <p className="mt-1.5 text-sm font-medium text-slate-400">Master JLPT with structured practice</p>
            </div>
            <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-400 border border-slate-700/50">JLPT Practice</span>
          </div>
          <div className="mt-5 flex items-center gap-2.5">
            {LEVELS.map((level) => (
              <button key={level} onClick={() => setActiveLevel(level)}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${activeLevel === level ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700/50'}`}>
                {level}
              </button>
            ))}
          </div>
        </div>
      </header>

      {isOffline && (
        <div className="mx-auto max-w-2xl px-4 pt-3">
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-400">You're offline. Results will sync when you reconnect.</span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 py-5">
        {filteredSets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layers className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg font-semibold text-slate-400">No sets available</p>
            <p className="mt-1 text-sm text-slate-500">Try selecting a different level</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSets.map((set) => (
              <button key={set.id} onClick={() => handleStartExam(set.id)}
                className="group flex w-full items-center gap-4 rounded-2xl bg-slate-800/80 border border-slate-700/40 p-4 text-left transition-all duration-200 hover:bg-slate-800 hover:border-slate-600/60 hover:shadow-lg hover:shadow-slate-900/50 active:scale-[0.98]">
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${LEVEL0
