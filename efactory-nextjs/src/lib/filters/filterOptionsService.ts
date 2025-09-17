// Service to populate filter options from API calls
import { getAuthToken } from '@/lib/auth/storage';
import { getJson } from '@/lib/api/http';

export interface FilterOption {
  key: string;
  value: string;
  oper: '=' | '<>' | 'like' | '>' | '<' | '>=' | '<=' | 'in' | 'not in';
}

// Cache for filter options to avoid repeated API calls
const optionsCache = new Map<string, FilterOption[]>();

export async function getWarehouseOptions(): Promise<FilterOption[]> {
  const cacheKey = 'warehouses';
  
  if (optionsCache.has(cacheKey)) {
    return optionsCache.get(cacheKey)!;
  }

  try {
    // Get warehouses from global API
    const response = await getJson('/api/global?admin=1');

    const warehouses = (response.data as any)?.warehouses || {};
    const options: FilterOption[] = [];

    Object.keys(warehouses).forEach((warehouse) => {
      warehouses[warehouse].forEach((invType: any) => {
        Object.keys(invType).forEach((anInvType) => {
          const optionKey = `${warehouse} - ${anInvType}`;
          const optionValue = `${anInvType}.${warehouse}`;
          options.push({ key: optionKey, value: optionValue, oper: '=' });
        });
      });
    });

    optionsCache.set(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Failed to load warehouse options:', error);
    return [];
  }
}

export async function getLocationOptions(): Promise<FilterOption[]> {
  const cacheKey = 'locations';
  
  if (optionsCache.has(cacheKey)) {
    return optionsCache.get(cacheKey)!;
  }

  try {
    // Get locations from global API
    const response = await getJson('/api/global?admin=1');

    const warehouses = (response.data as any)?.warehouses || {};
    const options: FilterOption[] = [];

    Object.keys(warehouses).forEach((warehouse) => {
      warehouses[warehouse].forEach((invType: any) => {
        Object.keys(invType).forEach((anInvType) => {
          const optionKey = `${warehouse} - ${anInvType}`;
          const optionValue = warehouse;
          options.push({ key: optionKey, value: optionValue, oper: '=' });
        });
      });
    });

    optionsCache.set(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Failed to load location options:', error);
    return [];
  }
}

export async function getAccountOptions(): Promise<FilterOption[]> {
  const cacheKey = 'accounts';
  
  if (optionsCache.has(cacheKey)) {
    return optionsCache.get(cacheKey)!;
  }

  try {
    // Get accounts from global API
    const response = await getJson('/api/global?admin=1');

    let accounts: string[] = (response.data as any)?.calc_accounts || [];

    // Fallback: use accounts from auth token if API returns empty
    if (!accounts || accounts.length === 0) {
      try {
        const { getAuthToken } = await import('@/lib/auth/storage');
        const token = getAuthToken();
        const fromToken = (token?.user_data as any)?.calc_accounts || [];
        if (Array.isArray(fromToken) && fromToken.length > 0) accounts = fromToken;
      } catch {}
    }

    const options: FilterOption[] = (accounts || []).map((account: string) => ({
      key: account,
      value: account,
      oper: '='
    }));

    optionsCache.set(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Failed to load account options:', error);
    // Final fallback: try token directly
    try {
      const { getAuthToken } = await import('@/lib/auth/storage');
      const token = getAuthToken();
      const fromToken = (token?.user_data as any)?.calc_accounts || [];
      const options: FilterOption[] = (fromToken || []).map((account: string) => ({
        key: account,
        value: account,
        oper: '='
      }));
      optionsCache.set(cacheKey, options);
      return options;
    } catch {
      return [];
    }
  }
}

export async function getOrderTypeOptions(): Promise<FilterOption[]> {
  const cacheKey = 'order_types';
  
  if (optionsCache.has(cacheKey)) {
    return optionsCache.get(cacheKey)!;
  }

  try {
    // Get order types from global API
    const response = await getJson('/api/global?admin=1');

    const orderTypes = (response.data as any)?.order_types || {};
    const options: FilterOption[] = Object.keys(orderTypes).map((orderTypeKey) => ({
      key: `${orderTypeKey} - ${orderTypes[orderTypeKey]}`,
      value: orderTypeKey,
      oper: '='
    }));

    optionsCache.set(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Failed to load order type options:', error);
    return [];
  }
}

export async function getAccountRegionOptions(): Promise<FilterOption[]> {
  const cacheKey = 'account_regions';
  
  if (optionsCache.has(cacheKey)) {
    return optionsCache.get(cacheKey)!;
  }

  try {
    // Get account regions from global API
    const response = await getJson('/api/global?admin=1');

    const calcAccountRegions = (response.data as any)?.calc_account_regions || {};
    const options: FilterOption[] = Object.keys(calcAccountRegions)
      .sort()
      .map((accountObj) => ({
        key: calcAccountRegions[accountObj],
        value: accountObj,
        oper: '='
      }));

    optionsCache.set(cacheKey, options);
    return options;
  } catch (error) {
    console.error('Failed to load account region options:', error);
    return [];
  }
}

// Clear cache when needed
export function clearOptionsCache(): void {
  optionsCache.clear();
}

// Get options for a specific filter field
export async function getOptionsForField(field: string): Promise<FilterOption[]> {
  switch (field) {
    case 'location':
      return getLocationOptions();
    case 'inv_type_region':
      return getWarehouseOptions();
    case 'account_number':
      return getAccountOptions();
    case 'order_type':
      return getOrderTypeOptions();
    case 'account_wh':
      return getAccountRegionOptions();
    default:
      return [];
  }
}
