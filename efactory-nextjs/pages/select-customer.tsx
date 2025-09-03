import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getAuthToken, setAuthToken } from '@/lib/auth/storage';
import { loginForAccount } from '@/lib/api/auth';
import type { AvailableAccountItem } from '@/lib/api/models/auth';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { IconSearch } from '@tabler/icons-react';

function getInitials(username: string) {
	return (username || '')
		.toUpperCase()
		.replace(/[^A-Z0-9]/g, '')
		.slice(0, 3);
}

function SelectCustomerPageInner() {
	const router = useRouter();
	const [filter, setFilter] = useState('');
	const [selectedUsername, setSelectedUsername] = useState<string>('');
	const [submitting, setSubmitting] = useState(false);
	const [accounts, setAccounts] = useState<AvailableAccountItem[]>([]);

	useEffect(() => {
		const token = getAuthToken();
		const list = Array.isArray(token?.available_accounts) ? (token!.available_accounts as any) : [];
		setAccounts(list);
	}, []);

	// Removed global search dependency - now using local filter



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

	return (
		<div className='md:px-6 sm:px-3 pt-8 md:pt-10 h-[calc(100svh-140px)] overflow-hidden'>
			{submitting && <LoadingOverlay text='Switching account...' />}
			{/* Top Filter Bar */}
			<div className='container-fluid mb-4'>
				<div className='max-w-[1120px] mx-auto flex items-center justify-between gap-4'>
					<div className='flex items-center gap-3'>
						<div className='relative'>
							<IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
							<input 
								className='form-input pl-9 pr-3 py-2 text-[14px] min-w-[250px] border-border-color focus:border-primary focus:ring-2 focus:ring-primary-10 rounded-2xl' 
								placeholder='Search accounts...' 
								value={filter} 
								onChange={(e) => setFilter(e.target.value)} 
							/>
						</div>
						<div className='text-font-color-100 text-[14px]/[20px]'>
							<span>{filtered.length} accounts available</span>
						</div>
					</div>
				</div>
			</div>

			<div className='container-fluid pb-0 h-full'>
				<div className='card bg-card-color border border-dashed border-border-color rounded-2xl p-6 md:p-8 shadow-shadow-lg max-w-[1120px] mx-auto'>
					<div className='mb-4 flex items-end justify-between gap-4'>
						<div>
							<div className='text-[18px]/[26px] md:text-[20px]/[28px] font-semibold'>LOGIN TO EFACTORY</div>
							<div className='text-font-color-100 text-[14px]/[20px]'>Select the account you want to access</div>
						</div>
						<div className='hidden md:flex items-center gap-2 text-font-color-100 text-[12px]/[1]'>
							<span>{filtered.length}</span>
							<span className='text-font-color-400'>results</span>
						</div>
					</div>

					<ul
						className={`${filtered.length === 1 ? 'min-h-0' : 'min-h-[240px]'} grid grid-cols-1 items-start gap-4 overflow-auto custom-scrollbar p-3`}
						style={{ maxHeight: filtered.length === 1 ? undefined : 'calc(100svh - 140px - 300px)' }}
					>
						{filtered.map((u, i) => {
							const initials = getInitials(u.username);
							const isSelected = selectedUsername === u.username;
							const locTokens = String(u.location || '')
								.split(',')
								.map((t) => t.trim())
								.filter(Boolean)
								.slice(0, 8);
							return (
								<li
									key={u.username}
									className={`relative group border border-dashed border-border-color rounded-xl bg-card-color transition-all duration-200 hover:shadow-shadow-lg hover:-translate-y-[1px] ${isSelected ? 'ring-2 ring-inset ring-primary' : ''}`}
									onClick={() => setSelectedUsername(u.username)}
									onDoubleClick={handleProceed}
								>
									<div className='p-4 md:p-5 flex items-center gap-4'>
										<div className='w-[44px] h-[44px] min-w-[44px] rounded-lg flex items-center justify-center font-semibold text-white bg-gradient-to-br from-primary to-secondary shadow-shadow-sm'>
											{initials}
										</div>
										<div className='flex-1 min-w-0'>
											<div className='flex items-center gap-2'>
												<span className='truncate font-semibold text-font-color'>{u.username}</span>
												{u.is_EDI ? <span className='inline-flex items-center justify-center rounded-sm bg-black text-white px-2 text-[10px]/[1.2]'>EDI</span> : null}
											</div>
											<div className='truncate text-font-color-100'>{u.company}</div>
										</div>
										<div className='text-right text-font-color-100 text-[12px]/[1] flex flex-col gap-2 items-end max-w-[40%]'>
											<div className='flex flex-wrap gap-1 justify-end'>
												{locTokens.map((t) => (
													<span key={t} className='px-2 py-[2px] rounded-md bg-primary text-white text-[11px]/[1] uppercase'>
														{t}
													</span>
												))}
											</div>
											<span className='text-font-color-400'>{i + 1}/{filtered.length}</span>
											<button className='btn btn-outline-secondary btn-sm opacity-0 group-hover:opacity-100 transition' onClick={handleProceed} disabled={!isSelected || submitting}>
												Select
											</button>
										</div>
									</div>
								</li>
							);
						})}
					</ul>

					<div className='flex justify-end mt-2 md:mt-4 pr-2'>
						<button disabled={!selectedUsername || submitting} onClick={handleProceed} className='btn btn-secondary large'>
							{submitting ? 'Processing...' : 'Proceed'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function SelectCustomerPage() {
	return <SelectCustomerPageInner />;
}

export default dynamic(() => Promise.resolve(SelectCustomerPage), { ssr: false });
