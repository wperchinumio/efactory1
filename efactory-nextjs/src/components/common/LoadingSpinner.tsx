import React from 'react';
import type { LoadingState } from '@/types/api';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  white: 'text-white',
  gray: 'text-gray-500',
};

export default function LoadingSpinner({
  size = 'md',
  color = 'primary',
  message,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {message && (
        <p className="mt-2 text-sm text-font-color-100">{message}</p>
      )}
    </div>
  );
}

// Skeleton loading components
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card-color rounded-xl border border-dashed border-border-color p-6 animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-card-color rounded-xl border border-dashed border-border-color overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border-color">
        <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="divide-y divide-border-color">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded w-1/6 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-1/5 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-card-color rounded-xl border border-dashed border-border-color p-6 ${className}`}>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-4 animate-pulse"></div>
      <div className="h-64 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  children,
  className = '',
}: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}

// Page loading component
interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ message = 'Loading page...', className = '' }: PageLoadingProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-body-color ${className}`}>
      <div className="text-center">
        <LoadingSpinner size="xl" message={message} />
      </div>
    </div>
  );
}

// Button loading state
interface ButtonLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function ButtonLoading({
  isLoading,
  loadingText = 'Loading...',
  children,
  className = '',
  disabled = false,
  onClick,
}: ButtonLoadingProps) {
  return (
    <button
      className={`btn btn-primary ${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" color="white" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
