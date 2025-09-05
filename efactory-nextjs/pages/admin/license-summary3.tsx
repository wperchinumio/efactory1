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
	IconDots,
	IconX,
	IconInfoCircle,
	IconChartLine,
	IconShield,
	IconClock
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
	const [selectedCustomer, setSelectedCustomer] = useState<LicenseSummaryRow | null>(null);
	const [showDetailPanel, setShowDetailPanel] = useState(false);

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

	function handleCustomerSelect(customer: LicenseSummaryRow) {
		setSelectedCustomer(customer);
		setShowDetailPanel(true);
	}

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{/* Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4'>
						<div>
							<h1 className='text-[24px]/[32px] font-bold text-font-color mb-2'>
								License Summary - Master Detail
							</h1>
							<p className='text-font-color-100 text-[16px]/[24px]'>
								Detailed license analysis with customer insights
							</p>
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-3'>
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
								className="min-w-[140px]"
								showSearch={false}
							/>
							<button 
								className='btn btn-outline-secondary' 
								onClick={load} 
								disabled={loading}
							>
								<IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
								{loading ? 'Refreshing...' : 'Refresh'}
							</button>
							<button 
								className='btn btn-primary' 
								onClick={onExport} 
								disabled={!loaded}
							>
								<IconDownload className='w-4 h-4' />
								Export
							</button>
						</div>
					</div>

					{/* Summary Cards */}
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
						<div className='bg-card-color border border-border-color rounded-lg p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[30px] font-bold text-font-color'>{filteredSorted.length}</div>
									<div className='text-[12px]/[16px] text-font-color-100 uppercase tracking-wide'>Total Customers</div>
								</div>
								<IconUsers className='w-8 h-8 text-primary' />
							</div>
						</div>
						<div className='bg-card-color border border-border-color rounded-lg p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[30px] font-bold text-success'>${formatNumber(totals.total_charge, 0)}</div>
									<div className='text-[12px]/[16px] text-font-color-100 uppercase tracking-wide'>Total Revenue</div>
								</div>
								<IconCurrencyDollar className='w-8 h-8 text-success' />
							</div>
						</div>
						<div className='bg-card-color border border-border-color rounded-lg p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[30px] font-bold text-primary'>{totals.total_new_customers}</div>
									<div className='text-[12px]/[16px] text-font-color-100 uppercase tracking-wide'>New Customers</div>
								</div>
								<IconTrendingUp className='w-8 h-8 text-primary' />
							</div>
						</div>
						<div className='bg-card-color border border-border-color rounded-lg p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[30px] font-bold text-warning'>${formatNumber(totals.total_charge / filteredSorted.length, 0)}</div>
									<div className='text-[12px]/[16px] text-font-color-100 uppercase tracking-wide'>Avg Revenue</div>
								</div>
								<IconChartBar className='w-8 h-8 text-warning' />
							</div>
						</div>
					</div>

					{/* Search */}
					<div className='flex items-center gap-3 mb-4'>
						<div className='relative flex-1 max-w-md'>
							<IconSearch className='w-4 h-4 text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
							<input 
								className='form-control pl-10 pr-3 py-2 text-[14px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors' 
								placeholder='Search customers...' 
								value={filter} 
								onChange={(e) => setFilter(e.target.value)} 
							/>
						</div>
						<div className='text-[14px]/[20px] text-font-color-100'>
							{filteredSorted.length} customers found
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						{/* Master List */}
						<div className='lg:col-span-2'>
							<div className='bg-card-color border border-border-color rounded-lg overflow-hidden'>
								<div className='p-4 border-b border-border-color'>
									<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Customer List</h3>
								</div>
								<div className='overflow-x-auto'>
									<table className='w-full'>
										<thead className='bg-body-color border-b border-border-color'>
											<tr>
												<th className='px-4 py-3 text-left'>
													<button
														className='flex items-center gap-2 text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color'
														onClick={() => setSort('policy_code')}
													>
														Customer
														{sortField === 'policy_code' && (
															direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
														)}
													</button>
												</th>
												<th className='px-3 py-3 text-center'>
													<button
														className='flex items-center justify-center gap-1 text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
														onClick={() => setSort('total_charge')}
													>
														Total Revenue
														{sortField === 'total_charge' && (
															direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
														)}
													</button>
												</th>
												<th className='px-3 py-3 text-center'>
													<button
														className='flex items-center justify-center gap-1 text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
														onClick={() => setSort('basic_charge')}
													>
														Basic
														{sortField === 'basic_charge' && (
															direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
														)}
													</button>
												</th>
												<th className='px-3 py-3 text-center'>
													<button
														className='flex items-center justify-center gap-1 text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
														onClick={() => setSort('standard_charge')}
													>
														Standard
														{sortField === 'standard_charge' && (
															direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
														)}
													</button>
												</th>
												<th className='px-3 py-3 text-center'>
													<button
														className='flex items-center justify-center gap-1 text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider hover:text-font-color w-full'
														onClick={() => setSort('returntrak_charge')}
													>
														ReturnTrak
														{sortField === 'returntrak_charge' && (
															direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
														)}
													</button>
												</th>
												<th className='px-3 py-3 text-center'>
													<span className='text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider'>Actions</span>
												</th>
											</tr>
										</thead>
										<tbody>
											{loading ? (
												<tr>
													<td colSpan={6} className='px-4 py-8 text-center text-font-color-100'>
														<div className='flex items-center justify-center gap-2'>
															<IconRefresh className='w-4 h-4 animate-spin' />
															Loading license data...
														</div>
													</td>
												</tr>
											) : filteredSorted.length === 0 ? (
												<tr>
													<td colSpan={6} className='px-4 py-8 text-center text-font-color-100'>
														{filter ? 'No customers match your search criteria' : 'No license data available for this period'}
													</td>
												</tr>
											) : (
												filteredSorted.map((r, index) => (
													<tr 
														key={r.row_id} 
														className={`border-b border-border-color hover:bg-primary-10 transition-colors cursor-pointer ${selectedCustomer?.row_id === r.row_id ? 'bg-primary-10' : ''} ${r.is_new ? 'bg-success-5' : ''}`}
														onClick={() => handleCustomerSelect(r)}
													>
														{/* Customer */}
														<td className='px-4 py-3'>
															<div className='flex items-center gap-2'>
																<div className='font-semibold text-font-color text-[14px]/[18px]'>{r.policy_code}</div>
																{r.is_new && (
																	<span className='bg-success text-white text-[10px]/[12px] px-2 py-1 rounded-full font-medium'>NEW</span>
																)}
															</div>
														</td>
														{/* Total Revenue */}
														<td className='px-3 py-3 text-center text-[14px]/[18px] font-bold text-font-color font-mono'>${formatNumber(r.total_charge, 2)}</td>
														{/* Basic */}
														<td className='px-3 py-3 text-center text-[13px]/[16px] text-font-color font-mono'>${formatNumber(r.basic_charge, 2)}</td>
														{/* Standard */}
														<td className='px-3 py-3 text-center text-[13px]/[16px] text-font-color font-mono'>${formatNumber(r.standard_charge, 2)}</td>
														{/* ReturnTrak */}
														<td className='px-3 py-3 text-center text-[13px]/[16px] text-font-color font-mono'>${formatNumber(r.returntrak_charge, 2)}</td>
														{/* Actions */}
														<td className='px-3 py-3 text-center'>
															<button 
																className='text-font-color-100 hover:text-font-color transition-colors'
																onClick={(e) => {
																	e.stopPropagation();
																	handleCustomerSelect(r);
																}}
															>
																<IconEye className='w-4 h-4' />
															</button>
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>

						{/* Detail Panel */}
						<div className='lg:col-span-1'>
							{selectedCustomer ? (
								<div className='bg-card-color border border-border-color rounded-lg overflow-hidden'>
									<div className='p-4 border-b border-border-color flex items-center justify-between'>
										<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Customer Details</h3>
										<button
											onClick={() => setShowDetailPanel(false)}
											className='text-font-color-100 hover:text-font-color transition-colors'
										>
											<IconX className='w-4 h-4' />
										</button>
									</div>
									<div className='p-4 space-y-6'>
										{/* Customer Info */}
										<div>
											<div className='flex items-center gap-2 mb-3'>
												<div className='w-[40px] h-[40px] bg-primary-10 rounded-lg flex items-center justify-center'>
													<IconUsers className='w-[20px] h-[20px] text-primary' />
												</div>
												<div>
													<div className='text-[16px]/[20px] font-bold text-font-color'>{selectedCustomer.policy_code}</div>
													{selectedCustomer.is_new && (
														<span className='bg-success text-white text-[10px]/[12px] px-2 py-1 rounded-full font-medium'>NEW CUSTOMER</span>
													)}
												</div>
											</div>
										</div>

										{/* Revenue Summary */}
										<div>
											<h4 className='text-[14px]/[18px] font-semibold text-font-color mb-3'>Revenue Summary</h4>
											<div className='space-y-3'>
												<div className='flex justify-between items-center'>
													<span className='text-[13px]/[16px] text-font-color-100'>Total Revenue</span>
													<span className='text-[16px]/[20px] font-bold text-font-color font-mono'>${formatNumber(selectedCustomer.total_charge, 2)}</span>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-[13px]/[16px] text-font-color-100'>Basic</span>
													<span className='text-[14px]/[18px] text-font-color font-mono'>${formatNumber(selectedCustomer.basic_charge, 2)}</span>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-[13px]/[16px] text-font-color-100'>Standard</span>
													<span className='text-[14px]/[18px] text-font-color font-mono'>${formatNumber(selectedCustomer.standard_charge, 2)}</span>
												</div>
												<div className='flex justify-between items-center'>
													<span className='text-[13px]/[16px] text-font-color-100'>ReturnTrak</span>
													<span className='text-[14px]/[18px] text-font-color font-mono'>${formatNumber(selectedCustomer.returntrak_charge, 2)}</span>
												</div>
											</div>
										</div>

										{/* License Details */}
										<div>
											<h4 className='text-[14px]/[18px] font-semibold text-font-color mb-3'>License Details</h4>
											<div className='space-y-4'>
												{/* Basic License */}
												<div className='bg-primary-5 rounded-lg p-3'>
													<div className='text-[12px]/[16px] font-semibold text-primary mb-2'>Basic License</div>
													<div className='space-y-1'>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>No Charge EOM:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.basic_nocharge_eom)}</span>
														</div>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>Now Max:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.basic_now_max)}</span>
														</div>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>Rate EOM:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.basic_rate_eom, 2)}</span>
														</div>
													</div>
												</div>

												{/* Standard License */}
												<div className='bg-success-5 rounded-lg p-3'>
													<div className='text-[12px]/[16px] font-semibold text-success mb-2'>Standard License</div>
													<div className='space-y-1'>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>No Charge EOM:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.standard_nocharge_eom)}</span>
														</div>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>Now Max:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.standard_now_max)}</span>
														</div>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>Rate EOM:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.standard_rate_eom, 2)}</span>
														</div>
													</div>
												</div>

												{/* ReturnTrak License */}
												<div className='bg-warning-5 rounded-lg p-3'>
													<div className='text-[12px]/[16px] font-semibold text-warning mb-2'>ReturnTrak License</div>
													<div className='space-y-1'>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>No Charge EOM:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.returntrak_nocharge_eom)}</span>
														</div>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>Now Max:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.returntrak_now_max)}</span>
														</div>
														<div className='flex justify-between text-[11px]/[14px]'>
															<span className='text-font-color-100'>Rate EOM:</span>
															<span className='text-font-color font-mono'>{formatNumber(selectedCustomer.returntrak_rate_eom, 2)}</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Actions */}
										<div className='pt-4 border-t border-border-color'>
											<button className='btn btn-primary w-full'>
												<IconSettings className='w-4 h-4' />
												Manage License
											</button>
										</div>
									</div>
								</div>
							) : (
								<div className='bg-card-color border border-border-color rounded-lg p-8 text-center'>
									<div className='w-[60px] h-[60px] mx-auto mb-4 rounded-full bg-primary-10 flex items-center justify-center'>
										<IconInfoCircle className='w-[30px] h-[30px] text-primary' />
									</div>
									<h3 className='text-[16px]/[20px] font-semibold text-font-color mb-2'>Select a Customer</h3>
									<p className='text-[14px]/[18px] text-font-color-100'>
										Click on a customer from the list to view detailed license information
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function LicenseSummaryPage() {
	return <LicenseSummaryPageInner />;
}

export default dynamic(() => Promise.resolve(LicenseSummaryPage), { ssr: false });
