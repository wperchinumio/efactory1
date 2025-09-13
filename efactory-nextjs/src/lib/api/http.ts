import type { IncomingHttpHeaders } from 'http';
import type { ApiResponse } from '@/types/api';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface HttpRequestOptions<TBody = unknown> {
	method: HttpMethod;
	path: string;
	body?: TBody;
	headers?: Record<string, string>;
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
		signal: AbortSignal.timeout(30000), // 30 second timeout
	});

	const isJson = res.headers.get('content-type')?.includes('application/json');
	const payload = isJson ? await res.json() : undefined;

	if (!res.ok) {
		const error = payload ?? { 
			error_message: `Request failed with status ${res.status}`,
			status: res.status
		};
		
		if (res.status === 401 && typeof window !== 'undefined') {
			// Clear all auth data including globalApiData
			import('../auth/storage').then(({ clearAuthToken }) => clearAuthToken());
			if (!window.location.pathname.includes('/auth')) {
				window.location.href = '/auth/sign-in';
			}
		}
		
		// Add status code to error for better handling
		error.status = res.status;
		throw error;
	}

	// Debug logging for successful responses
	if (res.status === 201) {
		console.log('HTTP 201 response:', { status: res.status, payload, url });
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

// Raw variants for endpoints that do NOT return the common { data: ... } envelope
export async function httpRequestRaw<TResponse = unknown, TBody = unknown>(
	options: HttpRequestOptions<TBody>,
): Promise<TResponse> {
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
		signal: AbortSignal.timeout(30000), // 30 second timeout
	});

	const isJson = res.headers.get('content-type')?.includes('application/json');
	const payload = isJson ? await res.json() : undefined;

	if (!res.ok) {
		const error = payload ?? {
			error_message: `Request failed with status ${res.status}`,
			status: res.status,
		};

		if (res.status === 401 && typeof window === 'undefined') {
			// noop on server
		}
		if (res.status === 401 && typeof window !== 'undefined') {
			import('../auth/storage').then(({ clearAuthToken }) => clearAuthToken());
			if (!window.location.pathname.includes('/auth')) {
				window.location.href = '/auth/sign-in';
			}
		}

		(error as any).status = res.status;
		throw error;
	}

	return payload as TResponse;
}

export function postJsonRaw<TResponse = unknown, TBody = unknown>(
	path: string,
	body: TBody,
	headers?: Record<string, string>,
) {
	return httpRequestRaw<TResponse, TBody>({ method: 'post', path, body, headers: headers || {} });
}

export function getJsonRaw<TResponse = unknown>(path: string, headers?: Record<string, string>) {
	return httpRequestRaw<TResponse>({ method: 'get', path, headers: headers || {} });
}

// Multipart/form-data upload helper that follows our centralized token/error handling
export async function postFormData<TResponse = unknown>(
	path: string,
	formData: FormData,
	headers?: Record<string, string>,
): Promise<TResponse> {
	const base = getBaseUrl();
	const cleanPath = path.startsWith('/') ? path.substring(1) : path;
	const url = `${base}/${cleanPath}`;

	const requestHeaders: Record<string, string> = {
		Accept: 'application/json',
		...(headers ?? {}),
	};

	const token = getAccessToken();
	if (token) requestHeaders['X-Access-Token'] = token;

	const res = await fetch(url, {
		method: 'POST',
		headers: requestHeaders, // do not set Content-Type for multipart; browser sets boundary
		body: formData,
		credentials: 'include',
	});

	const isJson = res.headers.get('content-type')?.includes('application/json');
	const payload = isJson ? await res.json() : undefined;

	if (!res.ok) {
		const error = payload ?? {
			error_message: `Request failed with status ${res.status}`,
			status: res.status,
		};

		if (res.status === 401 && typeof window !== 'undefined') {
			import('../auth/storage').then(({ clearAuthToken }) => clearAuthToken());
			if (!window.location.pathname.includes('/auth')) {
				window.location.href = '/auth/sign-in';
			}
		}

		(error as any).status = res.status;
		throw error as any;
	}

	return (payload as TResponse) ?? ({} as TResponse);
}
