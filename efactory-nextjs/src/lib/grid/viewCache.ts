import { getAuthToken } from '@/lib/auth/storage';

// Legacy-compatible caching system using cachedAtDateTable
export function getCachedViewsExpirationDatesObject(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const cachedAtDateTable = window.localStorage.getItem('cachedAtDateTable');
    if (!cachedAtDateTable) return {};
    const parsed = JSON.parse(cachedAtDateTable);
    if (typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

export function addToCachedViewsExpirationDatesObject(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    const cachedAtDateTable = getCachedViewsExpirationDatesObject();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 8); // 8 days from now
    const dateString = expirationDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    if (dateString) {
      cachedAtDateTable[key] = dateString;
      window.localStorage.setItem('cachedAtDateTable', JSON.stringify(cachedAtDateTable));
    }
  } catch {
    // ignore
  }
}

export function removeExpiredViewsFromStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const cachedAtDateTable = getCachedViewsExpirationDatesObject();
    const newCachedDateTable = { ...cachedAtDateTable };
    const todayString = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (todayString) {
      Object.keys(cachedAtDateTable).forEach(key => {
        const date = cachedAtDateTable[key];
        if (date && date < todayString) {
          delete newCachedDateTable[key];
          window.localStorage.removeItem(key);
        }
      });
      
      window.localStorage.setItem('cachedAtDateTable', JSON.stringify(newCachedDateTable));
    }
  } catch {
    // ignore
  }
}

export function createViewKey(resource: string): string | null {
  if (typeof window === 'undefined') return null;
  const userId = getAuthToken()?.user_data?.user_id;
  if (!userId) return null;
  const key = `view.${resource}.${userId}`;
  addToCachedViewsExpirationDatesObject(key);
  return key;
}

// Legacy-compatible function name
export function getCachedViewApiResponseIfExist(resource: string): any | null {
  if (typeof window === 'undefined') return null;
  const viewKeyOnStorage = createViewKey(resource);
  if (!viewKeyOnStorage) return null;
  try {
    const view = window.localStorage.getItem(viewKeyOnStorage);
    if (!view) return null;
    const parsed = JSON.parse(view);
    return parsed;
  } catch {
    return null;
  }
}

export function cacheViewApiResponse(resource: string, viewApiResponse: any): void {
  if (!resource || !viewApiResponse) return;
  if (typeof window === 'undefined') return;
  const key = createViewKey(resource);
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(viewApiResponse));
  } catch {
    // ignore
  }
}

// Legacy compatibility aliases
export function getCachedView(resource: string): any | null {
  return getCachedViewApiResponseIfExist(resource);
}

export function setCachedView(resource: string, payload: any): void {
  return cacheViewApiResponse(resource, payload);
}

export function makeViewKey(resource: string): string | null {
  return createViewKey(resource);
}


