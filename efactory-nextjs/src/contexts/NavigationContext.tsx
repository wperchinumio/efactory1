import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { NavigationContextType } from '../types/api/auth';
import { getActiveTopMenu } from '../config/navigation';

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  userApps: number[];
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  userApps 
}) => {
  const router = useRouter();
  const [activeTopMenu, setActiveTopMenu] = useState<string | null>(null);
  const [activeSidebarMenu, setActiveSidebarMenu] = useState<string | null>(null);

  // Initialize with first available menu if no active menu
  useEffect(() => {
    if (!activeTopMenu && userApps.length > 0) {
      const { getVisibleTopMenus } = require('../config/navigation');
      const visibleMenus = getVisibleTopMenus(userApps);
      if (visibleMenus.length > 0) {
        setActiveTopMenu(visibleMenus[0].keyword);
      }
    }
  }, [userApps, activeTopMenu]);

  // Update active menus when route changes
  useEffect(() => {
    const pathname = router.pathname;
    const newActiveTopMenu = getActiveTopMenu(pathname, userApps);
    if (newActiveTopMenu) {
      setActiveTopMenu(newActiveTopMenu);
    }
    
    // Reset sidebar menu when top menu changes
    if (newActiveTopMenu !== activeTopMenu) {
      setActiveSidebarMenu(null);
    }
  }, [router.pathname, userApps, activeTopMenu]);

  const value: NavigationContextType = {
    userApps,
    activeTopMenu,
    activeSidebarMenu,
    setActiveTopMenu,
    setActiveSidebarMenu
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
