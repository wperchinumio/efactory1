import type { AuthToken, AvailableAccount } from '@/types/api';

export function getAuthToken(): AuthToken | null {
	if (typeof window === 'undefined') return null;
	try {
		const raw = window.localStorage.getItem('authToken');
		return raw ? (JSON.parse(raw) as AuthToken) : null;
	} catch {
		return null;
	}
}

export function setAuthToken(token: AuthToken) {
	if (typeof window === 'undefined') return;
	
	
	// Calculate accounts like legacy system (from storageHelperFuncs.js)
	if (token.user_data && token.user_data.warehouses) {
		
		// Initialize calculated properties (exact legacy logic)
		if (token.user_data) {
			token.user_data.calc_accounts = [];
			token.user_data.calc_locations = [];
			token.user_data.calc_account_regions = {};
		}
		
		// Process warehouses to extract accounts (exact legacy logic from storageHelperFuncs.js)
		if (token.user_data && token.user_data.warehouses) {
			const userData = token.user_data;
			Object.keys(userData.warehouses!).forEach(regionKey => {
				const branches = userData.warehouses![regionKey];
				(userData.calc_locations as string[]).push(regionKey);
			
			if (Array.isArray(branches)) {
				branches.forEach(function (branchObj) {
					Object.keys(branchObj).forEach(BranchElem => {
						if (Array.isArray(branchObj[BranchElem])) {
							branchObj[BranchElem].forEach(function (account) {
								const key = account + '.' + regionKey;
								const value = account + ' - ' + regionKey;
								if (!(userData.calc_account_regions as Record<string, string>)[key]) {
									(userData.calc_account_regions as Record<string, string>)[key] = value;
								}
							});
							userData.calc_accounts = [
								...(userData.calc_accounts as string[]),
								...branchObj[BranchElem]
							];
						}
					});
				});
			}
		});
		}
		
		// Deduplicate accounts (exact legacy logic)
		const tempSet = new Set();
		if (token.user_data) {
			token.user_data.calc_accounts = (token.user_data.calc_accounts as string[]).filter(acc => {
			if (!tempSet.has(acc)) {
				tempSet.add(acc);
				return true;
			}
			return false;
		});
		}
		
	} else {
		
		// Initialize empty calc_accounts if no warehouses data
		if (token.user_data) {
			token.user_data.calc_accounts = [];
			token.user_data.calc_locations = [];
			token.user_data.calc_account_regions = {};
		}
	}
	
	window.localStorage.setItem('authToken', JSON.stringify(token));
	
	// Note: Global API is now called during admin login (sign-in.js) not here
}

async function loadGlobalApiData() {
	try {
		const { getJson } = await import('../api/http');
		const response = await getJson('/api/global?admin=1');
		
		if (response && response.data) {
			
			// Store the global data in localStorage for the hook to use
			window.localStorage.setItem('globalApiData', JSON.stringify(response.data));
		}
	} catch (error) {
		console.error('❌ Failed to load global API data:', error);
	}
}

export function clearAuthToken() {
	if (typeof window === 'undefined') return;
	window.localStorage.removeItem('authToken');
	window.localStorage.removeItem('appdata');
	window.localStorage.removeItem('globalApiData');
}

export async function performLogout() {
	try {
		const { logoutApi } = await import('../api/auth');
		await logoutApi();
	} catch {
		// ignore
	} finally {
		clearAuthToken();
	}
}
