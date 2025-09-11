import React, { useEffect, useState } from 'react';
import { useToast, ToastProps } from './use-toast';

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  useEffect(() => {
    const unsubscribe = (newToasts: ToastProps[]) => {
      setToasts(newToasts);
    };

    // Simple subscription mechanism
    const interval = setInterval(() => {
      // This is a simple implementation - in a real app you'd use a proper state management
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-lg border max-w-sm ${
            toast.variant === 'destructive'
              ? 'bg-danger text-white border-danger'
              : 'bg-card-color text-font-color border-border-color'
          }`}
        >
          <div className="font-medium">{toast.title}</div>
          {toast.description && (
            <div className="text-sm mt-1 opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export { ToastContainer };
