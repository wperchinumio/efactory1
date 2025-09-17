import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useGridCache } from '@/contexts/GridCacheContext';

interface UseOverviewNavigationProps {
  pageKey: string;
  queryParams: string[]; // e.g., ['orderNum', 'accountNum'] or ['itemNum']
  navigationContext?: {
    clearNavigation: () => void;
  };
}

/**
 * Shared hook for handling overview page navigation and closing
 * Ensures consistent behavior across all overview pages (Order, Item, ReturnTrak, etc.)
 */
export function useOverviewNavigation({ 
  pageKey, 
  queryParams,
  navigationContext 
}: UseOverviewNavigationProps) {
  const router = useRouter();
  const gridCache = useGridCache();

  /**
   * Handle closing an overview and returning to the grid
   * This ensures the grid uses cached data and doesn't make API calls
   */
  const handleCloseOverview = useCallback(() => {
    console.log(`🔥 OVERVIEW CLOSING - pageKey: ${pageKey}`);
    console.log(`🔥 Current URL: ${router.asPath}`);
    
    // CRITICAL: Set flag to use cache when returning to grid
    gridCache.setReturningFromOverview(pageKey, true);
    console.log(`🔥 SET returningFromOverview flag for pageKey: ${pageKey}`);
    
    // Clear navigation context if provided
    if (navigationContext) {
      navigationContext.clearNavigation();
    }
    
    // Remove query params and navigate back
    const q = new URLSearchParams(router.asPath.split('?')[1] || '');
    queryParams.forEach(param => {
      if (q.has(param)) q.delete(param);
    });
    
    const base = (router as any).pathname || '';
    const search = q.toString();
    const targetUrl = search ? `${base}?${search}` : base;
    
    console.log(`🔥 NAVIGATING BACK TO: ${targetUrl}`);
    router.push(targetUrl, undefined, { shallow: true });
  }, [pageKey, queryParams, navigationContext, router, gridCache]);

  return {
    handleCloseOverview
  };
}

/**
 * Convenience hooks for specific overview types
 */
export function useOrderOverviewNavigation(pageKey: string, orderNavigation: any) {
  return useOverviewNavigation({
    pageKey,
    queryParams: ['orderNum', 'accountNum'],
    navigationContext: orderNavigation
  });
}

export function useItemOverviewNavigation(pageKey: string, itemNavigation: any) {
  return useOverviewNavigation({
    pageKey,
    queryParams: ['itemNum'],
    navigationContext: itemNavigation
  });
}

export function useReturnTrakOverviewNavigation(pageKey: string, returnNavigation: any) {
  return useOverviewNavigation({
    pageKey,
    queryParams: ['rmaNum', 'returnNum'], // Adjust based on actual params
    navigationContext: returnNavigation
  });
}
