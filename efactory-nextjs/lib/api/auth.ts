import { postJson } from './http';
import type { LoginRequest, LoginResponseData, LoginForAccountRequest } from './models/auth';

export async function loginRequest(
	username: string,
	password: string,
	options?: { dcl_user?: boolean; force_logout?: boolean },
) {
	const body: LoginRequest = {
		func: 'login',
		username,
		password,
		dcl_user: options?.dcl_user ?? false,
		force_logout: options?.force_logout ?? false,
	};
	return postJson<LoginResponseData>('/api/authentication', body);
}

export async function loginForAccount(account: string) {
	const body: LoginForAccountRequest = { func: 'loginForAccount', account };
	return postJson<LoginResponseData>('/api/authentication', body);
}

export async function checkAuth() {
	return postJson<{ is_local?: boolean }>('/api/authentication', { func: 'isAuth' });
}

export async function logoutApi() {
	return postJson('/api/authentication', { func: 'logout' });
}
