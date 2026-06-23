import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSet } from '../services/adminService';
import type { JLPTLevel } from '../types';

export function SetCreatorScreen() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState<JLPTLevel>('N5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');
    try {
      const setId = await createSet(title.trim(), level);
      navigate(`/admin/sets/${setId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create set');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-lg mx-auto px-4 py-3">
          <h1 className="text-lg font-bold">Create New Set</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., JLPT N5 Vocabulary Set 1"
              required
              className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as JLPTLevel)}
              className="w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-600 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Set'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
