/**
 * Theme Debug Page
 * Helps debug theme detection and chart color updates
 */

import React, { useState, useEffect } from 'react';
import { useChartTheme } from '../../hooks/useChartTheme';

export default function ThemeDebugPage() {
  const { echartsThemeName, currentTheme, currentLunoTheme, refreshTheme } = useChartTheme();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      if (typeof window === 'undefined') return;

      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      const dataTheme = htmlElement.getAttribute('data-theme') || bodyElement.getAttribute('data-theme');
      const dataLunoTheme = htmlElement.getAttribute('data-luno-theme') || bodyElement.getAttribute('data-luno-theme');
      
      // Read CSS variables
      const chartColor1 = getComputedStyle(document.documentElement).getPropertyValue('--chart-color1').trim();
      const chartColor2 = getComputedStyle(document.documentElement).getPropertyValue('--chart-color2').trim();
      const chartColor3 = getComputedStyle(document.documentElement).getPropertyValue('--chart-color3').trim();
      const chartColor4 = getComputedStyle(document.documentElement).getPropertyValue('--chart-color4').trim();
      const chartColor5 = getComputedStyle(document.documentElement).getPropertyValue('--chart-color5').trim();

      setDebugInfo({
        dataTheme,
        dataLunoTheme,
        chartColors: {
          color1: chartColor1,
          color2: chartColor2,
          color3: chartColor3,
          color4: chartColor4,
          color5: chartColor5
        },
        timestamp: new Date().toLocaleTimeString()
      });
    };

    // Initial update
    updateDebugInfo();

    // Watch for changes on both html and body elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || mutation.attributeName === 'data-luno-theme')) {
          console.log('Theme change detected:', mutation.attributeName, mutation.target);
          updateDebugInfo();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-luno-theme']
    });
    
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-luno-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-font-color mb-6">Theme Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hook Information */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Hook Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Current Theme:</span> {currentTheme}
            </div>
            <div>
              <span className="font-medium">Luno Theme:</span> {currentLunoTheme}
            </div>
            <div>
              <span className="font-medium">ECharts Theme:</span> {echartsThemeName}
            </div>
          </div>
        </div>

        {/* DOM Information */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">DOM Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">HTML data-theme:</span> {document.documentElement.getAttribute('data-theme') || 'null'}
            </div>
            <div>
              <span className="font-medium">Body data-theme:</span> {document.body.getAttribute('data-theme') || 'null'}
            </div>
            <div>
              <span className="font-medium">HTML data-luno-theme:</span> {document.documentElement.getAttribute('data-luno-theme') || 'null'}
            </div>
            <div>
              <span className="font-medium">Body data-luno-theme:</span> {document.body.getAttribute('data-luno-theme') || 'null'}
            </div>
            <div>
              <span className="font-medium">Final data-theme:</span> {debugInfo.dataTheme}
            </div>
            <div>
              <span className="font-medium">Final data-luno-theme:</span> {debugInfo.dataLunoTheme}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {debugInfo.timestamp}
            </div>
          </div>
        </div>

        {/* CSS Variables */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Chart Color Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {debugInfo.chartColors && Object.entries(debugInfo.chartColors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-full h-12 rounded mb-2 border border-border-color"
                  style={{ backgroundColor: value as string }}
                ></div>
                <div className="text-xs font-mono">{key}</div>
                <div className="text-xs text-font-color-100">{value as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-4">
            <div className="space-y-2 text-sm text-font-color-100">
              <p>1. Open the browser console to see debug logs</p>
              <p>2. Change the color theme in the header settings</p>
              <p>3. Watch the console logs and this page to see if theme changes are detected</p>
              <p>4. The chart colors should update automatically when you change the Luno theme</p>
            </div>
            <div className="pt-4 border-t border-border-color">
              <button 
                onClick={refreshTheme}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Force Refresh Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
