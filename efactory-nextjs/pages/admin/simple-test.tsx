/**
 * Simple Test Page
 * Basic test to see if the hook is working
 */

import React from 'react';
import { useChartTheme } from '../../hooks/useChartTheme';

export default function SimpleTestPage() {
  console.log('SimpleTestPage rendering');
  
  const { echartsThemeName, currentTheme, currentLunoTheme } = useChartTheme();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <div className="space-y-2">
        <p>Current Theme: {currentTheme}</p>
        <p>Luno Theme: {currentLunoTheme}</p>
        <p>ECharts Theme: {echartsThemeName}</p>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Check the browser console for debug logs. You should see:
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
          <li>"SimpleTestPage rendering"</li>
          <li>"useChartTheme hook initialized"</li>
          <li>"Setting up theme change observer"</li>
          <li>"getCurrentTheme called" with theme values</li>
        </ul>
      </div>
    </div>
  );
}
