import React from 'react';
import { useToast } from './use-toast';
import { IconX, IconCheck, IconAlertCircle } from '@tabler/icons-react';

const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToast();

  const getIcon = (variant?: string) => {
    switch (variant) {
      case 'success':
        return <IconCheck className="w-5 h-5 text-green-500" />;
      case 'destructive':
        return <IconAlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'destructive':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-card-color border-border-color text-font-color';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border max-w-sm flex items-start gap-3 ${getVariantClasses(toast.variant)}`}
        >
          {getIcon(toast.variant)}
          <div className="flex-1">
            <div className="font-medium">{toast.title}</div>
            {toast.description && (
              <div className="text-sm mt-1 opacity-90">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export { ToastContainer };
