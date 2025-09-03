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
	window.localStorage.setItem('authToken', JSON.stringify(token));
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
