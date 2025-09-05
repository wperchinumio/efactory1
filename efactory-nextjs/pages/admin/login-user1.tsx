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
	IconLogin
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
	const [sortField, setSortField] = useState<'company' | 'location' | 'edi'>('company');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
	const [showFilters, setShowFilters] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const token = getAuthToken();
		const list = Array.isArray(token?.available_accounts) ? (token!.available_accounts as any) : [];
		setAccounts(list);
	}, []);

	useEffect(() => {
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
			let aValue, bValue;
			
			switch (sortField) {
				case 'company':
					aValue = a.company.toLowerCase();
					bValue = b.company.toLowerCase();
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
					aValue = a.company.toLowerCase();
					bValue = b.company.toLowerCase();
			}
			
			if (sortField === 'edi') {
				return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
			} else {
				return sortDirection === 'asc' 
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}
		});
	}, [accounts, filter, sortField, sortDirection]);

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

	const handleSort = (field: 'company' | 'location' | 'edi') => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	// Calculate statistics
	const totalAccounts = accounts.length;
	const ediAccounts = accounts.filter(acc => acc.is_EDI).length;
	const uniqueCompanies = new Set(accounts.map(acc => acc.company)).size;
	const uniqueLocations = new Set(
		accounts.flatMap(acc => 
			String(acc.location || '').split(',').map(l => l.trim()).filter(Boolean)
		)
	).size;

	return (
		<div className='md:px-6 sm:px-3 pt-6 md:pt-8 min-h-screen bg-body-color'>
			{submitting && <LoadingOverlay text='Switching account...' />}
			
			{/* Compact Header */}
			<div className='container-fluid mb-4'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4'>
						<div>
							<h1 className='text-[20px]/[28px] md:text-[24px]/[32px] font-bold text-font-color'>
								Account Management
							</h1>
							<p className='text-font-color-100 text-[14px]/[20px]'>
								Select an account to access eFactory
							</p>
						</div>
						
						{/* Compact Stats */}
						<div className='flex items-center gap-6'>
							<div className='text-center'>
								<div className='text-[18px]/[22px] font-bold text-font-color'>{totalAccounts}</div>
								<div className='text-[11px]/[14px] text-font-color-100'>Total</div>
							</div>
							<div className='text-center'>
								<div className='text-[18px]/[22px] font-bold text-success'>{ediAccounts}</div>
								<div className='text-[11px]/[14px] text-font-color-100'>EDI</div>
							</div>
							<div className='text-center'>
								<div className='text-[18px]/[22px] font-bold text-info'>{uniqueCompanies}</div>
								<div className='text-[11px]/[14px] text-font-color-100'>Companies</div>
							</div>
							<div className='text-center'>
								<div className='text-[18px]/[22px] font-bold text-warning'>{uniqueLocations}</div>
								<div className='text-[11px]/[14px] text-font-color-100'>Locations</div>
							</div>
						</div>
					</div>

					{/* Search and Controls */}
					<div className='card bg-card-color rounded-lg p-4 border border-dashed border-border-color'>
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
									{filtered.length} of {totalAccounts}
								</span>
							</div>
							<div className='flex items-center gap-2'>
								<button
									onClick={() => setShowFilters(!showFilters)}
									className={`btn btn-outline-primary ${showFilters ? 'active' : ''}`}
								>
									<IconFilter className='w-[16px] h-[16px]' />
									Filters
								</button>
								{selectedUsername && (
									<button
										onClick={handleProceed}
										disabled={submitting}
										className='btn btn-primary'
									>
										<IconLogin className='w-[16px] h-[16px]' />
										{submitting ? 'Processing...' : 'Access Account'}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Data Table */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1600px] mx-auto'>
					<div className='card bg-card-color rounded-lg border border-dashed border-border-color overflow-hidden'>
						{/* Table Header */}
						<div className='bg-primary-5 border-b border-border-color px-6 py-3'>
							<div className='grid grid-cols-12 gap-4 items-center text-[12px]/[16px] font-semibold text-font-color-100 uppercase tracking-wider'>
								<div className='col-span-1'>#</div>
								<div className='col-span-1'>Avatar</div>
								<div 
									className='col-span-3 cursor-pointer hover:text-primary flex items-center gap-1'
									onClick={() => handleSort('company')}
								>
									Company
									{sortField === 'company' && (
										sortDirection === 'asc' ? <IconSortAscending className='w-4 h-4' /> : <IconSortDescending className='w-4 h-4' />
									)}
								</div>
								<div 
									className='col-span-3 cursor-pointer hover:text-primary flex items-center gap-1'
									onClick={() => handleSort('location')}
								>
									Locations
									{sortField === 'location' && (
										sortDirection === 'asc' ? <IconSortAscending className='w-4 h-4' /> : <IconSortDescending className='w-4 h-4' />
									)}
								</div>
								<div 
									className='col-span-2 cursor-pointer hover:text-primary flex items-center gap-1'
									onClick={() => handleSort('edi')}
								>
									Type
									{sortField === 'edi' && (
										sortDirection === 'asc' ? <IconSortAscending className='w-4 h-4' /> : <IconSortDescending className='w-4 h-4' />
									)}
								</div>
								<div className='col-span-2'>Actions</div>
							</div>
						</div>

						{/* Table Body */}
						<div className='divide-y divide-border-color'>
							{filtered.map((account, index) => (
								<AccountTableRow
									key={account.username}
									account={account}
									index={index}
									isSelected={selectedUsername === account.username}
									onSelect={setSelectedUsername}
									onProceed={handleProceed}
									submitting={submitting}
								/>
							))}
						</div>

						{/* Empty State */}
						{filtered.length === 0 && (
							<div className='text-center py-16'>
								<div className='w-[80px] h-[80px] mx-auto mb-4 rounded-full bg-primary-10 flex items-center justify-center'>
									<IconSearch className='w-[32px] h-[32px] text-primary' />
								</div>
								<h3 className='text-[20px]/[26px] font-semibold mb-2'>No accounts found</h3>
								<p className='text-font-color-100 text-[14px]/[20px] max-w-md mx-auto mb-4'>
									No accounts match your search criteria.
								</p>
								<button 
									onClick={() => setFilter('')}
									className='btn btn-outline-primary'
								>
									Clear Search
								</button>
							</div>
						)}
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

	const accountNumber = account.company.match(/^\d+/)?.[0] || account.username;
	const companyName = account.company.replace(/^\d+\s*-\s*/, '');

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
							{locTokens.map((location) => (
								<span 
									key={location} 
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
						<button
							onClick={(e) => {
								e.stopPropagation();
								onSelect(account.username);
							}}
							className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
							disabled={submitting}
						>
							{isSelected ? 'Selected' : 'Select'}
						</button>
						{isSelected && (
							<button
								onClick={(e) => {
									e.stopPropagation();
									onProceed();
								}}
								className='btn btn-sm btn-success'
								disabled={submitting}
							>
								<IconLogin className='w-[14px] h-[14px]' />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function LoginUserPage() {
	return <LoginUserPageInner />;
}

export default dynamic(() => Promise.resolve(LoginUserPage), { ssr: false });
