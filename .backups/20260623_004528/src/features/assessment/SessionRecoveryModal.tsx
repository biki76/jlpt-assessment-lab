import type { ExamSession } from '../../types';

interface SessionRecoveryModalProps {
  session: ExamSession;
  onResume: () => void;
  onStartNew: () => void;
}

export function SessionRecoveryModal({ session, onResume, onStartNew }: SessionRecoveryModalProps) {
  const answeredCount = Object.keys(session.answers).length;
  const currentQuestion = session.current_question_index + 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl bg-dark-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-2">Unfinished Session</h2>
        <p className="text-sm text-gray-300 mb-4">
          You left off at <span className="font-bold text-white">Question {currentQuestion}</span> of 25.
          <br />
          <span className="font-bold text-white">{answeredCount}</span> questions answered.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onStartNew}
            className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium text-gray-300 bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            Start New
          </button>
          <button
            onClick={onResume}
            className="flex-1 tap-min px-4 py-3 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
          >
            Resume
          </button>
        </div>
      </div>
    </div>
  );
}
