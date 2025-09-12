// Centralized API types for eFactory Next.js application
// This file serves as the single source of truth for all API-related interfaces

// ============================================================================
// BASE API TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  error_message?: string;
  error_dialog?: boolean;
  internal_version?: string;
  [key: string]: unknown;
}

export interface ApiError {
  error_message: string;
  error_dialog?: boolean;
  status?: number;
  code?: string;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface AuthResponse {
  data: {
    api_token: string;
    admin_roles: string[];
    available_accounts: AvailableAccount[];
    user_data: UserData;
    account: string | null;
    apps: number[];
  };
  error_message: string;
  error_dialog: boolean;
}

export interface AvailableAccount {
  username: string;
  company: string;
  location: string;
  policy: string;
  is_EDI?: boolean;
}

export interface UserData {
  user_id: number;
  local: boolean;
  roles: string[];
  name: string | null;
  is_master: boolean;
  account: string | null;
  region: string | null;
  apps?: number[];
  warehouses?: Record<string, unknown>;
  calc_accounts?: string[];
  calc_locations?: string[];
  calc_account_regions?: Record<string, string>;
  is_local_admin?: boolean;
  username?: string;
  login?: string;
  email?: string;
}

export interface AuthToken {
  api_token: string;
  available_accounts?: AvailableAccount[];
  admin_roles?: string[];
  user_data?: UserData;
}

// ============================================================================
// USER & APP TYPES
// ============================================================================

export interface UserApp {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  roles: string[];
  is_master: boolean;
  account: string | null;
  region: string | null;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface MenuItem {
  keyword: string;
  iconClassName?: string;
  iconComponent?: React.ComponentType<any>;
  title: string;
  route?: string;
  sectionTitleBefore?: string;
  isDropdownOpenDefault?: boolean;
  dropdownMenus?: DropdownMenuItem[];
  badge?: string;
  badgeClassName?: string;
  appId?: number; // Single app ID for direct routes
  appIds?: number[]; // Array of app IDs for compatibility
}

export interface DropdownMenuItem {
  keyword: string;
  route: string;
  title: string;
  badge?: string;
  badgeClassName?: string;
  appId?: number;
  isDevOnly?: boolean;
}

export interface TopMenuConfig {
  keyword: string;
  title: string;
  iconClassName?: string;
  iconComponent?: React.ComponentType<any>;
  appIds: number[];
  sidebarConfig?: string;
  isDropdown?: boolean;
  dropdownMenus?: DropdownMenuItem[];
  isDevOnly?: boolean;
}

export interface SidebarConfig {
  searchBox?: string;
  menus: MenuItem[];
}

export interface NavigationContextType {
  userApps: number[];
  activeTopMenu: string | null;
  setActiveTopMenu: (menu: string | null) => void;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

export interface LoginRequest {
  func: 'login';
  username: string;
  password: string;
  dcl_user?: boolean;
  force_logout?: boolean;
}

export interface LoginForAccountRequest {
  func: 'loginForAccount';
  account: string;
}

export interface LoginResponseData {
  api_token: string;
  admin_roles: string[];
  available_accounts: AvailableAccount[];
  user_data: UserData;
  account: string | null;
  apps: number[];
}

export interface CheckAuthResponse {
  is_local?: boolean;
}

export interface LoadAccountsResponse {
  available_accounts: AvailableAccount[];
  admin_roles: string[];
}

// ============================================================================
// COMMON UTILITY TYPES
// ============================================================================

export interface FilterOption {
  value: string;
  label: string;
  name?: string;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

export interface ChartData {
  series: Array<{
    name: string;
    data: number[];
  }>;
  categories?: string[];
}

export interface FilterState {
  [key: string]: any;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ErrorState {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

export interface ApiErrorState {
  message: string;
  code?: string;
  status?: number;
  retryable?: boolean;
}

// ============================================================================
// LOADING TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: ApiErrorState | null;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'checkbox' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationState;
}

// ============================================================================
// FEEDBACK TYPES
// ============================================================================

export interface FeedbackSubmissionRequest {
  type: 'idea' | 'question' | 'problem';
  message: string;
  file?: File;
}

export interface FeedbackSubmissionResponse {
  success: boolean;
  message: string;
}

export interface FeedbackApiError {
  success: false;
  message: string;
  error?: string;
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

// All types are already exported above as interfaces
