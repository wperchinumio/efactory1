import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ItemNavigationItem {
  item_number: string;
  account_wh?: string;
  [key: string]: any;
}

interface ItemNavigationState {
  items: ItemNavigationItem[];
  currentIndex: number;
  sourceContext?: string;
}

interface ItemNavigationContextType {
  navigationState: ItemNavigationState | null;
  setItemList: (items: ItemNavigationItem[], currentItemNumber: string, sourceContext?: string) => void;
  getPreviousItem: () => ItemNavigationItem | null;
  getNextItem: () => ItemNavigationItem | null;
  navigateToPrevious: () => ItemNavigationItem | null;
  navigateToNext: () => ItemNavigationItem | null;
  canNavigatePrevious: () => boolean;
  canNavigateNext: () => boolean;
  getTotalCount: () => number;
  getCurrentIndex: () => number; // 1-based
  clearNavigation: () => void;
  hasNavigation: () => boolean;
}

const ItemNavigationContext = createContext<ItemNavigationContextType | undefined>(undefined);

export const ItemNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<ItemNavigationState | null>(null);

  const setItemList = (items: ItemNavigationItem[], currentItemNumber: string, sourceContext?: string) => {
    const currentIndex = items.findIndex(i => i.item_number === currentItemNumber);
    if (currentIndex === -1) {
      setNavigationState(null);
      return;
    }
    setNavigationState({ items, currentIndex, ...(sourceContext && { sourceContext }) });
  };

  const getPreviousItem = (): ItemNavigationItem | null => {
    if (!navigationState || navigationState.currentIndex <= 0) return null;
    return navigationState.items[navigationState.currentIndex - 1] || null;
  };

  const getNextItem = (): ItemNavigationItem | null => {
    if (!navigationState || navigationState.currentIndex >= navigationState.items.length - 1) return null;
    return navigationState.items[navigationState.currentIndex + 1] || null;
  };

  const navigateToPrevious = (): ItemNavigationItem | null => {
    const prev = getPreviousItem();
    if (prev && navigationState) {
      setNavigationState({ ...navigationState, currentIndex: navigationState.currentIndex - 1 });
    }
    return prev;
  };

  const navigateToNext = (): ItemNavigationItem | null => {
    const next = getNextItem();
    if (next && navigationState) {
      setNavigationState({ ...navigationState, currentIndex: navigationState.currentIndex + 1 });
    }
    return next;
  };

  const canNavigatePrevious = () => navigationState !== null && navigationState.currentIndex > 0;
  const canNavigateNext = () => navigationState !== null && navigationState.currentIndex < (navigationState.items.length - 1);
  const getTotalCount = () => navigationState?.items.length || 0;
  const getCurrentIndex = () => navigationState ? navigationState.currentIndex + 1 : 0;
  const clearNavigation = () => setNavigationState(null);
  const hasNavigation = () => navigationState !== null && navigationState.items.length > 1;

  const value: ItemNavigationContextType = {
    navigationState,
    setItemList,
    getPreviousItem,
    getNextItem,
    navigateToPrevious,
    navigateToNext,
    canNavigatePrevious,
    canNavigateNext,
    getTotalCount,
    getCurrentIndex,
    clearNavigation,
    hasNavigation,
  };

  return (
    <ItemNavigationContext.Provider value={value}>
      {children}
    </ItemNavigationContext.Provider>
  );
};

export const useItemNavigation = (): ItemNavigationContextType => {
  const ctx = useContext(ItemNavigationContext);
  if (!ctx) throw new Error('useItemNavigation must be used within an ItemNavigationProvider');
  return ctx;
};



