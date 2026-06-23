import { Modal } from '../../components/Modal';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface Props { isOpen: boolean; onConfirm: () => void; onCancel: () => void; answeredCount: number; totalCount: number; }

export function SubmitConfirmationModal({ isOpen, onConfirm, onCancel, answeredCount, totalCount }: Props) {
  const unanswered = totalCount - answeredCount;
  const allAnswered = unanswered === 0;
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={allAnswered ? 'Ready to Submit?' : 'Questions Remaining'}
      description={allAnswered ? `You've answered all ${totalCount} questions. Submit now?` : `You have ${unanswered} unanswered question${unanswered !== 1 ? 's' : ''} out of ${totalCount}.`}
      maxWidth="sm" preventBackdropClose>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 p-3 rounded-radius-md ${allAnswered ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'}`}>
          {allAnswered ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium">{allAnswered ? 'All questions answered — good to go!' : `${unanswered} question${unanswered !== 1 ? 's' : ''} skipped`}</span>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-radius-md text-sm font-medium text-text-secondary bg-bg-sunken hover:bg-border transition-colors">Keep Working</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-radius-md text-sm font-semibold text-text-inverse transition-colors ${allAnswered ? 'bg-success hover:opacity-90' : 'bg-accent hover:bg-accent-hover'}`}>{allAnswered ? 'Submit Exam' : 'Submit Anyway'}</button>
        </div>
      </div>
    </Modal>
  );
}
