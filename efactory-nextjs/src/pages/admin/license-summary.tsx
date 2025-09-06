import { useEffect, useMemo, useState, useRef } from 'react';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { 
	IconSearch, 
	IconRefresh, 
	IconDownload, 
	IconCalendar, 
	IconUsers, 
	IconCurrencyDollar, 
	IconTrendingUp, 
	IconChevronUp, 
	IconChevronDown,
	IconBuilding,
	IconChartBar,
	IconTable,
	IconFilter,
	IconSortAscending,
	IconSortDescending,
	IconDatabase,
	IconActivity,
	IconTarget,
	IconTrendingDown,
	IconEye,
	IconSettings
} from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Combobox from '@/components/ui/Combobox';
import Button from '@/components/ui/Button';

interface LicenseSummaryRow {
	row_id?: number;
	policy_code: string;
	customer_name?: string;
	basic_nocharge_eom: number;
	basic_now_max: number;
	basic_rate_eom: number;
	standard_nocharge_eom: number;
	standard_now_max: number;
	standard_rate_eom: number;
	returntrak_nocharge_eom: number;
	returntrak_now_max: number;
	returntrak_rate_eom: number;
	basic_charge: number;
	standard_charge: number;
	returntrak_charge: number;
	total_charge: number;
	is_new?: boolean;
}

type SortDirection = 'asc' | 'desc';
type MonthYear = { month: string; year: string };

function getPrevMonthYear(): MonthYear {
	const d = new Date();
	d.setMonth(d.getMonth() - 1);
	return {
		month: `${(d.getMonth() + 1).toString().padStart(2, '0')}`,
		year: `${d.getFullYear()}`,
	};
}

function formatNumber(value: number, fractionDigits = 0): string {
	return new Intl.NumberFormat(undefined, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	}).format(Number.isFinite(value) ? value : 0);
}

function LicenseSummaryPageInner() {
	const defaultPeriod = getPrevMonthYear();
	const [period, setPeriod] = useState<MonthYear>(defaultPeriod);
	const [rows, setRows] = useState<LicenseSummaryRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [filter, setFilter] = useState('');
	const [sortField, setSortField] = useState<keyof LicenseSummaryRow>('policy_code');
	const [direction, setDirection] = useState<SortDirection>('asc');
	const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
	const searchInputRef = useRef<HTMLInputElement>(null);

	async function load() {
		setLoading(true);
		try {
			const res = await postJson<{ rows: LicenseSummaryRow[]; date?: string }>(
				'/api/account',
				{ resource: 'efactory_license_summary', action: 'read', month: period.month, year: period.year },
			);
			const dataRows = (res.data?.rows as LicenseSummaryRow[]) || [];
			setRows(dataRows.map((r, i) => ({ ...r, row_id: i + 1 })));
			setLoaded(true);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, [period.month, period.year]);

	// Auto-focus search input on page load and data refresh
	useEffect(() => {
		if (loaded && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [loaded]);

	const filteredSorted = useMemo(() => {
		const q = filter.trim().toLowerCase();
		let list = rows;
		if (q) {
			list = list.filter((r) => {
				const policy = (r.policy_code || '').toLowerCase();
				const name = (r.customer_name || '').toLowerCase();
				return policy.includes(q) || name.includes(q);
			});
		}
		const sorted = [...list].sort((a, b) => {
			let av: string | number = a[sortField] as any;
			let bv: string | number = b[sortField] as any;
			if (sortField === 'policy_code' || sortField === 'customer_name') {
				av = String(av ?? '').toLowerCase();
				bv = String(bv ?? '').toLowerCase();
				return av < bv ? -1 : av > bv ? 1 : 0;
			}
			const an = Number(av || 0);
			const bn = Number(bv || 0);
			return an - bn;
		});
		if (direction === 'desc') sorted.reverse();
		return sorted.map((r, i) => ({ ...r, row_id: i + 1 }));
	}, [rows, filter, sortField, direction]);

	const totals = useMemo(() => {
		return filteredSorted.reduce(
			(acc, r) => {
				acc.total_charge += Number(r.total_charge || 0);
				acc.total_new_customers += r.is_new ? 1 : 0;
				acc.basic_charge += Number(r.basic_charge || 0);
				acc.standard_charge += Number(r.standard_charge || 0);
				acc.returntrak_charge += Number(r.returntrak_charge || 0);
				return acc;
			},
			{ total_charge: 0, total_new_customers: 0, basic_charge: 0, standard_charge: 0, returntrak_charge: 0 },
		);
	}, [filteredSorted]);

	// Calculate additional metrics
	const avgRevenue = filteredSorted.length > 0 ? totals.total_charge / filteredSorted.length : 0;
	const topCustomers = [...filteredSorted]
		.sort((a, b) => b.total_charge - a.total_charge)
		.slice(0, 5);

	function setSort(field: keyof LicenseSummaryRow) {
		if (field === sortField) {
			setDirection(direction === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setDirection('asc');
		}
	}

	function monthOptions(): MonthYear[] {
		const opts: MonthYear[] = [];
		const now = new Date();
		for (let i = 1; i <= 12; i += 1) {
			const d = new Date(now);
			d.setMonth(d.getMonth() - i);
			opts.push({ month: `${(d.getMonth() + 1).toString().padStart(2, '0')}`, year: `${d.getFullYear()}` });
		}
		return opts;
	}

	function onExport() {
		const xhr = new XMLHttpRequest();
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
		const url = `${apiBaseUrl}/api/account`;
		
		xhr.open('GET', url, true);
		const token = getAuthToken()?.api_token || '';
		xhr.setRequestHeader("X-Access-Token", token);
		
		const headerParams = JSON.stringify({
			action: 'export',
			resource: 'efactory_license_summary',
			month: period.month,
			year: period.year
		});
		xhr.setRequestHeader("X-Download-Params", headerParams);
		xhr.responseType = 'arraybuffer';
		
		xhr.onload = function () {
			if (this.status === 200) {
				let filename = "";
				const disposition = xhr.getResponseHeader('Content-Disposition');
				if (disposition && disposition.indexOf('attachment') !== -1) {
					const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
					const matches = filenameRegex.exec(disposition);
					if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
				}
				
				const type = xhr.getResponseHeader('Content-Type');
				const blob = new Blob([this.response], { type: type || 'application/octet-stream' });
				
				if (typeof (window.navigator as any).msSaveBlob !== 'undefined') {
					(window.navigator as any).msSaveBlob(blob, filename);
				} else {
					const URL = window.URL || window.webkitURL;
					const downloadUrl = URL.createObjectURL(blob);
					
					if (filename) {
						const a = document.createElement("a");
						if (typeof a.download === 'undefined') {
							window.location.href = downloadUrl;
						} else {
							a.href = downloadUrl;
							a.download = filename;
							document.body.appendChild(a);
							a.click();
						}
					} else {
						window.location.href = downloadUrl;
					}
					setTimeout(() => { URL.revokeObjectURL(downloadUrl); }, 100);
				}
			} else {
				alert('Export failed. Please try again.');
			}
		};
		
		xhr.onerror = function() {
			alert('Export request failed. Please try again.');
		};
		
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send();
	}

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{/* Dashboard Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6'>
						<div>
							<h1 className='text-[24px]/[32px] font-bold text-font-color mb-2'>
								License Summary Dashboard
							</h1>
							<p className='text-font-color-100 text-[16px]/[24px]'>
								Comprehensive license usage and billing analysis across all customers
							</p>
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-3'>
						<Button
							onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
							disabled={false}
						>
								{viewMode === 'table' ? <IconChartBar className='w-4 h-4' /> : <IconTable className='w-4 h-4' />}
								{viewMode === 'table' ? 'Grid View' : 'Table View'}
							</Button>
							<button 
								className='btn btn-primary' 
								onClick={onExport} 
								disabled={!loaded}
							>
								<IconDownload className='w-4 h-4' />
								Export
							</button>
							<button 
								className='btn btn-secondary' 
								onClick={load} 
								disabled={loading}
							>
								<IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								{loading ? 'Refreshing...' : 'Refresh'}
							</button>
						</div>
					</div>

					{/* Period Selector */}
					<div className='card bg-card-color rounded-xl p-4 border border-dashed border-border-color mb-6'>
						<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
							<div className='flex items-center gap-4'>
								<div className='flex items-center gap-2'>
									<IconCalendar className='w-5 h-5 text-primary' />
									<span className='text-[14px]/[20px] font-semibold text-font-color'>Period:</span>
								</div>
								<Combobox
									value={`${period.year}-${period.month}`}
					onValueChange={(value: any) => {
						const [y, m] = value.split('-');
						setPeriod({ month: m, year: y });
					}}
					options={monthOptions().map((opt) => ({
						value: `${opt.year}-${opt.month}`,
						label: `${opt.year} - ${opt.month}`
					})) as any}
					placeholder="Select period..."
					className="min-w-[160px]"
									showSearch={false}
								/>
							</div>
							<div className='text-[14px]/[20px] text-font-color-100'>
								Showing {filteredSorted.length} of {rows.length} customers
							</div>
						</div>
					</div>

					{/* Metrics Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
						{/* Total Customers */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-6 border border-primary'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{filteredSorted.length}</div>
									<div className='text-[14px]/[20px] text-white/80'>Total Customers</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{totals.total_new_customers} new this period
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconUsers className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Total Revenue */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-6 border border-success'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>${formatNumber(totals.total_charge, 2)}</div>
									<div className='text-[14px]/[20px] text-white/80'>Total Revenue</div>
									<div className='text-[12px]/[16px] text-white/60'>
										${formatNumber(avgRevenue, 2)} avg per customer
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconCurrencyDollar className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Basic Revenue */}
						<div className='card bg-gradient-to-br from-info to-info-10 rounded-xl p-6 border border-info'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>${formatNumber(totals.basic_charge, 2)}</div>
									<div className='text-[14px]/[20px] text-white/80'>Basic Revenue</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{((totals.basic_charge / totals.total_charge) * 100).toFixed(1)}% of total
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBuilding className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Standard Revenue */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-6 border border-warning'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>${formatNumber(totals.standard_charge, 2)}</div>
									<div className='text-[14px]/[20px] text-white/80'>Standard Revenue</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{((totals.standard_charge / totals.total_charge) * 100).toFixed(1)}% of total
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconTrendingUp className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Analytics Row */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
						{/* Top Customers */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-primary-10 rounded-lg flex items-center justify-center'>
									<IconTarget className='w-[16px] h-[16px] text-primary' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Top Revenue Customers</h3>
							</div>
							<div className='space-y-3'>
								{topCustomers.map((customer, index) => (
									<div key={customer.policy_code} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-primary text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<div className='min-w-0'>
												<div className='text-[14px]/[18px] text-font-color font-medium truncate'>{customer.policy_code}</div>
												{customer.is_new && (
													<span className='text-[10px]/[12px] text-success font-medium'>NEW</span>
												)}
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-primary-10 rounded-full h-2'>
												<div 
													className='bg-primary h-2 rounded-full' 
													style={{ width: `${(customer.total_charge / (topCustomers[0]?.total_charge || 1)) * 100}%` }}
												/>
											</div>
											<span className='text-[12px]/[16px] text-font-color-100 font-mono'>${formatNumber(customer.total_charge, 2)}</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Revenue Breakdown */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-success-10 rounded-lg flex items-center justify-center'>
									<IconChartBar className='w-[16px] h-[16px] text-success' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Revenue Breakdown</h3>
							</div>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-primary rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>Basic</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>${formatNumber(totals.basic_charge, 2)}</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-success rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>Standard</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>${formatNumber(totals.standard_charge, 2)}</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-warning rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>ReturnTrak</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>${formatNumber(totals.returntrak_charge, 2)}</div>
								</div>
								<div className='border-t border-border-color pt-3'>
									<div className='flex items-center justify-between'>
										<span className='text-[16px]/[20px] text-font-color font-bold'>Total</span>
										<span className='text-[16px]/[20px] text-font-color font-bold'>${formatNumber(totals.total_charge, 2)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Search and Controls */}
					<div className='card bg-card-color rounded-xl p-4 border border-dashed border-border-color mb-6'>
						<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
							<div className='flex items-center gap-4 flex-1'>
								<div className='relative flex-1 max-w-md'>
									<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
									<input 
										ref={searchInputRef}
										className='form-control pl-9 pr-3 py-2 text-[14px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors' 
										placeholder='Search customers...' 
										value={filter} 
										onChange={(e) => setFilter(e.target.value)} 
									/>
								</div>
								{filter && (
									<button
										className='text-[12px]/[16px] text-font-color-100 hover:text-font-color transition-colors'
										onClick={() => setFilter('')}
									>
										Clear filter
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Data Display */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					{/* Sort Controls for Grid View */}
					{viewMode === 'grid' && (
						<div className='bg-card-color border border-border-color rounded-lg p-4 mb-6'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-4'>
									<span className='text-[14px]/[20px] font-semibold text-font-color'>Sort by:</span>
									<div className='flex items-center gap-2'>
										<button
											onClick={() => setSort('policy_code')}
											className={`btn btn-sm ${sortField === 'policy_code' ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											Customer
											{sortField === 'policy_code' && (
												direction === 'asc' ? <IconChevronUp className='w-3 h-3 ml-1' /> : <IconChevronDown className='w-3 h-3 ml-1' />
											)}
										</button>
										<button
											onClick={() => setSort('total_charge')}
											className={`btn btn-sm ${sortField === 'total_charge' ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											Total Revenue
											{sortField === 'total_charge' && (
												direction === 'asc' ? <IconChevronUp className='w-3 h-3 ml-1' /> : <IconChevronDown className='w-3 h-3 ml-1' />
											)}
										</button>
										<button
											onClick={() => setSort('basic_charge')}
											className={`btn btn-sm ${sortField === 'basic_charge' ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											Basic Revenue
											{sortField === 'basic_charge' && (
												direction === 'asc' ? <IconChevronUp className='w-3 h-3 ml-1' /> : <IconChevronDown className='w-3 h-3 ml-1' />
											)}
										</button>
										<button
											onClick={() => setSort('standard_charge')}
											className={`btn btn-sm ${sortField === 'standard_charge' ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											Standard Revenue
											{sortField === 'standard_charge' && (
												direction === 'asc' ? <IconChevronUp className='w-3 h-3 ml-1' /> : <IconChevronDown className='w-3 h-3 ml-1' />
											)}
										</button>
									</div>
								</div>
								<div className='text-[12px]/[16px] text-font-color-100'>
									{filteredSorted.length} customers
								</div>
							</div>
						</div>
					)}

					{viewMode === 'table' ? (
						<div className='bg-card-color border border-border-color rounded-xl overflow-hidden'>
							<div className='overflow-x-auto'>
								<table className='w-full min-w-[1200px]'>
									<thead className='bg-body-color border-b border-border-color'>
										{/* Section Headers Row */}
										<tr>
											<th rowSpan={2} className='px-4 py-3 text-left border-r border-border-color'>
																									<button
														className='flex items-center gap-2 text-[12px]/[16px] font-bold text-primary uppercase tracking-wider hover:text-primary-80 w-full'
														onClick={() => setSort('policy_code')}
													>
														Customer
														{sortField === 'policy_code' && (
															direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
														)}
													</button>
											</th>
											<th rowSpan={2} className='px-3 py-3 text-center border-r border-border-color bg-primary-10'>
												<button
													className='flex items-center justify-center gap-1 text-[12px]/[16px] font-bold text-primary uppercase tracking-wider hover:text-primary-80 w-full'
													onClick={() => setSort('total_charge')}
												>
													Total CHG
													{sortField === 'total_charge' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th colSpan={3} className='px-4 py-2 text-center bg-primary-5 border-r border-border-color'>
												<div className='text-[11px]/[14px] font-bold text-font-color uppercase tracking-wider'>Basic</div>
											</th>
											<th colSpan={3} className='px-4 py-2 text-center bg-success-5 border-r border-border-color'>
												<div className='text-[11px]/[14px] font-bold text-font-color uppercase tracking-wider'>Standard</div>
											</th>
											<th colSpan={3} className='px-4 py-2 text-center bg-warning-5 border-r border-border-color'>
												<div className='text-[11px]/[14px] font-bold text-font-color uppercase tracking-wider'>ReturnTrak</div>
											</th>
											<th colSpan={3} className='px-4 py-2 text-center bg-info-5'>
												<div className='text-[11px]/[14px] font-bold text-font-color uppercase tracking-wider'>Summary Charges</div>
											</th>
										</tr>
										{/* Column Headers Row */}
										<tr>
											{/* Basic Columns */}
											<th className='px-2 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('basic_nocharge_eom')}
												>
													No Chg EOM
													{sortField === 'basic_nocharge_eom' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-2 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('basic_now_max')}
												>
													Now
													{sortField === 'basic_now_max' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-2 py-2 text-center border-r border-border-color'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('basic_rate_eom')}
												>
													Rate EOM
													{sortField === 'basic_rate_eom' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											{/* Standard Columns */}
											<th className='px-2 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('standard_nocharge_eom')}
												>
													No Chg EOM
													{sortField === 'standard_nocharge_eom' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-2 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('standard_now_max')}
												>
													Now
													{sortField === 'standard_now_max' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-2 py-2 text-center border-r border-border-color'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('standard_rate_eom')}
												>
													Rate EOM
													{sortField === 'standard_rate_eom' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											{/* ReturnTrak Columns */}
											<th className='px-2 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('returntrak_nocharge_eom')}
												>
													No Chg EOM
													{sortField === 'returntrak_nocharge_eom' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-2 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('returntrak_now_max')}
												>
													Now
													{sortField === 'returntrak_now_max' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-2 py-2 text-center border-r border-border-color'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-medium text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('returntrak_rate_eom')}
												>
													Rate EOM
													{sortField === 'returntrak_rate_eom' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											{/* Summary Charge Columns */}
											<th className='px-3 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-bold text-font-color uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('basic_charge')}
												>
													Basic CHG
													{sortField === 'basic_charge' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-3 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-bold text-font-color uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('standard_charge')}
												>
													STD CHG
													{sortField === 'standard_charge' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='px-3 py-2 text-center'>
												<button
													className='flex items-center justify-center gap-1 text-[10px]/[12px] font-bold text-font-color uppercase tracking-wider hover:text-font-color w-full'
													onClick={() => setSort('returntrak_charge')}
												>
													RT CHG
													{sortField === 'returntrak_charge' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<tr>
												<td colSpan={13} className='px-4 py-8 text-center text-font-color-100'>
													<div className='flex items-center justify-center gap-2'>
														<IconRefresh className='w-4 h-4 animate-spin' />
														Loading license data...
													</div>
												</td>
											</tr>
										) : filteredSorted.length === 0 ? (
											<tr>
												<td colSpan={13} className='px-4 py-8 text-center text-font-color-100'>
													{filter ? 'No customers match your search criteria' : 'No license data available for this period'}
												</td>
											</tr>
										) : (
											filteredSorted.map((r, index) => (
												<tr key={r.row_id} className={`border-b border-border-color hover:bg-primary-10 transition-colors ${r.is_new ? 'bg-success-5' : ''}`}>
													{/* Customer */}
													<td className='px-4 py-3 border-r border-border-color'>
														<div className='flex items-center gap-2'>
															<div className='font-bold text-primary text-[14px]/[18px]'>{r.policy_code}</div>
															{r.is_new && (
																<span className='bg-success text-white text-[10px]/[12px] px-2 py-1 rounded-full font-medium'>NEW</span>
															)}
														</div>
													</td>
													{/* Total CHG Column */}
													<td className='px-3 py-3 text-center text-[16px]/[20px] font-bold text-primary border-r border-border-color bg-primary-10'>${formatNumber(r.total_charge, 2)}</td>
													{/* Basic Columns */}
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono'>{formatNumber(r.basic_nocharge_eom)}</td>
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono'>{formatNumber(r.basic_now_max)}</td>
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono border-r border-border-color'>{formatNumber(r.basic_rate_eom, 2)}</td>
													{/* Standard Columns */}
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono'>{formatNumber(r.standard_nocharge_eom)}</td>
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono'>{formatNumber(r.standard_now_max)}</td>
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono border-r border-border-color'>{formatNumber(r.standard_rate_eom, 2)}</td>
													{/* ReturnTrak Columns */}
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono'>{formatNumber(r.returntrak_nocharge_eom)}</td>
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono'>{formatNumber(r.returntrak_now_max)}</td>
													<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color font-mono border-r border-border-color'>{formatNumber(r.returntrak_rate_eom, 2)}</td>
													{/* Summary Charge Columns */}
													<td className='px-3 py-3 text-center text-[14px]/[20px] font-bold text-font-color font-mono'>${formatNumber(r.basic_charge, 2)}</td>
													<td className='px-3 py-3 text-center text-[14px]/[20px] font-bold text-font-color font-mono'>${formatNumber(r.standard_charge, 2)}</td>
													<td className='px-3 py-3 text-center text-[14px]/[20px] font-bold text-font-color font-mono'>${formatNumber(r.returntrak_charge, 2)}</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
							{filteredSorted.map((customer) => (
								<CustomerCard key={customer.row_id} customer={customer} />
							))}
						</div>
					)}

					{/* Empty State */}
					{filteredSorted.length === 0 && !loading && (
						<div className='text-center py-16'>
							<div className='w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-primary-10 flex items-center justify-center'>
								<IconUsers className='w-[40px] h-[40px] text-primary' />
							</div>
							<h3 className='text-[24px]/[30px] font-semibold mb-3'>
								{filter ? 'No customers found' : 'No license data available'}
							</h3>
							<p className='text-font-color-100 text-[16px]/[24px] max-w-md mx-auto'>
								{filter ? 'Try adjusting your search terms or clear the filter.' : 'No license data available for this period.'}
							</p>
							{filter && (
								<button 
									onClick={() => setFilter('')}
									className='btn btn-outline-primary mt-4'
								>
									Clear Search
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function CustomerCard({ customer }: { customer: LicenseSummaryRow }) {
	return (
		<div className='card bg-card-color rounded-lg p-4 border transition-all duration-200 hover:shadow-shadow-lg border-dashed border-border-color'>
			{/* Header */}
			<div className='flex items-center justify-between mb-3'>
				<div className='text-[16px]/[20px] font-bold text-font-color'>
					{customer.policy_code}
				</div>
				{customer.is_new && (
					<span className='bg-success text-white text-[10px]/[12px] px-2 py-1 rounded-full font-medium'>NEW</span>
				)}
			</div>

			{/* Revenue */}
			<div className='mb-3'>
				<div className='text-[20px]/[24px] font-bold text-primary mb-1'>
					${formatNumber(customer.total_charge, 2)}
				</div>
				<div className='text-[12px]/[16px] text-font-color-100'>Total Revenue</div>
			</div>

			{/* Breakdown */}
			<div className='space-y-2'>
				<div className='flex justify-between items-center'>
					<span className='text-[12px]/[16px] text-font-color-100'>Basic</span>
					<span className='text-[12px]/[16px] text-font-color font-mono'>${formatNumber(customer.basic_charge, 2)}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-[12px]/[16px] text-font-color-100'>Standard</span>
					<span className='text-[12px]/[16px] text-font-color font-mono'>${formatNumber(customer.standard_charge, 2)}</span>
				</div>
				<div className='flex justify-between items-center'>
					<span className='text-[12px]/[16px] text-font-color-100'>ReturnTrak</span>
					<span className='text-[12px]/[16px] text-font-color font-mono'>${formatNumber(customer.returntrak_charge, 2)}</span>
				</div>
			</div>
		</div>
	);
}

function LicenseSummaryPage() {
	return <LicenseSummaryPageInner />;
}

export default dynamic(() => Promise.resolve(LicenseSummaryPage), { ssr: false });
