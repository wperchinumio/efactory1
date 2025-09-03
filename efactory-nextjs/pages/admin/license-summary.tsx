import { useEffect, useMemo, useState } from 'react';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';

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

export default function LicenseSummaryPage() {
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

	return (
		<div className='md:px-6 sm:px-3 pt-4'>
			<div className='container-fluid'>
				<div className='card bg-card-color border border-dashed border-border-color rounded-2xl p-4 shadow-shadow-lg'>
					<div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
						<div className='flex items-center gap-3'>
							<div>
								<div className='text-[18px]/[26px] font-semibold'>License Summary</div>
								<div className='text-[12px]/[1] text-font-color-100'>Period</div>
							</div>
							<div className='inline-flex items-center gap-2'>
								<select
									className='form-select min-w-[140px]'
									value={`${period.year}-${period.month}`}
									onChange={(e) => {
										const [y, m] = e.target.value.split('-');
										setPeriod({ month: m, year: y });
									}}
								>
									{monthOptions().map((opt) => (
										<option key={`${opt.year}-${opt.month}`} value={`${opt.year}-${opt.month}`}>
											{opt.year} - {opt.month}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<input
								className='form-input'
								placeholder='filter'
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
							<button className='btn btn-secondary' onClick={load} disabled={loading}>Refresh</button>
							<button className='btn btn-primary' onClick={onExport} disabled={!loaded}>Export</button>
						</div>
					</div>

					<div className='flex items-center justify-between mb-2'>
						<div className='text-[13px] text-font-color-100'>Rows: {filteredSorted.length}</div>
						<div className='text-[13px]'>Total charge period: <span className='font-semibold'>{formatNumber(totals.total_charge, 2)}</span></div>
						<div className='text-[13px]'>New customers: <span className='font-semibold'>{totals.total_new_customers}</span></div>
					</div>

					<div className='overflow-auto'>
						<table className='w-full min-w-[900px]'>
							<thead>
								<tr className='text-left text-font-color-100 text-[12px]/[1] uppercase border-b border-dashed border-border-color'>
									<th className='py-2 px-2 w-[70px] cursor-pointer' onClick={() => setSort('policy_code')}>Cust.</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('basic_nocharge_eom')}>Basic No Chg EOM</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('basic_now_max')}>Basic Now</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('basic_rate_eom')}>Basic Rate EOM</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('standard_nocharge_eom')}>Std No Chg EOM</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('standard_now_max')}>Std Now</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('standard_rate_eom')}>Std Rate EOM</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('returntrak_nocharge_eom')}>RT No Chg EOM</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('returntrak_now_max')}>RT Now</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('returntrak_rate_eom')}>RT Rate EOM</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('basic_charge')}>Basic Chg</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('standard_charge')}>Std Chg</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('returntrak_charge')}>RT Chg</th>
									<th className='py-2 px-2 text-right cursor-pointer' onClick={() => setSort('total_charge')}>Total Chg</th>
								</tr>
							</thead>
							<tbody>
								{filteredSorted.map((r) => (
									<tr key={r.row_id} className='border-b border-dashed border-border-color hover:bg-primary-10'>
										<td className='py-2 px-2 font-medium'>{r.policy_code}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.basic_nocharge_eom)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.basic_now_max)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.basic_rate_eom, 2)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.standard_nocharge_eom)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.standard_now_max)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.standard_rate_eom, 2)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.returntrak_nocharge_eom)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.returntrak_now_max)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.returntrak_rate_eom, 2)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.basic_charge, 2)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.standard_charge, 2)}</td>
										<td className='py-2 px-2 text-right'>{formatNumber(r.returntrak_charge, 2)}</td>
										<td className='py-2 px-2 text-right font-semibold'>{formatNumber(r.total_charge, 2)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
