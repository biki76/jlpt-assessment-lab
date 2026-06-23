#!/bin/bash
# ============================================
# NIHONSYNC UI OVERHAUL — Apply Script
# Run from project root: bash apply-overhaul.sh
# ============================================

set -e

echo "🚀 NihonSync UI Overhaul"
echo "========================"

# 1. Backup
echo "📦 Creating backups..."
mkdir -p .backups/overhaul-$(date +%Y%m%d_%H%M%S)
cp src/index.css src/App.tsx src/hooks/useTheme.ts src/components/ThemeToggle.tsx src/pages/SetCatalogueScreen.tsx src/pages/AssessmentScreen.tsx src/features/assessment/SubmitConfirmationModal.tsx .backups/overhaul-$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true

# 2. Install lucide-react if missing
echo "📥 Checking dependencies..."
npm list lucide-react >/dev/null 2>&1 || npm install lucide-react

# 3. Write index.css
echo "🎨 Writing index.css..."
cat > src/index.css << 'CSSEOF'
/* ============================================
   NIHONSYNC DESIGN SYSTEM — Tailwind v4
   ============================================ */

@import "tailwindcss";

/* ── CSS Custom Properties (Semantic Tokens) ── */
:root {
  --color-bg-base: #f8f9fc;
  --color-bg-elevated: #ffffff;
  --color-bg-sunken: #eef0f5;
  --color-bg-overlay: rgba(15, 15, 26, 0.55);

  --color-text-primary: #0f0f1a;
  --color-text-secondary: #4a4a5a;
  --color-text-tertiary: #7a7a8a;
  --color-text-inverse: #f0f0ff;

  --color-accent: #4f46e5;
  --color-accent-hover: #4338ca;
  --color-accent-muted: rgba(79, 70, 229, 0.12);
  --color-accent-vivid: #6366f1;

  --color-success: #16a34a;
  --color-success-bg: rgba(22, 163, 74, 0.10);
  --color-warning: #d97706;
  --color-warning-bg: rgba(217, 119, 6, 0.10);
  --color-danger: #dc2626;
  --color-danger-bg: rgba(220, 38, 38, 0.10);

  --color-border: rgba(0, 0, 0, 0.08);
  --color-border-hover: rgba(0, 0, 0, 0.14);

  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-modal: 0 24px 48px rgba(0, 0, 0, 0.18);

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}

[data-theme="dark"],
:root[data-theme="dark"] {
  --color-bg-base: #070714;
  --color-bg-elevated: #11112a;
  --color-bg-sunken: #0d0d1f;
  --color-bg-overlay: rgba(0, 0, 0, 0.72);

  --color-text-primary: #f0f0ff;
  --color-text-secondary: #a0a0c0;
  --color-text-tertiary: #6a6a8a;
  --color-text-inverse: #0f0f1a;

  --color-accent: #6366f1;
  --color-accent-hover: #818cf8;
  --color-accent-muted: rgba(99, 102, 241, 0.15);
  --color-accent-vivid: #8b5cf6;

  --color-success: #22c55e;
  --color-success-bg: rgba(34, 197, 94, 0.12);
  --color-warning: #f59e0b;
  --color-warning-bg: rgba(245, 158, 11, 0.12);
  --color-danger: #ef4444;
  --color-danger-bg: rgba(239, 68, 68, 0.12);

  --color-border: rgba(255, 255, 255, 0.06);
  --color-border-hover: rgba(255, 255, 255, 0.12);

  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.40), 0 1px 2px rgba(0, 0, 0, 0.30);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.50), 0 2px 4px rgba(0, 0, 0, 0.40);
  --shadow-modal: 0 24px 48px rgba(0, 0, 0, 0.60);
}

@theme {
  --color-bg-base: var(--color-bg-base);
  --color-bg-elevated: var(--color-bg-elevated);
  --color-bg-sunken: var(--color-bg-sunken);
  --color-bg-overlay: var(--color-bg-overlay);

  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-tertiary: var(--color-text-tertiary);
  --color-text-inverse: var(--color-text-inverse);

  --color-accent: var(--color-accent);
  --color-accent-hover: var(--color-accent-hover);
  --color-accent-muted: var(--color-accent-muted);
  --color-accent-vivid: var(--color-accent-vivid);

  --color-success: var(--color-success);
  --color-success-bg: var(--color-success-bg);
  --color-warning: var(--color-warning);
  --color-warning-bg: var(--color-warning-bg);
  --color-danger: var(--color-danger);
  --color-danger-bg: var(--color-danger-bg);

  --color-border: var(--color-border);
  --color-border-hover: var(--color-border-hover);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);
}

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-bg-base);
    color: var(--color-text-primary);
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    min-height: 100vh;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  *::before, *::after {
    white-space: normal;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.35s ease-out forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.25s ease-out forwards;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
CSSEOF

# 4. Write useTheme.ts
echo "🔄 Writing useTheme.ts..."
cat > src/hooks/useTheme.ts << 'THEMEEOF'
import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'nihonsync-theme';
const DEFAULT_THEME: Theme = 'dark';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme, isDark: theme === 'dark' };
}
THEMEEOF

# 5. Write Modal.tsx
echo "🪟 Writing Modal.tsx..."
cat > src/components/Modal.tsx << 'MODALEOF'
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  showCloseButton = true,
  preventBackdropClose = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventBackdropClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventBackdropClose) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, preventBackdropClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-bg-overlay backdrop-blur-sm" />

      <div
        className={`
          relative w-full ${maxWidthClasses[maxWidth]}
          bg-bg-elevated rounded-radius-lg
          border border-border
          shadow-modal
          animate-scale-in
          overflow-hidden
        `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-lg font-semibold text-text-primary leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 -mr-2 p-2 rounded-radius-md text-text-tertiary hover:text-text-primary hover:bg-bg-sunken transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
MODALEOF

# 6. Write ThemeToggle.tsx
echo "🌓 Writing ThemeToggle.tsx..."
cat > src/components/ThemeToggle.tsx << 'TOGGLEEOF'
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`
        relative flex items-center justify-center
        w-10 h-10 rounded-radius-md
        border border-border
        bg-bg-elevated text-text-secondary
        hover:text-text-primary hover:border-border-hover
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-accent/40
      `}
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
TOGGLEEOF

# 7. Write SubmitConfirmationModal.tsx
echo "✅ Writing SubmitConfirmationModal.tsx..."
cat > src/features/assessment/SubmitConfirmationModal.tsx << 'SUBMITEOF'
import { Modal } from '../../components/Modal';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  answeredCount: number;
  totalCount: number;
}

export function SubmitConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  answeredCount,
  totalCount,
}: SubmitConfirmationModalProps) {
  const unanswered = totalCount - answeredCount;
  const allAnswered = unanswered === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={allAnswered ? 'Ready to Submit?' : 'Questions Remaining'}
      description={
        allAnswered
          ? `You've answered all ${totalCount} questions. Submit your exam now?`
          : `You have ${unanswered} unanswered question${unanswered !== 1 ? 's' : ''} out of ${totalCount}.`
      }
      maxWidth="sm"
      preventBackdropClose
    >
      <div className="space-y-4">
        <div
          className={`
            flex items-center gap-3 p-3 rounded-radius-md
            ${allAnswered ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}
          `}
        >
          {allAnswered ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">
            {allAnswered
              ? 'All questions answered — good to go!'
              : `${unanswered} question${unanswered !== 1 ? 's' : ''} skipped`}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-radius-md text-sm font-medium text-text-secondary bg-bg-sunken hover:bg-border transition-colors"
          >
            Keep Working
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 px-4 py-2.5 rounded-radius-md text-sm font-semibold text-text-inverse
              transition-colors
              ${allAnswered
                ? 'bg-success hover:opacity-90'
                : 'bg-accent hover:bg-accent-hover'
              }
            `}
          >
            {allAnswered ? 'Submit Exam' : 'Submit Anyway'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
SUBMITEOF

# 8. Write SetCatalogueScreen.tsx
echo "🏠 Writing SetCatalogueScreen.tsx..."
cat > src/pages/SetCatalogueScreen.tsx << 'CATALOGEOF'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Clock, BarChart3 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

type JLPTLevel = 'All' | 'N5' | 'N4' | 'N3';

interface QuestionSet {
  id: string;
  title: string;
  level: 'N5' | 'N4' | 'N3';
  questionCount: number;
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const LEVELS: JLPTLevel[] = ['All', 'N5', 'N4', 'N3'];

const DIFFICULTY_STYLES = {
  Beginner: 'bg-success-bg text-success',
  Intermediate: 'bg-warning-bg text-warning',
  Advanced: 'bg-danger-bg text-danger',
};

const LEVEL_FILTER_STYLES = {
  active: 'bg-accent text-text-inverse font-semibold shadow-elevated',
  inactive: 'bg-bg-elevated text-text-secondary border border-border hover:border-border-hover hover:text-text-primary',
};

export function SetCatalogueScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<JLPTLevel>('All');
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockSets: QuestionSet[] = [
      { id: '1', title: 'Core Vocabulary Essentials', level: 'N5', questionCount: 25, estimatedMinutes: 20, difficulty: 'Beginner' },
      { id: '2', title: 'Basic Grammar Patterns', level: 'N5', questionCount: 25, estimatedMinutes: 20, difficulty: 'Beginner' },
      { id: '3', title: 'Intermediate Kanji Review', level: 'N4', questionCount: 25, estimatedMinutes: 25, difficulty: 'Intermediate' },
      { id: '4', title: 'Complex Sentence Structures', level: 'N4', questionCount: 25, estimatedMinutes: 25, difficulty: 'Intermediate' },
      { id: '5', title: 'Advanced Reading Comprehension', level: 'N3', questionCount: 25, estimatedMinutes: 30, difficulty: 'Advanced' },
      { id: '6', title: 'N3 Grammar & Vocabulary Mix', level: 'N3', questionCount: 25, estimatedMinutes: 30, difficulty: 'Advanced' },
    ];
    setSets(mockSets);
    setIsLoading(false);
  }, []);

  const filteredSets = activeFilter === 'All'
    ? sets
    : sets.filter((s) => s.level === activeFilter);

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-radius-md bg-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-text-inverse" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary leading-tight tracking-tight">
                NihonSync
              </h1>
              <p className="text-xs text-text-tertiary font-medium leading-none">
                JLPT Test Lab
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Practice Sets
          </h2>
          <p className="mt-2 text-base text-text-secondary leading-relaxed max-w-xl">
            Select a JLPT level and start practicing. Each set contains 25 questions designed to match real exam conditions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setActiveFilter(level)}
              className={`
                px-5 py-2.5 rounded-radius-md text-sm transition-all duration-200
                ${activeFilter === level ? LEVEL_FILTER_STYLES.active : LEVEL_FILTER_STYLES.inactive}
              `}
            >
              {level === 'All' ? 'All Levels' : level}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 rounded-radius-lg bg-bg-elevated border border-border animate-pulse" />
            ))}
          </div>
        ) : filteredSets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary text-base">No sets found for this level.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {filteredSets.map((set) => (
              <button
                key={set.id}
                onClick={() => navigate(`/exam/${set.id}`)}
                className={`
                  group relative text-left
                  bg-bg-elevated rounded-radius-lg
                  border border-border hover:border-border-hover
                  shadow-card hover:shadow-elevated
                  p-5
                  transition-all duration-200
                  hover:-translate-y-0.5
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`
                    inline-flex items-center px-2.5 py-1 rounded-radius-sm text-xs font-bold tracking-wide
                    ${set.level === 'N5' ? 'bg-success-bg text-success' :
                      set.level === 'N4' ? 'bg-warning-bg text-warning' :
                      'bg-danger-bg text-danger'}
                  `}>
                    {set.level}
                  </span>
                  <span className={`
                    inline-flex items-center px-2 py-0.5 rounded-radius-sm text-xs font-medium
                    ${DIFFICULTY_STYLES[set.difficulty]}
                  `}>
                    {set.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-text-primary leading-snug mb-3 group-hover:text-accent transition-colors">
                  {set.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    {set.questionCount} questions
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {set.estimatedMinutes} min
                  </span>
                </div>

                <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-accent" />
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
CATALOGEOF

# 9. Write AssessmentScreen.tsx
echo "📝 Writing AssessmentScreen.tsx..."
cat > src/pages/AssessmentScreen.tsx << 'ASSEOF'
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { SubmitConfirmationModal } from '../features/assessment/SubmitConfirmationModal';

type Option = 'A' | 'B' | 'C' | 'D';

interface Question {
  id: string;
  number: number;
  text: string;
  options: Record<Option, string>;
  section: 'Vocabulary' | 'Grammar' | 'Reading';
}

const OPTION_LABELS: Option[] = ['A', 'B', 'C', 'D'];

const OPTION_STYLES = {
  default: `
    bg-bg-elevated border-border text-text-secondary
    hover:border-border-hover hover:bg-bg-sunken
  `,
  selected: `
    bg-accent-muted border-accent text-accent
    hover:bg-accent-muted
  `,
};

export function AssessmentScreen() {
  const { setId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Option>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mock: Question[] = Array.from({ length: 25 }, (_, i) => ({
      id: `q-${i + 1}`,
      number: i + 1,
      text: `This is sample question ${i + 1} text. In a real implementation, this would contain the actual Japanese question content with appropriate furigana and context.`,
      options: {
        A: 'Option A content here',
        B: 'Option B content here',
        C: 'Option C content here',
        D: 'Option D content here',
      },
      section: i < 10 ? 'Vocabulary' : i < 18 ? 'Grammar' : 'Reading',
    }));
    setQuestions(mock);
    setIsLoading(false);
  }, [setId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  const handleSelect = (option: Option) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleFlag = () => {
    if (!currentQuestion) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  };

  const handleSubmit = () => {
    navigate(`/results/mock-session-id`);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 300) return 'text-success';
    if (timeRemaining > 60) return 'text-warning';
    return 'text-danger animate-pulse';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <header className="sticky top-0 z-30 bg-bg-base/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-radius-md text-text-tertiary hover:text-text-primary hover:bg-bg-sunken transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-text-primary">
              {currentQuestion.section}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-radius-md
              bg-bg-elevated border border-border font-mono text-sm font-bold
              ${getTimerColor()}
            `}>
              <AlertCircle className="w-4 h-4" />
              {formatTime(timeRemaining)}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="bg-bg-sunken border-b border-border overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-1.5 min-w-max">
            {questions.map((q, idx) => {
              const isActive = idx === currentIndex;
              const isAnswered = !!answers[q.id];
              const isFlagged = flagged.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    relative w-9 h-9 rounded-radius-sm text-xs font-bold
                    flex items-center justify-center
                    transition-all duration-150
                    ${isActive
                      ? 'bg-accent text-text-inverse shadow-elevated scale-110'
                      : isAnswered
                        ? 'bg-success-bg text-success border border-success/20'
                        : 'bg-bg-elevated text-text-tertiary border border-border hover:border-border-hover'
                    }
                    ${isFlagged && !isActive ? 'ring-1 ring-warning' : ''}
                  `}
                >
                  {q.number}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-radius-md bg-accent flex items-center justify-center text-sm font-bold text-text-inverse">
                {currentQuestion.number}
              </span>
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Question {currentQuestion.number} of {totalCount}
                </p>
                <p className="text-sm font-semibold text-text-primary">
                  {currentQuestion.section}
                </p>
              </div>
            </div>
            <button
              onClick={handleFlag}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-radius-md text-sm font-medium
                transition-colors
                ${flagged.has(currentQuestion.id)
                  ? 'bg-warning-bg text-warning border border-warning/20'
                  : 'bg-bg-elevated text-text-tertiary border border-border hover:text-text-primary'
                }
              `}
            >
              <Flag className="w-4 h-4" />
              {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag'}
            </button>
          </div>

          <div className="bg-bg-elevated rounded-radius-lg border border-border p-5 sm:p-6 mb-6">
            <p className="text-base sm:text-lg text-text-primary leading-relaxed font-medium">
              {currentQuestion.text}
            </p>
          </div>

          <div className="space-y-3">
            {OPTION_LABELS.map((label) => (
              <button
                key={label}
                onClick={() => handleSelect(label)}
                className={`
                  w-full flex items-start gap-4 p-4 sm:p-5 rounded-radius-lg border-2
                  text-left transition-all duration-200
                  ${answers[currentQuestion.id] === label
                    ? OPTION_STYLES.selected
                    : OPTION_STYLES.default
                  }
                `}
              >
                <span className={`
                  shrink-0 w-8 h-8 rounded-radius-sm flex items-center justify-center
                  text-sm font-bold
                  ${answers[currentQuestion.id] === label
                    ? 'bg-accent text-text-inverse'
                    : 'bg-bg-sunken text-text-tertiary'
                  }
                `}>
                  {label}
                </span>
                <span className="text-sm sm:text-base text-text-primary leading-relaxed pt-0.5">
                  {currentQuestion.options[label]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-30 bg-bg-base/90 backdrop-blur-md border-t border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-radius-md text-sm font-medium
              transition-colors
              ${currentIndex === 0
                ? 'text-text-tertiary cursor-not-allowed'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-sunken'
              }
            `}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-sm text-text-tertiary">
            <span className="font-semibold text-text-primary">{answeredCount}</span>
            <span> / {totalCount} answered</span>
          </div>

          {currentIndex === totalCount - 1 ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-radius-md text-sm font-semibold text-text-inverse bg-accent hover:bg-accent-hover transition-colors shadow-elevated"
            >
              Submit
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((p) => Math.min(totalCount - 1, p + 1))}
              className="flex items-center gap-2 px-4 py-2.5 rounded-radius-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-sunken transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>

      <SubmitConfirmationModal
        isOpen={showSubmitModal}
        onConfirm={handleSubmit}
        onCancel={() => setShowSubmitModal(false)}
        answeredCount={answeredCount}
        totalCount={totalCount}
      />
    </div>
  );
}
ASSEOF

# 10. Write App.tsx
echo "⚛️ Writing App.tsx..."
cat > src/App.tsx << 'APPEOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SetCatalogueScreen } from './pages/SetCatalogueScreen';
import { AssessmentScreen } from './pages/AssessmentScreen';
import { ResultsDashboardScreen } from './pages/ResultsDashboardScreen';
import { AdminDashboardScreen } from './pages/AdminDashboardScreen';
import { AdminGuard } from './components/AdminGuard';
import { AuthStatusBanner } from './features/auth/AuthStatusBanner';
import { ConsentBanner } from './components/ConsentBanner';
import { OfflineBanner } from './components/OfflineBanner';
import { useOfflineQueue } from './hooks/useOfflineQueue';

function App() {
  useOfflineQueue();

  return (
    <BrowserRouter>
      <AuthStatusBanner />
      <OfflineBanner />
      <Routes>
        <Route path="/" element={<SetCatalogueScreen />} />
        <Route path="/exam/:setId" element={<AssessmentScreen />} />
        <Route path="/results/:sessionId" element={<ResultsDashboardScreen />} />
        <Route path="/admin" element={<AdminGuard><AdminDashboardScreen /></AdminGuard>} />
      </Routes>
      <ConsentBanner />
    </BrowserRouter>
  );
}

export default App;
APPEOF

# 11. Build
echo "🔨 Building..."
npm run build

echo ""
echo "✅ OVERHAUL COMPLETE!"
echo "===================="
echo "Files updated:"
echo "  • src/index.css"
echo "  • src/hooks/useTheme.ts"
echo "  • src/components/Modal.tsx (NEW)"
echo "  • src/components/ThemeToggle.tsx"
echo "  • src/features/assessment/SubmitConfirmationModal.tsx"
echo "  • src/pages/SetCatalogueScreen.tsx"
echo "  • src/pages/AssessmentScreen.tsx"
echo "  • src/App.tsx"
echo ""
echo "Next steps:"
echo "  1. git add -A && git commit -m 'ui: overhaul design system, theme, modals'"
echo "  2. git push"
echo "  3. npm run dev  (to test locally)"
