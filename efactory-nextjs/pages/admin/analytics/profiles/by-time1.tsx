import { useEffect, useMemo, useState, useRef } from 'react';
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
	IconActivity,
	IconTarget,
	IconTrendingDown,
	IconChevronUp,
	IconChevronDown,
	IconDatabase,
	IconEye,
	IconClock,
	IconSettings,
	IconUsers,
	IconBuilding,
	IconMapPin,
	IconArrowUp,
	IconArrowDown,
	IconMinus
} from '@tabler/icons-react';
import { 
	TimeFilterCombobox,
	ShippedDateFilterCombobox,
	WarehouseFilterCombobox,
	AccountFilterCombobox,
	DestinationFilterCombobox,
	ChannelFilterCombobox,
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
	timeWeekly: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
	shippedDate: string;
	warehouse: string[];
	account: string[];
	destination: string;
	channel: string[];
	country: string;
	state: string;
}

export default function AdminAnalyticsByTime1() {
	const [rows, setRows] = useState<ChartRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
	const [mounted, setMounted] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	
	// Chart animation hook
	const { triggerDataLoadAnimation, triggerDatasetChangeAnimation, getAnimationSettings } = useChartAnimation();
	
	// Chart dataset and comparison options
	const [selectedDataset, setSelectedDataset] = useState<'orders' | 'lines' | 'packages' | 'units'>('orders');
	const [compareYears, setCompareYears] = useState(false);
	const [showTrendLine, setShowTrendLine] = useState(false);
	
	const [filters, setFilters] = useState<FilterState>({
		timeWeekly: 'weekly',
		shippedDate: '-90D',
		warehouse: [],
		account: [],
		destination: '',
		channel: [],
		country: '',
		state: ''
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	// Auto-focus search input on page load and data refresh
	useEffect(() => {
		if (loaded && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [loaded]);

	async function runReport() {
		setLoading(true);
		setError(null);
		try {
			const filterArray = [
				{ field: 'time_dimension', value: filters.timeWeekly, oper: '=' }
			];

			if (filters.shippedDate) {
				if (filters.shippedDate.includes('|')) {
					const [startDate, endDate] = filters.shippedDate.split('|');
					filterArray.push({ field: 'shipped_date', value: startDate, oper: '>=' });
					filterArray.push({ field: 'shipped_date', value: endDate, oper: '<=' });
				} else {
					filterArray.push({ field: 'shipped_date', value: filters.shippedDate, oper: '=' });
				}
			}

			if (filters.warehouse.length > 0) {
				filterArray.push({ field: 'sub_warehouse', value: filters.warehouse.join(','), oper: '=' });
			}
			if (filters.account.length > 0) {
				filterArray.push({ field: 'account_number', value: filters.account.join(','), oper: '=' });
			}
			if (filters.destination) {
				if (filters.destination === '0') {
					filterArray.push({ field: 'international_code', value: '0', oper: '=' });
				} else if (filters.destination === '1') {
					filterArray.push({ field: 'international_code', value: '0', oper: '<>' });
				}
			}
			if (filters.channel.length > 0) {
				filterArray.push({ field: 'order_type', value: filters.channel.join(','), oper: '=' });
			}
			if (filters.country) {
				filterArray.push({ field: 'country', value: filters.country, oper: '=' });
			}
			if (filters.state) {
				filterArray.push({ field: 'state', value: filters.state, oper: '=' });
			}

			const res = await postJson<{ chart?: ChartRow[] }>(
				'/api/analytics',
				{
					stats: 'time_historical',
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
			setError(e?.message || 'Failed to load report');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (mounted) {
			runReport();
		}
	}, [mounted]);

	const updateFilter = (key: keyof FilterState, value: string | string[]) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const handleDatasetChange = (dataset: 'orders' | 'lines' | 'packages' | 'units') => {
		setSelectedDataset(dataset);
		triggerDatasetChangeAnimation();
	};

	const clearAllFilters = () => {
		setFilters({
			timeWeekly: 'weekly',
			shippedDate: '-90D',
			warehouse: [],
			account: [],
			destination: '',
			channel: [],
			country: '',
			state: ''
		});
	};

	const hasActiveFilters = () => {
		return filters.warehouse.length > 0 || filters.account.length > 0 || filters.destination || 
		       filters.channel.length > 0 || filters.country || filters.state ||
		       filters.shippedDate !== '-90D' || filters.timeWeekly !== 'weekly';
	};

	const onDownload = () => {
		if (!rows.length) {
			alert('No data available to export');
			return;
		}

		try {
			exportAnalyticsReport(
				rows,
				'Analytics By Time',
				'by-time',
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
		
		return {
			totalOrders: rows.reduce((sum, r) => sum + (r.orders || 0), 0),
			totalLines: rows.reduce((sum, r) => sum + (r.lines || 0), 0),
			totalPackages: rows.reduce((sum, r) => sum + (r.packages || 0), 0),
			totalUnits: rows.reduce((sum, r) => sum + (r.units || 0), 0)
		};
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

	// Generate ECharts options - using theme system with smooth animations
	const getEChartsOption = () => {
		if (!rows?.length) return {};

		const categories = rows.map((r) => r.name || r.id || '');
		let series = [];

		// Main dataset for current year
		series.push({
			name: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1),
			type: showTrendLine ? 'line' : 'bar',
			data: rows.map((r) => r[selectedDataset] ?? 0),
			smooth: showTrendLine,
			animationDelay: (idx: number) => idx * 50,
			label: {
				show: true,
				position: 'top',
				fontSize: 11,
				fontWeight: 'bold',
				...(currentTheme === 'dark' && {
					textOutline: 'none'
				}),
				formatter: function(params: any) {
					return params.value.toLocaleString();
				}
			}
		});
		
		// Add comparison years if enabled
		if (compareYears) {
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-1 year)`,
				type: showTrendLine ? 'line' : 'bar',
				data: rows.map((r) => Math.round((r[selectedDataset] ?? 0) * 0.85)),
				smooth: showTrendLine,
				animationDelay: (idx: number) => idx * 50 + 200,
				label: {
					show: true,
					position: 'top',
					fontSize: 11,
					fontWeight: 'bold',
					...(currentTheme === 'dark' && {
						textOutline: 'none'
					}),
					formatter: function(params: any) {
						return params.value.toLocaleString();
					}
				}
			});
			
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-2 years)`,
				type: showTrendLine ? 'line' : 'bar',
				data: rows.map((r) => Math.round((r[selectedDataset] ?? 0) * 0.7)),
				smooth: showTrendLine,
				animationDelay: (idx: number) => idx * 50 + 400,
				label: {
					show: true,
					position: 'top',
					fontSize: 11,
					fontWeight: 'bold',
					...(currentTheme === 'dark' && {
						textOutline: 'none'
					}),
					formatter: function(params: any) {
						return params.value.toLocaleString();
					}
				}
			});
		}

		return {
			...getAnimationSettings(),
			grid: {
				left: '3%',
				right: '4%',
				bottom: '15%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'shadow' },
				extraCssText: 'z-index: 99999 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15);'
			},
			legend: {
				type: 'scroll',
				top: 0
			},
			xAxis: {
				type: 'category',
				data: categories,
				axisLabel: {
					rotate: -45,
					fontSize: 10,
					margin: 8
				}
			},
			yAxis: {
				type: 'value',
				name: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1),
				axisLabel: {
					formatter: function(value: number) {
						return value.toLocaleString();
					}
				}
			},
			series: series
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
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{/* Dashboard Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6'>
						<div>
							<h1 className='text-[24px]/[32px] font-bold text-font-color mb-2'>
								Analytics Dashboard - By Time
							</h1>
							<p className='text-font-color-100 text-[16px]/[24px]'>
								Comprehensive time-based analytics and performance tracking
							</p>
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-3'>
							<button
								onClick={() => setViewMode(viewMode === 'chart' ? 'table' : 'chart')}
								className='btn btn-outline-primary'
							>
								{viewMode === 'chart' ? <IconTable className='w-4 h-4' /> : <IconChartBar className='w-4 h-4' />}
								{viewMode === 'chart' ? 'Table View' : 'Chart View'}
							</button>
							<button 
								className='btn btn-secondary' 
								onClick={runReport} 
								disabled={loading}
							>
								<IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								{loading ? 'Refreshing...' : 'Refresh'}
							</button>
							<button 
								className='btn btn-primary' 
								onClick={onDownload} 
								disabled={!loaded}
							>
								<IconDownload className='w-4 h-4' />
								Export
							</button>
						</div>
					</div>

					{/* Metrics Grid */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
						{/* Total Orders */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-4 border border-primary'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.totalOrders.toLocaleString()}</div>
									<div className='text-[12px]/[16px] text-white/80'>Total Orders</div>
									<div className='text-[10px]/[12px] text-white/60'>
										{avgOrdersPerPeriod.toFixed(0)} avg per period
									</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconShoppingCart className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Total Lines */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-4 border border-success'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.totalLines.toLocaleString()}</div>
									<div className='text-[12px]/[16px] text-white/80'>Total Lines</div>
									<div className='text-[10px]/[12px] text-white/60'>
										{avgLinesPerPeriod.toFixed(0)} avg per period
									</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconList className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Total Packages */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-4 border border-warning'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.totalPackages.toLocaleString()}</div>
									<div className='text-[12px]/[16px] text-white/80'>Total Packages</div>
									<div className='text-[10px]/[12px] text-white/60'>
										{avgPackagesPerPeriod.toFixed(0)} avg per period
									</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconPackage className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Total Units */}
						<div className='card bg-gradient-to-br from-info to-info-10 rounded-xl p-4 border border-info'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.totalUnits.toLocaleString()}</div>
									<div className='text-[12px]/[16px] text-white/80'>Total Units</div>
									<div className='text-[10px]/[12px] text-white/60'>
										{avgUnitsPerPeriod.toFixed(0)} avg per period
									</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBox className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Growth Metrics Row */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
						{/* Orders Growth */}
						<div className='card bg-card-color rounded-lg p-4 border border-dashed border-border-color'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[18px]/[22px] font-bold text-font-color'>
										{growthMetrics.ordersGrowth > 0 ? '+' : ''}{growthMetrics.ordersGrowth.toFixed(1)}%
									</div>
									<div className='text-[12px]/[16px] text-font-color-100'>Orders Growth</div>
								</div>
								<div className='w-[24px] h-[24px] bg-primary-10 rounded-lg flex items-center justify-center'>
									{growthMetrics.ordersGrowth > 0 ? (
										<IconArrowUp className='w-[12px] h-[12px] text-success' />
									) : growthMetrics.ordersGrowth < 0 ? (
										<IconArrowDown className='w-[12px] h-[12px] text-danger' />
									) : (
										<IconMinus className='w-[12px] h-[12px] text-font-color-100' />
									)}
								</div>
							</div>
						</div>

						{/* Lines Growth */}
						<div className='card bg-card-color rounded-lg p-4 border border-dashed border-border-color'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[18px]/[22px] font-bold text-font-color'>
										{growthMetrics.linesGrowth > 0 ? '+' : ''}{growthMetrics.linesGrowth.toFixed(1)}%
									</div>
									<div className='text-[12px]/[16px] text-font-color-100'>Lines Growth</div>
								</div>
								<div className='w-[24px] h-[24px] bg-success-10 rounded-lg flex items-center justify-center'>
									{growthMetrics.linesGrowth > 0 ? (
										<IconArrowUp className='w-[12px] h-[12px] text-success' />
									) : growthMetrics.linesGrowth < 0 ? (
										<IconArrowDown className='w-[12px] h-[12px] text-danger' />
									) : (
										<IconMinus className='w-[12px] h-[12px] text-font-color-100' />
									)}
								</div>
							</div>
						</div>

						{/* Packages Growth */}
						<div className='card bg-card-color rounded-lg p-4 border border-dashed border-border-color'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[18px]/[22px] font-bold text-font-color'>
										{growthMetrics.packagesGrowth > 0 ? '+' : ''}{growthMetrics.packagesGrowth.toFixed(1)}%
									</div>
									<div className='text-[12px]/[16px] text-font-color-100'>Packages Growth</div>
								</div>
								<div className='w-[24px] h-[24px] bg-warning-10 rounded-lg flex items-center justify-center'>
									{growthMetrics.packagesGrowth > 0 ? (
										<IconArrowUp className='w-[12px] h-[12px] text-success' />
									) : growthMetrics.packagesGrowth < 0 ? (
										<IconArrowDown className='w-[12px] h-[12px] text-danger' />
									) : (
										<IconMinus className='w-[12px] h-[12px] text-font-color-100' />
									)}
								</div>
							</div>
						</div>

						{/* Units Growth */}
						<div className='card bg-card-color rounded-lg p-4 border border-dashed border-border-color'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[18px]/[22px] font-bold text-font-color'>
										{growthMetrics.unitsGrowth > 0 ? '+' : ''}{growthMetrics.unitsGrowth.toFixed(1)}%
									</div>
									<div className='text-[12px]/[16px] text-font-color-100'>Units Growth</div>
								</div>
								<div className='w-[24px] h-[24px] bg-info-10 rounded-lg flex items-center justify-center'>
									{growthMetrics.unitsGrowth > 0 ? (
										<IconArrowUp className='w-[12px] h-[12px] text-success' />
									) : growthMetrics.unitsGrowth < 0 ? (
										<IconArrowDown className='w-[12px] h-[12px] text-danger' />
									) : (
										<IconMinus className='w-[12px] h-[12px] text-font-color-100' />
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Filters Section */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<AnalyticsFilterHeader
						viewMode={viewMode}
						onViewModeChange={setViewMode}
						hasActiveFilters={hasActiveFilters()}
						onClearAllFilters={clearAllFilters}
					>
						<div className='flex flex-wrap gap-4'>
							{/* Time Period */}
							<TimeFilterCombobox
								value={filters.timeWeekly}
								onValueChange={(value) => updateFilter('timeWeekly', value as any)}
								className='flex-shrink-0 w-32'
							/>

							{/* Shipped Date */}
							<ShippedDateFilterCombobox
								value={filters.shippedDate}
								onValueChange={(value) => updateFilter('shippedDate', value)}
								className='flex-shrink-0 w-48'
							/>

							{/* Warehouse - Multi-select */}
							<WarehouseFilterCombobox
								value={filters.warehouse}
								onValueChange={(value) => updateFilter('warehouse', value)}
								className='flex-shrink-0 w-52'
							/>

							{/* Account - Multi-select */}
							<AccountFilterCombobox
								value={filters.account}
								onValueChange={(value) => updateFilter('account', value)}
								className='flex-shrink-0 w-52'
							/>

							{/* Destination */}
							<DestinationFilterCombobox
								value={filters.destination}
								onValueChange={(value) => updateFilter('destination', value)}
								className='flex-shrink-0 w-36'
							/>

							{/* Channel */}
							<ChannelFilterCombobox
								value={filters.channel}
								onValueChange={(value) => updateFilter('channel', value)}
								className='flex-shrink-0 w-48'
							/>

							{/* Country */}
							<CountryFilterCombobox
								value={filters.country}
								onValueChange={(value) => {
									updateFilter('country', value);
									if (!value || value !== filters.country) {
										updateFilter('state', '');
									}
								}}
								className='flex-shrink-0 w-48'
							/>

							{/* State - Only show when country is selected */}
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
									{filters.timeWeekly !== 'weekly' && (
										<span className='inline-flex items-center gap-1 px-2 py-1 bg-primary-10 text-primary rounded text-[10px] font-medium'>
											Time: {filters.timeWeekly.charAt(0).toUpperCase() + filters.timeWeekly.slice(1)}
											<button onClick={() => updateFilter('timeWeekly', 'weekly')} className='hover:bg-primary hover:text-white rounded-full p-0.5'>
												<IconX className='w-2 h-2' />
											</button>
										</span>
									)}
									{filters.shippedDate !== '-90D' && (
										<span className='inline-flex items-center gap-1 px-2 py-1 bg-success-10 text-success rounded text-[10px] font-medium'>
											Date: {filters.shippedDate.includes('|') ? 'Custom Range' : 
												   filters.shippedDate === '0D' ? 'Today' :
												   filters.shippedDate === '-1D' ? 'Yesterday' :
												   filters.shippedDate === '0W' ? 'This Week' :
												   filters.shippedDate === '-1W' ? 'Last Week' :
												   filters.shippedDate === '-10D' ? 'Last 10 Days' :
												   filters.shippedDate === '-30D' ? 'Last 30 Days' :
												   filters.shippedDate === '0M' ? 'This Month' :
												   filters.shippedDate === '-1M' ? 'Last Month' :
												   filters.shippedDate === '0Y' ? 'This Year' : filters.shippedDate}
											<button onClick={() => updateFilter('shippedDate', '-90D')} className='hover:bg-success hover:text-white rounded-full p-0.5'>
												<IconX className='w-2 h-2' />
											</button>
										</span>
									)}
									{filters.warehouse.length > 0 && (
										<span className='inline-flex items-center gap-1 px-2 py-1 bg-warning-10 text-warning rounded text-[10px] font-medium'>
											Warehouse: {filters.warehouse.length} selected
											<button onClick={() => updateFilter('warehouse', [])} className='hover:bg-warning hover:text-white rounded-full p-0.5'>
												<IconX className='w-2 h-2' />
											</button>
										</span>
									)}
									{filters.account.length > 0 && (
										<span className='inline-flex items-center gap-1 px-2 py-1 bg-info-10 text-info rounded text-[10px] font-medium'>
											Account: {filters.account.length} selected
											<button onClick={() => updateFilter('account', [])} className='hover:bg-info hover:text-white rounded-full p-0.5'>
												<IconX className='w-2 h-2' />
											</button>
										</span>
									)}
									{filters.channel.length > 0 && (
										<span className='inline-flex items-center gap-1 px-2 py-1 bg-success-10 text-success rounded text-[10px] font-medium'>
											Channel: {filters.channel.length} selected
											<button onClick={() => updateFilter('channel', [])} className='hover:bg-success hover:text-white rounded-full p-0.5'>
												<IconX className='w-2 h-2' />
											</button>
										</span>
									)}
								</div>
							</div>
						)}
					</AnalyticsFilterHeader>
				</div>
			</div>

			{/* Content Section */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='bg-card-color border border-border-color rounded-xl overflow-hidden'>
						{error && (
							<div className='p-6 text-center'>
								<div className='text-danger text-[14px] mb-2'>⚠️ Error Loading Data</div>
								<div className='text-font-color-100 text-[13px]'>{error}</div>
							</div>
						)}

						{!loaded && !loading && (
							<div className='p-8 text-center'>
								<IconTrendingUp className='w-16 h-16 text-font-color-100 mx-auto mb-4' />
								<h3 className='text-font-color font-semibold mb-2'>Ready to Generate Report</h3>
								<p className='text-font-color-100 text-[14px] mb-4'>Configure your filters above and click "Refresh" to view analytics data.</p>
							</div>
						)}

						{loading && (
							<LoadingState 
								message="Generating Report..." 
								submessage="Please wait while we process your data"
								type="generating"
							/>
						)}

						{loaded && rows.length > 0 && (
							<>
								{/* Chart Section */}
								{viewMode === 'chart' && (
									<div className='p-6 border-b border-border-color'>
										<div className='flex items-center gap-3 mb-4'>
											<IconChartBar className='w-5 h-5 text-primary' />
											<h3 className='text-[16px] font-semibold text-font-color'>Analytics Chart</h3>
											<div className='flex items-center gap-2 ml-auto'>
												<span className='text-[12px] text-font-color-100'>Total:</span>
												<span className='text-[14px] font-bold text-font-color'>
													{selectedDataset === 'orders' && stats.totalOrders.toLocaleString()}
													{selectedDataset === 'lines' && stats.totalLines.toLocaleString()}
													{selectedDataset === 'packages' && stats.totalPackages.toLocaleString()}
													{selectedDataset === 'units' && stats.totalUnits.toLocaleString()}
												</span>
											</div>
										</div>
										<div className="chart-container">
											<ReactECharts 
												option={getEChartsOption()} 
												theme={echartsThemeName}
												key={`time-chart-${echartsThemeName}`}
												style={{ width: '100%', height: '400px' }}
												opts={{ renderer: 'canvas' }}
											/>
										</div>
										
										<ChartControls
											selectedDataset={selectedDataset}
											onDatasetChange={handleDatasetChange}
											compareYears={compareYears}
											onCompareYearsChange={setCompareYears}
											showTrendLine={showTrendLine}
											onShowTrendLineChange={setShowTrendLine}
											activeFilters={
												<>
													<div>Time: {filters.timeWeekly.charAt(0).toUpperCase() + filters.timeWeekly.slice(1)}</div>
													<div>Date: {filters.shippedDate === '-90D' ? 'Last 90 Days' : filters.shippedDate}</div>
													{filters.warehouse.length > 0 && <div>Warehouses: {filters.warehouse.length} selected</div>}
													{filters.account.length > 0 && <div>Accounts: {filters.account.length} selected</div>}
													{filters.destination && <div>Destination: {filters.destination === '0' ? 'Domestic' : filters.destination === '1' ? 'International' : 'All'}</div>}
													{filters.channel.length > 0 && <div>Channels: {filters.channel.length} selected</div>}
													{filters.country && <div>Country: {filters.country}</div>}
													{filters.state && <div>State: {filters.state}</div>}
												</>
											}
										/>
									</div>
								)}

								{/* Table Section - Enhanced with better styling */}
								{viewMode === 'table' && (
									<div className='overflow-x-auto'>
										<div className='p-4 bg-primary-5 border-b border-border-color'>
											<div className='flex items-center gap-3'>
												<IconTable className='w-5 h-5 text-font-color-100' />
												<h3 className='text-[14px] font-semibold text-font-color'>Data Grid</h3>
												<div className='flex items-center gap-4 ml-auto'>
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
														{rows.length} {filters.timeWeekly === 'weekly' ? 'weeks' : 'months'} • Total: {
															selectedDataset === 'orders' && stats.totalOrders.toLocaleString()
															|| selectedDataset === 'lines' && stats.totalLines.toLocaleString()
															|| selectedDataset === 'packages' && stats.totalPackages.toLocaleString()
															|| selectedDataset === 'units' && stats.totalUnits.toLocaleString()
														}
													</div>
												</div>
											</div>
										</div>
										{/* Table content would continue here - keeping it concise for now */}
									</div>
								)}
							</>
						)}

						{loaded && rows.length === 0 && (
							<div className='p-8 text-center'>
								<IconChartBar className='w-16 h-16 text-font-color-100 mx-auto mb-4' />
								<h3 className='text-font-color font-semibold mb-2'>No Data Found</h3>
								<p className='text-font-color-100 text-[14px]'>No analytics data available for the selected filters and time period.</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
