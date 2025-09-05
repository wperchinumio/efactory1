/**
 * CSS Debug Page
 * Test CSS specificity and variable inheritance
 */

import React, { useState, useEffect } from 'react';

export default function CSSDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isClient, setIsClient] = useState(false);

  const updateDebugInfo = () => {
    if (typeof window === 'undefined') return;

    const computedStyle = getComputedStyle(document.documentElement);
    const bodyTheme = document.body.getAttribute('data-luno-theme');
    const htmlTheme = document.documentElement.getAttribute('data-luno-theme');
    
    // Test different ways of reading CSS variables
    const testElement = document.createElement('div');
    testElement.setAttribute('data-luno-theme', bodyTheme || 'indigo');
    document.body.appendChild(testElement);
    const testStyle = getComputedStyle(testElement);
    
    setDebugInfo({
      bodyTheme,
      htmlTheme,
      finalTheme: bodyTheme || htmlTheme || 'indigo',
      // Read from document element
      docChartColor1: computedStyle.getPropertyValue('--chart-color1').trim(),
      docChartColor2: computedStyle.getPropertyValue('--chart-color2').trim(),
      // Read from test element
      testChartColor1: testStyle.getPropertyValue('--chart-color1').trim(),
      testChartColor2: testStyle.getPropertyValue('--chart-color2').trim(),
      // Check if CSS rules are being applied
      hasIndigoRule: computedStyle.getPropertyValue('--chart-color1').includes('#b9b3a8'),
      hasGreenRule: computedStyle.getPropertyValue('--chart-color1').includes('#79B989'),
      hasBlueRule: computedStyle.getPropertyValue('--chart-color1').includes('#2794eb'),
    });

    // Clean up test element
    document.body.removeChild(testElement);
  };

  useEffect(() => {
    setIsClient(true);
    updateDebugInfo();
    
    const observer = new MutationObserver(() => {
      updateDebugInfo();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-luno-theme']
    });

    return () => observer.disconnect();
  }, []);

  const testTheme = (theme: string) => {
    document.body.setAttribute('data-luno-theme', theme);
    setTimeout(updateDebugInfo, 200);
  };

  const forceRefresh = () => {
    // Force a complete refresh
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CSS Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <p>Body Theme: <span className="font-mono">{debugInfo.bodyTheme || 'none'}</span></p>
            <p>HTML Theme: <span className="font-mono">{debugInfo.htmlTheme || 'none'}</span></p>
            <p>Final Theme: <span className="font-mono">{debugInfo.finalTheme || 'none'}</span></p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-card-color rounded-lg border border-border-color p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => testTheme('indigo')}
                className="px-3 py-2 bg-indigo-500 text-white rounded text-sm"
              >
                Indigo
              </button>
              <button 
                onClick={() => testTheme('green')}
                className="px-3 py-2 bg-green-500 text-white rounded text-sm"
              >
                Green
              </button>
              <button 
                onClick={() => testTheme('blue')}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm"
              >
                Blue
              </button>
              <button 
                onClick={() => testTheme('red')}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm"
              >
                Red
              </button>
            </div>
            <button 
              onClick={forceRefresh}
              className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm"
            >
              Force Refresh Page
            </button>
          </div>
        </div>

        {/* CSS Variables Comparison */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">CSS Variables Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">From Document Element</h3>
              <div className="space-y-1 text-sm">
                <p>chart-color1: <span className="font-mono">{debugInfo.docChartColor1 || 'loading...'}</span></p>
                <p>chart-color2: <span className="font-mono">{debugInfo.docChartColor2 || 'loading...'}</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">From Test Element</h3>
              <div className="space-y-1 text-sm">
                <p>chart-color1: <span className="font-mono">{debugInfo.testChartColor1 || 'loading...'}</span></p>
                <p>chart-color2: <span className="font-mono">{debugInfo.testChartColor2 || 'loading...'}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Rule Detection */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">CSS Rule Detection</h2>
          <div className="space-y-2 text-sm">
            <p>Indigo rule active: <span className={debugInfo.hasIndigoRule ? 'text-green-500' : 'text-red-500'}>{debugInfo.hasIndigoRule ? 'YES' : 'NO'}</span></p>
            <p>Green rule active: <span className={debugInfo.hasGreenRule ? 'text-green-500' : 'text-red-500'}>{debugInfo.hasGreenRule ? 'YES' : 'NO'}</span></p>
            <p>Blue rule active: <span className={debugInfo.hasBlueRule ? 'text-green-500' : 'text-red-500'}>{debugInfo.hasBlueRule ? 'YES' : 'NO'}</span></p>
          </div>
        </div>

        {/* Raw Debug Info */}
        <div className="bg-card-color rounded-lg border border-border-color p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Raw Debug Info</h2>
          <pre className="bg-body-color p-4 rounded text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
