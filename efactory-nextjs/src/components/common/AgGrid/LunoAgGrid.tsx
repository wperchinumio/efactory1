import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, GridApi, GridReadyEvent, ColumnResizedEvent, ColumnMovedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getAuthToken } from '@/lib/auth/storage';
import { getCachedView, setCachedView } from '@/lib/grid/viewCache';
import type { GridFieldDef, GridFilter, GridFilterCondition, GridRowResponse, GridSelectedView, GridSortSpec } from '@/types/api/grid';
import type { FilterConfig, FilterState } from '@/types/api/filters';
import { DateRenderer, DateTimeRenderer, NumberRenderer, PrimaryLinkRenderer, OrderTypePill, OrderStageRenderer, OrderStatusRenderer, ShipToRenderer, CarrierRenderer, TrackingRenderer } from './renderers';
import GridFilters from '@/components/filters/grid/GridFilters';

export interface LunoAgGridProps<T = any> {
  resource: string; // e.g., 'fulfillment-open'
  rowsUrl: string; // e.g., '/api/fulfillment'
  selectedView: GridSelectedView; // columns, default filter/sort/paging
  initialFilters?: GridFilter; // optional overrides/merges
  onFetchRows: (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any) => Promise<GridRowResponse<T>>;
  paginationWord?: string; // for external display
  applyServerSort?: boolean;
  onRowClicked?: (row: T) => void;
  // Legacy fixed columns
  showIndexColumn?: boolean;
  showOrderTypeColumn?: boolean;
  showFlagsColumn?: boolean;
  showInvoiceAllColumn?: boolean;
  containerSize?: 'default' | 'compact' | 'large'; // Grid container size variant
  // Filter system
  filters?: Record<string, FilterConfig>; // Filter configurations for this grid
  showFilters?: boolean; // Whether to show the filter panel
  // Emit raw filter state when it changes (for toolbar badges, etc.)
  onFilterStateChange?: (state: FilterState) => void;
}

// Ensure community modules are registered once
try {
  ModuleRegistry.registerModules([AllCommunityModule]);
} catch {}

function mapFieldToColDef(field: GridFieldDef): ColDef {
  const colDef: ColDef = {
    field: field.field,
    headerName: field.alias,
    sortable: field.sortable !== false, // Enable sorting by default unless explicitly disabled
    minWidth: field.min_width ?? 50,
    cellDataType: field.data_type === 'number' ? 'number' : 
                  field.data_type === 'date' || field.data_type === 'datetime' ? 'date' : 
                  'text', // Map data types to AG Grid supported types
    cellClass: (params) => {
      const align = field.align || 'left';
      return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
    },
  };

  // Only add width if it's defined
  if (field.width) {
    colDef.width = field.width;
  }

  // Add header filter if field is filterable - use AG Grid server-side filtering
  if (field.filterable) {
    // Choose filter type based on data_type
    const dataType = field.data_type || 'string';
    
    if (dataType === 'number') {
      colDef.filter = 'agNumberColumnFilter';
      colDef.floatingFilter = true;
      colDef.filterParams = {
        buttons: ['reset', 'apply'],
        closeOnApply: false,
        suppressAndOrCondition: true,
        filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'],
        defaultOption: 'equals',
        suppressFilterButton: true,
      };
    } else if (dataType === 'date' || dataType === 'datetime') {
      colDef.filter = 'agDateColumnFilter';
      colDef.floatingFilter = true;
      colDef.filterParams = {
        buttons: ['reset', 'apply'],
        closeOnApply: false,
        suppressAndOrCondition: true,
        filterOptions: ['equals', 'notEqual', 'lessThan', 'lessThanOrEqual', 'greaterThan', 'greaterThanOrEqual'],
        defaultOption: 'equals',
        suppressFilterButton: true,
      };
    } else {
      // Default to text filter for string and other types
      colDef.filter = 'agTextColumnFilter';
      colDef.floatingFilter = true;
      colDef.filterParams = {
        buttons: ['reset', 'apply'],
        closeOnApply: false,
        suppressAndOrCondition: true,
        filterOptions: ['contains', 'equals', 'startsWith', 'endsWith'],
        defaultOption: 'equals',
        suppressFilterButton: true,
      };
    }
  }

  // Special renderers mapping placeholder (extend later):
  // Examples: fmtorderlink, fmtdate, fmtnumber
  if (field.render) {
    // Support parameterized fmtnumber, e.g. fmtnumber,2,false,true
    const tokens = field.render.split(',').map(s => s.trim());
    const id = (tokens[0] || '').trim();
    const args = tokens.slice(1);
    if (id === 'fmtdate') {
      colDef.cellRenderer = (p: any) => <DateRenderer value={p.value} />;
    } else if (id === 'fmtdatetime') {
      colDef.cellRenderer = (p: any) => <DateTimeRenderer value={p.value} />;
    } else if (id === 'fmtnumber') {
      const [dec = '0', strong = 'false', dimZero = 'false', hideNull = 'false'] = args;
      colDef.cellRenderer = (p: any) => (
        <NumberRenderer
          value={p.value}
          decimals={Number(dec)}
          strong={String(strong).toLowerCase() === 'true'}
          dimZero={String(dimZero).toLowerCase() === 'true'}
          hideNull={String(hideNull).toLowerCase() === 'true'}
        />
      );
      colDef.type = 'numericColumn';
    } else if (id === 'fmtorderlink') {
      colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} />;
    } else if (id === 'fmtorderstage') {
      colDef.cellRenderer = (p: any) => <OrderStageRenderer value={p.value} data={p.data} />;
    } else if (id === 'fmtorderstatus') {
      colDef.cellRenderer = (p: any) => <OrderStatusRenderer value={p.value} />;
    } else if (id === 'fmtshipto') {
      colDef.cellRenderer = (p: any) => <ShipToRenderer data={p.data} />;
    } else if (id === 'fmtcarrier') {
      colDef.cellRenderer = (p: any) => <CarrierRenderer data={p.data} />;
    } else if (id === 'fmttracking') {
      colDef.cellRenderer = (p: any) => <TrackingRenderer data={p.data} field={p.colDef.field} />;
    }
  }

  // Fallback: if the legacy view doesn't provide render but column is order_stage, apply renderer
  if (!colDef.cellRenderer && field.field && field.field.toLowerCase() === 'order_stage') {
    colDef.cellRenderer = (p: any) => <OrderStageRenderer value={p.value} data={p.data} />;
  }

  return colDef;
}

function getThemeClass(): string {
  if (typeof window === 'undefined') return 'ag-theme-quartz';
  const mode = document.documentElement.getAttribute('data-theme');
  return mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
}

function getThemeAwareStyles(): React.CSSProperties {
  if (typeof window === 'undefined') return {};
  
  const mode = document.documentElement.getAttribute('data-theme');
  const isDark = mode === 'dark';
  
  return {
    '--ag-background-color': isDark ? '#24282e' : '#ffffff',
    '--ag-foreground-color': isDark ? '#E0E0E0' : '#363535',
    '--ag-header-background-color': isDark ? '#2d3238' : '#f8f9fa',
    '--ag-header-foreground-color': isDark ? '#E0E0E0' : '#363535',
    '--ag-border-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-row-hover-color': isDark ? '#2d3238' : '#f8f9fa',
    '--ag-selected-row-background-color': isDark ? '#1a1d23' : '#e3f2fd',
    '--ag-odd-row-background-color': isDark ? '#1e2127' : '#ffffff',
    '--ag-even-row-background-color': isDark ? '#24282e' : '#ffffff',
    '--ag-cell-horizontal-border': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-header-cell-hover-background-color': isDark ? '#3a3f45' : '#e9ecef',
    '--ag-header-cell-moving-background-color': isDark ? '#3a3f45' : '#e9ecef',
    '--ag-range-selection-background-color': isDark ? 'rgba(0, 123, 255, 0.2)' : 'rgba(0, 123, 255, 0.1)',
    '--ag-range-selection-border-color': isDark ? '#007bff' : '#007bff',
    '--ag-input-border-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-input-background-color': isDark ? '#24282e' : '#ffffff',
    '--ag-input-foreground-color': isDark ? '#E0E0E0' : '#363535',
    '--ag-disabled-foreground-color': isDark ? '#9399a1' : '#6c757d',
    '--ag-chip-background-color': isDark ? '#2d3238' : '#f8f9fa',
    '--ag-chip-foreground-color': isDark ? '#E0E0E0' : '#363535',
    '--ag-popup-background-color': isDark ? '#24282e' : '#ffffff',
    '--ag-popup-border-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-tooltip-background-color': isDark ? '#24282e' : '#ffffff',
    '--ag-tooltip-foreground-color': isDark ? '#E0E0E0' : '#363535',
    '--ag-tooltip-border-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-checkbox-background-color': isDark ? '#24282e' : '#ffffff',
    '--ag-checkbox-border-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-checkbox-checked-color': isDark ? '#007bff' : '#007bff',
    '--ag-font-family': 'Mulish, sans-serif',
    '--ag-font-size': '14px',
    '--ag-font-weight': '400',
    '--ag-header-font-weight': '600',
    '--ag-header-font-size': '14px',
    '--ag-cell-horizontal-padding': '12px',
    '--ag-cell-vertical-padding': '8px',
    '--ag-header-height': '40px',
    '--ag-row-height': '40px',
    '--ag-border-radius': '6px',
    '--ag-header-column-separator-display': 'block',
    '--ag-header-column-separator-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-header-column-separator-height': '60%',
    '--ag-header-column-resize-handle-color': isDark ? '#4c4c4c' : '#e7e7e7',
    '--ag-header-column-resize-handle-width': '2px',
    '--ag-header-column-resize-handle-height': '60%',
    '--ag-header-column-resize-handle-display': 'block',
    '--ag-scrollbar-thumb-color': isDark ? '#696969' : '#b9b9b9',
    '--ag-scrollbar-track-color': isDark ? '#2d3238' : '#f8f9fa',
    '--ag-scrollbar-width': '8px',
    '--ag-scrollbar-height': '8px',
  } as React.CSSProperties;
}

function makeViewStorageKey(resource: string): string | null {
  const token = getAuthToken();
  const userId = token?.user_data?.user_id;
  if (!userId) return null;
  return `view.${resource}.${userId}`;
}

export function LunoAgGrid<T = any>({
  resource,
  rowsUrl,
  selectedView,
  initialFilters,
  onFetchRows,
  paginationWord = 'rows',
  applyServerSort = true,
  onRowClicked,
  showIndexColumn = true,
  showOrderTypeColumn = true,
  showFlagsColumn = false,
  showInvoiceAllColumn = false,
  containerSize = 'default',
  filters = {},
  showFilters = true,
  onFilterStateChange,
}: LunoAgGridProps<T>) {
  const gridApiRef = useRef<GridApi | null>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [themeClass, setThemeClass] = useState(() => getThemeClass());
  const [filterState, setFilterState] = useState<FilterState>({});
  const [currentSort, setCurrentSort] = useState<GridSortSpec[]>(selectedView.sort || []);
  const pageSize = selectedView.rows_per_page || 100;


  // Handle filter changes
  const handleFiltersChange = (newFilterState: FilterState) => {
    setFilterState(newFilterState);
    onFilterStateChange?.(newFilterState);
    setPage(1); // Reset to first page when filters change
    fetchPage(1, newFilterState);
  };

  // Handle sort changes - trigger remote sorting
  const handleSortChanged = (event: any) => {
    // Get the sort model from the grid API
    const api = gridApiRef.current || event.api;
    if (!api) return;
    
    // Use the correct method to get sort model
    let sortModel: any[] = [];
    try {
      // Try the modern approach first
      if (api.getColumnState) {
        const columnState = api.getColumnState();
        sortModel = columnState
          .filter((col: any) => col.sort)
          .map((col: any) => ({ colId: col.colId, sort: col.sort }));
      } else if (api.getSortModel) {
        // Fallback to legacy method
        sortModel = api.getSortModel();
      }
    } catch (error) {
      console.error('Error getting sort model:', error);
      sortModel = [];
    }
    
    
    if (sortModel && sortModel.length > 0) {
      // Update the current sort state
      const newSort = [{
        field: sortModel[0].colId,
        dir: sortModel[0].sort
      }];
      setCurrentSort(newSort);
      // Debug: console.log('Updated sort:', newSort);
      // Fetch page 1 with new sort
      fetchPage(1, undefined, undefined, newSort);
    } else {
      // No sorting - clear sort and fetch page 1
      setCurrentSort([]);
      // Debug: console.log('Cleared sort');
      fetchPage(1, undefined, undefined, []);
    }
  };

  // Theme change listener
  useEffect(() => {
    const handleThemeChange = () => {
      const newThemeClass = getThemeClass();
      setThemeClass(prev => prev !== newThemeClass ? newThemeClass : prev);
    };

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          handleThemeChange();
        }
      });
    });

    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Persist view fields (width/order) per user+resource
  useEffect(() => {
    const key = makeViewStorageKey(resource);
    if (!key) return;
    const cachedRaw = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    if (!cachedRaw) {
      // Save a minimal structure housing fields to prime cache (8-day expiry handled elsewhere if needed)
      const payload = {
        data: [
          {
            type: resource,
            views: [
              {
                id: selectedView.id ?? 0,
                name: 'Default',
                selected: true,
                view: { ...selectedView },
              },
            ],
          },
        ],
      };
      try {
        window.localStorage.setItem(key, JSON.stringify(payload));
      } catch {}
    }
  }, [resource, selectedView]);

  const colDefs: ColDef[] = useMemo(() => {
    const preCols: ColDef[] = [];
    if (showIndexColumn) {
      preCols.push({
        headerName: '#',
        field: '__row_index__',
        width: 70,
        minWidth: 50,
        maxWidth: 90,
        pinned: 'left',
        suppressHeaderMenuButton: true,
        sortable: false,
        valueGetter: (p) => (p.data?.row_id ? p.data.row_id : (p.node?.rowIndex ?? 0) + 1),
        cellClass: 'text-right font-medium',
        cellStyle: { color: 'var(--ag-foreground-color)' },
      });
    }
    if (showOrderTypeColumn) {
      preCols.push({
        headerName: '',
        field: '__order_type__',
        width: 110,
        minWidth: 90,
        pinned: 'left',
        sortable: false,
        cellRenderer: (p: any) => {
          const orderType: string = p.data?.order_type || '';
          const location: string = p.data?.location || '';
          const status: number = Number(p.data?.order_status ?? 1);
          const statusLabel = status === 0 ? 'ON HOLD' : status === 2 ? 'RUSH' : '';
          return (
            <div className="flex flex-col gap-0.5 leading-tight">
              <div className="flex items-center justify-between gap-2">
                <OrderTypePill orderType={orderType} />
                <span className="text-xs text-[var(--font-color-100)]">{location || ''}</span>
              </div>
              {statusLabel ? (
                <span className="mt-0.5 inline-block px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-white">
                  {statusLabel}
                </span>
              ) : null}
            </div>
          );
        },
      });
    }
    // Flags / Invoice columns can be added later when needed.

    const defs = (selectedView.fields || []).map(mapFieldToColDef);
    return [...preCols, ...defs];
  }, [selectedView.fields, showIndexColumn, showOrderTypeColumn]);

  async function fetchPage(nextPage: number, customFilterState?: FilterState, customView?: GridSelectedView, customSort?: GridSortSpec[]) {
    const viewToUse = customView || selectedView;
    const baseFilter: GridFilter = initialFilters || viewToUse.filter;
    const currentFilterState = customFilterState || filterState;
    
    // Convert filter state to GridFilter format
    const filterConditions: GridFilterCondition[] = [];
    
    // Add filter state conditions
    Object.values(currentFilterState).forEach(filterValue => {
      if (Array.isArray(filterValue)) {
        // Handle array of FilterValue (date ranges, etc.)
        filterValue.forEach(fv => {
          if (fv && fv.value !== null && fv.value !== '') {
            filterConditions.push({
              field: fv.field,
              oper: fv.oper,
              value: fv.value,
            });
          }
        });
      } else if (filterValue && filterValue.value !== null && filterValue.value !== '') {
        // Handle single FilterValue
        // Handle multi-select values (comma-separated)
        if (filterValue.value.includes(',')) {
          // Multi-select: use 'in' operator
          filterConditions.push({
            field: filterValue.field,
            oper: 'in',
            value: filterValue.value,
          });
        } else {
          // Single value: use original operator
          filterConditions.push({
            field: filterValue.field,
            oper: filterValue.oper,
            value: filterValue.value,
          });
        }
      }
    });
    
    // Use AG Grid's built-in server-side filtering
    let currentFilter = baseFilter;
    if (gridApiRef.current) {
      const filterModel = gridApiRef.current.getFilterModel();
      if (Object.keys(filterModel).length > 0) {
        // Convert AG Grid filter model to our GridFilter format using AG Grid's native operators
        Object.entries(filterModel).forEach(([field, filterState]: [string, any]) => {
          if (filterState.filter) {
            // Use AG Grid's native filter type as the operator
            const oper = filterState.type || 'contains';
            filterConditions.push({
              field,
              oper,
              value: filterState.filter,
            });
          }
        });
      }
    }
    
    // Combine all filter conditions
    if (filterConditions.length > 0) {
      currentFilter = { and: filterConditions };
    }
    
    // Use custom sort if provided, otherwise use current sort state, otherwise use view sort
    const sortToUse = customSort || currentSort || viewToUse.sort || [];
    const sort = applyServerSort && sortToUse.length
      ? [{ [sortToUse[0]?.field || '']: sortToUse[0]?.dir || 'asc' }]    
      : [];
    
    // Debug: console.log('Fetching page with sort:', sort);
    
    try {
      const response = await onFetchRows(nextPage, pageSize, currentFilter, sort, undefined);
      setRows(response.rows || []);
      setTotal(response.total || 0);
      setPage(nextPage); // Update page state after successful API call
    } catch (error) {
      console.error('LunoAgGrid: API error', error);
    }
  }

  useEffect(() => {
    fetchPage(1);
  }, [rowsUrl, selectedView, initialFilters]);

  // Handle window resize to refresh grid on mobile/desktop transitions
  useEffect(() => {
    const handleResize = () => {
      
      if (gridApiRef.current) {
        // Refresh grid completely on resize to ensure data stays visible
        setTimeout(() => {
          gridApiRef.current?.redrawRows();
          // Force refresh of the entire grid
          gridApiRef.current?.refreshCells({ force: true });
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rows.length]);

  function onGridReady(e: GridReadyEvent) {
    gridApiRef.current = e.api;
    e.api.sizeColumnsToFit();
  }

  function onPaginationChanged() {
    const api = gridApiRef.current;
    if (!api) return;
    const currentPage = api.paginationGetCurrentPage() + 1;
    if (currentPage !== page) {
      setPage(currentPage);
      fetchPage(currentPage, undefined, undefined, currentSort);
    }
  }

  function onFilterChanged() {
    // Reset to page 1 when filters change
    setPage(1);
    fetchPage(1);
  }

  function persistColumnState() {
    try {
      const api = gridApiRef.current;
      if (!api) return;
      const allCols = api.getColumnDefs() || [];
      const currentState = api.getColumnDefs()?.map((c: any) => c.field) || [];
      // Derive order and widths from grid columns API
      const gridColumns = api.getColumns() || [];
      const order = gridColumns.map((gc) => gc.getColDef().field as string);
      const widthByField: Record<string, number> = {};
      gridColumns.forEach((gc) => {
        const f = gc.getColDef().field as string;
        widthByField[f] = gc.getActualWidth();
      });
      const newFields: GridFieldDef[] = order
        .filter((f) => !!f)
        .map((f) => {
          const original = (selectedView.fields || []).find((x) => x.field === f);
          return {
            field: f,
            alias: original?.alias || f,
            sortable: original?.sortable,
            align: original?.align,
            render: original?.render,
            min_width: original?.min_width,
            width: widthByField[f] || original?.width,
          } as GridFieldDef;
        });

      const payload = getCachedView(resource) || {
        data: [
          { type: resource, views: [{ id: selectedView.id ?? 0, name: 'Default', selected: true, view: { ...selectedView } }] },
        ],
      };
      payload.data[0].views = payload.data[0].views.map((v: any) => {
        if (v.selected) {
          v.view.fields = newFields;
        }
        return v;
      });
      setCachedView(resource, payload);
    } catch {}
  }

  function handleColumnResized(_e: ColumnResizedEvent) {
    persistColumnState();
  }

  function handleColumnMoved(_e: ColumnMovedEvent) {
    persistColumnState();
  }

  const themeAwareStyles = useMemo(() => getThemeAwareStyles(), [themeClass]);

  // Custom pagination panel component (without page size selector)
  const CustomPaginationPanel = () => {
    // Always show pagination panel, even if grid is not ready
    const startRow = (page - 1) * pageSize + 1;
    const endRow = Math.min(page * pageSize, total);
    const totalPages = Math.ceil(total / pageSize);
    const [pageInput, setPageInput] = useState(page.toString());
    
    // Update input when page changes
    useEffect(() => {
      setPageInput(page.toString());
    }, [page]);
    
    const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageInput(e.target.value);
    };
    
    const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const newPage = parseInt(pageInput);
        if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
          // Use fetchPage for remote pagination instead of AG Grid's built-in pagination
          fetchPage(newPage, undefined, undefined, currentSort);
        } else {
          // Reset to current page if invalid
          setPageInput(page.toString());
        }
      }
    };
    
    const handlePageInputBlur = () => {
      // Reset to current page if user clicks away without pressing Enter
      setPageInput(page.toString());
    };
    
    return (
      <div 
        className="flex items-center justify-between px-4 py-3 text-sm border-t min-h-[48px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        style={{
          color: 'var(--ag-foreground-color)',
          backgroundColor: 'var(--ag-header-background-color)',
          borderColor: 'var(--ag-border-color)'
        }}
      >
        <div className="font-medium">
          {total > 0 ? `${startRow} to ${endRow} of ${total.toLocaleString()} ${paginationWord}` : `0 ${paginationWord}`}
        </div>
        {total > 0 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => fetchPage(1, undefined, undefined, currentSort)}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 transition-colors"
            >
              First
            </button>
            <button
              onClick={() => fetchPage(page - 1, undefined, undefined, currentSort)}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1 px-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Page</span>
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyPress={handlePageInputKeyPress}
                onBlur={handlePageInputBlur}
                min="1"
                max={totalPages}
                className="w-12 px-2 py-1 text-xs text-center border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">of {totalPages}</span>
            </div>
            <button
              onClick={() => fetchPage(page + 1, undefined, undefined, currentSort)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 transition-colors"
            >
              Next
            </button>
            <button
              onClick={() => fetchPage(totalPages, undefined, undefined, currentSort)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-700 transition-colors"
            >
              Last
            </button>
          </div>
        )}
      </div>
    );
  };

  const containerClass = containerSize === 'compact' 
    ? 'grid-container-compact' 
    : containerSize === 'large' 
    ? 'grid-container-large' 
    : 'grid-container';

  return (
    <div className="w-full">
      {/* Filter Panel */}
      {showFilters && Object.keys(filters).length > 0 && (
        <GridFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}
      
      {/* Grid Container */}
      <div 
        className={`w-full ${themeClass} rounded-md border flex flex-col ${containerClass}`} 
        style={{ 
          borderColor: 'var(--ag-border-color)',
          backgroundColor: 'var(--ag-background-color)',
          ...themeAwareStyles
        }}
      >
        <div className="flex-1 overflow-hidden">
          <AgGridReact
            theme="legacy"
            rowData={rows}
            columnDefs={colDefs}
            onGridReady={onGridReady}
            onRowClicked={(ev) => onRowClicked?.(ev.data)}
            defaultColDef={{ 
              resizable: true, 
              sortable: true,
              unSortIcon: false, // Hide unsort icon since we only have asc/desc
              // As of AG Grid v33+, use defaultColDef.sortingOrder instead of top-level prop
              sortingOrder: ['asc', 'desc']
            }}
            onColumnResized={handleColumnResized}
            onColumnMoved={handleColumnMoved}
            onFilterChanged={onFilterChanged}
            onSortChanged={handleSortChanged}
            pagination={false}
            suppressCellFocus
            animateRows
            domLayout="normal"
            suppressPaginationPanel
            rowSelection={{
              mode: 'singleRow',
              checkboxes: false,
              enableClickSelection: true
            }}
            multiSortKey="ctrl"
            getRowStyle={(params) => ({
              backgroundColor: (params.node?.rowIndex ?? 0) % 2 === 0 ? 'var(--ag-even-row-background-color)' : 'var(--ag-odd-row-background-color)',
              color: 'var(--ag-foreground-color)',
            })}
            headerHeight={44}
            rowHeight={48}
          />
        </div>
        <CustomPaginationPanel />
      </div>
    </div>
  );
}

export default LunoAgGrid;


