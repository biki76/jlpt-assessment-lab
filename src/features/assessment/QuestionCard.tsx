import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">
          {question.section} • Difficulty {question.difficulty}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Japanese text */}
      {question.japanese_text && (
        <p className="text-lg font-serif text-white leading-relaxed" style={{ fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif" }}>
          {question.japanese_text}
        </p>
      )}

      {/* Question text */}
      <p className="text-base text-gray-200 leading-relaxed">
        {question.question_text}
      </p>

      {/* Options */}
      <div className="space-y-3 mt-6">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left rounded-xl border p-4 tap-min transition-all active:scale-[0.98] ${
                isSelected
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-gray-500 text-gray-400'
                }`}>
                  {option.id.replace('opt_', '').toUpperCase()}
                </span>
                <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
