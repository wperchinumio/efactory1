import React, { createContext, useContext, useState, useCallback } from 'react';
import type { LoadingState } from '@/types/api';

interface LoadingContextType {
  loadingStates: Record<string, LoadingState>;
  setLoading: (key: string, loading: boolean, message?: string) => void;
  isLoading: (key: string) => boolean;
  getLoadingMessage: (key: string) => string | undefined;
  clearLoading: (key: string) => void;
  clearAllLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, LoadingState>>({});

  const setLoading = useCallback((key: string, loading: boolean, message?: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: loading,
        ...(message && { loadingMessage: message }),
      },
    }));
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key]?.isLoading || false;
  }, [loadingStates]);

  const getLoadingMessage = useCallback((key: string) => {
    return loadingStates[key]?.loadingMessage;
  }, [loadingStates]);

  const clearLoading = useCallback((key: string) => {
    setLoadingStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });
  }, []);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const value: LoadingContextType = {
    loadingStates,
    setLoading,
    isLoading,
    getLoadingMessage,
    clearLoading,
    clearAllLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

// Hook for specific loading key
export function useLoadingState(key: string) {
  const { isLoading, getLoadingMessage, setLoading, clearLoading } = useLoading();

  return {
    isLoading: isLoading(key),
    loadingMessage: getLoadingMessage(key),
    setLoading: (loading: boolean, message?: string) => setLoading(key, loading, message),
    clearLoading: () => clearLoading(key),
  };
}

export default LoadingContext;
