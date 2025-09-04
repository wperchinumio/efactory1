import { useEffect, useMemo, useRef, useState } from 'react';
import { postJson } from '@/lib/api/http';
import { 
	IconBrandChrome, 
	IconBrandFirefox, 
	IconBrandSafari, 
	IconBrandEdge, 
	IconBrandOpera, 
	IconWorldPin, 
	IconSearch, 
	IconUsers,
	IconBuilding,
	IconMapPin,
	IconShield,
	IconRefresh,
	IconDots
} from '@tabler/icons-react';

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

function getInitials(username: string) {
	return (username || '')
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, 2);
}

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
		<div className={`inline-flex items-center justify-center w-[24px] h-[24px] rounded-md ${config.bgColor} ${config.iconColor}`}>
			{config.icon}
		</div>
	);
}

function CustomerCard({ customer, index, onMapClick, totalCount }: {
	customer: OnlineCustomerRow;
	index: number;
	onMapClick: (ip?: string) => void;
	totalCount: number;
}) {
	const initials = getInitials(customer.username);
	const locationTokens = String(customer.location || '')
		.split(/[-,]/)
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 3);

	return (
		<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color transition-all duration-200 hover:shadow-shadow-lg hover:scale-[1.02]'>
			{/* Header */}
			<div className='flex items-start justify-between mb-4'>
				<div className='flex items-center gap-3'>
					<div className='w-[50px] h-[50px] bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-[16px] font-bold'>
						{initials}
					</div>
					<div>
						<div className='text-[18px]/[24px] font-bold text-font-color mb-1'>
							{customer.account_number}
						</div>
						<div className={`text-[14px]/[20px] font-semibold ${customer.is_master ? 'text-primary' : 'text-font-color'}`}>
							{customer.username}
							{customer.is_master && (
								<span className='ml-2 inline-flex items-center justify-center rounded-sm bg-primary text-white px-1.5 py-0.5 text-[9px]/[1.2] font-medium'>
									MASTER
								</span>
							)}
						</div>
						<div className='text-font-color-100 text-[12px]/[16px]'>
							{customer.location}
						</div>
					</div>
				</div>
				<div className='text-[11px]/[14px] text-font-color-100'>
					{index + 1}/{totalCount}
				</div>
			</div>

			{/* Company Info */}
			<div className='mb-4'>
				<div className='text-[14px]/[20px] text-font-color-100 truncate mb-2'>
					{customer.company_name}
				</div>
				<div className='flex items-center gap-1'>
					{customer.company_code && (
						<span className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[1.2] uppercase font-medium'>
							{customer.company_code}
						</span>
					)}
					{locationTokens.map((location) => (
						<span key={location} className='px-2 py-1 rounded-md bg-secondary text-white text-[10px]/[1.2] uppercase font-medium'>
							{location}
						</span>
					))}
				</div>
			</div>

			{/* Browser Info */}
			<div className='mb-4'>
				<div className='flex items-center gap-1 mb-2'>
					<IconWorldPin className='w-[12px] h-[12px] text-font-color-100' />
					<span className='text-[12px]/[16px] text-font-color-100'>Browser</span>
				</div>
				<div className='flex items-center gap-2'>
					<BrowserIcon short={customer.short_browser} />
					<div className='min-w-0 flex-1'>
						<div className='text-[12px]/[16px] font-medium text-font-color truncate'>
							{customer.short_browser}
						</div>
						<div className='text-[10px]/[14px] text-font-color-100 truncate'>
							{customer.long_browser}
						</div>
					</div>
				</div>
			</div>

			{/* Action */}
			<button 
				className='btn btn-secondary w-full'
				onClick={() => onMapClick(customer.ip_address)} 
				disabled={!customer.ip_address || customer.ip_address.startsWith('192.168')}
			>
				<IconWorldPin className='w-[14px] h-[14px]' />
				View Location
			</button>
		</div>
	);
}

export default function OnlineCustomersPage() {
	const [rows, setRows] = useState<OnlineCustomerRow[]>([]);
	const [total, setTotal] = useState(0);
	const [refreshedAt, setRefreshedAt] = useState<string>('');
	const [filter, setFilter] = useState('');
	const [loading, setLoading] = useState(false);
	const [mapOpen, setMapOpen] = useState(false);
	const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

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
			if (searchInputRef.current) {
				searchInputRef.current.focus();
			}
		}
	}

	useEffect(() => {
		load();
	}, []);

	useEffect(() => {
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
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
		return [...list].sort((a, b) => (a.username < b.username ? -1 : a.username > b.username ? 1 : 0));
	}, [rows, filter]);

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

	// Calculate statistics
	const masterUsers = rows.filter(r => r.is_master).length;
	const uniqueCompanies = new Set(rows.map(r => r.company_name)).size;
	const uniqueBrowsers = new Set(rows.map(r => r.short_browser)).size;

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{/* Compact Header */}
			<div className='container-fluid mb-4'>
				<div className='max-w-[1400px] mx-auto'>
					{/* Title and Stats Row */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
						<div>
							<h1 className='text-[20px]/[28px] md:text-[24px]/[32px] font-bold text-font-color'>
								Online Customers
							</h1>
							<p className='text-font-color-100 text-[14px]/[20px]'>
								Monitor currently active customer sessions.
							</p>
						</div>
						
						{/* Inline Quick Stats */}
						<div className='flex items-center gap-6'>
							<div className='flex items-center gap-2'>
								<div className='w-[24px] h-[24px] rounded-md flex items-center justify-center text-white bg-success'>
									<IconUsers className='w-[12px] h-[12px]' />
								</div>
								<div className='text-right'>
									<div className='text-[16px]/[20px] font-semibold text-font-color'>{total}</div>
									<div className='text-[10px]/[12px] text-font-color-100'>Online</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-[24px] h-[24px] rounded-md flex items-center justify-center text-white bg-info'>
									<IconShield className='w-[12px] h-[12px]' />
								</div>
								<div className='text-right'>
									<div className='text-[16px]/[20px] font-semibold text-font-color'>{masterUsers}</div>
									<div className='text-[10px]/[12px] text-font-color-100'>Masters</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-[24px] h-[24px] rounded-md flex items-center justify-center text-white bg-warning'>
									<IconBuilding className='w-[12px] h-[12px]' />
								</div>
								<div className='text-right'>
									<div className='text-[16px]/[20px] font-semibold text-font-color'>{uniqueCompanies}</div>
									<div className='text-[10px]/[12px] text-font-color-100'>Companies</div>
								</div>
							</div>
						</div>
					</div>

					{/* Quick Info Bar */}
					<div className='card bg-card-color rounded-lg p-3 border border-dashed border-border-color'>
						<div className='flex flex-wrap items-center justify-between gap-4'>
							<div className='flex items-center gap-4'>
								<div className='flex items-center gap-2'>
									<span className='text-[12px]/[16px] text-font-color-100'>Status:</span>
									<span className='px-2 py-1 rounded-md bg-success text-white text-[10px]/[12px] font-medium'>
										{total} Active
									</span>
									<span className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[12px] font-medium'>
										{uniqueBrowsers} Browsers
									</span>
								</div>
							</div>
							<div className='text-[11px]/[14px] text-font-color-100'>
								{refreshedAt && `Last updated: ${new Date(refreshedAt).toLocaleString()}`}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Search and Controls */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1400px] mx-auto'>
					<div className='card bg-card-color rounded-xl p-4 md:p-6 border border-dashed border-border-color'>
						<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
							<div className='flex items-center gap-4 flex-1'>
								<div className='relative flex-1 max-w-md'>
									<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
									<input 
										ref={searchInputRef}
										className='form-control pl-9 pr-3 py-2 text-[14px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors' 
										placeholder='Search customers, companies, browsers...' 
										value={filter} 
										onChange={(e) => setFilter(e.target.value)} 
									/>
								</div>
								<span className='text-font-color-100 text-[14px]/[20px] whitespace-nowrap'>
									{filtered.length} of {total} customers
								</span>
							</div>
							<button className='btn btn-secondary' onClick={load} disabled={loading}>
								<IconRefresh className='w-[14px] h-[14px]' />
								{loading ? 'Refreshing...' : 'Refresh'}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Customers Display */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1400px] mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
						{filtered.map((customer, index) => (
							<CustomerCard
								key={customer.row_id}
								customer={customer}
								index={index}
								onMapClick={handleMapClick}
								totalCount={filtered.length}
							/>
						))}
					</div>

					{/* Empty State */}
					{filtered.length === 0 && (
						<div className='text-center py-16'>
							<div className='w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-primary-10 flex items-center justify-center'>
								<IconUsers className='w-[40px] h-[40px] text-primary' />
							</div>
							<h3 className='text-[24px]/[30px] font-semibold mb-3'>
								{total === 0 ? 'No customers online' : 'No customers found'}
							</h3>
							<p className='text-font-color-100 text-[16px]/[24px] max-w-md mx-auto'>
								{total === 0 ? 'Check back later for active customers' : 'Try adjusting your search terms or clear the filter.'}
							</p>
							{total > 0 && (
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