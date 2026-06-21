import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'warning';
  duration?: number;
  onDismiss?: () => void;
}

export function Toast({ message, variant = 'success', duration = 3000, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!visible) return null;

  const variantStyles = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <div className={`fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm px-4 py-3 rounded-xl border ${variantStyles[variant]} shadow-lg`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
