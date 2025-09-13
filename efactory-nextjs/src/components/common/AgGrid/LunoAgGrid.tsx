import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, GridApi, GridReadyEvent, ColumnResizedEvent, ColumnMovedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { getAuthToken } from '@/lib/auth/storage';
import { getCachedView, setCachedView } from '@/lib/grid/viewCache';
import type { GridFieldDef, GridFilter, GridRowResponse, GridSelectedView } from '@/types/api/grid';
import { DateRenderer, NumberRenderer, PrimaryLinkRenderer, OrderTypePill, OrderStageRenderer } from './renderers';

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
}

// Ensure community modules are registered once
try {
  ModuleRegistry.registerModules([AllCommunityModule]);
} catch {}

function mapFieldToColDef(field: GridFieldDef): ColDef {
  const colDef: ColDef = {
    field: field.field,
    headerName: field.alias,
    sortable: !!field.sortable,
    width: field.width,
    minWidth: field.min_width ?? 50,
    cellClass: (params) => {
      const align = field.align || 'left';
      return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
    },
  };

  // Special renderers mapping placeholder (extend later):
  // Examples: fmtorderlink, fmtdate, fmtnumber
  if (field.render) {
    const id = field.render.trim();
    if (id === 'fmtdate') {
      colDef.cellRenderer = (p: any) => <DateRenderer value={p.value} />;
    } else if (id.startsWith('fmtnumber')) {
      colDef.cellRenderer = (p: any) => <NumberRenderer value={p.value} />;
      colDef.type = 'numericColumn';
    } else if (id === 'fmtorderlink') {
      colDef.cellRenderer = (p: any) => <PrimaryLinkRenderer value={p.value} />;
    } else if (id === 'fmtorderstage') {
      colDef.cellRenderer = (p: any) => <OrderStageRenderer value={p.value} data={p.data} />;
    } else if (id === 'fmtorderstatus') {
      colDef.cellRenderer = (p: any) => {
        const status = Number(p.value);
        const label = status === 0 ? 'On Hold' : status === 1 ? 'Normal' : status === 2 ? 'Rush' : 'Unknown';
        const cls = status === 0 ? 'text-red-500 font-semibold' : status === 2 ? 'text-purple-600 font-semibold' : '';
        return <span className={cls}>{label}</span>;
      };
    } else if (id === 'fmtshipto') {
      colDef.cellRenderer = (p: any) => {
        const shipping = p.data?.shipping_address || {};
        const line1 = `${shipping.company || ''}${shipping.company && shipping.attention ? ' | ' : ''}${shipping.attention || ''}`;
        const line2 = `${shipping.city || ''}, ${shipping.state_province || ''} ${shipping.postal_code || ''} - ${shipping.country || ''}`;
        return (
          <div className="leading-tight">
            <div className="text-primary italic">{line1.trim()}</div>
            <div className="text-xs text-muted">{line2.trim()}</div>
          </div>
        );
      };
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
}: LunoAgGridProps<T>) {
  const gridApiRef = useRef<GridApi | null>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = selectedView.rows_per_page || 100;

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
        suppressMenu: true,
        sortable: false,
        valueGetter: (p) => (p.data?.row_id ? p.data.row_id : (p.node?.rowIndex ?? 0) + 1),
        cellClass: 'text-right font-medium text-[var(--font-color-100)]',
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

  const themeClass = useMemo(() => getThemeClass(), []);

  async function fetchPage(nextPage: number) {
    const baseFilter: GridFilter = initialFilters || selectedView.filter;
    const sort = applyServerSort && selectedView.sort?.length
      ? [{ [selectedView.sort[0].field]: selectedView.sort[0].dir }]
      : [{} as any];
    const response = await onFetchRows(nextPage, pageSize, baseFilter, sort, undefined);
    setRows(response.rows || []);
    setTotal(response.total || 0);
  }

  useEffect(() => {
    fetchPage(1);
  }, [rowsUrl, selectedView, initialFilters]);

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
      fetchPage(currentPage);
    }
  }

  function persistColumnState() {
    try {
      const api = gridApiRef.current;
      if (!api) return;
      const allCols = api.getColumnDefs() || [];
      const currentState = api.getColumnDefs()?.map((c: any) => c.field) || [];
      // Derive order and widths from grid columns API
      const gridColumns = api.getColumnApi().getAllGridColumns();
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

  return (
    <div className={`w-full h-full ${themeClass} rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]`} style={{ height: 'calc(100vh - 280px)', overflow: 'hidden' }}>
      <AgGridReact
        theme="legacy"
        rowData={rows}
        columnDefs={colDefs}
        onGridReady={onGridReady}
        onRowClicked={(ev) => onRowClicked?.(ev.data)}
        defaultColDef={{ resizable: true }}
        onColumnResized={handleColumnResized}
        onColumnMoved={handleColumnMoved}
        pagination
        paginationPageSize={pageSize}
        onPaginationChanged={onPaginationChanged}
        suppressCellFocus
        animateRows
        domLayout="normal"
      />
      <div className="text-xs text-muted mt-2">
        {total.toLocaleString()} {paginationWord}
      </div>
    </div>
  );
}

export default LunoAgGrid;


