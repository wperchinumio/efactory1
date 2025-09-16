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
}

interface GridCacheState {
  [pageKey: string]: GridCacheItem | undefined;
}

interface GridCacheContextType {
  getCachedData: (pageKey: string) => GridCacheItem | null;
  setCachedData: (pageKey: string, data: any[], columns: any[], totalCount: number, viewId?: string, filters?: any, sort?: any) => void;
  setSelectedRow: (pageKey: string, rowIndex: number, rowData: any) => void;
  getSelectedRow: (pageKey: string) => { index: number; data: any } | null;
  setScrollPosition: (pageKey: string, scrollTop: number, scrollLeft: number) => void;
  getScrollPosition: (pageKey: string) => { scrollTop: number; scrollLeft: number } | null;
  clearCache: (pageKey?: string) => void;
  isDataFresh: (pageKey: string, maxAge?: number) => boolean;
  updateRowData: (pageKey: string, rowIndex: number, newData: any) => void;
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
    sort?: any
  ) => {
    setCache(prev => ({
      ...prev,
      [pageKey]: {
        data,
        columns,
        totalCount,
        lastUpdated: Date.now(),
        viewId,
        filters,
        sort,
        selectedRowIndex: prev[pageKey]?.selectedRowIndex,
        selectedRowData: prev[pageKey]?.selectedRowData
      }
    }));
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
    return Date.now() - cached.lastUpdated < maxAge;
  }, [cache]);

  const updateRowData = useCallback((pageKey: string, rowIndex: number, newData: any) => {
    setCache(prev => {
      const existing = prev[pageKey];
      if (!existing) return prev;
      
      const newData = [...existing.data];
      newData[rowIndex] = { ...newData[rowIndex], ...newData };
      
      return {
        ...prev,
        [pageKey]: {
          ...existing,
          data: newData
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
    updateRowData
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
