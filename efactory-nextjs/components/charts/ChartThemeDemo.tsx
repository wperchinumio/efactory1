/**
 * Demo component showing how to use the new chart theme system
 * This component demonstrates how charts automatically respond to theme changes
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { useChartTheme } from '../../hooks/useChartTheme';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface ChartThemeDemoProps {
  className?: string;
}

export default function ChartThemeDemo({ className = '' }: ChartThemeDemoProps) {
  const { echartsThemeName, currentTheme, currentLunoTheme, isDark } = useChartTheme();

  // Sample data for demonstration
  const sampleData = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      {
        name: 'Sales',
        data: [120, 200, 150, 80, 70, 110]
      },
      {
        name: 'Revenue',
        data: [60, 120, 100, 40, 35, 55]
      },
      {
        name: 'Profit',
        data: [20, 80, 50, 20, 15, 25]
      }
    ]
  };

  // ECharts configuration
  const option = {
    title: {
      text: `Chart Theme Demo - ${currentLunoTheme} (${currentTheme})`,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: sampleData.series.map(s => s.name),
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: sampleData.categories,
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: sampleData.series.map(series => ({
      name: series.name,
      type: 'bar',
      data: series.data,
      emphasis: {
        focus: 'series'
      }
    }))
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 p-4 bg-card-color rounded-lg border border-border-color">
        <h3 className="text-lg font-semibold mb-2">Current Theme Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Mode:</span> {currentTheme}
          </div>
          <div>
            <span className="font-medium">Luno Theme:</span> {currentLunoTheme}
          </div>
          <div>
            <span className="font-medium">ECharts Theme:</span> {echartsThemeName}
          </div>
          <div>
            <span className="font-medium">Is Dark:</span> {isDark ? 'Yes' : 'No'}
          </div>
        </div>
      </div>
      
      <div className="bg-card-color rounded-lg border border-border-color p-4">
        <ReactECharts
          option={option}
          theme={echartsThemeName}
          style={{ height: '400px', width: '100%' }}
          key={`demo-chart-${echartsThemeName}`} // Force re-render when theme changes
        />
      </div>
      
      <div className="mt-4 p-4 bg-card-color rounded-lg border border-border-color">
        <h4 className="text-md font-semibold mb-2">How to Use</h4>
        <div className="text-sm space-y-2">
          <p>This chart automatically updates when you change the theme using the Color Settings in the header.</p>
          <p>Try changing between different color themes (indigo, blue, cyan, green, orange, blush, red) and toggle between light/dark mode.</p>
          <p>The chart colors will automatically update to match the selected Luno theme palette.</p>
        </div>
      </div>
    </div>
  );
}
