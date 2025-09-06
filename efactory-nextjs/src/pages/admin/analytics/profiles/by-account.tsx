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
	IconChevronUp,
	IconChevronDown,
	IconSelector,
	IconUsers,
	IconBuilding,
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
	
	// Chart animation hook
	const { triggerDataLoadAnimation, triggerDatasetChangeAnimation, getAnimationSettings } = useChartAnimation();
	
	// Chart dataset options
	const [selectedDataset, setSelectedDataset] = useState<'orders' | 'lines' | 'packages' | 'units'>('orders');
	
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
		const filterArray: Array<{ field: string; value: string; oper: string }> = [
			{ field: 'time_dimension', value: filters.timeWeekly, oper: '=' }
		];

			// Add shipped date filter (using legacy format)
			if (filters.shippedDate) {
				if (filters.shippedDate.includes('|')) {
				// Custom date range: "2024-01-01|2024-01-31"
				const [startDate, endDate] = filters.shippedDate.split('|');
				if (startDate && endDate) {
					filterArray.push({ field: 'shipped_date', value: startDate, oper: '>=' });
					filterArray.push({ field: 'shipped_date', value: endDate, oper: '<=' });
				}
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
			
			
			// Store the raw grid data and time headers
			const gridData = (res.data as any)?.grid || [];
			const timeHeaders = (res.data as any)?.grid_variable_header || [];
			
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

	// Helper functions
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
			shippedDate: '-90D', // Reset to default Last 90 Days
			warehouse: [],
			account: [],
			destination: '',
			channel: [],
			country: '',
			state: ''
		});
	};

	const hasActiveFilters = (): boolean => {
		return filters.warehouse.length > 0 || filters.account.length > 0 || !!filters.destination || 
		       filters.channel.length > 0 || !!filters.country || !!filters.state ||
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
				selectedDataset
			}
		);
		} catch (error) {
			console.error('Export failed:', error);
			alert(`Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	};

	const stats = useMemo(() => {
		if (!rows.length) return { 
			totalOrders: 0, 
			totalLines: 0, 
			totalPackages: 0, 
			totalUnits: 0,
			totalAccounts: 0,
			uniqueCompanies: 0,
			avgOrdersPerAccount: 0,
			avgLinesPerAccount: 0
		};
		
		const totalOrders = rows.reduce((sum, r) => sum + (r.orders || 0), 0);
		const totalLines = rows.reduce((sum, r) => sum + (r.lines || 0), 0);
		const totalPackages = rows.reduce((sum, r) => sum + (r.packages || 0), 0);
		const totalUnits = rows.reduce((sum, r) => sum + (r.units || 0), 0);
		const totalAccounts = rows.length;
		const uniqueCompanies = new Set(rows.map(r => r.company_code).filter(Boolean)).size;
		
		return {
			totalOrders,
			totalLines,
			totalPackages,
			totalUnits,
			totalAccounts,
			uniqueCompanies,
			avgOrdersPerAccount: totalAccounts > 0 ? totalOrders / totalAccounts : 0,
			avgLinesPerAccount: totalAccounts > 0 ? totalLines / totalAccounts : 0
		};
	}, [rows]);

	// Calculate growth metrics (comparing top half vs bottom half by selected dataset)
	const growthMetrics = useMemo(() => {
		if (rows.length < 4) return { ordersGrowth: 0, linesGrowth: 0, packagesGrowth: 0, unitsGrowth: 0 };
		
		// Sort by selected dataset to compare top performers vs bottom performers
		const sortedByDataset = [...rows].sort((a, b) => (b[selectedDataset] || 0) - (a[selectedDataset] || 0));
		const midPoint = Math.floor(sortedByDataset.length / 2);
		const topHalf = sortedByDataset.slice(0, midPoint);
		const bottomHalf = sortedByDataset.slice(midPoint);
		
		const topHalfOrders = topHalf.reduce((sum, r) => sum + (r.orders || 0), 0);
		const bottomHalfOrders = bottomHalf.reduce((sum, r) => sum + (r.orders || 0), 0);
		const ordersGrowth = bottomHalfOrders > 0 ? ((topHalfOrders - bottomHalfOrders) / bottomHalfOrders) * 100 : 0;
		
		const topHalfLines = topHalf.reduce((sum, r) => sum + (r.lines || 0), 0);
		const bottomHalfLines = bottomHalf.reduce((sum, r) => sum + (r.lines || 0), 0);
		const linesGrowth = bottomHalfLines > 0 ? ((topHalfLines - bottomHalfLines) / bottomHalfLines) * 100 : 0;
		
		const topHalfPackages = topHalf.reduce((sum, r) => sum + (r.packages || 0), 0);
		const bottomHalfPackages = bottomHalf.reduce((sum, r) => sum + (r.packages || 0), 0);
		const packagesGrowth = bottomHalfPackages > 0 ? ((topHalfPackages - bottomHalfPackages) / bottomHalfPackages) * 100 : 0;
		
		const topHalfUnits = topHalf.reduce((sum, r) => sum + (r.units || 0), 0);
		const bottomHalfUnits = bottomHalf.reduce((sum, r) => sum + (r.units || 0), 0);
		const unitsGrowth = bottomHalfUnits > 0 ? ((topHalfUnits - bottomHalfUnits) / bottomHalfUnits) * 100 : 0;
		
		return { ordersGrowth, linesGrowth, packagesGrowth, unitsGrowth };
	}, [rows, selectedDataset]);

	// ECharts component - dynamically imported for SSR compatibility
	const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

	// Use the new chart theme system
	const { echartsThemeName, currentTheme, currentLunoTheme } = useChartTheme();

	// Generate ECharts options - using theme system with stacked columns
	const getEChartsOption = () => {
		if (!rows?.length || !timeHeaders?.length) return {};

		const categories = rows.map((r) => r.name || r.id || '');
		let series = [];

		// Create stacked columns for top 6 time periods + others
		const topTimeHeaders = timeHeaders.slice(0, 6);
		const hasOthers = timeHeaders.length > 6;

		// Add top 6 time periods
		topTimeHeaders.forEach((timeHeader, index) => {
			series.push({
				name: timeHeader.name || `Period ${index + 1}`,
				type: 'bar',
				stack: 'total',
				data: rows.map((r) => {
					// Get the data for this time period from the account's timeData
					const timeData = r.timeData?.[index];
					return timeData ? (timeData[selectedDataset] || 0) : 0;
				}),
				animationDelay: index * 100, // Stagger animation
				label: {
					show: false,
					position: 'inside',
					fontSize: 10,
					fontWeight: 'bold',
					color: '#ffffff',
					formatter: function(params: any) {
						return params.value > 0 ? params.value.toLocaleString() : '';
					}
				}
			});
		});

		// Add "Others" series if there are more than 6 time periods
		if (hasOthers) {
			series.push({
				name: 'Others',
				type: 'bar',
				stack: 'total',
				data: rows.map((r) => {
					// Sum up all time periods beyond the first 6
					const othersData = r.timeData?.slice(6).reduce((acc: any, timeEntry: any) => {
						return acc + (timeEntry[selectedDataset] || 0);
					}, 0) || 0;
					return othersData;
				}),
				animationDelay: 6 * 100, // Stagger animation
				label: {
					show: false,
					position: 'inside',
					fontSize: 10,
					fontWeight: 'bold',
					color: '#ffffff',
					formatter: function(params: any) {
						return params.value > 0 ? params.value.toLocaleString() : '';
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
				axisPointer: {
					type: 'shadow'
				},
				extraCssText: 'z-index: 99999 !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
				position: function (point: any, params: any, dom: any, rect: any, size: any) {
					const [mouseX, mouseY] = point;
					const {contentSize, viewSize} = size;
					const [tooltipWidth, tooltipHeight] = contentSize;
					const [chartWidth, chartHeight] = viewSize;
					
					let x = mouseX + 10;
					let y = mouseY + 10;
					
					if (x + tooltipWidth > chartWidth) {
						x = mouseX - tooltipWidth - 10;
					}
					
					if (y + tooltipHeight > chartHeight) {
						y = mouseY - tooltipHeight - 10;
					}
					
					x = Math.max(5, Math.min(x, chartWidth - tooltipWidth - 5));
					y = Math.max(5, Math.min(y, chartHeight - tooltipHeight - 5));
					
					return [x, y];
				},
				formatter: function(params: any) {
					if (!Array.isArray(params)) params = [params];
					
					const account = rows[params[0].dataIndex];
					if (!account) return '';

					let tooltip = `<div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">
						${account.company_code || account.name || ''} - ${account.company_name || ''}
					</div>`;
					
					tooltip += `<div style="margin-bottom: 8px;">
						<strong>Account #: ${account.name || account.id || ''}</strong>
					</div>`;
					
					// Calculate total for this account
					let total = 0;
					params.forEach((param: any) => {
						total += param.value || 0;
					});
					
					tooltip += `<div style="margin-bottom: 8px; padding: 8px; background-color: rgba(124, 58, 237, 0.1); border-radius: 4px;">
						<div style="font-weight: 600;">Total ${selectedDataset.charAt(0).toUpperCase() + selectedDataset.slice(1)}: ${total.toLocaleString()}</div>
					</div>`;
					
					params.forEach((param: any) => {
						if (param.value > 0) {
							tooltip += `<div style="margin-bottom: 4px; display: flex; align-items: center;">
								<span style="display: inline-block; width: 12px; height: 12px; background-color: ${param.color}; margin-right: 8px; border-radius: 2px;"></span>
								<span>${param.seriesName}: </span>
								<strong style="margin-left: 4px;">${param.value.toLocaleString()}</strong>
							</div>`;
						}
					});

					return tooltip;
				}
			},
			legend: {
				type: 'scroll',
				top: 0,
				left: 'center',
				textStyle: {
					fontSize: 11
				}
			},
			xAxis: {
				type: 'category',
				data: categories,
				axisLabel: {
					rotate: -45,
					fontSize: 10,
					interval: Math.max(0, Math.ceil(categories.length / 30) - 1), // Max 30 labels
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

			{/* Combined Metrics Grid - Single Row */}
			{loaded && rows.length > 0 && (
				<div className='mb-6'>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3'>
						{/* Total Orders with Growth */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-3 border border-primary'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[16px]/[20px] font-bold text-white'>{stats.totalOrders.toLocaleString()}</div>
									<div className='text-[12px]/[14px] text-white/80'>Total Orders</div>
								</div>
								<div className='w-[24px] h-[24px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconShoppingCart className='w-[12px] h-[12px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
													<div className='text-[11px]/[13px] text-white/60'>
						{stats.avgOrdersPerAccount.toFixed(0)} avg/account
					</div>
							</div>
						</div>

						{/* Total Lines with Growth */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-3 border border-success'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[16px]/[20px] font-bold text-white'>{stats.totalLines.toLocaleString()}</div>
									<div className='text-[12px]/[14px] text-white/80'>Total Lines</div>
								</div>
								<div className='w-[24px] h-[24px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconList className='w-[12px] h-[12px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
													<div className='text-[11px]/[13px] text-white/60'>
						{stats.avgLinesPerAccount.toFixed(0)} avg/account
					</div>
							</div>
						</div>

						{/* Total Packages with Growth */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-3 border border-warning'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[16px]/[20px] font-bold text-white'>{stats.totalPackages.toLocaleString()}</div>
									<div className='text-[12px]/[14px] text-white/80'>Total Packages</div>
								</div>
								<div className='w-[24px] h-[24px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconPackage className='w-[12px] h-[12px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[11px]/[13px] text-white/60'>
									{stats.totalPackages > 0 ? (stats.totalPackages / stats.totalAccounts).toFixed(0) : 0} avg/account
								</div>
							</div>
						</div>

						{/* Total Units with Growth */}
						<div className='card bg-gradient-to-br from-info to-info-10 rounded-xl p-3 border border-info'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[16px]/[20px] font-bold text-white'>{stats.totalUnits.toLocaleString()}</div>
									<div className='text-[12px]/[14px] text-white/80'>Total Units</div>
								</div>
								<div className='w-[24px] h-[24px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBox className='w-[12px] h-[12px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[11px]/[13px] text-white/60'>
									{stats.totalUnits > 0 ? (stats.totalUnits / stats.totalAccounts).toFixed(0) : 0} avg/account
								</div>
							</div>
						</div>

						{/* Total Accounts */}
						<div className='card bg-gradient-to-br from-secondary to-secondary-10 rounded-xl p-3 border border-secondary'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[16px]/[20px] font-bold text-white'>{stats.totalAccounts.toLocaleString()}</div>
									<div className='text-[12px]/[14px] text-white/80'>Total Accounts</div>
								</div>
								<div className='w-[24px] h-[24px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconUsers className='w-[12px] h-[12px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[11px]/[13px] text-white/60'>
									Active accounts
								</div>
								<div className='text-[11px]/[13px] text-white/80 font-medium'>
									100% active
								</div>
							</div>
						</div>

						{/* Unique Companies */}
						<div className='card bg-gradient-to-br from-danger to-danger-10 rounded-xl p-3 border border-danger'>
							<div className='flex items-center justify-between mb-2'>
								<div>
									<div className='text-[16px]/[20px] font-bold text-white'>{stats.uniqueCompanies.toLocaleString()}</div>
									<div className='text-[12px]/[14px] text-white/80'>Unique Companies</div>
								</div>
								<div className='w-[24px] h-[24px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBuilding className='w-[12px] h-[12px] text-white' />
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<div className='text-[11px]/[13px] text-white/60'>
									{stats.totalAccounts > 0 ? (stats.totalAccounts / stats.uniqueCompanies).toFixed(1) : 0} accounts/company
								</div>
								<div className='text-[11px]/[13px] text-white/80 font-medium'>
									{stats.uniqueCompanies > 0 ? ((stats.uniqueCompanies / stats.totalAccounts) * 100).toFixed(1) : 0}% diversity
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

		<AnalyticsFilterHeader
			viewMode={viewMode}
			onViewModeChange={(mode: string) => setViewMode(mode as 'chart' | 'table')}
			hasActiveFilters={hasActiveFilters()}
			onClearAllFilters={clearAllFilters}
		>
			<div className='flex flex-wrap gap-4'>
				{/* Time Period */}
				<TimeFilterCombobox
					value={filters.timeWeekly}
					onValueChange={(value: any) => updateFilter('timeWeekly', value as any)}
					className='flex-shrink-0 w-32'
				/>

				{/* Shipped Date */}
				<ShippedDateFilterCombobox
					value={filters.shippedDate}
					onValueChange={(value: any) => updateFilter('shippedDate', value)}
					className='flex-shrink-0 w-48'
				/>

				{/* Warehouse - Multi-select */}
				<WarehouseFilterCombobox
					value={filters.warehouse as any}
					onValueChange={(value: any) => updateFilter('warehouse', value)}
					className='flex-shrink-0 w-52'
				/>

				{/* Account - Multi-select */}
				<AccountFilterCombobox
					value={filters.account as any}
					onValueChange={(value: any) => updateFilter('account', value)}
					className='flex-shrink-0 w-52'
				/>

				{/* Destination */}
				<DestinationFilterCombobox
					value={filters.destination}
					onValueChange={(value: any) => updateFilter('destination', value)}
					className='flex-shrink-0 w-36'
				/>

				{/* Channel */}
				<ChannelFilterCombobox
					value={filters.channel as any}
					onValueChange={(value: any) => updateFilter('channel', value)}
					className='flex-shrink-0 w-48'
				/>

				{/* Country */}
				<CountryFilterCombobox
					value={filters.country}
					onValueChange={(value: any) => {
						updateFilter('country', value);
						// Clear state when country is cleared or changed
						if (!value || value !== filters.country) {
							updateFilter('state', '');
						}
					}}
					className='flex-shrink-0 w-48'
				/>

				{/* State - Only show when country is selected */}
				<StateFilterCombobox
					value={filters.state}
					onValueChange={(value: any) => updateFilter('state', value)}
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
										key={`account-chart-${selectedDataset}-${echartsThemeName}`}
										style={{ width: '100%', height: '400px' }}
										opts={{ renderer: 'canvas' }}
									/>
								</div>
								
								<ChartControls
									selectedDataset={selectedDataset}
									onDatasetChange={handleDatasetChange}
									compareYears={false}
									onCompareYearsChange={() => {}}
									showOptions={false}
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

						{/* Data Grid Section - Show Only in Table Mode */}
						{viewMode === 'table' && (
							<div className='overflow-x-auto'>
								<div className='p-4 bg-primary-5 border-b border-border-color'>
									<div className='flex items-center gap-3'>
										<IconTable className='w-5 h-5 text-font-color-100' />
										<h3 className='text-[14px] font-semibold text-font-color'>Data Grid</h3>
										<div className='flex items-center gap-4 ml-auto'>
											<div className='text-[12px] text-font-color-100'>
												{rows.length} accounts • Total: {
													selectedDataset === 'orders' && stats.totalOrders.toLocaleString()
													|| selectedDataset === 'lines' && stats.totalLines.toLocaleString()
													|| selectedDataset === 'packages' && stats.totalPackages.toLocaleString()
													|| selectedDataset === 'units' && stats.totalUnits.toLocaleString()
												}
											</div>
										</div>
									</div>
								</div>
								<table className='w-full min-w-[1800px]'>
									<thead className='bg-primary-5 border-b border-border-color'>
										<tr className='text-center text-font-color text-[11px] font-bold uppercase tracking-wider border-b border-border-color'>
											<th className='py-3 px-3 w-[60px] text-center'>#</th>
											<th className='py-3 px-4 text-left w-[120px] whitespace-nowrap'>
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
											<th className='py-3 px-4 text-left w-[120px] whitespace-nowrap'>
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
											<th className='py-3 px-4 text-left min-w-[300px] whitespace-nowrap'>
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
											{/* Dynamic time period columns - All periods */}
											{timeHeaders.map((header, index) => (
												<th key={index} className='py-3 px-3 text-right w-[120px] whitespace-nowrap'>
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
												{/* All time period data columns */}
												{account.timeData && account.timeData.map((timeEntry: any, timeIndex: number) => (
													<td key={timeIndex} className='py-2 px-3 text-right'>
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