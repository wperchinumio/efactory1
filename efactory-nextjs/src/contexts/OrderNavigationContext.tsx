import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderNavigationItem {
  order_number: string;
  account_number?: string;
  [key: string]: any; // Allow additional order data
}

interface OrderNavigationState {
  orders: OrderNavigationItem[];
  currentIndex: number;
  sourceContext?: string; // e.g., 'orders-open', 'orders-shipped', etc.
}

interface OrderNavigationContextType {
  navigationState: OrderNavigationState | null;
  setOrderList: (orders: OrderNavigationItem[], currentOrderNumber: string, sourceContext?: string) => void;
  getCurrentOrder: () => OrderNavigationItem | null;
  getPreviousOrder: () => OrderNavigationItem | null;
  getNextOrder: () => OrderNavigationItem | null;
  navigateToPrevious: () => OrderNavigationItem | null;
  navigateToNext: () => OrderNavigationItem | null;
  canNavigatePrevious: () => boolean;
  canNavigateNext: () => boolean;
  getTotalCount: () => number;
  getCurrentIndex: () => number; // 1-based for display
  clearNavigation: () => void;
  hasNavigation: () => boolean;
}

const OrderNavigationContext = createContext<OrderNavigationContextType | undefined>(undefined);

export const OrderNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [navigationState, setNavigationState] = useState<OrderNavigationState | null>(null);

  const setOrderList = (orders: OrderNavigationItem[], currentOrderNumber: string, sourceContext?: string) => {
    const currentIndex = orders.findIndex(order => order.order_number === currentOrderNumber);
    if (currentIndex === -1) {
      // If current order not found in list, don't set navigation
      setNavigationState(null);
      return;
    }
    
    setNavigationState({
      orders,
      currentIndex,
      sourceContext
    });
  };

  const getCurrentOrder = (): OrderNavigationItem | null => {
    if (!navigationState || navigationState.currentIndex < 0 || navigationState.currentIndex >= navigationState.orders.length) {
      return null;
    }
    return navigationState.orders[navigationState.currentIndex];
  };

  const getPreviousOrder = (): OrderNavigationItem | null => {
    if (!navigationState || navigationState.currentIndex <= 0) {
      return null;
    }
    return navigationState.orders[navigationState.currentIndex - 1];
  };

  const getNextOrder = (): OrderNavigationItem | null => {
    if (!navigationState || navigationState.currentIndex >= navigationState.orders.length - 1) {
      return null;
    }
    return navigationState.orders[navigationState.currentIndex + 1];
  };

  const navigateToPrevious = (): OrderNavigationItem | null => {
    const previous = getPreviousOrder();
    if (previous && navigationState && navigationState.currentIndex > 0) {
      setNavigationState({
        ...navigationState,
        currentIndex: navigationState.currentIndex - 1
      });
    }
    return previous;
  };

  const navigateToNext = (): OrderNavigationItem | null => {
    const next = getNextOrder();
    if (next && navigationState && navigationState.currentIndex < navigationState.orders.length - 1) {
      setNavigationState({
        ...navigationState,
        currentIndex: navigationState.currentIndex + 1
      });
    }
    return next;
  };

  const canNavigatePrevious = (): boolean => {
    return navigationState !== null && navigationState.currentIndex > 0;
  };

  const canNavigateNext = (): boolean => {
    return navigationState !== null && navigationState.currentIndex < navigationState.orders.length - 1;
  };

  const getTotalCount = (): number => {
    return navigationState?.orders.length || 0;
  };

  const getCurrentIndex = (): number => {
    // Return 1-based index for display
    return navigationState ? navigationState.currentIndex + 1 : 0;
  };

  const clearNavigation = () => {
    setNavigationState(null);
  };

  const hasNavigation = (): boolean => {
    return navigationState !== null && navigationState.orders.length > 1;
  };

  const value: OrderNavigationContextType = {
    navigationState,
    setOrderList,
    getCurrentOrder,
    getPreviousOrder,
    getNextOrder,
    navigateToPrevious,
    navigateToNext,
    canNavigatePrevious,
    canNavigateNext,
    getTotalCount,
    getCurrentIndex,
    clearNavigation,
    hasNavigation
  };

  return (
    <OrderNavigationContext.Provider value={value}>
      {children}
    </OrderNavigationContext.Provider>
  );
};

export const useOrderNavigation = (): OrderNavigationContextType => {
  const context = useContext(OrderNavigationContext);
  if (context === undefined) {
    throw new Error('useOrderNavigation must be used within an OrderNavigationProvider');
  }
  return context;
};
