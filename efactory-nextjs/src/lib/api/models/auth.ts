// Re-export types from centralized location
export type {
  LoginRequest,
  LoginForAccountRequest,
  LoginResponseData,
  AvailableAccount as AvailableAccountItem,
  UserData,
} from '@/types/api';

export interface SimpleOkResponse {
	success?: boolean;
	[key: string]: unknown;
}
