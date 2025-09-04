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
	IconBox
} from '@tabler/icons-react';
import { 
	ShippedDateFilterCombobox,
	WarehouseFilterCombobox,
	AccountFilterCombobox,
	CountryFilterCombobox,
	StateFilterCombobox
} from '@/components/filters';
import { AnalyticsFilterHeader } from '@/components/analytics';

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
			
			console.log('API Response:', res);
			console.log('Chart data:', res.data?.chart);
			
			setRows(res.data?.chart || []);
			setLoaded(true);
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

	const ReactApexChart = useMemo(() => dynamic(() => import('react-apexcharts'), { ssr: false }), []);

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

	// Bar chart series (horizontal bars like legacy)
	const barChartSeries = useMemo(() => {
		if (!processedData?.length) return [] as any[];
		
		const series = [];
		const dataKey = selectedDataset;
		
		// Add comparison years if enabled
		if (compareYears) {
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-2 years)`,
				data: processedData.map((r) => r.year_2?.[dataKey] ?? 0)
			});
			series.push({
				name: `${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)} (-1 year)`,
				data: processedData.map((r) => r.year_1?.[dataKey] ?? 0)
			});
		}
		
		// Add current year data
		series.push({
			name: selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1),
			data: processedData.map((r) => r[dataKey] ?? 0)
		});
		
		return series as any[];
	}, [processedData, selectedDataset, compareYears]);

	// Pie chart data (only current year, no comparison)
	const pieChartData = useMemo(() => {
		if (!processedData?.length) return [] as any[];
		
		const dataKey = selectedDataset;
		return processedData.map((r) => ({
			name: r.name,
			value: r[dataKey] || 0
		}));
	}, [processedData, selectedDataset]);

	// Bar chart options (horizontal bars like legacy)
	const barChartOptions = useMemo(() => {
		const categories = processedData.map((r) => r.name || r.id || '');
		return {
			chart: { 
				type: 'bar',
				toolbar: { show: false }, 
				stacked: false,
				height: 450,
				offsetX: 0,
				offsetY: 0,
				parentHeightOffset: 0,
				sparkline: {
					enabled: false
				}
			},
			plotOptions: { 
				bar: { 
					horizontal: true,
					columnWidth: '70%',
					dataLabels: {
						position: 'top'
					}
				} 
			},
			stroke: { 
				show: true, 
				width: 1, 
				colors: ['transparent'] 
			},
			colors: ['#731F0B', '#BB4C31', '#D08472'],
			xaxis: { 
				categories,
				labels: {
					formatter: (v: number) => `${Math.round(v).toLocaleString()}`
				}
			},
			yaxis: { 
				labels: {
					style: {
						fontSize: '11px'
					}
				}
			},
			legend: { 
				position: 'top',
				horizontalAlign: 'left'
			},
			fill: { opacity: 0.9 },
			grid: { 
				borderColor: 'var(--border-color)',
				strokeDashArray: 1,
				padding: {
					top: 0,
					right: 80,
					bottom: 0,
					left: 0
				}
			},
			dataLabels: { 
				enabled: true,
				formatter: (val: number) => val.toLocaleString(),
				style: {
					fontSize: '11px',
					colors: ['#fff'],
					fontWeight: 'bold'
				},
				offsetX: -10,
				offsetY: 0,
				textAnchor: 'end',
				distributed: false
			},
			tooltip: {
				y: {
					formatter: (val: number) => val.toLocaleString()
				}
			}
		} as any;
	}, [processedData]);

	// Pie chart options (donut chart like legacy)
	const pieChartOptions = useMemo(() => {
		return {
			chart: {
				type: 'donut',
				height: 450
			},
			colors: [
				'#731F0B', '#BB4C31', '#D08472', '#8B4513', '#A0522D', 
				'#CD853F', '#DEB887', '#F4A460', '#D2691E', '#B22222', '#DC143C'
			],
			labels: pieChartData.map(d => d.name),
			legend: {
				position: 'bottom',
				fontSize: '11px'
			},
			plotOptions: {
				pie: {
					donut: {
						size: '30%'
					}
				}
			},
			dataLabels: {
				enabled: true,
				formatter: (val: number, opts: any) => {
					return `${val.toFixed(1)}%`;
				},
				style: {
					fontSize: '10px',
					colors: ['#fff']
				}
			},
			tooltip: {
				y: {
					formatter: (val: number) => val.toLocaleString()
				}
			}
		} as any;
	}, [pieChartData]);

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
					onValueChange={(value) => updateFilter('country', value)}
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
					<div className='p-8 text-center'>
						<div className='text-[14px] text-font-color-100'>Loading analytics data...</div>
					</div>
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
										<div className='text-[10px] text-gray-500'>
											Raw data: {rows.length} rows | Processed: {processedData.length} items | Pie data: {pieChartData.length} points
										</div>
									</div>

									{/* Charts Grid */}
									<div className='grid grid-cols-12 gap-4 mb-6'>
										{/* Bar Chart */}
										<div className='col-span-7'>
											{processedData.length > 0 ? (
												<ReactApexChart
													options={barChartOptions as any} 
													series={barChartSeries as any} 
													type='bar' 
													height={450} 
													key={`bar-${selectedDataset}-${compareYears}`}
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
												<ReactApexChart
													options={pieChartOptions as any} 
													series={pieChartData.map(d => d.value)} 
													type='donut' 
													height={450} 
													key={`pie-${selectedDataset}`}
												/>
											) : (
												<div className='flex items-center justify-center h-[450px] bg-gray-50 rounded-lg'>
													<div className='text-gray-500'>No data available for pie chart</div>
												</div>
											)}
										</div>
									</div>

									{/* Chart Controls */}
									<div className='mt-6 space-y-4'>
										{/* Dataset Selection Buttons */}
										<div className='flex items-center gap-2'>
											<span className='text-[12px] text-font-color-100 mr-3'>Dataset:</span>
											{(['orders', 'lines', 'packages', 'units'] as const).map((dataset) => (
												<button
													key={dataset}
													onClick={() => setSelectedDataset(dataset)}
													className={`px-3 py-1.5 text-[11px] font-medium rounded transition-colors ${
														selectedDataset === dataset 
															? 'bg-primary text-white' 
															: 'bg-card-color text-font-color-100 border border-border-color hover:bg-primary-10'
													}`}
												>
													{dataset.charAt(0).toUpperCase() + dataset.slice(1)}
												</button>
											))}
										</div>

										{/* Comparison Options */}
										<div className='flex items-center gap-6'>
											<div className='form-check'>
												<input
													type='checkbox'
													id='compareYears'
													className='form-check-input'
													checked={compareYears}
													onChange={(e) => setCompareYears(e.target.checked)}
												/>
												<label htmlFor='compareYears' className='form-check-label text-[12px]'>
													Compare to previous 2 years
												</label>
											</div>
										</div>

										{/* Active Filters Display */}
										<div className='text-[10px] text-font-color-100 space-y-1'>
											<div className='font-medium'>Active Filters:</div>
											<div>Date: {filters.shippedDate === '-90D' ? 'Last 90 Days' : filters.shippedDate}</div>
											{filters.warehouse.length > 0 && <div>Warehouses: {filters.warehouse.length} selected</div>}
											{filters.account.length > 0 && <div>Accounts: {filters.account.length} selected</div>}
											{filters.country && <div>Country: {filters.country}</div>}
											{filters.state && <div>State: {filters.state}</div>}
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Data Grid Section - Always Show (Like Legacy) */}
						{viewMode === 'table' && (
							<div className='p-6'>
								<div className='mb-4'>
									<div className='flex items-center justify-between'>
										<h3 className='text-[16px] font-bold text-font-color'>Ship Service Data</h3>
										<div className='text-[12px] text-font-color-100'>
											{processedData.length} services • Total: {stats.totalOrders.toLocaleString()}
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
														<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
															{(row.year_2?.orders || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
															{(row.year_1?.orders || 0).toLocaleString()}
														</td>
													)}
													<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
														{(row.orders || 0).toLocaleString()}
													</td>

													{/* Lines */}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
															{(row.year_2?.lines || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
															{(row.year_1?.lines || 0).toLocaleString()}
														</td>
													)}
													<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
														{(row.lines || 0).toLocaleString()}
													</td>

													{/* Packages */}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
															{(row.year_2?.packages || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
															{(row.year_1?.packages || 0).toLocaleString()}
														</td>
													)}
													<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
														{(row.packages || 0).toLocaleString()}
													</td>

													{/* Units */}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
															{(row.year_2?.units || 0).toLocaleString()}
														</td>
													)}
													{compareYears && (
														<td className={`py-2 px-2 text-right text-[11px] text-font-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
															{(row.year_1?.units || 0).toLocaleString()}
														</td>
													)}
													<td className={`py-2 px-2 text-right text-[11px] text-font-color border-l border-border-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
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
													<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.orders || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.orders || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'orders' ? 'bg-primary-10' : ''}`}>
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.orders || 0), 0).toLocaleString()}
													</span>
												</td>

												{/* Lines Totals */}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.lines || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.lines || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'lines' ? 'bg-primary-10' : ''}`}>
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.lines || 0), 0).toLocaleString()}
													</span>
												</td>

												{/* Packages Totals */}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.packages || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.packages || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'packages' ? 'bg-primary-10' : ''}`}>
													<span style={{color: '#6B7280'}}>
														{processedData.reduce((sum, row) => sum + (row.packages || 0), 0).toLocaleString()}
													</span>
												</td>

												{/* Units Totals */}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_2?.units || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												{compareYears && (
													<td className={`py-3 px-2 text-right text-[11px] font-bold ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
														<span style={{color: '#6B7280'}}>
															{processedData.reduce((sum, row) => sum + (row.year_1?.units || 0), 0).toLocaleString()}
														</span>
													</td>
												)}
												<td className={`py-3 px-2 text-right text-[11px] font-bold border-l border-border-color ${selectedDataset === 'units' ? 'bg-primary-10' : ''}`}>
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
