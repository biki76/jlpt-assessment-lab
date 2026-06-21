import { useState } from 'react';
import type { AdminQuestion, Section } from '../../types';

interface QuestionEditorProps {
  question?: Partial<AdminQuestion>;
  setId: string;
  questionNumber: number;
  onSave: (question: Omit<AdminQuestion, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const SECTIONS: Section[] = ['Vocabulary', 'Grammar', 'Reading'];

export function QuestionEditor({ question, setId, questionNumber, onSave, onCancel }: QuestionEditorProps) {
  const [formData, setFormData] = useState({
    question_text: question?.question_text || '',
    japanese_text: question?.japanese_text || '',
    options: question?.options || [
      { id: 'opt_a', text: '' },
      { id: 'opt_b', text: '' },
      { id: 'opt_c', text: '' },
      { id: 'opt_d', text: '' },
    ],
    correct_answer_id: question?.correct_answer_id || 'opt_a',
    explanation: question?.explanation || '',
    section: question?.section || 'Vocabulary' as Section,
    difficulty: question?.difficulty || 1,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!formData.question_text.trim()) errs.push('Question text is required');
    if (formData.options.some((o) => !o.text.trim())) errs.push('All options must have text');
    if (!formData.explanation.trim()) errs.push('Explanation is required');
    if (formData.explanation.trim().length < 10) errs.push('Explanation must be at least 10 characters');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      set_id: setId,
      question_number: questionNumber,
      question_text: formData.question_text.trim(),
      japanese_text: formData.japanese_text.trim() || undefined,
      options: formData.options,
      correct_answer_id: formData.correct_answer_id,
      explanation: formData.explanation.trim(),
      section: formData.section,
      difficulty: formData.difficulty as 1 | 2 | 3,
    });
  };

  const updateOption = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], text };
    setFormData({ ...formData, options: newOptions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-dark-800 border border-dark-700 p-4">
      <h3 className="text-sm font-semibold text-gray-300">Question {questionNumber}</h3>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Japanese Text (optional)</label>
        <input
          type="text"
          value={formData.japanese_text}
          onChange={(e) => setFormData({ ...formData, japanese_text: e.target.value })}
          className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white text-sm focus:outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Question Text *</label>
        <textarea
          value={formData.question_text}
          onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Section</label>
          <select
            value={formData.section}
            onChange={(e) => setFormData({ ...formData, section: e.target.value as Section })}
            className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white text-sm focus:outline-none focus:border-primary-500"
          >
            {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Difficulty</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: Number(e.target.value) as 1 | 2 | 3 })}
            className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white text-sm focus:outline-none focus:border-primary-500"
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-gray-400">Options *</label>
        {formData.options.map((opt, i) => (
          <div key={opt.id} className="flex items-center gap-2">
            <input
              type="radio"
              name="correct_answer"
              checked={formData.correct_answer_id === opt.id}
              onChange={() => setFormData({ ...formData, correct_answer_id: opt.id })}
              className="w-4 h-4 accent-primary-500"
            />
            <input
              type="text"
              value={opt.text}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="flex-1 px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">Explanation * (min 10 chars)</label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-dark-700 border border-dark-600 text-white text-sm focus:outline-none focus:border-primary-500 resize-none"
        />
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-400">• {err}</p>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 tap-min px-3 py-2 rounded-lg text-xs font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 tap-min px-3 py-2 rounded-lg text-xs font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
        >
          Save Question
        </button>
      </div>
    </form>
  );
}
