import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchQuestionsForAdmin,
  createQuestion,
  updateSetStatus,
  deleteQuestion,
} from '../services/adminService';
import { QuestionEditor } from '../features/admin/QuestionEditor';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import type { AdminQuestion } from '../types';

export function SetEditorScreen() {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);

  const loadQuestions = useCallback(async () => {
    if (!setId) return;
    setLoading(true);
    try {
      const data = await fetchQuestionsForAdmin(setId);
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [setId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSaveQuestion = async (questionData: Omit<AdminQuestion, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createQuestion(questionData);
      setEditingQuestion(null);
      loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  const handlePublish = async () => {
    if (!setId) return;
    if (questions.length < 25) {
      setError(`Cannot publish: ${questions.length}/25 questions. Add ${25 - questions.length} more.`);
      return;
    }

    setPublishing(true);
    try {
      await updateSetStatus(setId, 'published');
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteQuestion(questionId);
      loadQuestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const canPublish = questions.length >= 25;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur border-b border-dark-700">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">Edit Set</h1>
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{questions.length}/25 questions</span>
          <button
            onClick={handlePublish}
            disabled={!canPublish || publishing}
            className={`tap-min px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              canPublish
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-dark-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {publishing ? 'Publishing...' : canPublish ? 'Publish Set' : 'Need 25 questions'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="rounded-xl bg-dark-800 border border-dark-700 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400">Q{q.question_number}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingQuestion(q.question_number)}
                      className="text-xs text-primary-400 hover:text-primary-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-white truncate">{q.question_text}</p>
              </div>
            ))}

            {editingQuestion === null && questions.length < 25 && (
              <button
                onClick={() => setEditingQuestion(questions.length + 1)}
                className="w-full tap-min py-3 rounded-lg border-2 border-dashed border-dark-600 text-gray-400 hover:border-primary-500 hover:text-primary-400 transition-colors"
              >
                + Add Question {questions.length + 1}
              </button>
            )}

            {editingQuestion !== null && (
              <QuestionEditor
                setId={setId || ''}
                questionNumber={editingQuestion}
                question={questions.find((q) => q.question_number === editingQuestion)}
                onSave={handleSaveQuestion}
                onCancel={() => setEditingQuestion(null)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
