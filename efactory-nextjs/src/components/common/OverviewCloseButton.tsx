import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface OverviewCloseButtonProps {
  onClose: () => void;
  className?: string;
  title?: string;
}

/**
 * Shared close button component for all overview pages
 * Provides consistent close button UI and behavior
 */
export default function OverviewCloseButton({
  onClose,
  className = '',
  title = 'Close and return to grid'
}: OverviewCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className={`btn btn-sm btn-outline-secondary flex items-center gap-1 hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors ${className}`}
      title={title}
    >
      <XMarkIcon className="w-4 h-4" />
      <span className="hidden sm:inline">Close</span>
    </button>
  );
}
