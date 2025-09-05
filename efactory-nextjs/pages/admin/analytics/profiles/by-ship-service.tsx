import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { exportAnalyticsReport } from '@/lib/exportUtils';
import { useChartAnimation } from '@/hooks/useChartAnimation';
import { useChartTheme } from '@/hooks/useChartTheme';
import * as echarts from 'echarts';
import { 
	IconCalendar, 
	IconDownload, 
	IconRefresh, 
	IconChartBar,
	IconTable,
	IconFilter,
	IconX,
	IconTrendingUp,
	IconPackage,
	IconShoppingCart,
	IconList,
	IconBox,
	IconArrowUp,
	IconArrowDown,
	IconMinus
} from '@tabler/icons-react';
import { 
	ShippedDateFilterCombobox,
	WarehouseFilterCombobox,
	AccountFilterCombobox,
	CountryFilterCombobox,
	StateFilterCombobox
} from '@/components/filters';
import { AnalyticsFilterHeader, ChartControls, LoadingState } from '@/components/analytics';

interface ChartRow {
	id?: string;
	name?: string;
	orders?: number;
	lines?: number;
	packages?: number;
	units?: number;
	year_1?: Record<string, number>;
	year_2?: Record<string, number>;
}

interface FilterState {
	shippedDate: string;
	warehouse: string[];  // Multi-select array
	account: string[];    // Multi-select array  
	country: string;
	state: string;
}

export default function AdminAnalyticsByShipService() {
	const [rows, setRows] = useState<ChartRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
	const [mounted, setMounted] = useState(false);
	
	// Chart animation hook
	const { triggerDataLoadAnimation, triggerDatasetChangeAnimation, getAnimationSettings } = useChartAnimation();
	
	// Chart dataset and comparison options
	const [selectedDataset, setSelectedDataset] = useState<'orders' | 'lines' | 'packages' | 'units'>('orders');
	const [compareYears, setCompareYears] = useState(false);
	const [showTrendLine, setShowTrendLine] = useState(false);

	// Filter state
	const [filters, setFilters] = useState<FilterState>({
		shippedDate: '-90D',  // Default to Last 90 Days
		warehouse: [],
		account: [],
		country: '',
		state: ''
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	const runReport = async () => {
		try {
		setLoading(true);
		setError(null);
			
			const filterArray = [];
			
			// Shipped Date filter
			if (filters.shippedDate && filters.shippedDate !== '') {
				if (filters.shippedDate.includes('|')) {
					const [startDate, endDate] = filters.shippedDate.split('|');
					filterArray.push({ field: 'shipped_date', value: startDate, oper: '>=' });
					filterArray.push({ field: 'shipped_date', value: endDate, oper: '<=' });
				} else {
					filterArray.push({ field: 'shipped_date', value: filters.shippedDate, oper: '=' });
				}
			}
			
			// Warehouse filter (multi-select)
			if (filters.warehouse.length > 0) {
				filterArray.push({ field: 'sub_warehouse', value: filters.warehouse.join(','), oper: '=' });
			}
			if (filters.account.length > 0) {
				filterArray.push({ field: 'account_number', value: filters.account.join(','), oper: '=' });
			}
			if (filters.country) {
				filterArray.push({ field: 'country', value: filters.country, oper: '=' });
			}
			if (filters.state) {
				filterArray.push({ field: 'state', value: filters.state, oper: '=' });
			}
			
			const res = await postJson<{ data?: { chart?: ChartRow[] } }>(
				'/api/analytics',
				{
					stats: 'ship_service_historical',
					global_analytics: true,
					filter: {
						and: filterArray,
					},
				},
			);
			
			
			setRows(res.data?.chart || []);
			setLoaded(true);
			triggerDataLoadAnimation();
		} catch (e: any) {
			setError(e.message || 'Failed to load data');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (mounted) {
			runReport();
		}
	}, [mounted]);

	const updateFilter = (key: keyof FilterState, value: any) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const handleDatasetChange = (dataset: 'orders' | 'lines' | 'packages' | 'units') => {
		setSelectedDataset(dataset);
		triggerDatasetChangeAnimation();
	};

	const clearAllFilters = () => {
		setFilters({
			shippedDate: '-90D',
			warehouse: [],
			account: [],
			country: '',
			state: ''
		});
	};

	const hasActiveFilters = () => {
		return (
			filters.shippedDate !== '-90D' ||
			filters.warehouse.length > 0 ||
			filters.account.length > 0 ||
			filters.country !== '' ||
			filters.state !== ''
		);
	};


	const onDownload = () => {
		if (!rows.length) {
			alert('No data available to export');
			return;
		}

		try {
			// Use the original data (before Top 10 + Others processing) for export
			exportAnalyticsReport(
				rows,
				'Analytics By Ship Service',
				'by-ship-service',
				{
					compareYears,
					selectedDataset
				}
			);
		} catch (error) {
			console.error('Export failed:', error);
			alert(`Failed to export data: ${error.message}`);
		}
	};

	const stats = useMemo(() => {
		if (!rows.length) return { totalOrders: 0, totalLines: 0, totalPackages: 0, totalUnits: 0 };
		return rows.reduce((acc, row) => ({
			totalOrders: acc.totalOrders + (row.orders || 0),
			totalLines: acc.totalLines + (row.lines || 0),
			totalPackages: acc.totalPackages + (row.packages || 0),
			totalUnits: acc.totalUnits + (row.units || 0)
		}), { totalOrders: 0, totalLines: 0, totalPackages: 0, totalUnits: 0 });
	}, [rows]);

	// Calculate additional metrics
	const avgOrdersPerPeriod = rows.length > 0 ? stats.totalOrders / rows.length : 0;
	const avgLinesPerPeriod = rows.length > 0 ? stats.totalLines / rows.length : 0;
	const avgPackagesPerPeriod = rows.length > 0 ? stats.totalPackages / rows.length : 0;
	const avgUnitsPerPeriod = rows.length > 0 ? stats.totalUnits / rows.length : 0;

	// Calculate growth metrics (comparing first half vs second half)
	const growthMetrics = useMemo(() => {
		if (rows.length < 4) return { ordersGrowth: 0, linesGrowth: 0, packagesGrowth: 0, unitsGrowth: 0 };
		
		const midPoint = Math.floor(rows.length / 2);
		const firstHalf = rows.slice(0, midPoint);
		const secondHalf = rows.slice(midPoint);
		
		const firstHalfOrders = firstHalf.reduce((sum, r) => sum + (r.orders || 0), 0);
		const secondHalfOrders = secondHalf.reduce((sum, r) => sum + (r.orders || 0), 0);
		const ordersGrowth = firstHalfOrders > 0 ? ((secondHalfOrders - firstHalfOrders) / firstHalfOrders) * 100 : 0;
		
		const firstHalfLines = firstHalf.reduce((sum, r) => sum + (r.lines || 0), 0);
		const secondHalfLines = secondHalf.reduce((sum, r) => sum + (r.lines || 0), 0);
		const linesGrowth = firstHalfLines > 0 ? ((secondHalfLines - firstHalfLines) / firstHalfLines) * 100 : 0;
		
		const firstHalfPackages = firstHalf.reduce((sum, r) => sum + (r.packages || 0), 0);
		const secondHalfPackages = secondHalf.reduce((sum, r) => sum + (r.packages || 0), 0);
		const packagesGrowth = firstHalfPackages > 0 ? ((secondHalfPackages - firstHalfPackages) / firstHalfPackages) * 100 : 0;
		
		const firstHalfUnits = firstHalf.reduce((sum, r) => sum + (r.units || 0), 0);
		const secondHalfUnits = secondHalf.reduce((sum, r) => sum + (r.units || 0), 0);
		const unitsGrowth = firstHalfUnits > 0 ? ((secondHalfUnits - firstHalfUnits) / firstHalfUnits) * 100 : 0;
		
		return { ordersGrowth, linesGrowth, packagesGrowth, unitsGrowth };
	}, [rows]);

	// ECharts component - dynamically imported for SSR compatibility
	const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

	// Use the new chart theme system
	const { echartsThemeName, currentTheme, currentLunoTheme } = useChartTheme();

	// Process data like legacy: Top 10 + "Others" aggregation
	const processedData = useMemo(() => {
		if (!rows?.length) return [];
		
		const dataKey = selectedDataset;
		
		// Sort by selected dataset value (descending)
		let sortedData = [...rows].sort((a, b) => {
			const aValue = a[dataKey] || 0;
			const bValue = b[dataKey] || 0;
			return bValue - aValue;
		});
		
		// Take top 10, aggregate the rest into "Others"
		if (sortedData.length > 10) {
			const top10 = sortedData.slice(0, 10);
			const others = sortedData.slice(10);
			
			// Aggregate "Others" data
			const othersData = others.reduce((acc, item) => ({
				id: 'Others',
				name: 'Others',
				orders: acc.orders + (item.orders || 0),
				lines: acc.lines + (item.lines || 0),
				packages: acc.packages + (item.packages || 0),
				units: acc.units + (item.units || 0),
				year_1: {
					orders: acc.year_1.orders + (item.year_1?.orders || 0),
					lines: acc.year_1.lines + (item.year_1?.lines || 0),
					packages: acc.year_1.packages + (item.year_1?.packages || 0),
					units: acc.year_1.units + (item.year_1?.units || 0)
				},
				year_2: {
					orders: acc.year_2.orders + (item.year_2?.orders || 0),
					lines: acc.year_2.lines + (item.year_2?.lines || 0),
					packages: acc.year_2.packages + (item.year_2?.packages || 0),
					units: acc.year_2.units + (item.year_2?.units || 0)
				}
			}), {
				id: 'Others',
				name: 'Others',
				orders: 0,
				lines: 0,
				packages: 0,
				units: 0,
				year_1: { orders: 0, lines: 0, packages: 0, units: 0 },
				year_2: { orders: 0, lines: 0, packages: 0, units: 0 }
			});
			
			return [...top10, othersData];
		}
		
		return sortedData;
	}, [rows, selectedDataset]);


	// Pie chart data (only current year, no comparison)
	const pieChartData = useMemo(() => {
		if (!processedData?.length) return [] as any[];
		
		const dataKey = selectedDataset;
		return processedData.map((r) => ({
			name: r.name,
			value: r[dataKey] || 0
		}));
	}, [processedData, selectedDataset]);

	// ECharts bar chart options (horizontal bars like legacy)
	const getBarChartOption = () => {
		const categories = processedData.map((r) => r.name || r.id || '').reverse();
		const series = [];
		const dataKey = selectedDataset;
		
		// Add comparison years if enabled
		if (compareYears) {
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-2 years)`,
				type: 'bar',
				data: processedData.map((r) => r.year_2?.[dataKey] ?? 0).reverse(),
				label: {
					show: true,
					position: 'right',
					fontSize: 11,
					fontWeight: 'bold',
					formatter: (params: any) => params.value.toLocaleString(),
				}
			});
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-1 year)`,
				type: 'bar',
				data: processedData.map((r) => r.year_1?.[dataKey] ?? 0).reverse(),
				label: {
					show: true,
					position: 'right',
					fontSize: 11,
					fontWeight: 'bold',
					formatter: (params: any) => params.value.toLocaleString(),
				}
			});
		}
		
		// Add current year data
		series.push({
			name: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1),
			type: 'bar',
			data: processedData.map((r) => r[dataKey] ?? 0).reverse(),
			label: {
				show: true,
				position: 'right',
				fontSize: 11,
				fontWeight: 'bold',
				formatter: (params: any) => params.value.toLocaleString(),
			}
		});

		return {
			...getAnimationSettings(),
			grid: {
				left: '15%',
				right: '15%',
				top: '10%',
				bottom: '10%',
				containLabel: true
			},
			xAxis: {
				type: 'value',
				axisLabel: {
					formatter: (value: number) => value.toLocaleString()
				}
			},
			yAxis: {
				type: 'category',
				data: categories,
				axisLabel: {
					fontSize: 11
				}
			},
			series: series,
			legend: {
				top: 0,
				left: 0
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				},
				formatter: (params: any) => {
					let result = `<strong>${params[0].name}</strong><br/>`;
					params.forEach((param: any) => {
						result += `${param.seriesName}: ${param.value.toLocaleString()}<br/>`;
					});
					return result;
				}
			}
		};
	};

	// ECharts pie chart options (donut chart like legacy)
	const getPieChartOption = () => {
		return {
			...getAnimationSettings(),
			tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
			legend: {
				bottom: 0,
				left: 'center',
				textStyle: {
					fontSize: 11
				}
			},
			series: [
				{
					name: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1),
					type: 'pie',
					radius: ['30%', '70%'],
					center: ['50%', '40%'],
					data: pieChartData,
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					},
					label: {
						show: true,
						formatter: '{d}%',
						fontSize: 10,
						fontWeight: 'bold',
					},
					labelLine: {
						show: true
					}
				}
			]
		};
	};

	if (!mounted) {
		return (
			<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color flex items-center justify-center'>
				<div className='text-font-color'>Loading...</div>
			</div>
		);
	}

	return (
		<div className='p-6'>
			{/* Page Header */}
			<div className='mb-6'>
				<div className='flex items-center justify-between'>
					<div>
						<h1 className='text-[24px] font-bold text-font-color mb-2'>Analytics - By Ship Service</h1>
						<p className='text-[14px] text-font-color-100'>A summary of shipment distributed by ship service.</p>
					</div>
					<div className='flex items-center gap-3'>
						<button
							onClick={onDownload}
							className='btn btn-light-secondary'
							title='Download Report'
						>
							<IconDownload className='w-4 h-4' />
						</button>
						<button
							onClick={runReport}
							disabled={loading}
							className='btn btn-primary'
						>
							<IconRefresh className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
							{loading ? 'Loading...' : 'Run Report'}
						</button>
					</div>
				</div>
			</div>

			{/* Combined Metrics Grid */}
			{loaded && rows.length > 0 && (
				<div className='mb-6'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						{/* Total Orders with Growth */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-4 border border-primary'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[20px]/[24px] font-bold text-white'>{stats.totalOrders.toLocaleString()}</div>
									<div className='text-[11px]/[14px] text-white/80'>Total Orders</div>
								</div>
								<div className='w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconShoppingCart className='w-[14px] h-[14px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[10px]/[12px] text-white/60'>
									{avgOrdersPerPeriod.toFixed(0)} avg/service
								</div>
								<div className='flex items-center gap-1'>
									{growthMetrics.ordersGrowth > 0 ? (
										<IconArrowUp className='w-[10px] h-[10px] text-white/80' />
									) : growthMetrics.ordersGrowth < 0 ? (
										<IconArrowDown className='w-[10px] h-[10px] text-white/80' />
									) : (
										<IconMinus className='w-[10px] h-[10px] text-white/80' />
									)}
									<span className='text-[10px]/[12px] text-white/80 font-medium'>
										{growthMetrics.ordersGrowth > 0 ? '+' : ''}{growthMetrics.ordersGrowth.toFixed(1)}%
									</span>
								</div>
							</div>
						</div>

						{/* Total Lines with Growth */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-4 border border-success'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[20px]/[24px] font-bold text-white'>{stats.totalLines.toLocaleString()}</div>
									<div className='text-[11px]/[14px] text-white/80'>Total Lines</div>
								</div>
								<div className='w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconList className='w-[14px] h-[14px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[10px]/[12px] text-white/60'>
									{avgLinesPerPeriod.toFixed(0)} avg/service
								</div>
								<div className='flex items-center gap-1'>
									{growthMetrics.linesGrowth > 0 ? (
										<IconArrowUp className='w-[10px] h-[10px] text-white/80' />
									) : growthMetrics.linesGrowth < 0 ? (
										<IconArrowDown className='w-[10px] h-[10px] text-white/80' />
									) : (
										<IconMinus className='w-[10px] h-[10px] text-white/80' />
									)}
									<span className='text-[10px]/[12px] text-white/80 font-medium'>
										{growthMetrics.linesGrowth > 0 ? '+' : ''}{growthMetrics.linesGrowth.toFixed(1)}%
									</span>
								</div>
							</div>
						</div>

						{/* Total Packages with Growth */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-4 border border-warning'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[20px]/[24px] font-bold text-white'>{stats.totalPackages.toLocaleString()}</div>
									<div className='text-[11px]/[14px] text-white/80'>Total Packages</div>
								</div>
								<div className='w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconPackage className='w-[14px] h-[14px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[10px]/[12px] text-white/60'>
									{avgPackagesPerPeriod.toFixed(0)} avg/service
								</div>
								<div className='flex items-center gap-1'>
									{growthMetrics.packagesGrowth > 0 ? (
										<IconArrowUp className='w-[10px] h-[10px] text-white/80' />
									) : growthMetrics.packagesGrowth < 0 ? (
										<IconArrowDown className='w-[10px] h-[10px] text-white/80' />
									) : (
										<IconMinus className='w-[10px] h-[10px] text-white/80' />
									)}
									<span className='text-[10px]/[12px] text-white/80 font-medium'>
										{growthMetrics.packagesGrowth > 0 ? '+' : ''}{growthMetrics.packagesGrowth.toFixed(1)}%
									</span>
								</div>
							</div>
						</div>

						{/* Total Units with Growth */}
						<div className='card bg-gradient-to-br from-info to-info-10 rounded-xl p-4 border border-info'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[20px]/[24px] font-bold text-white'>{stats.totalUnits.toLocaleString()}</div>
									<div className='text-[11px]/[14px] text-white/80'>Total Units</div>
								</div>
								<div className='w-[28px] h-[28px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBox className='w-[14px] h-[14px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[10px]/[12px] text-white/60'>
									{avgUnitsPerPeriod.toFixed(0)} avg/service
								</div>
								<div className='flex items-center gap-1'>
									{growthMetrics.unitsGrowth > 0 ? (
										<IconArrowUp className='w-[10px] h-[10px] text-white/80' />
									) : growthMetrics.unitsGrowth < 0 ? (
										<IconArrowDown className='w-[10px] h-[10px] text-white/80' />
									) : (
										<IconMinus className='w-[10px] h-[10px] text-white/80' />
									)}
									<span className='text-[10px]/[12px] text-white/80 font-medium'>
										{growthMetrics.unitsGrowth > 0 ? '+' : ''}{growthMetrics.unitsGrowth.toFixed(1)}%
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

		<AnalyticsFilterHeader
			viewMode={viewMode}
			onViewModeChange={setViewMode}
			hasActiveFilters={hasActiveFilters()}
			onClearAllFilters={clearAllFilters}
		>
			<div className='flex flex-wrap gap-4'>
				{/* SHIPPED DATE Filter */}
				<ShippedDateFilterCombobox
					value={filters.shippedDate}
					onValueChange={(value) => updateFilter('shippedDate', value)}
					className='flex-shrink-0 w-48'
				/>

				{/* WAREHOUSE Filter */}
				<WarehouseFilterCombobox
					value={filters.warehouse}
					onValueChange={(value) => updateFilter('warehouse', value)}
					className='flex-shrink-0 w-52'
				/>

				{/* ACCOUNT Filter */}
				<AccountFilterCombobox
					value={filters.account}
					onValueChange={(value) => updateFilter('account', value)}
					className='flex-shrink-0 w-52'
				/>

				{/* COUNTRY Filter */}
				<CountryFilterCombobox
					value={filters.country}
					onValueChange={(value) => {
						updateFilter('country', value);
						// Clear state when country is cleared or changed
						if (!value || value !== filters.country) {
							updateFilter('state', '');
						}
					}}
					className='flex-shrink-0 w-48'
				/>

				{/* STATE Filter - Only show when country is selected */}
				<StateFilterCombobox
					value={filters.state}
					onValueChange={(value) => updateFilter('state', value)}
					countryValue={filters.country}
					className='flex-shrink-0 w-36'
				/>
			</div>

			{/* Active Filters Summary */}
			{hasActiveFilters() && (
				<div className='mt-4 pt-4 border-t border-border-color'>
					<div className='flex items-center gap-2 flex-wrap'>
						<span className='text-[11px] font-bold text-font-color-100 uppercase tracking-wider'>Active Filters:</span>
						{filters.shippedDate !== '-90D' && (
							<span className='inline-flex items-center gap-1 px-2 py-1 bg-primary-10 text-primary rounded text-[10px] font-medium'>
								Date: {filters.shippedDate === '-90D' ? 'Last 90 Days' : filters.shippedDate}
								<button onClick={() => updateFilter('shippedDate', '-90D')} className='hover:bg-primary hover:text-white rounded-full p-0.5'>
									<IconX className='w-2 h-2' />
								</button>
							</span>
						)}
						{filters.warehouse.length > 0 && (
							<span className='inline-flex items-center gap-1 px-2 py-1 bg-warning-10 text-warning rounded text-[10px] font-medium'>
								Warehouses: {filters.warehouse.length} selected
								<button onClick={() => updateFilter('warehouse', [])} className='hover:bg-warning hover:text-white rounded-full p-0.5'>
									<IconX className='w-2 h-2' />
								</button>
							</span>
						)}
						{filters.account.length > 0 && (
							<span className='inline-flex items-center gap-1 px-2 py-1 bg-info-10 text-info rounded text-[10px] font-medium'>
								Accounts: {filters.account.length} selected
								<button onClick={() => updateFilter('account', [])} className='hover:bg-info hover:text-white rounded-full p-0.5'>
									<IconX className='w-2 h-2' />
								</button>
							</span>
						)}
						{filters.country && (
							<span className='inline-flex items-center gap-1 px-2 py-1 bg-success-10 text-success rounded text-[10px] font-medium'>
								Country: {filters.country}
								<button onClick={() => updateFilter('country', '')} className='hover:bg-success hover:text-white rounded-full p-0.5'>
									<IconX className='w-2 h-2' />
								</button>
							</span>
						)}
						{filters.state && (
							<span className='inline-flex items-center gap-1 px-2 py-1 bg-danger-10 text-danger rounded text-[10px] font-medium'>
								State: {filters.state}
								<button onClick={() => updateFilter('state', '')} className='hover:bg-danger hover:text-white rounded-full p-0.5'>
									<IconX className='w-2 h-2' />
								</button>
							</span>
						)}
					</div>
				</div>
			)}
		</AnalyticsFilterHeader>

			{/* Content Section */}
			<div className='bg-card-color border border-border-color rounded-xl overflow-hidden'>
				{error && (
					<div className='p-4 bg-danger-10 border-b border-border-color'>
						<div className='text-danger text-[14px] mb-1'>⚠️ Error Loading Data</div>
						<div className='text-[12px] text-font-color-100'>{error}</div>
					</div>
				)}

				{loading && (
					<LoadingState 
						message="Loading analytics data..." 
						submessage="Analyzing ship service performance"
						type="loading"
					/>
				)}

				{!loading && !error && loaded && rows.length > 0 && (
					<>
						{viewMode === 'chart' && (
							<div className='p-6'>
								{/* Chart Section */}
								<div className='mb-6'>
									<div className='flex items-center justify-between mb-4'>
										<div>
											<span className='text-[12px] text-font-color-100'>Total:</span>
											<span className='text-[16px] font-bold text-font-color ml-2'>
												{selectedDataset === 'orders' && stats.totalOrders.toLocaleString()}
												{selectedDataset === 'lines' && stats.totalLines.toLocaleString()}
												{selectedDataset === 'packages' && stats.totalPackages.toLocaleString()}
												{selectedDataset === 'units' && stats.totalUnits.toLocaleString()}
											</span>
										</div>
									</div>

									{/* Charts Grid */}
									<div className='grid grid-cols-12 gap-4 mb-6'>
										{/* Bar Chart */}
										<div className='col-span-7'>
											{processedData.length > 0 ? (
												<ReactECharts 
													option={getBarChartOption()} 
													theme={echartsThemeName}
													key={`bar-${selectedDataset}-${compareYears}-${echartsThemeName}`}
													style={{ width: '100%', height: '450px' }}
													opts={{ renderer: 'canvas' }}
												/>
											) : (
												<div className='flex items-center justify-center h-[450px] bg-gray-50 rounded-lg'>
													<div className='text-gray-500'>No data available for chart</div>
												</div>
											)}
										</div>

										{/* Pie Chart */}
										<div className='col-span-5'>
											{pieChartData.length > 0 ? (
												<ReactECharts 
													option={getPieChartOption()} 
													theme={echartsThemeName}
													key={`pie-${selectedDataset}-${echartsThemeName}`}
													style={{ width: '100%', height: '450px' }}
													opts={{ renderer: 'canvas' }}
												/>
											) : (
												<div className='flex items-center justify-center h-[450px] bg-gray-50 rounded-lg'>
													<div className='text-gray-500'>No data available for pie chart</div>
												</div>
											)}
										</div>
									</div>

									<ChartControls
										selectedDataset={selectedDataset}
										onDatasetChange={handleDatasetChange}
										compareYears={compareYears}
										onCompareYearsChange={setCompareYears}
										activeFilters={
											<>
												<div>Date: {filters.shippedDate === '-90D' ? 'Last 90 Days' : filters.shippedDate}</div>
												{filters.warehouse.length > 0 && <div>Warehouses: {filters.warehouse.length} selected</div>}
												{filters.account.length > 0 && <div>Accounts: {filters.account.length} selected</div>}
												{filters.country && <div>Country: {filters.country}</div>}
												{filters.state && <div>State: {filters.state}</div>}
											</>
										}
									/>
								</div>
							</div>
						)}

						{/* Data Grid Section - Always Show (Like Legacy) */}
						{viewMode === 'table' && (
							<div className='p-6'>
								<div className='mb-4'>
									<div className='flex items-center justify-between'>
										<h3 className='text-[16px] font-bold text-font-color'>Ship Service Data</h3>
										<div className='flex items-center gap-4'>
											<div className="form-check">
												<input
													type="checkbox"
													id="compareYearsTable"
													checked={compareYears}
													onChange={(e) => setCompareYears(e.target.checked)}
													className="form-check-input"
												/>
												<label className="form-check-label text-xs text-font-color-100" htmlFor="compareYearsTable">
													Compare to previous 2 years
												</label>
											</div>
											<div className='text-[12px] text-font-color-100'>
												{processedData.length} services • Total: {
													selectedDataset === 'orders' && stats.totalOrders.toLocaleString()
													|| selectedDataset === 'lines' && stats.totalLines.toLocaleString()
													|| selectedDataset === 'packages' && stats.totalPackages.toLocaleString()
													|| selectedDataset === 'units' && stats.totalUnits.toLocaleString()
												}
											</div>
										</div>
									</div>
								</div>

								<div className='overflow-x-auto'>
									<table className='w-full'>
										<thead className='bg-primary-5'>
											{/* Single Header Row */}
											<tr>
												<th className='py-3 px-4 text-left text-[11px] font-bold text-font-color uppercase tracking-wider border-r border-border-color'>
													Ship Service
												</th>

												{/* Orders Section */}
												{compareYears && (
													<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Orders (-2)</div>
													</th>
												)}
												{compareYears && (
													<th className={`py-3 px-2 text-right ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Orders (-1)</div>
													</th>
												)}
												<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
													<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Orders</div>
												</th>

												{/* Lines Section */}
												{compareYears && (
													<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Lines (-2)</div>
													</th>
												)}
												{compareYears && (
													<th className={`py-3 px-2 text-right ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Lines (-1)</div>
													</th>
												)}
												<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
													<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Lines</div>
												</th>

												{/* Packages Section */}
												{compareYears && (
													<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Packages (-2)</div>
													</th>
												)}
												{compareYears && (
													<th className={`py-3 px-2 text-right ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Packages (-1)</div>
													</th>
												)}
												<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
													<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Packages</div>
												</th>

												{/* Units Section */}
												{compareYears && (
													<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Units (-2)</div>
													</th>
												)}
												{compareYears && (
													<th className={`py-3 px-2 text-right ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
														<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Units (-1)</div>
													</th>
												)}
												<th className={`py-3 px-2 text-right border-l border-border-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
													<div className='text-[10px] font-bold text-font-color uppercase tracking-wider'>Units</div>
												</th>
									</tr>
								</thead>
								<tbody>
											{processedData.map((row, index) => (
												<tr key={row.id || index} className='border-b border-border-color hover:bg-primary-5'>
													<td className='py-2 px-4 text-[12px] font-medium text-font-color border-r border-border-color'>
														<span style={{color: '#0EA5E9'}}>{row.name}</span>
													</td>

													{/* Orders */}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
															{(row.year_2?.orders || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color">
															{(row.year_1?.orders || 0).toLocaleString()}
														</td>
													)}
													<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
														{(row.orders || 0).toLocaleString()}
													</td>

													{/* Lines */}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
															{(row.year_2?.lines || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color">
															{(row.year_1?.lines || 0).toLocaleString()}
														</td>
													)}
													<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
														{(row.lines || 0).toLocaleString()}
													</td>

													{/* Packages */}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
															{(row.year_2?.packages || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color">
															{(row.year_1?.packages || 0).toLocaleString()}
														</td>
													)}
													<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
														{(row.packages || 0).toLocaleString()}
													</td>

													{/* Units */}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
															{(row.year_2?.units || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className="py-2 px-2 text-right text-[11px] text-font-color">
															{(row.year_1?.units || 0).toLocaleString()}
														</td>
													)}
													<td className="py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color">
														{(row.units || 0).toLocaleString()}
													</td>
										</tr>
									))}
								</tbody>
										<tfoot className='bg-primary-5 border-t-2 border-border-color'>
											<tr>
												<td className='py-3 px-4 text-[12px] font-bold text-font-color border-r border-border-color'>
													TOTAL
												</td>

												{/* Orders Totals */}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.orders || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.orders || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.orders || 0), 0).toLocaleString()}
													</span>
												</td>

												{/* Lines Totals */}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.lines || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.lines || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.lines || 0), 0).toLocaleString()}
													</span>
												</td>

												{/* Packages Totals */}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.packages || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.packages || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.packages || 0), 0).toLocaleString()}
													</span>
												</td>

												{/* Units Totals */}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.units || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className="py-3 px-2 text-right text-[11px] font-bold">
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.units || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className="py-3 px-2 text-right text-[11px] font-bold border-l border-border-color">
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.units || 0), 0).toLocaleString()}
													</span>
												</td>
											</tr>
										</tfoot>
							</table>
						</div>
							</div>
						)}
					</>
				)}

				{loaded && rows.length === 0 && (
					<div className='p-8 text-center'>
						<div className='text-[14px] text-font-color-100'>No data found for the selected filters.</div>
				</div>
				)}
			</div>
		</div>
	);
}
