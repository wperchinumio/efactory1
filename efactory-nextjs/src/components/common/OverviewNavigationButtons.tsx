import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface OverviewNavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalItems?: number;
  className?: string;
}

/**
 * Shared navigation buttons component for all overview pages
 * Provides consistent Previous/Next navigation UI
 */
export default function OverviewNavigationButtons({
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  currentIndex,
  totalItems,
  className = ''
}: OverviewNavigationButtonsProps) {
  // Don't render if no navigation callbacks provided
  if (!onPrevious && !onNext) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous button */}
      <button
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="btn btn-sm btn-outline-secondary flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Previous"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Current position indicator */}
      {currentIndex !== undefined && totalItems !== undefined && totalItems > 0 && (
        <span className="text-sm text-font-color-100 px-2">
          {currentIndex + 1} of {totalItems}
        </span>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!hasNext}
        className="btn btn-sm btn-outline-secondary flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Next"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Hook to provide navigation button props from navigation context
 */
export function useOverviewNavigationButtonProps(
  navigationContext: any,
  onPrevious?: () => void,
  onNext?: () => void
) {
  if (!navigationContext || !navigationContext.hasNavigation()) {
    return null;
  }

  return {
    onPrevious: onPrevious || navigationContext.navigateToPrevious,
    onNext: onNext || navigationContext.navigateToNext,
    hasPrevious: navigationContext.canNavigatePrevious(),
    hasNext: navigationContext.canNavigateNext(),
    currentIndex: navigationContext.getCurrentIndex(),
    totalItems: navigationContext.getTotalCount()
  };
}
