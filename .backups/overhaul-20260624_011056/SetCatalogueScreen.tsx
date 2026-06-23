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
