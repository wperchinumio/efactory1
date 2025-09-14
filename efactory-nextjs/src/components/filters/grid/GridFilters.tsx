import React, { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import FilterDropdown from './FilterDropdown';
import GridSingleSelectFilter from './GridSingleSelectFilter';
import FilterDateRange from './FilterDateRange';
import FilterDateRangeAdvanced from './FilterDateRangeAdvanced';
import FilterDateRangeCustom from './FilterDateRangeCustom';
import FilterBoolean from './FilterBoolean';
import FilterTextInput from './FilterTextInput';
import FilterTotal from './FilterTotal';
import type { FilterConfig, FilterState, FilterValue, DateRangeValue } from '@/types/api/filters';

interface GridFiltersProps {
  filters: Record<string, FilterConfig>;
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
  disabled?: boolean;
  // Optional initial filter state, e.g. from server-provided view.filter
  initialState?: FilterState;
  // Reset-all action provided by parent (should also clear AG Grid header filters)
  onResetAll?: () => void;
}

export default function GridFilters({
  filters,
  onFiltersChange,
  className = '',
  disabled = false,
  initialState,
  onResetAll
}: GridFiltersProps) {
  const [filterState, setFilterState] = useState<FilterState>(initialState || {});

  // Keep internal state in sync when parent provides/changes initial state
  React.useEffect(() => {
    if (initialState) {
      setFilterState(initialState);
    }
  }, [initialState && JSON.stringify(initialState)]);


  const handleFilterChange = (field: string, value: string[] | FilterValue | DateRangeValue | boolean | string | null) => {
    const newFilterState = { ...filterState };
    
    if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
      delete newFilterState[field];
    } else if (Array.isArray(value)) {
      // Multi-select values: convert array to FilterValue format
      newFilterState[field] = {
        value: value.join(','),
        oper: '=',
        field: field
      };
    } else if (typeof value === 'string') {
      // Single-select values (like destination): convert string to FilterValue format
      newFilterState[field] = {
        value: value,
        oper: '=',
        field: field
      };
    } else if (typeof value === 'object' && 'start' in value && 'end' in value) {
      // Date range values: handle according to legacy format
      if (value.start === value.end) {
        // Predefined range (like "-90D", "0D", etc.) - send as single filter
        newFilterState[field] = {
          value: value.start,
          oper: '=',
          field: field
        };
      } else if (value.start.includes('|') && value.end.includes('|')) {
        // Custom range with pipe-separated dates - send as two separate filters
        const [startDate, endDate] = value.start.split('|');
        newFilterState[field] = [
          {
            field: field,
            oper: '>=',
            value: startDate
          },
          {
            field: field,
            oper: '<=',
            value: endDate
          }
        ];
      } else {
        // Custom range with separate start/end dates - send as two separate filters
        newFilterState[field] = [
          {
            field: field,
            oper: '>=',
            value: value.start
          },
          {
            field: field,
            oper: '<=',
            value: value.end
          }
        ];
      }
    } else if (typeof value === 'boolean') {
      // Boolean values: convert to FilterValue format
      if (value) {
        newFilterState[field] = {
          value: value.toString(),
          oper: '=',
          field: field
        };
      } else {
        // Remove the filter when unchecked
        delete newFilterState[field];
      }
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

  const handleResetAll = () => {
    // Notify parent first so it can batch-suppress fetches during reset
    onResetAll?.();
    if (initialState) {
      setFilterState(initialState);
      onFiltersChange(initialState);
    } else {
      setFilterState({});
      onFiltersChange({});
    }
  };

  const getActiveFilterCount = () => {
    return Object.keys(filterState).length;
  };

  const renderFilter = (key: string, config: FilterConfig) => {
    const value = filterState[key];
    
    switch (config.type) {
      case 'DROPDOWN_QF':
        // Check if this is a single-select filter (destination)
        if (config.field === 'international_code' || config.field === 'destination') {
          // Single-select for destination
          let currentValue = '';
          if (value && !Array.isArray(value)) {
            currentValue = value.value || '';
          }
          
          return (
            <GridSingleSelectFilter
              key={key}
              config={config}
              value={currentValue}
              onChange={(val) => handleFilterChange(key, val)}
            />
          );
        } else {
          // Multi-select for other dropdowns
          let currentValue: string[] = [];
          if (value) {
            if (Array.isArray(value)) {
              // Handle array case - extract values from first element
              currentValue = value[0]?.value ? value[0].value.split(',') : [];
            } else {
              // Handle single FilterValue case
              currentValue = value.value ? value.value.split(',') : [];
            }
          }
          
          return (
            <FilterDropdown
              key={key}
              config={config}
              value={currentValue}
              onChange={(val) => handleFilterChange(key, val)}
            />
          );
        }
      
      case 'DATE_RANGE_QF':
        return (
          <FilterDateRange
            key={key}
            config={config}
            value={value as any}
            onChange={(val) => handleFilterChange(key, val)}
          />
        );
      
      case 'DATE_RANGE_ADVANCED_QF':
        // Handle both single FilterValue and FilterValue[] for date ranges
        let advancedDateRangeValue = null;
        if (value) {
          if (Array.isArray(value)) {
            // Convert array of FilterValue back to DateRangeValue
            if (value.length === 2) {
              advancedDateRangeValue = {
                start: value[0]?.value || '',
                end: value[1]?.value || ''
              };
            } else if (value.length === 1) {
              // Single predefined value
              advancedDateRangeValue = {
                start: value[0]?.value || '',
                end: value[0]?.value || ''
              };
            }
          } else {
            // Single FilterValue
            advancedDateRangeValue = {
              start: value.value,
              end: value.value
            };
          }
        }
        
        return (
          <FilterDateRangeAdvanced
            key={key}
            config={config as any}
            value={advancedDateRangeValue}
            onChange={(val) => handleFilterChange(key, val)}
            allowClear={config.allowClear !== false}
          />
        );
      
      case 'DATE_RANGE_CUSTOM_QF':
        // Handle both single FilterValue and FilterValue[] for date ranges
        let dateRangeValue = null;
        if (value) {
          if (Array.isArray(value)) {
            // Convert array of FilterValue back to DateRangeValue
            if (value.length === 2) {
              dateRangeValue = {
                start: value[0]?.value || '',
                end: value[1]?.value || ''
              };
            } else if (value.length === 1) {
              // Single predefined value
              dateRangeValue = {
                start: value[0]?.value || '',
                end: value[0]?.value || ''
              };
            }
          } else {
            // Single FilterValue
            dateRangeValue = {
              start: value.value,
              end: value.value
            };
          }
        }
        
        return (
          <FilterDateRangeCustom
            key={key}
            config={config as any}
            value={dateRangeValue}
            onChange={(val) => handleFilterChange(key, val)}
            allowClear={config.allowClear !== false}
          />
        );
      
      case 'BOOLEAN_QF':
        // Extract boolean value from FilterValue object
        const booleanValue = value && !Array.isArray(value) ? (value.value === 'true') : false;
        return (
          <FilterBoolean
            key={key}
            config={config}
            value={booleanValue}
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
      
      case 'TOTAL_QF':
        // Custom total filter - extract string value from FilterValue object
        const totalValue = value ? (value as FilterValue).value || '' : '';
        return (
          <FilterTotal
            key={key}
            value={totalValue}
            onChange={(val) => handleFilterChange(key, val)}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`bg-card-color border-l border-r border-b border-border-color ${className}`} aria-disabled={disabled}>
      {/* Filter Panel - Always Visible */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between">
          <div className={`flex flex-wrap items-center gap-2 ${disabled ? 'pointer-events-none opacity-60' : ''}`}>
            {Object.entries(filters).map(([key, config]) => (
              <div key={key} className="flex-shrink-0 flex flex-col items-start">
                {/* Filter Label */}
                <div className="text-[10px] font-medium text-font-color-100 mb-1 pl-1">
                  {config.title}
                </div>
                {renderFilter(key, config)}
              </div>
            ))}
          </div>

          {/* Reset All - Always visible */}
          <button
            type="button"
            onClick={handleResetAll}
            disabled={disabled}
            className={`self-center flex items-center space-x-1 pl-2 pr-1 py-1.5 text-[13px] font-medium transition-colors ${disabled ? 'text-font-color-100 cursor-not-allowed' : 'text-font-color hover:text-primary'}`}
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Reset All</span>
          </button>
        </div>
      </div>
    </div>
  );
}
