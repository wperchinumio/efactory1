import { getAuthToken } from '@/lib/auth/storage';

export function makeViewKey(resource: string): string | null {
  if (typeof window === 'undefined') return null;
  const userId = getAuthToken()?.user_data?.user_id;
  if (!userId) return null;
  return `view.${resource}.${userId}`;
}

export function getCachedView(resource: string): any | null {
  if (typeof window === 'undefined') return null;
  const key = makeViewKey(resource);
  if (!key) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCachedView(resource: string, payload: any): void {
  if (typeof window === 'undefined') return;
  const key = makeViewKey(resource);
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore
  }
}


