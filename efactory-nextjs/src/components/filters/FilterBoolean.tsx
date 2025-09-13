import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { BooleanFilterConfig } from '@/types/api/filters';

interface FilterBooleanProps {
  config: BooleanFilterConfig;
  value?: boolean | null;
  onChange: (value: boolean | null) => void;
  className?: string;
}

export default function FilterBoolean({ 
  config, 
  value, 
  onChange, 
  className = '' 
}: FilterBooleanProps) {
  const handleToggle = () => {
    if (value === true) {
      onChange(null); // Clear filter
    } else {
      onChange(true); // Set to true
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-sm font-medium
          border rounded-md shadow-sm transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${value === true 
            ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300' 
            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          }
        `}
        style={{ width: config.width || 'auto', minWidth: '120px' }}
      >
        <div className="flex items-center space-x-2">
          {config.iconClassName && (
            <i className={`${config.iconClassName} text-gray-400 dark:text-gray-500`} />
          )}
          <span className="truncate">{config.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          {value === true && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
            >
              <XMarkIcon className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </button>
          )}
          {value === true && (
            <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      </button>
    </div>
  );
}
