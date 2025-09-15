import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { DropdownFilterConfig, FilterOption } from '@/types/api/filters';
import { getAuthToken } from '@/lib/auth/storage';
import { setActiveMenu, clearActiveMenu, closeActiveMenu } from './openMenuRegistry';
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

  // Note: Outside click handling is now managed by openMenuRegistry

  const handleSelectOption = (optionValue: string) => {
    setSelectedValue(optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

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
        data-filter-button
        onMouseDownCapture={handleMouseDown}
        className={`
          w-full px-3 py-2 text-left text-xs font-medium
          bg-card-color border border-border-color
          rounded-lg shadow-sm hover:bg-primary-10
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-all duration-200 flex items-center justify-between
          ${hasActiveSelection ? 'text-primary border-primary bg-primary-10' : 'text-font-color'}
        `}
        style={{ width: config.width || 'auto', minWidth: '120px', maxWidth: '180px' }}
      >
        <div className="flex items-center space-x-2">
          {config.iconClassName && (
            <i className={`${config.iconClassName} text-font-color-100`} />
          )}
          <span className="truncate text-xs">{getDisplayText()}</span>
          {loading && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
          )}
        </div>
        <ChevronDownIcon 
          className={`h-3 w-3 text-font-color-100 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Dropdown Content */}
          <div 
            className="absolute z-20 mt-2 w-full bg-card-color border border-border-color rounded-xl shadow-xl overflow-hidden min-w-[200px]"
            style={{ 
              width: Math.max(
                containerRef.current?.getBoundingClientRect().width || 0, 
                config.field === 'order_type' || config.field === 'channel' ? 280 : 200
              )
            }}
            data-filter-dropdown
          >
            {/* Clear Option for Total Filter */}
            {config.field === 'total' && hasActiveSelection && (
              <div className="px-2 pt-2 pb-1 border-b border-border-color">
                <button
                  type="button"
                  onClick={() => handleSelectOption('')}
                  className="w-full flex items-center px-2 py-1 hover:bg-primary-10 cursor-pointer transition-colors rounded-lg group text-left text-font-color-100"
                >
                  <div className="flex items-center justify-center w-3 h-3 mr-2">
                    <XMarkIcon className="w-3 h-3" />
                  </div>
                  <span className="text-sm flex-1 truncate group-hover:text-font-color transition-colors">
                    No totals
                  </span>
                </button>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto px-2 pt-2 pb-2">
              {loading ? (
                <div className="px-3 py-3 text-sm text-font-color-100 text-center">
                  Loading options...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-3 text-sm text-font-color-100 text-center">
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
                        w-full flex items-center px-2 py-1 hover:bg-primary-10 cursor-pointer transition-colors rounded-lg group text-left
                        ${isSelected ? 'bg-primary-10 text-primary' : 'text-font-color'}
                      `}
                    >
                      <div className="flex items-center justify-center w-3 h-3 mr-2">
                        {isSelected && (
                          <CheckIcon className="w-3 h-3 text-primary" />
                        )}
                      </div>
                    <span className="text-sm flex-1 truncate group-hover:text-primary transition-colors">
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
