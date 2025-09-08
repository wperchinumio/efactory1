import React, { Component, ErrorInfo, ReactNode } from 'react';
import { performLogout } from '@/lib/auth/guards';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if this is an auth-related error
    const isAuthError = 
      error.message.includes('hooks') ||
      error.message.includes('authentication') ||
      error.message.includes('session') ||
      error.message.includes('token');

    return { 
      hasError: true, 
      error: isAuthError ? error : undefined 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Auth Error Boundary caught an error:', error, errorInfo);
    
    // If it's an auth-related error, clear auth data and redirect
    const isAuthError = 
      error.message.includes('hooks') ||
      error.message.includes('authentication') ||
      error.message.includes('session') ||
      error.message.includes('token') ||
      error.stack?.includes('SidebarMenu') ||
      error.stack?.includes('useRef') ||
      error.stack?.includes('useEffect');

    if (isAuthError) {
      console.warn('Authentication error detected, performing logout...');
      // Small delay to allow error logging
      setTimeout(() => {
        performLogout();
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // If custom fallback provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-body-color flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6 bg-card-color rounded-lg border border-border-color">
            <div className="mb-4">
              <svg 
                className="mx-auto h-12 w-12 text-danger" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-font-color mb-2">
              Session Error
            </h1>
            <p className="text-font-color-100 mb-4">
              There was an issue with your session. You will be redirected to the login page.
            </p>
            <button
              onClick={() => performLogout()}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

