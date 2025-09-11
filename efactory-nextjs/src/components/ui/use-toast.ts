import React from 'react';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface Toast extends ToastProps {
  id: string;
  timestamp: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  addToast(toast: ToastProps): string {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: Date.now(),
      duration: toast.duration || (toast.variant === 'destructive' ? 5000 : 3000)
    };

    this.toasts.push(newToast);
    this.notifyListeners();

    // Auto remove toast after duration
    setTimeout(() => {
      this.removeToast(id);
    }, newToast.duration);

    return id;
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notifyListeners();
  }

  clearAll(): void {
    this.toasts = [];
    this.notifyListeners();
  }

  subscribe(listener: (toasts: Toast[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

const toastManager = new ToastManager();

export const toast = (props: ToastProps): string => {
  return toastManager.addToast(props);
};

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  return {
    toast,
    toasts,
    dismiss: (id: string) => toastManager.removeToast(id),
    dismissAll: () => toastManager.clearAll()
  };
};
