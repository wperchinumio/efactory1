import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { DropdownFilterConfig, FilterOption } from '@/types/api/filters';
import { getAuthToken } from '@/lib/auth/storage';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

interface GridSingleSelectFilterProps {
  config: DropdownFilterConfig;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function GridSingleSelectFilter({ 
  config, 
  value = '', 
  onChange, 
  className = '' 
}: GridSingleSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<FilterOption[]>(config.options || []);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(value || '');
  const containerRef = useRef<HTMLDivElement>(null);
  const globalData = useGlobalFilterData();

  // Sync with external value changes
  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  // Load options based on field type
  useEffect(() => {
    if (config.options && config.options.length > 0) {
      setOptions(config.options);
    } else {
      setLoading(true);
      const authToken = getAuthToken();
      let apiOptions: FilterOption[] = [];

      switch (config.field) {
        case 'international_code':
        case 'destination':
          // Use hardcoded destination options (matching analytics)
          apiOptions = [
            { key: 'All', value: '', oper: '=' as const },
            { key: 'Domestic', value: '0', oper: '=' as const },
            { key: 'International', value: '1', oper: '<>' as const }
          ];
          break;
        default:
          apiOptions = [];
      }

      setOptions(apiOptions);
      setLoading(false);
    }
  }, [config.field, config.options, globalData]);

  // Use all options since search is removed
  const filteredOptions = options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectOption = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayText = () => {
    if (selectedValue === '' || !selectedValue) {
      // Show "No totals" for total filter, "All" for others
      return config.field === 'total' ? 'No totals' : 'All';
    }
    const option = options.find(o => o.value === selectedValue);
    return option ? option.key : selectedValue;
  };

  const hasActiveSelection = selectedValue && selectedValue !== '';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Filter Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full px-3 py-2 text-left text-xs font-medium
          bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
          rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-all duration-200 flex items-center justify-between
          ${hasActiveSelection ? 'text-primary border-primary bg-primary/5' : 'text-gray-700 dark:text-gray-300'}
        `}
        style={{ width: config.width || 'auto', minWidth: '120px', maxWidth: '180px' }}
      >
        <div className="flex items-center space-x-2">
          {config.iconClassName && (
            <i className={`${config.iconClassName} text-gray-500 dark:text-gray-400`} />
          )}
          <span className="truncate text-xs">{getDisplayText()}</span>
          {loading && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
          )}
        </div>
        <ChevronDownIcon 
          className={`h-3 w-3 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Content */}
          <div 
            className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden min-w-[200px]"
            style={{ 
              width: Math.max(
                containerRef.current?.getBoundingClientRect().width || 0, 
                config.field === 'order_type' || config.field === 'channel' ? 280 : 200
              ) 
            }}
          >
            {/* Clear Option for Total Filter */}
            {config.field === 'total' && hasActiveSelection && (
              <div className="px-2 pt-2 pb-1 border-b border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => handleSelectOption('')}
                  className="w-full flex items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors rounded-lg group text-left text-gray-600 dark:text-gray-400"
                >
                  <div className="flex items-center justify-center w-3 h-3 mr-2">
                    <XMarkIcon className="w-3 h-3" />
                  </div>
                  <span className="text-xs flex-1 truncate group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                    No totals
                  </span>
                </button>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto px-2 pb-2">
              {loading ? (
                <div className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Loading options...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                  No {config.title.toLowerCase()} found.
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const optionValue = option.value;
                  const isSelected = selectedValue === optionValue;
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectOption(optionValue)}
                      className={`
                        w-full flex items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors rounded-lg group text-left
                        ${isSelected ? 'bg-primary/10 text-primary' : 'text-gray-900 dark:text-gray-100'}
                      `}
                    >
                      <div className="flex items-center justify-center w-3 h-3 mr-2">
                        {isSelected && (
                          <CheckIcon className="w-3 h-3 text-primary" />
                        )}
                      </div>
                      <span className="text-xs flex-1 truncate group-hover:text-primary transition-colors">
                        {option.key}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
