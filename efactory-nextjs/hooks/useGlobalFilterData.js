import { useState, useEffect } from 'react';
import { getJson } from '@/lib/api/http';

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

				// Load global filter data - this should match the legacy API structure
				const response = await getJson('/api/global-filters');
				
				if (response.data) {
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
					// Fallback to individual API calls if global endpoint doesn't exist
					await loadIndividualApis();
				}
			} catch (error) {
				console.warn('Global filters API not available, using fallback data:', error);
				// Use fallback data that matches legacy structure
				setData(prev => ({
					...prev,
					// Sub-warehouses from legacy format: "FR - Fulfillment", "LA - Los Angeles", etc.
					sub_warehouses: {
						'FR - Fulfillment': ['12345', '67890', '11111'],
						'LA - Los Angeles': ['22222', '33333', '44444'],
						'LN - London': ['55555', '66666'],
						'YK - York': ['77777', '88888', '99999']
					},
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

		// Transform sub_warehouses to options array
		const warehouseOptions = [
			{ value: '', label: 'All Warehouses' },
			...Object.keys(sub_warehouses).map(warehouseKey => {
				const values = warehouseKey.split(' - ');
				const code = values[0]?.trim() || warehouseKey;
				const name = values[1]?.trim() || warehouseKey;
				return {
					value: code,
					label: `${code} - ${name}`
				};
			})
		];

		// Transform countries to options array
		const countryOptions = [
			{ value: '', label: 'All Countries' },
			...Object.keys(countries).map(countryCode => ({
				value: countryCode,
				label: `${countryCode} - ${countries[countryCode]}`
			}))
		];

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

		// Transform order types to channel options
		const channelOptions = [
			{ value: '', label: 'All Channels' },
			...Object.keys(order_types).map(typeCode => ({
				value: typeCode,
				label: order_types[typeCode]
			}))
		];

		// Get accounts for selected warehouses
		const getAccountOptions = (selectedWarehouses = []) => {
			let accounts = [];
			
			if (selectedWarehouses.length === 0) {
				// Get all accounts from all warehouses
				Object.keys(sub_warehouses).forEach(warehouseKey => {
					accounts = [...accounts, ...sub_warehouses[warehouseKey]];
				});
			} else {
				// Get accounts only from selected warehouses
				selectedWarehouses.forEach(warehouseCode => {
					const warehouseKey = Object.keys(sub_warehouses).find(key => 
						key.startsWith(warehouseCode + ' -')
					);
					if (warehouseKey) {
						accounts = [...accounts, ...sub_warehouses[warehouseKey]];
					}
				});
			}

			// Remove duplicates and sort
			accounts = [...new Set(accounts)].sort();

			return [
				{ value: '', label: 'All Accounts' },
				...accounts.map(account => ({
					value: account,
					label: `${account} - Account ${account}`
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
