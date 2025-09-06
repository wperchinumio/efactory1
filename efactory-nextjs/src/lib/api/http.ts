import type { IncomingHttpHeaders } from 'http';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface HttpRequestOptions<TBody = unknown> {
	method: HttpMethod;
	path: string;
	body?: TBody;
	headers?: Record<string, string>;
}

export interface ApiResponse<TData = unknown> {
	data: TData;
	internal_version?: string;
	[key: string]: unknown;
}

function getBaseUrl(): string {
	const apiProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';
	if (apiProxy) return '/api/proxy';
	const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
	if (!url) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
	return url.replace(/\/$/, '');
}

function getAccessToken(): string | undefined {
	if (typeof window === 'undefined') return undefined;
	try {
		const raw = window.localStorage.getItem('authToken');
		if (!raw) return undefined;
		const parsed = JSON.parse(raw);
		return parsed?.api_token as string | undefined;
	} catch {
		return undefined;
	}
}

export async function httpRequest<TResponse = unknown, TBody = unknown>(
	options: HttpRequestOptions<TBody>,
): Promise<ApiResponse<TResponse>> {
	const base = getBaseUrl();
	const path = options.path.startsWith('/') ? options.path.substring(1) : options.path;
	const url = `${base}/${path}`;

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(options.headers ?? {}),
	};

	const token = getAccessToken();
	if (token) headers['X-Access-Token'] = token;

	const res = await fetch(url, {
		method: options.method.toUpperCase(),
		headers,
		body: options.body ? JSON.stringify(options.body) : null,
		credentials: 'include',
	});

	const isJson = res.headers.get('content-type')?.includes('application/json');
	const payload = isJson ? await res.json() : undefined;

	if (!res.ok) {
		if (res.status === 401 && typeof window !== 'undefined') {
			// Clear all auth data including globalApiData
			import('../auth/storage').then(({ clearAuthToken }) => clearAuthToken());
			if (!window.location.pathname.includes('/auth')) {
				window.location.href = '/auth/sign-in';
			}
		}
		throw payload ?? { error_message: 'Request failed' };
	}

	return payload as ApiResponse<TResponse>;
}

export function postJson<TResponse = unknown, TBody = unknown>(
	path: string,
	body: TBody,
	headers?: Record<string, string>,
) {
	return httpRequest<TResponse, TBody>({ method: 'post', path, body, headers: headers || {} });
}

export function getJson<TResponse = unknown>(path: string, headers?: Record<string, string>) {
	return httpRequest<TResponse>({ method: 'get', path, headers: headers || {} });
}
