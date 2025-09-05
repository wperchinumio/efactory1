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

  console.log('useChartTheme hook initialized');

  // Initialize themes on first load
  useEffect(() => {
    initializeChartThemes();
  }, []);

  // Function to update theme state
  const updateThemeState = useCallback(() => {
    console.log('updateThemeState called');
    // Add a longer delay to ensure CSS variables are fully updated
    setTimeout(() => {
      const { mode, lunoTheme } = getCurrentTheme();
      console.log('Theme detected:', { mode, lunoTheme });
      setCurrentTheme(mode);
      setCurrentLunoTheme(lunoTheme);
      
      // Force a re-render by updating the theme name
      const newThemeName = updateChartTheme();
      setEchartsThemeName(newThemeName);
      console.log('Chart theme updated to:', newThemeName);
      
      // Log the actual CSS variables being read
      if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        console.log('CSS Variables being read:', {
          chartColor1: computedStyle.getPropertyValue('--chart-color1').trim(),
          chartColor2: computedStyle.getPropertyValue('--chart-color2').trim(),
          chartColor3: computedStyle.getPropertyValue('--chart-color3').trim(),
          chartColor4: computedStyle.getPropertyValue('--chart-color4').trim(),
          chartColor5: computedStyle.getPropertyValue('--chart-color5').trim()
        });
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

    console.log('Setting up theme change observer');

    const observer = new MutationObserver((mutations) => {
      console.log('Mutation detected:', mutations);
      mutations.forEach((mutation) => {
        console.log('Mutation details:', {
          type: mutation.type,
          attributeName: mutation.attributeName,
          target: mutation.target
        });
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-luno-theme')) {
          console.log('Theme change detected, calling updateThemeState');
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
