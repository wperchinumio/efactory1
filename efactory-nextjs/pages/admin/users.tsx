import { useEffect, useMemo, useState } from 'react';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';

interface UserStatRow {
	row_id?: number;
	username: string;
	account_number: string;
	location: string;
	company_name: string;
	company_code: string;
	email: string;
	ws_only?: boolean;
	is_master?: boolean;
	is_online?: boolean;
}

function buildProxyUrl(path: string): string {
	const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';
	const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
	return useProxy ? `/api/proxy${path}` : `${base}${path}`;
}

export default function UsersPage() {
	const [rows, setRows] = useState<UserStatRow[]>([]);
	const [date, setDate] = useState<string>('');
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState('');
	const [sortField, setSortField] = useState<keyof UserStatRow>('company_name');
	const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

	async function load() {
		setLoading(true);
		try {
			const res = await postJson<{ rows: UserStatRow[]; date: string }>(
				'/api/account',
				{ resource: 'user_stat', action: 'read' },
			);
			const dataRows = (res.data?.rows || []).map((r: any, i: number) => ({ ...r, row_id: i + 1 }));
			setRows(dataRows);
			setDate(res.data?.date || '');
			setLoaded(true);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	const filteredSorted = useMemo(() => {
		const q = filter.trim().toLowerCase();
		let list = rows;
		if (q) {
			list = list.filter((r) => {
				const username = (r.username || '').toLowerCase();
				const accountLocation = `${r.account_number} - ${r.location}`.toLowerCase();
				const companyCode = (r.company_code || '').toLowerCase();
				const company = (r.company_name || '').toLowerCase();
				const email = (r.email || '').toLowerCase();
				const ws = r.ws_only ? 'ws' : '';
				return (
					username.includes(q) ||
					accountLocation.includes(q) ||
					companyCode.includes(q) ||
					email.includes(q) ||
					ws.includes(q) ||
					company.includes(q)
				);
			});
		}
		const sorted = [...list].sort((a, b) => {
			let av: any = a[sortField];
			let bv: any = b[sortField];
			if (sortField === 'ws_only') {
				av = a.ws_only ? 'ws' : '';
				bv = b.ws_only ? 'ws' : '';
			}
			if (av == null && bv == null) return 0;
			if (av == null) return -1;
			if (bv == null) return 1;
			av = String(av).toLowerCase();
			bv = String(bv).toLowerCase();
			return av < bv ? -1 : av > bv ? 1 : 0;
		});
		if (direction === 'desc') sorted.reverse();
		return sorted.map((r, i) => ({ ...r, row_id: i + 1 }));
	}, [rows, filter, sortField, direction]);

	const onlineCount = useMemo(() => filteredSorted.filter((r) => r.is_online).length, [filteredSorted]);

	function setSort(field: keyof UserStatRow) {
		if (field === sortField) {
			setDirection(direction === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setDirection('asc');
		}
	}

	async function onExport() {
		try {
			const url = buildProxyUrl('/api/account');
			const token = getAuthToken()?.api_token || '';
			const res = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: '*/*', 'X-Access-Token': token },
				body: JSON.stringify({ action: 'export', resource: 'user_stat' }),
			});
			if (!res.ok) throw new Error('Export failed');
			const blob = await res.blob();
			const href = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = href;
			a.download = 'efactory-users.xlsx';
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(href);
		} catch {
			// noop
		}
	}

	return (
		<div className='md:px-6 sm:px-3 pt-4'>
			<div className='container-fluid'>
				<div className='card bg-card-color border border-dashed border-border-color rounded-2xl p-4 shadow-shadow-lg'>
					<div className='flex items-center justify-between gap-3 mb-3'>
						<div>
							<div className='text-[18px]/[26px] font-semibold'>eFactory Users</div>
							<div className='text-[12px]/[1] text-font-color-100'>Last refresh: {date ? new Date(date).toLocaleString() : ''}</div>
						</div>
						<div className='flex items-center gap-2'>
							<input className='form-input' placeholder='filter' value={filter} onChange={(e) => setFilter(e.target.value)} />
							<button className='btn btn-secondary' onClick={load} disabled={loading}>Refresh</button>
							<button className='btn btn-primary' onClick={onExport} disabled={!loaded}>Export</button>
						</div>
					</div>
					<div className='mb-2 text-[13px]'>ONLINE USERS: <span className='font-semibold'>{onlineCount}</span></div>
					<div className='overflow-auto max-h-[65svh]'>
						<table className='w-full min-w-[900px]'>
							<thead>
								<tr className='text-left text-font-color-100 text-[12px]/[1] uppercase border-b border-dashed border-border-color'>
									<th className='py-2 px-2 w-[40px]'>#</th>
									<th className='py-2 px-2 cursor-pointer' onClick={() => setSort('username')}>Username</th>
									<th className='py-2 px-2 cursor-pointer' onClick={() => setSort('company_name')}>Company</th>
									<th className='py-2 px-2 text-center cursor-pointer' onClick={() => setSort('ws_only')}>WS ONLY</th>
									<th className='py-2 px-2 cursor-pointer' onClick={() => setSort('email')}>E-mail</th>
								</tr>
							</thead>
							<tbody>
								{filteredSorted.map((r, i) => (
									<tr key={r.row_id} className='border-b border-dashed border-border-color hover:bg-primary-10'>
										<td className='py-2 px-2'>{i + 1}</td>
										<td className='py-2 px-2 font-medium'>
											<div className='flex items-center gap-2'>
												<span>{r.username}</span>
												{r.is_online ? <i className='fa fa-user text-warning text-[16px]' aria-hidden='true' /> : null}
											</div>
										</td>
										<td className='py-2 px-2'>
											<div className='font-semibold'>{`${r.account_number} - ${r.location}`}</div>
											<div className='text-font-color-100'>{r.company_name} <span className='text-primary pl-2'>{r.company_code}</span></div>
										</td>
										<td className='py-2 px-2 text-center'>{r.ws_only ? 'WS' : ''}</td>
										<td className='py-2 px-2'>{r.email}</td>
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
