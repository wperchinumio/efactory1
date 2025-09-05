/**
 * Manual Test Page
 * Test theme changes manually
 */

import React, { useState } from 'react';
import { useChartTheme } from '../../hooks/useChartTheme';
import { updateChartTheme } from '../../lib/chartThemes';

export default function ManualTestPage() {
  const { echartsThemeName, currentTheme, currentLunoTheme, refreshTheme } = useChartTheme();
  const [testResults, setTestResults] = useState<any>({});

  const testThemeChange = () => {
    console.log('=== MANUAL THEME TEST ===');
    
    // Test 1: Check current DOM state
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const bodyTheme = document.body.getAttribute('data-theme');
    const htmlLunoTheme = document.documentElement.getAttribute('data-luno-theme');
    const bodyLunoTheme = document.body.getAttribute('data-luno-theme');
    
    console.log('DOM State:', { htmlTheme, bodyTheme, htmlLunoTheme, bodyLunoTheme });
    
    // Test 2: Check CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const cssVars = {
      chartColor1: computedStyle.getPropertyValue('--chart-color1').trim(),
      chartColor2: computedStyle.getPropertyValue('--chart-color2').trim(),
      chartColor3: computedStyle.getPropertyValue('--chart-color3').trim(),
      chartColor4: computedStyle.getPropertyValue('--chart-color4').trim(),
      chartColor5: computedStyle.getPropertyValue('--chart-color5').trim()
    };
    
    console.log('CSS Variables:', cssVars);
    
    // Test 3: Force theme update
    console.log('Forcing theme update...');
    const newThemeName = updateChartTheme();
    console.log('New theme name:', newThemeName);
    
    setTestResults({
      domState: { htmlTheme, bodyTheme, htmlLunoTheme, bodyLunoTheme },
      cssVars,
      newThemeName,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const simulateThemeChange = (theme: string) => {
    console.log(`=== SIMULATING THEME CHANGE TO ${theme} ===`);
    document.body.setAttribute('data-luno-theme', theme);
    setTimeout(() => {
      testThemeChange();
    }, 200);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manual Theme Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <p>Current Theme: {currentTheme}</p>
            <p>Luno Theme: {currentLunoTheme}</p>
            <p>ECharts Theme: {echartsThemeName}</p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-4">
            <button 
              onClick={testThemeChange}
              className="w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Test Current Theme
            </button>
            
            <button 
              onClick={refreshTheme}
              className="w-full px-4 py-2 bg-secondary text-white rounded hover:bg-secondary/90"
            >
              Force Refresh Theme
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => simulateThemeChange('indigo')}
                className="px-3 py-2 bg-indigo-500 text-white rounded text-sm"
              >
                Indigo
              </button>
              <button 
                onClick={() => simulateThemeChange('blue')}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
              >
                Blue
              </button>
              <button 
                onClick={() => simulateThemeChange('green')}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm"
              >
                Green
              </button>
              <button 
                onClick={() => simulateThemeChange('red')}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm"
              >
                Red
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.domState && (
          <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">DOM State:</h3>
                <pre className="bg-body-color p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(testResults.domState, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">CSS Variables:</h3>
                <pre className="bg-body-color p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(testResults.cssVars, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">New Theme Name:</h3>
                <p className="font-mono text-sm">{testResults.newThemeName}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Timestamp:</h3>
                <p className="text-sm">{testResults.timestamp}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
