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
import ItemOverview from '@/components/overview/ItemOverview';
import MultipleOrdersGrid from '@/components/overview/MultipleOrdersGrid';
import type { OrderDetailResult } from '@/types/api/orders';
import { useOrderNavigation, type OrderNavigationItem } from '@/contexts/OrderNavigationContext';
import { usePriorityFilters } from '@/hooks/useFulfillmentNavigation';

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
    // Items (Inventory)
    '/inventory/items/status': { pageTitle: 'ITEMS', pageSubtitle: 'STATUS' },
    '/inventory/items/receiving': { pageTitle: 'ITEMS', pageSubtitle: 'RECEIVING' },
    '/inventory/items/onhold': { pageTitle: 'ITEMS', pageSubtitle: 'ON HOLD' },
    '/inventory/items/transactions': { pageTitle: 'ITEMS', pageSubtitle: 'TRANSACTIONS' },
    '/inventory/items/lotmaster': { pageTitle: 'ITEMS', pageSubtitle: 'LOT MASTER' },
    '/inventory/items/asofadate': { pageTitle: 'ITEMS', pageSubtitle: 'AS OF A DATE' },
    '/inventory/items/trsummary': { pageTitle: 'ITEMS', pageSubtitle: 'TRANSACTION SUMMARY' },
    '/inventory/items/cyclecount': { pageTitle: 'ITEMS', pageSubtitle: 'CYCLE COUNT' },
    '/inventory/items/dg-data': { pageTitle: 'ITEMS', pageSubtitle: 'DG DATA' },
    
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
    // Inventory (root pages)
    '/inventory/assembly': { pageTitle: 'ASSEMBLY', pageSubtitle: '' },
    '/inventory/returns': { pageTitle: 'RETURNS', pageSubtitle: '' },
    // ReturnTrak
    '/returntrak/rmas/open': { pageTitle: 'RMAS', pageSubtitle: 'OPEN' },
    '/returntrak/rmas/all': { pageTitle: 'RMAS', pageSubtitle: 'ALL' },
    '/returntrak/rmas/items': { pageTitle: 'RMAS', pageSubtitle: 'ITEMS' },
    '/returntrak/shipped-orders': { pageTitle: 'ORDERS', pageSubtitle: 'SHIPPED' },
    // Analytics: Planning
    '/analytics/planning/replenishment': { pageTitle: 'PLANNING', pageSubtitle: 'REPLENISHMENT' },
    '/analytics/planning/slowmoving': { pageTitle: 'PLANNING', pageSubtitle: 'SLOW MOVING' },
    // Transportation Packages
    '/transportation/packages/shipping-detail': { pageTitle: 'ORDERS', pageSubtitle: 'SHIPPED' },
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
  async function getDefaultAccountWh(): Promise<string> {
    try {
      const { getAuthToken } = await import('@/lib/auth/storage');
      const token = getAuthToken();
      const regionsMap = (token?.user_data as any)?.calc_account_regions || {};
      const keys = Object.keys(regionsMap);
      if (keys.length > 0) return keys[0];
      const account = (token?.user_data as any)?.account || (token?.user_data as any)?.calc_accounts?.[0] || '';
      const region = (token?.user_data as any)?.region || (token?.user_data as any)?.calc_locations?.[0] || '';
      return account && region ? `${account}.${region}` : '';
    } catch {
      return '';
    }
  }
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
  const [currentRows, setCurrentRows] = useState<any[]>([]);
  const [itemOverlay, setItemOverlay] = useState<any | null>(null);
  const orderNavigation = useOrderNavigation();
  const { applyPriorityFilters } = usePriorityFilters();

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
        let finalView = selected?.view || null;
        
        // Apply priority filters if they exist (cached view)
        if (finalView) {
          const originalFilters = finalView.filter || { and: [] };
          const filtersWithPriority = applyPriorityFilters(originalFilters);
          
          if (JSON.stringify(filtersWithPriority) !== JSON.stringify(originalFilters)) {
            console.log('🎯 GridPage (cached): Applying priority filters to view');
            finalView = {
              ...finalView,
              filter: filtersWithPriority
            };
          }
        }
        
        setSelectedView(finalView);
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
        let finalView = selected?.view || null;
        
        // Apply priority filters if they exist
        if (finalView) {
          const originalFilters = finalView.filter || { and: [] };
          const filtersWithPriority = applyPriorityFilters(originalFilters);
          
          if (JSON.stringify(filtersWithPriority) !== JSON.stringify(originalFilters)) {
            console.log('🎯 GridPage: Applying priority filters to view');
            console.log('📋 Original view filters:', originalFilters);
            console.log('🚀 Priority-enhanced filters:', filtersWithPriority);
            
            finalView = {
              ...finalView,
              filter: filtersWithPriority
            };
          }
        }
        
        setSelectedView(finalView);

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
    } else {
      // Show immediate overlay placeholder while loading (legacy parity)
      setOrderOverlay({ kind: 'loading' } as any);
      try {
        const result = await readOrderDetail(orderNum, accountNum || undefined);
        setOrderOverlay(result);
      } catch (e) {
        setOrderOverlay({ kind: 'not_found' } as any);
      }
    }
    // Item overlay: ?itemNum=...
    const itemNum = q.get('itemNum');
    if (!itemNum) {
      setItemOverlay(null);
    } else {
      // Show immediate overlay placeholder while loading (legacy parity)
      setItemOverlay({ loading: true } as any);
      try {
        // Build minimal request using defaults (account_wh from local storage via API layer)
        const { readItemDetail } = await import('@/services/api');
        const account_wh = await getDefaultAccountWh();
        const payload: any = { action: 'item_detail', item_number: itemNum, warehouse: '', account_wh, weeks: false };
        const result = await readItemDetail(payload);
        setItemOverlay(result);
      } catch {
        setItemOverlay({ noResponse: true });
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    refreshOrderData();
  }, [refreshOrderData]);

  const onFetchRows = useCallback(
    async (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any): Promise<GridRowResponse<any>> => {
      if (!viewsUrl || !selectedView) return { resource, total: 0, rows: [] };
      try {
        const result = await readGridRows<any>(viewsUrl, {
          action: 'read',
          fields: ['*'],
          filter,
          page_num: page,
          page_size: pageSize,
          resource,
          sort,
          filter_id: filter_id ?? '',
        });
        // Store current rows for navigation
        setCurrentRows(result.rows || []);
        return result;
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

  // Handle row clicks to set up navigation and navigate to order
  const handleRowClick = useCallback((row: any, ev?: any) => {
    // Determine order identifiers from row
    const orderNumber = row.order_number || row.orderNumber || row.order_num;
    const accountNumber = row.account_number || row.accountNumber || row.account_num;
    const itemNumber = row.item_number || row.itemNumber || row.item_num;
    // Detect anchor clicks (e.g., clicking the order link cell)
    const isAnchor = ev?.event?.target?.closest && ev.event.target.closest('a');

    if (onRowClicked) {
      onRowClicked(row);
      return;
    }

    if (orderNumber && currentRows.length > 0) {
      // Convert current rows to navigation items
      const navigationItems: OrderNavigationItem[] = currentRows
        .filter(r => r.order_number || r.orderNumber || r.order_num)
        .map(r => ({
          order_number: r.order_number || r.orderNumber || r.order_num,
          account_number: r.account_number || r.accountNumber || r.account_num,
          ...r
        }));

      if (navigationItems.length > 0) {
        orderNavigation.setOrderList(navigationItems, orderNumber, pageKey);
      }

      if (isAnchor) {
        // Renderer will perform router.push; avoid double navigation
        return;
      }

      // Navigate to order detail when clicking row (non-anchor areas)
      const q = new URLSearchParams();
      q.set('orderNum', orderNumber);
      if (accountNumber) {
        q.set('accountNum', accountNumber);
      }
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }

    // If user clicked somewhere else on rows in Items pages, open item detail
    if (!orderNumber && itemNumber) {
      const q = new URLSearchParams();
      q.set('itemNum', itemNumber);
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [onRowClicked, currentRows, orderNavigation, pageKey, router]);

  // Simple navigation handlers
  const handleNavigatePrevious = useCallback(() => {
    const previousOrder = orderNavigation.getPreviousOrder();
    if (previousOrder) {
      orderNavigation.navigateToPrevious();
      const q = new URLSearchParams();
      q.set('orderNum', previousOrder.order_number);
      if (previousOrder.account_number) {
        q.set('accountNum', previousOrder.account_number);
      }
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [orderNavigation, router]);

  const handleNavigateNext = useCallback(() => {
    const nextOrder = orderNavigation.getNextOrder();
    if (nextOrder) {
      orderNavigation.navigateToNext();
      const q = new URLSearchParams();
      q.set('orderNum', nextOrder.order_number);
      if (nextOrder.account_number) {
        q.set('accountNum', nextOrder.account_number);
      }
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [orderNavigation, router]);

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

  // Show immediate placeholder overlay while item is loading (legacy parity)
  if (itemOverlay && (itemOverlay as any).loading) {
    return (
      <div className="p-4 w-full">
        <ItemOverview data={{} as any} loading onClose={() => {
          const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
          if (q.has('itemNum')) q.delete('itemNum');
          const base = (router as any).pathname || '';
          const search = q.toString();
          router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
        }} />
      </div>
    );
  }

  // If an item overview is requested and loaded, replace grid with inline overview (same UX as orders)
  if (itemOverlay && !itemOverlay.noResponse && !(itemOverlay as any).loading) {
    return (
      <div className="p-4 w-full">
        <ItemOverview
          data={itemOverlay}
          onClose={() => {
            const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
            if (q.has('itemNum')) q.delete('itemNum');
            const base = (router as any).pathname || '';
            const search = q.toString();
            router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
          }}
          onRefresh={refreshOrderData as any}
        />
      </div>
    );
  }

  // Show immediate placeholder overlay while order is loading (legacy parity)
  if (orderOverlay && (orderOverlay as any).kind === 'loading') {
    return (
      <div className="p-4 w-full">
        <OrderOverview
          // @ts-ignore – pass minimal shape and use loading states inside component
          data={{} as any}
          variant="inline"
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
    );
  }

  // If an order overview is requested and single result loaded, replace grid with inline overview
  if (orderOverlay && (orderOverlay as any).kind === 'single') {
    return (
      <div className="p-4 w-full">
        <OrderOverview
          data={(orderOverlay as any).order}
          onClose={() => {
            orderNavigation.clearNavigation();
            const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
            if (q.has('orderNum')) q.delete('orderNum');
            if (q.has('accountNum')) q.delete('accountNum');
            const base = (router as any).pathname || '';
            const search = q.toString();
            router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
          }}
          variant="inline"
          onRefresh={refreshOrderData}
          {...(orderNavigation.hasNavigation() ? {
            onPrevious: handleNavigatePrevious,
            onNext: handleNavigateNext
          } : {})}
          hasPrevious={orderNavigation.canNavigatePrevious()}
          hasNext={orderNavigation.canNavigateNext()}
          currentIndex={orderNavigation.getCurrentIndex()}
          totalItems={orderNavigation.getTotalCount()}
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
        onRowClicked={handleRowClick}
        showIndexColumn={showIndexColumn}
        showOrderTypeColumn={showOrderTypeColumn}
        filters={filters}
        showFilters={true}
        onFilterStateChange={(state) => setFilterState(state)}
        onProvideRefresh={(api) => { gridControlsRef.current = api; }}
      />
      ) : null}
      {itemOverlay && !itemOverlay.noResponse && (
        <div className="mt-4">
          <ItemOverview
            data={itemOverlay}
            onClose={() => {
              const q = new URLSearchParams(router.asPath.split('?')[1] || '');
              if (q.has('itemNum')) q.delete('itemNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
            }}
            onRefresh={refreshOrderData as any}
          />
        </div>
      )}
      {itemOverlay && itemOverlay.noResponse && (
        <div className="mt-4 px-4 py-10 text-center text-font-color-100 border border-border-color rounded-xl bg-card-color">
          Item not found.
        </div>
      )}
      {orderOverlay && orderOverlay.kind === 'single' && (
        <div className="mt-4">
          <OrderOverview
            data={orderOverlay.order}
            onClose={() => {
              orderNavigation.clearNavigation();
              const q = new URLSearchParams(router.asPath.split('?')[1] || '');
              if (q.has('orderNum')) q.delete('orderNum');
              if (q.has('accountNum')) q.delete('accountNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
            }}
            variant="inline"
            onRefresh={refreshOrderData}
            {...(orderNavigation.hasNavigation() ? {
              onPrevious: handleNavigatePrevious,
              onNext: handleNavigateNext
            } : {})}
            hasPrevious={orderNavigation.canNavigatePrevious()}
            hasNext={orderNavigation.canNavigateNext()}
            currentIndex={orderNavigation.getCurrentIndex()}
            totalItems={orderNavigation.getTotalCount()}
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


