import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getAuthToken, setAuthToken } from '@/lib/auth/storage';
import { loginForAccount } from '@/lib/api/auth';
import type { AvailableAccountItem } from '@/lib/api/models/auth';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { 
	IconSearch, 
	IconBuilding, 
	IconMapPin, 
	IconUsers, 
	IconCheck, 
	IconClock,
	IconTrendingUp,
	IconShield,
	IconDots,
	IconChartBar,
	IconCalendar,
	IconFilter,
	IconSortAscending,
	IconSortDescending,
	IconChevronDown,
	IconEye,
	IconLogin,
	IconDatabase,
	IconActivity,
	IconWorld,
	IconSettings
} from '@tabler/icons-react';
import Button from '@/components/ui/Button';

function getInitials(username: string) {
	return (username || '')
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, 3);
}

function LoginUserPageInner() {
	const router = useRouter();
	const [filter, setFilter] = useState('');
	const [selectedUsername, setSelectedUsername] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);
	const [accounts, setAccounts] = useState<AvailableAccountItem[]>([]);
	const [sortField, setSortField] = useState<'company' | 'location' | 'edi'>('company');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
	const [analyticsView, setAnalyticsView] = useState<'edi' | 'complexity' | 'activity'>('complexity');
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const token = getAuthToken();
		const list = Array.isArray(token?.available_accounts) ? token!.available_accounts : [];
		setAccounts(list);
	}, []);

	useEffect(() => {
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, []);

	// Handle Enter key press
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Enter' && selectedUsername && !submitting) {
				handleProceed();
			}
		};

		document.addEventListener('keydown', handleKeyPress);
		return () => {
			document.removeEventListener('keydown', handleKeyPress);
		};
	}, [selectedUsername, submitting]);

	const filtered = useMemo(() => {
		const q = filter.trim().toLowerCase();
		let list = accounts;
		if (q) {
			list = list.filter((acc) =>
				acc.username.toLowerCase().includes(q) ||
				(acc.company || '').toLowerCase().includes(q) ||
				(acc.location || '').toLowerCase().includes(q) ||
				(acc.is_EDI ? 'edi' : '').includes(q),
			);
		}
		return [...list].sort((a, b) => {
			let aValue, bValue;
			
			switch (sortField) {
				case 'company':
					aValue = (a.company || '').toLowerCase();
					bValue = (b.company || '').toLowerCase();
					break;
				case 'location':
					aValue = (a.location || '').toLowerCase();
					bValue = (b.location || '').toLowerCase();
					break;
				case 'edi':
					aValue = a.is_EDI ? 1 : 0;
					bValue = b.is_EDI ? 1 : 0;
					break;
				default:
					aValue = (a.company || '').toLowerCase();
					bValue = (b.company || '').toLowerCase();
			}
			
			if (sortField === 'edi') {
				return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
			} else {
				return sortDirection === 'asc' 
					? (aValue as string).localeCompare(bValue as string)
					: (bValue as string).localeCompare(aValue as string);
			}
		});
	}, [accounts, filter, sortField, sortDirection]);

	// Auto-select single result or deselect multiple results
	useEffect(() => {
		if (filtered.length === 1) {
			// Auto-select the single result
			setSelectedUsername(filtered[0]?.username || '');
		} else if (filtered.length > 1 && selectedUsername) {
			// Check if currently selected user is still in filtered results
			const isStillInResults = filtered.some(acc => acc.username === selectedUsername);
			if (!isStillInResults) {
				// Deselect if current selection is no longer in results
				setSelectedUsername('');
			}
		}
	}, [filtered, selectedUsername]);

	async function handleProceed() {
		if (!selectedUsername || submitting) return;
		setSubmitting(true);
		try {
			const res = await loginForAccount(selectedUsername);
			
			// For admin impersonation, we need to preserve the original admin context
			// while setting the customer's user_data and apps
			const currentAuth = getAuthToken();
			setAuthToken({
				api_token: res.data.api_token,
				available_accounts: currentAuth?.available_accounts || [], // Keep original admin accounts for "Back to DCL Menu"
				admin_roles: res.data.admin_roles || [],
				user_data: {
					...res.data.user_data,
					// Preserve admin role information for the "Back to DCL Menu" functionality
					roles: [...(res.data.user_data.roles || []), ...(currentAuth?.user_data?.roles?.includes('ADM') ? ['ADM'] : [])],
					apps: res.data.user_data.apps ? res.data.user_data.apps.map((app: any) => typeof app === 'string' ? parseInt(app) : app) : []
				},
			});
			router.replace('/');
		} catch (e) {
			setSubmitting(false);
		}
	}

	// Calculate comprehensive statistics
	const totalAccounts = accounts.length;
	const ediAccounts = accounts.filter(acc => acc.is_EDI).length;
	const standardAccounts = totalAccounts - ediAccounts;
	const uniqueCompanies = new Set(accounts.map(acc => acc.company)).size;
	
	const allLocations = accounts.flatMap(acc => 
		String(acc.location || '').split(',').map(l => l.trim()).filter(Boolean)
	);
	const uniqueLocations = new Set(allLocations).size;
	
	// Location distribution
	const locationDistribution = allLocations.reduce((acc, loc) => {
		acc[loc] = (acc[loc] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const topLocations = Object.entries(locationDistribution)
		.sort(([,a], [,b]) => b - a)
		.slice(0, 5);

	// EDI vs Standard distribution by company
	const companyEDIDistribution = accounts.reduce((acc, account) => {
		const company = (account.company || '').replace(/^\d+\s*-\s*/, '');
		if (!acc[company]) {
			acc[company] = { total: 0, edi: 0, standard: 0 };
		}
		acc[company].total += 1;
		if (account.is_EDI) {
			acc[company].edi += 1;
		} else {
			acc[company].standard += 1;
		}
		return acc;
	}, {} as Record<string, { total: number; edi: number; standard: number }>);

	// Most EDI-enabled companies (companies with highest EDI percentage)
	const ediEnabledCompanies = Object.entries(companyEDIDistribution)
		.map(([company, data]) => ({
			company,
			...data,
			ediPercentage: (data.edi / data.total) * 100
		}))
		.filter(item => item.total >= 2) // Only companies with 2+ accounts
		.sort((a, b) => b.ediPercentage - a.ediPercentage)
		.slice(0, 5);

	// Account complexity analysis (accounts with most locations)
	const accountComplexity = accounts
		.map(account => ({
			username: account.username,
			company: (account.company || '').replace(/^\d+\s*-\s*/, ''),
			locationCount: account.location ? account.location.split(',').filter(l => l.trim()).length : 0,
			isEDI: account.is_EDI
		}))
		.sort((a, b) => b.locationCount - a.locationCount)
		.slice(0, 5);

	// Recent activity simulation (based on account characteristics)
	const recentActivity = accounts
		.map(account => ({
			username: account.username,
			company: (account.company || '').replace(/^\d+\s*-\s*/, ''),
			activityScore: (account.is_EDI ? 85 : 60) + (account.location ? account.location.split(',').length * 5 : 0),
			lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last week
			isEDI: account.is_EDI
		}))
		.sort((a, b) => b.activityScore - a.activityScore)
		.slice(0, 5);

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{submitting && <LoadingOverlay text='Switching account...' />}
			
			{/* Dashboard Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6'>
						<div>
							<h1 className='text-[24px]/[32px] font-bold text-font-color mb-2'>
								Account Management Dashboard
							</h1>
							<p className='text-font-color-100 text-[16px]/[24px]'>
								Comprehensive view of all available accounts and system metrics
							</p>
						</div>
						
						{/* Quick Actions */}
						<div className='flex items-center gap-3'>
						<Button
							onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
							disabled={false}
						>
								{viewMode === 'grid' ? <IconChartBar className='w-4 h-4' /> : <IconUsers className='w-4 h-4' />}
								{viewMode === 'grid' ? 'Table View' : 'Grid View'}
							</Button>
							{selectedUsername && (
								<Button
									onClick={handleProceed}
									disabled={submitting}
								>
									<IconLogin className='w-4 h-4' />
									{submitting ? 'Processing...' : 'Access Account'}
								</Button>
							)}
						</div>
					</div>

					{/* Metrics Grid */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
						{/* Total Accounts */}
						<div className='card bg-gradient-to-br from-primary to-primary-10 rounded-xl p-6 border border-primary'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{totalAccounts}</div>
									<div className='text-[14px]/[20px] text-white/80'>Total Accounts</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconDatabase className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* EDI Accounts */}
						<div className='card bg-gradient-to-br from-success to-success-10 rounded-xl p-6 border border-success'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{ediAccounts}</div>
									<div className='text-[14px]/[20px] text-white/80'>EDI Accounts</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{((ediAccounts / totalAccounts) * 100).toFixed(1)}% of total
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
									<div className='text-[14px]/[20px] text-white/80'>Unique Companies</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconBuilding className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>

						{/* Locations */}
						<div className='card bg-gradient-to-br from-warning to-warning-10 rounded-xl p-6 border border-warning'>
							<div className='flex items-center justify-between'>
								<div>
									<div className='text-[32px]/[40px] font-bold text-white'>{uniqueLocations}</div>
									<div className='text-[14px]/[20px] text-white/80'>Active Locations</div>
									<div className='text-[12px]/[16px] text-white/60'>
										{(allLocations.length / uniqueLocations).toFixed(1)} avg accounts per location
									</div>
								</div>
								<div className='w-[48px] h-[48px] bg-white/20 rounded-lg flex items-center justify-center'>
									<IconWorld className='w-[24px] h-[24px] text-white' />
								</div>
							</div>
						</div>
					</div>

					{/* Analytics Row */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
						{/* Top Locations */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-primary-10 rounded-lg flex items-center justify-center'>
									<IconMapPin className='w-[16px] h-[16px] text-primary' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>Top Locations</h3>
							</div>
							<div className='space-y-3'>
								{topLocations.map(([location, count], index) => (
									<div key={`location-${index}-${location}`} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-primary text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<span className='text-[14px]/[18px] text-font-color font-medium'>{location}</span>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-primary-10 rounded-full h-2'>
												<div 
													className='bg-primary h-2 rounded-full' 
													style={{ width: `${(count / (topLocations[0]?.[1] || 1)) * 100}%` }}
												/>
											</div>
											<span className='text-[12px]/[16px] text-font-color-100 font-mono'>{count}</span>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Account Distribution Analysis */}
						<div className='card bg-card-color rounded-xl p-6 border border-dashed border-border-color'>
							<div className='flex items-center gap-3 mb-4'>
								<div className='w-[32px] h-[32px] bg-info-10 rounded-lg flex items-center justify-center'>
									<IconMapPin className='w-[16px] h-[16px] text-info' />
								</div>
								<h3 className='text-[16px]/[22px] font-semibold text-font-color'>
									Multi-Location Accounts
								</h3>
							</div>
							<div className='space-y-3'>
								{accountComplexity.map((item, index) => (
									<div key={`complexity-${index}-${item.username}`} className='flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<div className='w-[24px] h-[24px] bg-info text-white rounded-md flex items-center justify-center text-[12px] font-bold'>
												{index + 1}
											</div>
											<div className='min-w-0'>
												<div className='text-[14px]/[18px] text-font-color font-medium truncate'>{item.username}</div>
												<div className='text-[11px]/[14px] text-font-color-100 truncate'>{item.company}</div>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<div className='w-[60px] bg-info-10 rounded-full h-2'>
												<div 
													className='bg-info h-2 rounded-full' 
													style={{ width: `${(item.locationCount / (accountComplexity[0]?.locationCount || 1)) * 100}%` }}
												/>
											</div>
											<div className='text-right'>
												<div className='text-[12px]/[16px] text-font-color-100 font-mono'>{item.locationCount}</div>
												<div className='text-[10px]/[12px] text-font-color-100'>locations</div>
											</div>
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
										placeholder='Search accounts, companies, locations...' 
										value={filter} 
										onChange={(e) => setFilter(e.target.value)} 
									/>
								</div>
								<span className='text-font-color-100 text-[14px]/[20px] whitespace-nowrap'>
									{filtered.length} of {totalAccounts} accounts
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Accounts Display */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					{viewMode === 'grid' ? (
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
							{filtered.map((account, index) => (
								<AccountCard
									key={`account-card-${index}-${account.username}`}
									account={account}
									index={index}
									isSelected={selectedUsername === account.username}
									onSelect={setSelectedUsername}
									onProceed={handleProceed}
									submitting={submitting}
								/>
							))}
						</div>
					) : (
						<div className='card bg-card-color rounded-lg border border-dashed border-border-color overflow-hidden'>
							{/* Table Header */}
							<div className='bg-primary-5 border-b border-border-color px-6 py-3'>
								<div className='grid grid-cols-12 gap-4 items-center text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider'>
									<div className='col-span-1'>#</div>
									<div className='col-span-1'>Company Code</div>
									<div className='col-span-3'>Account # / Company Name</div>
									<div className='col-span-3'>Locations</div>
									<div className='col-span-2'>Type</div>
									<div className='col-span-2'>Actions</div>
								</div>
							</div>

							{/* Table Body */}
							<div className='divide-y divide-border-color'>
								{filtered.map((account, index) => (
									<AccountTableRow
										key={`account-table-${index}-${account.username}`}
										account={account}
										index={index}
										isSelected={selectedUsername === account.username}
										onSelect={setSelectedUsername}
										onProceed={handleProceed}
										submitting={submitting}
									/>
								))}
							</div>
						</div>
					)}

					{/* Empty State */}
					{filtered.length === 0 && (
						<div className='text-center py-16'>
							<div className='w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-primary-10 flex items-center justify-center'>
								<IconSearch className='w-[40px] h-[40px] text-primary' />
							</div>
							<h3 className='text-[24px]/[30px] font-semibold mb-3'>No accounts found</h3>
							<p className='text-font-color-100 text-[16px]/[24px] max-w-md mx-auto'>
								We couldn't find any accounts matching your search criteria.
							</p>
						<Button
							onClick={() => setFilter('')} 
							variant="outline"
							disabled={false}
						>
								Clear Search
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function AccountCard({ account, index, isSelected, onSelect, onProceed, submitting }: {
	account: AvailableAccountItem;
	index: number;
	isSelected: boolean;
	onSelect: (username: string) => void;
	onProceed: () => void;
	submitting: boolean;
}) {
	const initials = getInitials(account.username);
	const locTokens = String(account.location || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 2);

	const accountNumber = (account.company || '').match(/^\d+/)?.[0] || account.username;
	const companyName = (account.company || '').replace(/^\d+\s*-\s*/, '');

	return (
		<div
			className={`card bg-card-color rounded-lg p-4 border transition-all duration-200 cursor-pointer hover:shadow-shadow-lg ${
				isSelected 
					? 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary-10' 
					: 'border-dashed border-border-color hover:border-primary'
			}`}
			onClick={() => onSelect(account.username)}
		>
			{/* Header */}
			<div className='flex items-center justify-between mb-3'>
				<div className='w-[40px] h-[40px] bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-[14px] font-bold'>
					{initials}
				</div>
				<div className='flex items-center gap-2'>
					{account.is_EDI ? (
						<>
							<IconShield className='w-[16px] h-[16px] text-success' />
							<span className='text-[12px]/[16px] text-success font-medium'>EDI</span>
						</>
					) : (
						<>
							<IconUsers className='w-[16px] h-[16px] text-font-color-100' />
							<span className='text-[12px]/[16px] text-font-color-100'>STD</span>
						</>
					)}
				</div>
			</div>

			{/* Company Info */}
			<div className='mb-2'>
				<div className='text-[16px]/[20px] font-bold text-font-color mb-0.5'>
					{accountNumber}
				</div>
				<div className='text-[12px]/[16px] text-font-color-100 truncate'>
					{companyName}
				</div>
			</div>

			{/* Locations + Action */}
			<div className='mt-2'>
				<div className='flex items-center justify-between gap-3'>
					{/* Locations */}
					{locTokens.length > 0 ? (
						<div className='flex flex-wrap gap-1'>
							{locTokens.map((location, idx) => (
								<span 
									key={`${account.username}-location-${idx}-${location}`} 
									className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[12px] uppercase font-medium'
								>
									{location}
								</span>
							))}
							{account.location && account.location.split(',').length > 2 && (
								<span className='px-2 py-1 rounded-md bg-primary-10 text-primary text-[10px]/[12px] font-medium'>
									+{account.location.split(',').length - 2}
								</span>
							)}
						</div>
					) : (
						<div />
					)}

					{/* Action */}
					<div className='shrink-0'>
						<Button 
							onClick={onProceed}
							disabled={!isSelected || submitting}
							className='px-4 py-2 text-[12px]'
						>
							{submitting ? 'Processing...' : 'Access'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function AccountTableRow({ account, index, isSelected, onSelect, onProceed, submitting }: {
	account: AvailableAccountItem;
	index: number;
	isSelected: boolean;
	onSelect: (username: string) => void;
	onProceed: () => void;
	submitting: boolean;
}) {
	const initials = getInitials(account.username);
	const locTokens = String(account.location || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 3);

	const accountNumber = (account.company || '').match(/^\d+/)?.[0] || account.username;
	const companyName = (account.company || '').replace(/^\d+\s*-\s*/, '');

	return (
		<div
			className={`px-6 py-4 transition-all duration-200 cursor-pointer hover:bg-primary-5 ${
				isSelected ? 'bg-primary-10 border-l-4 border-l-primary' : ''
			}`}
			onClick={() => onSelect(account.username)}
		>
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

				{/* Company */}
				<div className='col-span-3 min-w-0'>
					<div className='text-[14px]/[18px] font-semibold text-font-color truncate'>
						{accountNumber}
					</div>
					<div className='text-[12px]/[16px] text-font-color-100 truncate'>
						{companyName}
					</div>
				</div>

				{/* Locations */}
				<div className='col-span-3'>
					{locTokens.length > 0 ? (
						<div className='flex flex-wrap gap-1'>
							{locTokens.map((location, idx) => (
								<span 
									key={`${account.username}-table-location-${idx}-${location}`} 
									className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[12px] uppercase font-medium'
								>
									{location}
								</span>
							))}
							{account.location && account.location.split(',').length > 3 && (
								<span className='px-2 py-1 rounded-md bg-primary-10 text-primary text-[10px]/[12px] font-medium'>
									+{account.location.split(',').length - 3}
								</span>
							)}
						</div>
					) : (
						<span className='text-[12px]/[16px] text-font-color-100'>No locations</span>
					)}
				</div>

				{/* Type */}
				<div className='col-span-2'>
					<div className='flex items-center gap-2'>
						{account.is_EDI ? (
							<>
								<IconShield className='w-[14px] h-[14px] text-success' />
								<span className='text-[12px]/[16px] text-success font-medium'>EDI</span>
							</>
						) : (
							<>
								<IconUsers className='w-[14px] h-[14px] text-font-color-100' />
								<span className='text-[12px]/[16px] text-font-color-100'>Standard</span>
							</>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className='col-span-2'>
					<div className='flex items-center gap-2'>
						<Button
							onClick={onProceed}
							className='btn btn-sm btn-success'
							disabled={!isSelected || submitting}
						>
							<IconLogin className='w-[14px] h-[14px]' />
							{submitting ? 'Processing...' : 'Login'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function LoginUserPage() {
	return <LoginUserPageInner />;
}

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: false
    }
  };
}

export default dynamic(() => Promise.resolve(LoginUserPage), { ssr: false });