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
}

interface GridCacheState {
  [pageKey: string]: GridCacheItem | undefined;
}

interface GridCacheContextType {
  getCachedData: (pageKey: string) => GridCacheItem | null;
  setCachedData: (pageKey: string, data: any[], columns: any[], totalCount: number, viewId?: string, filters?: any, sort?: any, fromRowClick?: boolean) => void;
  setSelectedRow: (pageKey: string, rowIndex: number, rowData: any) => void;
  getSelectedRow: (pageKey: string) => { index: number; data: any } | null;
  setScrollPosition: (pageKey: string, scrollTop: number, scrollLeft: number) => void;
  getScrollPosition: (pageKey: string) => { scrollTop: number; scrollLeft: number } | null;
  clearCache: (pageKey?: string) => void;
  isDataFresh: (pageKey: string, maxAge?: number) => boolean;
  updateRowData: (pageKey: string, rowIndex: number, newData: any) => void;
  markCacheFromRowClick: (pageKey: string, filters?: any) => void;
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
    fromRowClick?: boolean
  ) => {
    setCache(prev => {
      const existing = prev[pageKey];
      // If fromRowClick is not explicitly provided, preserve the existing value
      const finalFromRowClick = fromRowClick !== undefined ? fromRowClick : (existing?.fromRowClick || false);
      
      console.log('🎯 setCachedData called:', { pageKey, fromRowClick, existingFromRowClick: existing?.fromRowClick, finalFromRowClick });
      
      return {
        ...prev,
        [pageKey]: {
          data,
          columns,
          totalCount,
          lastUpdated: Date.now(),
          viewId,
          filters,
          sort,
          fromRowClick: finalFromRowClick,
          selectedRowIndex: existing?.selectedRowIndex,
          selectedRowData: existing?.selectedRowData,
          scrollTop: existing?.scrollTop,
          scrollLeft: existing?.scrollLeft
        }
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
      console.log('🎯 markCacheFromRowClick called:', { pageKey, hasExisting: !!existing, existingFromRowClick: existing?.fromRowClick });
      
      if (!existing) {
        // Create a minimal cache entry to mark the row click
        console.log('🎯 Creating new cache entry with fromRowClick: true');
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
      
      console.log('🎯 Updating existing cache entry with fromRowClick: true');
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
    markCacheFromRowClick
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
