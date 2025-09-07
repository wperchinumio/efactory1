import React from 'react';
import type { ApiErrorState } from '@/types/api';
import { formatErrorForDisplay } from '@/utils/errorMessages';

interface ErrorNotificationProps {
  error: ApiErrorState | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorNotification({ 
  error, 
  onRetry, 
  onDismiss,
  className = '' 
}: ErrorNotificationProps) {
  if (!error) return null;

  const errorConfig = formatErrorForDisplay(error);

  const getErrorIcon = () => {
    switch (errorConfig.severity) {
      case 'critical':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'high':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getErrorTitle = () => errorConfig.title;
  const getErrorDescription = () => errorConfig.description;

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <div className="text-red-400">
            {getErrorIcon()}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            {getErrorTitle()}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{getErrorDescription()}</p>
            {error.code && (
              <p className="mt-1 font-mono text-xs">
                Error Code: {error.code}
              </p>
            )}
          </div>
          <div className="mt-3 flex space-x-3">
            {errorConfig.retryable && onRetry && (
              <button
                onClick={onRetry}
                className="text-sm font-medium text-red-800 hover:text-red-700 underline"
              >
                {errorConfig.action}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm font-medium text-red-800 hover:text-red-700 underline"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
