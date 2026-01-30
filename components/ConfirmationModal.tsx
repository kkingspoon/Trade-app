
import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from './Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmVariant: 'warning' | 'danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmVariant,
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    warning: {
      iconColor: 'text-yellow-400',
      buttonBg: 'bg-yellow-500 hover:bg-yellow-600',
      buttonText: 'text-black',
    },
    danger: {
      iconColor: 'text-red-400',
      buttonBg: 'bg-red-600 hover:bg-red-700',
      buttonText: 'text-white',
    },
  };

  const styles = variantStyles[confirmVariant];

  return (
    <div className="fixed inset-0 bg-black/80 z-[120] flex justify-center items-center backdrop-blur-md p-4">
      <div className="bg-slate-900 rounded-[2rem] border border-slate-700 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6 text-center">
          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 ${styles.iconColor}`}>
            <ExclamationTriangleIcon className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-xl font-black font-space-grotesk text-white">{title}</h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">{message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest border border-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`w-full font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-widest ${styles.buttonBg} ${styles.buttonText}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
