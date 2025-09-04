import { useEffect, useMemo, useState } from 'react';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { IconSearch, IconRefresh, IconDownload, IconCalendar, IconUsers, IconCurrencyDollar, IconTrendingUp, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
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

function buildProxyUrl(path: string): string {
	const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
	return useProxy ? `/api/proxy${path}` : `${base}${path}`;
}

function formatNumber(value: number, fractionDigits = 0): string {
	return new Intl.NumberFormat(undefined, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	}).format(Number.isFinite(value) ? value : 0);
}

function LicenseSummaryPage() {
	const defaultPeriod = getPrevMonthYear();
	const [period, setPeriod] = useState<MonthYear>(defaultPeriod);
	const [rows, setRows] = useState<LicenseSummaryRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const [filter, setFilter] = useState('');
	const [sortField, setSortField] = useState<keyof LicenseSummaryRow>('policy_code');
	const [direction, setDirection] = useState<SortDirection>('asc');

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				return acc;
			},
			{ total_charge: 0, total_new_customers: 0 },
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

	async function onExport() {
		try {
			const url = buildProxyUrl('/api/account');
			const token = getAuthToken()?.api_token || '';
			const res = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
					'X-Access-Token': token,
				},
				body: JSON.stringify({ action: 'export', resource: 'efactory_license_summary', month: period.month, year: period.year }),
			});
			if (!res.ok) throw new Error('Export failed');
			const blob = await res.blob();
			const href = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = href;
			a.download = `license-summary-${period.year}-${period.month}.xlsx`;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(href);
		} catch {
			// noop for now
		}
	}

	function LicenseSummaryPageInner() {
	return (
			<div className='p-6'>
				{/* Header Section */}
				<div className='mb-6'>
					<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
						<div>
							<h1 className='text-[28px]/[36px] font-bold text-font-color mb-2'>License Summary</h1>
							<p className='text-font-color-100'>Monitor license usage and billing across all customers</p>
						</div>
						<div className='flex items-center gap-3'>
							<Combobox
								value={`${period.year}-${period.month}`}
								onValueChange={(value) => {
									const [y, m] = value.split('-');
									setPeriod({ month: m, year: y });
								}}
								options={monthOptions().map((opt) => ({
									value: `${opt.year}-${opt.month}`,
									label: `${opt.year} - ${opt.month}`
								}))}
								placeholder="Select period..."
								icon={IconCalendar}
								className="min-w-[160px]"
								showSearch={false}
							/>
							<button 
								className='btn btn-light-secondary' 
								onClick={load} 
								disabled={loading}
								title='Refresh Data'
							>
								<IconRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
							</button>
							<button 
								className='btn btn-primary' 
								onClick={onExport} 
								disabled={!loaded}
								title='Export to Excel'
							>
								<IconDownload className='w-4 h-4 me-2' />
								Export
							</button>
						</div>
					</div>

					{/* Summary Cards */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
						<div className='bg-card-color border border-border-color rounded-xl p-4'>
							<div className='flex items-center justify-between mb-2'>
								<div className='bg-primary-10 p-3 rounded-lg'>
									<IconUsers className='w-6 h-6 text-font-color' />
								</div>
								<span className='text-[12px]/[16px] text-font-color-100 font-medium'>CUSTOMERS</span>
							</div>
							<div className='text-[24px]/[30px] font-bold text-font-color mb-1'>{filteredSorted.length}</div>
							<div className='text-[12px]/[16px] text-font-color-100'>Total accounts</div>
						</div>

						<div className='bg-card-color border border-border-color rounded-xl p-4'>
							<div className='flex items-center justify-between mb-2'>
								<div className='bg-success-10 p-3 rounded-lg'>
									<IconTrendingUp className='w-6 h-6 text-font-color' />
								</div>
								<span className='text-[12px]/[16px] text-font-color-100 font-medium'>NEW CUSTOMERS</span>
							</div>
							<div className='text-[24px]/[30px] font-bold text-font-color mb-1'>{totals.total_new_customers}</div>
							<div className='text-[12px]/[16px] text-font-color-100'>This period</div>
						</div>

						<div className='bg-card-color border border-border-color rounded-xl p-4'>
							<div className='flex items-center justify-between mb-2'>
								<div className='bg-warning-10 p-3 rounded-lg'>
									<IconCurrencyDollar className='w-6 h-6 text-font-color' />
								</div>
								<span className='text-[12px]/[16px] text-font-color-100 font-medium'>TOTAL REVENUE</span>
							</div>
							<div className='text-[24px]/[30px] font-bold text-font-color mb-1'>${formatNumber(totals.total_charge, 2)}</div>
							<div className='text-[12px]/[16px] text-font-color-100'>Period total</div>
						</div>

						<div className='bg-card-color border border-border-color rounded-xl p-4'>
							<div className='flex items-center justify-between mb-2'>
								<div className='bg-info-10 p-3 rounded-lg'>
									<IconCurrencyDollar className='w-6 h-6 text-font-color' />
								</div>
								<span className='text-[12px]/[16px] text-font-color-100 font-medium'>AVG PER CUSTOMER</span>
							</div>
							<div className='text-[24px]/[30px] font-bold text-font-color mb-1'>
								${filteredSorted.length > 0 ? formatNumber(totals.total_charge / filteredSorted.length, 2) : '0.00'}
							</div>
							<div className='text-[12px]/[16px] text-font-color-100'>Average revenue</div>
						</div>
					</div>
				</div>

				{/* Filters and Search */}
				<div className='bg-card-color border border-border-color rounded-xl p-4 mb-6'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
						<div className='flex items-center gap-4'>
							<div className='relative'>
								<IconSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-font-color-100' />
								<input
									className='form-control pl-12 min-w-[250px] bg-card-color border border-border-color rounded-lg px-3 py-2 text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors'
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
						<div className='text-[14px]/[20px] text-font-color-100'>
							Showing {filteredSorted.length} of {rows.length} customers
						</div>
					</div>
					</div>

				{/* Data Table */}
				<div className='bg-card-color border border-border-color rounded-xl overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[1200px]'>
							<thead className='bg-body-color border-b border-border-color'>
								{/* Section Headers Row */}
								<tr>
									<th rowSpan={2} className='px-4 py-3 text-left border-r border-border-color'>
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
									<th rowSpan={2} className='px-3 py-3 text-center border-r border-border-color bg-primary-10'>
										<button
											className='flex items-center justify-center gap-1 text-[11px]/[14px] font-bold text-font-color uppercase tracking-wider hover:text-font-color w-full'
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
										<tr key={r.row_id} className={`border-b border-border-color transition-colors ${r.is_new ? 'bg-success-5' : ''}`}>
											{/* Customer */}
											<td className='px-4 py-3 border-r border-border-color'>
												<div className='flex items-center gap-2'>
													<div className='font-semibold text-font-color'>{r.policy_code}</div>
													{r.is_new && (
														<span className='bg-success text-white text-[10px]/[12px] px-2 py-1 rounded-full font-medium'>NEW</span>
													)}
												</div>
											</td>
											{/* Total CHG Column */}
											<td className='px-3 py-3 text-center text-[16px]/[22px] font-bold text-font-color border-r border-border-color bg-primary-10'>${formatNumber(r.total_charge, 2)}</td>
											{/* Basic Columns */}
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color'>{formatNumber(r.basic_nocharge_eom)}</td>
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color'>{formatNumber(r.basic_now_max)}</td>
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color border-r border-border-color'>{formatNumber(r.basic_rate_eom, 2)}</td>
											{/* Standard Columns */}
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color'>{formatNumber(r.standard_nocharge_eom)}</td>
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color'>{formatNumber(r.standard_now_max)}</td>
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color border-r border-border-color'>{formatNumber(r.standard_rate_eom, 2)}</td>
											{/* ReturnTrak Columns */}
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color'>{formatNumber(r.returntrak_nocharge_eom)}</td>
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color'>{formatNumber(r.returntrak_now_max)}</td>
											<td className='px-2 py-3 text-center text-[13px]/[18px] text-font-color border-r border-border-color'>{formatNumber(r.returntrak_rate_eom, 2)}</td>
											{/* Summary Charge Columns */}
											<td className='px-3 py-3 text-center text-[14px]/[20px] font-bold text-font-color'>${formatNumber(r.basic_charge, 2)}</td>
											<td className='px-3 py-3 text-center text-[14px]/[20px] font-bold text-font-color'>${formatNumber(r.standard_charge, 2)}</td>
											<td className='px-3 py-3 text-center text-[14px]/[20px] font-bold text-font-color'>${formatNumber(r.returntrak_charge, 2)}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
				</div>
			</div>
		</div>
	);
}

	return <LicenseSummaryPageInner />;
}

export default dynamic(() => Promise.resolve(LicenseSummaryPage), { ssr: false });
