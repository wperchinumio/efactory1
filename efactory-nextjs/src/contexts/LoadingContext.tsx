import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingState {
  isChangingUser: boolean;
  loadingMessage?: string;
}

interface LoadingContextType {
  loadingStates: LoadingState;
  setLoadingStates: (states: Partial<LoadingState>) => void;
  setChangingUser: (isChanging: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    isChangingUser: false,
  });

  const updateLoadingStates = (states: Partial<LoadingState>) => {
    setLoadingStates(prev => ({ ...prev, ...states }));
  };

  const setChangingUser = (isChanging: boolean, message?: string) => {
    setLoadingStates(prev => ({
      ...prev,
      isChangingUser: isChanging,
      ...(message && { loadingMessage: message })
    }));
  };

  return (
    <LoadingContext.Provider value={{
      loadingStates,
      setLoadingStates: updateLoadingStates,
      setChangingUser
    }}>
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