import { useEffect, useMemo, useState } from 'react';
import { postJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';
import { IconSearch, IconRefresh, IconDownload, IconUsers, IconX } from '@tabler/icons-react';
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
		return { total, online, offline: total - online, wsOnly };
	}, [filteredSorted]);


	function onExport() {
		if (!mounted || typeof window === 'undefined') return;
		
		// Use the same legacy pattern as license-summary
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
			{/* Header Section */}
			<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
				<div>
					<h1 className='text-[28px]/[36px] font-bold text-font-color mb-2'>eFactory Users</h1>
					{date && (
						<p className='text-[12px] text-font-color-100 mt-1'>Last updated: {new Date(date).toLocaleString()}</p>
					)}
				</div>
				<div className='flex items-center gap-3'>
					<button 
						className='btn btn-light-secondary' 
						onClick={load} 
						disabled={loading}
						title='Refresh Data'
					>
						<IconRefresh className={`w-4 h-4 me-2 ${loading ? 'animate-spin' : ''}`} />
						Refresh
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

			{/* Quick Stats Bar */}
			<div className='bg-card-color border border-border-color rounded-xl p-4 mb-6'>
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
					<div className='text-center'>
						<div className='text-[20px] font-bold text-font-color'>{stats.total}</div>
						<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Total Users</div>
					</div>
					<div className='text-center'>
						<div className='text-[20px] font-bold text-success'>{stats.online}</div>
						<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Online</div>
					</div>
					<div className='text-center'>
						<div className='text-[20px] font-bold text-font-color-100'>{stats.offline}</div>
						<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>Offline</div>
					</div>
					<div className='text-center'>
						<div className='text-[20px] font-bold text-info'>{stats.wsOnly}</div>
						<div className='text-[12px] text-font-color-100 uppercase tracking-wide'>WS Only</div>
					</div>
				</div>
			</div>

			{/* Search, Filters and Sort */}
			<div className='bg-card-color border border-border-color rounded-xl p-4 mb-6'>
				<div className='flex flex-col xl:flex-row gap-4'>
					{/* Search */}
					<div className='flex-1'>
						<div className='relative'>
							<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
							<input 
								className='form-control pl-9 pr-3 py-2 text-[14px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors'
								placeholder='Search users, companies, emails...'
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
							/>
						</div>
					</div>

					{/* Filters and Sort */}
					<div className='flex flex-col sm:flex-row items-start sm:items-center gap-3'>
						{/* Status Filter */}
						<div className='min-w-[140px]'>
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
							/>
						</div>

						{/* Sort Options */}
						<div className='flex items-center gap-2'>
							<span className='text-font-color-100 text-[13px] font-medium whitespace-nowrap'>Sort:</span>
							<button
								className={`px-2 py-1 rounded text-[12px] font-medium transition-colors ${
									sortField === 'company_code'
										? 'bg-primary text-white'
										: 'bg-primary-10 text-primary hover:bg-primary hover:text-white'
								}`}
								onClick={() => setSortField('company_code')}
							>
								Company Code
							</button>
							<button
								className={`px-2 py-1 rounded text-[12px] font-medium transition-colors ${
									sortField === 'username'
										? 'bg-primary text-white'
										: 'bg-primary-10 text-primary hover:bg-primary hover:text-white'
								}`}
								onClick={() => setSortField('username')}
							>
								Name
							</button>
							<button
								className='px-2 py-1 rounded text-[12px] font-medium bg-font-color-10 text-font-color-100 hover:bg-font-color-200 transition-colors'
								onClick={() => setDirection(direction === 'asc' ? 'desc' : 'asc')}
							>
								{direction === 'asc' ? '↑' : '↓'}
							</button>
						</div>

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

			{/* Data Table */}
			<div className='bg-card-color border border-border-color rounded-xl overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full min-w-[1000px]'>
						<thead className='bg-primary-5 border-b border-border-color'>
							<tr className='text-left text-font-color text-[13px] font-semibold'>
								<th className='py-3 px-4 w-[50px]'>#</th>
								<th className='py-3 px-4'>
									Username
								</th>
								<th className='py-3 px-4'>
									Company
								</th>
								<th className='py-3 px-4'>
									Email
								</th>
								<th className='py-3 px-4 text-center'>Type</th>
								<th className='py-3 px-4 text-center'>Status</th>
							</tr>
						</thead>
						<tbody>
							{filteredSorted.map((user, i) => (
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
							))}
						</tbody>
					</table>
				</div>

				{/* Table Footer */}
				<div className='bg-primary-5 border-t border-border-color px-4 py-3'>
					<div className='flex items-center justify-between text-[13px] text-font-color-100'>
						<div>
							Showing <span className='font-semibold text-font-color'>{filteredSorted.length}</span> of <span className='font-semibold text-font-color'>{rows.length}</span> users
						</div>
						<div className='flex items-center gap-4'>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-success rounded-full'></div>
								<span>Online ({stats.online})</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-font-color-100 rounded-full'></div>
								<span>Offline ({stats.offline})</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{filteredSorted.length === 0 && (
				<div className='bg-card-color border border-border-color rounded-xl p-8 text-center mt-6'>
					<IconUsers className='w-12 h-12 text-font-color-100 mx-auto mb-3' />
					<h3 className='text-font-color font-semibold mb-2'>No users found</h3>
					<p className='text-font-color-100'>Try adjusting your search or filter criteria</p>
				</div>
			)}
		</div>
	);
}

export default UsersPage;