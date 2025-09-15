import React, { useState, useRef, useEffect, useCallback } from 'react';
import { setActiveMenu, clearActiveMenu, closeActiveMenu } from './openMenuRegistry';
import { CalendarIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import type { DateRangeFilterConfig } from '@/types/api/filters';

interface FilterDateRangeAdvancedProps {
  config: DateRangeFilterConfig;
  value?: { start: string; end: string } | null;
  onChange: (value: { start: string; end: string } | null) => void;
  className?: string;
  allowClear?: boolean;
}

interface DateRange {
  label: string;
  start: string;
  end: string;
  isCustom?: boolean;
}

const predefinedRanges: DateRange[] = [
  {
    label: 'Today',
    start: new Date().toISOString().split('T')[0] || '',
    end: new Date().toISOString().split('T')[0] || ''
  },
  {
    label: 'Yesterday',
    start: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
    end: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] || ''
  },
  {
    label: 'This Week',
    start: getWeekStart(new Date()).toISOString().split('T')[0] || '',
    end: getWeekEnd(new Date()).toISOString().split('T')[0] || ''
  },
  {
    label: 'Last Week',
    start: getWeekStart(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] || '',
    end: getWeekEnd(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] || ''
  },
  {
    label: 'Last 10 Days',
    start: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
    end: new Date().toISOString().split('T')[0] || ''
  },
  {
    label: 'Last 30 Days',
    start: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
    end: new Date().toISOString().split('T')[0] || ''
  },
  {
    label: 'Last 90 Days',
    start: new Date(Date.now() - 89 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] || '',
    end: new Date().toISOString().split('T')[0] || ''
  },
  {
    label: 'This Month',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] || '',
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0] || ''
  },
  {
    label: 'Last Month',
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0] || '',
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0] || ''
  },
  {
    label: 'This Year',
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0] || '',
    end: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0] || ''
  }
];

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

function getWeekEnd(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

export default function FilterDateRangeAdvanced({ 
  config, 
  value, 
  onChange, 
  className = '',
  allowClear = true
}: FilterDateRangeAdvancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [showCustomRange, setShowCustomRange] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleToggle = () => {
    if (!isOpen) {
      // Close any other open menu first
      closeActiveMenu();
      setIsOpen(true);
      setActiveMenu(handleClose, containerRef.current || undefined);
    } else {
      setIsOpen(false);
      clearActiveMenu(handleClose);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggle();
  };

  // Keep registry in sync when closed externally
  useEffect(() => {
    if (!isOpen) {
      clearActiveMenu(handleClose);
    } else {
      setActiveMenu(handleClose);
    }
  }, [isOpen, handleClose]);

  // Initialize selected range from value
  useEffect(() => {
    if (value) {
      const matchingRange = predefinedRanges.find(range => 
        range.start === value.start && range.end === value.end
      );
      
      if (matchingRange) {
        setSelectedRange(matchingRange);
      } else {
        setSelectedRange({
          label: `${formatDate(value.start)} - ${formatDate(value.end)}`,
          start: value.start,
          end: value.end,
          isCustom: true
        });
        setCustomStart(value.start);
        setCustomEnd(value.end);
        setShowCustomRange(true);
      }
    } else {
      setSelectedRange(null);
      setCustomStart('');
      setCustomEnd('');
      setShowCustomRange(false);
    }
  }, [value]);

  // Close dropdown when clicking outside (use 'mousedown' to match other filters)
  // Note: Outside click handling is now managed by openMenuRegistry

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleRangeSelect = (range: DateRange) => {
    setSelectedRange(range);
    setShowCustomRange(range.isCustom || false);
    
    if (range.isCustom) {
      setCustomStart(range.start);
      setCustomEnd(range.end);
    } else {
      setCustomStart('');
      setCustomEnd('');
    }
  };

  const handleApply = () => {
    if (selectedRange) {
      if (selectedRange.isCustom && showCustomRange) {
        if (customStart && customEnd) {
          onChange({ start: customStart, end: customEnd });
        }
      } else if (!selectedRange.isCustom) {
        onChange({ start: selectedRange.start, end: selectedRange.end });
      }
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedRange(null);
    setCustomStart('');
    setCustomEnd('');
    setShowCustomRange(false);
    onChange(null);
    setIsOpen(false);
    clearActiveMenu(handleClose);
  };

  const handleCustomRangeToggle = () => {
    setShowCustomRange(!showCustomRange);
    if (!showCustomRange) {
      setSelectedRange({
        label: 'Custom Range',
        start: customStart || new Date().toISOString().split('T')[0] || '',
        end: customEnd || new Date().toISOString().split('T')[0] || '',
        isCustom: true
      });
    }
  };

  const displayValue = selectedRange ? selectedRange.label : 'Any';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        data-filter-button
        onMouseDownCapture={handleMouseDown}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-sm font-normal
          bg-card-color border border-border-color
          rounded-md shadow-sm hover:bg-primary-10
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${selectedRange ? 'text-red-600 dark:text-red-400 border-red-500' : 'text-gray-500 dark:text-gray-400'}
        `}
        style={{ width: config.width || 'auto', minWidth: '200px' }}
      >
        <div className="flex items-center space-x-2">
          {config.iconClassName && (
            <i className={`${config.iconClassName} text-gray-400 dark:text-gray-500`} />
          )}
          <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span className="truncate">{displayValue}</span>
        </div>
        <div className="flex items-center space-x-1">
          {selectedRange && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:bg-primary-10 rounded-full transition-colors"
            >
              <XMarkIcon className="h-3 w-3 text-gray-400" />
            </button>
          )}
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-96 pointer-events-none">
          <div className="bg-card-color border border-border-color rounded-md shadow-lg pointer-events-auto">
          <div className="flex">
            {/* Left Panel - Predefined Ranges */}
            <div className="w-1/2 p-4 border-r border-gray-200 dark:border-gray-600">
              <div className="space-y-1">
                {allowClear && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      !selectedRange ? 'bg-primary-10 text-primary' : 'hover:bg-primary-10'
                    }`}
                  >
                    Clear
                  </button>
                )}
                
                {predefinedRanges.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => handleRangeSelect(range)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedRange?.label === range.label ? 'bg-primary-10 text-primary' : 'hover:bg-primary-10'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
                
                <button
                  type="button"
                  onClick={handleCustomRangeToggle}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    showCustomRange ? 'bg-primary-10 text-primary' : 'hover:bg-primary-10'
                  }`}
                >
                  Custom Range
                </button>
              </div>
            </div>

            {/* Right Panel - Custom Date Range */}
            <div className="w-1/2 p-4">
              {showCustomRange ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-font-color mb-2">
                      From:
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-card-color text-font-color"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-font-color mb-2">
                      To:
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-card-color text-font-color"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">Select a predefined range or choose Custom Range</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={() => { setIsOpen(false); clearActiveMenu(handleClose); }}
              className="px-4 py-2 text-sm font-medium text-font-color bg-primary-10 hover:bg-primary-20 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
