export interface AuthToken {
	api_token: string;
	available_accounts?: string[];
	admin_roles?: string[];
	user_data?: Record<string, unknown> & {
		roles?: string[];
		warehouses?: Record<string, unknown>;
	};
}

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
	
	console.log('🔧 setAuthToken called with token:', token);
	console.log('🔧 user_data keys:', token.user_data ? Object.keys(token.user_data) : 'No user_data');
	console.log('🔧 warehouses data:', token.user_data?.warehouses);
	
	// Calculate accounts like legacy system (from storageHelperFuncs.js)
	if (token.user_data && token.user_data.warehouses) {
		console.log('✅ Found warehouses data, calculating calc_accounts from warehouses like legacy system...');
		
		// Initialize calculated properties (exact legacy logic)
		token.user_data.calc_accounts = [];
		token.user_data.calc_locations = [];
		token.user_data.calc_account_regions = {};
		
		// Process warehouses to extract accounts (exact legacy logic from storageHelperFuncs.js)
		Object.keys(token.user_data.warehouses).forEach(regionKey => {
			const branches = token.user_data.warehouses[regionKey];
			token.user_data.calc_locations.push(regionKey);
			
			if (Array.isArray(branches)) {
				branches.forEach(function (branchObj) {
					Object.keys(branchObj).forEach(BranchElem => {
						if (Array.isArray(branchObj[BranchElem])) {
							branchObj[BranchElem].forEach(function (account) {
								const key = account + '.' + regionKey;
								const value = account + ' - ' + regionKey;
								if (!token.user_data.calc_account_regions[key]) {
									token.user_data.calc_account_regions[key] = value;
								}
							});
							token.user_data.calc_accounts = [
								...token.user_data.calc_accounts,
								...branchObj[BranchElem]
							];
						}
					});
				});
			}
		});
		
		// Deduplicate accounts (exact legacy logic)
		const tempSet = new Set();
		token.user_data.calc_accounts = token.user_data.calc_accounts.filter(acc => {
			if (!tempSet.has(acc)) {
				tempSet.add(acc);
				return true;
			}
			return false;
		});
		
		console.log('✅ Calculated calc_accounts:', token.user_data.calc_accounts);
		console.log('📊 Total unique accounts:', token.user_data.calc_accounts.length);
	} else {
		console.log('⚠️ No warehouses data found in token.user_data');
		console.log('🔧 Available user_data fields:', token.user_data ? Object.keys(token.user_data) : 'No user_data');
		
		// Initialize empty calc_accounts if no warehouses data
		if (token.user_data) {
			token.user_data.calc_accounts = [];
			token.user_data.calc_locations = [];
			token.user_data.calc_account_regions = {};
			console.log('🔧 Initialized empty calc_accounts');
		}
	}
	
	window.localStorage.setItem('authToken', JSON.stringify(token));
	
	// Note: Global API is now called during admin login (sign-in.js) not here
}

async function loadGlobalApiData() {
	try {
		console.log('🔄 Loading global API data after login (like legacy system)...');
		const { getJson } = await import('../api/http');
		const response = await getJson('/api/global?admin=1');
		
		if (response && response.data) {
			console.log('✅ Global API data loaded successfully:', response.data);
			console.log('📊 sub_warehouses loaded:', Object.keys(response.data.sub_warehouses || {}).length, 'warehouses');
			
			// Store the global data in localStorage for the hook to use
			window.localStorage.setItem('globalApiData', JSON.stringify(response.data));
		} else {
			console.warn('⚠️ Global API returned no data');
		}
	} catch (error) {
		console.error('❌ Failed to load global API data:', error);
	}
}

export function clearAuthToken() {
	if (typeof window === 'undefined') return;
	window.localStorage.removeItem('authToken');
	window.localStorage.removeItem('appdata');
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
