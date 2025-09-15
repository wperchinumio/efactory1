import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import FilterDateRange from '@/components/filters/grid/FilterDateRange';
import FilterDateRangeAdvanced from '@/components/filters/grid/FilterDateRangeAdvanced';
import GridSingleSelectFilter from '@/components/filters/grid/GridSingleSelectFilter';
import GridMultiSelectFilter from '@/components/filters/grid/GridMultiSelectFilter';
import FilterDateRangeSimple from '@/components/filters/grid/FilterDateRangeSimple';
import GridSingleSelectSimple from '@/components/filters/grid/GridSingleSelectSimple';
import type { FilterConfig } from '@/types/api/filters';

export default function TestFiltersPage() {
  const [filterState, setFilterState] = useState<any>({});

  // Test filter configurations
  const testFilters: Record<string, FilterConfig> = {
    receivedDate: {
      title: 'RECEIVED DATE',
      type: 'DATE_RANGE_QF',
      field: 'received_date',
      width: '180px'
    },
    orderDate: {
      title: 'ORDER DATE', 
      type: 'DATE_RANGE_ADVANCED_QF',
      field: 'order_date',
      width: '200px'
    },
    destination: {
      title: 'DESTINATION',
      type: 'DROPDOWN_QF',
      field: 'destination',
      width: '150px',
      options: [
        { key: 'All', value: '', oper: '=' as const },
        { key: 'Domestic', value: '0', oper: '=' as const },
        { key: 'International', value: '1', oper: '<>' as const }
      ]
    },
    account: {
      title: 'ACCOUNT',
      type: 'DROPDOWN_QF', 
      field: 'account',
      width: '150px',
      options: [
        { key: 'Account A', value: 'A', oper: '=' as const },
        { key: 'Account B', value: 'B', oper: '=' as const },
        { key: 'Account C', value: 'C', oper: '=' as const }
      ]
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    console.log(`[TEST] Filter changed: ${field} =`, value);
    setFilterState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Filter Test Page</h1>
        
        <div className="bg-white border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Test Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open browser dev tools and go to Console tab</li>
            <li>Click on "RECEIVED DATE" (simple date filter) to open it</li>
            <li>While it's open, click on "ACCOUNT" filter</li>
            <li>Check if ACCOUNT opens immediately or requires second click</li>
            <li>Try the same with "ORDER DATE" (advanced date filter) → "DESTINATION"</li>
          </ol>
        </div>

        <div className="space-y-8">
          {/* Original Complex Filters */}
          <div>
            <h3 className="text-md font-semibold mb-3">Original Complex Filters (with issue):</h3>
            <div className="bg-card-color border border-border-color rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4">
            {Object.entries(testFilters).map(([key, config]) => (
              <div key={key} className="flex flex-col">
                <div className="text-[10px] font-medium text-font-color-100 mb-1 pl-1">
                  {config.title}
                </div>
                {config.type === 'DATE_RANGE_QF' ? (
                  <FilterDateRange
                    config={config as any}
                    value={filterState[key]}
                    onChange={(val) => handleFilterChange(key, val)}
                  />
                ) : config.type === 'DATE_RANGE_ADVANCED_QF' ? (
                  <FilterDateRangeAdvanced
                    config={config as any}
                    value={filterState[key]}
                    onChange={(val) => handleFilterChange(key, val)}
                  />
                ) : config.field === 'destination' ? (
                  <GridSingleSelectFilter
                    config={config as any}
                    value={filterState[key] || ''}
                    onChange={(val) => handleFilterChange(key, val)}
                  />
                ) : (
                  <GridMultiSelectFilter
                    config={config as any}
                    value={filterState[key] || []}
                    onChange={(val) => handleFilterChange(key, val)}
                  />
                )}
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Simple Test Filters */}
          <div>
            <h3 className="text-md font-semibold mb-3">Simplified Test Filters (potential fix):</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex flex-col">
                  <div className="text-[10px] font-medium text-font-color-100 mb-1 pl-1">
                    SIMPLE DATE
                  </div>
                  <FilterDateRangeSimple
                    config={testFilters.receivedDate as any}
                    value={filterState.simpleDate}
                    onChange={(val) => handleFilterChange('simpleDate', val)}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[10px] font-medium text-font-color-100 mb-1 pl-1">
                    SIMPLE SELECT
                  </div>
                  <GridSingleSelectSimple
                    config={testFilters.destination as any}
                    value={filterState.simpleSelect || ''}
                    onChange={(val) => handleFilterChange('simpleSelect', val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Current Filter State:</h3>
          <pre className="text-sm">{JSON.stringify(filterState, null, 2)}</pre>
        </div>
      </div>
    </Layout>
  );
}
