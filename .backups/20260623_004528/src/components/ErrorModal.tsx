interface ErrorModalProps {
  title: string;
  body: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function ErrorModal({ title, body, primaryAction, secondaryAction }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-xl bg-dark-800 p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
        <p className="text-sm text-gray-300 mb-6">{body}</p>
        <div className="flex gap-3 justify-end">
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="tap-min px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-700 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="tap-min px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-500 transition-colors"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
