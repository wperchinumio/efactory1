import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { NavigationContextType } from '../types/api/auth';
import { getActiveTopMenu, getVisibleTopMenus } from '../config/navigation';
import { getThemePreferences } from '../lib/themeStorage';

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
  const [showTopMenuIcons, setShowTopMenuIcons] = useState<boolean>(false);

  // Initialize with first available menu if no active menu
  useEffect(() => {
    if (!activeTopMenu && userApps.length > 0) {
      const visibleMenus = getVisibleTopMenus(userApps);
      if (visibleMenus.length > 0 && visibleMenus[0]) {
        setActiveTopMenu(visibleMenus[0].keyword);
      }
    }
  }, [userApps, activeTopMenu]);

  // Load theme preferences on mount and listen for changes
  useEffect(() => {
    const themePrefs = getThemePreferences();
    setShowTopMenuIcons(themePrefs.showTopMenuIcons);

    // Listen for theme changes
    const handleThemeChange = () => {
      const newThemePrefs = getThemePreferences();
      setShowTopMenuIcons(newThemePrefs.showTopMenuIcons);
    };
    
    window.addEventListener('themePreferencesChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('themePreferencesChanged', handleThemeChange);
    };
  }, []);

  // Update active top menu when route changes
  useEffect(() => {
    // Strip query strings for proper route matching
    const pathname = router.asPath.split('?')[0] || '';
    
    // Skip admin routes - they don't use dynamic navigation
    if (pathname.startsWith('/admin')) {
      return;
    }
    
    const newActiveTopMenu = getActiveTopMenu(pathname, userApps);
    
    if (newActiveTopMenu && newActiveTopMenu !== activeTopMenu) {
      setActiveTopMenu(newActiveTopMenu);
    }
  }, [router.asPath, userApps]);

  const value: NavigationContextType = {
    userApps,
    activeTopMenu,
    setActiveTopMenu,
    showTopMenuIcons,
    setShowTopMenuIcons
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
