import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface GridCacheItem {
  data: any[];
  columns: any[];
  totalCount: number;
  selectedRowIndex?: number;
  selectedRowData?: any;
  scrollTop?: number;
  scrollLeft?: number;
  lastUpdated: number;
  viewId?: string;
  filters?: any;
  sort?: any;
  fromRowClick?: boolean; // Flag to indicate cache was populated after row click
  agFilterModel?: any; // AG Grid header filter model
  filterState?: any; // UI filter state
  returningFromOverview?: boolean; // Flag to indicate we're returning from overview
}

interface GridCacheState {
  [pageKey: string]: GridCacheItem | undefined;
}

interface GridCacheContextType {
  getCachedData: (pageKey: string) => GridCacheItem | null;
  setCachedData: (pageKey: string, data: any[], columns: any[], totalCount: number, viewId?: string, filters?: any, sort?: any, fromRowClick?: boolean, agFilterModel?: any, filterState?: any) => void;
  setSelectedRow: (pageKey: string, rowIndex: number, rowData: any) => void;
  getSelectedRow: (pageKey: string) => { index: number; data: any } | null;
  setScrollPosition: (pageKey: string, scrollTop: number, scrollLeft: number) => void;
  getScrollPosition: (pageKey: string) => { scrollTop: number; scrollLeft: number } | null;
  clearCache: (pageKey?: string) => void;
  isDataFresh: (pageKey: string, maxAge?: number) => boolean;
  updateRowData: (pageKey: string, rowIndex: number, newData: any) => void;
  markCacheFromRowClick: (pageKey: string, filters?: any) => void;
  setAgFilterModel: (pageKey: string, agFilterModel: any) => void;
  setFilterState: (pageKey: string, filterState: any) => void;
  setReturningFromOverview: (pageKey: string, returning: boolean) => void;
  isReturningFromOverview: (pageKey: string) => boolean;
}

const GridCacheContext = createContext<GridCacheContextType | undefined>(undefined);

export const GridCacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cache, setCache] = useState<GridCacheState>({});

  const getCachedData = useCallback((pageKey: string): GridCacheItem | null => {
    return cache[pageKey] || null;
  }, [cache]);

  const setCachedData = useCallback((
    pageKey: string, 
    data: any[], 
    columns: any[], 
    totalCount: number, 
    viewId?: string, 
    filters?: any, 
    sort?: any,
    fromRowClick?: boolean,
    agFilterModel?: any,
    filterState?: any
  ) => {
    
    setCache(prev => {
      const existing = prev[pageKey];
      // If fromRowClick is not explicitly provided, preserve the existing value
      const finalFromRowClick = fromRowClick !== undefined ? fromRowClick : (existing?.fromRowClick || false);
      
      const newCacheItem = {
        data,
        columns,
        totalCount,
        lastUpdated: Date.now(),
        ...(viewId !== undefined ? { viewId } : {}),
        ...(filters !== undefined ? { filters } : {}),
        ...(sort !== undefined ? { sort } : {}),
        fromRowClick: finalFromRowClick,
        ...(agFilterModel !== undefined ? { agFilterModel } : (existing?.agFilterModel ? { agFilterModel: existing.agFilterModel } : {})),
        ...(filterState !== undefined ? { filterState } : (existing?.filterState ? { filterState: existing.filterState } : {})),
        ...(existing?.selectedRowIndex !== undefined ? { selectedRowIndex: existing.selectedRowIndex } : {}),
        ...(existing?.selectedRowData !== undefined ? { selectedRowData: existing.selectedRowData } : {}),
        ...(existing?.scrollTop !== undefined ? { scrollTop: existing.scrollTop } : {}),
        ...(existing?.scrollLeft !== undefined ? { scrollLeft: existing.scrollLeft } : {})
      };
      
      return {
        ...prev,
        [pageKey]: newCacheItem
      };
    });
  }, []);

  const setSelectedRow = useCallback((pageKey: string, rowIndex: number, rowData: any) => {
    setCache(prev => {
      const existing = prev[pageKey];
      if (!existing) return prev;
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          selectedRowIndex: rowIndex,
          selectedRowData: rowData
        }
      };
    });
  }, []);

  const getSelectedRow = useCallback((pageKey: string): { index: number; data: any } | null => {
    const cached = cache[pageKey];
    if (!cached || cached.selectedRowIndex === undefined || !cached.selectedRowData) {
      return null;
    }
    return {
      index: cached.selectedRowIndex,
      data: cached.selectedRowData
    };
  }, [cache]);

  const setScrollPosition = useCallback((pageKey: string, scrollTop: number, scrollLeft: number) => {
    setCache(prev => {
      const existing = prev[pageKey];
      if (!existing) return prev;
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          scrollTop,
          scrollLeft
        }
      };
    });
  }, []);

  const getScrollPosition = useCallback((pageKey: string): { scrollTop: number; scrollLeft: number } | null => {
    const cached = cache[pageKey];
    if (!cached || cached.scrollTop === undefined || cached.scrollLeft === undefined) {
      return null;
    }
    return {
      scrollTop: cached.scrollTop,
      scrollLeft: cached.scrollLeft
    };
  }, [cache]);

  const clearCache = useCallback((pageKey?: string) => {
    if (pageKey) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[pageKey];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  const isDataFresh = useCallback((pageKey: string, maxAge: number = 5 * 60 * 1000): boolean => {
    const cached = cache[pageKey];
    if (!cached) return false;
    // If maxAge is 0, data is always fresh (no timeout)
    if (maxAge === 0) return true;
    return Date.now() - cached.lastUpdated < maxAge;
  }, [cache]);

  const updateRowData = useCallback((pageKey: string, rowIndex: number, newRowData: any) => {
    setCache(prev => {
      const existing = prev[pageKey];
      if (!existing) return prev;
      
      const updatedData = [...existing.data];
      updatedData[rowIndex] = { ...updatedData[rowIndex], ...newRowData };
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          data: updatedData
        }
      };
    });
  }, []);

  const markCacheFromRowClick = useCallback((pageKey: string, filters?: any) => {
    setCache(prev => {
      const existing = prev[pageKey];
      
      if (!existing) {
        // Create a minimal cache entry to mark the row click
        return {
          ...prev,
          [pageKey]: {
            data: [],
            columns: [],
            totalCount: 0,
            lastUpdated: Date.now(),
            fromRowClick: true,
            filters: filters
          }
        };
      }
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          fromRowClick: true,
          filters: filters || existing.filters
        }
      };
    });
  }, []);

  const setAgFilterModel = useCallback((pageKey: string, agFilterModel: any) => {
    setCache(prev => {
      const existing = prev[pageKey];
      
      // If cache exists, update it
      if (existing) {
        return {
          ...prev,
          [pageKey]: {
            ...existing,
            agFilterModel
          }
        };
      }
      
      // If no cache exists, create a minimal one to store the filter model
      return {
        ...prev,
        [pageKey]: {
          data: [],
          columns: [],
          totalCount: 0,
          lastUpdated: Date.now(),
          agFilterModel
        }
      };
    });
  }, []);

  const setFilterState = useCallback((pageKey: string, filterState: any) => {
    setCache(prev => {
      const existing = prev[pageKey];
      if (!existing) return prev;
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          filterState
        }
      };
    });
  }, []);

  const setReturningFromOverview = useCallback((pageKey: string, returning: boolean) => {
    setCache(prev => {
      const existing = prev[pageKey];
      
      if (returning && !existing) {
        // Create a minimal cache entry to track returning state
        return {
          ...prev,
          [pageKey]: {
            data: [],
            columns: [],
            totalCount: 0,
            lastUpdated: Date.now(),
            returningFromOverview: true
          }
        };
      }
      
      if (!existing) return prev;
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          returningFromOverview: returning
        }
      };
    });
  }, []);

  const isReturningFromOverview = useCallback((pageKey: string): boolean => {
    const cached = cache[pageKey];
    return cached?.returningFromOverview === true;
  }, [cache]);

  const value: GridCacheContextType = {
    getCachedData,
    setCachedData,
    setSelectedRow,
    getSelectedRow,
    setScrollPosition,
    getScrollPosition,
    clearCache,
    isDataFresh,
    updateRowData,
    markCacheFromRowClick,
    setAgFilterModel,
    setFilterState,
    setReturningFromOverview,
    isReturningFromOverview
  };

  return (
    <GridCacheContext.Provider value={value}>
      {children}
    </GridCacheContext.Provider>
  );
};

export const useGridCache = (): GridCacheContextType => {
  const context = useContext(GridCacheContext);
  if (context === undefined) {
    throw new Error('useGridCache must be used within a GridCacheProvider');
  }
  return context;
};
