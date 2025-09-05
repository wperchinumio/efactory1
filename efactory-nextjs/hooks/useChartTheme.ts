/**
 * React hook for managing chart themes
 * Automatically detects theme changes and provides current theme information
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentTheme, 
  getCurrentEChartsThemeName, 
  updateChartTheme,
  initializeChartThemes,
  type ThemeMode,
  type LunoTheme
} from '../lib/chartThemes';
import { initializeThemeFromStorage } from '../lib/themeStorage';

export interface UseChartThemeReturn {
  currentTheme: ThemeMode;
  currentLunoTheme: LunoTheme;
  echartsThemeName: string;
  isDark: boolean;
  refreshTheme: () => void;
}

/**
 * Hook to manage chart themes with automatic theme change detection
 */
export function useChartTheme(): UseChartThemeReturn {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('light');
  const [currentLunoTheme, setCurrentLunoTheme] = useState<LunoTheme>('indigo');
  const [echartsThemeName, setEchartsThemeName] = useState<string>('luno-indigo-light');


  // Initialize themes on first load
  useEffect(() => {
    // Load theme preferences from localStorage first
    initializeThemeFromStorage();
    // Then initialize chart themes
    initializeChartThemes();
  }, []);

  // Function to update theme state
  const updateThemeState = useCallback(() => {
    // Add a longer delay to ensure CSS variables are fully updated
    setTimeout(() => {
      const { mode, lunoTheme } = getCurrentTheme();
      setCurrentTheme(mode);
      setCurrentLunoTheme(lunoTheme);
      
      // Force a re-render by updating the theme name
      const newThemeName = updateChartTheme();
      setEchartsThemeName(newThemeName);
      
      // Log the actual CSS variables being read
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
      }
    }, 100);
  }, []);

  // Initial theme detection
  useEffect(() => {
    updateThemeState();
  }, [updateThemeState]);

  // Watch for theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;


    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-luno-theme')) {
          updateThemeState();
        }
      });
    });

    // Watch both html and body elements since themes can be set on either
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-luno-theme']
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-luno-theme']
    });

    return () => observer.disconnect();
  }, [updateThemeState]);

  // Manual refresh function
  const refreshTheme = useCallback(() => {
    updateThemeState();
  }, [updateThemeState]);

  return {
    currentTheme,
    currentLunoTheme,
    echartsThemeName,
    isDark: currentTheme === 'dark',
    refreshTheme
  };
}

/**
 * Hook for getting just the current ECharts theme name
 * Useful for simple chart components that only need the theme name
 */
export function useEChartsTheme(): string {
  const { echartsThemeName } = useChartTheme();
  return echartsThemeName;
}
