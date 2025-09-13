import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { DropdownFilterConfig, FilterOption } from '@/types/api/filters';
import { getOptionsForField } from '@/lib/filters/filterOptionsService';

interface GridMultiSelectFilterProps {
  config: DropdownFilterConfig;
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export default function GridMultiSelectFilter({ 
  config, 
  value = [], 
  onChange, 
  className = '' 
}: GridMultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState<FilterOption[]>(config.options || []);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync with external value changes
  useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  // Load options dynamically if not provided in config
  useEffect(() => {
    if (config.options && config.options.length > 0) {
      setOptions(config.options);
      return;
    }

    // Load options from API
    const loadOptions = async () => {
      setLoading(true);
      try {
        const dynamicOptions = await getOptionsForField(config.field);
        setOptions(dynamicOptions);
      } catch (error) {
        console.error(`Failed to load options for ${config.field}:`, error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, [config.field, config.options]);

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (option.value && option.value.toString().toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleOption = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    
    setSelectedValues(newSelectedValues);
  };

  const handleApply = () => {
    onChange(selectedValues);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClearAll = () => {
    setSelectedValues([]);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchQuery('');
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return config.title;
    if (selectedValues.length === 1) {
      const option = options.find(o => o.value === selectedValues[0]);
      return option ? option.key : selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const hasActiveSelection = selectedValues.length > 0;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Filter Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full px-2 py-1.5 text-left text-xs font-normal
          bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
          rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200 flex items-center justify-between
          ${hasActiveSelection ? 'text-red-600 dark:text-red-400 border-red-500' : 'text-gray-700 dark:text-gray-300'}
        `}
        style={{ width: config.width || 'auto', minWidth: '100px', maxWidth: '150px' }}
      >
        <div className="flex items-center space-x-2">
          {config.iconClassName && (
            <i className={`${config.iconClassName} text-gray-500 dark:text-gray-400`} />
          )}
          <span className="truncate font-normal text-xs">{getDisplayText()}</span>
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
            className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-xl overflow-hidden min-w-[250px]"
            style={{ width: Math.max(containerRef.current?.getBoundingClientRect().width || 0, 250) }}
          >
            {/* Search Bar */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full pl-6 pr-3 py-1 text-xs bg-transparent border-0 outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder={`Search ${config.title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Clear All Option */}
            <div className="p-1 border-b border-gray-200 dark:border-gray-600">
              <button
                type="button"
                className="w-full text-left px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>

            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  Loading options...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                  No {config.title.toLowerCase()} found.
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const optionValue = option.value || option.key;
                  const isSelected = selectedValues.includes(optionValue);
                  
                  return (
                    <label
                      key={index}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleOption(optionValue)}
                        className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 focus:ring-1 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <span className="text-xs text-gray-900 dark:text-gray-100 flex-1 truncate">
                        {option.key}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Apply Button */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                onClick={handleApply}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Apply ({selectedValues.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
