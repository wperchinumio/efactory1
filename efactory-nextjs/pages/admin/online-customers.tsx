import { useEffect, useMemo, useState } from 'react';
import { postJson } from '@/lib/api/http';
import { IconBrandChrome, IconBrandFirefox, IconBrandSafari, IconBrandEdge, IconBrandOpera, IconWorldPin, IconSearch, IconArrowsSort } from '@tabler/icons-react';

interface OnlineCustomerRow {
	row_id: number;
	username: string;
	account_number: string;
	location: string;
	company_name: string;
	short_browser: string;
	long_browser: string;
	company_code: string;
	ip_address?: string;
	is_master?: boolean;
}

export default function OnlineCustomersPage() {
	const [rows, setRows] = useState<OnlineCustomerRow[]>([]);
	const [total, setTotal] = useState(0);
	const [refreshedAt, setRefreshedAt] = useState<string>('');
	const [filter, setFilter] = useState('');
	const [sortField, setSortField] = useState<keyof OnlineCustomerRow>('company_name');
	const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
	const [loading, setLoading] = useState(false);
	const [mapOpen, setMapOpen] = useState(false);
	const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);

	async function load() {
		setLoading(true);
		try {
			const res = await postJson<{ rows: OnlineCustomerRow[]; date: string }>(
				'/api/account',
				{ resource: 'online_customers', action: 'read' },
			);
			setRows(res.data.rows || []);
			setTotal((res.data.rows || []).length);
			setRefreshedAt(res.data.date || '');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	const filtered = useMemo(() => {
		const q = filter.trim().toLowerCase();
		let list = rows;
		if (q) {
			list = list.filter((r) => {
				const accountLocation = `${r.account_number} - ${r.location}`.toLowerCase();
				return (
					r.username.toLowerCase().includes(q) ||
					accountLocation.includes(q) ||
					r.company_code?.toLowerCase().includes(q) ||
					r.company_name?.toLowerCase().includes(q) ||
					r.short_browser?.toLowerCase().includes(q)
				);
			});
		}
		const s = [...list].sort((a, b) => {
			const av = String(a[sortField] ?? '').toLowerCase();
			const bv = String(b[sortField] ?? '').toLowerCase();
			return av < bv ? -1 : av > bv ? 1 : 0;
		});
		if (direction === 'desc') s.reverse();
		return s;
	}, [rows, filter, sortField, direction]);

	function BrowserIcon({ short }: { short: string }) {
		const brand =
			short?.startsWith('Chrome') ? (
				<IconBrandChrome className='text-success w-[18px] h-[18px]' />
			) : short?.startsWith('Firefox') ? (
				<IconBrandFirefox className='text-warning w-[18px] h-[18px]' />
			) : short?.startsWith('Safari') ? (
				<IconBrandSafari className='text-info w-[18px] h-[18px]' />
			) : short?.startsWith('Edge') ? (
				<IconBrandEdge className='text-primary w-[18px] h-[18px]' />
			) : short?.startsWith('Opera') ? (
				<IconBrandOpera className='text-danger w-[18px] h-[18px]' />
			) : (
				<IconBrandChrome className='text-font-color-100 w-[18px] h-[18px]' />
			);
		return <div className='inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-primary-10'>{brand}</div>;
	}

	async function handleMapClick(ip?: string) {
		if (!ip || ip.startsWith('192.168')) return;
		try {
			setLoading(true);
			const res = await postJson<{ latitude: number; longitude: number }>(
				'/api/global',
				{ action: 'ip_location', ip_address: ip },
			);
			if (res?.data?.latitude && res?.data?.longitude) {
				setMapCoords({ lat: res.data.latitude, lng: res.data.longitude });
				setMapOpen(true);
			}
		} finally {
			setLoading(false);
		}
	}

	const isFiltered = filtered.length !== total && total > 0;

	return (
		<div className='md:px-6 sm:px-3 pt-4'>
			<div className='container-fluid'>
				<div className='card bg-card-color border border-dashed border-border-color rounded-2xl p-0 shadow-shadow-lg overflow-hidden'>
					<div className='flex flex-wrap items-center justify-between gap-4 px-4 pt-4'>
						<div>
							<div className='text-[18px]/[26px] md:text-[20px]/[28px] font-semibold'>Online Customers{total ? `: ${total}` : ''} {isFiltered ? <span className='text-font-color-100'>({filtered.length} filtered)</span> : null}</div>
							<div className='text-[12px]/[1] text-font-color-100'>Last refresh: {refreshedAt ? new Date(refreshedAt).toLocaleString() : ''}</div>
						</div>
						<div className='flex items-center gap-2'>
							<div className='relative'>
								<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-2 top-1/2 -translate-y-1/2' />
								<input className='form-input pl-7' placeholder='filter' value={filter} onChange={(e) => setFilter(e.target.value)} />
							</div>
							<button className='btn btn-secondary' onClick={load} disabled={loading}>Refresh</button>
						</div>
					</div>
					<div className='overflow-auto max-h-[65svh]'>
						<table className='w-full min-w-[900px]'>
							<thead>
								<tr className='text-left text-font-color-100 text-[12px]/[1] uppercase border-b border-dashed border-border-color bg-body-color sticky top-0 z-[1]'>
									<th className='py-2 px-2 w-[40px]'>#</th>
									<th className='py-2 px-2 cursor-pointer select-none' onClick={() => { setSortField('username'); setDirection(direction === 'asc' ? 'desc' : 'asc'); }}><span className='inline-flex items-center gap-1'>Username <IconArrowsSort className='w-[14px] h-[14px]' /></span></th>
									<th className='py-2 px-2 cursor-pointer select-none' onClick={() => { setSortField('company_name'); setDirection(direction === 'asc' ? 'desc' : 'asc'); }}><span className='inline-flex items-center gap-1'>Company <IconArrowsSort className='w-[14px] h-[14px]' /></span></th>
									<th className='py-2 px-2 cursor-pointer select-none' onClick={() => { setSortField('short_browser'); setDirection(direction === 'asc' ? 'desc' : 'asc'); }}><span className='inline-flex items-center gap-1'>Browser <IconArrowsSort className='w-[14px] h-[14px]' /></span></th>
								</tr>
							</thead>
							<tbody>
								{filtered.map((r, i) => (
									<tr key={r.row_id} className='border-b border-dashed border-border-color hover:bg-primary-10'>
										<td className='py-2 px-2'>{i + 1}</td>
										<td className='py-2 px-2'>
											<div className={`font-medium ${r.is_master ? 'text-white font-semibold' : ''}`}>{r.username}</div>
											<div className='text-font-color-100 text-[12px]'>
												<span className='inline-flex items-center gap-1'>
													<IconWorldPin className='w-[14px] h-[14px] text-primary' />
													<button className='underline underline-offset-2 decoration-dotted hover:text-primary' onClick={() => handleMapClick(r.ip_address)} disabled={!r.ip_address || r.ip_address.startsWith('192.168')}>Map</button>
												</span>
											</div>
										</td>
										<td className='py-2 px-2'>
											<div className='font-semibold'>{`${r.account_number} - ${r.location}`}</div>
											<div className='text-font-color-100'>{r.company_name} <span className='text-primary pl-2'>{r.company_code}</span></div>
										</td>
										<td className='py-2 px-2'>
											<div className='inline-flex items-center gap-2'>
												<BrowserIcon short={r.short_browser} />
												<span>{r.short_browser}</span>
											</div>
											<div className='text-font-color-100 text-[11px]/[1] pl-[26px]'>{r.long_browser}</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			{mapOpen && mapCoords ? (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black-50 backdrop-blur-sm'>
					<div className='bg-card-color rounded-xl shadow-shadow-lg border border-border-color overflow-hidden w-[90vw] max-w-[900px]'>
						<div className='p-4 border-b border-border-color flex items-center justify-between'>
							<div className='font-semibold'>Customer location</div>
							<button className='btn btn-white !border-border-color' onClick={() => setMapOpen(false)}>Cancel</button>
						</div>
						<div className='h-[70svh]'>
							<iframe title='map' width='100%' height='100%' frameBorder='0' scrolling='no' src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&hl=en&z=10&output=embed`} />
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
