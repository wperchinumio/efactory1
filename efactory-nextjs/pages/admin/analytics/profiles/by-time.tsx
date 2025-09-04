import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { 
	IconCalendar, 
	IconDownload, 
	IconPrinter, 
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
import Combobox from '@/components/ui/Combobox';
import MultiSelectCombobox from '@/components/ui/MultiSelectCombobox';
import DateRangeCombobox from '@/components/ui/DateRangeCombobox';
import { useGlobalFilterData } from '@/hooks/useGlobalFilterData';

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
	warehouse: string[];  // Multi-select array
	account: string[];    // Multi-select array  
	destination: string;
	channel: string[];    // Multi-select array for channels
	country: string;
	state: string;
}

export default function AdminAnalyticsByTime() {
	const [rows, setRows] = useState<ChartRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
	const [mounted, setMounted] = useState(false);
	
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

	// Load global filter data
	const globalData = useGlobalFilterData();
	
	// Debug logging
	console.log('🎯 Analytics page - globalData:', globalData);

	// Get filter options from global data
	const filterOptions = useMemo(() => {
		if (globalData.loading) {
			return {
				timeOptions: [
					{ value: 'daily', label: 'Daily' },
					{ value: 'weekly', label: 'Weekly' },
					{ value: 'monthly', label: 'Monthly' },
					{ value: 'quarterly', label: 'Quarterly' },
					{ value: 'yearly', label: 'Yearly' }
				],
				shippedDateOptions: [
					{ value: 'LAST 30 DAYS', label: 'Last 30 Days' },
					{ value: 'LAST 60 DAYS', label: 'Last 60 Days' },
					{ value: 'LAST 90 DAYS', label: 'Last 90 Days' },
					{ value: 'LAST 180 DAYS', label: 'Last 180 Days' },
					{ value: 'LAST 365 DAYS', label: 'Last 365 Days' },
					{ value: 'CURRENT_MONTH', label: 'Current Month' },
					{ value: 'LAST_MONTH', label: 'Last Month' },
					{ value: 'CURRENT_QUARTER', label: 'Current Quarter' },
					{ value: 'LAST_QUARTER', label: 'Last Quarter' },
					{ value: 'CURRENT_YEAR', label: 'Current Year' },
					{ value: 'LAST_YEAR', label: 'Last Year' }
				],
				warehouseOptions: [],
				accountOptions: [],
				destinationOptions: [
					{ value: '', label: 'All Destinations' },
					{ value: '0', label: 'Domestic' },
					{ value: '1', label: 'International' }
				],
				channelOptions: [],
				countryOptions: [],
				stateOptions: [{ value: '', label: 'All States' }]
			};
		}

		const { 
			warehouseOptions, 
			countryOptions, 
			getStateOptions, 
			channelOptions, 
			getAccountOptions 
		} = globalData.getFilterOptions();

		return {
			timeOptions: [
				{ value: 'daily', label: 'Daily' },
				{ value: 'weekly', label: 'Weekly' },
				{ value: 'monthly', label: 'Monthly' },
				{ value: 'quarterly', label: 'Quarterly' },
				{ value: 'yearly', label: 'Yearly' }
			],
			shippedDateOptions: [
				{ value: 'LAST 30 DAYS', label: 'Last 30 Days' },
				{ value: 'LAST 60 DAYS', label: 'Last 60 Days' },
				{ value: 'LAST 90 DAYS', label: 'Last 90 Days' },
				{ value: 'LAST 180 DAYS', label: 'Last 180 Days' },
				{ value: 'LAST 365 DAYS', label: 'Last 365 Days' },
				{ value: 'CURRENT_MONTH', label: 'Current Month' },
				{ value: 'LAST_MONTH', label: 'Last Month' },
				{ value: 'CURRENT_QUARTER', label: 'Current Quarter' },
				{ value: 'LAST_QUARTER', label: 'Last Quarter' },
				{ value: 'CURRENT_YEAR', label: 'Current Year' },
				{ value: 'LAST_YEAR', label: 'Last Year' }
			],
			warehouseOptions,
			accountOptions: getAccountOptions(filters.warehouse),
			destinationOptions: [
				{ value: '', label: 'All Destinations' },
				{ value: '0', label: 'Domestic' },        // value: 0, oper: '='
				{ value: '1', label: 'International' }    // value: 0, oper: '<>' (not equals 0)
			],
			channelOptions,
			countryOptions,
			stateOptions: getStateOptions(filters.country)
		};
	}, [globalData, filters.warehouse, filters.country]);

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
					stats: 'time_historical',
					global_analytics: true,
					filter: {
						and: filterArray,
					},
				},
			);
			setRows(res.data?.chart || []);
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

	const onPrint = () => {
		window.print();
	};

	const onDownload = async () => {
		try {
			// Similar to license summary download logic
			const xhr = new XMLHttpRequest();
			const params = new URLSearchParams({
				stats: 'time_historical',
				global_analytics: 'true',
				format: 'excel',
				...filters
			});

			xhr.open('GET', `/api/analytics/export?${params.toString()}`);
			xhr.setRequestHeader('X-Access-Token', getAuthToken() || '');
			xhr.setRequestHeader('X-Download-Params', params.toString());
			xhr.responseType = 'arraybuffer';

			xhr.onload = function() {
				if (xhr.status === 200) {
					const blob = new Blob([xhr.response], { 
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
					});
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = url;
					a.download = `analytics-by-time-${new Date().toISOString().split('T')[0]}.xlsx`;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}
			};

			xhr.send();
		} catch (error) {
			console.error('Download failed:', error);
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
		return [
			{ 
				name: 'Orders', 
				data: rows.map((r) => r.orders ?? 0),
				type: 'column'
			},
			{ 
				name: 'Lines', 
				data: rows.map((r) => r.lines ?? 0),
				type: 'line'
			},
			{ 
				name: 'Packages', 
				data: rows.map((r) => r.packages ?? 0),
				type: 'line'
			},
			{ 
				name: 'Units', 
				data: rows.map((r) => r.units ?? 0),
				type: 'line'
			},
		] as any[];
	}, [rows]);

	const chartOptions = useMemo(() => {
		const categories = rows.map((r) => r.name || r.id || '');
		return {
			chart: { 
				type: 'line',
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
				width: [0, 3, 3, 3],
				dashArray: [0, 0, 5, 8]
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
			yaxis: [
				{
					title: { text: 'Orders', style: { color: 'var(--font-color-100)' } },
					labels: { 
						formatter: (v: number) => `${Math.round(v).toLocaleString()}`,
						style: { colors: 'var(--font-color-100)' }
					}
				},
				{
					opposite: true,
					title: { text: 'Lines/Packages/Units', style: { color: 'var(--font-color-100)' } },
					labels: { 
						formatter: (v: number) => `${Math.round(v).toLocaleString()}`,
						style: { colors: 'var(--font-color-100)' }
					}
				}
			],
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
	}, [rows]);

	const clearFilters = () => {
		setFilters({
			timeWeekly: 'weekly',
			shippedDate: 'LAST 90 DAYS',
			warehouse: '',
			account: '',
			destination: '',
			channel: [],
			country: '',
			state: ''
		});
	};


	const onDownloadLegacy = () => {
		if (!mounted || typeof window === 'undefined') return;
		
		const xhr = new XMLHttpRequest();
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
		const url = `${apiBaseUrl}/api/analytics`;
		
		xhr.open('GET', url, true);
		
		const token = getAuthToken()?.api_token || '';
		xhr.setRequestHeader("X-Access-Token", token);
		
		const headerParams = JSON.stringify({
			action: 'export',
			stats: 'time_historical',
			global_analytics: true,
			filter: {
				and: [
					{ field: 'shipped_date', value: '-90D', oper: '=' },
					{ field: 'time_dimension', value: filters.timeWeekly, oper: '=' },
				],
			}
		});
		xhr.setRequestHeader("X-Download-Params", headerParams);
		xhr.responseType = 'arraybuffer';
		
		xhr.onload = function () {
			if (this.status === 200) {
				let filename = "analytics-by-time.xlsx";
				const disposition = xhr.getResponseHeader('Content-Disposition');
				if (disposition && disposition.indexOf('attachment') !== -1) {
					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
					const matches = filenameRegex.exec(disposition);
					if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
				}
				
				const type = xhr.getResponseHeader('Content-Type');
				const blob = new Blob([this.response], { type: type });
				
				if (typeof window.navigator.msSaveBlob !== 'undefined') {
					window.navigator.msSaveBlob(blob, filename);
				} else {
					const URL = window.URL || window.webkitURL;
					const downloadUrl = URL.createObjectURL(blob);
					
					const a = document.createElement("a");
					a.href = downloadUrl;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					setTimeout(() => { URL.revokeObjectURL(downloadUrl); }, 100);
				}
			}
		};
		
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send();
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
			{/* Header Section */}
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
				<div>
					<div className='flex items-center gap-3 mb-2'>
						<IconChartBar className='w-8 h-8 text-primary' />
						<h1 className='text-[28px]/[36px] font-bold text-font-color'>Analytics by Time</h1>
					</div>
					<p className='text-font-color-100 text-[14px]'>Track orders, lines, packages, and units over time periods</p>
				</div>
				<div className='flex items-center gap-3'>
					<button 
						className='btn btn-light-secondary' 
						onClick={onPrint}
						title='Print Report'
					>
						<IconPrinter className='w-4 h-4 me-2' />
						Print
					</button>
					<button 
						className='btn btn-light-secondary' 
						onClick={onDownload}
						disabled={!loaded}
						title='Download Excel'
					>
						<IconDownload className='w-4 h-4 me-2' />
						Download
					</button>
					<button 
						className='btn btn-primary' 
						onClick={runReport} 
						disabled={loading}
						title='Run Report'
					>
						<IconRefresh className={`w-4 h-4 me-2 ${loading ? 'animate-spin' : ''}`} />
						Run Report
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			{loaded && (
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
					<div className='bg-card-color border border-border-color rounded-xl p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-12 h-12 bg-primary-10 rounded-lg flex items-center justify-center'>
								<IconShoppingCart className='w-6 h-6 text-primary' />
							</div>
							<div>
								<div className='text-[20px] font-bold text-font-color'>{stats.totalOrders.toLocaleString()}</div>
								<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Total Orders</div>
							</div>
						</div>
					</div>
					<div className='bg-card-color border border-border-color rounded-xl p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-12 h-12 bg-success-10 rounded-lg flex items-center justify-center'>
								<IconList className='w-6 h-6 text-success' />
							</div>
							<div>
								<div className='text-[20px] font-bold text-font-color'>{stats.totalLines.toLocaleString()}</div>
								<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Total Lines</div>
							</div>
						</div>
					</div>
					<div className='bg-card-color border border-border-color rounded-xl p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-12 h-12 bg-warning-10 rounded-lg flex items-center justify-center'>
								<IconPackage className='w-6 h-6 text-warning' />
							</div>
							<div>
								<div className='text-[20px] font-bold text-font-color'>{stats.totalPackages.toLocaleString()}</div>
								<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Total Packages</div>
							</div>
						</div>
					</div>
					<div className='bg-card-color border border-border-color rounded-xl p-4'>
						<div className='flex items-center gap-3'>
							<div className='w-12 h-12 bg-info-10 rounded-lg flex items-center justify-center'>
								<IconBox className='w-6 h-6 text-info' />
							</div>
							<div>
								<div className='text-[20px] font-bold text-font-color'>{stats.totalUnits.toLocaleString()}</div>
								<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Total Units</div>
							</div>
						</div>
					</div>
				</div>
			)}

					{/* Advanced Filter Toolbar */}
		<div className='bg-gradient-to-r from-primary-5 to-primary-10 border border-primary-20 rounded-xl overflow-hidden mb-6'>
			{/* Toolbar Header */}
			<div className='bg-primary-10 border-b border-primary-20 px-6 py-3'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<div className='w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center'>
							<IconFilter className='w-4 h-4' />
						</div>
						<div>
							<h3 className='text-[14px] font-bold text-font-color'>Analytics Filters</h3>
							<p className='text-[11px] text-font-color-100'>Configure your report parameters</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						{hasActiveFilters() && (
							<button 
								className='btn btn-light-secondary btn-sm' 
								onClick={clearAllFilters}
								title='Clear All Filters'
							>
								<IconX className='w-3 h-3 me-1' />
								Clear
							</button>
						)}
						<button 
							className='btn btn-primary btn-sm' 
							onClick={runReport} 
							disabled={loading}
							title='Run Report'
						>
							<IconRefresh className={`w-3 h-3 me-1 ${loading ? 'animate-spin' : ''}`} />
							Run Report
						</button>
						<button 
							className='btn btn-light-secondary btn-sm' 
							onClick={onPrint}
							title='Print Report'
						>
							<IconPrinter className='w-3 h-3 me-1' />
							Print
						</button>
						<button 
							className='btn btn-success btn-sm' 
							onClick={onDownload}
							title='Download Excel'
						>
							<IconDownload className='w-3 h-3 me-1' />
							Download
						</button>
					</div>
				</div>
			</div>

			{/* Filter Controls */}
			<div className='p-6'>
				<div className='flex flex-wrap gap-4'>
					{/* Time Period */}
					<div className='flex-shrink-0 w-32'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider text-red-600`}>
							<IconCalendar className='w-3 h-3 text-primary' />
							Time
						</label>
						<Combobox
							value={filters.timeWeekly}
							onValueChange={(value) => updateFilter('timeWeekly', value as any)}
							options={filterOptions.timeOptions}
							showSearch={false}
							placeholder="Period..."
						/>
					</div>

					{/* Shipped Date */}
					<div className='flex-shrink-0 w-48'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider text-red-600`}>
							<IconCalendar className='w-3 h-3 text-success' />
							Shipped Date
						</label>
						<DateRangeCombobox
							value={filters.shippedDate}
							onValueChange={(value) => updateFilter('shippedDate', value)}
							placeholder="Select date range..."
							title="SHIPPED DATE"
							allowClear={false}
						/>
					</div>

					{/* Warehouse - Multi-select */}
					<div className='flex-shrink-0 w-52'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider ${
							filters.warehouse.length > 0 ? 'text-red-600' : 'text-font-color'
						}`}>
							<IconBox className='w-3 h-3 text-warning' />
							Warehouse
						</label>
						<MultiSelectCombobox
							value={filters.warehouse}
							onValueChange={(value) => updateFilter('warehouse', value)}
							options={filterOptions.warehouseOptions.filter(opt => opt.value !== '')} // Remove "All" option for multi-select
							showSearch={true}
							placeholder="Select warehouses..."
							title="WAREHOUSE"
						/>
					</div>

					{/* Account - Multi-select */}
					<div className='flex-shrink-0 w-52'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider ${
							filters.account.length > 0 ? 'text-red-600' : 'text-font-color'
						}`}>
							<IconShoppingCart className='w-3 h-3 text-info' />
							Account
						</label>
						<MultiSelectCombobox
							value={filters.account}
							onValueChange={(value) => updateFilter('account', value)}
							options={filterOptions.accountOptions.filter(opt => opt.value !== '')} // Remove "All" option for multi-select
							showSearch={true}
							placeholder="Select accounts..."
							title="ACCOUNT"
						/>
					</div>

					{/* Destination */}
					<div className='flex-shrink-0 w-36'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider ${
							filters.destination ? 'text-red-600' : 'text-font-color'
						}`}>
							<IconTrendingUp className='w-3 h-3 text-primary' />
							Destination
						</label>
						<Combobox
							value={filters.destination}
							onValueChange={(value) => updateFilter('destination', value)}
							options={[
								{ value: '', label: 'All Destinations' },
								{ value: '0', label: 'Domestic' },
								{ value: '1', label: 'International' }
							]}
							showSearch={false}
							placeholder="Destination..."
						/>
					</div>

					{/* Channel */}
					<div className='flex-shrink-0 w-48'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider ${
							filters.channel.length > 0 ? 'text-red-600' : 'text-font-color'
						}`}>
							<IconList className='w-3 h-3 text-success' />
							Channel
						</label>
						<MultiSelectCombobox
							value={filters.channel}
							onValueChange={(value) => updateFilter('channel', value)}
							options={filterOptions.channelOptions}
							placeholder="Select channels..."
							title="Channel"
						/>
					</div>

					{/* Country */}
					<div className='flex-shrink-0 w-48'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider ${
							filters.country ? 'text-red-600' : 'text-font-color'
						}`}>
							<IconTrendingUp className='w-3 h-3 text-warning' />
							Country
						</label>
						<Combobox
							value={filters.country}
							onValueChange={(value) => updateFilter('country', value)}
							options={filterOptions.countryOptions}
							showSearch={true}
							placeholder="Country..."
						/>
					</div>

					{/* State - Always show, but conditional options */}
					<div className='flex-shrink-0 w-36'>
						<label className={`flex items-center gap-2 text-[11px] font-bold mb-2 uppercase tracking-wider ${
							filters.state ? 'text-red-600' : 'text-font-color'
						}`}>
							<IconTrendingUp className='w-3 h-3 text-info' />
							State
						</label>
						<Combobox
							value={filters.state}
							onValueChange={(value) => updateFilter('state', value)}
							options={filters.country ? (filterOptions.stateOptions || [{ value: '', label: 'All States' }]) : [{ value: '', label: 'Select country first' }]}
							showSearch={filters.country ? true : false}
							placeholder={filters.country ? "State..." : "Select country first"}
							disabled={!filters.country}
						/>
					</div>
				</div>

				{/* Active Filters Summary */}
				{hasActiveFilters() && (
					<div className='mt-4 pt-4 border-t border-primary-20'>
						<div className='flex items-center gap-2 flex-wrap'>
							<span className='text-[11px] font-bold text-font-color-100 uppercase tracking-wider'>Active Filters:</span>
							{filters.timeWeekly !== 'weekly' && (
								<span className='inline-flex items-center gap-1 px-2 py-1 bg-primary-10 text-primary rounded text-[10px] font-medium'>
									Time: {filterOptions.timeOptions.find(o => o.value === filters.timeWeekly)?.label}
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

				{/* View Toggle */}
				<div className='mt-4 pt-4 border-t border-primary-20'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<span className='text-[11px] font-bold text-font-color-100 uppercase tracking-wider'>View Mode:</span>
							<button
								className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
									viewMode === 'chart'
										? 'bg-primary text-white'
										: 'bg-primary-10 text-primary hover:bg-primary hover:text-white'
								}`}
								onClick={() => setViewMode('chart')}
							>
								<IconChartBar className='w-3 h-3 me-1' />
								Chart View
							</button>
							<button
								className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
									viewMode === 'table'
										? 'bg-primary text-white'
										: 'bg-primary-10 text-primary hover:bg-primary hover:text-white'
								}`}
								onClick={() => setViewMode('table')}
							>
								<IconTable className='w-3 h-3 me-1' />
								Table View
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

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
										<span className='text-[14px] font-bold text-primary'>{stats.totalOrders.toLocaleString()}</span>
									</div>
								</div>
								<ReactApexChart 
									options={chartOptions as any} 
									series={chartSeries as any} 
									type='line' 
									height={400} 
									width='100%' 
								/>
							</div>
						)}

						{/* Data Grid Section - Always Show (Like Legacy) */}
						<div className='overflow-x-auto'>
							<div className='p-4 bg-primary-5 border-b border-border-color'>
								<div className='flex items-center gap-3'>
									<IconTable className='w-5 h-5 text-font-color-100' />
									<h3 className='text-[14px] font-semibold text-font-color'>Data Grid</h3>
									<div className='ml-auto text-[12px] text-font-color-100'>
										{rows.length} {filters.timeWeekly === 'weekly' ? 'weeks' : 'months'} • {stats.totalOrders.toLocaleString()} total orders
									</div>
								</div>
						</div>
							<table className='w-full min-w-[800px]'>
								<thead className='bg-gray-50 dark:bg-gray-800 border-b border-border-color'>
									<tr className='text-left text-font-color text-[12px] font-bold uppercase tracking-wider'>
										<th className='py-3 px-4 w-[60px] text-center'>#</th>
										<th className='py-3 px-4'>
											<div className='flex items-center gap-2'>
												<IconCalendar className='w-4 h-4 text-font-color-100' />
												Time
											</div>
										</th>
										<th className='py-3 px-4 text-right'>
											<div className='flex items-center justify-end gap-2'>
												<IconShoppingCart className='w-4 h-4 text-primary' />
												Orders
											</div>
										</th>
										<th className='py-3 px-4 text-right'>
											<div className='flex items-center justify-end gap-2'>
												<IconList className='w-4 h-4 text-success' />
												Lines
											</div>
										</th>
										<th className='py-3 px-4 text-right'>
											<div className='flex items-center justify-end gap-2'>
												<IconPackage className='w-4 h-4 text-warning' />
												Packages
											</div>
										</th>
										<th className='py-3 px-4 text-right'>
											<div className='flex items-center justify-end gap-2'>
												<IconBox className='w-4 h-4 text-info' />
												Units
											</div>
										</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((r, i) => (
										<tr key={(r.id || r.name || i).toString()} className='border-b border-border-color hover:bg-primary-10 transition-colors'>
											<td className='py-3 px-4 text-center text-font-color-100 text-[12px] font-medium'>{i + 1}</td>
											<td className='py-3 px-4'>
												<div className='font-semibold text-font-color text-[14px]'>{r.name || r.id}</div>
												<div className='text-[11px] text-font-color-100 mt-0.5'>
													{filters.timeWeekly === 'weekly' ? 'Week Period' : 'Month Period'}
												</div>
											</td>
											<td className='py-3 px-4 text-right'>
												<div className='font-semibold text-font-color text-[14px]'>{(r.orders ?? 0).toLocaleString()}</div>
												<div className='text-[11px] text-primary'>
													{rows.length > 1 ? `${(((r.orders ?? 0) / stats.totalOrders) * 100).toFixed(1)}%` : '100%'}
												</div>
											</td>
											<td className='py-3 px-4 text-right'>
												<div className='font-semibold text-font-color text-[14px]'>{(r.lines ?? 0).toLocaleString()}</div>
												<div className='text-[11px] text-success'>
													{rows.length > 1 ? `${(((r.lines ?? 0) / stats.totalLines) * 100).toFixed(1)}%` : '100%'}
												</div>
											</td>
											<td className='py-3 px-4 text-right'>
												<div className='font-semibold text-font-color text-[14px]'>{(r.packages ?? 0).toLocaleString()}</div>
												<div className='text-[11px] text-warning'>
													{rows.length > 1 ? `${(((r.packages ?? 0) / stats.totalPackages) * 100).toFixed(1)}%` : '100%'}
												</div>
											</td>
											<td className='py-3 px-4 text-right'>
												<div className='font-semibold text-font-color text-[14px]'>{(r.units ?? 0).toLocaleString()}</div>
												<div className='text-[11px] text-info'>
													{rows.length > 1 ? `${(((r.units ?? 0) / stats.totalUnits) * 100).toFixed(1)}%` : '100%'}
												</div>
											</td>
										</tr>
									))}
								</tbody>
								{/* Totals Row */}
								<tfoot className='bg-primary-10 border-t-2 border-primary'>
									<tr className='text-font-color font-bold'>
										<td className='py-4 px-4 text-center text-font-color-100 text-[12px]'>∑</td>
										<td className='py-4 px-4'>
											<div className='font-bold text-font-color text-[14px]'>TOTAL</div>
											<div className='text-[11px] text-font-color-100'>All Periods</div>
										</td>
										<td className='py-4 px-4 text-right'>
											<div className='font-bold text-primary text-[16px]'>{stats.totalOrders.toLocaleString()}</div>
											<div className='text-[11px] text-primary'>100%</div>
										</td>
										<td className='py-4 px-4 text-right'>
											<div className='font-bold text-success text-[16px]'>{stats.totalLines.toLocaleString()}</div>
											<div className='text-[11px] text-success'>100%</div>
										</td>
										<td className='py-4 px-4 text-right'>
											<div className='font-bold text-warning text-[16px]'>{stats.totalPackages.toLocaleString()}</div>
											<div className='text-[11px] text-warning'>100%</div>
										</td>
										<td className='py-4 px-4 text-right'>
											<div className='font-bold text-info text-[16px]'>{stats.totalUnits.toLocaleString()}</div>
											<div className='text-[11px] text-info'>100%</div>
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
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