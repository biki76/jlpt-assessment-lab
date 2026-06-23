import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, AlertCircle } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { SubmitConfirmationModal } from '../features/assessment/SubmitConfirmationModal';

type Option = 'A' | 'B' | 'C' | 'D';
interface Question { id: string; number: number; text: string; options: Record<Option, string>; section: 'Vocabulary' | 'Grammar' | 'Reading'; }

const OPTION_LABELS: Option[] = ['A', 'B', 'C', 'D'];

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
    setQuestions(Array.from({ length: 25 }, (_, i) => ({
      id: `q-${i + 1}`, number: i + 1,
      text: `This is sample question ${i + 1} text. In a real implementation, this would contain the actual Japanese question content with appropriate furigana and context.`,
      options: { A: 'Option A content here', B: 'Option B content here', C: 'Option C content here', D: 'Option D content here' },
      section: i < 10 ? 'Vocabulary' : i < 18 ? 'Grammar' : 'Reading',
    })));
    setIsLoading(false);
  }, [setId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    const interval = setInterval(() => setTimeRemaining((p) => p <= 1 ? 0 : p - 1), 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  const handleSelect = (option: Option) => { if (!currentQ) return; setAnswers((p) => ({ ...p, [currentQ.id]: option })); };
  const handleFlag = () => { if (!currentQ) return; setFlagged((p) => { const n = new Set(p); if (n.has(currentQ.id)) n.delete(currentQ.id); else n.add(currentQ.id); return n; }); };
  const handleSubmit = () => navigate(`/results/mock-session-id`);
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  const tColor = timeRemaining > 300 ? 'text-success' : timeRemaining > 60 ? 'text-warning' : 'text-danger animate-pulse';

  if (isLoading) return <div className="min-h-screen bg-bg-base flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>;
  if (!currentQ) return null;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <header className="sticky top-0 z-30 bg-bg-base/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-radius-md text-text-tertiary hover:text-text-primary hover:bg-bg-sunken transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <span className="text-sm font-semibold text-text-primary">{currentQ.section}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-radius-md bg-bg-elevated border border-border font-mono text-sm font-bold ${tColor}`}><AlertCircle className="w-4 h-4" />{fmt(timeRemaining)}</div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="bg-bg-sunken border-b border-border overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-1.5 min-w-max">
            {questions.map((q, idx) => {
              const active = idx === currentIndex, ans = !!answers[q.id], flg = flagged.has(q.id);
              return (
                <button key={q.id} onClick={() => setCurrentIndex(idx)}
                  className={`relative w-9 h-9 rounded-radius-sm text-xs font-bold flex items-center justify-center transition-all duration-150 ${active ? 'bg-accent text-text-inverse shadow-elevated scale-110' : ans ? 'bg-success-bg text-success border border-success/20' : 'bg-bg-elevated text-text-tertiary border border-border hover:border-border-hover'} ${flg && !active ? 'ring-1 ring-warning' : ''}`}>
                  {q.number}{flg && <span className="absolute -top-1 -right-1 w-2 h-2 bg-warning rounded-full" />}
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
              <span className="w-10 h-10 rounded-radius-md bg-accent flex items-center justify-center text-sm font-bold text-text-inverse">{currentQ.number}</span>
              <div>
                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">Question {currentQ.number} of {totalCount}</p>
                <p className="text-sm font-semibold text-text-primary">{currentQ.section}</p>
              </div>
            </div>
            <button onClick={handleFlag} className={`flex items-center gap-2 px-3 py-2 rounded-radius-md text-sm font-medium transition-colors ${flagged.has(currentQ.id) ? 'bg-warning-bg text-warning border border-warning/20' : 'bg-bg-elevated text-text-tertiary border border-border hover:text-text-primary'}`}><Flag className="w-4 h-4" />{flagged.has(currentQ.id) ? 'Flagged' : 'Flag'}</button>
          </div>

          <div className="bg-bg-elevated rounded-radius-lg border border-border p-5 sm:p-6 mb-6">
            <p className="text-base sm:text-lg text-text-primary leading-relaxed font-medium">{currentQ.text}</p>
          </div>

          <div className="space-y-3">
            {OPTION_LABELS.map((label) => (
              <button key={label} onClick={() => handleSelect(label)}
                className={`w-full flex items-start gap-4 p-4 sm:p-5 rounded-radius-lg border-2 text-left transition-all duration-200 ${answers[currentQ.id] === label ? 'bg-accent-muted border-accent text-accent' : 'bg-bg-elevated border-border text-text-secondary hover:border-border-hover hover:bg-bg-sunken'}`}>
                <span className={`shrink-0 w-8 h-8 rounded-radius-sm flex items-center justify-center text-sm font-bold ${answers[currentQ.id] === label ? 'bg-accent text-text-inverse' : 'bg-bg-sunken text-text-tertiary'}`}>{label}</span>
                <span className="text-sm sm:text-base text-text-primary leading-relaxed pt-0.5">{currentQ.options[label]}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-30 bg-bg-base/90 backdrop-blur-md border-t border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))} disabled={currentIndex === 0} className={`flex items-center gap-2 px-4 py-2.5 rounded-radius-md text-sm font-medium transition-colors ${currentIndex === 0 ? 'text-text-tertiary cursor-not-allowed' : 'text-text-secondary hover:text-text-primary hover:bg-bg-sunken'}`}><ArrowLeft className="w-4 h-4" />Previous</button>
          <div className="text-sm text-text-tertiary"><span className="font-semibold text-text-primary">{answeredCount}</span> / {totalCount} answered</div>
          {currentIndex === totalCount - 1 ? (
            <button onClick={() => setShowSubmitModal(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-radius-md text-sm font-semibold text-text-inverse bg-accent hover:bg-accent-hover transition-colors shadow-elevated">Submit<ArrowRight className="w-4 h-4" /></button>
          ) : (
            <button onClick={() => setCurrentIndex((p) => Math.min(totalCount - 1, p + 1))} className="flex items-center gap-2 px-4 py-2.5 rounded-radius-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-sunken transition-colors">Next<ArrowRight className="w-4 h-4" /></button>
          )}
        </div>
      </footer>

      <SubmitConfirmationModal isOpen={showSubmitModal} onConfirm={handleSubmit} onCancel={() => setShowSubmitModal(false)} answeredCount={answeredCount} totalCount={totalCount} />
    </div>
  );
}
