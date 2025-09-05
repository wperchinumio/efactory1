/**
 * Chart Theme Demo Page
 * Demonstrates the new chart theme system that integrates with Luno's color themes
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { useChartTheme } from '../../hooks/useChartTheme';
import ChartThemeDemo from '../../components/charts/ChartThemeDemo';

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function ChartThemeDemoPage() {
	const { echartsThemeName, currentTheme, currentLunoTheme } = useChartTheme();

	// Sample data for different chart types
	const lineChartData = {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
		series: [
			{ name: 'Sales', data: [120, 200, 150, 80, 70, 110, 130] },
			{ name: 'Revenue', data: [60, 120, 100, 40, 35, 55, 65] },
			{ name: 'Profit', data: [20, 80, 50, 20, 15, 25, 35] }
		]
	};

	const pieChartData = [
		{ name: 'Desktop', value: 1048 },
		{ name: 'Mobile', value: 735 },
		{ name: 'Tablet', value: 580 },
		{ name: 'Other', value: 484 }
	];

	const barChartData = {
		categories: ['Q1', 'Q2', 'Q3', 'Q4'],
		series: [
			{ name: 'Product A', data: [23, 45, 56, 78] },
			{ name: 'Product B', data: [13, 23, 20, 27] },
			{ name: 'Product C', data: [22, 18, 19, 25] }
		]
	};

	// ECharts configurations
	const lineChartOption = {
		title: {
			text: 'Line Chart - Sales Trend',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: lineChartData.series.map(s => s.name),
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
			data: lineChartData.categories
		},
		yAxis: {
			type: 'value'
		},
		series: lineChartData.series.map(series => ({
			name: series.name,
			type: 'line',
			data: series.data,
			smooth: true
		}))
	};

	const pieChartOption = {
		title: {
			text: 'Pie Chart - Device Distribution',
			left: 'center'
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			top: 'middle'
		},
		series: [{
			name: 'Devices',
			type: 'pie',
			radius: '50%',
			data: pieChartData,
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	const barChartOption = {
		title: {
			text: 'Bar Chart - Quarterly Sales',
			left: 'center'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			data: barChartData.series.map(s => s.name),
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
			data: barChartData.categories
		},
		yAxis: {
			type: 'value'
		},
		series: barChartData.series.map(series => ({
			name: series.name,
			type: 'bar',
			data: series.data
		}))
	};

	return (
		<div className="p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-font-color mb-2">Chart Theme Demo</h1>
				<p className="text-font-color-100">
					This page demonstrates the new chart theme system that automatically responds to Luno's color themes.
					Try changing the color theme in the header to see how all charts update automatically.
				</p>
			</div>

			{/* Theme Information */}
			<div className="mb-8 p-6 bg-card-color rounded-lg border border-border-color">
				<h2 className="text-xl font-semibold mb-4">Current Theme Information</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
					<div>
						<span className="font-medium text-font-color-100">Mode:</span>
						<span className="ml-2 text-font-color">{currentTheme}</span>
					</div>
					<div>
						<span className="font-medium text-font-color-100">Luno Theme:</span>
						<span className="ml-2 text-font-color">{currentLunoTheme}</span>
					</div>
					<div>
						<span className="font-medium text-font-color-100">ECharts Theme:</span>
						<span className="ml-2 text-font-color font-mono text-xs">{echartsThemeName}</span>
					</div>
					<div>
						<span className="font-medium text-font-color-100">Is Dark:</span>
						<span className="ml-2 text-font-color">{currentTheme === 'dark' ? 'Yes' : 'No'}</span>
					</div>
				</div>
			</div>

			{/* Chart Examples */}
			<div className="space-y-8">
				{/* Line Chart */}
				<div className="bg-card-color rounded-lg border border-border-color p-6">
					<ReactECharts
						option={lineChartOption}
						theme={echartsThemeName}
						style={{ height: '400px', width: '100%' }}
						key={`line-chart-${echartsThemeName}`}
					/>
				</div>

				{/* Bar and Pie Charts Side by Side */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-card-color rounded-lg border border-border-color p-6">
						<ReactECharts
							option={barChartOption}
							theme={echartsThemeName}
							style={{ height: '400px', width: '100%' }}
							key={`bar-chart-${echartsThemeName}`}
						/>
					</div>
					<div className="bg-card-color rounded-lg border border-border-color p-6">
						<ReactECharts
							option={pieChartOption}
							theme={echartsThemeName}
							style={{ height: '400px', width: '100%' }}
							key={`pie-chart-${echartsThemeName}`}
						/>
					</div>
				</div>

				{/* Interactive Demo Component */}
				<div className="bg-card-color rounded-lg border border-border-color p-6">
					<h2 className="text-xl font-semibold mb-4">Interactive Demo Component</h2>
					<ChartThemeDemo />
				</div>
			</div>

			{/* Instructions */}
			<div className="mt-8 p-6 bg-card-color rounded-lg border border-border-color">
				<h2 className="text-xl font-semibold mb-4">How to Use the Chart Theme System</h2>
				<div className="space-y-4 text-sm text-font-color-100">
					<div>
						<h3 className="font-medium text-font-color mb-2">1. Import the Hook</h3>
						<code className="block bg-body-color p-2 rounded text-xs font-mono">
							{`import { useChartTheme } from '@/hooks/useChartTheme';`}
						</code>
					</div>
					<div>
						<h3 className="font-medium text-font-color mb-2">2. Use in Your Component</h3>
						<code className="block bg-body-color p-2 rounded text-xs font-mono">
							{`const { echartsThemeName, currentTheme, currentLunoTheme } = useChartTheme();`}
						</code>
					</div>
					<div>
						<h3 className="font-medium text-font-color mb-2">3. Apply to ECharts</h3>
						<code className="block bg-body-color p-2 rounded text-xs font-mono">
							{`<ReactECharts 
  option={chartOption} 
  theme={echartsThemeName}
  key={\`chart-\${echartsThemeName}\`}
/>`}
						</code>
					</div>
					<div>
						<h3 className="font-medium text-font-color mb-2">4. Automatic Updates</h3>
						<p>Charts will automatically update when users change the color theme in the header settings.</p>
					</div>
				</div>
			</div>
		</div>
	);
}
