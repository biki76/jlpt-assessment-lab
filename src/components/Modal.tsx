import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
}

const maxWidthClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };

export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'md', showCloseButton = true, preventBackdropClose = false }: ModalProps) {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  useEffect(() => { const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !preventBackdropClose) onClose(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [onClose, preventBackdropClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={(e) => { if (e.target === e.currentTarget && !preventBackdropClose) onClose(); }} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-bg-overlay backdrop-blur-sm" />
      <div className={`relative w-full ${maxWidthClasses[maxWidth]} bg-bg-elevated rounded-radius-lg border border-border shadow-modal animate-scale-in overflow-hidden`}>
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex-1 min-w-0">
              {title && <h2 className="text-lg font-semibold text-text-primary leading-tight">{title}</h2>}
              {description && <p className="mt-1 text-sm text-text-secondary leading-relaxed">{description}</p>}
            </div>
            {showCloseButton && (
              <button onClick={onClose} className="ml-4 -mr-2 p-2 rounded-radius-md text-text-tertiary hover:text-text-primary hover:bg-bg-sunken transition-colors" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
