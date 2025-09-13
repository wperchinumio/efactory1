import React, { useState } from 'react';
import FilterDateRangeCustom from '@/components/filters/grid/FilterDateRangeCustom';
import type { DateRangeFilterConfig } from '@/types/api/filters';

export default function DemoDateFilterPage() {
  const [value, setValue] = useState<{ start: string; end: string } | null>(null);

  const config: DateRangeFilterConfig = {
    field: 'received_date',
    title: 'RECEIVED DATE',
    type: 'DATE_RANGE_QF',
    iconClassName: 'fa fa-calendar',
    width: '200px',
    allowClear: true
  };

  const handleChange = (newValue: { start: string; end: string } | null) => {
    setValue(newValue);
    console.log('Date filter changed:', newValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Custom Date Filter Demo
          </h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Analytics-Style Date Filter
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This date filter follows the same pattern as the analytics page with a sophisticated 
                dropdown interface and custom date range side panel.
              </p>
              
              <div className="flex items-center space-x-4">
                <FilterDateRangeCustom
                  config={config}
                  value={value}
                  onChange={handleChange}
                  allowClear={true}
                />
                
                {value && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Selected:</span> {value.start} to {value.end}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Predefined Ranges</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Today</li>
                    <li>• Yesterday</li>
                    <li>• This Week / Last Week</li>
                    <li>• Last 10/30/90 Days</li>
                    <li>• This Month / Last Month</li>
                    <li>• This Year</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">Custom Features</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Custom date range picker</li>
                    <li>• Side panel with dual calendars</li>
                    <li>• Quick select buttons</li>
                    <li>• Clear option (configurable)</li>
                    <li>• Responsive design</li>
                    <li>• Dark mode support</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Integration with Grid Filters
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This component is designed to work seamlessly with the grid filter system and 
                follows the same patterns as the analytics page date filters.
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Usage in Grid Filters:</h4>
                <pre className="text-sm text-gray-600 dark:text-gray-400 overflow-x-auto">
{`// In filterConfigs.ts
export const receivedDateQF: FilterConfig = {
  field: 'received_date',
  title: 'RECEIVED DATE',
  type: 'DATE_RANGE_CUSTOM_QF',
  iconClassName: 'fa fa-calendar',
  width: '200px',
  allowClear: true
};`}
                </pre>
              </div>
            </div>

            {value && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Current Selection
                </h3>
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">Start Date:</span> {value.start}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">End Date:</span> {value.end}
                      </p>
                    </div>
                    <button
                      onClick={() => setValue(null)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
