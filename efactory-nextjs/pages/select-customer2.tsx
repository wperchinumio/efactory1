import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getAuthToken, setAuthToken } from '@/lib/auth/storage';
import { loginForAccount } from '@/lib/api/auth';
import type { AvailableAccountItem } from '@/lib/api/models/auth';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { IconSearch, IconBuilding, IconMapPin, IconChevronRight, IconStar, IconUsers, IconCheck, IconFilter } from '@tabler/icons-react';

function getInitials(username: string) {
	return (username || '')
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, 2);
}

function getAvatarColor(username: string) {
	const colors = [
		'from-blue-500 to-blue-600',
		'from-green-500 to-green-600', 
		'from-purple-500 to-purple-600',
		'from-orange-500 to-orange-600',
		'from-pink-500 to-pink-600',
		'from-indigo-500 to-indigo-600',
		'from-teal-500 to-teal-600',
		'from-red-500 to-red-600'
	];
	// Use username to consistently assign colors
	const hash = username.split('').reduce((a, b) => {
		a = ((a << 5) - a) + b.charCodeAt(0);
		return a & a;
	}, 0);
	return colors[Math.abs(hash) % colors.length];
}

function SelectCustomer2PageInner() {
	const router = useRouter();
	const [filter, setFilter] = useState('');
	const [selectedUsername, setSelectedUsername] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);
	const [accounts, setAccounts] = useState<AvailableAccountItem[]>([]);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [sortBy, setSortBy] = useState<'username' | 'company' | 'recent'>('username');
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const token = getAuthToken();
		const list = Array.isArray(token?.available_accounts) ? (token!.available_accounts as any) : [];
		setAccounts(list);
		
		// Load favorites from localStorage
		const savedFavorites = localStorage.getItem('efactory-favorites');
		if (savedFavorites) {
			setFavorites(new Set(JSON.parse(savedFavorites)));
		}
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
		
		// Sort based on selected criteria
		return [...list].sort((a, b) => {
			// Favorites first
			const aFav = favorites.has(a.username);
			const bFav = favorites.has(b.username);
			if (aFav && !bFav) return -1;
			if (!aFav && bFav) return 1;
			
			// Then by sort criteria
			switch (sortBy) {
				case 'company':
					return a.company.localeCompare(b.company);
				case 'recent':
					// Sort by username as fallback since we don't have recent usage data
					return a.username.localeCompare(b.username);
				default:
					return a.username.localeCompare(b.username);
			}
		});
	}, [accounts, filter, favorites, sortBy]);

	useEffect(() => {
		if (filtered.length === 1) setSelectedUsername(filtered[0].username);
	}, [filtered.length]);

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

	const toggleFavorite = (username: string) => {
		const newFavorites = new Set(favorites);
		if (newFavorites.has(username)) {
			newFavorites.delete(username);
		} else {
			newFavorites.add(username);
		}
		setFavorites(newFavorites);
		localStorage.setItem('efactory-favorites', JSON.stringify([...newFavorites]));
	};

	const favoriteAccounts = filtered.filter(acc => favorites.has(acc.username));
	const regularAccounts = filtered.filter(acc => !favorites.has(acc.username));

	return (
		<div className='md:px-6 sm:px-3 pt-8 md:pt-10 min-h-screen bg-body-color'>
			{submitting && <LoadingOverlay text='Switching account...' />}
			
			{/* Header */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[900px] mx-auto'>
					<div className='text-center mb-8'>
						<h1 className='text-[28px]/[36px] md:text-[32px]/[40px] font-bold text-font-color mb-2'>
							Choose Your Account
						</h1>
						<p className='text-font-color-100 text-[16px]/[24px]'>
							Select from your available accounts to access eFactory
						</p>
					</div>

					{/* Search and Filter Bar */}
					<div className='card bg-card-color rounded-xl p-4 md:p-6 border border-dashed border-border-color mb-6'>
						<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4'>
							<div className='relative flex-1 max-w-md'>
								<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
								<input 
									ref={searchInputRef}
									className='form-input pl-9 pr-3 py-2 text-[14px] w-full border-border-color focus:border-primary focus:ring-2 focus:ring-primary-10 rounded-lg' 
									placeholder='Search accounts, companies, locations...' 
									value={filter} 
									onChange={(e) => setFilter(e.target.value)} 
								/>
							</div>
							<div className='flex items-center gap-3'>
								<div className='flex items-center gap-2'>
									<IconFilter className='w-[16px] h-[16px] text-font-color-100' />
									<select 
										value={sortBy} 
										onChange={(e) => setSortBy(e.target.value as any)}
										className='form-select text-[14px] py-2 px-3 border-border-color rounded-lg'
									>
										<option value="username">Username</option>
										<option value="company">Company</option>
										<option value="recent">Alphabetical</option>
									</select>
								</div>
								<span className='text-font-color-100 text-[14px]/[20px] whitespace-nowrap'>
									{filtered.length} accounts
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Accounts List */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[900px] mx-auto'>
					{/* Favorites Section */}
					{favoriteAccounts.length > 0 && (
						<div className='mb-8'>
							<div className='flex items-center gap-2 mb-4'>
								<IconStar className='w-[18px] h-[18px] text-warning' />
								<h3 className='text-[18px]/[24px] font-semibold text-font-color'>
									Favorite Accounts
								</h3>
								<span className='text-font-color-100 text-[14px]/[20px]'>
									({favoriteAccounts.length})
								</span>
							</div>
							<div className='space-y-3'>
								{favoriteAccounts.map((account, index) => (
									<AccountListItem 
										key={account.username}
										account={account}
										index={index}
										isSelected={selectedUsername === account.username}
										isFavorite={true}
										onSelect={setSelectedUsername}
										onProceed={handleProceed}
										onToggleFavorite={toggleFavorite}
										submitting={submitting}
									/>
								))}
							</div>
						</div>
					)}

					{/* Regular Accounts Section */}
					{regularAccounts.length > 0 && (
						<div>
							<div className='flex items-center gap-2 mb-4'>
								<IconUsers className='w-[18px] h-[18px] text-primary' />
								<h3 className='text-[18px]/[24px] font-semibold text-font-color'>
									{favoriteAccounts.length > 0 ? 'Other Accounts' : 'All Accounts'}
								</h3>
								<span className='text-font-color-100 text-[14px]/[20px]'>
									({regularAccounts.length})
								</span>
							</div>
							<div className='space-y-3'>
								{regularAccounts.map((account, index) => (
									<AccountListItem 
										key={account.username}
										account={account}
										index={favoriteAccounts.length + index}
										isSelected={selectedUsername === account.username}
										isFavorite={false}
										onSelect={setSelectedUsername}
										onProceed={handleProceed}
										onToggleFavorite={toggleFavorite}
										submitting={submitting}
									/>
								))}
							</div>
						</div>
					)}

					{/* Empty State */}
					{filtered.length === 0 && (
						<div className='text-center py-12'>
							<div className='w-[80px] h-[80px] mx-auto mb-4 rounded-full bg-primary-10 flex items-center justify-center'>
								<IconSearch className='w-[32px] h-[32px] text-primary' />
							</div>
							<h3 className='text-[20px]/[26px] font-semibold mb-2'>No accounts found</h3>
							<p className='text-font-color-100'>
								Try adjusting your search terms or clear the filter to see all accounts.
							</p>
						</div>
					)}

					{/* Quick Action Button */}
					{selectedUsername && (
						<div className='mt-8 text-center'>
							<button 
								onClick={handleProceed}
								disabled={submitting}
								className='btn btn-primary large px-8'
							>
								{submitting ? 'Processing...' : 'Continue to Dashboard →'}
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function AccountListItem({ 
	account, 
	index, 
	isSelected, 
	isFavorite, 
	onSelect, 
	onProceed, 
	onToggleFavorite, 
	submitting 
}: {
	account: AvailableAccountItem;
	index: number;
	isSelected: boolean;
	isFavorite: boolean;
	onSelect: (username: string) => void;
	onProceed: () => void;
	onToggleFavorite: (username: string) => void;
	submitting: boolean;
}) {
	const initials = getInitials(account.username);
	const locTokens = String(account.location || '')
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean)
		.slice(0, 4);

	return (
		<div
			className={`card bg-card-color rounded-xl p-4 md:p-5 border border-dashed transition-all duration-200 cursor-pointer hover:shadow-shadow-lg ${
				isSelected 
					? 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary-10' 
					: 'border-border-color hover:border-primary'
			}`}
			onClick={() => onSelect(account.username)}
			onDoubleClick={onProceed}
		>
			<div className='flex items-center gap-4'>
				{/* Avatar */}
				<div className={`w-[56px] h-[56px] min-w-[56px] rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${getAvatarColor(account.username)} text-[16px] relative`}>
					{initials}
					{isFavorite && (
						<div className='absolute -top-1 -right-1 w-[18px] h-[18px] bg-warning rounded-full flex items-center justify-center'>
							<IconStar className='w-[10px] h-[10px] text-white fill-current' />
						</div>
					)}
				</div>

				{/* Account Info */}
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 mb-1'>
						<span className='truncate font-semibold text-font-color text-[16px]/[22px]'>
							{account.username}
						</span>
						{account.is_EDI && (
							<span className='inline-flex items-center justify-center rounded-sm bg-success text-white px-2 py-1 text-[10px]/[1.2] font-bold'>
								EDI
							</span>
						)}
					</div>
					<div className='flex items-center gap-1 text-font-color-100 text-[14px]/[20px] mb-2'>
						<IconBuilding className='w-[14px] h-[14px]' />
						<span className='truncate'>{account.company}</span>
					</div>
					{locTokens.length > 0 && (
						<div className='flex items-center gap-1 mb-2'>
							<IconMapPin className='w-[14px] h-[14px] text-font-color-100' />
							<div className='flex flex-wrap gap-1'>
								{locTokens.map((location) => (
									<span 
										key={location} 
										className='px-2 py-1 rounded-md bg-primary-10 text-primary text-[10px]/[1.2] uppercase font-medium'
									>
										{location}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Actions */}
				<div className='flex items-center gap-2'>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onToggleFavorite(account.username);
						}}
						className={`p-2 rounded-full transition-all ${
							isFavorite 
								? 'text-warning bg-warning bg-opacity-10 hover:bg-opacity-20' 
								: 'text-font-color-100 hover:text-warning hover:bg-warning hover:bg-opacity-10'
						}`}
						title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
					>
						<IconStar className={`w-[16px] h-[16px] ${isFavorite ? 'fill-current' : ''}`} />
					</button>
					
					{isSelected ? (
						<button 
							onClick={(e) => {
								e.stopPropagation();
								onProceed();
							}}
							disabled={submitting}
							className='btn btn-primary btn-sm'
						>
							{submitting ? 'Loading...' : 'Login'}
						</button>
					) : (
						<button 
							onClick={(e) => {
								e.stopPropagation();
								onSelect(account.username);
							}}
							className='btn btn-outline-primary btn-sm'
						>
							Select
						</button>
					)}
					
					<IconChevronRight className='w-[16px] h-[16px] text-font-color-100' />
				</div>
			</div>
		</div>
	);
}

function SelectCustomer2Page() {
	return <SelectCustomer2PageInner />;
}

export default dynamic(() => Promise.resolve(SelectCustomer2Page), { ssr: false });
