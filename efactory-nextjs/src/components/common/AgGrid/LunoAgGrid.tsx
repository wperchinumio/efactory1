import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, GridApi, GridReadyEvent, ColumnResizedEvent, ColumnMovedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getAuthToken } from '@/lib/auth/storage';
import { getCachedViewApiResponseIfExist, cacheViewApiResponse, removeExpiredViewsFromStorage } from '@/lib/grid/viewCache';
import type { GridFieldDef, GridFilter, GridFilterCondition, GridRowResponse, GridSelectedView, GridSortSpec } from '@/types/api/grid';
import type { FilterConfig, FilterState } from '@/types/api/filters';
import { DateRenderer, DateTimeRenderer, NumberRenderer, PrimaryLinkRenderer, OrderTypePill, OrderStageRenderer, OrderStatusRenderer, ShipToRenderer, CarrierRenderer, TrackingRenderer, RmaLinkRenderer, ReturnTrakRenderer, StrongTextRenderer, PrimaryEmphasisRenderer, WarningTextRenderer, BoolRenderer, RmaTypeRenderer, BundleTypeRenderer, BundlePLRenderer, FilterLinkNumberRenderer, ItemLinkRenderer, BundleLinkRenderer, InvoiceRenderer, InvoiceLinksRenderer } from './renderers';
import { downloadInvoiceDetail, downloadInvoicePdf } from '@/services/api';
import GridFilters from '@/components/filters/grid/GridFilters';
import LoadingSpinner, { SkeletonGrid } from '@/components/common/LoadingSpinner';
import { useGridCache } from '@/contexts/GridCacheContext';

export interface LunoAgGridProps<T = any> {
  resource: string; // e.g., 'fulfillment-open'
  rowsUrl: string; // e.g., '/api/fulfillment'
  selectedView: GridSelectedView; // columns, default filter/sort/paging
  initialFilters?: GridFilter; // optional overrides/merges
  onFetchRows: (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any) => Promise<GridRowResponse<T>>;
  paginationWord?: string; // for external display
  applyServerSort?: boolean;
  onRowClicked?: (row: T, event?: any) => void;
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
  // Provide refresh/reset controls to parent without remounting (preserve AG Grid filter model)
  onProvideRefresh?: (api: { refresh: () => void; resetAll: () => void }) => void;
  // Row selection
  selectedRowIndex?: number | undefined; // Index of row to select when grid loads
  selectedRowData?: T | undefined; // Data of row to select when grid loads
  // Scroll position
  scrollTop?: number | undefined; // Vertical scroll position to restore
  scrollLeft?: number | undefined; // Horizontal scroll position to restore
  // AG Grid header filter model persistence (optional)
  initialAgFilterModel?: any;
  onAgFilterModelChange?: (model: any) => void;
  // Initial filter state for the UI filter panel
  initialFilterState?: FilterState;
}

// Ensure community modules are registered once
try {
  ModuleRegistry.registerModules([AllCommunityModule]);
} catch {}

/**
 * VIEW_WIDTH_OFFSET_PX
 *
 * Temporary visual calibration for column widths coming from the legacy /views API.
 * The same view definitions are shared by legacy and the new app. In the new app
 * (AG Grid Quartz + Tailwind), columns render slightly narrower due to different
 * paddings and font metrics. To preserve parity without changing server data, we
 * add a small offset here. When persisting widths locally or back to the server,
 * subtract this constant to keep the stored width identical to the legacy value.
 */
const VIEW_WIDTH_OFFSET_PX = 30;

// Fields reserved for legacy fixed columns; should not be rendered from view API
const INTERNAL_COLUMN_FIELDS = new Set<string>([
  '__row_index__',
  '__order_type__',
  '__flags__',
  '__invoice_all__',
]);

function mapFieldToColDef(field: GridFieldDef, cachedWidths?: Record<string, number>): ColDef {
  const colDef: ColDef = {
    field: field.field,
    headerName: field.alias,
    sortable: field.sortable !== false, // Enable sorting by default unless explicitly disabled
    minWidth: field.min_width ?? 50,
    cellDataType: field.data_type === 'number' ? 'number' : 
                  field.data_type === 'date' || field.data_type === 'datetime' ? 'date' : 
                  'text', // Map data types to AG Grid supported types
    cellClass: () => {
      const align = (field.align || 'left').toLowerCase();
      // Use AG Grid's native alignment classes to work with flex cell layout
      if (align === 'right') return ['ag-right-aligned-cell', 'text-right'];
      if (align === 'center') return ['ag-center-aligned-cell', 'text-center'];
      return ['text-left'];
    },
    // Enforce flex justification for Quartz theme which uses flex cells
    cellStyle: () => {
      const align = (field.align || 'left').toLowerCase();
      const justify = align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start';
      return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: justify as any,
        textAlign: align as any,
      } as any;
    },
  };

  // Use cached width if available, otherwise use field width, then apply offset
  const width = cachedWidths?.[field.field] ?? field.width;
  if (typeof width === 'number' && !Number.isNaN(width)) {
    colDef.width = Math.max(0, width + VIEW_WIDTH_OFFSET_PX);
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
        closeOnApply: true,
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
        closeOnApply: true,
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
        closeOnApply: true,
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
      colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (id === 'fmtorderorrmalink') {
      colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (id === 'fmtrmalink') {
      colDef.cellRenderer = (p: any) => <RmaLinkRenderer value={p.value} data={p.data} />;
    } else if (id === 'fmtreturntrak') {
      colDef.cellRenderer = (p: any) => <ReturnTrakRenderer value={p.value} data={p.data} />;
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
    } else if (id === 'fmtitemlink') {
      colDef.cellRenderer = (p: any) => <ItemLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (id === 'fmtbundlelink') {
      colDef.cellRenderer = (p: any) => <BundleLinkRenderer value={p.value} data={p.data} />;
    } else if (id === 'fmtrtlink') {
      colDef.cellRenderer = (p: any) => <ReturnTrakRenderer value={p.value} data={p.data} />;
    } else if (id === 'fmtinv') {
      colDef.cellRenderer = (p: any) => <InvoiceRenderer data={p.data} />;
    } else if (id === 'fmtinvlinks') {
      colDef.cellRenderer = (p: any) => <InvoiceLinksRenderer data={p.data} />;
    } else if (id === 'fmtstrong') {
      colDef.cellRenderer = (p: any) => <StrongTextRenderer value={p.value} />;
    } else if (id === 'fmtmain') {
      colDef.cellRenderer = (p: any) => <PrimaryEmphasisRenderer value={p.value} />;
    } else if (id === 'fmtwarning') {
      colDef.cellRenderer = (p: any) => <WarningTextRenderer value={p.value} />;
    } else if (id === 'fmtbool') {
      colDef.cellRenderer = (p: any) => <BoolRenderer value={p.value} />;
    } else if (id === 'fmtrmatype') {
      colDef.cellRenderer = (p: any) => <RmaTypeRenderer value={p.value} />;
    } else if (id === 'fmtbundletype') {
      colDef.cellRenderer = (p: any) => <BundleTypeRenderer value={p.value} />;
    } else if (id === 'fmtbundlepl') {
      colDef.cellRenderer = (p: any) => <BundlePLRenderer value={p.value} />;
    } else if (
      id === 'fmtdemandqty' || id === 'fmtdemandqty2' || id === 'fmtqonhandlink' || id === 'fmtqonholdlink' || id === 'fmtqonfflink' || id === 'fmtqopenpolink' || id === 'fmtqopenrmalink' || id === 'fmtqopenwolink' || id === 'fmtbeginbalancelink' || id === 'fmtsalesqtylink' || id === 'fmtreceiptslink' || id === 'fmtassembledqtylink' || id === 'fmttransferqtylink' || id === 'fmtadjustedqtylink' || id === 'fmtreturnqtylink' || id === 'fmtcountadjustedlink' || id === 'fmtqtyshippedlink' || id === 'fmtqtyalllink'
    ) {
      // Approximate legacy FilterLink behavior by linking to current path with qf_* params
      const dec = Number(args[0] || '0');
      colDef.cellRenderer = (p: any) => <FilterLinkNumberRenderer value={p.value} field={p.colDef.field} decimals={dec} />;
    }
  }

  // Fallbacks (safe): only apply when no renderer was set above
  if (!colDef.cellRenderer && field.field) {
    const ff = field.field.toLowerCase();
    if (ff === 'order_stage') {
      colDef.cellRenderer = (p: any) => <OrderStageRenderer value={p.value} data={p.data} />;
    } else if (ff === 'order_number') {
      colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (ff === 'item_number' || ff.endsWith('item_number')) {
      colDef.cellRenderer = (p: any) => <ItemLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (ff === 'rma_number' || ff.endsWith('rma_number') || ff === 'rma_num' || ff.endsWith('rma_num') || ff === 'rma#' || ff.includes('rma_number') || ff.includes('rma_num')) {
      colDef.cellRenderer = (p: any) => <ReturnTrakRenderer value={p.value} data={p.data} />;
    }
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
    '--ag-header-height': '44px',
    '--ag-row-height': '44px',
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
  onProvideRefresh,
  selectedRowIndex,
  selectedRowData,
  scrollTop,
  scrollLeft,
  initialAgFilterModel,
  onAgFilterModelChange,
  initialFilterState,
}: LunoAgGridProps<T>) {
  const gridApiRef = useRef<GridApi | null>(null);
  const gridCache = useGridCache();
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [themeClass, setThemeClass] = useState(() => getThemeClass());
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const initial = initialFilterState || {};
    console.log('🔥 LunoAgGrid: Initializing filterState with:', JSON.stringify(initial));
    return initial;
  });
  const [cachedView, setCachedViewState] = useState<GridSelectedView | null>(() => {
    // Synchronously read cached view BEFORE first render to avoid flicker
    try {
      removeExpiredViewsFromStorage();
      const cached = getCachedViewApiResponseIfExist(resource);
      if (cached?.data?.[0]?.views?.[0]?.view) {
        const view = cached.data[0].views[0].view as GridSelectedView;
        // Filter out internal fields to avoid flashing raw names
        view.fields = (view.fields || []).filter((f: any) => !INTERNAL_COLUMN_FIELDS.has(f.field));
        return view;
      }
    } catch {}
    return null;
  });
  const [currentSort, setCurrentSort] = useState<GridSortSpec[]>(
    (selectedView?.sort && selectedView.sort.length ? selectedView.sort : (cachedView?.sort || [])) || []
  );
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(() => !Boolean(cachedView));
  const [loading, setLoading] = useState(false);
  const pageSize = selectedView.rows_per_page || 100;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const [containerPxHeight, setContainerPxHeight] = useState<number | null>(null);
  const isBatchingResetRef = useRef<boolean>(false);
  const [filtersInitialOverride, setFiltersInitialOverride] = useState<FilterState | null>(null);
  const [filterResetKey, setFilterResetKey] = useState(0);

  // Keep cached view up to date if resource changes (rare)
  useEffect(() => {
    try {
      removeExpiredViewsFromStorage();
      const cached = getCachedViewApiResponseIfExist(resource);
      if (cached?.data?.[0]?.views?.[0]?.view) {
        const view = cached.data[0].views[0].view as GridSelectedView;
        setCachedViewState(view);
        setIsInitialLoad(false);
      }
    } catch (e) {}
  }, [resource]);

  // Update cached view when selectedView changes (after API call)
  useEffect(() => {
    if (selectedView && Array.isArray(selectedView.fields)) {
      const fieldCount = selectedView.fields.length || 0;
      if (fieldCount > 0) {
        setCachedViewState(selectedView);
        setIsInitialLoad(false);
        // Cache only if it contains fields
        const viewApiResponse = {
          data: [{
            type: resource,
            url: rowsUrl,
            views: [{
              id: selectedView.id ?? 0,
              name: 'Default',
              selected: true,
              view: selectedView
            }]
          }]
        };
        cacheViewApiResponse(resource, viewApiResponse);
      } else {
        
      }
    }
  }, [selectedView, resource]);


  // Handle filter changes
  const handleFiltersChange = (newFilterState: FilterState) => {
    setFilterState(newFilterState);
    onFilterStateChange?.(newFilterState);
    if (isBatchingResetRef.current) return; // skip fetching while Reset All is batching
    setPage(1); // Reset to first page when filters change
    fetchPage(1, newFilterState);
  };

  // Reset All: restore server view.filter, clear AG Grid header filters, and refetch
  const handleResetAll = () => {
    const api = gridApiRef.current;
    if (api) {
      try {
        isBatchingResetRef.current = true;
        // Clear all AG Grid header filters (floating filters) and quick filter
        try { (api as any).setQuickFilter && (api as any).setQuickFilter(''); } catch {}
        try { api.setFilterModel(null as any); } catch {}
        try {
          const cols = (api.getColumns && api.getColumns()) || [];
          const colIds = cols.map((c: any) => (c && c.getColId ? c.getColId() : c?.colId)).filter(Boolean);
          colIds.forEach((id: string) => {
            try {
              const inst = (api as any).getFilterInstance ? (api as any).getFilterInstance(id) : null;
              if (inst && typeof inst.setModel === 'function') {
                inst.setModel(null);
                if (typeof inst.applyModel === 'function') inst.applyModel();
                if (typeof inst.onBtApply === 'function') inst.onBtApply();
              }
            } catch {}
            // As a stronger measure, destroy the filter so floating UI resets
            try { (api as any).destroyFilter && (api as any).destroyFilter(id); } catch {}
          });
        } catch {}
        try { (api as any).onFilterChanged && (api as any).onFilterChanged(); } catch {}
        try { (api as any).refreshHeader && (api as any).refreshHeader(); } catch {}
      } catch {}
    }
    const viewToUse = cachedView || selectedView;
    // Always reset to the server-provided default view filter
    const base = viewToUse?.filter;
    const resetState = mapGridFilterToFilterState(base);
    
    console.log('🔥 RESET ALL - server filter:', base);
    console.log('🔥 RESET ALL - mapped resetState:', resetState);
    console.log('🔥 RESET ALL - current filterState:', filterState);
    
    // Force GridFilters to remount with new key to ensure UI updates
    setFilterResetKey(prev => prev + 1);
    // Set an explicit initial override so the Filter panel immediately reflects the reset
    setFiltersInitialOverride(resetState);
    // Update our internal state so fetch logic uses the same values
    setFilterState(resetState);
    onFilterStateChange?.(resetState);
    setPage(1);
    // Perform exactly one fetch after batch clearing is done (delay a tick to let UI settle)
    setTimeout(() => {
      fetchPage(1, resetState);
      isBatchingResetRef.current = false;
      // Clear the override after a short delay to ensure GridFilters has processed it
      setTimeout(() => {
        setFiltersInitialOverride(null);
      }, 100);
    }, 0);
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

  // Dynamically compute available height for the grid container so pagination stays visible
  useEffect(() => {
    const recalc = () => {
      if (!containerRef.current) return;
      // On mobile, let CSS handle full-height layout
      if (window.innerWidth < 768) {
        setContainerPxHeight(null);
        return;
      }
      // Top of the container relative to viewport (desktop/tablet)
      const rect = containerRef.current.getBoundingClientRect();
      const top = rect.top;
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      // Neutral offset so pagination sits nearly flush without extra gap
      const available = Math.max(360, Math.floor(viewport - top));
      setContainerPxHeight(available);
    };

    recalc();
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    // Observe filter panel height changes (wrapping from 1 to 2 rows)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => recalc());
      if (filtersRef.current) ro.observe(filtersRef.current);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      if (ro && filtersRef.current) ro.disconnect();
    };
  }, [resource]);

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
        // Store widths without visual offset
        const sanitized = JSON.parse(JSON.stringify(payload));
        try {
          const fields = sanitized?.data?.[0]?.views?.[0]?.view?.fields || [];
          fields.forEach((f: any) => {
            if (typeof f.width === 'number') f.width = Math.max(0, f.width - VIEW_WIDTH_OFFSET_PX);
          });
        } catch {}
        window.localStorage.setItem(key, JSON.stringify(sanitized));
      } catch {}
    }
  }, [resource, selectedView]);

  const colDefs: ColDef[] = useMemo(() => {
    // Use cached view immediately if available, otherwise use selectedView
    const viewToUse = cachedView || selectedView;
    const cachedWidths: Record<string, number> = {};
    
    if (viewToUse?.fields) {
      viewToUse.fields.forEach((field: any) => {
        if (INTERNAL_COLUMN_FIELDS.has(field.field)) return;
        if (field.width) {
          cachedWidths[field.field] = field.width;
        }
      });
    }

    const preCols: ColDef[] = [];
    if (showIndexColumn) {
      preCols.push({
        headerName: '#',
        field: '__row_index__',
        width: 80,
        minWidth: 60,
        maxWidth: 100,
        pinned: 'left',
        suppressHeaderMenuButton: true,
        sortable: false,
        valueGetter: (p) => (p.data?.row_id ? p.data.row_id : (p.node?.rowIndex ?? 0) + 1),
        cellClass: 'text-right font-semibold text-font-color-100',
        cellStyle: { 
          color: 'var(--ag-foreground-color)',
          fontSize: '13px',
          letterSpacing: '0.025em'
        },
      });
    }
    if (showOrderTypeColumn) {
      preCols.push({
        headerName: '',
        field: '__order_type__',
        width: 130,
        minWidth: 110,
        pinned: 'left',
        sortable: false,
        cellRenderer: (p: any) => {
          const orderType: string = p.data?.order_type || '';
          const location: string = p.data?.location || '';
          const status: number = Number(p.data?.order_status ?? 1);
          const statusLabel = status === 0 ? 'ON HOLD' : status === 2 ? 'RUSH' : '';
          return (
            <div className="relative w-full h-full">
              <OrderTypePill orderType={orderType} />
              <span className="absolute top-0 right-0 text-[11px] font-medium text-font-color-100">
                {location || ''}
              </span>
              {statusLabel ? (
                <div className="-mt-0.5">
                  <span className="inline-block text-[9px] font-bold"
                  style={{
                    color: statusLabel === 'ON HOLD' ? '#c11515' : '#8775a7'
                  }}>
                    {statusLabel}
                  </span>
                </div>
              ) : null}
            </div>
          );
        },
      });
    }
    // Add Invoice column (icons) similar to legacy when requested
    if (showInvoiceAllColumn) {
      preCols.push({
        headerName: '',
        field: '__invoice_all__',
        width: 100,
        minWidth: 90,
        maxWidth: 130,
        pinned: null,
        sortable: false,
        suppressHeaderMenuButton: true,
        cellRenderer: (p: any) => {
          const hasInvoice = !!p.data?.url_invoice;
          const hasInvoiceDetail = !!p.data?.url_invoice_detail;
          const docNo = p.data?.doc_no;
          if (!hasInvoice && !hasInvoiceDetail) return <span />;
          return (
            <span className="inline-flex items-center gap-2">
              {hasInvoice ? (
                <a
                  href="#"
                  title="Invoice (PDF)"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (docNo) downloadInvoicePdf(String(docNo)); }}
                  className="text-red-600"
                >
                  🧾
                </a>
              ) : null}
              {hasInvoiceDetail ? (
                <a
                  href="#"
                  title="Invoice Detail (Excel)"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (docNo) downloadInvoiceDetail(String(docNo)); }}
                  className="text-green-700"
                >
                  📊
                </a>
              ) : null}
            </span>
          );
        }
      });
    }

    const defs = (viewToUse.fields || [])
      .filter((f: any) => !INTERNAL_COLUMN_FIELDS.has(f.field))
      .map(field => mapFieldToColDef(field, cachedWidths));
    return [...preCols, ...defs];
  }, [cachedView, selectedView.fields, showIndexColumn, showOrderTypeColumn, resource]);

  // Convert GridFilter (from server view.filter) to FilterState for the filter panel UI
  function mapGridFilterToFilterState(filter?: GridFilter): FilterState {
    const state: FilterState = {};
    if (!filter || !Array.isArray((filter as any).and)) return state;
    const byField: Record<string, GridFilterCondition[]> = {};
    (filter.and || []).forEach((cond) => {
      if (!cond || !cond.field) return;
      const key: string = cond.field as string;
      if (!byField[key]) byField[key] = [];
      byField[key]!.push(cond);
    });
    Object.entries(byField).forEach(([field, conditions]) => {
      if (conditions.length <= 1) {
        const c = conditions[0];
        if (c) {
          state[field] = { field: c.field, oper: c.oper, value: c.value };
        }
      } else {
        // Prefer a pair of ">=" and "<=" for date ranges
        const first = conditions[0]!;
        const second = (conditions[1] || conditions[0])!;
        const start = conditions.find((c) => c.oper === '>=') || first;
        const end = conditions.find((c) => c.oper === '<=') || second;
        if (start && end) {
          state[field] = [
            { field: start.field, oper: start.oper, value: start.value },
            { field: end.field, oper: end.oper, value: end.value },
          ];
        }
      }
    });
    return state;
  }

  const filterPanelInitialState: FilterState = useMemo(() => {
    const viewToUse = cachedView || selectedView;
    // Always show server default filters in the panel's Reset baseline
    const base = viewToUse?.filter;
    return mapGridFilterToFilterState(base);
  }, [cachedView, selectedView]);

  // What the panel should display: if we currently have a user-applied filterState, prefer it;
  // otherwise fall back to the server default baseline.
  // Initialize filterState from server baseline on first view load (unless parent provides initialFilters)
  const didInitFilterStateRef = useRef<boolean>(false);
  const hasInitialFilterStateRef = useRef<boolean>(!!initialFilterState);
  
  useEffect(() => {
    if (didInitFilterStateRef.current) return;
    if (initialFilters) return; // parent-driven init handled elsewhere
    
    // Skip if we already have initialFilterState (it was set in useState)
    if (hasInitialFilterStateRef.current) {
      didInitFilterStateRef.current = true;
      console.log('🔥 Using initialFilterState from cache:', JSON.stringify(initialFilterState));
      return;
    }
    
    if (cachedView || selectedView) {
      didInitFilterStateRef.current = true;
      const base = (cachedView || selectedView)?.filter;
      const init = mapGridFilterToFilterState(base);
      console.log('🔥 LunoAgGrid: Setting filterState from view filter:', JSON.stringify(init));
      setFilterState(init);
    }
  }, [cachedView, selectedView, initialFilters]);

  async function fetchPage(nextPage: number, customFilterState?: FilterState, customView?: GridSelectedView, customSort?: GridSortSpec[], forceRefresh?: boolean) {
    
    // Remove the blocking check - let onFetchRows handle the cache logic
    const pageKey = resource;
    const returningFromOverview = gridCache.isReturningFromOverview(pageKey);
    console.log(`📞 fetchPage: pageKey: ${pageKey}, returningFromOverview:`, returningFromOverview);
    
    // If rowsUrl isn't ready yet, keep the loading overlay visible and wait
    if (!rowsUrl) {
      console.log('🚫 fetchPage: BLOCKED - no rowsUrl');
      return;
    }

    // Let GridPage handle all cache logic - just call onFetchRows directly
    // The cache check is handled in GridPage.onFetchRows
    const viewToUse = customView || cachedView || selectedView;
    // Always use server-provided default as base; UI/AG filters overlay on top
    const baseFilter: GridFilter = viewToUse.filter;
    const currentFilterState = customFilterState || filterState;

    // Helpers: normalize FilterState and AG Grid model into GridFilterCondition[] and merge by field
    const buildConditionsFromFilterState = (state: FilterState): GridFilterCondition[] => {
      const conditions: GridFilterCondition[] = [];
      Object.values(state).forEach((filterValue) => {
        if (Array.isArray(filterValue)) {
          filterValue.forEach((fv) => {
            if (fv && fv.value !== null && fv.value !== '') {
              conditions.push({ field: fv.field, oper: fv.oper, value: fv.value });
            }
          });
        } else if (filterValue && (filterValue as any).value !== null && (filterValue as any).value !== '') {
          const v = (filterValue as any).value;
          const fieldName = (filterValue as any).field;
          const oper = (filterValue as any).oper;
          if (Array.isArray(v)) {
            conditions.push({ field: fieldName, oper: 'in', value: v.join(',') });
          } else if (typeof v === 'string' && v.includes(',')) {
            conditions.push({ field: fieldName, oper: 'in', value: v });
          } else {
            conditions.push({ field: fieldName, oper, value: v });
          }
        }
      });
      return conditions;
    };

    const buildConditionsFromAgModel = (): GridFilterCondition[] => {
      const conditions: GridFilterCondition[] = [];
      if (!gridApiRef.current) return conditions;
      const filterModel = gridApiRef.current.getFilterModel();
      if (!filterModel || Object.keys(filterModel).length === 0) return conditions;
      Object.entries(filterModel).forEach(([field, fm]: [string, any]) => {
        if (fm && fm.filter !== undefined && fm.filter !== null && fm.filter !== '') {
          const oper = fm.type || 'contains';
          conditions.push({ field, oper, value: fm.filter });
        }
      });
      return conditions;
    };

    const groupByField = (arr: GridFilterCondition[]): Record<string, GridFilterCondition[]> => {
      const byField: Record<string, GridFilterCondition[]> = {};
      arr.forEach((c) => {
        if (!c || !c.field) return;
        const key = String(c.field);
        if (!byField[key]) byField[key] = [];
        byField[key]!.push(c);
      });
      return byField;
    };

    const baseConditions = Array.isArray((baseFilter as any)?.and) ? ((baseFilter as any).and as GridFilterCondition[]) : [];
    const uiConditions = buildConditionsFromFilterState(currentFilterState);
    const agConditions = buildConditionsFromAgModel();

    // Merge with precedence: base < UI filters < AG Grid header filters
    const mergedByField = {
      ...groupByField(baseConditions),
    } as Record<string, GridFilterCondition[]>;

    const applyOverlay = (overlay: GridFilterCondition[]) => {
      const g = groupByField(overlay);
      Object.keys(g).forEach((field) => {
        mergedByField[field] = g[field]!; // replace existing field conditions entirely
      });
    };

    applyOverlay(uiConditions);
    applyOverlay(agConditions);

    const mergedConditions: GridFilterCondition[] = Object.values(mergedByField).flat();

    // Final currentFilter with merged conditions
    let currentFilter: GridFilter = baseFilter;
    if (mergedConditions.length > 0) {
      currentFilter = { and: mergedConditions };
    }
    
    // Add cache-busting timestamp if forceRefresh is true
    if (forceRefresh) {
      currentFilter = {
        ...currentFilter,
        _timestamp: Date.now()
      } as any;
    }
    
    // Use custom sort if provided, otherwise use current sort state, otherwise use view sort
    const sortToUse = customSort || currentSort || viewToUse.sort || [];
    const sort = applyServerSort && sortToUse.length
      ? [{ [sortToUse[0]?.field || '']: sortToUse[0]?.dir || 'asc' }]    
      : [];
    
    // Debug: console.log('Fetching page with sort:', sort);
    
    setLoading(true);
    try {
      const response = await onFetchRows(nextPage, pageSize, currentFilter, sort, undefined);
      setRows(response.rows || []);
      setTotal(response.total || 0);
      setPage(nextPage); // Update page state after successful API call
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }

  // Apply incoming initialFilters (from parent preservation) as UI filters on mount/update
  const appliedInitialRef = useRef<string | null>(null);
  useEffect(() => {
    try {
      if (!initialFilters) return;
      const key = JSON.stringify(initialFilters);
      if (appliedInitialRef.current === key) return;
      appliedInitialRef.current = key;
      const uiState = mapGridFilterToFilterState(initialFilters);
      console.log('🎯 Restoring filter state from cache:', uiState);
      setFiltersInitialOverride(uiState);
      setFilterState(uiState);
      setPage(1);
      // Defer fetch until grid API is ready so AG header model can overlay correctly
      if (gridApiRef.current) {
        fetchPage(1, uiState);
      }
      // Clear the override after a short delay to ensure GridFilters has processed it
      setTimeout(() => {
        setFiltersInitialOverride(null);
      }, 100);
    } catch {}
  }, [initialFilters]);
  const didInitialFetchRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Single initial fetch per mount once rowsUrl is ready
    if (!didInitialFetchRef.current && rowsUrl && (cachedView || selectedView)) {
      console.log('🎯 LunoAgGrid: Making initial data fetch', { rowsUrl, hasCachedView: !!cachedView, hasSelectedView: !!selectedView });
      didInitialFetchRef.current = true;
      
      // Just call fetchPage - it will check if we're returning from overview
      fetchPage(1);
    }
  }, [rowsUrl, cachedView, selectedView, resource]);

  // Expose refresh/reset API to parent so refresh does not reset grid filters
  useEffect(() => {
    if (!onProvideRefresh) return;
    const api = {
      refresh: () => {
        // Re-fetch current page using current AG Grid filter model and sort with ALL filters
        const nextPage = page || 1;
        fetchPage(nextPage, undefined, undefined, undefined, true); // forceRefresh = true
      },
      resetAll: () => {
        handleResetAll();
      },
      getFilterModel: () => {
        try { return gridApiRef.current?.getFilterModel?.() || null; } catch { return null; }
      },
      setFilterModel: (model: any) => {
        try {
          if (gridApiRef.current && model) {
            gridApiRef.current.setFilterModel(model);
            (gridApiRef.current as any).onFilterChanged && (gridApiRef.current as any).onFilterChanged();
          }
        } catch {}
      }
    };
    try {
      onProvideRefresh(api);
    } catch {}
  }, [onProvideRefresh, page, selectedView, rowsUrl, cachedView]);

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

  // Scroll position tracking
  const handleScroll = useCallback(() => {
    const api = gridApiRef.current;
    if (!api) return;
    
    const gridBodyViewport = (api as any).getGridBodyContainer?.() || document.querySelector('.ag-body-viewport');
    if (gridBodyViewport) {
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Debounce scroll position saving
      scrollTimeoutRef.current = setTimeout(() => {
        // This will be handled by the parent component
        // We'll emit the scroll position through a callback
        if (onProvideRefresh) {
          // We can extend the refresh API to include scroll position saving
          // For now, we'll store it in a way that can be accessed by the parent
          (api as any).__lastScrollTop = gridBodyViewport.scrollTop;
          (api as any).__lastScrollLeft = gridBodyViewport.scrollLeft;
        }
      }, 300);
    }
  }, [onProvideRefresh]);

  // Pre-render scroll positioning to eliminate flash
  useEffect(() => {
    if (scrollTop !== undefined && scrollLeft !== undefined) {
      // Set initial state to hidden to prevent flash
      const gridContainer = document.querySelector('.ag-root-wrapper');
      if (gridContainer) {
        (gridContainer as HTMLElement).style.visibility = 'hidden';
        (gridContainer as HTMLElement).style.opacity = '0';
      }
    }
  }, [scrollTop, scrollLeft]);


  // Use AG Grid's built-in row positioning with proper data loading timing
  useEffect(() => {
    if (selectedRowIndex !== undefined && selectedRowData && gridApiRef.current) {
      const positionRow = () => {
        const api = gridApiRef.current;
        if (api) {
          // Try different ways to find the row
          let targetRowNode = null;
          
          // Method 1: By row index
          targetRowNode = api.getRowNode(selectedRowIndex.toString());
          
          // Method 2: By data matching
          if (!targetRowNode && selectedRowData) {
            api.forEachNode((node: any) => {
              if (node.data && JSON.stringify(node.data) === JSON.stringify(selectedRowData)) {
                targetRowNode = node;
              }
            });
          }
          
          // Method 3: By order_number or item_number if available
          if (!targetRowNode && selectedRowData) {
            const sr: any = selectedRowData as any;
            const keyField: 'order_number' | 'item_number' | null = sr.order_number ? 'order_number' : 
                           sr.item_number ? 'item_number' : null;
            if (keyField) {
              api.forEachNode((node: any) => {
                const nd: any = node.data;
                if (nd && sr && nd[keyField] === sr[keyField]) {
                  targetRowNode = node;
                }
              });
            }
          }
          
          if (targetRowNode) {
            // Use the actual row index from the found node
            const actualRowIndex = targetRowNode.rowIndex;
            
            // First, ensure the row is visible (this handles scrolling automatically)
            api.ensureIndexVisible(Number(actualRowIndex ?? 0), 'middle');
            
            // Then select the row
            api.deselectAll();
            targetRowNode.setSelected(true);
            
            // Show the grid after positioning
            const gridContainer = document.querySelector('.ag-root-wrapper');
            if (gridContainer) {
              (gridContainer as HTMLElement).style.visibility = '';
              (gridContainer as HTMLElement).style.opacity = '';
            }
            return true;
          } else {
            return false;
          }
        }
        return false;
      };

      // Use AG Grid's firstDataRendered event to ensure data is loaded
      const api = gridApiRef.current;
      const handleFirstDataRendered = () => {
        // Try positioning with multiple attempts
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryPositioning = () => {
          attempts++;
          
          if (positionRow()) {
            if (api && !api.isDestroyed && api.removeEventListener) {
              api.removeEventListener('firstDataRendered', handleFirstDataRendered);
            }
          } else if (attempts < maxAttempts) {
            setTimeout(tryPositioning, 100);
          } else {
            const gridContainer = document.querySelector('.ag-root-wrapper');
            if (gridContainer) {
              (gridContainer as HTMLElement).style.visibility = '';
              (gridContainer as HTMLElement).style.opacity = '';
            }
            if (api && !api.isDestroyed && api.removeEventListener) {
              api.removeEventListener('firstDataRendered', handleFirstDataRendered);
            }
          }
        };

        // Start positioning after a small delay to ensure DOM is ready
        setTimeout(tryPositioning, 50);
      };

      // Listen for first data rendered event
      api.addEventListener('firstDataRendered', handleFirstDataRendered);
      
      // Cleanup function
      return () => {
        if (api && !api.isDestroyed && api.removeEventListener) {
          api.removeEventListener('firstDataRendered', handleFirstDataRendered);
        }
      };
    } else if (scrollTop !== undefined && scrollLeft !== undefined && gridApiRef.current) {
      // Fallback to manual scroll if no row index provided
      const viewport = document.querySelector('.ag-body-viewport');
      if (viewport) {
        viewport.scrollTop = scrollTop;
        viewport.scrollLeft = scrollLeft;
      }
      
      const gridContainer = document.querySelector('.ag-root-wrapper');
      if (gridContainer) {
        (gridContainer as HTMLElement).style.visibility = '';
        (gridContainer as HTMLElement).style.opacity = '';
      }
    }
  }, [selectedRowIndex, selectedRowData, scrollTop, scrollLeft, gridApiRef.current]);

  // Row selection is now handled in onGridReady for better timing

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      // Clean up scroll event listener
      const api = gridApiRef.current;
      if (api && !api.isDestroyed) {
        const gridBodyViewport = (api as any).getGridBodyContainer?.() || document.querySelector('.ag-body-viewport');
        if (gridBodyViewport) {
          gridBodyViewport.removeEventListener('scroll', handleScroll);
        }
      }
    };
  }, [handleScroll]);

  function onGridReady(e: GridReadyEvent) {
    console.log('🔥 onGridReady called');
    gridApiRef.current = e.api;
    
    // Set up scroll tracking
    const gridBodyViewport = (e.api as any).getGridBodyContainer?.() || document.querySelector('.ag-body-viewport');
    if (gridBodyViewport) {
      (gridBodyViewport as any).addEventListener('scroll', handleScroll);
    }

    // Show grid immediately if no positioning needed
    if (selectedRowIndex === undefined && scrollTop === undefined) {
      const gridContainer = document.querySelector('.ag-root-wrapper');
      if (gridContainer) {
        (gridContainer as HTMLElement).style.visibility = '';
        (gridContainer as HTMLElement).style.opacity = '';
      }
    }
    
    // Avoid overriding cached widths on first paint
    const hasCachedWidths = Boolean(cachedView && (cachedView.fields || []).some(f => !!f.width));
    if (!hasCachedWidths) {
      e.api.sizeColumnsToFit();
    }

    // Check if we're restoring from cache
    const pageKey = resource;
    const returningFromOverview = gridCache.isReturningFromOverview(pageKey);

    // Apply initial AG header filter model (if provided) BEFORE first fetch
    if (initialAgFilterModel && typeof (e.api as any).setFilterModel === 'function') {
      try {
        isBatchingResetRef.current = true; // suppress fetch on onFilterChanged
        (e.api as any).setFilterModel(initialAgFilterModel);
        (e.api as any).onFilterChanged && (e.api as any).onFilterChanged();
      } catch {}
      finally {
        isBatchingResetRef.current = false;
      }
    }

    // If we deferred the initial fetch due to initial filters/model, run it now
    if (!didInitialFetchRef.current && rowsUrl && (cachedView || selectedView)) {
      didInitialFetchRef.current = true;
      // Just call fetchPage - it will check if we're returning from overview
      fetchPage(1);
    }
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
    console.log('🔥 onFilterChanged called');
    
    // Reset to page 1 when filters change
    if (isBatchingResetRef.current) {
      console.log('🔥 onFilterChanged: SKIP - isBatchingReset');
      return; // suppress intermediate fetches during Reset All
    }
    
    // Update the filter model in cache
    try {
      if (onAgFilterModelChange && gridApiRef.current) {
        const model = (gridApiRef.current as any).getFilterModel ? (gridApiRef.current as any).getFilterModel() : null;
        if (model) onAgFilterModelChange(model);
      }
    } catch {}
    
    // Just call fetchPage - it will check if we're returning from overview
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

      const payload = getCachedViewApiResponseIfExist(resource) || {
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
      cacheViewApiResponse(resource, payload);
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
      <div className="custom-pagination-panel flex items-center justify-between px-4 py-3 text-sm border-t min-h-[48px] bg-card-color border-border-color">
        <div className="pagination-text font-medium text-font-color">
          {total > 0 ? `${startRow} to ${endRow} of ${total.toLocaleString()} ${paginationWord}` : `0 ${paginationWord}`}
        </div>
        {
          // Always show pagination controls for consistent UX even when no rows
        }
        <div className="flex items-center space-x-1">
            <button
              onClick={() => fetchPage(1, undefined, undefined, currentSort)}
              disabled={page === 1}
              className="pagination-button btn btn-outline-secondary px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => fetchPage(page - 1, undefined, undefined, currentSort)}
              disabled={page === 1}
              className="pagination-button btn btn-outline-secondary px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1 px-2">
              <span className="text-xs text-font-color-100">Page</span>
              <input
                type="number"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyPress={handlePageInputKeyPress}
                onBlur={handlePageInputBlur}
                min="1"
                max={totalPages}
                className="pagination-input w-12 px-2 py-1 text-xs text-center border border-border-color rounded bg-card-color text-font-color focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="text-xs text-font-color-100">of {totalPages}</span>
            </div>
            <button
              onClick={() => fetchPage(page + 1, undefined, undefined, currentSort)}
              disabled={page >= totalPages}
              className="pagination-button btn btn-outline-secondary px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => fetchPage(totalPages, undefined, undefined, currentSort)}
              disabled={page >= totalPages}
              className="pagination-button btn btn-outline-secondary px-3 py-1.5 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
        </div>
      </div>
    );
  };

  const containerClass = containerSize === 'compact' 
    ? 'modern-grid-container grid-container-compact' 
    : containerSize === 'large' 
    ? 'modern-grid-container grid-container-large' 
    : 'modern-grid-container grid-container';

  
  
  // Show skeleton loader during initial load
  if (isInitialLoad && loading) {
    return (
      <div className="w-full">
        <SkeletonGrid rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filter Panel */}
      {showFilters && Object.keys(filters).length > 0 && (
        <div ref={filtersRef}>
          <GridFilters
            key={filterResetKey}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            disabled={loading || !rowsUrl}
            initialState={filtersInitialOverride || filterState}
            onResetAll={handleResetAll}
          />
        </div>
      )}
      
      {/* Grid Container */}
      <div 
        ref={containerRef}
        className={`w-full ${themeClass} rounded-md border flex flex-col ${containerClass}`} 
        style={{ 
          borderColor: 'var(--ag-border-color)',
          backgroundColor: 'var(--ag-background-color)',
          ...(containerPxHeight ? { height: `${containerPxHeight}px`, minHeight: `${Math.max(360, containerPxHeight)}px` } : {}),
          ...themeAwareStyles
        }}
      >
        <div className="flex-1 overflow-hidden relative">
          {/* Grid instance */}
          <AgGridReact
            theme="legacy"
            rowData={rows}
            columnDefs={colDefs}
            onGridReady={onGridReady}
            onRowClicked={(ev) => onRowClicked?.(ev.data, ev)}
            defaultColDef={{ 
              resizable: true, 
              sortable: !(loading || !rowsUrl),
              unSortIcon: false, // Hide unsort icon since we only have asc/desc
              // As of AG Grid v33+, use defaultColDef.sortingOrder instead of top-level prop
              sortingOrder: ['asc', 'desc'],
              suppressHeaderMenuButton: (loading || !rowsUrl)
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
            suppressMovableColumns={loading || !rowsUrl}
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
            rowHeight={44}
            suppressRowTransform={true}
            // Always suppress AG Grid's default no-rows overlay so header filters remain usable
            suppressNoRowsOverlay={true}
          />
          {/* Prevent header interactions while loading */}
          {(loading || !rowsUrl) && (
            <div
              className="absolute left-0 right-0"
              style={{ top: 0, height: 44, background: 'transparent' }}
            />
          )}
          {(loading || !rowsUrl) && (
            <div
              className="absolute left-0 right-0 flex items-center justify-center"
              style={{ top: 44, bottom: 0, background: 'rgba(0,0,0,0.03)' }}
            >
              <LoadingSpinner size="lg" message="Loading data…" />
            </div>
          )}
          {/* No results overlay (non-blocking header filters) */}
          {!loading && rowsUrl && rows.length === 0 && (
            <div
              className="absolute left-0 right-0 flex items-center justify-center"
              style={{ top: 44, bottom: 0, background: 'transparent', pointerEvents: 'none' }}
            >
              <div className="text-sm text-font-color-100">No results match the current filters.</div>
            </div>
          )}
        </div>
        <CustomPaginationPanel />
      </div>
    </div>
  );
}

export default LunoAgGrid;


