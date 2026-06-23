import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPublishedSets } from '../services/questionService';
import { useExamStore } from '../stores/examStore';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorModal } from '../components/ErrorModal';
import type { QuestionSet } from '../types';

type LevelFilter = 'all' | 'N5' | 'N4' | 'N3';

export function SetCatalogueScreen() {
  const navigate = useNavigate();
  const initSession = useExamStore((s) => s.initSession);
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<LevelFilter>('all');

  const loadSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const level = activeFilter === 'all' ? undefined : activeFilter;
      const data = await fetchPublishedSets(level);
      setSets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sets');
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  const handleSetSelect = (setId: string) => {
    initSession(setId);
    navigate(`/exam/${setId}`);
  };

  const filters: { key: LevelFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'N5', label: 'N5' },
    { key: 'N4', label: 'N4' },
    { key: 'N3', label: 'N3' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-tight">NihonSync Test Lab</h1>
          <span className="text-xs text-gray-400">JLPT Practice</span>
        </div>
      </header>

      {/* Level Filter */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`tap-min px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadSets}
              className="tap-min px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && sets.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-gray-400 text-lg">No practice sets available for this level yet.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon!</p>
          </div>
        )}

        {!loading && !error && sets.length > 0 && (
          <div className="space-y-3">
            {sets.map((set) => (
              <button
                key={set.id}
                onClick={() => handleSetSelect(set.id)}
                className="w-full text-left rounded-xl bg-dark-800 border border-dark-700 p-4 tap-min hover:border-primary-500/50 transition-colors active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    set.level === 'N5' ? 'bg-emerald-500/20 text-emerald-400' :
                    set.level === 'N4' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {set.level}
                  </span>
                  <span className="text-xs text-gray-500">{set.question_count} questions</span>
                </div>
                <h3 className="font-semibold text-white">{set.title}</h3>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Error Modal */}
      {error && !loading && (
        <ErrorModal
          title="Couldn't load sets"
          body={error}
          primaryAction={{ label: 'Retry', onClick: loadSets }}
          secondaryAction={{ label: 'Dismiss', onClick: () => setError(null) }}
        />
      )}
    </div>
  );
}
