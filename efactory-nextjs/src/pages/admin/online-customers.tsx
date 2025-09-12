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
	IconGlobe,
	IconActivity,
	IconDatabase,
	IconChartBar,
	IconTable
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
				icon: <IconBrandChrome className='w-[14px] h-[14px]' />,
				bgColor: 'bg-success-10',
				iconColor: 'text-success'
			};
		} else if (browserName?.startsWith('Firefox')) {
			return {
				icon: <IconBrandFirefox className='w-[14px] h-[14px]' />,
				bgColor: 'bg-orange-100',
				iconColor: 'text-warning'
			};
		} else if (browserName?.startsWith('Safari')) {
			return {
				icon: <IconBrandSafari className='w-[14px] h-[14px]' />,
				bgColor: 'bg-blue-100',
				iconColor: 'text-info'
			};
		} else if (browserName?.startsWith('Edge')) {
			return {
				icon: <IconBrandEdge className='w-[14px] h-[14px]' />,
				bgColor: 'bg-primary-10',
				iconColor: 'text-primary'
			};
		} else if (browserName?.startsWith('Opera')) {
			return {
				icon: <IconBrandOpera className='w-[14px] h-[14px]' />,
				bgColor: 'bg-red-100',
				iconColor: 'text-danger'
			};
		} else {
			return {
				icon: <IconBrandChrome className='w-[14px] h-[14px]' />,
				bgColor: 'bg-border-color',
				iconColor: 'text-font-color-100'
			};
		}
	};

	const config = getBrowserConfig(short);
	
	return (
		<div className={`inline-flex items-center justify-center w-[20px] h-[20px] rounded ${config.bgColor} ${config.iconColor}`}>
			{config.icon}
		</div>
	);
}

function OnlineCustomersPageInner() {
	const [rows, setRows] = useState<OnlineCustomerRow[]>([]);
	const [total, setTotal] = useState(0);
	const [refreshedAt, setRefreshedAt] = useState<string>('');
	const [filter, setFilter] = useState('');
	const [loading, setLoading] = useState(false);
	const [mapOpen, setMapOpen] = useState(false);
	const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [sortField, setSortField] = useState<'username' | 'company' | 'browser' | 'location'>('username');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
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
		return [...list].sort((a, b) => {
			let aValue, bValue;
			
			switch (sortField) {
				case 'username':
					aValue = a.username.toLowerCase();
					bValue = b.username.toLowerCase();
					break;
				case 'company':
					aValue = (a.company_name || '').toLowerCase();
					bValue = (b.company_name || '').toLowerCase();
					break;
				case 'browser':
					aValue = (a.short_browser || '').toLowerCase();
					bValue = (b.short_browser || '').toLowerCase();
					break;
				case 'location':
					aValue = (a.location || '').toLowerCase();
					bValue = (b.location || '').toLowerCase();
					break;
				default:
					aValue = a.username.toLowerCase();
					bValue = b.username.toLowerCase();
			}
			
			return sortDirection === 'asc' 
				? aValue.localeCompare(bValue)
				: bValue.localeCompare(aValue);
		});
	}, [rows, filter, sortField, sortDirection]);

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

	// Calculate comprehensive statistics
	const masterUsers = rows.filter(r => r.is_master).length;
	const standardUsers = total - masterUsers;
	const uniqueCompanies = new Set(rows.map(r => r.company_name)).size;
	const uniqueBrowsers = new Set(rows.map(r => r.short_browser)).size;
	const uniqueLocations = new Set(rows.map(r => r.location)).size;
	
	// Browser distribution
	const browserDistribution = rows.reduce((acc, customer) => {
		const browser = customer.short_browser || 'Unknown';
		acc[browser] = (acc[browser] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const topBrowsers = Object.entries(browserDistribution)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 5);

	// Company distribution
	const companyDistribution = rows.reduce((acc, customer) => {
		const company = customer.company_name || 'Unknown';
		acc[company] = (acc[company] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const topCompanies = Object.entries(companyDistribution)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 5);

	// Location distribution
	const locationDistribution = rows.reduce((acc, customer) => {
		const location = customer.location || 'Unknown';
		acc[location] = (acc[location] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const topLocations = Object.entries(locationDistribution)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 5);

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{/* Dashboard Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6'>
						<div>
							<h1 className='text-[24px]/[32px] font-bold text-font-color mb-2'>
								Online Customers Dashboard
							</h1>
							<p className='text-font-color-100 text-[16px]/[24px]'>
								Real-time monitoring of active customer sessions and system metrics
							</p>
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-3'>
							<button
								onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
								className='btn btn-primary'
							>
								{viewMode === 'grid' ? <IconTable className='w-4 h-4' /> : <IconChartBar className='w-4 h-4' />}
								{viewMode === 'grid' ? 'Table View' : 'Grid View'}
							</button>
							<button className='btn btn-secondary' onClick={load} disabled={loading}>
								<IconRefresh className='w-4 h-4' />
								{loading ? 'Refreshing...' : 'Refresh'}
							</button>
						</div>
					</div>

					{/* Metrics Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
						{/* Total Online */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-6 border border-success'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{total}</div>
									<div className='text-[14px]/[20px] text-white/80'>Online Now</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{refreshedAt && `Updated ${new Date(refreshedAt).toLocaleTimeString()}`}
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconUsers className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Master Users */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-6 border border-primary'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{masterUsers}</div>
									<div className='text-[14px]/[20px] text-white/80'>Master Users</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{((masterUsers / total) * 100).toFixed(1)}% of total
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconShield className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Companies */}
						<div className='card bg-gradient-to-br from-info to-info-10 rounded-xl p-6 border border-info'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{uniqueCompanies}</div>
									<div className='text-[14px]/[20px] text-white/80'>Companies</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{(total / uniqueCompanies).toFixed(1)} avg per company
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBuilding className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Browsers */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-6 border border-warning'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{uniqueBrowsers}</div>
									<div className='text-[14px]/[20px] text-white/80'>Browser Types</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{uniqueLocations} locations
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconGlobe className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Analytics Row */}
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
						{/* Top Browsers */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-success-10 rounded-lg flex items-center justify-center'>
									<IconGlobe className='w-[16px] h-[16px] text-success' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Top Browsers</h3>
							</div>
							<div className='space-y-3'>
								{topBrowsers.map(([browser, count], index) => (
									<div key={browser} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-success text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<span className='text-[14px]/[18px] text-font-color font-medium'>{browser}</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-success-10 rounded-full h-2'>
												<div 
													className='bg-success h-2 rounded-full' 
													style={{ width: `${(count / (topBrowsers[0]?.[1] || 1)) * 100}%` }}
												/>
											</div>
											<span className='text-[12px]/[16px] text-font-color-100 font-mono'>{count}</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Top Companies */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-info-10 rounded-lg flex items-center justify-center'>
									<IconBuilding className='w-[16px] h-[16px] text-info' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Top Companies</h3>
							</div>
							<div className='space-y-3'>
								{topCompanies.map(([company, count], index) => (
									<div key={company} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-info text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<span className='text-[14px]/[18px] text-font-color font-medium truncate'>{company}</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-info-10 rounded-full h-2'>
												<div 
													className='bg-info h-2 rounded-full' 
													style={{ width: `${(count / (topCompanies[0]?.[1] || 1)) * 100}%` }}
												/>
											</div>
											<span className='text-[12px]/[16px] text-font-color-100 font-mono'>{count}</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Top Locations */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-warning-10 rounded-lg flex items-center justify-center'>
									<IconMapPin className='w-[16px] h-[16px] text-warning' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Top Locations</h3>
							</div>
							<div className='space-y-3'>
								{topLocations.map(([location, count], index) => (
									<div key={location} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-warning text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<span className='text-[14px]/[18px] text-font-color font-medium truncate'>{location}</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-warning-10 rounded-full h-2'>
												<div 
													className='bg-warning h-2 rounded-full' 
													style={{ width: `${(count / (topLocations[0]?.[1] || 1)) * 100}%` }}
												/>
											</div>
											<span className='text-[12px]/[16px] text-font-color-100 font-mono'>{count}</span>
										</div>
									</div>
								))}
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
										className='form-control pl-9 pr-3 py-2 text-[14px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-20 focus:border-primary transition-colors' 
										placeholder='Search customers, companies, browsers...' 
										value={filter} 
										onChange={(e) => setFilter(e.target.value)} 
									/>
								</div>
								<span className='text-font-color-100 text-[14px]/[20px] whitespace-nowrap'>
									{filtered.length} of {total} customers
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Customers Display */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					{viewMode === 'grid' ? (
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
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
					) : (
						<div className='card bg-card-color rounded-lg border border-dashed border-border-color overflow-hidden'>
							{/* Table Header */}
							<div className='bg-primary-5 border-b border-border-color px-6 py-3'>
								<div className='grid grid-cols-12 gap-4 items-center text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider'>
									<div className='col-span-1'>#</div>
									<div className='col-span-1'>Avatar</div>
									<div className='col-span-2'>User</div>
									<div className='col-span-2'>Company</div>
									<div className='col-span-2'>Location</div>
									<div className='col-span-2'>Browser</div>
									<div className='col-span-1'>Type</div>
									<div className='col-span-1'>Actions</div>
								</div>
							</div>

							{/* Table Body */}
							<div className='divide-y divide-border-color'>
								{filtered.map((customer, index) => (
									<CustomerTableRow
										key={customer.row_id}
										customer={customer}
										index={index}
										onMapClick={handleMapClick}
									/>
								))}
							</div>
						</div>
					)}

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
		.slice(0, 2);

	return (
		<div className='card bg-card-color rounded-lg p-4 border transition-all duration-200 cursor-pointer hover:shadow-shadow-lg hover:scale-[1.02] border-dashed border-border-color'>
			{/* Header */}
			<div className='flex items-center justify-between mb-3'>
				<div className='w-[40px] h-[40px] bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-[14px] font-bold'>
					{initials}
				</div>
				<div className='flex items-center gap-2'>
					{customer.is_master ? (
						<>
							<IconShield className='w-[16px] h-[16px] text-primary' />
							<span className='text-[12px]/[16px] text-primary font-medium'>MASTER</span>
						</>
					) : (
						<>
							<IconUsers className='w-[16px] h-[16px] text-font-color-100' />
							<span className='text-[12px]/[16px] text-font-color-100'>USER</span>
						</>
					)}
				</div>
			</div>

			{/* User Info */}
			<div className='mb-3'>
				<div className='text-[16px]/[20px] font-bold text-font-color mb-1'>
					{customer.account_number}
				</div>
				<div className='text-[12px]/[16px] text-font-color-100 truncate'>
					{customer.username}
				</div>
			</div>

			{/* Company Info */}
			<div className='mb-3'>
				<div className='text-[14px]/[18px] text-font-color-100 truncate mb-2'>
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
			<div className='mb-3'>
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
				className='btn btn-secondary w-full btn-sm'
				onClick={() => onMapClick(customer.ip_address)} 
				disabled={!customer.ip_address || customer.ip_address.startsWith('192.168')}
			>
				<IconWorldPin className='w-[14px] h-[14px]' />
				View Location
			</button>
		</div>
	);
}

function CustomerTableRow({ customer, index, onMapClick }: {
	customer: OnlineCustomerRow;
	index: number;
	onMapClick: (ip?: string) => void;
}) {
	const initials = getInitials(customer.username);
	const locationTokens = String(customer.location || '')
		.split(/[-,]/)
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 2);

	return (
		<div className='px-6 py-4 transition-all duration-200 hover:bg-primary-5'>
			<div className='grid grid-cols-12 gap-4 items-center'>
				{/* Index */}
				<div className='col-span-1 text-[12px]/[16px] text-font-color-100 font-mono'>
					{index + 1}
				</div>

				{/* Avatar */}
				<div className='col-span-1'>
					<div className='w-[32px] h-[32px] bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-[12px] font-bold'>
						{initials}
					</div>
				</div>

				{/* User */}
				<div className='col-span-2 min-w-0'>
					<div className='text-[14px]/[18px] font-semibold text-font-color truncate'>
						{customer.account_number}
					</div>
					<div className='text-[12px]/[16px] text-font-color-100 truncate'>
						{customer.username}
					</div>
				</div>

				{/* Company */}
				<div className='col-span-2 min-w-0'>
					<div className='text-[14px]/[18px] text-font-color truncate'>
						{customer.company_name}
					</div>
					{customer.company_code && (
						<div className='text-[12px]/[16px] text-font-color-100'>
							{customer.company_code}
						</div>
					)}
				</div>

				{/* Location */}
				<div className='col-span-2'>
					{locationTokens.length > 0 ? (
						<div className='flex flex-wrap gap-1'>
							{locationTokens.map((location) => (
								<span 
									key={location} 
									className='px-2 py-1 rounded-md bg-secondary text-white text-[10px]/[12px] uppercase font-medium'
								>
									{location}
								</span>
							))}
						</div>
					) : (
						<span className='text-[12px]/[16px] text-font-color-100'>No location</span>
					)}
				</div>

				{/* Browser */}
				<div className='col-span-2'>
					<div className='flex items-center gap-2'>
						<BrowserIcon short={customer.short_browser} />
						<div className='min-w-0 flex-1'>
							<div className='text-[12px]/[16px] font-medium text-font-color truncate'>
								{customer.short_browser}
							</div>
						</div>
					</div>
				</div>

				{/* Type */}
				<div className='col-span-1'>
					<div className='flex items-center gap-2'>
						{customer.is_master ? (
							<>
								<IconShield className='w-[14px] h-[14px] text-primary' />
								<span className='text-[12px]/[16px] text-primary font-medium'>Master</span>
							</>
						) : (
							<>
								<IconUsers className='w-[14px] h-[14px] text-font-color-100' />
								<span className='text-[12px]/[16px] text-font-color-100'>User</span>
							</>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className='col-span-1'>
					<button
						onClick={() => onMapClick(customer.ip_address)}
						className='btn btn-sm btn-outline-secondary'
						disabled={!customer.ip_address || customer.ip_address.startsWith('192.168')}
					>
						<IconWorldPin className='w-[14px] h-[14px]' />
					</button>
				</div>
			</div>
		</div>
	);
}

function OnlineCustomersPage() {
	return <OnlineCustomersPageInner />;
}

export default OnlineCustomersPage;