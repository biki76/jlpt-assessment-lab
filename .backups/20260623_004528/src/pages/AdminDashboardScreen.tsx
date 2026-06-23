import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllSets } from '../services/adminService';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { QuestionSet } from '../types';

export function AdminDashboardScreen() {
  const navigate = useNavigate();
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllSets();
      setSets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSets();
  }, [loadSets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-500/20 text-emerald-400';
      case 'draft': return 'bg-amber-500/20 text-amber-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to App
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <button
          onClick={() => navigate('/admin/sets/new')}
          className="w-full tap-min px-4 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors"
        >
          + New Set
        </button>

        {loading && <LoadingSkeleton />}

        {!loading && error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={loadSets}
              className="tap-min px-4 py-2 rounded-lg bg-dark-700 text-white hover:bg-dark-600"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && sets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No sets created yet.</p>
          </div>
        )}

        {!loading && !error && sets.length > 0 && (
          <div className="space-y-3">
            {sets.map((set) => (
              <div
                key={set.id}
                className="rounded-xl bg-dark-800 border border-dark-700 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(set.status)}`}>
                    {set.status}
                  </span>
                  <span className="text-xs text-gray-500">{set.question_count}/25 questions</span>
                </div>
                <h3 className="font-semibold text-white mb-1">{set.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{set.level}</span>
                  <span>•</span>
                  <span>{new Date(set.updated_at).toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => navigate(`/admin/sets/${set.id}`)}
                  className="mt-3 w-full tap-min px-3 py-2 rounded-lg text-sm bg-dark-700 text-gray-300 hover:bg-dark-600 transition-colors"
                >
                  Edit Set
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
