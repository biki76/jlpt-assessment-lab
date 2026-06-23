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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-primary-600/15 text-primary-400 text-xs font-bold uppercase tracking-wider">
            {question.section}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Difficulty {question.difficulty}
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-500 tabular-nums">
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      {question.japanese_text && (
        <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-5">
          <p 
            className="text-xl font-serif text-white leading-relaxed tracking-tight"
            style={{ fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif" }}
          >
            {question.japanese_text}
          </p>
        </div>
      )}

      {question.question_text && (
        <p className="text-base text-gray-300 font-medium leading-relaxed">
          {question.question_text}
        </p>
      )}

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const letter = String.fromCharCode(65 + idx);

          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left rounded-2xl border-2 p-4 tap-min transition-all duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                  : 'border-dark-700 bg-dark-800 hover:border-dark-600 hover:bg-dark-750'
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                      : 'bg-dark-900 text-gray-400 border border-dark-600'
                  }`}
                >
                  {letter}
                </span>
                <span
                  className={`text-base font-medium leading-relaxed pt-1.5 ${
                    isSelected ? 'text-white' : 'text-gray-300'
                  }`}
                >
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
