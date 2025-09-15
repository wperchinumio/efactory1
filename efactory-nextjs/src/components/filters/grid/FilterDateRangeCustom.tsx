import React, { useState, useRef, useEffect, useCallback } from 'react';
import { IconChevronDown, IconCheck, IconCalendar, IconX } from '@tabler/icons-react';
import DatePicker from '@/components/ui/DatePicker';
import type { DateRangeFilterConfig } from '@/types/api/filters';
import { setActiveMenu, clearActiveMenu } from './openMenuRegistry';

interface FilterDateRangeCustomProps {
  config: DateRangeFilterConfig;
  value?: { start: string; end: string } | null;
  onChange: (value: { start: string; end: string } | null) => void;
  className?: string;
  allowClear?: boolean;
}

const FilterDateRangeCustom = ({ 
  config, 
  value, 
  onChange, 
  className = '',
  allowClear = true
}: FilterDateRangeCustomProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Date range options matching the analytics pattern
  const baseDateOptions = [
    { value: '0D', label: 'Today' },
    { value: '-1D', label: 'Yesterday' },
    { value: '0W', label: 'This Week' },
    { value: '-1W', label: 'Last Week' },
    { value: '-10D', label: 'Last 10 Days' },
    { value: '-30D', label: 'Last 30 Days' },
    { value: '-90D', label: 'Last 90 Days' },
    { value: '0M', label: 'This Month' },
    { value: '-1M', label: 'Last Month' },
    { value: '0Y', label: 'This Year' },
    { value: 'CUSTOM', label: 'Custom Range' }
  ];

  // Add clear option only if allowed
  const dateOptions = allowClear 
    ? [{ value: '', label: 'Clear' }, ...baseDateOptions]
    : baseDateOptions;

  // Note: Outside click handling is now managed by openMenuRegistry

  // Create stable closer function
  const menuCloser = useCallback(() => setIsOpen(false), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearActiveMenu(menuCloser);
    };
  }, [menuCloser]);

  const handleSelect = (optionValue: string) => {
    if (optionValue === 'CUSTOM') {
      setShowCustomPanel(true);
      setIsOpen(false);
      // Initialize with current date
      const today = new Date().toISOString().split('T')[0] || '';
      setCustomStartDate(today);
      setCustomEndDate(today);
    } else if (optionValue === '') {
      // Clear selection - send empty array to match legacy format
      onChange(null);
      setIsOpen(false);
    } else {
      // For predefined ranges, send the option value directly (like "-90D", "0D", etc.)
      // This matches the legacy format where predefined ranges are sent as single values
      onChange({ start: optionValue, end: optionValue });
      setIsOpen(false);
    }
    
    // Clear from registry when closing
    clearActiveMenu(menuCloser);
  };

  const convertPredefinedToDateRange = (optionValue: string): { start: string; end: string } | null => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0] || '';

    switch (optionValue) {
      case '0D': // Today
        return { start: todayStr, end: todayStr };
      
      case '-1D': // Yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0] || '';
        return { start: yesterdayStr, end: yesterdayStr };
      
      case '0W': // This Week
        const weekStart = getWeekStart(today);
        const weekEnd = getWeekEnd(today);
        return { start: weekStart, end: weekEnd };
      
      case '-1W': // Last Week
        const lastWeekStart = getWeekStart(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
        const lastWeekEnd = getWeekEnd(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));
        return { start: lastWeekStart, end: lastWeekEnd };
      
      case '-10D': // Last 10 Days
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 9);
        return { start: tenDaysAgo.toISOString().split('T')[0] || '', end: todayStr };
      
      case '-30D': // Last 30 Days
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 29);
        return { start: thirtyDaysAgo.toISOString().split('T')[0] || '', end: todayStr };
      
      case '-90D': // Last 90 Days
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 89);
        return { start: ninetyDaysAgo.toISOString().split('T')[0] || '', end: todayStr };
      
      case '0M': // This Month
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start: monthStart.toISOString().split('T')[0] || '', end: monthEnd.toISOString().split('T')[0] || '' };
      
      case '-1M': // Last Month
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: lastMonthStart.toISOString().split('T')[0] || '', end: lastMonthEnd.toISOString().split('T')[0] || '' };
      
      case '0Y': // This Year
        const yearStart = new Date(today.getFullYear(), 0, 1);
        const yearEnd = new Date(today.getFullYear(), 11, 31);
        return { start: yearStart.toISOString().split('T')[0] || '', end: yearEnd.toISOString().split('T')[0] || '' };
      
      default:
        return null;
    }
  };

  const getWeekStart = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    return d.toISOString().split('T')[0] || '';
  };

  const getWeekEnd = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is Sunday
    d.setDate(diff);
    return d.toISOString().split('T')[0] || '';
  };

  const handleCustomApply = () => {
    if (customStartDate && customEndDate) {
      // For custom ranges, send as pipe-separated string like "2024-01-01|2024-01-31"
      // This matches the analytics page format
      const customValue = `${customStartDate}|${customEndDate}`;
      onChange({ start: customValue, end: customValue });
    }
    setShowCustomPanel(false);
  };

  const handleCustomCancel = () => {
    setShowCustomPanel(false);
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen) {
      // Register this menu as active with stable closer
      setActiveMenu(menuCloser, containerRef.current);
    } else {
      // Clear this menu from registry
      clearActiveMenu(menuCloser);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggle();
  };

  const getDisplayText = () => {
    if (!value) return 'Any';
    
    const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      } catch {
        return dateStr;
      }
    };

    // Handle predefined ranges (like "-90D", "0D", etc.)
    if (value.start === value.end) {
      const predefinedLabels: { [key: string]: string } = {
        '0D': 'Today',
        '-1D': 'Yesterday',
        '0W': 'This Week',
        '-1W': 'Last Week',
        '-10D': 'Last 10 Days',
        '-30D': 'Last 30 Days',
        '-90D': 'Last 90 Days',
        '0M': 'This Month',
        '-1M': 'Last Month',
        '0Y': 'This Year'
      };
      
      if (predefinedLabels[value.start]) {
        return predefinedLabels[value.start];
      }
      
      // Handle custom range with pipe separator
      if (value.start.includes('|')) {
        const [startDate, endDate] = value.start.split('|');
        return `${formatDate(startDate || '')} - ${formatDate(endDate || '')}`;
      }
      
      return value.start;
    }

    // Handle separate start/end dates
    return `${formatDate(value.start)} - ${formatDate(value.end)}`;
  };

  const hasActiveSelection = value !== null;

  return (
    <>
      <div className={`relative ${className}`} ref={containerRef} style={{ zIndex: isOpen ? 99999 : 'auto' }}>
        {/* Trigger Button */}
        <button
          type="button"
          className={`
            w-full px-3 py-2 text-left text-xs font-medium
            bg-card-color border border-border-color
            rounded-lg shadow-sm hover:bg-primary-10
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            transition-all duration-200 flex items-center justify-between
            ${hasActiveSelection ? 'text-primary border-primary bg-primary-10' : 'text-font-color'}
          `}
          style={{ 
            width: value ? 'fit-content' : (config.width || 'auto'),
            minWidth: '120px', 
            maxWidth: value ? 'none' : '180px',
            paddingRight: value ? '2rem' : undefined
          }}
          onMouseDownCapture={handleMouseDown}
          data-filter-button
        >
          <div className="flex items-center space-x-2 flex-1">
            {config.iconClassName && (
              <i className={`${config.iconClassName} text-font-color-100`} />
            )}
            <span className="text-xs whitespace-nowrap flex-1">{getDisplayText()}</span>
          </div>
          <IconChevronDown 
            className={`h-3 w-3 text-font-color-100 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div 
            className="absolute z-20 mt-2 w-full bg-card-color border border-border-color rounded-xl shadow-xl overflow-hidden min-w-[200px]"
            style={{ width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 200) }}
            data-filter-dropdown
          >
            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
              {dateOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`
                    w-full px-3 py-2 text-left text-sm hover:bg-primary-10 
                    transition-colors duration-150 flex items-center justify-between gap-2
                    ${value && option.value !== 'CUSTOM' && option.value !== '' && 
                      value.start === option.value && value.end === option.value
                      ? 'bg-primary-10 text-primary' 
                      : 'text-font-color'
                    }
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                  {value && option.value !== 'CUSTOM' && option.value !== '' && 
                   value.start === option.value && value.end === option.value && (
                    <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Date Range Side Panel */}
      {showCustomPanel && (
        <div 
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCustomCancel();
            }
          }}
        >
          <div 
            className="bg-card-color border border-border-color rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header */}
            <div className="bg-primary-5 border-b border-border-color px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                    <IconCalendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-font-color">Custom Date Range</h3>
                    <p className="text-sm text-font-color-100">Select your custom date range</p>
                  </div>
                </div>
                <button
                  onClick={handleCustomCancel}
                  className="w-8 h-8 rounded-lg hover:bg-primary-10 flex items-center justify-center transition-colors"
                >
                  <IconX className="w-4 h-4 text-font-color-100" />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Date */}
                <div>
                  <label className="block text-sm font-semibold text-font-color mb-2">
                    From Date
                  </label>
                  <DatePicker
                    value={customStartDate}
                    onChange={setCustomStartDate}
                    placeholder="Select start date"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-semibold text-font-color mb-2">
                    To Date
                  </label>
                  <DatePicker
                    value={customEndDate}
                    onChange={setCustomEndDate}
                    placeholder="Select end date"
                  />
                </div>
              </div>

              {/* Quick Select Options */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-font-color mb-3">Quick Select</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Last 7 Days', days: 7 },
                    { label: 'Last 30 Days', days: 30 },
                    { label: 'Last 90 Days', days: 90 }
                  ].map((quick) => (
                    <button
                      key={quick.label}
                      type="button"
                      className="px-3 py-2 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      onClick={() => {
                        const today = new Date();
                        const startDate = new Date(today);
                        startDate.setDate(today.getDate() - quick.days);
                        
                        const startDateStr = startDate.toISOString().split('T')[0] || '';
                        const todayStr = today.toISOString().split('T')[0] || '';
                        setCustomStartDate(startDateStr);
                        setCustomEndDate(todayStr);
                      }}
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {customStartDate && customEndDate && (
                <div className="mt-6 p-4 bg-primary-5 border border-border-color rounded-lg">
                  <h4 className="text-sm font-semibold text-font-color mb-2">Preview</h4>
                  <p className="text-sm text-font-color-100">
                    <span className="font-medium">{customStartDate}</span>
                    {' '} to {' '}
                    <span className="font-medium">{customEndDate}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Panel Footer */}
            <div className="bg-primary-5 border-t border-border-color px-6 py-4">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-font-color bg-primary-10 hover:bg-primary-20 rounded-md transition-colors"
                  onClick={handleCustomCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2"
                  onClick={handleCustomApply}
                  disabled={!customStartDate || !customEndDate}
                >
                  <IconCheck className="w-4 h-4" />
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterDateRangeCustom;
