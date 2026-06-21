interface SubmitConfirmationModalProps {
  answeredCount: number;
  totalQuestions: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SubmitConfirmationModal({
  answeredCount,
  totalQuestions,
  onConfirm,
  onCancel,
}: SubmitConfirmationModalProps) {
  const unanswered = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl bg-dark-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-2">Submit Exam?</h2>
        <p className="text-sm text-gray-300 mb-4">
          You have answered <span className="font-bold text-white">{answeredCount}</span> of{' '}
          <span className="font-bold text-white">{totalQuestions}</span> questions.
          {unanswered > 0 && (
            <span>
              {' '}
              <span className="font-bold text-warning">{unanswered}</span> questions unanswered.
            </span>
          )}
          <br />
          <span className="text-gray-400">Unanswered questions will be marked incorrect.</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            Continue Exam
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
