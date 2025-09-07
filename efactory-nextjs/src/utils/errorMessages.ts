// Centralized error message system
// Provides consistent, user-friendly error messages throughout the application

import type { ApiErrorState } from '@/types/api';

export interface ErrorMessageConfig {
  title: string;
  description: string;
  action?: string;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Error message mappings
const ERROR_MESSAGES: Record<string, ErrorMessageConfig> = {
  // Authentication errors
  'AUTH_001': {
    title: 'Authentication Required',
    description: 'Please sign in to continue.',
    action: 'Sign In',
    retryable: false,
    severity: 'high',
  },
  'AUTH_002': {
    title: 'Session Expired',
    description: 'Your session has expired. Please sign in again.',
    action: 'Sign In',
    retryable: false,
    severity: 'high',
  },
  'AUTH_003': {
    title: 'Invalid Credentials',
    description: 'The username or password you entered is incorrect.',
    action: 'Try Again',
    retryable: true,
    severity: 'medium',
  },
  'AUTH_004': {
    title: 'Account Locked',
    description: 'Your account has been locked due to multiple failed login attempts.',
    action: 'Contact Support',
    retryable: false,
    severity: 'critical',
  },

  // Authorization errors
  'AUTHZ_001': {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
    action: 'Go Back',
    retryable: false,
    severity: 'high',
  },
  'AUTHZ_002': {
    title: 'Insufficient Permissions',
    description: 'You need additional permissions to perform this action.',
    action: 'Contact Administrator',
    retryable: false,
    severity: 'medium',
  },

  // Network errors
  'NET_001': {
    title: 'Connection Error',
    description: 'Unable to connect to the server. Please check your internet connection.',
    action: 'Retry',
    retryable: true,
    severity: 'medium',
  },
  'NET_002': {
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
    action: 'Retry',
    retryable: true,
    severity: 'low',
  },
  'NET_003': {
    title: 'Server Unavailable',
    description: 'The server is temporarily unavailable. Please try again later.',
    action: 'Retry',
    retryable: true,
    severity: 'high',
  },

  // Validation errors
  'VAL_001': {
    title: 'Invalid Input',
    description: 'Please check your input and try again.',
    action: 'Fix Input',
    retryable: true,
    severity: 'low',
  },
  'VAL_002': {
    title: 'Required Field Missing',
    description: 'Please fill in all required fields.',
    action: 'Complete Form',
    retryable: true,
    severity: 'low',
  },
  'VAL_003': {
    title: 'Invalid Format',
    description: 'The format of your input is not valid.',
    action: 'Fix Format',
    retryable: true,
    severity: 'low',
  },

  // Data errors
  'DATA_001': {
    title: 'Data Not Found',
    description: 'The requested data could not be found.',
    action: 'Refresh',
    retryable: true,
    severity: 'medium',
  },
  'DATA_002': {
    title: 'Data Conflict',
    description: 'The data has been modified by another user. Please refresh and try again.',
    action: 'Refresh',
    retryable: true,
    severity: 'medium',
  },
  'DATA_003': {
    title: 'Data Validation Failed',
    description: 'The data does not meet the required criteria.',
    action: 'Fix Data',
    retryable: true,
    severity: 'low',
  },

  // System errors
  'SYS_001': {
    title: 'Internal Server Error',
    description: 'An unexpected error occurred. Please try again later.',
    action: 'Retry',
    retryable: true,
    severity: 'high',
  },
  'SYS_002': {
    title: 'Service Unavailable',
    description: 'The service is temporarily unavailable. Please try again later.',
    action: 'Retry',
    retryable: true,
    severity: 'high',
  },
  'SYS_003': {
    title: 'Rate Limit Exceeded',
    description: 'Too many requests. Please wait a moment before trying again.',
    action: 'Wait and Retry',
    retryable: true,
    severity: 'medium',
  },
};

// HTTP status code mappings
const HTTP_STATUS_MESSAGES: Record<number, ErrorMessageConfig> = {
  400: {
    title: 'Bad Request',
    description: 'The request was invalid. Please check your input.',
    action: 'Fix Request',
    retryable: true,
    severity: 'low',
  },
  401: {
    title: 'Authentication Required',
    description: 'Please sign in to continue.',
    action: 'Sign In',
    retryable: false,
    severity: 'high',
  },
  403: {
    title: 'Access Denied',
    description: 'You do not have permission to access this resource.',
    action: 'Go Back',
    retryable: false,
    severity: 'high',
  },
  404: {
    title: 'Not Found',
    description: 'The requested resource was not found.',
    action: 'Go Back',
    retryable: false,
    severity: 'medium',
  },
  408: {
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
    action: 'Retry',
    retryable: true,
    severity: 'low',
  },
  409: {
    title: 'Conflict',
    description: 'The request conflicts with the current state of the resource.',
    action: 'Refresh and Retry',
    retryable: true,
    severity: 'medium',
  },
  429: {
    title: 'Rate Limit Exceeded',
    description: 'Too many requests. Please wait a moment before trying again.',
    action: 'Wait and Retry',
    retryable: true,
    severity: 'medium',
  },
  500: {
    title: 'Internal Server Error',
    description: 'An unexpected error occurred. Please try again later.',
    action: 'Retry',
    retryable: true,
    severity: 'high',
  },
  502: {
    title: 'Bad Gateway',
    description: 'The server received an invalid response. Please try again later.',
    action: 'Retry',
    retryable: true,
    severity: 'high',
  },
  503: {
    title: 'Service Unavailable',
    description: 'The service is temporarily unavailable. Please try again later.',
    action: 'Retry',
    retryable: true,
    severity: 'high',
  },
  504: {
    title: 'Gateway Timeout',
    description: 'The server took too long to respond. Please try again.',
    action: 'Retry',
    retryable: true,
    severity: 'medium',
  },
};

/**
 * Get error message configuration for a specific error
 */
export function getErrorMessage(error: ApiErrorState | any): ErrorMessageConfig {
  // Check for specific error code first
  if (error?.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code]!;
  }

  // Check for HTTP status code
  if (error?.status && HTTP_STATUS_MESSAGES[error.status]) {
    return HTTP_STATUS_MESSAGES[error.status]!;
  }

  // Check for common error patterns
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return ERROR_MESSAGES['NET_001']!;
    }
    
    if (message.includes('timeout')) {
      return ERROR_MESSAGES['NET_002']!;
    }
    
    if (message.includes('unauthorized') || message.includes('authentication')) {
      return ERROR_MESSAGES['AUTH_001']!;
    }
    
    if (message.includes('forbidden') || message.includes('permission')) {
      return ERROR_MESSAGES['AUTHZ_001']!;
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return ERROR_MESSAGES['DATA_001']!;
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return ERROR_MESSAGES['VAL_001']!;
    }
  }

  // Default error message
  return {
    title: 'An Error Occurred',
    description: error?.message || 'Something went wrong. Please try again.',
    action: 'Retry',
    retryable: true,
    severity: 'medium',
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: ApiErrorState | any): string {
  const config = getErrorMessage(error);
  return config.description;
}

/**
 * Check if error is retryable
 */
export function isErrorRetryable(error: ApiErrorState | any): boolean {
  const config = getErrorMessage(error);
  return config.retryable;
}

/**
 * Get error severity
 */
export function getErrorSeverity(error: ApiErrorState | any): 'low' | 'medium' | 'high' | 'critical' {
  const config = getErrorMessage(error);
  return config.severity;
}

/**
 * Get error action text
 */
export function getErrorAction(error: ApiErrorState | any): string {
  const config = getErrorMessage(error);
  return config.action || 'Retry';
}

/**
 * Format error for display
 */
export function formatErrorForDisplay(error: ApiErrorState | any): {
  title: string;
  description: string;
  action: string;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  const config = getErrorMessage(error);
  return {
    title: config.title,
    description: config.description,
    action: config.action || 'Retry',
    retryable: config.retryable,
    severity: config.severity,
  };
}
