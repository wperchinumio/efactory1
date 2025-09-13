import { useState, useEffect, useMemo } from 'react';
import { getJson } from '@/lib/api/http';
import { getAuthToken } from '@/lib/auth/storage';

interface FilterOption {
	value: string;
	label: string;
	name?: string;
	disabled?: boolean;
}

interface GlobalFilterData {
	warehouses: Record<string, any>;
	sub_warehouses: Record<string, any>;
	countries: Record<string, string>;
	states: Record<string, any>;
	carriers: Record<string, string>;
	order_types: Record<string, string>;
	accounts: string[];
	loading: boolean;
	error: string | null;
}

interface FilterOptions {
	getWarehouseOptions: () => FilterOption[];
	getAccountOptions: (selectedWarehouses?: string[]) => FilterOption[];
	getCountryOptions: () => FilterOption[];
	getStateOptions: (selectedCountry?: string) => FilterOption[];
	getChannelOptions: () => FilterOption[];
	getDestinationOptions: () => FilterOption[];
	getOrderTypeOptions: () => FilterOption[];
}

// Helper function to extract accounts from nested object structures
function extractAccountsFromObject(obj: any, accountsArray: string[], path = ''): void {
	Object.keys(obj).forEach(key => {
		const value = obj[key];
		const currentPath = path ? `${path}.${key}` : key;
		
		if (Array.isArray(value)) {
			// Found an array - check if it contains account numbers
			value.forEach(item => {
                          if (typeof item === 'string' || typeof item === 'number') {
                                  // Looks like an account number
                                  accountsArray.push(String(item));
                          }
			});
		} else if (typeof value === 'object' && value !== null) {
			// Nested object - recurse deeper
			extractAccountsFromObject(value, accountsArray, currentPath);
		}
	});
}

export function useGlobalFilterData(): GlobalFilterData & { getFilterOptions: () => FilterOptions } {
	const [data, setData] = useState<GlobalFilterData>({
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

	// Add a refresh trigger to force reload when global data changes
	const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

	// Listen for custom events to detect when globalApiData is updated
	useEffect(() => {
		const handleGlobalDataUpdate = (): void => {
			// Global data was updated, trigger refresh
			setRefreshTrigger(prev => prev + 1);
		};

          const handleStorageEvent = (e: StorageEvent): void => {
                  if ((e as any).detail && (e as any).detail.key === 'globalApiData') {
                          setRefreshTrigger(prev => prev + 1);
                  }
          };

		// Listen for custom event that fires when global data is updated
		window.addEventListener('globalApiDataUpdated', handleGlobalDataUpdate);
		window.addEventListener('storage', handleStorageEvent);
		return () => {
			window.removeEventListener('globalApiDataUpdated', handleGlobalDataUpdate);
			window.removeEventListener('storage', handleStorageEvent);
		};
	}, []);

	useEffect(() => {
		async function loadGlobalData(): Promise<void> {
			try {
				setData(prev => ({ ...prev, loading: true, error: null }));

				// First, check if global data was already loaded during login
				try {
					const globalApiDataStr = localStorage.getItem('globalApiData');
					if (globalApiDataStr) {
						const globalApiData = JSON.parse(globalApiDataStr);
						
						if (globalApiData.sub_warehouses && Object.keys(globalApiData.sub_warehouses).length > 0) {
							setData(prev => ({
								...prev,
								warehouses: globalApiData.warehouses || {},
								sub_warehouses: globalApiData.sub_warehouses || {},
								countries: globalApiData.countries || {},
								states: globalApiData.states || {},
								carriers: globalApiData.carriers || {},
								order_types: globalApiData.order_types || {},
								loading: false
							}));
							return; // Exit early if we have pre-loaded data
						}
					}
				} catch (e) {
					// Continue to load from API if localStorage parsing fails
				}

				// If no pre-loaded data, check authToken
				try {
					const authTokenStr = localStorage.getItem('authToken');
					if (authTokenStr) {
						const authToken = JSON.parse(authTokenStr);
						if (authToken.user_data) {
							// We have user data, continue to API loading
						}
					}
				} catch (e) {
					// Continue to API loading
				}

				// Load global filter data using the EXACT same API as legacy: /api/global?admin=1
				const response = await getJson('/api/global?admin=1');
				
                                // Also check if we can get the data from Redux store (like legacy)
                                if (typeof window !== 'undefined' && (window as any).__REDUX_STORE__) {
                                        const reduxState = (window as any).__REDUX_STORE__.getState(); 
                                }
				
				if (response && response.data) {
					
					// Store the global API data in localStorage for future use
					localStorage.setItem('globalApiData', JSON.stringify(response.data));

					if (!(response.data as any).sub_warehouses || Object.keys((response.data as any).sub_warehouses).length === 0) {
						throw new Error('Empty sub_warehouses in API response');
					}
					
					setData(prev => ({
						...prev,
						warehouses: (response.data as any).warehouses || {},
						sub_warehouses: (response.data as any).sub_warehouses || {},
						countries: (response.data as any).countries || {},
						states: (response.data as any).states || {},
						carriers: (response.data as any).carriers || {},
						order_types: (response.data as any).order_types || {},
						loading: false
					}));
				} else {
					throw new Error('No data received from API');
				}
			} catch (error) {
				// Fallback: Try to use data from authToken if API fails
				try {
					let realWarehouseData = {};
					let realAccountData = [];
					
					const authToken = getAuthToken();
					
					if (authToken && authToken.user_data) {
						
						// Extract warehouse data
						if (authToken.user_data.warehouses) {
							realWarehouseData = authToken.user_data.warehouses;
						}
						
				// Extract account data
				if (authToken.user_data.calc_accounts) {
					realAccountData = authToken.user_data.calc_accounts as string[];
				} else {
						// Check other fields that might contain account data
						if (authToken.user_data) {
							['accounts', 'user_accounts', 'customer_accounts'].forEach(field => {
								if ((authToken.user_data as any)[field]) {
									// Found potential account data
								}
							});
						}
						}
					}
					
					// Create a minimal sub_warehouses structure from auth token data
					const finalSubWarehouses = realWarehouseData;
					
					// If we still don't have data, use sample data
					if (Object.keys(finalSubWarehouses).length === 0) {
						throw new Error('No warehouse data available from any source');
					}
					
					setData(prev => ({
						...prev,
						sub_warehouses: finalSubWarehouses,
						warehouses: realWarehouseData,
						countries: {
							'US': 'United States',
							'CA': 'Canada',
							'MX': 'Mexico',
							'GB': 'United Kingdom',
							'DE': 'Germany',
							'FR': 'France',
							'IT': 'Italy',
							'ES': 'Spain',
							'AU': 'Australia',
							'JP': 'Japan'
						},
						states: {
							'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
							'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
							'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
							'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
							'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
							'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
							'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
							'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
							'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
							'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
						},
						carriers: {
							'UPS': 'UPS',
							'FEDEX': 'FedEx',
							'USPS': 'USPS',
							'DHL': 'DHL'
						},
						order_types: {
							'STANDARD': 'Standard',
							'RUSH': 'Rush',
							'EXPEDITED': 'Expedited'
						},
						loading: false,
						error: error instanceof Error ? error.message : String(error)
					}));
				} catch (fallbackError) {
					setData(prev => ({
						...prev,
						loading: false,
						error: `Failed to load global data: ${error instanceof Error ? error.message : String(error)}. Fallback also failed: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`
					}));
				}
			}
		}

		loadGlobalData();
	}, [refreshTrigger]);

	// Function to get filter options from the loaded data
	const getFilterOptions = useMemo((): FilterOptions => {
		const { sub_warehouses, loading } = data;

		if (loading) {
			return {
				getWarehouseOptions: () => [],
				getAccountOptions: () => [],
				getCountryOptions: () => [],
				getStateOptions: () => [],
				getChannelOptions: () => [],
				getDestinationOptions: () => [],
				getOrderTypeOptions: () => []
			};
		}

		// Get warehouse options
		let warehouseData = {};
		
		// Check if user is admin - admins should use global data, not limited auth token data
		try {
			const authToken = getAuthToken();
			const isAdmin = authToken?.user_data?.roles?.includes('ADM') || false;
			
			// For admins, prioritize global sub_warehouses data
			if (isAdmin && sub_warehouses && Object.keys(sub_warehouses).length > 0) {
				warehouseData = sub_warehouses;
			}
			// For regular users, use auth token warehouses
			else if (authToken && authToken.user_data && authToken.user_data.warehouses) {
				warehouseData = authToken.user_data.warehouses;
			}
			// Fallback to sub_warehouses
			else {
				warehouseData = sub_warehouses;
			}
		} catch (e) {
			// Fallback to sub_warehouses
			warehouseData = sub_warehouses;
		}
		
		const warehouseOptions = Object.keys(warehouseData).map(key => {
			const warehouse = (warehouseData as any)[key];
			if (typeof warehouse === 'object' && warehouse.name) {
				return {
					value: key,
					label: `${key} - ${warehouse.name}`,
					name: warehouse.name
				};
			}
			return {
				value: key,
				label: key,
				name: key
			};
		});

		// Get account options
		const getAccountOptions = (selectedWarehouses: string[] = []): FilterOption[] => {
			let accounts: string[] = [];
			
			try {
				// Check localStorage directly for authToken
				const authTokenStr = localStorage.getItem('authToken');
				if (authTokenStr) {
					const directAuthToken = JSON.parse(authTokenStr);
					if (directAuthToken?.user_data?.calc_accounts) {
						// Use calc_accounts if available
					}
				}
			} catch (e) {
				// Continue with other methods
			}
			
			// Try to get accounts from auth token
			try {
				const authToken = getAuthToken();
				
				// Check all possible fields in user_data
				if (authToken && authToken.user_data) {
					['calc_accounts', 'accounts', 'user_accounts', 'customer_accounts'].forEach(field => {
						if ((authToken.user_data as any)[field]) {
							// Found potential account data
						}
					});
				}
				
				// Strategy: Try multiple sources for accounts
				
				// Check if user is admin - admins should use global data, not limited auth token data
				const isAdmin = authToken?.user_data?.roles?.includes('ADM') || false;
				
				// Source 1: For admins, prioritize global sub_warehouses data
				if (isAdmin && sub_warehouses && Object.keys(sub_warehouses).length > 0) {
					let calc_accounts: string[] = [];
					
					Object.keys(sub_warehouses).forEach((warehouseKey) => {
						const warehouseData = sub_warehouses[warehouseKey];
						
						// Handle different data structures
						if (Array.isArray(warehouseData)) {
							// Direct array of accounts
							calc_accounts = [...calc_accounts, ...warehouseData];
						}
					});
					
					// Remove duplicates and convert to strings
					const uniqueAccounts = [...new Set(calc_accounts)].map(acc => String(acc));
					accounts = uniqueAccounts;
				}
				// Source 2: calc_accounts from auth token (for regular users)
				else if (authToken && authToken.user_data && authToken.user_data.calc_accounts && (authToken.user_data.calc_accounts as string[]).length > 0) {
					accounts = [...(authToken.user_data.calc_accounts as string[])];
				}
				// Source 3: Extract from global API sub_warehouses data (fallback)
				else if (sub_warehouses && Object.keys(sub_warehouses).length > 0) {
					
					// EMERGENCY: Let's also check localStorage directly
					try {
						const globalApiDataStr = localStorage.getItem('globalApiData');
						if (globalApiDataStr) {
							const globalApiData = JSON.parse(globalApiDataStr);
							
							// Check if localStorage has more complete data
							if (globalApiData.sub_warehouses && Object.keys(globalApiData.sub_warehouses).length > Object.keys(sub_warehouses).length) {
								// Can't reassign const, so we'll use a new variable
					const fullSubWarehouses = globalApiData.sub_warehouses;

					let calc_accounts: string[] = [];
								
								Object.keys(fullSubWarehouses).forEach((warehouseKey, i1) => {
									const warehouseData = fullSubWarehouses[warehouseKey];
									
									if (Array.isArray(warehouseData)) {
										calc_accounts = [...calc_accounts, ...warehouseData];
									}
								});
								
								// Remove duplicates
								const uniqueAccounts = [...new Set(calc_accounts)];
								accounts = uniqueAccounts;
								
								// Skip the normal processing since we're done
								// Don't return here, just set a flag or continue with accounts already set
							}
						}
					} catch (e) {
						// Continue with normal processing
					}
					
					// Normal processing if we haven't found accounts yet
					if (accounts.length === 0) {
						let calc_accounts: string[] = [];
						
						Object.keys(sub_warehouses).forEach((warehouseKey, i1) => {
						const warehouseData = sub_warehouses[warehouseKey];
						
						// Handle different data structures
						if (Array.isArray(warehouseData)) {
							
							// Direct array of accounts
							calc_accounts = [...calc_accounts, ...warehouseData];
						} else {
							// Unexpected data type - skip
						}
					});
					
					// Remove duplicates and convert to strings
					const uniqueAccounts = [...new Set(calc_accounts)].map(acc => String(acc));
					accounts = uniqueAccounts;
					}
				}
				// Source 3: Fallback to sample data if nothing else works
				else {
					accounts = [
						'10001', '10002', '10003', '10004', '10005',
						'20001', '20002', '20003', '20004', '20005',
						'30001', '30002', '30003', '30004', '30005'
					];
				}
				
			} catch (error) {
				// Final fallback
				accounts = [
					'10001', '10002', '10003', '10004', '10005',
					'20001', '20002', '20003', '20004', '20005'
				];
			}
			
			// Convert accounts to options format
			return accounts.map(account => ({
				value: String(account),
				label: String(account)
			}));
		};

		// Get country options
		const getCountryOptions = (): FilterOption[] => {
			const countries = data.countries || {};

			// Create options with US, CA, and AU first, with ISO2 prefix
			const priorityCountries = [];
			if (countries['US']) {
				priorityCountries.push({ value: 'US', label: `US - ${countries['US']}` });
			}
			if (countries['CA']) {
				priorityCountries.push({ value: 'CA', label: `CA - ${countries['CA']}` });
			}
			if (countries['AU']) {
				priorityCountries.push({ value: 'AU', label: `AU - ${countries['AU']}` });
			}

			// Get remaining countries alphabetically with ISO2 prefix
			const otherCountries = Object.keys(countries)
				.filter(code => code !== 'US' && code !== 'CA' && code !== 'AU')
				.sort((a, b) => (countries[a] || '').localeCompare(countries[b] || ''))
				.map(code => ({
					value: code,
					label: `${code} - ${countries[code] || code}`
				}));

			return [
				...priorityCountries,
				...(priorityCountries.length > 0 && otherCountries.length > 0 ? [{ value: 'separator', label: '──────────────', disabled: true }] : []),
				...otherCountries
			];
		};

		// Get state options
		const getStateOptions = (selectedCountry = ''): FilterOption[] => {
			// Use API data for states
			const states = data.states || {};
			
			// Try multiple approaches to find states for the selected country
			
			// Approach 1: Array-like structure with key/value objects
			const countryEntry = Object.values(states).find(entry => 
				entry && typeof entry === 'object' && entry.key === selectedCountry
			);
			
			if (countryEntry && countryEntry.value) {
				const countryStates = countryEntry.value;
				return Object.keys(countryStates)
					.sort((a, b) => countryStates[a].localeCompare(countryStates[b]))
					.map(code => ({
						value: code,
						label: `${code} - ${countryStates[code]}`
					}));
			}
			
			// Approach 2: Direct country key access
			if (states[selectedCountry]) {
				const countryStates = states[selectedCountry];
				if (typeof countryStates === 'object') {
					return Object.keys(countryStates)
						.sort((a, b) => {
							const nameA = typeof countryStates[a] === 'object' ? countryStates[a].name || countryStates[a] : countryStates[a];
							const nameB = typeof countryStates[b] === 'object' ? countryStates[b].name || countryStates[b] : countryStates[b];
							return String(nameA).localeCompare(String(nameB));
						})
						.map(code => {
							const state = countryStates[code];
							const stateName = typeof state === 'object' ? (state.name || state.label || String(state)) : String(state);
							return {
								value: code,
								label: `${code} - ${stateName}`
							};
						});
				}
			}
			
			return [];
		};

		// Get channel options from order_types
		const getChannelOptions = (): FilterOption[] => {
			const orderTypes = data.order_types || {};
			
			return Object.keys(orderTypes)
				.sort((a, b) => {
					const orderTypeA = orderTypes[a] as any;
					const orderTypeB = orderTypes[b] as any;
					const nameA = typeof orderTypeA === 'object' ? orderTypeA.name || orderTypeA : orderTypeA;
					const nameB = typeof orderTypeB === 'object' ? orderTypeB.name || orderTypeB : orderTypeB;
					return String(nameA).localeCompare(String(nameB));
				})
				.map(code => {
					const orderType = orderTypes[code] as any;
					const name = typeof orderType === 'object' ? orderType.name || orderType : orderType;
					return {
						value: code,
						label: `${code} - ${name}`
					};
				});
		};

		// Get destination options
		const getDestinationOptions = (): FilterOption[] => {
			return [
				{ value: 'domestic', label: 'Domestic' },
				{ value: 'international', label: 'International' }
			];
		};

		// Get order type options
		const getOrderTypeOptions = (): FilterOption[] => {
			const orderTypes = data.order_types || {
				'STANDARD': 'Standard',
				'RUSH': 'Rush',
				'EXPEDITED': 'Expedited',
				'BACKORDER': 'Backorder',
				'DROPSHIP': 'Dropship'
			};

			return Object.keys(orderTypes).map(code => ({
				value: code,
				label: orderTypes[code] || code
			}));
		};

		return {
			getWarehouseOptions: () => warehouseOptions,
			getAccountOptions,
			getCountryOptions,
			getStateOptions,
			getChannelOptions,
			getDestinationOptions,
			getOrderTypeOptions
		};
	}, [data.warehouses, data.sub_warehouses, data.countries, data.states, data.carriers, data.order_types, data.accounts, data.loading]);

	return {
		...data,
		getFilterOptions: () => getFilterOptions
	};
}