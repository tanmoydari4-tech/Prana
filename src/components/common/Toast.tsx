import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const bgColors = {
          success: 'bg-[#153D32] text-[#F8F6F0] border border-[#A8BDA5]/40',
          error: 'bg-rose-900 text-rose-50 border border-rose-700/50',
          info: 'bg-[#252A27] text-[#F8F6F0] border border-stone-600',
        };

        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#A8BDA5] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />,
          info: <Info className="w-5 h-5 text-sky-300 shrink-0" />,
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-xl transition-all transform animate-in slide-in-from-bottom-2 ${bgColors[toast.type]}`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
