import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import GridToolbar from '@/components/common/GridToolbar';
import { LunoAgGrid } from '@/components/common/AgGrid/LunoAgGrid';
import { listGridViews, readGridRows, readOrderDetail } from '@/services/api';
import { getCachedViewApiResponseIfExist, cacheViewApiResponse } from '@/lib/grid/viewCache';
import { getFiltersForPage } from '@/lib/filters/filterConfigs';
import type { GridFilter, GridRowResponse, GridSelectedView, GridViewItemMeta } from '@/types/api/grid';
import type { FilterState } from '@/types/api/filters';
import OrderOverview from '@/components/overview/OrderOverview';
import MultipleOrdersGrid from '@/components/overview/MultipleOrdersGrid';
import type { OrderDetailResult } from '@/types/api/orders';

export interface GridPageProps {
  resource: string; // e.g., 'fulfillment-open'
  pageKey: string; // e.g., 'orders-open'
  paginationWord?: string;
  showIndexColumn?: boolean;
  showOrderTypeColumn?: boolean;
  onRowClicked?: (row: any) => void;
}

function deriveTitleFromPath(pathname: string): string {
  // Map URL paths to proper titles based on legacy routes
  const pathToTitle: Record<string, { pageTitle: string; pageSubtitle: string }> = {
    // Orders
    '/orders/open': { pageTitle: 'ORDERS', pageSubtitle: 'OPEN' },
    '/orders/shipped': { pageTitle: 'ORDERS', pageSubtitle: 'SHIPPED' },
    '/orders/onhold': { pageTitle: 'ORDERS', pageSubtitle: 'ON HOLD' },
    '/orders/backorders': { pageTitle: 'ORDERS', pageSubtitle: 'BACK ORDERS' },
    '/orders/prerelease': { pageTitle: 'ORDERS', pageSubtitle: 'PRE-RELEASE' },
    '/orders/canceled': { pageTitle: 'ORDERS', pageSubtitle: 'CANCELED' },
    '/orders/all': { pageTitle: 'ORDERS', pageSubtitle: 'ALL' },
    
    // Order Lines
    '/order-lines/open': { pageTitle: 'ORDER LINES', pageSubtitle: 'OPEN' },
    '/order-lines/shipped': { pageTitle: 'ORDER LINES', pageSubtitle: 'SHIPPED' },
    '/order-lines/onhold': { pageTitle: 'ORDER LINES', pageSubtitle: 'ON HOLD' },
    '/order-lines/backorders': { pageTitle: 'ORDER LINES', pageSubtitle: 'BACK ORDERS' },
    '/order-lines/prerelease': { pageTitle: 'ORDER LINES', pageSubtitle: 'PRE-RELEASE' },
    '/order-lines/canceled': { pageTitle: 'ORDER LINES', pageSubtitle: 'CANCELED' },
    '/order-lines/all': { pageTitle: 'ORDER LINES', pageSubtitle: 'ALL' },
    
    // Order Items
    '/order-items/backlog': { pageTitle: 'ORDER ITEMS', pageSubtitle: 'BACKLOG ITEMS' },
    '/order-items/shipped': { pageTitle: 'ORDER ITEMS', pageSubtitle: 'SHIPPED ITEMS' },
    '/order-items/all': { pageTitle: 'ORDER ITEMS', pageSubtitle: 'ALL ITEMS' },
    
    // Ship Detail
    '/detail/freight': { pageTitle: 'SHIP DETAIL', pageSubtitle: 'FREIGHT' },
    '/detail/package': { pageTitle: 'SHIP DETAIL', pageSubtitle: 'PACKAGE' },
    '/detail/serial': { pageTitle: 'SHIP DETAIL', pageSubtitle: 'SERIAL/LOT #' },
    '/rmas/open': { pageTitle: 'RMAS', pageSubtitle: 'OPEN' },
    '/rmas/all': { pageTitle: 'RMAS', pageSubtitle: 'ALL' },
    '/rmas/items': { pageTitle: 'RMAS', pageSubtitle: 'ITEMS' },
    '/edi/orders-to-resolve': { pageTitle: 'EDI', pageSubtitle: 'ORDERS TO RESOLVE' },
    '/edi/orders-to-approve': { pageTitle: 'EDI', pageSubtitle: 'ORDERS TO APPROVE' },
    '/edi/orders-to-ship': { pageTitle: 'EDI', pageSubtitle: 'ORDERS TO SHIP' },
    '/edi/order-history': { pageTitle: 'EDI', pageSubtitle: 'ORDER HISTORY' },
    '/edi/asn-856': { pageTitle: 'EDI', pageSubtitle: 'ASN (856)' },
    '/edi/invoice-810': { pageTitle: 'EDI', pageSubtitle: 'INVOICE (810)' },
    '/edi/remittance-820': { pageTitle: 'EDI', pageSubtitle: 'REMITTANCE (820)' },
    '/edi/product-activity-852': { pageTitle: 'EDI', pageSubtitle: 'PRODUCT ACTIVITY (852)' },
    '/edi/planning-schedule-830': { pageTitle: 'EDI', pageSubtitle: 'PLANNING SCHEDULE (830)' },
    '/edi/tp-activity': { pageTitle: 'EDI', pageSubtitle: 'TP ACTIVITY' },
    '/edi/tp-items': { pageTitle: 'EDI', pageSubtitle: 'TP ITEMS' },
    '/edi/tp-addresses': { pageTitle: 'EDI', pageSubtitle: 'TP Addresses' },
    '/transportation/orders': { pageTitle: 'ORDERS', pageSubtitle: 'FREIGHT' },
  };

  const title = pathToTitle[pathname];
  if (title) {
    return `${title.pageTitle} - ${title.pageSubtitle}`;
  }

  // Fallback: derive from path segments
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length >= 2) {
    const first = (parts[0] ?? '').toUpperCase();
    const second = (parts[1] ?? '').toUpperCase().replace(/-/g, ' ');
    return `${first} - ${second}`;
  }
  return parts.map((p) => (p ?? '').toUpperCase()).join(' - ');
}

export default function GridPage({
  resource,
  pageKey,
  paginationWord = 'rows',
  showIndexColumn = true,
  showOrderTypeColumn = true,
  onRowClicked,
}: GridPageProps) {
  const router = useRouter();
  const [viewsUrl, setViewsUrl] = useState<string>('');
  const [views, setViews] = useState<GridViewItemMeta[]>([]);
  const [selectedView, setSelectedView] = useState<GridSelectedView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const loadedResourceRef = React.useRef<string | null>(null);
  const gridControlsRef = React.useRef<{ refresh: () => void; resetAll: () => void } | null>(null);
  const [orderOverlay, setOrderOverlay] = useState<OrderDetailResult | null>(null);

  useEffect(() => {
    // Always attempt load once per mount; allow rerun if resource changes
    loadedResourceRef.current = resource;

    // 1) Try cache immediately to enable parallel rows fetch like legacy
    try {
      const cached = getCachedViewApiResponseIfExist(resource);
      const cachedData = cached?.data?.[0];
      if (cachedData && typeof cachedData.url === 'string' && Array.isArray(cachedData.views)) {
        setViewsUrl(cachedData.url);
        setViews(cachedData.views);
        const selected = cachedData.views.find((v: any) => v.selected) || cachedData.views[0];
        setSelectedView(selected?.view || null);
      }
    } catch {}

    // 2) Always fetch latest views; if different, update state and cache
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const viewData = await listGridViews(resource);
        setViewsUrl(viewData.url);
        setViews(viewData.views);
        const selected = viewData.views.find(v => v.selected) || viewData.views[0];
        setSelectedView(selected?.view || null);

        // Persist full response in cache for next mount (needs url + views structure)
        cacheViewApiResponse(resource, { data: [viewData] });
      } catch (err) {
        // Leave any cache-provided state in place; surface error if nothing loaded
        if (!viewsUrl) setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [resource]);

  // Watch for order detail query (?orderNum=...&accountNum=...) and open overlay
  // Function to refresh order data
  const refreshOrderData = useCallback(async () => {
    if (!router?.asPath) return;
    const q = new URLSearchParams((router.asPath.split('?')[1] || ''));
    const orderNum = q.get('orderNum');
    const accountNum = q.get('accountNum');
    if (!orderNum) {
      setOrderOverlay(null);
      return;
    }
    try {
      const result = await readOrderDetail(orderNum, accountNum || undefined);
      setOrderOverlay(result);
    } catch (e) {
      setOrderOverlay({ kind: 'not_found' } as any);
    }
  }, [router.asPath]);

  useEffect(() => {
    refreshOrderData();
  }, [refreshOrderData]);

  const onFetchRows = useCallback(
    async (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any): Promise<GridRowResponse<any>> => {
      if (!viewsUrl || !selectedView) return { resource, total: 0, rows: [] };
      try {
        return await readGridRows<any>(viewsUrl, {
          action: 'read',
          fields: ['*'],
          filter,
          page_num: page,
          page_size: pageSize,
          resource,
          sort,
          filter_id: filter_id ?? '',
        });
      } catch (err) {
        console.error('Failed to fetch rows:', err);
        return { resource, total: 0, rows: [] };
      }
    },
    [viewsUrl, resource, selectedView]
  );


  const filters = useMemo(() => getFiltersForPage(pageKey), [pageKey]);
  const currentSort = useMemo(() => {
    const s = selectedView?.sort;
    const first = s && s.length > 0 ? s[0] : undefined;
    return first && first.field ? [{ [first.field as string]: first.dir }] : [];
  }, [selectedView]);

  const pageTitle = useMemo(() => {
    return deriveTitleFromPath((router as any)?.pathname || '');
  }, [router]);

  const handleRefresh = useCallback(() => {
    // Prefer grid-level refresh to preserve AG Grid header filters
    if (gridControlsRef.current) {
      try {
        gridControlsRef.current.refresh();
        return;
      } catch {}
    }
    // Fallback: remount grid (may reset header filters)
    setRefreshKey(prev => prev + 1);
  }, []);

  // Create fallback view for immediate grid rendering
  const fallbackView: GridSelectedView = {
    id: 0,
    fields: [], // Will be populated when real view arrives
    filter: { and: [] },
    sort: [],
    rows_per_page: 100
  };

  // Always render the grid immediately, even during loading
  const currentView = selectedView || fallbackView;

  if (error) {
    return (
      <div>
        <GridToolbar
          resource={resource}
          rowsUrl={viewsUrl}
          views={views}
          selectedViewId={views.find(v => v.selected)?.id || (views[0]?.id as number)}
          title={pageTitle}
          onRefresh={handleRefresh}
          onViewChange={(view, meta) => {
            setSelectedView(view);
            setViews(meta);
          }}
          currentFilter={{ and: [] }}
          currentSort={[]}
          filterState={{}}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // If an order overview is requested and single result loaded, replace grid with inline overview
  if (orderOverlay && (orderOverlay as any).kind === 'single') {
    return (
      <div className="p-4 w-full">
        <OrderOverview
          data={(orderOverlay as any).order}
          onClose={() => {
            const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
            if (q.has('orderNum')) q.delete('orderNum');
            if (q.has('accountNum')) q.delete('accountNum');
            const base = (router as any).pathname || '';
            const search = q.toString();
            router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
          }}
          variant="inline"
          onRefresh={refreshOrderData}
        />
      </div>
    );
  }

  if (orderOverlay && (orderOverlay as any).kind === 'multiple') {
    return (
      <div className="p-4 w-full">
        <div className="mt-2">
          <MultipleOrdersGrid
            orders={(orderOverlay as any).orders}
            onClose={() => {
              const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
              if (q.has('orderNum')) q.delete('orderNum');
              if (q.has('accountNum')) q.delete('accountNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
            }}
          />
        </div>
      </div>
    );
  }

  if (orderOverlay && (orderOverlay as any).kind === 'not_found') {
    return (
      <div className="p-4 w-full">
        <div className="px-4 py-10 text-center text-font-color-100 border border-border-color rounded-xl bg-card-color relative">
          <button
            className="btn btn-danger absolute left-4 top-4"
            onClick={() => {
              const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
              if (q.has('orderNum')) q.delete('orderNum');
              if (q.has('accountNum')) q.delete('accountNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
            }}
          >
            Close
          </button>
          Order not found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <GridToolbar
        resource={resource}
        rowsUrl={viewsUrl}
        views={views}
        selectedViewId={views.find(v => v.selected)?.id || (views[0]?.id as number)}
        title={pageTitle}
        onRefresh={handleRefresh}
        onViewChange={(view, meta) => {
          setSelectedView(view);
          setViews(meta);
        }}
        currentFilter={currentView.filter}
        currentSort={currentSort as any}
        filterState={filterState}
      />
      {!orderOverlay || orderOverlay.kind !== 'single' ? (
        <LunoAgGrid
        key={refreshKey}
        resource={resource}
        rowsUrl={viewsUrl}
        selectedView={currentView as any}
        paginationWord={paginationWord}
        onFetchRows={onFetchRows}
        onRowClicked={onRowClicked as any}
        showIndexColumn={showIndexColumn}
        showOrderTypeColumn={showOrderTypeColumn}
        filters={filters}
        showFilters={true}
        onFilterStateChange={(state) => setFilterState(state)}
        onProvideRefresh={(api) => { gridControlsRef.current = api; }}
      />
      ) : null}
      {orderOverlay && orderOverlay.kind === 'single' && (
        <div className="mt-4">
          <OrderOverview
            data={orderOverlay.order}
            onClose={() => {
              const q = new URLSearchParams(router.asPath.split('?')[1] || '');
              if (q.has('orderNum')) q.delete('orderNum');
              if (q.has('accountNum')) q.delete('accountNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
            }}
            variant="inline"
            onRefresh={refreshOrderData}
          />
        </div>
      )}
      {orderOverlay && orderOverlay.kind === 'multiple' && (
        <div className="mt-4">
          <MultipleOrdersGrid orders={orderOverlay.orders} />
        </div>
      )}
      {orderOverlay && orderOverlay.kind === 'not_found' && (
        <div className="mt-4 px-4 py-10 text-center text-font-color-100 border border-border-color rounded-xl bg-card-color">
          Order not found.
        </div>
      )}
    </div>
  );
}


