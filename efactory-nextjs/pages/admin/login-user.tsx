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
	IconCalendar
} from '@tabler/icons-react';

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
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const token = getAuthToken();
		const list = Array.isArray(token?.available_accounts) ? (token!.available_accounts as any) : [];
		setAccounts(list);
	}, []);

	useEffect(() => {
		// Focus the search input when component mounts
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, []);

	const filtered = useMemo(() => {
		const q = filter.trim().toLowerCase();
		let list = accounts;
		if (q) {
			list = list.filter((acc) =>
				acc.username.toLowerCase().includes(q) ||
				acc.company.toLowerCase().includes(q) ||
				acc.location.toLowerCase().includes(q) ||
				(acc.is_EDI ? 'edi' : '').includes(q),
			);
		}
		return [...list].sort((a, b) => {
			// Extract account numbers from company names
			const aAccountNum = a.company.match(/^\d+/)?.[0] || a.username;
			const bAccountNum = b.company.match(/^\d+/)?.[0] || b.username;
			
			// Sort by account number (numeric comparison)
			const aNum = parseInt(aAccountNum, 10) || 0;
			const bNum = parseInt(bAccountNum, 10) || 0;
			
			if (aNum !== bNum) {
				return aNum - bNum; // Numeric sort for account numbers
			}
			
			// If account numbers are the same, sort by company name
			const aCompany = a.company.replace(/^\d+\s*-\s*/, '').toLowerCase();
			const bCompany = b.company.replace(/^\d+\s*-\s*/, '').toLowerCase();
			return aCompany < bCompany ? -1 : aCompany > bCompany ? 1 : 0;
		});
	}, [accounts, filter]);


	async function handleProceed() {
		if (!selectedUsername || submitting) return;
		setSubmitting(true);
		try {
			const res = await loginForAccount(selectedUsername);
			setAuthToken({
				api_token: res.data.api_token,
				available_accounts: [],
				admin_roles: res.data.admin_roles,
				user_data: res.data.user_data,
			});
			router.replace('/');
		} catch (e) {
			setSubmitting(false);
		}
	}

	// Calculate statistics
	const totalAccounts = accounts.length;
	const ediAccounts = accounts.filter(acc => acc.is_EDI).length;
	const uniqueCompanies = new Set(accounts.map(acc => acc.company)).size;
	const uniqueLocations = new Set(
		accounts.flatMap(acc => 
			String(acc.location || '').split(',').map(l => l.trim()).filter(Boolean)
		)
	).size;

	// Calculate location insights with companies and accounts
	const locationInsights = accounts.reduce((acc, account) => {
		const locations = account.location ? account.location.split(',').map(l => l.trim()).filter(Boolean) : [];
		locations.forEach(loc => {
			if (!acc[loc]) {
				acc[loc] = { accounts: 0, companies: new Set() };
			}
			acc[loc].accounts += 1;
			acc[loc].companies.add(account.company);
		});
		return acc;
	}, {} as Record<string, { accounts: number; companies: Set<string> }>);
	
	const topLocations = Object.entries(locationInsights)
		.map(([location, data]) => ({
			location: location.slice(0, 3).toUpperCase(), // Show only 3 letters
			accounts: data.accounts,
			companies: data.companies.size
		}))
		.sort((a, b) => {
			// Always sort by account count first (highest first), then by location code
			const accountCompare = b.accounts - a.accounts;
			return accountCompare !== 0 ? accountCompare : a.location.localeCompare(b.location);
		})
		.slice(0, 5);

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{submitting && <LoadingOverlay text='Switching account...' />}
			
			{/* Compact Header */}
			<div className='container-fluid mb-4'>
				<div className='max-w-[1400px] mx-auto'>
					{/* Title and Stats Row */}
					<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
						<div>
							<h1 className='text-[20px]/[28px] md:text-[24px]/[32px] font-bold text-font-color'>
								Login to eFactory
							</h1>
							<p className='text-font-color-100 text-[14px]/[20px]'>
								Welcome back! Select an account to continue to eFactory.
							</p>
						</div>
						
						{/* Inline Quick Stats */}
						<div className='flex items-center gap-6'>
							<div className='flex items-center gap-2'>
								<div className='w-[24px] h-[24px] rounded-md flex items-center justify-center text-white bg-success'>
									<IconBuilding className='w-[12px] h-[12px]' />
								</div>
								<div className='text-right'>
									<div className='text-[16px]/[20px] font-semibold text-font-color'>{uniqueCompanies}</div>
									<div className='text-[10px]/[12px] text-font-color-100'>Companies</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-[24px] h-[24px] rounded-md flex items-center justify-center text-white bg-info'>
									<IconShield className='w-[12px] h-[12px]' />
								</div>
								<div className='text-right'>
									<div className='text-[16px]/[20px] font-semibold text-font-color'>{ediAccounts}</div>
									<div className='text-[10px]/[12px] text-font-color-100'>EDI</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-[24px] h-[24px] rounded-md flex items-center justify-center text-white bg-warning'>
									<IconMapPin className='w-[12px] h-[12px]' />
								</div>
								<div className='text-right'>
									<div className='text-[16px]/[20px] font-semibold text-font-color'>{uniqueLocations}</div>
									<div className='text-[10px]/[12px] text-font-color-100'>Locations</div>
								</div>
							</div>
						</div>
					</div>

					{/* Quick Info Bar */}
					<div className='card bg-card-color rounded-lg p-3 border border-dashed border-border-color'>
						<div className='flex flex-wrap items-center justify-between gap-4'>
							<div className='flex items-center gap-4'>
								<div className='flex items-center gap-2'>
									<span className='text-[12px]/[16px] text-font-color-100'>Account Types:</span>
									<span className='px-2 py-1 rounded-md bg-success text-white text-[10px]/[12px] font-medium'>
										{ediAccounts} EDI
									</span>
									<span className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[12px] font-medium'>
										{totalAccounts - ediAccounts} Standard
									</span>
								</div>
								{topLocations.length > 0 && (
									<div className='flex items-center gap-2'>
										<span className='text-[12px]/[16px] text-font-color-100'>Top:</span>
										{topLocations.slice(0, 3).map((locationData) => (
											<span key={locationData.location} className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[12px] font-bold'>
												{locationData.location} ({locationData.accounts})
											</span>
										))}
									</div>
								)}
							</div>
							<div className='text-[11px]/[14px] text-font-color-100'>
								💡 Search by company name, location, or "EDI"
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
										placeholder='Search accounts, companies, locations...' 
										value={filter} 
										onChange={(e) => setFilter(e.target.value)} 
									/>
								</div>
								<span className='text-font-color-100 text-[14px]/[20px] whitespace-nowrap'>
									{filtered.length} of {totalAccounts} accounts
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() => setViewMode('grid')}
									className={`p-2 rounded-lg transition-colors ${
										viewMode === 'grid' 
											? 'bg-primary text-white' 
											: 'bg-primary-10 text-primary hover:bg-primary hover:text-white'
									}`}
								>
									<IconChartBar className='w-[16px] h-[16px]' />
								</button>
								<button
									onClick={() => setViewMode('list')}
									className={`p-2 rounded-lg transition-colors ${
										viewMode === 'list' 
											? 'bg-primary text-white' 
											: 'bg-primary-10 text-primary hover:bg-primary hover:text-white'
									}`}
								>
									<IconUsers className='w-[16px] h-[16px]' />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Accounts Display */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1400px] mx-auto'>
					{viewMode === 'grid' ? (
						<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
							{filtered.map((account, index) => (
								<AccountCard
									key={account.username}
									account={account}
									index={index}
									isSelected={selectedUsername === account.username}
									onSelect={setSelectedUsername}
									onProceed={handleProceed}
									submitting={submitting}
									totalCount={filtered.length}
								/>
							))}
						</div>
					) : (
						<div className='space-y-4'>
							{filtered.map((account, index) => (
								<AccountListItem
									key={account.username}
									account={account}
									index={index}
									isSelected={selectedUsername === account.username}
									onSelect={setSelectedUsername}
									onProceed={handleProceed}
									submitting={submitting}
									totalCount={filtered.length}
								/>
							))}
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
								We couldn't find any accounts matching your search criteria. Try adjusting your search terms or clear the filter.
							</p>
							<button 
								onClick={() => setFilter('')}
								className='btn btn-outline-primary mt-4'
							>
								Clear Search
							</button>
						</div>
					)}

				</div>
			</div>
		</div>
	);
}

function AccountCard({ account, index, isSelected, onSelect, onProceed, submitting, totalCount }: {
	account: AvailableAccountItem;
	index: number;
	isSelected: boolean;
	onSelect: (username: string) => void;
	onProceed: () => void;
	submitting: boolean;
	totalCount: number;
}) {
	const initials = getInitials(account.username);
	const locTokens = String(account.location || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 3);

	// Calculate metrics from available data
	const accountMetrics = {
		accountNumber: index + 1,
		isEDI: account.is_EDI || false,
		locationCount: account.location ? account.location.split(',').filter(l => l.trim()).length : 0
	};

	return (
		<div
			className={`card bg-card-color rounded-xl p-6 border border-dashed transition-all duration-200 cursor-pointer hover:shadow-shadow-lg hover:scale-[1.02] ${
				isSelected 
					? 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary-10' 
					: 'border-border-color hover:border-primary'
			}`}
			onClick={() => onSelect(account.username)}
			onDoubleClick={onProceed}
		>
			{/* Header */}
			<div className='flex items-start justify-between mb-4'>
				<div className='flex items-center gap-3'>
					<div className='w-[50px] h-[50px] bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white text-[16px] font-bold'>
						{initials}
					</div>
					<div>
						<div className='text-[16px]/[22px] font-bold text-font-color mb-1'>
							{account.company.match(/^\d+/)?.[0] || account.username}
						</div>
						<div className='text-[14px]/[20px] text-font-color-100 truncate'>
							{account.company.replace(/^\d+\s*-\s*/, '')}
						</div>
					</div>
				</div>
				<div className='text-[11px]/[14px] text-font-color-100'>
					{index + 1}/{totalCount}
				</div>
			</div>

			{/* Account Info */}
			<div className='grid grid-cols-2 gap-4 mb-4'>
				<div className='text-center'>
					<div className='text-[16px]/[20px] font-semibold text-font-color'>{accountMetrics.locationCount}</div>
					<div className='text-[11px]/[14px] text-font-color-100'>Locations</div>
				</div>
				<div className='text-center'>
					<div className={`text-[16px]/[20px] font-semibold ${accountMetrics.isEDI ? 'text-success' : 'text-font-color-100'}`}>
						{accountMetrics.isEDI ? 'EDI' : 'STD'}
					</div>
					<div className='text-[11px]/[14px] text-font-color-100'>Type</div>
				</div>
			</div>

			{/* Locations */}
			{locTokens.length > 0 && (
				<div className='mb-4'>
					<div className='flex items-center gap-1 mb-2'>
						<IconMapPin className='w-[12px] h-[12px] text-font-color-100' />
						<span className='text-[12px]/[16px] text-font-color-100'>Locations</span>
					</div>
					<div className='flex flex-wrap gap-1'>
																	{locTokens.map((location) => (
												<span 
													key={location} 
													className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[1.2] uppercase font-medium'
												>
													{location}
												</span>
											))}
					</div>
				</div>
			)}

			{/* Action */}
			<button 
							className={`btn w-full transition-all ${
				isSelected 
					? 'btn-primary' 
					: 'btn-secondary'
			}`}
				onClick={(e) => {
					e.stopPropagation();
					if (!isSelected) onSelect(account.username);
					else onProceed();
				}}
				disabled={submitting}
			>
				{isSelected ? (submitting ? 'Processing...' : 'Access Account') : 'Select'}
			</button>
		</div>
	);
}

function AccountListItem({ account, index, isSelected, onSelect, onProceed, submitting, totalCount }: {
	account: AvailableAccountItem;
	index: number;
	isSelected: boolean;
	onSelect: (username: string) => void;
	onProceed: () => void;
	submitting: boolean;
	totalCount: number;
}) {
	const initials = getInitials(account.username);
	const locTokens = String(account.location || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 4);

	return (
		<div
			className={`card bg-card-color rounded-xl p-4 border border-dashed transition-all duration-200 cursor-pointer hover:shadow-shadow-lg ${
				isSelected 
					? 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary-10' 
					: 'border-border-color hover:border-primary'
			}`}
			onClick={() => onSelect(account.username)}
			onDoubleClick={onProceed}
		>
			<div className='flex items-center gap-4'>
				<div className='w-[48px] h-[48px] bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white text-[14px] font-bold'>
					{initials}
				</div>
				<div className='flex-1 min-w-0'>
					<div className='text-[16px]/[22px] font-bold text-font-color mb-1'>
						{account.company.match(/^\d+/)?.[0] || account.username}
					</div>
					<div className='text-[14px]/[20px] text-font-color-100 mb-2'>
						{account.company.replace(/^\d+\s*-\s*/, '')}
					</div>
					{locTokens.length > 0 && (
						<div className='flex flex-wrap gap-1'>
							{locTokens.map((location) => (
								<span 
									key={location} 
									className='px-2 py-1 rounded-md bg-primary text-white text-[10px]/[1.2] uppercase font-medium'
								>
									{location}
								</span>
							))}
						</div>
					)}
				</div>
				<div className='flex items-center gap-3'>
					<div className='text-right text-[12px]/[16px] text-font-color-100'>
						<div className='flex items-center justify-end gap-1'>
							{account.is_EDI ? (
								<>
									<IconShield className='w-[12px] h-[12px] text-success' />
									<span className='text-success font-medium'>EDI</span>
								</>
							) : (
								<>
									<IconUsers className='w-[12px] h-[12px] text-font-color-100' />
									<span>Standard</span>
								</>
							)}
						</div>
						<div className='text-[11px]/[14px] text-font-color-100 mt-1'>
							{index + 1}/{totalCount}
						</div>
					</div>
					<button 
						className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
						onClick={(e) => {
							e.stopPropagation();
							if (!isSelected) onSelect(account.username);
							else onProceed();
						}}
						disabled={submitting}
					>
						{isSelected ? (submitting ? 'Loading...' : 'Login') : 'Select'}
					</button>
				</div>
			</div>
		</div>
	);
}

function LoginUserPage() {
	return <LoginUserPageInner />;
}

export default dynamic(() => Promise.resolve(LoginUserPage), { ssr: false });
