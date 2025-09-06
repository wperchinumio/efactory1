import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getAuthToken, setAuthToken } from '@/lib/auth/storage';
import { loginForAccount } from '@/lib/api/auth';
import type { AvailableAccountItem } from '@/lib/api/models/auth';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { IconSearch, IconBuilding, IconMapPin, IconUsers, IconCheck } from '@tabler/icons-react';

function getInitials(username: string) {
	return (username || '')
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, 3);
}

function SelectCustomer1PageInner() {
	const router = useRouter();
	const [filter, setFilter] = useState('');
	const [selectedUsername, setSelectedUsername] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);
	const [accounts, setAccounts] = useState<AvailableAccountItem[]>([]);
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
		return [...list].sort((a, b) => (a.username < b.username ? -1 : a.username > b.username ? 1 : 0));
	}, [accounts, filter]);

	useEffect(() => {
		if (filtered.length === 1) setSelectedUsername(filtered[0]?.username || '');
	}, [filtered.length]);

	async function handleProceed() {
		if (!selectedUsername || submitting) return;
		setSubmitting(true);
		try {
			const res = await loginForAccount(selectedUsername);
			setAuthToken({
				api_token: res.data.api_token,
				available_accounts: [],
				admin_roles: res.data.admin_roles || [],
				user_data: {
					...res.data.user_data,
					apps: res.data.user_data.apps ? res.data.user_data.apps.map((app: any) => typeof app === 'string' ? parseInt(app) : app) : []
				},
			});
			router.replace('/');
		} catch (e) {
			setSubmitting(false);
		}
	}

	const totalAccounts = accounts.length;
	const ediAccounts = accounts.filter(acc => acc.is_EDI).length;
	const uniqueCompanies = new Set(accounts.map(acc => acc.company)).size;

	return (
		<div className='md:px-6 sm:px-3 pt-8 md:pt-10 min-h-screen bg-body-color'>
			{submitting && <LoadingOverlay text='Switching account...' />}
			
			{/* Header Section */}
			<div className='container-fluid mb-6'>
				<div className='max-w-[1200px] mx-auto'>
					<div className='text-center mb-8'>
						<h1 className='text-[32px]/[40px] md:text-[40px]/[48px] font-bold text-font-color mb-2'>
							Welcome to eFactory
						</h1>
						<p className='text-font-color-100 text-[16px]/[24px] md:text-[18px]/[26px]'>
							Select your account to continue
						</p>
					</div>

					{/* Stats Cards */}
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
						<div className='card bg-card-color rounded-xl md:p-6 p-4 flex gap-4 items-center border border-dashed border-border-color'>
							<div className='w-[56px] h-[56px] min-w-[56px] text-primary bg-primary-10 rounded-full flex items-center justify-center'>
								<IconUsers className='w-[24px] h-[24px]' />
							</div>
							<div>
								<p className='text-font-color-100 text-[14px]/[20px]'>
									Total Accounts
								</p>
								<h5 className='text-[20px]/[24px] font-medium'>
									{totalAccounts}
								</h5>
							</div>
						</div>
						<div className='card bg-card-color rounded-xl md:p-6 p-4 flex gap-4 items-center border border-dashed border-border-color'>
							<div className='w-[56px] h-[56px] min-w-[56px] text-success bg-success text-white rounded-full flex items-center justify-center'>
								<IconBuilding className='w-[24px] h-[24px]' />
							</div>
							<div>
								<p className='text-font-color-100 text-[14px]/[20px]'>
									Companies
								</p>
								<h5 className='text-[20px]/[24px] font-medium'>
									{uniqueCompanies}
								</h5>
							</div>
						</div>
						<div className='card bg-card-color rounded-xl md:p-6 p-4 flex gap-4 items-center border border-dashed border-border-color'>
							<div className='w-[56px] h-[56px] min-w-[56px] text-info bg-info text-white rounded-full flex items-center justify-center'>
								<IconCheck className='w-[24px] h-[24px]' />
							</div>
							<div>
								<p className='text-font-color-100 text-[14px]/[20px]'>
									EDI Enabled
								</p>
								<h5 className='text-[20px]/[24px] font-medium'>
									{ediAccounts}
								</h5>
							</div>
						</div>
					</div>

					{/* Search Bar */}
					<div className='card bg-card-color rounded-xl md:p-6 p-4 border border-dashed border-border-color mb-6'>
						<div className='flex items-center justify-between gap-4 mb-4'>
							<h3 className='text-[18px]/[26px] font-semibold'>Find Your Account</h3>
							<span className='text-font-color-100 text-[14px]/[20px]'>
								{filtered.length} of {totalAccounts} accounts
							</span>
						</div>
						<div className='relative max-w-md'>
							<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
							<input 
								ref={searchInputRef}
								className='form-input pl-9 pr-3 py-2 text-[14px] w-full border-border-color focus:border-primary focus:ring-2 focus:ring-primary-10 rounded-2xl' 
								placeholder='Search by username, company, or location...' 
								value={filter} 
								onChange={(e) => setFilter(e.target.value)} 
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Accounts Grid */}
			<div className='container-fluid pb-8'>
				<div className='max-w-[1200px] mx-auto'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filtered.map((account, index) => {
							const initials = getInitials(account.username);
							const isSelected = selectedUsername === account.username;
							const locTokens = String(account.location || '')
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean)
								.slice(0, 3);

							return (
								<div
									key={account.username}
									className={`card bg-card-color rounded-xl md:p-6 p-4 border border-dashed transition-all duration-200 cursor-pointer hover:shadow-shadow-lg hover:scale-[1.02] ${
										isSelected 
											? 'border-primary ring-2 ring-primary ring-opacity-20 bg-primary-10' 
											: 'border-border-color hover:border-primary'
									}`}
									onClick={() => setSelectedUsername(account.username)}
									onDoubleClick={handleProceed}
								>
									{/* Account Header */}
									<div className='flex items-center gap-4 mb-4'>
										<div className='w-[60px] h-[60px] min-w-[60px] rounded-xl flex items-center justify-center font-bold text-white bg-gradient-to-br from-primary to-secondary text-[18px]'>
											{initials}
										</div>
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
											<div className='flex items-center gap-1 text-font-color-100 text-[14px]/[20px]'>
												<IconBuilding className='w-[14px] h-[14px]' />
												<span className='truncate'>{account.company}</span>
											</div>
										</div>
									</div>

									{/* Location Tags */}
									{locTokens.length > 0 && (
										<div className='mb-4'>
											<div className='flex items-center gap-1 mb-2'>
												<IconMapPin className='w-[14px] h-[14px] text-font-color-100' />
												<span className='text-font-color-100 text-[12px]/[16px] font-medium'>
													Locations
												</span>
											</div>
											<div className='flex flex-wrap gap-1'>
												{locTokens.map((location) => (
													<span 
														key={location} 
														className='px-2 py-1 rounded-md bg-primary-10 text-primary text-[11px]/[1.2] uppercase font-medium'
													>
														{location}
													</span>
												))}
											</div>
										</div>
									)}

									{/* Account Number */}
									<div className='flex items-center justify-between text-[12px]/[16px] text-font-color-100 mb-4'>
										<span>Account #{index + 1}</span>
										<span>{index + 1} of {filtered.length}</span>
									</div>

									{/* Action Button */}
									<button 
										className={`btn w-full transition-all ${
											isSelected 
												? 'btn-primary' 
												: 'btn-outline-primary'
										}`}
										onClick={(e) => {
											e.stopPropagation();
											if (!isSelected) setSelectedUsername(account.username);
											else handleProceed();
										}}
										disabled={submitting}
									>
										{isSelected ? (submitting ? 'Processing...' : 'Login to Account') : 'Select Account'}
									</button>
								</div>
							);
						})}
					</div>

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

				</div>
			</div>
		</div>
	);
}

function SelectCustomer1Page() {
	return <SelectCustomer1PageInner />;
}

export default dynamic(() => Promise.resolve(SelectCustomer1Page), { ssr: false });
