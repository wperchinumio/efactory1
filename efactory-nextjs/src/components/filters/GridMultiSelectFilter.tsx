import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import type { DropdownFilterConfig, FilterOption } from '@/types/api/filters';
import { getAuthToken } from '@/lib/auth/storage';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

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
  const [options, setOptions] = useState<FilterOption[]>(config.options || []);
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const globalData = useGlobalFilterData();

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

    // Load options from localStorage authToken (like legacy code)
    const authToken = getAuthToken();
    if (authToken?.user_data) {
      let apiOptions: FilterOption[] = [];

      switch (config.field) {
        case 'location':
        case 'warehouse':
          // Use warehouses data like legacy code
          const warehouses = (authToken.user_data as any).warehouses || {};
          Object.keys(warehouses).forEach(aWarehouse => {
            const warehouseData = warehouses[aWarehouse] as any[];
            if (Array.isArray(warehouseData)) {
              warehouseData.forEach((invType: any) => {
                if (typeof invType === 'object' && invType !== null) {
                  Object.keys(invType).forEach(anInvType => {
                    const optionKey = config.field === 'location' ? aWarehouse : `${anInvType}.${aWarehouse}`;
                    const optionValue = `${aWarehouse} - ${anInvType}`;
                    apiOptions.push({ key: optionValue, value: optionKey, oper: '=' as const });
                  });
                }
              });
            }
          });
          break;
        case 'account_number':
        case 'account':
          // Use calc_accounts from authToken
          const accounts = authToken.user_data.calc_accounts || [];
          apiOptions = accounts.map(account => ({ key: account, value: account, oper: '=' as const }));
          break;
        case 'account_wh':
          // Use calc_account_regions from authToken
          const calcAccountRegions = (authToken.user_data as any).calc_account_regions || {};
          const accountRegionKeys = Object.keys(calcAccountRegions).sort();
          apiOptions = accountRegionKeys.map(key => ({
            key: calcAccountRegions[key] || key,
            value: key,
            oper: '=' as const
          }));
          break;
        case 'order_type':
        case 'channel':
          // Use global data for channel options (same as analytics)
          if (globalData?.getFilterOptions) {
            const channelOptions = globalData.getFilterOptions().getChannelOptions();
            apiOptions = channelOptions.map(option => ({
              key: option.label,
              value: option.value,
              oper: '=' as const
            }));
          } else {
            // Fallback to authToken data if global data not available
            const orderTypes = (authToken.user_data as any).order_types || {};
            apiOptions = Object.keys(orderTypes).map(orderTypeKey => ({
              key: `${orderTypeKey} - ${orderTypes[orderTypeKey]}`,
              value: orderTypeKey,
              oper: '=' as const
            }));
          }
          break;
        default:
          apiOptions = [];
      }

      setOptions(apiOptions);
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


  const handleToggleOption = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue];
    
    setSelectedValues(newSelectedValues);
  };

  const handleApply = () => {
    onChange(selectedValues);
    setIsOpen(false);
  };

  const handleClearAll = () => {
    setSelectedValues([]);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return 'All';
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


            {/* Options List */}
            <div className="max-h-[400px] overflow-y-auto px-2 pb-2">
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
                  const optionValue = option.value || option.key;
                  const isSelected = selectedValues.includes(optionValue);
                  
                  return (
                    <label
                      key={index}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors rounded-lg group"
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isSelected}
                        onClick={() => handleToggleOption(optionValue)}
                        className={`
                          w-3.5 h-3.5 rounded border flex items-center justify-center
                          focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20
                          cursor-pointer hover:border-primary transition-colors
                          ${isSelected 
                            ? 'bg-primary border-primary' 
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                          }
                        `}
                      >
                        {isSelected && (
                          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <span className="text-xs text-gray-900 dark:text-gray-100 flex-1 truncate group-hover:text-primary transition-colors">
                        {option.key}
                      </span>
                    </label>
                  );
                })
              )}
            </div>

            {/* Clear All and Apply Buttons */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 space-y-1.5">
              <button
                type="button"
                className="w-full px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition-colors"
                onClick={handleClearAll}
              >
                Clear All
              </button>
              <button
                type="button"
                className="w-full bg-primary hover:bg-primary/90 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md"
                onClick={handleApply}
              >
                <CheckIcon className="w-3 h-3" />
                Apply ({selectedValues.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
