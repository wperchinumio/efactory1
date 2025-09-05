import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { exportAnalyticsReport } from '@/lib/exportUtils';
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
	IconChevronUp,
	IconChevronDown,
	IconSelector
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
import { AnalyticsFilterHeader } from '@/components/analytics';

interface ChartRow {
	id?: string;
	name?: string;
	company_name?: string;
	company_code?: string;
	orders?: number;
	lines?: number;
	packages?: number;
	units?: number;
	timeData?: any[]; // Time series data for table display
	year_1?: Record<string, number>;
	year_2?: Record<string, number>;
}

interface FilterState {
	timeWeekly: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
	shippedDate: string;
	warehouse: string[];  // Multi-select array
	account: string[];    // Multi-select array  
	destination: string;
	channel: string[];    // Multi-select array for channels
	country: string;
	state: string;
}

export default function AdminAnalyticsByAccount() {
	const [rows, setRows] = useState<ChartRow[]>([]);
	const [timeHeaders, setTimeHeaders] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
	const [mounted, setMounted] = useState(false);
	const [sortField, setSortField] = useState<'name' | 'company_code' | 'company_name' | null>(null);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	
	// Chart dataset and comparison options
	const [selectedDataset, setSelectedDataset] = useState<'orders' | 'lines' | 'packages' | 'units'>('orders');
	const [compareYears, setCompareYears] = useState(false);
	const [showTrendLine, setShowTrendLine] = useState(false);
	
	const [filters, setFilters] = useState<FilterState>({
		timeWeekly: 'weekly',
		shippedDate: '-90D', // Default to Last 90 Days
		warehouse: [],
		account: [],
		destination: '',
		channel: [],
		country: '',
		state: ''
	});

	// Filter options are now handled by individual filter components

	useEffect(() => {
		setMounted(true);
	}, []);

	async function runReport() {
		setLoading(true);
		setError(null);
		try {
			// Build filter array based on current filter state
			const filterArray = [
				{ field: 'time_dimension', value: filters.timeWeekly, oper: '=' }
			];

			// Add shipped date filter (using legacy format)
			if (filters.shippedDate) {
				if (filters.shippedDate.includes('|')) {
					// Custom date range: "2024-01-01|2024-01-31"
					const [startDate, endDate] = filters.shippedDate.split('|');
					filterArray.push({ field: 'shipped_date', value: startDate, oper: '>=' });
					filterArray.push({ field: 'shipped_date', value: endDate, oper: '<=' });
				} else {
					// Predefined range: "-90D", "0D", etc.
					filterArray.push({ field: 'shipped_date', value: filters.shippedDate, oper: '=' });
				}
			}

			// Add other filters if they have values
			if (filters.warehouse.length > 0) {
				filterArray.push({ field: 'sub_warehouse', value: filters.warehouse.join(','), oper: '=' });
			}
			if (filters.account.length > 0) {
				filterArray.push({ field: 'account_number', value: filters.account.join(','), oper: '=' });
			}
			if (filters.destination) {
				// Legacy uses international_code field with specific operators
				if (filters.destination === '0') {
					// Domestic: international_code = 0
					filterArray.push({ field: 'international_code', value: '0', oper: '=' });
				} else if (filters.destination === '1') {
					// International: international_code <> 0 (not equals 0)
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
					stats: 'time_historical_account',
					global_analytics: true,
					filter: {
						and: filterArray,
					},
				},
			);
			
			// console.log('API Response:', res);
			// console.log('Grid data:', res.data?.grid);
			
			// Store the raw grid data and time headers
			const gridData = res.data?.grid || [];
			const timeHeaders = res.data?.grid_variable_header || [];
			
			// For chart: transform to summary format (sum all time periods)
			const chartRows = gridData.map((account: any) => {
				const totals = account.data?.reduce((acc: any, timeEntry: any) => ({
					orders: (acc.orders || 0) + (timeEntry.orders || 0),
					lines: (acc.lines || 0) + (timeEntry.lines || 0),
					packages: (acc.packages || 0) + (timeEntry.packages || 0),
					units: (acc.units || 0) + (timeEntry.units || 0)
				}), { orders: 0, lines: 0, packages: 0, units: 0 }) || { orders: 0, lines: 0, packages: 0, units: 0 };
				
				return {
					id: account.name,
					name: account.name,
					company_name: account.company_name,
					company_code: account.company_code,
					orders: totals.orders,
					lines: totals.lines,
					packages: totals.packages,
					units: totals.units,
					timeData: account.data || [] // Keep original time series data for table
				};
			});
			
			// Store both chart data and time headers for table use
			setRows(chartRows);
			setTimeHeaders(timeHeaders);
			setLoaded(true);
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

	// Helper functions
	const updateFilter = (key: keyof FilterState, value: string | string[]) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const clearAllFilters = () => {
		setFilters({
			timeWeekly: 'weekly',
			shippedDate: '-90D', // Reset to default Last 90 Days
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

	// Sorting function
	const handleSort = (field: 'name' | 'company_code' | 'company_name') => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	// Get sorted rows for table display
	const sortedRows = useMemo(() => {
		if (!sortField) return rows;
		
		return [...rows].sort((a, b) => {
			const aValue = a[sortField] || '';
			const bValue = b[sortField] || '';
			
			if (sortDirection === 'asc') {
				return aValue.toString().localeCompare(bValue.toString());
			} else {
				return bValue.toString().localeCompare(aValue.toString());
			}
		});
	}, [rows, sortField, sortDirection]);


	const onDownload = () => {
		if (!rows.length) {
			alert('No data available to export');
			return;
		}

		try {
			exportAnalyticsReport(
				rows,
				'Analytics By Account',
				'by-account',
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

	const ReactApexChart = useMemo(() => dynamic(() => import('react-apexcharts'), { ssr: false }), []);

	const chartSeries = useMemo(() => {
		if (!rows?.length) return [] as any[];
		
		const series = [];
		
		// Main dataset for current year
		series.push({
			name: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1),
			data: rows.map((r) => r[selectedDataset] ?? 0),
			type: showTrendLine ? 'line' : 'column'
		});
		
		// Add comparison years if enabled
		if (compareYears) {
			// Previous year data (simulated for now)
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-1 year)`,
				data: rows.map((r) => Math.round((r[selectedDataset] ?? 0) * 0.85)), // Simulate 15% less
				type: showTrendLine ? 'line' : 'column'
			});
			
			// Two years ago data (simulated for now)
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-2 years)`,
				data: rows.map((r) => Math.round((r[selectedDataset] ?? 0) * 0.7)), // Simulate 30% less
				type: showTrendLine ? 'line' : 'column'
			});
		}
		
		return series as any[];
	}, [rows, selectedDataset, compareYears, showTrendLine]);

	const chartOptions = useMemo(() => {
		const categories = rows.map((r) => r.company_code || r.name || r.id || '');
		return {
			chart: { 
				type: showTrendLine ? 'line' : 'column',
				height: 400,
				toolbar: { 
					show: true,
					tools: {
						download: true,
						selection: false,
						zoom: true,
						zoomin: true,
						zoomout: true,
						pan: false,
						reset: true
					}
				},
				zoom: { enabled: true },
				animations: { enabled: true, speed: 800 }
			},
			plotOptions: {
				bar: {
					borderRadius: 4,
					columnWidth: '60%'
				}
			},
			stroke: { 
				curve: 'smooth', 
				width: showTrendLine ? 3 : 0
			},
			colors: ['var(--chart-color1)', 'var(--chart-color2)', 'var(--chart-color3)', 'var(--chart-color4)'],
			xaxis: { 
				categories,
				labels: { 
					rotate: -45,
					style: {
						colors: 'var(--font-color-100)',
						fontSize: '12px'
					}
				},
				axisBorder: {
					color: 'var(--border-color)'
				}
			},
			yaxis: {
				title: { 
					text: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1), 
					style: { color: 'var(--font-color-100)' } 
				},
				labels: { 
					formatter: (v: number) => `${Math.round(v).toLocaleString()}`,
					style: { colors: 'var(--font-color-100)' }
				}
			},
			legend: { 
				position: 'top',
				horizontalAlign: 'center',
				labels: {
					colors: 'var(--font-color)'
				}
			},
			grid: { 
				borderColor: 'var(--border-color)',
				strokeDashArray: 3
			},
			tooltip: {
				theme: 'dark',
				shared: true,
				intersect: false,
				y: {
					formatter: (val: number) => val.toLocaleString()
				}
			},
			dataLabels: {
				enabled: false
			}
		} as any;
	}, [rows, selectedDataset, showTrendLine]);

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
						<h1 className='text-[24px] font-bold text-font-color mb-2'>Analytics - By Account</h1>
						<p className='text-[14px] text-font-color-100'>A summary distributed by accounts</p>
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
					onValueChange={(value) => updateFilter('country', value)}
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

			{/* Content Section */}
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
						<p className='text-font-color-100 text-[14px] mb-4'>Configure your filters above and click "Run Report" to view analytics data.</p>
					</div>
				)}

				{loading && (
					<div className='p-8 text-center'>
						<IconRefresh className='w-8 h-8 text-primary mx-auto mb-4 animate-spin' />
						<div className='text-font-color font-medium'>Generating Report...</div>
						<div className='text-font-color-100 text-[13px] mt-1'>Please wait while we process your data</div>
					</div>
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
										<span className='text-[14px] font-bold text-primary'>
											{selectedDataset === 'orders' && stats.totalOrders.toLocaleString()}
											{selectedDataset === 'lines' && stats.totalLines.toLocaleString()}
											{selectedDataset === 'packages' && stats.totalPackages.toLocaleString()}
											{selectedDataset === 'units' && stats.totalUnits.toLocaleString()}
										</span>
									</div>
								</div>
								<ReactApexChart 
									options={chartOptions as any} 
									series={chartSeries as any} 
									type={showTrendLine ? 'line' : 'bar'} 
									height={400} 
									width='100%' 
									key={`${selectedDataset}-${compareYears}-${showTrendLine}`}
								/>
								
								{/* Chart Controls */}
								<div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-6 p-4 bg-primary-5 border border-border-color rounded-lg'>
									{/* Dataset Selection Buttons */}
									<div className='flex-1'>
										<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>Dataset</label>
										<div className='flex flex-wrap gap-2'>
											{(['orders', 'lines', 'packages', 'units'] as const).map((dataset) => (
												<button
													key={dataset}
													onClick={() => setSelectedDataset(dataset)}
													className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
														selectedDataset === dataset
															? 'bg-primary text-white shadow-sm'
															: 'bg-card-bg border border-border-color text-font-color hover:bg-primary-10'
													}`}
												>
													{dataset.charAt(0).toUpperCase() + dataset.slice(1)}
												</button>
											))}
										</div>
									</div>
									
									{/* Comparison Options */}
									<div className='flex-1'>
										<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>Options</label>
										<div className='space-y-3'>
											<div className="form-check">
												<input
													type="checkbox"
													id="compareYears"
													checked={compareYears}
													onChange={(e) => setCompareYears(e.target.checked)}
													className="form-check-input"
												/>
												<label className="form-check-label" htmlFor="compareYears">
													Compare to previous 2 years
												</label>
											</div>
											<div className="form-check">
												<input
													type="checkbox"
													id="showTrendLine"
													checked={showTrendLine}
													onChange={(e) => setShowTrendLine(e.target.checked)}
													className="form-check-input"
												/>
												<label className="form-check-label" htmlFor="showTrendLine">
													Show Trend Line
												</label>
											</div>
										</div>
									</div>
									
									{/* Active Filters Display */}
									<div className='flex-1'>
										<label className='block text-xs font-medium text-font-color-100 uppercase tracking-wider mb-2'>Active Filters</label>
										<div className='space-y-1 text-xs text-font-color-100'>
											<div>Time: {filters.timeWeekly.charAt(0).toUpperCase() + filters.timeWeekly.slice(1)}</div>
											<div>Date: {filters.shippedDate === '-90D' ? 'Last 90 Days' : filters.shippedDate}</div>
											{filters.warehouse.length > 0 && <div>Warehouses: {filters.warehouse.length} selected</div>}
											{filters.account.length > 0 && <div>Accounts: {filters.account.length} selected</div>}
											{filters.destination && <div>Destination: {filters.destination === '0' ? 'Domestic' : filters.destination === '1' ? 'International' : 'All'}</div>}
											{filters.channel.length > 0 && <div>Channels: {filters.channel.length} selected</div>}
											{filters.country && <div>Country: {filters.country}</div>}
											{filters.state && <div>State: {filters.state}</div>}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Data Grid Section - Show Only in Table Mode */}
						{viewMode === 'table' && (
							<div className='overflow-x-auto'>
								<div className='p-4 bg-primary-5 border-b border-border-color'>
									<div className='flex items-center gap-3'>
										<IconTable className='w-5 h-5 text-font-color-100' />
										<h3 className='text-[14px] font-semibold text-font-color'>Data Grid</h3>
										<div className='flex items-center gap-4 ml-auto'>
											<div className='flex items-center gap-2'>
												<span className='text-[12px] text-font-color-100'>Showing:</span>
												<span className='text-[14px] font-bold text-primary bg-primary-10 px-2 py-1 rounded'>
													{selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)}
												</span>
											</div>
											<div className='text-[12px] text-font-color-100'>
												{rows.length} accounts • Total: {stats.totalOrders.toLocaleString()}
											</div>
										</div>
									</div>
								</div>
								<table className='w-full min-w-[1800px]'>
									<thead className='bg-primary-5 border-b border-border-color'>
										<tr className='text-center text-font-color text-[11px] font-bold uppercase tracking-wider border-b border-border-color'>
											<th className='py-3 px-3 w-[60px] text-center'>#</th>
											<th className='py-3 px-4 text-left w-[120px]'>
												<button
													onClick={() => handleSort('name')}
													className='flex items-center gap-1 hover:text-primary transition-colors'
												>
													Account #
													{sortField === 'name' ? (
														sortDirection === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													) : (
														<IconSelector className='w-3 h-3 opacity-50' />
													)}
												</button>
											</th>
											<th className='py-3 px-4 text-left w-[120px]'>
												<button
													onClick={() => handleSort('company_code')}
													className='flex items-center gap-1 hover:text-primary transition-colors'
												>
													Company Code
													{sortField === 'company_code' ? (
														sortDirection === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													) : (
														<IconSelector className='w-3 h-3 opacity-50' />
													)}
												</button>
											</th>
											<th className='py-3 px-4 text-left w-[200px]'>
												<button
													onClick={() => handleSort('company_name')}
													className='flex items-center gap-1 hover:text-primary transition-colors'
												>
													Company Name
													{sortField === 'company_name' ? (
														sortDirection === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													) : (
														<IconSelector className='w-3 h-3 opacity-50' />
													)}
												</button>
											</th>
											{/* Dynamic time period columns */}
											{timeHeaders.map((header, index) => (
												<th key={index} className='py-3 px-3 text-right w-[120px] border-l border-border-color'>
													<div className='text-[10px]'>{header.name}</div>
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{sortedRows.map((account, i) => (
											<tr key={(account.id || account.name || i).toString()} className='border-b border-border-color hover:bg-primary-10 transition-colors'>
												<td className='py-2 px-3 text-center text-font-color-100 text-[12px] font-medium'>{i + 1}</td>
												<td className='py-2 px-4'>
													<div className='font-semibold text-[13px] text-font-color'>{account.name}</div>
												</td>
												<td className='py-2 px-4'>
													<div className='font-medium text-[13px] text-font-color'>{account.company_code}</div>
												</td>
												<td className='py-2 px-4'>
													<div className='font-medium text-[13px] text-font-color'>{account.company_name}</div>
												</td>
												{/* Dynamic time period data columns */}
												{account.timeData && account.timeData.map((timeEntry: any, timeIndex: number) => (
													<td key={timeIndex} className='py-2 px-3 text-right border-l border-border-color'>
														<div className='font-medium text-[13px] text-font-color'>
															{(timeEntry[selectedDataset] || 0).toLocaleString()}
														</div>
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
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
	);
}