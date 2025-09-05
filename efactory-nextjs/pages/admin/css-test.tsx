/**
 * CSS Test Page
 * Test CSS variables directly
 */

import React, { useState, useEffect } from 'react';

export default function CSSTestPage() {
  const [cssVars, setCssVars] = useState<any>({});
  const [currentTheme, setCurrentTheme] = useState<string>('loading');
  const [isClient, setIsClient] = useState(false);

  const updateCSSVars = () => {
    if (typeof window === 'undefined') return;

    const computedStyle = getComputedStyle(document.documentElement);
    const bodyTheme = document.body.getAttribute('data-luno-theme');
    const htmlTheme = document.documentElement.getAttribute('data-luno-theme');
    
    setCurrentTheme(bodyTheme || htmlTheme || 'none');
    
    setCssVars({
      chartColor1: computedStyle.getPropertyValue('--chart-color1').trim(),
      chartColor2: computedStyle.getPropertyValue('--chart-color2').trim(),
      chartColor3: computedStyle.getPropertyValue('--chart-color3').trim(),
      chartColor4: computedStyle.getPropertyValue('--chart-color4').trim(),
      chartColor5: computedStyle.getPropertyValue('--chart-color5').trim(),
      primary: computedStyle.getPropertyValue('--primary').trim(),
      secondary: computedStyle.getPropertyValue('--secondary').trim()
    });
  };

  useEffect(() => {
    setIsClient(true);
    updateCSSVars();
    
    const observer = new MutationObserver(() => {
      updateCSSVars();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-luno-theme']
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-luno-theme']
    });

    return () => observer.disconnect();
  }, []);

  const testTheme = (theme: string) => {
    document.body.setAttribute('data-luno-theme', theme);
    setTimeout(updateCSSVars, 100);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CSS Variables Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <p>Current Theme: <span className="font-mono">{currentTheme}</span></p>
            <p>Body data-luno-theme: <span className="font-mono">{isClient ? (document.body.getAttribute('data-luno-theme') || 'null') : 'loading...'}</span></p>
            <p>HTML data-luno-theme: <span className="font-mono">{isClient ? (document.documentElement.getAttribute('data-luno-theme') || 'null') : 'loading...'}</span></p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => testTheme('indigo')}
              className="px-3 py-2 bg-indigo-500 text-white rounded text-sm"
            >
              Indigo
            </button>
            <button 
              onClick={() => testTheme('blue')}
              className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
            >
              Blue
            </button>
            <button 
              onClick={() => testTheme('green')}
              className="px-3 py-2 bg-green-500 text-white rounded text-sm"
            >
              Green
            </button>
            <button 
              onClick={() => testTheme('red')}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm"
            >
              Red
            </button>
            <button 
              onClick={() => testTheme('orange')}
              className="px-3 py-2 bg-orange-500 text-white rounded text-sm"
            >
              Orange
            </button>
            <button 
              onClick={() => testTheme('cyan')}
              className="px-3 py-2 bg-cyan-500 text-white rounded text-sm"
            >
              Cyan
            </button>
          </div>
        </div>

        {/* CSS Variables */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">CSS Variables</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {Object.entries(cssVars).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-full h-12 rounded mb-2 border border-border-color"
                  style={{ backgroundColor: value as string }}
                ></div>
                <div className="text-xs font-mono">{key}</div>
                <div className="text-xs text-font-color-100 break-all">{value as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw Values */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Raw CSS Values</h2>
          <pre className="bg-body-color p-4 rounded text-xs overflow-auto">
            {JSON.stringify(cssVars, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
