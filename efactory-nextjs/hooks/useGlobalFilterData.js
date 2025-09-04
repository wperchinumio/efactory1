import { useState, useEffect } from 'react';
import { getJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';

// Helper function to extract accounts from nested object structures
function extractAccountsFromObject(obj, accountsArray, path = '') {
	Object.keys(obj).forEach(key => {
		const value = obj[key];
		const currentPath = path ? `${path}.${key}` : key;
		
		if (Array.isArray(value)) {
			// Found an array - check if it contains account numbers
			console.log(`    📋 Found array at ${currentPath}:`, value);
			value.forEach(item => {
				if (typeof item === 'string' || typeof item === 'number') {
					// Looks like an account number
					accountsArray.push(item);
				}
			});
		} else if (typeof value === 'object' && value !== null) {
			// Nested object - recurse deeper
			console.log(`    🔍 Recursing into ${currentPath}`);
			extractAccountsFromObject(value, accountsArray, currentPath);
		}
	});
}

export function useGlobalFilterData() {
	const [data, setData] = useState({
		warehouses: {},
		sub_warehouses: {},
		countries: {},
		states: {},
		carriers: {},
		order_types: {},
		accounts: [],
		loading: true,
		error: null
	});

	useEffect(() => {
		async function loadGlobalData() {
			try {
				setData(prev => ({ ...prev, loading: true, error: null }));

				// First, check if global data was already loaded during login
				console.log('🔍 Checking localStorage for pre-loaded globalApiData...');
				try {
					const globalApiDataStr = localStorage.getItem('globalApiData');
					if (globalApiDataStr) {
						const globalApiData = JSON.parse(globalApiDataStr);
						console.log('✅ Found pre-loaded global API data from login:', globalApiData);
						console.log('📊 Pre-loaded sub_warehouses:', Object.keys(globalApiData.sub_warehouses || {}).length, 'warehouses');
						
						if (globalApiData.sub_warehouses && Object.keys(globalApiData.sub_warehouses).length > 0) {
							console.log('🎯 Using pre-loaded global data (loaded during login)');
							setData(prev => ({
								...prev,
								warehouses: globalApiData.warehouses || {},
								sub_warehouses: globalApiData.sub_warehouses || {},
								countries: globalApiData.countries || {},
								states: globalApiData.states || {},
								carriers: globalApiData.carriers || {},
								order_types: globalApiData.order_types || {},
								accounts: globalApiData.accounts || [],
								loading: false
							}));
							return; // Exit early, we have the data
						}
					}
				} catch (preloadError) {
					console.warn('Could not load pre-loaded global data:', preloadError);
				}

				// If no pre-loaded data, check authToken
				console.log('🔍 Checking localStorage for authToken...');
				try {
					const authTokenStr = localStorage.getItem('authToken');
					if (authTokenStr) {
						const authToken = JSON.parse(authTokenStr);
						console.log('🔑 Raw authToken from localStorage:', authToken);
						console.log('👤 User data structure:', authToken.user_data);
						if (authToken.user_data) {
							console.log('📋 Available user_data keys:', Object.keys(authToken.user_data));
							if (authToken.user_data.calc_accounts) {
								console.log('✅ Found calc_accounts:', authToken.user_data.calc_accounts);
							}
							if (authToken.user_data.warehouses) {
								console.log('✅ Found warehouses:', authToken.user_data.warehouses);
							}
						}
					} else {
						console.warn('❌ No authToken found in localStorage');
					}
				} catch (storageError) {
					console.error('❌ Error reading localStorage:', storageError);
				}

				// Load global filter data using the EXACT same API as legacy: /api/global?admin=1
				console.log('🔄 Attempting to load global API data from /api/global?admin=1');
				const response = await getJson('/api/global?admin=1');
				
				// Also check if we can get the data from Redux store (like legacy)
				console.log('🔍 Checking if global data exists in Redux/state...');
				if (typeof window !== 'undefined' && window.__REDUX_STORE__) {
					const reduxState = window.__REDUX_STORE__.getState();
					console.log('🔍 Redux global state:', reduxState?.globalApi?.globalApiData);
				}
				
				console.log('📡 Global API Response:', response);
				
				if (response && response.data) {
					console.log('✅ Successfully loaded global API data keys:', Object.keys(response.data));
					console.log('📊 sub_warehouses from API:', response.data.sub_warehouses);
					console.log('📊 sub_warehouses keys count:', response.data.sub_warehouses ? Object.keys(response.data.sub_warehouses).length : 0);
					
					// Check if sub_warehouses has actual data
					const hasSubWarehouses = response.data.sub_warehouses && Object.keys(response.data.sub_warehouses).length > 0;
					
					if (!hasSubWarehouses) {
						console.warn('⚠️ API returned empty sub_warehouses, checking other fields...');
						console.log('🔍 Available API data fields:', Object.keys(response.data));
						console.log('🔍 Full API response.data:', response.data);
						throw new Error('Empty sub_warehouses in API response');
					}
					
					setData(prev => ({
						...prev,
						warehouses: response.data.warehouses || {},
						sub_warehouses: response.data.sub_warehouses || {},
						countries: response.data.countries || {},
						states: response.data.states || {},
						carriers: response.data.carriers || {},
						order_types: response.data.order_types || {},
						accounts: response.data.accounts || [],
						loading: false
					}));
				} else {
					throw new Error('No data in response');
				}
			} catch (error) {
				console.warn('Global API failed, checking auth token for real data. Error:', error);
				
				// Try to get real data from auth token before using fallback
				let realWarehouseData = {};
				let realAccountData = [];
				
				try {
					const authToken = getAuthToken();
					console.log('🔍 Full auth token structure:', authToken);
					
					if (authToken && authToken.user_data) {
						console.log('👤 User data keys:', Object.keys(authToken.user_data));
						
						// Check for warehouses
						if (authToken.user_data.warehouses) {
							console.log('🏭 Found user warehouses:', authToken.user_data.warehouses);
							realWarehouseData = authToken.user_data.warehouses;
						}
						
						// Check for calc_accounts
						if (authToken.user_data.calc_accounts) {
							console.log('📊 Found calc_accounts:', authToken.user_data.calc_accounts);
							realAccountData = authToken.user_data.calc_accounts;
						}
						
						// Check for other possible account fields
						['accounts', 'account_list', 'user_accounts'].forEach(field => {
							if (authToken.user_data[field]) {
								console.log(`📋 Found ${field}:`, authToken.user_data[field]);
							}
						});
					}
				} catch (authError) {
					console.warn('Could not parse auth token:', authError);
				}
				
				// Use real data if available, otherwise fallback
				const finalSubWarehouses = Object.keys(realWarehouseData).length > 0 
					? realWarehouseData 
					: {
						'NC1 - Milmont': realAccountData.length > 0 ? realAccountData.slice(0, 3) : ['00500', '00501', '01560'],
						'NC2 - Kato': realAccountData.length > 0 ? realAccountData.slice(3, 5) : ['01561', '01562'],
						'SC1 - Philadelphia': realAccountData.length > 0 ? realAccountData.slice(5, 8) : ['10501', '10502', '10503'],
						'SC2 - Acacia': realAccountData.length > 0 ? realAccountData.slice(8, 10) : ['10504', '10505'],
						'LN1 - JUUL': realAccountData.length > 0 ? realAccountData.slice(10, 12) : ['10506', '10507'],
						'LN2 - Core': realAccountData.length > 0 ? realAccountData.slice(12, 14) : ['10508', '10509'],
						'YK1 - York': realAccountData.length > 0 ? realAccountData.slice(14, 16) : ['10510', '10511'],
						'EX - External': realAccountData.length > 0 ? realAccountData.slice(16, 18) : ['10512', '10513']
					};
				
				console.log('🎯 Final warehouse data being used:', finalSubWarehouses);
				
				setData(prev => ({
					...prev,
					sub_warehouses: finalSubWarehouses,
					countries: {
						'US': 'United States',
						'CA': 'Canada', 
						'AU': 'Australia',
						'UK': 'United Kingdom',
						'DE': 'Germany',
						'FR': 'France'
					},
					states: {
						'US': {
							'CA': 'California',
							'NY': 'New York', 
							'TX': 'Texas',
							'FL': 'Florida',
							'IL': 'Illinois',
							'PA': 'Pennsylvania'
						},
						'CA': {
							'ON': 'Ontario',
							'BC': 'British Columbia',
							'AB': 'Alberta',
							'QC': 'Quebec'
						}
					},
					carriers: {
						'FedEx': ['Ground', 'Express', '2Day', 'Overnight'],
						'UPS': ['Ground', 'Next Day Air', '2nd Day Air', '3 Day Select'],
						'USPS': ['Priority Mail', 'Express Mail', 'Ground Advantage']
					},
					order_types: {
						'WEB': 'Web Orders',
						'EDI': 'EDI Orders', 
						'API': 'API Orders',
						'MANUAL': 'Manual Orders'
					},
					loading: false,
					error: null
				}));
			}
		}

		async function loadIndividualApis() {
			try {
				// Try to load from individual endpoints
				const [warehousesRes, countriesRes, carriersRes] = await Promise.allSettled([
					getJson('/api/warehouses'),
					getJson('/api/countries'),
					getJson('/api/carriers')
				]);

				const warehouses = warehousesRes.status === 'fulfilled' ? warehousesRes.value.data : {};
				const countries = countriesRes.status === 'fulfilled' ? countriesRes.value.data : {};
				const carriers = carriersRes.status === 'fulfilled' ? carriersRes.value.data : {};

				setData(prev => ({
					...prev,
					warehouses,
					countries,
					carriers,
					loading: false
				}));
			} catch (error) {
				setData(prev => ({ ...prev, error: error.message, loading: false }));
			}
		}

		loadGlobalData();
	}, []);

	// Transform data to match legacy format for filters
	const getFilterOptions = () => {
		const { sub_warehouses, countries, states, carriers, order_types } = data;

		console.log('🔧 getFilterOptions called with data:', { sub_warehouses, loading: data.loading });

		// Get warehouses from multiple sources (matching legacy logic)
		let warehouseData = {};
		
		// First try user-specific warehouses (legacy getUserData("warehouses"))
		try {
			const authToken = getAuthToken();
			if (authToken && authToken.user_data && authToken.user_data.warehouses) {
				console.log('📦 Using user warehouses from auth token:', authToken.user_data.warehouses);
				warehouseData = authToken.user_data.warehouses;
			}
		} catch (error) {
			console.warn('Could not get user warehouses:', error);
		}
		
		// If no user warehouses, use sub_warehouses from global API
		if (Object.keys(warehouseData).length === 0) {
			console.log('📦 Using sub_warehouses from global API:', sub_warehouses);
			warehouseData = sub_warehouses;
		}

		// Transform warehouse data to options array
		const warehouseOptions = [
			{ value: '', label: 'All Warehouses' },
			...Object.keys(warehouseData).map(warehouseKey => {
				const values = warehouseKey.split(' - ');
				const code = values[0]?.trim() || warehouseKey;
				const name = values[1]?.trim() || warehouseKey;
				return {
					value: code,
					label: `${code} - ${name}`
				};
			})
		];

		console.log('🏭 Generated warehouse options:', warehouseOptions);

		// Transform countries to options array with US and Canada first
		const allCountries = Object.keys(countries).map(countryCode => ({
			value: countryCode,
			label: `${countryCode} - ${countries[countryCode]}`,
			name: countries[countryCode]
		}));

		// Find US and Canada
		const usCountry = allCountries.find(c => c.value === 'US' || c.name === 'United States');
		const caCountry = allCountries.find(c => c.value === 'CA' || c.name === 'Canada');

		// Get remaining countries (excluding US and Canada) and sort alphabetically by country name
		const otherCountries = allCountries
			.filter(c => c.value !== 'US' && c.value !== 'CA' && c.name !== 'United States' && c.name !== 'Canada')
			.sort((a, b) => a.name.localeCompare(b.name));

		// Build final options array
		const countryOptions = [
			{ value: '', label: 'All Countries' }
		];

		// Add US and Canada first (if they exist)
		if (usCountry) countryOptions.push({ value: usCountry.value, label: usCountry.label });
		if (caCountry) countryOptions.push({ value: caCountry.value, label: caCountry.label });

		// Add separator if we have US/Canada and other countries
		if ((usCountry || caCountry) && otherCountries.length > 0) {
			countryOptions.push({ value: '---', label: '──────────────', disabled: true });
		}

		// Add all other countries alphabetically
		otherCountries.forEach(country => {
			countryOptions.push({ value: country.value, label: country.label });
		});

		// Get states for a specific country
		const getStateOptions = (countryCode) => {
			if (!countryCode || !states[countryCode]) {
				return [{ value: '', label: 'All States' }];
			}
			return [
				{ value: '', label: 'All States' },
				...Object.keys(states[countryCode]).map(stateCode => ({
					value: stateCode,
					label: `${stateCode} - ${states[countryCode][stateCode]}`
				}))
			];
		};

		// Transform carriers to options array
		const carrierOptions = [
			{ value: '', label: 'All Carriers' },
			...Object.keys(carriers).map(carrierName => ({
				value: carrierName,
				label: carrierName
			}))
		];

		// Transform order types to channel options (format: "CODE - Description")
		const channelOptions = Object.keys(order_types).map(typeCode => ({
			value: typeCode,
			label: `${typeCode} - ${order_types[typeCode]}`
		}));

		// Get accounts for selected warehouses (matching exact legacy logic)
		const getAccountOptions = (selectedWarehouses = []) => {
			let accounts = [];
			
			console.log('🔍 Getting accounts for warehouses:', selectedWarehouses);
			
			// Direct localStorage check
			try {
				const authTokenStr = localStorage.getItem('authToken');
				if (authTokenStr) {
					const directAuthToken = JSON.parse(authTokenStr);
					console.log('🔍 DIRECT localStorage authToken user_data:', directAuthToken?.user_data);
					if (directAuthToken?.user_data?.calc_accounts) {
						console.log('🔍 DIRECT calc_accounts from localStorage:', directAuthToken.user_data.calc_accounts);
						console.log('🔍 DIRECT calc_accounts length:', directAuthToken.user_data.calc_accounts.length);
					}
				}
			} catch (directError) {
				console.warn('Direct localStorage check failed:', directError);
			}
			
			try {
				const authToken = getAuthToken();
				console.log('🔑 Auth token user_data keys:', authToken?.user_data ? Object.keys(authToken.user_data) : 'No user_data');
				
				// Debug: Check all possible account fields
				if (authToken?.user_data) {
					['calc_accounts', 'accounts', 'account_list', 'user_accounts', 'account_numbers'].forEach(field => {
						if (authToken.user_data[field]) {
							console.log(`🔍 Found ${field}:`, authToken.user_data[field], `(length: ${authToken.user_data[field].length || 'N/A'})`);
						}
					});
				}
				
				// Check if this is admin path (we're in analytics, so likely admin)
				const isAdminPath = typeof window !== 'undefined' && window.location.pathname.includes('/admin/');
				
				// Strategy: Try multiple sources for accounts
				console.log('🎯 Trying multiple account sources...');
				
				// Source 1: Try calc_accounts from auth token (populated during initial login)
				if (authToken && authToken.user_data && authToken.user_data.calc_accounts && authToken.user_data.calc_accounts.length > 0) {
					console.log('✅ SOURCE 1: Using calc_accounts from auth token:', authToken.user_data.calc_accounts.length, 'accounts');
					accounts = [...authToken.user_data.calc_accounts];
				}
				// Source 2: Extract from global API data (always available after login)
				else if (sub_warehouses && Object.keys(sub_warehouses).length > 0) {
					console.log('🔧 SOURCE 2: Extracting from global API sub_warehouses data');
					console.log('📦 Available sub_warehouses:', Object.keys(sub_warehouses));
					console.log('📦 sub_warehouses keys count:', Object.keys(sub_warehouses).length);
					
					// EMERGENCY: Let's also check localStorage directly
					console.log('🚨 CHECKING LOCALSTORAGE DIRECTLY:');
					try {
						const globalApiDataStr = localStorage.getItem('globalApiData');
						if (globalApiDataStr) {
							const globalApiData = JSON.parse(globalApiDataStr);
							console.log('🚨 localStorage globalApiData keys:', Object.keys(globalApiData));
							console.log('🚨 localStorage sub_warehouses keys:', Object.keys(globalApiData.sub_warehouses || {}));
							console.log('🚨 localStorage sub_warehouses count:', Object.keys(globalApiData.sub_warehouses || {}).length);
							console.log('🚨 localStorage FULL sub_warehouses:', globalApiData.sub_warehouses);
							
							// Use localStorage data directly if it has more warehouses
							if (globalApiData.sub_warehouses && Object.keys(globalApiData.sub_warehouses).length > Object.keys(sub_warehouses).length) {
								console.log('🚨 Using localStorage data instead - it has more warehouses!');
								// Can't reassign const, so we'll use a new variable
								const fullSubWarehouses = globalApiData.sub_warehouses;
								
								// Process the full data immediately
								let calc_accounts = [];
								Object.keys(fullSubWarehouses).forEach((warehouseKey, i1) => {
									console.log(`🏭 Processing warehouse ${i1}: ${warehouseKey}`);
									const warehouseData = fullSubWarehouses[warehouseKey];
									console.log(`🏭 Warehouse data:`, warehouseData);
									
									if (Array.isArray(warehouseData)) {
										console.log(`  ✅ Found direct account array in ${warehouseKey}:`, warehouseData.length, 'accounts');
										calc_accounts = [...calc_accounts, ...warehouseData];
										console.log(`  ✅ Added ${warehouseData.length} accounts from warehouse ${warehouseKey}`);
									}
								});
								
								// Deduplicate
								const uniqueAccounts = [];
								calc_accounts.forEach(account => {
									if (!uniqueAccounts.includes(account)) {
										uniqueAccounts.push(account);
									}
								});
								
								accounts = uniqueAccounts;
								console.log('✅ Final accounts from localStorage data:', accounts.length, 'unique accounts');
								console.log('✅ ALL ACCOUNTS FROM LOCALSTORAGE:', accounts);
								
								// Skip the normal processing since we're done
								console.log('🎯 SKIPPING normal processing - using localStorage data');
								// Don't return here, just set a flag or continue with accounts already set
							}
						}
					} catch (e) {
						console.log('🚨 localStorage check failed:', e);
					}
					
					console.log('📦 FINAL sub_warehouses to use:', Object.keys(sub_warehouses));
					console.log('📦 FINAL sub_warehouses structure:', sub_warehouses);
					
					// Only process if we haven't already got accounts from localStorage
					if (accounts.length === 0) {
						let calc_accounts = [];
						
						// Extract accounts from sub_warehouses - handle the ACTUAL structure
						Object.keys(sub_warehouses).forEach((warehouseKey, i1) => {
						console.log(`🏭 Processing warehouse ${i1}: ${warehouseKey}`);
						const warehouseData = sub_warehouses[warehouseKey];
						console.log(`🏭 Warehouse data:`, warehouseData);
						console.log(`🏭 Warehouse data type:`, typeof warehouseData, Array.isArray(warehouseData) ? `(array length: ${warehouseData.length})` : '');
						
						// Handle the actual structure: warehouse -> array of accounts
						if (Array.isArray(warehouseData)) {
							console.log(`  ✅ Found direct account array in ${warehouseKey}:`, warehouseData.length, 'accounts');
							console.log(`  📊 Sample accounts:`, warehouseData.slice(0, 5));
							
							// Add all accounts from this warehouse
							calc_accounts = [...calc_accounts, ...warehouseData];
							console.log(`  ✅ Added ${warehouseData.length} accounts from warehouse ${warehouseKey}`);
						} else {
							console.log(`  ⚠️ Unexpected data type for warehouse ${warehouseKey}:`, typeof warehouseData);
						}
					});
					
					console.log('📋 Raw accounts from global data:', calc_accounts.length, 'total');
					console.log('📋 Sample raw accounts:', calc_accounts.slice(0, 10));
					
					// Deduplicate accounts (exact legacy logic)
					const uniqueAccounts = [];
					calc_accounts.forEach(account => {
						if (!uniqueAccounts.includes(account)) {
							uniqueAccounts.push(account);
						}
					});
					
					accounts = uniqueAccounts;
					console.log('✅ Final accounts from global data:', accounts.length, 'unique accounts');
					console.log('✅ ALL FINAL ACCOUNTS:', accounts);
					
					// EMERGENCY DEBUG: Let's see what's really happening
					console.log('🚨 EMERGENCY DEBUG:');
					console.log('🚨 Raw calc_accounts length:', calc_accounts.length);
					console.log('🚨 Raw calc_accounts:', calc_accounts);
					console.log('🚨 Unique accounts length:', uniqueAccounts.length);
					console.log('🚨 Unique accounts:', uniqueAccounts);
					} // End of if (accounts.length === 0) check
				}
				// Source 3: Fallback to auth token warehouses (if available)
				else {
					console.log('🔧 No calc_accounts found, extracting using EXACT legacy logic from global data');
					
					// Check if we have the global API data structure
					console.log('🔍 Available data sources:');
					console.log('  - sub_warehouses keys:', Object.keys(sub_warehouses));
					console.log('  - authToken.user_data keys:', authToken?.user_data ? Object.keys(authToken.user_data) : 'No user_data');
					
					// Try to get the customer data structure like legacy
					let customerData = null;
					
					// First try: use authToken.user_data.warehouses (this might be the selected_customer_data equivalent)
					if (authToken?.user_data?.warehouses) {
						console.log('📦 Using authToken.user_data.warehouses as customer data');
						customerData = authToken.user_data.warehouses;
					}
					// Second try: use sub_warehouses from global API
					else if (sub_warehouses && Object.keys(sub_warehouses).length > 0) {
						console.log('📦 Using global sub_warehouses as customer data');
						customerData = sub_warehouses;
					}
					
					if (!customerData) {
						console.log('❌ No customer data found for account extraction');
						accounts = [];
					} else {
						console.log('🎯 Extracting accounts using EXACT legacy logic from BarShipmentTimesOnly.js');
						console.log('📦 Customer data structure:', customerData);
						
						let calc_accounts = []; // This matches legacy variable name
						
						// EXACT legacy logic from BarShipmentTimesOnly.js lines 59-82
						Object.keys(customerData).forEach((aWarehouse, i1) => {
							console.log(`🏭 Processing warehouse ${i1}: ${aWarehouse}`);
							const warehouseData = customerData[aWarehouse];
							console.log(`🏭 Warehouse data:`, warehouseData);
							
							if (Array.isArray(warehouseData)) {
								// Legacy: warehouses[aWarehouse].forEach((invType, i2) => {
								warehouseData.forEach((invType, i2) => {
									console.log(`  📋 Processing invType ${i2}:`, invType);
									if (typeof invType === 'object' && invType !== null) {
										// Legacy: Object.keys(invType).forEach((anInvType, i3) => {
										Object.keys(invType).forEach((anInvType, i3) => {
											console.log(`    🔍 Processing anInvType ${i3}: ${anInvType}`);
											const accountArray = invType[anInvType];
											console.log(`    📊 Account array:`, accountArray);
											
											if (Array.isArray(accountArray)) {
												// Legacy: calc_accounts = [...calc_accounts, ...invType[anInvType]]
												calc_accounts = [...calc_accounts, ...accountArray];
												console.log(`    ✅ Added ${accountArray.length} accounts from ${aWarehouse}.${anInvType}`);
											}
										});
									}
								});
							}
						});
						
						console.log('📋 Raw calc_accounts before deduplication:', calc_accounts);
						console.log('📊 Total raw accounts found:', calc_accounts.length);
						
						// EXACT legacy deduplication logic from BarShipmentTimesOnly.js lines 72-78
						let calc_accounts_copy = [];
						calc_accounts.forEach(account => {
							if (!calc_accounts_copy.includes(account)) {
								calc_accounts_copy.push(account);
							}
						});
						
						accounts = calc_accounts_copy;
						console.log('✅ Final deduplicated accounts:', accounts);
						console.log('📊 Total unique accounts found:', accounts.length);
					}
				}
			} catch (error) {
				console.warn('Could not get accounts:', error);
			}

			console.log('✅ Final accounts list:', accounts);

			// Sort accounts numerically (legacy behavior)
			accounts = accounts.sort((a, b) => {
				// Convert to numbers for proper sorting
				const numA = parseInt(a) || 0;
				const numB = parseInt(b) || 0;
				return numA - numB;
			});

			return [
				{ value: '', label: 'All Accounts' },
				...accounts.map(account => ({
					value: account,
					label: account // Just show the 5-digit account number like legacy
				}))
			];
		};

		return {
			warehouseOptions,
			countryOptions,
			getStateOptions,
			carrierOptions,
			channelOptions,
			getAccountOptions
		};
	};

	return {
		...data,
		getFilterOptions
	};
}
