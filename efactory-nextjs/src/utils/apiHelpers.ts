// Utility functions for API operations
// Extracted from components to improve reusability and maintainability

import { getJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import type { ApiResponse, LoadingState, AsyncState, ApiErrorState } from '@/types/api';

/**
 * Generic API call wrapper with loading and error handling
 */
export async function apiCall<T>(
  endpoint: string,
  options: {
    onLoading?: (loading: boolean) => void;
    onError?: (error: string) => void;
    onSuccess?: (data: T) => void;
  } = {}
): Promise<T | null> {
  try {
    options.onLoading?.(true);
    
    const response = await getJson<T>(endpoint);
    
    if (response.data) {
      options.onSuccess?.(response.data);
      return response.data;
    }
    
    return null;
  } catch (error: any) {
    const errorMessage = error?.error_message || error?.message || 'An error occurred';
    options.onError?.(errorMessage);
    return null;
  } finally {
    options.onLoading?.(false);
  }
}

/**
 * Load global API data with proper error handling
 */
export async function loadGlobalApiData(): Promise<any | null> {
  try {
    // Check if we already have global data
    const existingData = localStorage.getItem('globalApiData');
    if (existingData) {
      return JSON.parse(existingData);
    }

    // Load from API
    const response = await getJson('/api/global?admin=1');
    
    if (response?.data) {
      localStorage.setItem('globalApiData', JSON.stringify(response.data));
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load global API data:', error);
    return null;
  }
}

/**
 * Get user apps from auth token
 */
export function getUserApps(): number[] {
  const auth = getAuthToken();
  return auth?.user_data?.apps || [];
}

/**
 * Check if user is admin
 */
export function isUserAdmin(): boolean {
  const auth = getAuthToken();
  const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
  return roles.includes('ADM');
}

/**
 * Get user account information
 */
export function getUserAccount(): string | null {
  const auth = getAuthToken();
  return auth?.user_data?.account || null;
}

/**
 * Check if user has access to specific app
 */
export function hasAppAccess(appId: number): boolean {
  const userApps = getUserApps();
  return userApps.includes(appId);
}

/**
 * Retry API call with exponential backoff
 */
export async function retryApiCall<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Debounce API calls
 */
export function debounceApiCall<T extends any[]>(
  func: (...args: T) => Promise<any>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: T) => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

/**
 * Create async state manager
 */
export function createAsyncState<T>(): {
  state: AsyncState<T>;
  setLoading: (loading: boolean) => void;
  setData: (data: T | null) => void;
  setError: (error: ApiErrorState | null) => void;
  reset: () => void;
} {
  let state: AsyncState<T> = {
    data: null,
    loading: false,
    error: null,
  };

  const setLoading = (loading: boolean) => {
    state = { ...state, loading };
  };

  const setData = (data: T | null) => {
    state = { ...state, data, error: null };
  };

  const setError = (error: ApiErrorState | null) => {
    state = { ...state, error, loading: false };
  };

  const reset = () => {
    state = { data: null, loading: false, error: null };
  };

  return {
    state,
    setLoading,
    setData,
    setError,
    reset,
  };
}

/**
 * Validate API response
 */
export function validateApiResponse<T>(response: any): response is ApiResponse<T> {
  return (
    response &&
    typeof response === 'object' &&
    'data' in response
  );
}

/**
 * Extract error message from API response
 */
export function extractErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.error_message) {
    return error.error_message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
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
