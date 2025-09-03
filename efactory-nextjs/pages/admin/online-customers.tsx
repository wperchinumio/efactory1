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
		const getBrowserConfig = (browserName: string) => {
			if (browserName?.startsWith('Chrome')) {
				return {
					icon: <IconBrandChrome className='w-[16px] h-[16px]' />,
					bgColor: 'bg-success-50',
					iconColor: 'text-success'
				};
			} else if (browserName?.startsWith('Firefox')) {
				return {
					icon: <IconBrandFirefox className='w-[16px] h-[16px]' />,
					bgColor: 'bg-orange-100',
					iconColor: 'text-warning'
				};
			} else if (browserName?.startsWith('Safari')) {
				return {
					icon: <IconBrandSafari className='w-[16px] h-[16px]' />,
					bgColor: 'bg-blue-100',
					iconColor: 'text-info'
				};
			} else if (browserName?.startsWith('Edge')) {
				return {
					icon: <IconBrandEdge className='w-[16px] h-[16px]' />,
					bgColor: 'bg-primary-10',
					iconColor: 'text-primary'
				};
			} else if (browserName?.startsWith('Opera')) {
				return {
					icon: <IconBrandOpera className='w-[16px] h-[16px]' />,
					bgColor: 'bg-red-100',
					iconColor: 'text-danger'
				};
			} else {
				return {
					icon: <IconBrandChrome className='w-[16px] h-[16px]' />,
					bgColor: 'bg-border-color',
					iconColor: 'text-font-color-100'
				};
			}
		};

		const config = getBrowserConfig(short);
		
		return (
			<div className={`inline-flex items-center justify-center w-[24px] h-[24px] rounded-md ${config.bgColor} ${config.iconColor} shadow-shadow-sm`}>
				{config.icon}
			</div>
		);
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
		<div className='md:px-6 sm:px-3 pt-8 md:pt-10 h-[calc(100svh-140px)] overflow-hidden'>
			{/* Top Filter Bar */}
			<div className='container-fluid mb-4'>
				<div className='max-w-[1120px] mx-auto flex items-center justify-between gap-4'>
					<div className='flex items-center gap-3'>
						<div className='relative'>
							<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
							<input 
								className='form-input pl-9 pr-3 py-2 text-[14px] min-w-[250px] border-border-color focus:border-primary focus:ring-2 focus:ring-primary-10 rounded-2xl' 
								placeholder='Search customers...' 
								value={filter} 
								onChange={(e) => setFilter(e.target.value)} 
							/>
						</div>
						{total > 0 && (
							<div className='text-font-color-100 text-[14px]/[20px]'>
								{isFiltered ? (
									<span>Showing {filtered.length} of {total} customers</span>
								) : (
									<span>{total} customers online</span>
								)}
							</div>
						)}
					</div>
					<button className='btn btn-secondary' onClick={load} disabled={loading}>
						{loading ? 'Refreshing...' : 'Refresh'}
					</button>
				</div>
			</div>

			<div className='container-fluid pb-0 h-full'>
				<div className='card bg-card-color border border-dashed border-border-color rounded-2xl p-6 md:p-8 shadow-shadow-lg max-w-[1120px] mx-auto'>
					<div className='mb-4 flex items-end justify-between gap-4'>
						<div>
							<div className='text-[18px]/[26px] md:text-[20px]/[28px] font-semibold'>ONLINE CUSTOMERS</div>
							<div className='text-font-color-100 text-[14px]/[20px]'>
								{refreshedAt && (
									<span>Last updated: {new Date(refreshedAt).toLocaleString()}</span>
								)}
							</div>
						</div>
					</div>

					<ul
						className={`${filtered.length === 0 ? 'min-h-[240px] flex items-center justify-center' : filtered.length === 1 ? 'min-h-0' : 'min-h-[240px]'} grid grid-cols-1 items-start gap-3 overflow-auto custom-scrollbar p-3`}
						style={{ maxHeight: filtered.length === 0 ? undefined : filtered.length === 1 ? undefined : 'calc(100svh - 140px - 300px)' }}
					>
						{filtered.length === 0 ? (
							<li className='col-span-full text-center text-font-color-100'>
								<div className='text-[48px] mb-2'>👥</div>
								<div className='text-[16px] font-medium mb-1'>
									{total === 0 ? 'No customers online' : 'No customers match your search'}
								</div>
								<div className='text-[14px]'>
									{total === 0 ? 'Check back later for active customers' : 'Try adjusting your search terms'}
								</div>
							</li>
						) : (
							filtered.map((customer, i) => {
								const initials = customer.username
									.toUpperCase()
									.replace(/[^A-Z0-9]/g, '')
									.slice(0, 2);
								
								const locationTokens = String(customer.location || '')
									.split(/[-,]/)
									.map((t) => t.trim())
									.filter(Boolean)
									.slice(0, 2);

								return (
									<li
										key={customer.row_id}
										className='relative group border border-dashed border-border-color rounded-xl bg-card-color transition-all duration-200 hover:shadow-shadow-lg hover:-translate-y-[1px] hover:border-primary-10'
									>
										<div className='p-4 flex items-center gap-4'>
											{/* Avatar */}
											<div className='w-[40px] h-[40px] min-w-[40px] rounded-lg flex items-center justify-center font-semibold text-white bg-gradient-to-br from-primary to-secondary shadow-shadow-sm'>
												{initials}
											</div>
											
											{/* Main Content - Horizontal Layout */}
											<div className='flex-1 min-w-0 grid grid-cols-12 gap-4 items-center'>
												{/* Customer Info - Takes 4 columns */}
												<div className='col-span-4 min-w-0'>
													<div className='flex items-center gap-2 mb-1'>
														<span className={`truncate font-semibold text-[14px]/[20px] ${customer.is_master ? 'text-primary' : 'text-font-color'}`}>
															{customer.username}
														</span>
														{customer.is_master && (
															<span className='inline-flex items-center justify-center rounded-sm bg-primary text-white px-1.5 py-0.5 text-[9px]/[1.2] font-medium'>
																MASTER
															</span>
														)}
													</div>
													<div className='text-font-color-100 text-[12px]/[16px] truncate'>
														{customer.account_number} - {customer.location}
													</div>
												</div>

												{/* Company Info - Takes 3 columns */}
												<div className='col-span-3 min-w-0'>
													<div className='text-font-color text-[13px]/[18px] font-medium truncate'>
														{customer.company_name}
													</div>
													<div className='flex items-center gap-1 mt-0.5'>
														{customer.company_code && (
															<span className='px-1.5 py-0.5 rounded-md bg-primary-10 text-primary text-[10px]/[1] uppercase font-medium'>
																{customer.company_code}
															</span>
														)}
														{locationTokens.length > 0 && (
															<span className='px-1.5 py-0.5 rounded-md bg-secondary text-white text-[10px]/[1] uppercase font-medium'>
																{locationTokens[0]}
															</span>
														)}
													</div>
												</div>

												{/* Browser Info - Takes 3 columns */}
												<div className='col-span-3 min-w-0'>
													<div className='flex items-center gap-2'>
														<BrowserIcon short={customer.short_browser} />
														<div className='min-w-0'>
															<div className='text-font-color text-[12px]/[16px] font-medium truncate'>
																{customer.short_browser}
															</div>
															<div className='text-font-color-100 text-[10px]/[14px] truncate'>
																{customer.long_browser}
															</div>
														</div>
													</div>
												</div>

												{/* Actions - Takes 2 columns */}
												<div className='col-span-2 flex justify-end'>
													<button 
														className='inline-flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-border-color hover:bg-primary-10 hover:border-primary text-[10px]/[1] text-font-color-100 hover:text-primary transition-colors opacity-0 group-hover:opacity-100' 
														onClick={() => handleMapClick(customer.ip_address)} 
														disabled={!customer.ip_address || customer.ip_address.startsWith('192.168')}
													>
														<IconWorldPin className='w-[10px] h-[10px]' />
														<span>Map</span>
													</button>
												</div>
											</div>
										</div>
									</li>
								);
							})
						)}
					</ul>
				</div>
			</div>
			
			{/* Map Modal */}
			{mapOpen && mapCoords ? (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black-50 backdrop-blur-sm'>
					<div className='bg-card-color rounded-xl shadow-shadow-lg border border-border-color overflow-hidden w-[90vw] max-w-[900px]'>
						<div className='p-4 border-b border-border-color flex items-center justify-between'>
							<div className='font-semibold text-[16px]/[24px]'>Customer Location</div>
							<button className='btn btn-white !border-border-color' onClick={() => setMapOpen(false)}>
								Close
							</button>
						</div>
						<div className='h-[70svh]'>
							<iframe 
								title='Customer location map' 
								width='100%' 
								height='100%' 
								frameBorder='0' 
								scrolling='no' 
								src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&hl=en&z=10&output=embed`} 
							/>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}
