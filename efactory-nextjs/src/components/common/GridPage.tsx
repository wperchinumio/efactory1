import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import GridToolbar from '@/components/common/GridToolbar';
import { LunoAgGrid } from '@/components/common/AgGrid/LunoAgGrid';
import { listGridViews, readGridRows, readOrderDetail } from '@/services/api';
import { getCachedViewApiResponseIfExist, cacheViewApiResponse } from '@/lib/grid/viewCache';
import { getFiltersForPage } from '@/lib/filters/filterConfigs';
import type { GridFilter, GridRowResponse, GridSelectedView, GridViewItemMeta, GridFilterCondition } from '@/types/api/grid';
import type { FilterState } from '@/types/api/filters';
import OrderOverview from '@/components/overview/OrderOverview';
import ItemOverview from '@/components/overview/ItemOverview';
import MultipleOrdersGrid from '@/components/overview/MultipleOrdersGrid';
import type { OrderDetailResult } from '@/types/api/orders';
import { useOrderNavigation, type OrderNavigationItem } from '@/contexts/OrderNavigationContext';
import { useItemNavigation, type ItemNavigationItem } from '@/contexts/ItemNavigationContext';
import { usePriorityFilters } from '@/hooks/useFulfillmentNavigation';
import { useGridCache } from '@/contexts/GridCacheContext';

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
      if (keys.length > 0) return keys[0] ?? '';
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
  const gridControlsRef = React.useRef<{ refresh: () => void; resetAll: () => void; saveScrollPosition?: () => void } | null>(null);
  const [orderOverlay, setOrderOverlay] = useState<OrderDetailResult | null>(null);
  const [currentRows, setCurrentRows] = useState<any[]>([]);
  const currentRowsRef = React.useRef<any[]>([]);
  const [itemOverlay, setItemOverlay] = useState<any | null>(null);
  const orderOverlayRef = React.useRef<OrderDetailResult | null>(null);
  const itemOverlayRef = React.useRef<any | null>(null);
  const orderNavigation = useOrderNavigation();
  const itemNavigation = useItemNavigation();
  const { applyPriorityFilters } = usePriorityFilters();
  const gridCache = useGridCache();
  
  // Track if we're returning from overview (cache should only be used in this case)
  // ALWAYS start as false - only set to true when clicking X in overview
  

  useEffect(() => {
    console.log('🔥 GridPage useEffect MOUNT - resource:', resource, 'pageKey:', pageKey);
    
    // Always attempt load once per mount; allow rerun if resource changes
    loadedResourceRef.current = resource;
    
    // Only clear cache if NOT returning from overview
    const returningFromOverview = (() => {
      try {
        const flag = window.sessionStorage.getItem(`returningFromOverview.${pageKey}`);
        console.log('🔥 SESSION STORAGE CHECK - returningFromOverview flag:', flag, 'for pageKey:', pageKey);
        return flag === 'true';
      } catch {
        console.log('🔥 SESSION STORAGE ERROR - defaulting to false');
        return false;
      }
    })();
    
    console.log('🔥 RETURNING FROM OVERVIEW:', returningFromOverview);
    
    if (!returningFromOverview) {
      console.log('🔥 NOT RETURNING FROM OVERVIEW - Clearing cache on initial load for pageKey:', pageKey);
      gridCache.clearCache(pageKey);
    } else {
      console.log('🔥 RETURNING FROM OVERVIEW - preserving cache for pageKey:', pageKey);
      
      // IMMEDIATELY load cached data into current state to prevent API calls
      const cachedData = gridCache.getCachedData(pageKey);
      console.log('🔥 CACHED DATA CHECK:', {
        hasCachedData: !!cachedData,
        fromRowClick: cachedData?.fromRowClick,
        dataLength: cachedData?.data?.length || 0,
        hasFilters: !!cachedData?.filters
      });
      
      if (cachedData && cachedData.fromRowClick) {
        console.log('🔥 IMMEDIATELY loading cached data into grid state - rows:', cachedData.data.length);
        setCurrentRows(cachedData.data);
        currentRowsRef.current = cachedData.data;
        
        // Also restore filter state immediately
        if (cachedData.filters) {
          // Convert cached filters back to UI filter state
          try {
            const uiState: FilterState = {};
            // Simple conversion - you may need to adjust this based on your filter structure
            console.log('🔥 RESTORING FILTER STATE from cache');
            setFilterState(uiState);
          } catch (err) {
            console.log('🔥 ERROR restoring filter state:', err);
          }
        }
      } else {
        console.log('🔥 NO VALID CACHED DATA - will need to fetch');
      }
    }

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
    if (!router?.query) return;
    
    // Use router.query directly instead of parsing router.asPath to avoid race conditions
    const orderNum = router.query.orderNum as string;
    const accountNum = router.query.accountNum as string;
    const itemNum = router.query.itemNum as string;
    
    if (!orderNum) {
      setOrderOverlay(null);
    } else {
      // If no current overlay shown, show initial placeholder; otherwise keep previous data visible
      if (!orderOverlayRef.current) {
        setOrderOverlay({ kind: 'loading' } as any);
      }
      try {
        // ALWAYS use cached data for overview pages - NO forceRefresh
        const result = await readOrderDetail(orderNum, accountNum || undefined, undefined, false);
        setOrderOverlay(result);
      } catch (e) {
        setOrderOverlay({ kind: 'not_found' } as any);
      }
    }
    // Item overlay: ?itemNum=...
    if (!itemNum) {
      setItemOverlay(null);
    } else {
      // If no current item overlay, show initial placeholder; otherwise keep previous data visible
      if (!itemOverlayRef.current) {
        setItemOverlay({ loading: true } as any);
      }
      try {
        // Build minimal request using defaults (account_wh from local storage via API layer)
        const { readItemDetail } = await import('@/services/api');
        const account_wh = await getDefaultAccountWh();
        const payload: any = { action: 'item_detail', item_number: itemNum, warehouse: '', account_wh, weeks: false };
        // ALWAYS use cached data for overview pages - NO forceRefresh
        const result = await readItemDetail(payload, false);
        setItemOverlay(result);
      } catch (e) {
        setItemOverlay({ noResponse: true });
      }
    }
  }, [router.query.orderNum, router.query.accountNum, router.query.itemNum]);

  useEffect(() => {
    refreshOrderData();
  }, [refreshOrderData]);

  // Track latest overlays in refs for refresh behavior
  useEffect(() => { orderOverlayRef.current = orderOverlay; }, [orderOverlay]);
  useEffect(() => { itemOverlayRef.current = itemOverlay; }, [itemOverlay]);

  const onFetchRows = useCallback(
    async (page: number, pageSize: number, filter: GridFilter, sort: any, filter_id?: any): Promise<GridRowResponse<any>> => {
      console.log('🔥🔥🔥 ONFETCHROWS CALLED!!! 🔥🔥🔥');
      console.log('🔥 ONFETCHROWS PARAMS:', { page, pageSize, pageKey, resource });
      console.log('🔥 ONFETCHROWS FILTER:', JSON.stringify(filter));
      console.log('🔥 ONFETCHROWS SORT:', JSON.stringify(sort));
      
      if (!viewsUrl || !selectedView) {
        console.log('🔥 NO VIEWS URL OR SELECTED VIEW - returning empty');
        return { resource, total: 0, rows: [] };
      }
      
      // Normalize filters to avoid volatile keys (e.g., cache-busting timestamps) affecting cache matching
      const normalizeFilterForCache = (f: any) => {
        if (!f || typeof f !== 'object') return f;
        // Shallow clone and drop transient props
        const clone: any = { ...f };
        if (clone._timestamp !== undefined) delete clone._timestamp;
        return clone as GridFilter;
      };

      // Detect explicit force refresh (coming from grid refresh action)
      const hasForceRefresh = Boolean((filter as any)?._timestamp);
      console.log('🔥 HAS FORCE REFRESH:', hasForceRefresh);

      // Check if we have cached data for this page and view
      const cachedData = gridCache.getCachedData(pageKey);
      const isCachedDataFresh = gridCache.isDataFresh(pageKey, 0); // 0 = no cache timeout, never reload
      
      const normalizedIncomingFilter = normalizeFilterForCache(filter);
      const normalizedCachedFilter = normalizeFilterForCache(cachedData?.filters);
      
      // Check if we should use cached data (ONLY when BOTH conditions are met)
      const returningFromOverview = window.sessionStorage.getItem(`returningFromOverview.${pageKey}`) === 'true';
      const cacheFromRowClick = cachedData?.fromRowClick === true;
      const shouldUseCache = returningFromOverview && cacheFromRowClick;
      
      console.log('🔥 CACHE FLAGS CHECK:', {
        returningFromOverview,
        cacheFromRowClick,
        shouldUseCache,
        hasCachedData: !!cachedData,
        isCachedDataFresh
      });
      
      // Detailed validation logging
      const hasSelectedView = !!selectedView?.id;
      const viewIdMatch = !hasSelectedView || (cachedData?.viewId === selectedView?.id?.toString());
      const filterMatch = JSON.stringify(normalizedCachedFilter) === JSON.stringify(normalizedIncomingFilter);
      const sortMatch = JSON.stringify(cachedData?.sort) === JSON.stringify(sort);
      
      console.log('🔥 CACHE VALIDATION DETAILS:', {
        shouldUseCache,
        hasCachedData: !!cachedData,
        isCachedDataFresh,
        hasSelectedView,
        viewIdMatch,
        filterMatch,
        sortMatch,
        hasForceRefresh
      });
      
      if (!filterMatch) {
        console.log('🔥 FILTER MISMATCH:', {
          cachedFilter: JSON.stringify(normalizedCachedFilter),
          incomingFilter: JSON.stringify(normalizedIncomingFilter)
        });
      }
      
      if (!sortMatch) {
        console.log('🔥 SORT MISMATCH:', {
          cachedSort: JSON.stringify(cachedData?.sort),
          incomingSort: JSON.stringify(sort)
        });
      }
      
      // Use cache if returning from overview with row click - be more lenient on other conditions
      if (shouldUseCache && cachedData && isCachedDataFresh) {
        console.log('🔥✅ USING CACHED DATA - NO API CALL!!!', { 
          pageKey, 
          cachedRows: cachedData.data.length, 
          viewId: cachedData.viewId,
          selectedViewId: selectedView.id,
          returningFromOverview,
          cacheFromRowClick,
          cachedFilters: cachedData.filters
        });
        // Use cached data
        setCurrentRows(cachedData.data);
        currentRowsRef.current = cachedData.data;
        
        // CRITICAL: Clear the flags and DESTROY the cache after using it
        try {
          window.sessionStorage.removeItem(`returningFromOverview.${pageKey}`);
          console.log('🎯 DESTROYING CACHE after use for pageKey:', pageKey);
          gridCache.clearCache(pageKey);
        } catch {}
        
        return {
          resource,
          total: cachedData.totalCount,
          rows: cachedData.data
        };
      }
      
      // If we have cached data but it doesn't match, log why we're not using it
      if (cachedData && !hasForceRefresh) {
        console.log('🎯 Cache miss - making API call', {
          pageKey,
          returningFromOverview,
          cacheFromRowClick,
          shouldUseCache,
          hasCachedData: !!cachedData,
          isCachedDataFresh,
          hasSelectedView: !!selectedView?.id,
          viewIdMatch: cachedData.viewId === selectedView?.id?.toString(),
          filterMatch: JSON.stringify(normalizedCachedFilter) === JSON.stringify(normalizedIncomingFilter),
          sortMatch: JSON.stringify(cachedData.sort) === JSON.stringify(sort)
        });
      }
      
      console.log('🔥❌ MAKING API CALL - NO CACHE USED!!!', {
        pageKey,
        resource,
        viewsUrl,
        page,
        pageSize,
        reason: 'Cache conditions not met'
      });
      
      try {
        const result = await readGridRows<any>(viewsUrl, {
          action: 'read',
          fields: ['*'],
          filter, // send original filter (may include _timestamp for force refresh)
          page_num: page,
          page_size: pageSize,
          resource,
          sort,
          filter_id: filter_id ?? '',
        });
        
        // Store current rows for navigation
        setCurrentRows(result.rows || []);
        currentRowsRef.current = result.rows || [];
        
        // Cache the data AND persist last used merged filter so we can restore it after overview
        const mergedFilter = normalizeFilterForCache(filter);
        gridCache.setCachedData(
          pageKey, 
          result.rows || [], 
          [], // columns will be set by AG Grid
          result.total || 0,
          selectedView.id?.toString(),
          mergedFilter,
          sort
          // Don't pass fromRowClick - let it preserve existing value
        );
        try {
          window.sessionStorage.setItem(`grid.lastFilter.${pageKey}`, JSON.stringify(mergedFilter || {}));
        } catch {}
        
        return result;
      } catch (err) {
        console.error('Failed to fetch rows:', err);
        return { resource, total: 0, rows: [] };
      }
    },
    [viewsUrl, resource, selectedView, pageKey, gridCache]
  );


  const filters = useMemo(() => getFiltersForPage(pageKey), [pageKey]);
  // NEVER use cached filters on initial page load - always use default server filter
  // effectiveInitialFilters is removed - filters come from selectedView.filter only

  // CRITICAL: NEVER use cached filters on initial page load
  // ALWAYS use default server filter from selectedView
  useEffect(() => {
    if (selectedView?.filter) {
      console.log('🎯 Using DEFAULT SERVER FILTER - NO CACHE', selectedView.filter);
      // Convert GridFilter to FilterState for the UI
      const convertGridFilterToFilterState = (filter: GridFilter): FilterState => {
        const state: FilterState = {};
        if (!filter || !Array.isArray((filter as any).and)) return state;
        const byField: Record<string, any[]> = {};
        (filter.and || []).forEach((cond: any) => {
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
            const start = conditions.find((c: any) => c.oper === '>=') || first;
            const end = conditions.find((c: any) => c.oper === '<=') || second;
            if (start && end) {
              state[field] = [
                { field: start.field, oper: start.oper, value: start.value },
                { field: end.field, oper: end.oper, value: end.value },
              ];
            }
          }
        });
        return state;
      };
      
      const defaultFilterState = convertGridFilterToFilterState(selectedView.filter);
      setFilterState(defaultFilterState);
    }
  }, [selectedView]);
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
    // setRefreshKey(prev => prev + 1); // Disabled to prevent unnecessary API calls
  }, []);

  const handleResetAll = useCallback(() => {
    // Reset all filters and show all columns
    if (gridControlsRef.current) {
      try {
        gridControlsRef.current.resetAll();
        return;
      } catch {}
    }
  }, []);

  // Test function to manually set cache data
  // Cache functionality is working properly

  // Function to restore selected row from cache
  const restoreSelectedRow = useCallback(() => {
    const selectedRow = gridCache.getSelectedRow(pageKey);
    if (selectedRow && selectedRow.data) {
      // This will be used by the AG Grid to select the row
      return selectedRow;
    }
    return null;
  }, [gridCache, pageKey]);

  // Function to restore scroll position from cache
  const restoreScrollPosition = useCallback(() => {
    const scrollPos = gridCache.getScrollPosition(pageKey);
    if (scrollPos) {
      return scrollPos;
    }
    return null;
  }, [gridCache, pageKey]);

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

    // Get the actual row index from AG Grid's event
    const rowIndex = ev?.rowIndex ?? ev?.node?.rowIndex ?? -1;
    
    if (rowIndex !== -1) {
      gridCache.setSelectedRow(pageKey, rowIndex, row);
    }

    // ONLY do the heavy cache/filter work if we're actually navigating to overview (anchor click)
    if (orderNumber && isAnchor && currentRowsRef.current.length > 0) {
      // CRITICAL: Create/update cache with current grid data BEFORE navigating
      try {
        const baseFilter: GridFilter = (selectedView?.filter as any) || { and: [] };
        // Convert panel filterState into conditions
        const uiConditions: GridFilterCondition[] = (() => {
          const and: GridFilterCondition[] = [];
          Object.values(filterState || {}).forEach((v: any) => {
            if (!v) return;
            if (Array.isArray(v)) {
              v.forEach((fv) => {
                if (fv && fv.value !== '' && fv.value !== null) {
                  and.push({ field: fv.field, oper: fv.oper, value: fv.value });
                }
              });
            } else if (typeof v === 'object') {
              if (Array.isArray(v.value)) {
                and.push({ field: v.field, oper: 'in', value: v.value.join(',') });
              } else if (typeof v.value === 'string' && v.value.includes(',')) {
                and.push({ field: v.field, oper: 'in', value: v.value });
              } else if (v.value !== '' && v.value !== null && v.value !== undefined) {
                and.push({ field: v.field, oper: v.oper, value: v.value });
              }
            }
          });
          return and;
        })();
        // Convert AG header model into conditions via gridControlsRef
        const agModel: any = (gridControlsRef.current as any)?.getFilterModel?.() || {};
        const agConditions: GridFilterCondition[] = Object.entries(agModel).flatMap(([field, fm]: [string, any]) => {
          const out: GridFilterCondition[] = [];
          if (!fm) return out;
          if (fm.filter !== undefined && fm.filter !== null && fm.filter !== '') {
            const oper = fm.type || 'contains';
            out.push({ field, oper, value: fm.filter });
          }
          return out;
        });
        const groupByField = (arr: GridFilterCondition[]) => {
          const by: Record<string, GridFilterCondition[]> = {};
          arr.forEach((c) => { if (c && c.field) { const k = String(c.field); (by[k] ||= []).push(c); } });
          return by;
        };
        const mergedBy: Record<string, GridFilterCondition[]> = groupByField(((baseFilter as any).and || []) as GridFilterCondition[]);
        const applyOverlay = (overlay: GridFilterCondition[]) => {
          const g = groupByField(overlay);
          Object.keys(g).forEach((f) => { mergedBy[f] = g[f]!; });
        };
        applyOverlay(uiConditions);
        applyOverlay(agConditions);
        const mergedConditions: GridFilterCondition[] = Object.values(mergedBy).flat();
        const mergedFilter: GridFilter = mergedConditions.length > 0 ? { and: mergedConditions } : baseFilter;
        
        // CRITICAL: Cache the current grid data with the latest filter state
        console.log('🔥🔥🔥 CREATING CACHE BEFORE NAVIGATION!!! 🔥🔥🔥');
        console.log('🔥 CACHE CREATION - pageKey:', pageKey, 'rows:', currentRowsRef.current.length);
        console.log('🔥 CACHE CREATION - mergedFilter:', JSON.stringify(mergedFilter));
        console.log('🔥 CACHE CREATION - selectedView.id:', selectedView?.id);
        
        gridCache.setCachedData(
          pageKey,
          currentRowsRef.current, // Current grid data
          [], // columns will be set by AG Grid
          currentRowsRef.current.length, // Use current row count as total
          selectedView?.id?.toString(),
          mergedFilter, // Latest merged filter (NOT server filter)
          undefined, // sort
          true // fromRowClick = true
        );
        
        console.log('🔥 CACHE CREATED - verifying:', gridCache.getCachedData(pageKey)?.fromRowClick);
        
        try { window.sessionStorage.setItem(`grid.lastFilter.${pageKey}`, JSON.stringify(mergedFilter || {})); } catch {}
      } catch (err) {
        console.error('🎯 Error creating cache before navigation:', err);
      }

      // Save current scroll position before navigating
      if (gridControlsRef.current && (gridControlsRef.current as any).saveScrollPosition) {
        (gridControlsRef.current as any).saveScrollPosition();
      }

      // Convert current rows to navigation items
      const navigationItems: OrderNavigationItem[] = currentRowsRef.current
        .filter(r => r.order_number || r.orderNumber || r.order_num)
        .map(r => ({
          order_number: r.order_number || r.orderNumber || r.order_num,
          account_number: r.account_number || r.accountNumber || r.account_num,
          ...r
        }));

      if (navigationItems.length > 0) {
        orderNavigation.setOrderList(navigationItems, orderNumber, pageKey);
      }

      // Set flag to indicate we're going to order overview - cache will be used when returning
      try {
        window.sessionStorage.setItem(`returningFromOverview.${pageKey}`, 'true');
      } catch {}
      
      // The anchor renderer will handle the actual navigation
      // We just need to set up the navigation context and cache flag
      return;
    }

    // Handle item navigation for item grids (only on anchor clicks)
    if (!orderNumber && itemNumber && isAnchor) {
      // Set flag to indicate we're going to item overview - cache will be used when returning
      try {
        window.sessionStorage.setItem(`returningFromOverview.${pageKey}`, 'true');
      } catch {}
      
      // Set up item navigation if we have current rows
      if (currentRowsRef.current.length > 0) {
        const navigationItems: ItemNavigationItem[] = currentRowsRef.current
          .filter(r => r.item_number || r.itemNumber || r.item_num)
          .map(r => ({
            item_number: r.item_number || r.itemNumber || r.item_num,
            account_wh: r.account_wh || r.accountWh,
            ...r
          }));

        if (navigationItems.length > 0) {
          itemNavigation.setItemList(navigationItems, itemNumber, pageKey);
        }
      }

      // Show immediate placeholder item overlay BEFORE route change
      setItemOverlay({ loading: true } as any);
      const q = new URLSearchParams();
      q.set('itemNum', itemNumber);
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
      return;
    }

    // For non-anchor clicks, just do basic row selection - no cache manipulation
    console.log('🎯 Row clicked (non-anchor) - just selecting row');
  }, [onRowClicked, orderNavigation, pageKey, router, gridCache, itemNavigation, selectedView, filterState]);

  // Simple navigation handlers
  const handleNavigatePrevious = useCallback(() => {
    const previousOrder = orderNavigation.getPreviousOrder();
    if (previousOrder) {
      orderNavigation.navigateToPrevious();
      
      // Update cache with the new row information
      const rowIndex = currentRowsRef.current.findIndex(r => 
        (r.order_number || r.orderNumber || r.order_num) === previousOrder.order_number
      );
      if (rowIndex !== -1) {
        gridCache.setSelectedRow(pageKey, rowIndex, currentRowsRef.current[rowIndex]);
      }
      
      const q = new URLSearchParams();
      q.set('orderNum', previousOrder.order_number);
      if (previousOrder.account_number) {
        q.set('accountNum', previousOrder.account_number);
      }
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [orderNavigation, router, pageKey, gridCache]);

  const handleNavigateNext = useCallback(() => {
    const nextOrder = orderNavigation.getNextOrder();
    if (nextOrder) {
      orderNavigation.navigateToNext();
      
      // Update cache with the new row information
      const rowIndex = currentRowsRef.current.findIndex(r => 
        (r.order_number || r.orderNumber || r.order_num) === nextOrder.order_number
      );
      if (rowIndex !== -1) {
        gridCache.setSelectedRow(pageKey, rowIndex, currentRowsRef.current[rowIndex]);
      }
      
      const q = new URLSearchParams();
      q.set('orderNum', nextOrder.order_number);
      if (nextOrder.account_number) {
        q.set('accountNum', nextOrder.account_number);
      }
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [orderNavigation, router, pageKey, gridCache]);

  // Item navigation handlers
  const handleNavigateItemPrevious = useCallback(() => {
    const previousItem = itemNavigation.getPreviousItem();
    if (previousItem) {
      itemNavigation.navigateToPrevious();
      
      // Update cache with the new row information
      const rowIndex = currentRowsRef.current.findIndex(r => 
        (r.item_number || r.itemNumber || r.item_num) === previousItem.item_number
      );
      if (rowIndex !== -1) {
        gridCache.setSelectedRow(pageKey, rowIndex, currentRowsRef.current[rowIndex]);
      }
      
      const q = new URLSearchParams();
      q.set('itemNum', previousItem.item_number);
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [itemNavigation, router, pageKey, gridCache]);

  const handleNavigateItemNext = useCallback(() => {
    const nextItem = itemNavigation.getNextItem();
    if (nextItem) {
      itemNavigation.navigateToNext();
      
      // Update cache with the new row information
      const rowIndex = currentRowsRef.current.findIndex(r => 
        (r.item_number || r.itemNumber || r.item_num) === nextItem.item_number
      );
      if (rowIndex !== -1) {
        gridCache.setSelectedRow(pageKey, rowIndex, currentRowsRef.current[rowIndex]);
      }
      
      const q = new URLSearchParams();
      q.set('itemNum', nextItem.item_number);
      const base = router.pathname;
      router.push(`${base}?${q.toString()}`, undefined, { shallow: true });
    }
  }, [itemNavigation, router, pageKey, gridCache]);

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

  // Do not replace content with a loading placeholder; keep previous item data visible

  // If an item overview is requested and loaded OR loading, replace grid with inline overview
  if (itemOverlay && !itemOverlay.noResponse) {
    return (
      <div className="p-4 w-full">
        <ItemOverview
          data={(itemOverlay as any).loading ? ({} as any) : itemOverlay}
          onClose={() => {
            itemNavigation.clearNavigation();
            const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
            if (q.has('itemNum')) q.delete('itemNum');
            const base = (router as any).pathname || '';
            const search = q.toString();
            router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
          }}
          onRefresh={refreshOrderData as any}
          loading={(itemOverlay as any).loading}
          {...(itemNavigation.hasNavigation() ? {
            onPrevious: handleNavigateItemPrevious,
            onNext: handleNavigateItemNext
          } : {})}
          hasPrevious={itemNavigation.canNavigatePrevious()}
          hasNext={itemNavigation.canNavigateNext()}
          currentIndex={itemNavigation.getCurrentIndex()}
          totalItems={itemNavigation.getTotalCount()}
        />
      </div>
    );
  }

  // Do not replace content with a loading placeholder; keep previous order data visible

  // If an order overview is requested and single result loaded OR loading, replace grid with inline overview
  if (orderOverlay && ((orderOverlay as any).kind === 'single' || (orderOverlay as any).kind === 'loading')) {
    return (
      <div className="p-4 w-full">
        <OrderOverview
          data={(orderOverlay as any).kind === 'single' ? (orderOverlay as any).order : ({} as any)}
          onClose={() => {
            console.log('🔥🔥🔥 ORDER OVERVIEW CLOSE CLICKED!!! 🔥🔥🔥');
            console.log('🔥 SETTING returningFromOverview flag for pageKey:', pageKey);
            
            // Set flag to use cache when returning
            try {
              window.sessionStorage.setItem(`returningFromOverview.${pageKey}`, 'true');
              console.log('🔥 SESSION STORAGE SET - returningFromOverview =', window.sessionStorage.getItem(`returningFromOverview.${pageKey}`));
            } catch (err) {
              console.log('🔥 ERROR setting session storage:', err);
            }
            
            orderNavigation.clearNavigation();
            const q = new URLSearchParams((router as any).asPath.split('?')[1] || '');
            if (q.has('orderNum')) q.delete('orderNum');
            if (q.has('accountNum')) q.delete('accountNum');
            const base = (router as any).pathname || '';
            const search = q.toString();
            console.log('🔥 NAVIGATING BACK TO:', search ? `${base}?${search}` : base);
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
          // Pass a light loading hint when we're in loading state
          {...(((orderOverlay as any).kind === 'loading') ? { } : {})}
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
          initialFilters={(() => {
          const cachedData = gridCache.getCachedData(pageKey);
          return cachedData?.filters || null;
        })()}
        paginationWord={paginationWord}
        onFetchRows={onFetchRows}
        onRowClicked={handleRowClick}
        showIndexColumn={showIndexColumn}
        showOrderTypeColumn={showOrderTypeColumn}
        filters={filters}
        showFilters={true}
        onFilterStateChange={(state) => setFilterState(state)}
        onProvideRefresh={(api) => { 
          gridControlsRef.current = {
            ...api,
            saveScrollPosition: () => {
              const gridApi = (api as any).api || api;
              if (gridApi) {
                const gridBodyViewport = gridApi.getGridBodyContainer?.() || document.querySelector('.ag-body-viewport');
                if (gridBodyViewport) {
                  gridCache.setScrollPosition(pageKey, gridBodyViewport.scrollTop, gridBodyViewport.scrollLeft);
                }
              }
            }
          };
        }}
        initialAgFilterModel={(() => {
          try {
            const raw = window.sessionStorage.getItem(`grid.agmodel.${pageKey}`);
            const model = raw ? JSON.parse(raw) : undefined;
            if (model && Object.keys(model).length > 0) {
              console.log('🎯 Restoring AG Grid filter model:', model);
            }
            return model;
          } catch { return undefined; }
        })()}
        onAgFilterModelChange={(model) => {
          try {
            window.sessionStorage.setItem(`grid.agmodel.${pageKey}` , JSON.stringify(model || {}));
          } catch {}
        }}
        {...(() => {
          const selectedRow = restoreSelectedRow();
          const scrollPos = restoreScrollPosition();
          return {
            ...(selectedRow ? {
              selectedRowIndex: selectedRow.index,
              selectedRowData: selectedRow.data
            } : {}),
            ...(scrollPos ? {
              scrollTop: scrollPos.scrollTop,
              scrollLeft: scrollPos.scrollLeft
            } : {})
          };
        })()}
      />
      ) : null}
      {itemOverlay && !itemOverlay.noResponse && (
        <div className="mt-4">
          <ItemOverview
            data={itemOverlay}
            onClose={() => {
              itemNavigation.clearNavigation();
              const q = new URLSearchParams(router.asPath.split('?')[1] || '');
              if (q.has('itemNum')) q.delete('itemNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              router.push(search ? `${base}?${search}` : base, undefined as any, { shallow: true } as any);
            }}
            onRefresh={refreshOrderData as any}
            {...(itemNavigation.hasNavigation() ? {
              onPrevious: handleNavigateItemPrevious,
              onNext: handleNavigateItemNext
            } : {})}
            hasPrevious={itemNavigation.canNavigatePrevious()}
            hasNext={itemNavigation.canNavigateNext()}
            currentIndex={itemNavigation.getCurrentIndex()}
            totalItems={itemNavigation.getTotalCount()}
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
              console.log('🔥🔥🔥 ORDER OVERVIEW CLOSE CLICKED (SECOND HANDLER)!!! 🔥🔥🔥');
              console.log('🔥 SETTING returningFromOverview flag for pageKey:', pageKey);
              
              // Set flag to indicate we're returning from overview - cache will be used
              try {
                window.sessionStorage.setItem(`returningFromOverview.${pageKey}`, 'true');
                console.log('🔥 SESSION STORAGE SET - returningFromOverview =', window.sessionStorage.getItem(`returningFromOverview.${pageKey}`));
              } catch (err) {
                console.log('🔥 ERROR setting session storage:', err);
              }
              orderNavigation.clearNavigation();
              const q = new URLSearchParams(router.asPath.split('?')[1] || '');
              if (q.has('orderNum')) q.delete('orderNum');
              if (q.has('accountNum')) q.delete('accountNum');
              const base = (router as any).pathname || '';
              const search = q.toString();
              console.log('🔥 NAVIGATING BACK TO:', search ? `${base}?${search}` : base);
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


