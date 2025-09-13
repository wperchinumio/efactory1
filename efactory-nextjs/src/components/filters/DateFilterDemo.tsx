import React, { useState } from 'react';
import FilterDateRangeAdvanced from './FilterDateRangeAdvanced';
import type { DateRangeAdvancedFilterConfig } from '@/types/api/filters';

export default function DateFilterDemo() {
  const [value, setValue] = useState<{ start: string; end: string } | null>(null);

  const config: DateRangeAdvancedFilterConfig = {
    field: 'received_date',
    title: 'RECEIVED DATE',
    type: 'DATE_RANGE_ADVANCED_QF',
    iconClassName: 'fa fa-calendar',
    width: '200px',
    allowClear: true
  };

  const handleChange = (newValue: { start: string; end: string } | null) => {
    setValue(newValue);
    console.log('Date filter changed:', newValue);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Date Filter Demo
      </h2>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This demonstrates the advanced date filter with all predefined ranges and custom date selection.
        </p>
        
        <div className="flex items-center space-x-4">
          <FilterDateRangeAdvanced
            config={config}
            value={value}
            onChange={handleChange}
            allowClear={true}
          />
          
          {value && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {value.start} to {value.end}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Features:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Predefined ranges: Today, Yesterday, This Week, Last Week, etc.</li>
          <li>• Custom date range picker with dual calendar interface</li>
          <li>• Clear option (can be toggled on/off)</li>
          <li>• Responsive design with proper styling</li>
          <li>• TypeScript support with proper type definitions</li>
        </ul>
      </div>
    </div>
  );
}
