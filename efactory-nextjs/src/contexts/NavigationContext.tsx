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
  console.log('🚀 NAVIGATION PROVIDER RENDERED!');
  console.log('🔍 NAVIGATION PROVIDER - Received userApps:', userApps);
  const router = useRouter();
  const [activeTopMenu, setActiveTopMenu] = useState<string | null>(null);

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

  // Update active top menu when route changes
  useEffect(() => {
    console.log('🚀 NAVIGATION CONTEXT USEEFFECT TRIGGERED!');
    // Strip query strings for proper route matching
    const pathname = router.asPath.split('?')[0];
    console.log('🔄 Navigation context - pathname changed:', pathname, 'userApps:', userApps);
    
    // Skip admin routes - they don't use dynamic navigation
    if (pathname.startsWith('/admin')) {
      console.log('🔧 Admin route detected, skipping dynamic navigation');
      return;
    }
    
    const newActiveTopMenu = getActiveTopMenu(pathname, userApps);
    console.log('🎯 New active top menu:', newActiveTopMenu);
    
    if (newActiveTopMenu && newActiveTopMenu !== activeTopMenu) {
      console.log('🔄 Setting active top menu:', newActiveTopMenu);
      setActiveTopMenu(newActiveTopMenu);
    }
  }, [router.asPath, userApps]);

  const value: NavigationContextType = {
    userApps,
    activeTopMenu,
    setActiveTopMenu
  };

  console.log('🔍 NAVIGATION CONTEXT VALUE:', { activeTopMenu });

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
