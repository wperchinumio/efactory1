import { useState, useCallback } from 'react';
import type { ApiErrorState } from '@/types/api';
import { formatErrorForDisplay } from '@/utils/errorMessages';

interface UseApiErrorReturn {
  error: ApiErrorState | null;
  setError: (error: ApiErrorState | null) => void;
  clearError: () => void;
  handleApiError: (error: any) => void;
  isRetryable: boolean;
  retry: () => void;
}

export function useApiError(): UseApiErrorReturn {
  const [error, setError] = useState<ApiErrorState | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: any) => {
    console.error('API Error:', err);
    
    // Use the centralized error message system
    const errorConfig = formatErrorForDisplay(err);
    
    const errorState: ApiErrorState = {
      message: errorConfig.description,
      code: err?.code || err?.status?.toString(),
      status: err?.status || 500,
      retryable: errorConfig.retryable,
    };

    setError(errorState);
  }, []);

  const isRetryableError = (err: any): boolean => {
    // Network errors are usually retryable
    if (!err?.status) return true;
    
    // 5xx server errors are retryable
    if (err.status >= 500) return true;
    
    // 429 (rate limit) is retryable
    if (err.status === 429) return true;
    
    // 408 (timeout) is retryable
    if (err.status === 408) return true;
    
    // 4xx client errors are usually not retryable
    return false;
  };

  const retry = useCallback(() => {
    if (error?.retryable) {
      clearError();
      // The parent component should handle the actual retry logic
    }
  }, [error?.retryable, clearError]);

  return {
    error,
    setError,
    clearError,
    handleApiError,
    isRetryable: error?.retryable || false,
    retry,
  };
}

// Hook for handling async operations with error states
export function useAsyncOperation<T, P extends any[]>(
  operation: (...args: P) => Promise<T>
) {
  const { error, handleApiError, clearError } = useApiError();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: P) => {
    try {
      setLoading(true);
      clearError();
      const result = await operation(...args);
      setData(result);
      return result;
    } catch (err) {
      handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [operation, handleApiError, clearError]);

  return {
    data,
    loading,
    error,
    execute,
    clearError,
  };
}

export default useApiError;
