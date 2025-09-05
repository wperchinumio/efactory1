import { useEffect, useMemo, useState } from 'react';
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
	IconSettings,
	IconChevronRight,
	IconChevronLeft,
	IconDots
} from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Combobox from '@/components/ui/Combobox';

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
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(25);

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

	const paginatedData = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredSorted.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredSorted, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(filteredSorted.length / itemsPerPage);

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

	function setSort(field: keyof LicenseSummaryRow) {
		if (field === sortField) {
			setDirection(direction === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setDirection('asc');
		}
		setCurrentPage(1);
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
				const blob = new Blob([this.response], { type: type });
				
				if (typeof window.navigator.msSaveBlob !== 'undefined') {
					window.navigator.msSaveBlob(blob, filename);
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
			{/* Compact Header */}
			<div className='container-fluid mb-4'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4'>
						<div>
							<h1 className='text-[20px]/[28px] font-bold text-font-color mb-1'>
								License Summary
							</h1>
							<p className='text-font-color-100 text-[14px]/[20px]'>
								License usage and billing analysis
							</p>
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-2'>
							<Combobox
								value={`${period.year}-${period.month}`}
								onValueChange={(value) => {
									const [y, m] = value.split('-');
									setPeriod({ month: m, year: y });
								}}
								options={monthOptions().map((opt) => ({
									value: `${opt.year}-${opt.month}`,
									label: `${opt.year}-${opt.month}`
								}))}
								placeholder="Period..."
								icon={IconCalendar}
								className="min-w-[120px]"
								showSearch={false}
							/>
							<button 
								className='btn btn-outline-secondary btn-sm' 
								onClick={load} 
								disabled={loading}
								title='Refresh'
							>
								<IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
							</button>
							<button 
								className='btn btn-primary btn-sm' 
								onClick={onExport} 
								disabled={!loaded}
								title='Export'
							>
								<IconDownload className='w-4 h-4' />
							</button>
						</div>
					</div>

					{/* Compact Metrics */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-4'>
						<div className='bg-card-color border border-border-color rounded-lg p-3'>
							<div className='text-[18px]/[24px] font-bold text-font-color'>{filteredSorted.length}</div>
							<div className='text-[11px]/[14px] text-font-color-100 uppercase tracking-wide'>Customers</div>
						</div>
						<div className='bg-card-color border border-border-color rounded-lg p-3'>
							<div className='text-[18px]/[24px] font-bold text-success'>${formatNumber(totals.total_charge, 0)}</div>
							<div className='text-[11px]/[14px] text-font-color-100 uppercase tracking-wide'>Total Revenue</div>
						</div>
						<div className='bg-card-color border border-border-color rounded-lg p-3'>
							<div className='text-[18px]/[24px] font-bold text-primary'>{totals.total_new_customers}</div>
							<div className='text-[11px]/[14px] text-font-color-100 uppercase tracking-wide'>New Customers</div>
						</div>
						<div className='bg-card-color border border-border-color rounded-lg p-3'>
							<div className='text-[18px]/[24px] font-bold text-warning'>${formatNumber(totals.total_charge / filteredSorted.length, 0)}</div>
							<div className='text-[11px]/[14px] text-font-color-100 uppercase tracking-wide'>Avg Revenue</div>
						</div>
					</div>

					{/* Search */}
					<div className='flex items-center gap-3 mb-4'>
						<div className='relative flex-1 max-w-md'>
							<IconSearch className='w-4 h-4 text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
							<input 
								className='form-control pl-10 pr-3 py-2 text-[13px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors' 
								placeholder='Search customers...' 
								value={filter} 
								onChange={(e) => setFilter(e.target.value)} 
							/>
						</div>
						<div className='text-[12px]/[16px] text-font-color-100'>
							{filteredSorted.length} of {rows.length} customers
						</div>
					</div>
				</div>
			</div>

			{/* Compact Data Table */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='bg-card-color border border-border-color rounded-lg overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='w-full min-w-[1000px]'>
								<thead className='bg-body-color border-b border-border-color'>
									<tr>
										<th className='px-3 py-2 text-left'>
											<button
												className='flex items-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color'
												onClick={() => setSort('policy_code')}
											>
												Customer
												{sortField === 'policy_code' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('total_charge')}
											>
												Total
												{sortField === 'total_charge' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('basic_charge')}
											>
												Basic
												{sortField === 'basic_charge' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('standard_charge')}
											>
												Standard
												{sortField === 'standard_charge' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('returntrak_charge')}
											>
												ReturnTrak
												{sortField === 'returntrak_charge' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('basic_nocharge_eom')}
											>
												Basic EOM
												{sortField === 'basic_nocharge_eom' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('standard_nocharge_eom')}
											>
												STD EOM
												{sortField === 'standard_nocharge_eom' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<button
												className='flex items-center justify-center gap-1 text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
												onClick={() => setSort('returntrak_nocharge_eom')}
											>
												RT EOM
												{sortField === 'returntrak_nocharge_eom' && (
													direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
												)}
											</button>
										</th>
										<th className='px-2 py-2 text-center'>
											<span className='text-[11px]/[14px] font-semibold text-font-color-100 uppercase tracking-wider'>Actions</span>
										</th>
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr>
											<td colSpan={9} className='px-4 py-8 text-center text-font-color-100'>
												<div className='flex items-center justify-center gap-2'>
													<IconRefresh className='w-4 h-4 animate-spin' />
													Loading license data...
												</div>
											</td>
										</tr>
									) : paginatedData.length === 0 ? (
										<tr>
											<td colSpan={9} className='px-4 py-8 text-center text-font-color-100'>
												{filter ? 'No customers match your search criteria' : 'No license data available for this period'}
											</td>
										</tr>
									) : (
										paginatedData.map((r, index) => (
											<tr key={r.row_id} className={`border-b border-border-color hover:bg-primary-10 transition-colors ${r.is_new ? 'bg-success-5' : ''}`}>
												{/* Customer */}
												<td className='px-3 py-2'>
													<div className='flex items-center gap-2'>
														<div className='font-semibold text-font-color text-[13px]/[16px]'>{r.policy_code}</div>
														{r.is_new && (
															<span className='bg-success text-white text-[9px]/[11px] px-1.5 py-0.5 rounded-full font-medium'>NEW</span>
														)}
													</div>
												</td>
												{/* Total */}
												<td className='px-2 py-2 text-center text-[13px]/[16px] font-bold text-font-color font-mono'>${formatNumber(r.total_charge, 2)}</td>
												{/* Basic */}
												<td className='px-2 py-2 text-center text-[12px]/[15px] text-font-color font-mono'>${formatNumber(r.basic_charge, 2)}</td>
												{/* Standard */}
												<td className='px-2 py-2 text-center text-[12px]/[15px] text-font-color font-mono'>${formatNumber(r.standard_charge, 2)}</td>
												{/* ReturnTrak */}
												<td className='px-2 py-2 text-center text-[12px]/[15px] text-font-color font-mono'>${formatNumber(r.returntrak_charge, 2)}</td>
												{/* Basic EOM */}
												<td className='px-2 py-2 text-center text-[12px]/[15px] text-font-color font-mono'>{formatNumber(r.basic_nocharge_eom)}</td>
												{/* STD EOM */}
												<td className='px-2 py-2 text-center text-[12px]/[15px] text-font-color font-mono'>{formatNumber(r.standard_nocharge_eom)}</td>
												{/* RT EOM */}
												<td className='px-2 py-2 text-center text-[12px]/[15px] text-font-color font-mono'>{formatNumber(r.returntrak_nocharge_eom)}</td>
												{/* Actions */}
												<td className='px-2 py-2 text-center'>
													<button className='text-font-color-100 hover:text-font-color transition-colors'>
														<IconDots className='w-4 h-4' />
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='flex items-center justify-between mt-4'>
							<div className='text-[12px]/[16px] text-font-color-100'>
								Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSorted.length)} of {filteredSorted.length} customers
							</div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									className='btn btn-outline-secondary btn-sm disabled:opacity-50'
								>
									<IconChevronLeft className='w-4 h-4' />
								</button>
								
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const page = i + 1;
									return (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											{page}
										</button>
									);
								})}
								
								<button
									onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
									disabled={currentPage === totalPages}
									className='btn btn-outline-secondary btn-sm disabled:opacity-50'
								>
									<IconChevronRight className='w-4 h-4' />
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function LicenseSummaryPage() {
	return <LicenseSummaryPageInner />;
}

export default dynamic(() => Promise.resolve(LicenseSummaryPage), { ssr: false });
