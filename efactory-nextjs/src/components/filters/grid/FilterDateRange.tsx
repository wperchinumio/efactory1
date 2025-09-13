import React, { useState } from 'react';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { DateRangeFilterConfig } from '@/types/api/filters';

interface FilterDateRangeProps {
  config: DateRangeFilterConfig;
  value?: { start: string; end: string } | null;
  onChange: (value: { start: string; end: string } | null) => void;
  className?: string;
}

export default function FilterDateRange({ 
  config, 
  value, 
  onChange, 
  className = '' 
}: FilterDateRangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(value?.start || '');
  const [tempEnd, setTempEnd] = useState(value?.end || '');

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange({ start: tempStart, end: tempEnd });
    } else if (tempStart || tempEnd) {
      // If only one date is provided, use it for both start and end
      const date = tempStart || tempEnd;
      onChange({ start: date, end: date });
    } else {
      onChange(null);
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempStart('');
    setTempEnd('');
    onChange(null);
    setIsOpen(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const displayValue = value 
    ? `${formatDate(value.start)} - ${formatDate(value.end)}`
    : 'Any';

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-2 py-1.5 text-xs font-normal
          bg-card-color border border-border-color
          rounded-md shadow-sm hover:bg-primary-10
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${value ? 'text-red-600 dark:text-red-400 border-red-500' : 'text-gray-500 dark:text-gray-400'}
        `}
        style={{ width: config.width || 'auto', minWidth: '180px' }}
      >
        <div className="flex items-center space-x-2">
          {config.iconClassName && (
            <i className={`${config.iconClassName} text-gray-400 dark:text-gray-500`} />
          )}
          <CalendarIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{displayValue}</span>
        </div>
        <div className="flex items-center space-x-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-primary-10 rounded-full transition-colors"
            >
              <XMarkIcon className="h-2.5 w-2.5 text-gray-400" />
            </button>
          )}
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Date Range Picker */}
          <div className="absolute z-20 mt-1 w-80 bg-card-color border border-border-color rounded-md shadow-lg p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-font-color mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={tempStart}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-card-color text-font-color"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-font-color mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-card-color text-font-color"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-font-color bg-primary-10 hover:bg-primary-20 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
