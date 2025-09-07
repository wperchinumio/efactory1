import { postJson } from './http';
import type { 
  LoginRequest, 
  LoginResponseData, 
  LoginForAccountRequest, 
  AvailableAccount as AvailableAccountItem,
  LoadAccountsResponse,
  CheckAuthResponse
} from '@/types/api';

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
	return postJson<CheckAuthResponse>('/api/authentication', { func: 'isAuth' });
}

export async function logoutApi() {
	return postJson('/api/authentication', { func: 'logout' });
}

export async function loadAccounts() {
	return postJson<LoadAccountsResponse>('/api/authentication', { func: 'loadAccounts' });
}