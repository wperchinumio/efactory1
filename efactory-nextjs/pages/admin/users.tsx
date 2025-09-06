import { useEffect, useMemo, useState, useRef } from 'react';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { 
	IconSearch, 
	IconRefresh, 
	IconDownload, 
	IconUsers, 
	IconX,
	IconUser,
	IconBuilding,
	IconMail,
	IconWifi,
	IconWifiOff,
	IconSettings,
	IconActivity,
	IconTarget,
	IconTrendingUp,
	IconChevronUp,
	IconChevronDown,
	IconFilter,
	IconSortAscending,
	IconSortDescending,
	IconDatabase,
	IconEye,
	IconClock,
	IconShield,
	IconStar
} from '@tabler/icons-react';
import Combobox from '@/components/ui/Combobox';

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

type SortField = keyof UserStatRow;
type SortDirection = 'asc' | 'desc';

function UsersPage() {
	const [mounted, setMounted] = useState(false);
	const [rows, setRows] = useState<UserStatRow[]>([]);
	const [date, setDate] = useState<string>('');
	const [loaded, setLoaded] = useState(false);
	const [loading, setLoading] = useState(false);
	const [filter, setFilter] = useState('');
	const [sortField, setSortField] = useState<'company_code' | 'username'>('company_code');
	const [direction, setDirection] = useState<SortDirection>('asc');
	const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline' | 'ws'>('all');
	const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setMounted(true);
	}, []);

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
		if (mounted) {
			load();
		}
	}, [mounted]);

	// Auto-focus search input on page load
	useEffect(() => {
		if (mounted && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [mounted]);

	const filteredSorted = useMemo(() => {
		const q = filter.trim().toLowerCase();
		let list = rows;
		
		// Apply text filter
		if (q) {
			list = list.filter((r) => {
				const username = (r.username || '').toLowerCase();
				const accountLocation = `${r.account_number} - ${r.location}`.toLowerCase();
				const companyCode = (r.company_code || '').toLowerCase();
				const company = (r.company_name || '').toLowerCase();
				const email = (r.email || '').toLowerCase();
				return (
					username.includes(q) ||
					accountLocation.includes(q) ||
					companyCode.includes(q) ||
					email.includes(q) ||
					company.includes(q)
				);
			});
		}

		// Apply status filter
		if (statusFilter !== 'all') {
			list = list.filter((r) => {
				if (statusFilter === 'online') return r.is_online;
				if (statusFilter === 'offline') return !r.is_online;
				if (statusFilter === 'ws') return r.ws_only;
				return true;
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
	}, [rows, filter, sortField, direction, statusFilter]);

	const stats = useMemo(() => {
		const total = filteredSorted.length;
		const online = filteredSorted.filter(r => r.is_online).length;
		const wsOnly = filteredSorted.filter(r => r.ws_only).length;
		const masters = filteredSorted.filter(r => r.is_master).length;
		const companies = new Set(filteredSorted.map(r => r.company_code)).size;
		const locations = new Set(filteredSorted.map(r => r.location)).size;
		return { total, online, offline: total - online, wsOnly, masters, companies, locations };
	}, [filteredSorted]);

	// Calculate additional metrics
	const onlineRate = stats.total > 0 ? (stats.online / stats.total) * 100 : 0;
	const wsRate = stats.total > 0 ? (stats.wsOnly / stats.total) * 100 : 0;
	const masterRate = stats.total > 0 ? (stats.masters / stats.total) * 100 : 0;

	function setSort(field: 'company_code' | 'username') {
		if (field === sortField) {
			setDirection(direction === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setDirection('asc');
		}
	}

	function onExport() {
		if (!mounted || typeof window === 'undefined') return;
		
		const xhr = new XMLHttpRequest();
		const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
		const url = `${apiBaseUrl}/api/account`;
		
		xhr.open('GET', url, true);
		
		const token = getAuthToken()?.api_token || '';
		xhr.setRequestHeader("X-Access-Token", token);
		
		const headerParams = JSON.stringify({
			action: 'export',
			resource: 'user_stat'
		});
		xhr.setRequestHeader("X-Download-Params", headerParams);
		xhr.responseType = 'arraybuffer';
		
		xhr.onload = function () {
			if (this.status === 200) {
				let filename = "efactory-users.xlsx";
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
			}
		};
		
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send();
	}

	const clearFilters = () => {
		setFilter('');
		setStatusFilter('all');
	};

	const hasActiveFilters = filter || statusFilter !== 'all';

	if (!mounted) {
		return (
			<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color flex items-center justify-center'>
				<div className='text-font-color'>Loading...</div>
			</div>
		);
	}

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{/* Dashboard Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6'>
						<div>
							<h1 className='text-[24px]/[32px] font-bold text-font-color mb-2'>
								User Management Dashboard
							</h1>
							<p className='text-font-color-100 text-[16px]/[24px]'>
								Comprehensive user activity and access management across all accounts
							</p>
							{date && (
								<p className='text-[12px] text-font-color-100 mt-1'>Last updated: {new Date(date).toLocaleString()}</p>
							)}
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-3'>
							<button
								onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
								variant="outline"
							>
								{viewMode === 'table' ? <IconUsers className='w-4 h-4' /> : <IconDatabase className='w-4 h-4' />}
								{viewMode === 'table' ? 'Grid View' : 'Table View'}
							</button>
							<button 
								className='btn btn-secondary' 
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

					{/* Metrics Grid */}
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6'>
						{/* Total Users */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-4 border border-primary'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.total}</div>
									<div className='text-[12px]/[16px] text-white/80'>Total Users</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconUsers className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Online Users */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-4 border border-success'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.online}</div>
									<div className='text-[12px]/[16px] text-white/80'>Online</div>
									<div className='text-[10px]/[12px] text-white/60'>{onlineRate.toFixed(1)}%</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconWifi className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Offline Users */}
						<div className='card bg-gradient-to-br from-font-color-200 to-font-color-100 rounded-xl p-4 border border-font-color-200'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.offline}</div>
									<div className='text-[12px]/[16px] text-white/80'>Offline</div>
									<div className='text-[10px]/[12px] text-white/60'>{(100 - onlineRate).toFixed(1)}%</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconWifiOff className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* WS Only */}
						<div className='card bg-gradient-to-br from-info to-info-10 rounded-xl p-4 border border-info'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.wsOnly}</div>
									<div className='text-[12px]/[16px] text-white/80'>WS Only</div>
									<div className='text-[10px]/[12px] text-white/60'>{wsRate.toFixed(1)}%</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconSettings className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Master Users */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-4 border border-warning'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.masters}</div>
									<div className='text-[12px]/[16px] text-white/80'>Masters</div>
									<div className='text-[10px]/[12px] text-white/60'>{masterRate.toFixed(1)}%</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconShield className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>

						{/* Companies */}
						<div className='card bg-gradient-to-br from-secondary to-secondary-10 rounded-xl p-4 border border-secondary'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[24px]/[28px] font-bold text-white'>{stats.companies}</div>
									<div className='text-[12px]/[16px] text-white/80'>Companies</div>
									<div className='text-[10px]/[12px] text-white/60'>{stats.locations} locations</div>
								</div>
								<div className='w-[32px] h-[32px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBuilding className='w-[16px] h-[16px] text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Analytics Row */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
						{/* Top Companies by Users */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-primary-10 rounded-lg flex items-center justify-center'>
									<IconTarget className='w-[16px] h-[16px] text-primary' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Top Companies by User Count</h3>
							</div>
							<div className='space-y-3'>
								{Object.entries(
									filteredSorted.reduce((acc, user) => {
										acc[user.company_code] = (acc[user.company_code] || 0) + 1;
										return acc;
									}, {} as Record<string, number>)
								)
									.sort(([,a], [,b]) => b - a)
									.slice(0, 5)
									.map(([company, count], index) => (
									<div key={company} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-primary text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<div className='min-w-0'>
												<div className='text-[14px]/[18px] text-font-color font-medium truncate'>{company}</div>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-primary-10 rounded-full h-2'>
												<div 
													className='bg-primary h-2 rounded-full' 
													style={{ width: `${(count / Math.max(...Object.values(
														filteredSorted.reduce((acc, user) => {
															acc[user.company_code] = (acc[user.company_code] || 0) + 1;
															return acc;
														}, {} as Record<string, number>)
													))) * 100}%` }}
												/>
											</div>
											<span className='text-[12px]/[16px] text-font-color-100 font-mono'>{count}</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* User Status Breakdown */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-success-10 rounded-lg flex items-center justify-center'>
									<IconActivity className='w-[16px] h-[16px] text-success' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>User Status Breakdown</h3>
							</div>
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-success rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>Online</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>{stats.online}</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-font-color-200 rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>Offline</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>{stats.offline}</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-info rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>WS Only</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>{stats.wsOnly}</div>
								</div>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<div className='w-3 h-3 bg-warning rounded-full'></div>
										<span className='text-[14px]/[18px] text-font-color font-medium'>Master Users</span>
									</div>
									<div className='text-[14px]/[18px] text-font-color font-mono'>{stats.masters}</div>
								</div>
								<div className='border-t border-border-color pt-3'>
									<div className='flex items-center justify-between'>
										<span className='text-[16px]/[20px] text-font-color font-bold'>Total</span>
										<span className='text-[16px]/[20px] text-font-color font-bold'>{stats.total}</span>
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
										placeholder='Search users, companies, emails...' 
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
							<div className='flex items-center gap-3'>
								<Combobox
									value={statusFilter}
									onValueChange={setStatusFilter}
									options={[
										{ value: 'all', label: 'All Status' },
										{ value: 'online', label: 'Online Only' },
										{ value: 'offline', label: 'Offline Only' },
										{ value: 'ws', label: 'WS Only' }
									]}
									showSearch={false}
									placeholder="Select status..."
									className="min-w-[140px]"
								/>
								{hasActiveFilters && (
									<button
										className='btn btn-light-secondary flex items-center gap-2'
										onClick={clearFilters}
									>
										<IconX className='w-4 h-4' />
										Clear
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
											onClick={() => setSort('company_code')}
											className={`btn btn-sm ${sortField === 'company_code' ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											Company Code
											{sortField === 'company_code' && (
												direction === 'asc' ? <IconChevronUp className='w-3 h-3 ml-1' /> : <IconChevronDown className='w-3 h-3 ml-1' />
											)}
										</button>
										<button
											onClick={() => setSort('username')}
											className={`btn btn-sm ${sortField === 'username' ? 'btn-primary' : 'btn-outline-secondary'}`}
										>
											Username
											{sortField === 'username' && (
												direction === 'asc' ? <IconChevronUp className='w-3 h-3 ml-1' /> : <IconChevronDown className='w-3 h-3 ml-1' />
											)}
										</button>
									</div>
								</div>
								<div className='text-[12px]/[16px] text-font-color-100'>
									{filteredSorted.length} users
								</div>
							</div>
						</div>
					)}

					{viewMode === 'table' ? (
						<div className='bg-card-color border border-border-color rounded-xl overflow-hidden'>
							<div className='overflow-x-auto'>
								<table className='w-full min-w-[1000px]'>
									<thead className='bg-body-color border-b border-border-color'>
										<tr className='text-left text-font-color text-[13px] font-semibold'>
											<th className='py-3 px-4 w-[50px]'>#</th>
											<th className='py-3 px-4'>
												<button
													className='flex items-center gap-2 text-[12px]/[16px] font-bold text-primary uppercase tracking-wider hover:text-primary-80 w-full'
													onClick={() => setSort('username')}
												>
													Username
													{sortField === 'username' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='py-3 px-4'>
												<button
													className='flex items-center gap-2 text-[12px]/[16px] font-bold text-primary uppercase tracking-wider hover:text-primary-80 w-full'
													onClick={() => setSort('company_code')}
												>
													Company
													{sortField === 'company_code' && (
														direction === 'asc' ? <IconChevronUp className='w-3 h-3' /> : <IconChevronDown className='w-3 h-3' />
													)}
												</button>
											</th>
											<th className='py-3 px-4'>Email</th>
											<th className='py-3 px-4 text-center'>Type</th>
											<th className='py-3 px-4 text-center'>Status</th>
										</tr>
									</thead>
									<tbody>
										{loading ? (
											<tr>
												<td colSpan={6} className='px-4 py-8 text-center text-font-color-100'>
													<div className='flex items-center justify-center gap-2'>
														<IconRefresh className='w-4 h-4 animate-spin' />
														Loading user data...
													</div>
												</td>
											</tr>
										) : filteredSorted.length === 0 ? (
											<tr>
												<td colSpan={6} className='px-4 py-8 text-center text-font-color-100'>
													{filter ? 'No users match your search criteria' : 'No user data available'}
												</td>
											</tr>
										) : (
											filteredSorted.map((user, i) => (
												<tr key={user.row_id} className='border-b border-border-color hover:bg-primary-10 transition-colors'>
													<td className='py-2.5 px-4 text-font-color-100 text-[13px] font-medium'>{i + 1}</td>
													<td className='py-2.5 px-4'>
														<div className='flex items-center gap-3'>
															<div className='w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-[11px] font-semibold'>
																{user.username.substring(0, 2).toUpperCase()}
															</div>
															<div className='flex-1 flex items-center justify-between'>
																<div>
																	<div className='font-semibold text-font-color text-[14px]'>{user.username}</div>
																	<div className='bg-info-10 text-info py-0.5 rounded text-[12px] font-medium inline-block'>{user.company_code}</div>
																</div>
																{user.is_master && (
																	<span className='bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-semibold'>
																		MASTER
																	</span>
																)}
															</div>
														</div>
													</td>
													<td className='py-2.5 px-4'>
														<div className='font-semibold text-font-color text-[14px]'>{user.account_number} - {user.location}</div>
														<div className='text-font-color-100 text-[13px]'>{user.company_name}</div>
													</td>
													<td className='py-2.5 px-4'>
														{user.email && (
															<span className='text-font-color text-[13px]'>{user.email}</span>
														)}
													</td>
													<td className='py-2.5 px-4 text-center'>
														{user.ws_only && (
															<span className='bg-info-10 text-info px-2 py-1 rounded text-[11px] font-medium'>
																WS
															</span>
														)}
													</td>
													<td className='py-2.5 px-4 text-center'>
														<span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-medium ${
															user.is_online 
																? 'bg-success-10 text-success border border-success' 
																: 'bg-font-color-10 text-font-color-100'
														}`}>
															<div className={`w-2 h-2 rounded-full ${
																user.is_online ? 'bg-success' : 'bg-font-color-100'
															}`}></div>
															{user.is_online ? 'Online' : 'Offline'}
														</span>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
							{filteredSorted.map((user) => (
								<UserCard key={user.row_id} user={user} />
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
								{filter ? 'No users found' : 'No user data available'}
							</h3>
							<p className='text-font-color-100 text-[16px]/[24px] max-w-md mx-auto'>
								{filter ? 'Try adjusting your search terms or clear the filter.' : 'No user data available.'}
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

function UserCard({ user }: { user: UserStatRow }) {
	return (
		<div className='card bg-card-color rounded-lg p-4 border transition-all duration-200 hover:shadow-shadow-lg border-dashed border-border-color'>
			{/* Header */}
			<div className='flex items-center justify-between mb-3'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-[12px] font-semibold'>
						{user.username.substring(0, 2).toUpperCase()}
					</div>
					<div>
						<div className='text-[16px]/[20px] font-bold text-font-color'>
							{user.username}
						</div>
						<div className='text-[12px]/[16px] text-font-color-100'>
							{user.company_code}
						</div>
					</div>
				</div>
				<div className='flex flex-col items-end gap-1'>
					{user.is_master && (
						<span className='bg-orange-500 text-white text-[10px]/[12px] px-2 py-1 rounded-full font-semibold'>MASTER</span>
					)}
					<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
						user.is_online 
							? 'bg-success-10 text-success' 
							: 'bg-font-color-10 text-font-color-100'
					}`}>
						<div className={`w-1.5 h-1.5 rounded-full ${
							user.is_online ? 'bg-success' : 'bg-font-color-100'
						}`}></div>
						{user.is_online ? 'Online' : 'Offline'}
					</span>
				</div>
			</div>

			{/* Company Info */}
			<div className='mb-3'>
				<div className='text-[14px]/[18px] font-semibold text-font-color mb-1'>
					{user.account_number} - {user.location}
				</div>
				<div className='text-[12px]/[16px] text-font-color-100'>{user.company_name}</div>
			</div>

			{/* Email */}
			{user.email && (
				<div className='mb-3'>
					<div className='text-[12px]/[16px] text-font-color-100'>Email</div>
					<div className='text-[12px]/[16px] text-font-color'>{user.email}</div>
				</div>
			)}

			{/* Type */}
			{user.ws_only && (
				<div className='flex items-center gap-2'>
					<span className='bg-info-10 text-info px-2 py-1 rounded text-[10px] font-medium'>
						WS Only
					</span>
				</div>
			)}
		</div>
	);
}

export default UsersPage;
