import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import FilterDropdown from './FilterDropdown';
import FilterDateRange from './FilterDateRange';
import FilterBoolean from './FilterBoolean';
import FilterTextInput from './FilterTextInput';
import type { FilterConfig, FilterState, FilterValue, DateRangeValue } from '@/types/api/filters';

interface GridFiltersProps {
  filters: Record<string, FilterConfig>;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export default function GridFilters({
  filters,
  onFiltersChange,
  className = ''
}: GridFiltersProps) {
  const [filterState, setFilterState] = useState<FilterState>({});


  const handleFilterChange = (field: string, value: string[] | FilterValue | DateRangeValue | boolean | string | null) => {
    const newFilterState = { ...filterState };
    
    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete newFilterState[field];
    } else if (Array.isArray(value)) {
      // Multi-select values: convert array to FilterValue format
      newFilterState[field] = {
        value: value.join(','),
        oper: '=',
        field: field
      };
    } else if (typeof value === 'object' && 'start' in value && 'end' in value) {
      // Date range values: convert to FilterValue format
      newFilterState[field] = {
        value: `${value.start}|${value.end}`,
        oper: '=',
        field: field
      };
    } else if (typeof value === 'boolean') {
      // Boolean values: convert to FilterValue format
      newFilterState[field] = {
        value: value.toString(),
        oper: '=',
        field: field
      };
    } else {
      // Single values: convert to FilterValue format
      newFilterState[field] = {
        value: value,
        oper: '=',
        field: field
      };
    }
    
    setFilterState(newFilterState);
    onFiltersChange(newFilterState);
  };

  const handleClearAllFilters = () => {
    setFilterState({});
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    return Object.keys(filterState).length;
  };

  const renderFilter = (key: string, config: FilterConfig) => {
    const value = filterState[key];
    
    switch (config.type) {
      case 'DROPDOWN_QF':
        // Extract current values from filterState for multi-select
        const currentValue = value?.value ? 
          value.value.split(',') : [];
        
        return (
          <FilterDropdown
            key={key}
            config={config}
            value={currentValue}
            onChange={(val) => handleFilterChange(key, val)}
          />
        );
      
      case 'DATE_RANGE_QF':
        return (
          <FilterDateRange
            key={key}
            config={config}
            value={value as any}
            onChange={(val) => handleFilterChange(key, val)}
          />
        );
      
      case 'BOOLEAN_QF':
        return (
          <FilterBoolean
            key={key}
            config={config}
            value={value as any}
            onChange={(val) => handleFilterChange(key, val)}
          />
        );
      
      case 'INPUT_TEXT_QF':
        return (
          <FilterTextInput
            key={key}
            config={config}
            value={value as any}
            onChange={(val) => handleFilterChange(key, val)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Filter Controls */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            {/* Empty space for layout balance */}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center space-x-2">
            {/* Clear All Filters */}
            {getActiveFilterCount() > 0 && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel - Always Visible */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(filters).map(([key, config]) => (
              <div key={key} className="flex-shrink-0">
                {renderFilter(key, config)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
