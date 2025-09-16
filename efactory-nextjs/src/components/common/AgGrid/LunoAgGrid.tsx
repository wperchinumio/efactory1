import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, GridApi, GridReadyEvent, ColumnResizedEvent, ColumnMovedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getAuthToken } from '@/lib/auth/storage';
import { getCachedViewApiResponseIfExist, cacheViewApiResponse, removeExpiredViewsFromStorage } from '@/lib/grid/viewCache';
import type { GridFieldDef, GridFilter, GridFilterCondition, GridRowResponse, GridSelectedView, GridSortSpec } from '@/types/api/grid';
import type { FilterConfig, FilterState } from '@/types/api/filters';
import { DateRenderer, DateTimeRenderer, NumberRenderer, PrimaryLinkRenderer, OrderTypePill, OrderStageRenderer, OrderStatusRenderer, ShipToRenderer, CarrierRenderer, TrackingRenderer, RmaLinkRenderer, StrongTextRenderer, PrimaryEmphasisRenderer, WarningTextRenderer, BoolRenderer, RmaTypeRenderer, BundleTypeRenderer, BundlePLRenderer, FilterLinkNumberRenderer, ItemLinkRenderer, BundleLinkRenderer, OrderOrRmaLinkRenderer, RtLinkRenderer, InvoiceRenderer, InvoiceLinksRenderer } from './renderers';
import GridFilters from '@/components/filters/grid/GridFilters';
import LoadingSpinner, { SkeletonGrid } from '@/components/common/LoadingSpinner';

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
}

// Ensure community modules are registered once
try {
  ModuleRegistry.registerModules([AllCommunityModule]);
} catch {}

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

  // Use cached width if available, otherwise use field width
  const width = cachedWidths?.[field.field] || field.width;
  if (width) {
    colDef.width = width;
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
      colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (id === 'fmtorderorrmalink') {
      colDef.cellRenderer = (p: any) => <OrderOrRmaLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
    } else if (id === 'fmtrmalink') {
      colDef.cellRenderer = (p: any) => <RmaLinkRenderer value={p.value} data={p.data} />;
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
      colDef.cellRenderer = (p: any) => <RtLinkRenderer value={p.value} data={p.data} />;
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

  // Fallback: if the legacy view doesn't provide render but column is order_stage, apply renderer
  if (!colDef.cellRenderer && field.field && field.field.toLowerCase() === 'order_stage') {
    colDef.cellRenderer = (p: any) => <OrderStageRenderer value={p.value} data={p.data} />;
  }

  // Fallback: if the legacy view doesn't provide render but column is order_number, apply link renderer
  if (!colDef.cellRenderer && field.field && field.field.toLowerCase() === 'order_number') {
    colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} data={p.data} field={p.colDef.field} />;
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
}: LunoAgGridProps<T>) {
  const gridApiRef = useRef<GridApi | null>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [themeClass, setThemeClass] = useState(() => getThemeClass());
  const [filterState, setFilterState] = useState<FilterState>({});
  const [cachedView, setCachedViewState] = useState<GridSelectedView | null>(() => {
    // Synchronously read cached view BEFORE first render to avoid flicker
    try {
      removeExpiredViewsFromStorage();
      const cached = getCachedViewApiResponseIfExist(resource);
      if (cached?.data?.[0]?.views?.[0]?.view) {
        const view = cached.data[0].views[0].view as GridSelectedView;
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
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const [containerPxHeight, setContainerPxHeight] = useState<number | null>(null);
  const isBatchingResetRef = useRef<boolean>(false);

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
    const base = initialFilters || viewToUse?.filter;
    const initialState = mapGridFilterToFilterState(base);
    setFilterState(initialState);
    onFilterStateChange?.(initialState);
    setPage(1);
    // Perform exactly one fetch after batch clearing is done (delay a tick to let UI settle)
    setTimeout(() => {
      fetchPage(1, initialState);
      isBatchingResetRef.current = false;
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
        window.localStorage.setItem(key, JSON.stringify(payload));
      } catch {}
    }
  }, [resource, selectedView]);

  const colDefs: ColDef[] = useMemo(() => {
    // Use cached view immediately if available, otherwise use selectedView
    const viewToUse = cachedView || selectedView;
    const cachedWidths: Record<string, number> = {};
    
    if (viewToUse?.fields) {
      viewToUse.fields.forEach((field: any) => {
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
    // Flags / Invoice columns can be added later when needed.

    const defs = (viewToUse.fields || []).map(field => mapFieldToColDef(field, cachedWidths));
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
    const base = initialFilters || viewToUse?.filter;
    return mapGridFilterToFilterState(base);
  }, [cachedView, selectedView, initialFilters]);

  async function fetchPage(nextPage: number, customFilterState?: FilterState, customView?: GridSelectedView, customSort?: GridSortSpec[]) {
    // If rowsUrl isn't ready yet, keep the loading overlay visible and wait
    if (!rowsUrl) {
      return;
    }
    const viewToUse = customView || cachedView || selectedView;
    const baseFilter: GridFilter = initialFilters || viewToUse.filter;
    const currentFilterState = customFilterState || filterState;
    
    // Convert filter state to GridFilter format
    const filterConditions: GridFilterCondition[] = [];
    // Start with server-provided base filter from the selected view
    if ((baseFilter as any)?.and && Array.isArray((baseFilter as any).and)) {
      filterConditions.push(...((baseFilter as any).and as GridFilterCondition[]));
    }
    
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
      } else if (filterValue && (filterValue as any).value !== null && (filterValue as any).value !== '') {
        // Handle single FilterValue (robust types)
        const v = (filterValue as any).value;
        const fieldName = (filterValue as any).field;
        const oper = (filterValue as any).oper;
        if (Array.isArray(v)) {
          // Multi-select array → use 'in' with comma-separated values
          filterConditions.push({ field: fieldName, oper: 'in', value: v.join(',') });
        } else if (typeof v === 'string' && v.includes(',')) {
          // Multi-select string (comma-separated)
          filterConditions.push({ field: fieldName, oper: 'in', value: v });
        } else {
          // Primitive types (string|number|boolean)
          filterConditions.push({ field: fieldName, oper, value: v });
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

  const didInitialFetchRef = useRef<boolean>(false);
  useEffect(() => {
    // Single initial fetch per mount once rowsUrl is ready
    if (!didInitialFetchRef.current && rowsUrl && (cachedView || selectedView)) {
      didInitialFetchRef.current = true;
      fetchPage(1);
    }
  }, [rowsUrl, cachedView, selectedView]);

  // Expose refresh/reset API to parent so refresh does not reset grid filters
  useEffect(() => {
    if (!onProvideRefresh) return;
    const api = {
      refresh: () => {
        // Re-fetch current page using current AG Grid filter model and sort
        const nextPage = page || 1;
        fetchPage(nextPage);
      },
      resetAll: () => {
        handleResetAll();
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

  function onGridReady(e: GridReadyEvent) {
    gridApiRef.current = e.api;
    // Avoid overriding cached widths on first paint
    const hasCachedWidths = Boolean(cachedView && (cachedView.fields || []).some(f => !!f.width));
    if (!hasCachedWidths) {
      e.api.sizeColumnsToFit();
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
    // Reset to page 1 when filters change
    if (isBatchingResetRef.current) return; // suppress intermediate fetches during Reset All
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
        {total > 0 && (
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
        )}
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
            filters={filters}
            onFiltersChange={handleFiltersChange}
            disabled={loading || !rowsUrl}
            initialState={filterPanelInitialState}
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


