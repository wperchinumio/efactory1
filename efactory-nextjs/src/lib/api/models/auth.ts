export interface LoginRequest {
	func: 'login';
	username: string;
	password: string;
	dcl_user?: boolean;
	force_logout?: boolean;
}

export interface AvailableAccountItem {
	username: string;
	company: string;
	location: string;
	is_EDI?: boolean;
}

export interface UserData {
	name?: string;
	roles: string[];
	warehouses: Record<string, unknown>;
	apps?: string[];
	[extra: string]: unknown;
}

export interface LoginResponseData {
	api_token: string;
	user_data: UserData;
	available_accounts?: AvailableAccountItem[];
	admin_roles?: string[];
	is_local?: boolean;
}

export interface SimpleOkResponse {
	success?: boolean;
	[key: string]: unknown;
}

export interface LoginForAccountRequest {
	func: 'loginForAccount';
	account: string;
}
