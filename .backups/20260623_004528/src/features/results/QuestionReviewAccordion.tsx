import { useState } from 'react';
import type { QuestionResult, Question } from '../../types';

interface QuestionReviewAccordionProps {
  results: QuestionResult[];
  questions: Question[];
}

export function QuestionReviewAccordion({ results, questions }: QuestionReviewAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const getQuestion = (questionId: string) => questions.find((q) => q.id === questionId);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-300 px-1">Question Review</h3>
      {results.map((result, index) => {
        const question = getQuestion(result.question_id);
        if (!question) return null;

        const isOpen = openIndex === index;

        return (
          <div
            key={result.question_id}
            className={`rounded-xl border transition-colors ${
              isOpen ? 'border-dark-600 bg-dark-800' : 'border-dark-700 bg-dark-800/50'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full px-4 py-3 flex items-center gap-3 tap-min text-left"
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                result.is_correct ? 'bg-success text-white' : 'bg-error text-white'
              }`}>
                {result.is_correct ? '✓' : '✗'}
              </span>
              <span className="flex-1 text-sm text-white truncate">
                Q{result.question_number}: {question.question_text}
              </span>
              <span className={`text-xs ${isOpen ? 'text-primary-400' : 'text-gray-500'}`}>
                {isOpen ? '▲' : '▼'}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 space-y-3">
                {question.japanese_text && (
                  <p className="text-base font-serif text-white" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {question.japanese_text}
                  </p>
                )}
                <p className="text-sm text-gray-300">{question.question_text}</p>

                <div className="space-y-2">
                  {question.options.map((opt) => {
                    const isCorrect = opt.id === result.correct_option_id;
                    const isSelected = opt.id === result.selected_option_id;
                    const isWrong = isSelected && !isCorrect;

                    return (
                      <div
                        key={opt.id}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isWrong
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-dark-700 text-gray-400'
                        }`}
                      >
                        <span className="font-bold mr-2">{opt.id.replace('opt_', '').toUpperCase()}.</span>
                        {opt.text}
                        {isCorrect && <span className="ml-2 text-xs">✓ Correct</span>}
                        {isWrong && <span className="ml-2 text-xs">✗ Your answer</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-dark-700">
                  <p className="text-xs text-gray-400 font-semibold mb-1">Explanation:</p>
                  <p className="text-sm text-gray-300" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                    {result.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
