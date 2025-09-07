import { useState, useCallback, useRef } from 'react';
import type { AsyncState, ApiErrorState } from '@/types/api';

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiErrorState) => void;
  onFinally?: () => void;
  retryCount?: number;
  retryDelay?: number;
}

interface UseAsyncOperationReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiErrorState | null;
  execute: (...args: any[]) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
}

export function useAsyncOperation<T = any>(
  asyncFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
): UseAsyncOperationReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const retryCountRef = useRef(0);
  const lastArgsRef = useRef<any[]>([]);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      lastArgsRef.current = args;
      retryCountRef.current = 0;

      const result = await asyncFunction(...args);
      
      setState({
        data: result,
        loading: false,
        error: null,
      });

      options.onSuccess?.(result);
      return result;
    } catch (error: any) {
      const errorState: ApiErrorState = {
        message: error?.error_message || error?.message || 'An unexpected error occurred',
        code: error?.code || error?.status?.toString(),
        status: error?.status || 500,
        retryable: isRetryableError(error),
      };

      setState({
        data: null,
        loading: false,
        error: errorState,
      });

      options.onError?.(errorState);
      return null;
    } finally {
      options.onFinally?.();
    }
  }, [asyncFunction, options]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (retryCountRef.current >= (options.retryCount || 3)) {
      return null;
    }

    retryCountRef.current++;
    
    if (options.retryDelay) {
      await new Promise(resolve => setTimeout(resolve, options.retryDelay));
    }

    return execute(...lastArgsRef.current);
  }, [execute, options.retryCount, options.retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
    retryCountRef.current = 0;
    lastArgsRef.current = [];
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    retry,
    reset,
  };
}

function isRetryableError(error: any): boolean {
  if (!error?.status) return true;
  
  // 5xx server errors are retryable
  if (error.status >= 500) return true;
  
  // 429 (rate limit) is retryable
  if (error.status === 429) return true;
  
  // 408 (timeout) is retryable
  if (error.status === 408) return true;
  
  // 4xx client errors are usually not retryable
  return false;
}

// Hook for API calls with automatic loading states
export function useApiCall<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  return useAsyncOperation(apiFunction, options);
}

// Hook for form submissions
export function useFormSubmission<T = any>(
  submitFunction: (data: T) => Promise<any>,
  options: UseAsyncOperationOptions = {}
) {
  const { execute, ...rest } = useAsyncOperation(submitFunction, options);

  const submit = useCallback(async (data: T) => {
    return execute(data);
  }, [execute]);

  return {
    ...rest,
    submit,
  };
}

// Hook for data fetching
export function useDataFetch<T = any>(
  fetchFunction: (...args: any[]) => Promise<T>,
  options: UseAsyncOperationOptions = {}
) {
  const { execute, ...rest } = useAsyncOperation(fetchFunction, options);

  const fetch = useCallback(async (...args: any[]) => {
    return execute(...args);
  }, [execute]);

  return {
    ...rest,
    fetch,
  };
}

export default useAsyncOperation;
