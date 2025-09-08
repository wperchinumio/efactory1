import { getAuthToken, clearAuthToken } from './storage';
import type { AuthToken } from '@/types/api';

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userApps: number[];
  hasValidSession: boolean;
}

/**
 * Get current authentication state safely
 */
export function getAuthState(): AuthState {
  try {
    if (typeof window === 'undefined') {
      return {
        isAuthenticated: false,
        isAdmin: false,
        userApps: [],
        hasValidSession: false
      };
    }

    const auth = getAuthToken();
    
    if (!auth || !auth.api_token) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        userApps: [],
        hasValidSession: false
      };
    }

    const roles = Array.isArray(auth.user_data?.roles) ? auth.user_data.roles : [];
    const isAdmin = roles.includes('ADM');
    const userApps = auth.user_data?.apps || [];

    return {
      isAuthenticated: true,
      isAdmin,
      userApps,
      hasValidSession: true
    };
  } catch (error) {
    console.error('Error getting auth state:', error);
    // Clear corrupted auth data
    clearAuthToken();
    return {
      isAuthenticated: false,
      isAdmin: false,
      userApps: [],
      hasValidSession: false
    };
  }
}

/**
 * Check if current path is an auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/');
}

/**
 * Check if current path is an admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin/');
}

/**
 * Dev-only open routes (no app id required)
 */
function isDevOpenRoute(pathname: string): boolean {
  const pathOnly = typeof pathname === 'string' ? pathname.split('?')[0] : '';
  return pathOnly === '/testcomponents';
}

/**
 * Get the appropriate redirect path based on user state and current path
 */
export function getRedirectPath(pathname: string, authState: AuthState): string | null {
  // In development, allow accessing specific dev routes without app-based access checks
  if (process.env.NODE_ENV !== 'production' && isDevOpenRoute(pathname)) {
    // Still require authentication; if not authenticated, go to login
    if (!authState.isAuthenticated) {
      return '/auth/sign-in';
    }
    // Authenticated: no redirect needed
    return null;
  }

  // If on auth route and authenticated, redirect based on user type
  if (isAuthRoute(pathname) && authState.isAuthenticated) {
    if (authState.isAdmin && authState.userApps.length === 0) {
      // Pure admin user - redirect to admin area
      return '/admin/login-user';
    } else if (authState.userApps.length > 0) {
      // Customer or admin impersonating customer - redirect to their default route
      return getDefaultRoute(authState.userApps);
    } else {
      return '/no-apps';
    }
  }

  // If not authenticated and not on auth route, redirect to login
  if (!authState.isAuthenticated && !isAuthRoute(pathname)) {
    return '/auth/sign-in';
  }

  // If authenticated customer (non-admin) trying to access admin routes, redirect to their default route
  if (authState.isAuthenticated && !authState.isAdmin && isAdminRoute(pathname)) {
    if (authState.userApps.length > 0) {
      return getDefaultRoute(authState.userApps);
    } else {
      return '/no-apps';
    }
  }

  // If admin impersonating customer (admin with apps) trying to access admin routes via URL,
  // treat them as a customer and redirect to their default route
  if (authState.isAuthenticated && authState.isAdmin && authState.userApps.length > 0 && isAdminRoute(pathname)) {
    return getDefaultRoute(authState.userApps);
  }

  // If pure admin user (admin with no apps) trying to access non-admin routes, redirect to admin
  if (authState.isAuthenticated && authState.isAdmin && authState.userApps.length === 0 && !isAdminRoute(pathname) && !isAuthRoute(pathname)) {
    return '/admin/login-user';
  }

  // Check if authenticated user has access to the specific route
  if (authState.isAuthenticated && !isAuthRoute(pathname) && !isAdminRoute(pathname)) {
    const { hasAccessToPathname } = require('@/utils/navigation');
    const hasAccess = hasAccessToPathname(pathname, authState.userApps);
    
    if (!hasAccess) {
      // User doesn't have access to this route, redirect to their default route
      return getDefaultRoute(authState.userApps);
    }
  }

  // Admin impersonating customer (admin with apps) can access customer routes - no redirect needed
  // Regular customers can access their routes - no redirect needed
  // No redirect needed
  return null;
}

/**
 * Get default route for user based on their apps
 */
export function getDefaultRoute(userApps: number[]): string {
  if (!userApps || userApps.length === 0) {
    return '/no-apps';
  }

  // Use the existing navigation utility
  const { getDefaultRoute: getNavigationDefaultRoute } = require('@/utils/navigation');
  return getNavigationDefaultRoute(userApps);
}

/**
 * Validate and clean auth token
 */
export function validateAuthToken(): boolean {
  try {
    const auth = getAuthToken();
    
    if (!auth) {
      return false;
    }

    // Check for required fields
    if (!auth.api_token || !auth.user_data) {
      clearAuthToken();
      return false;
    }

    // Validate token structure
    if (typeof auth.api_token !== 'string' || auth.api_token.length === 0) {
      clearAuthToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating auth token:', error);
    clearAuthToken();
    return false;
  }
}

/**
 * Safe logout that clears all auth data and redirects
 */
export function performLogout(): void {
  try {
    clearAuthToken();
    
    // Clear any other auth-related data
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('globalApiData');
      window.localStorage.removeItem('rememberUsername');
      
      // Force redirect to login
      window.location.href = '/auth/sign-in';
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Force redirect even if cleanup fails
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/sign-in';
    }
  }
}

/**
 * Check if user has access to specific route
 */
export function hasRouteAccess(pathname: string, authState: AuthState): boolean {
  // Auth routes are always accessible
  if (isAuthRoute(pathname)) {
    return true;
  }

  // Must be authenticated for non-auth routes
  if (!authState.isAuthenticated) {
    return false;
  }

  // Allow dev-only open routes regardless of app access when authenticated
  if (process.env.NODE_ENV !== 'production' && isDevOpenRoute(pathname)) {
    return true;
  }

  // Admin routes require admin role AND no user apps (pure admin only)
  // Admin impersonating customers (admin with apps) cannot access admin routes via URL
  if (isAdminRoute(pathname)) {
    if (!authState.isAdmin) {
      // Regular customers cannot access admin routes
      return false;
    }
    if (authState.isAdmin && authState.userApps.length > 0) {
      // Admin impersonating customer cannot access admin routes via URL
      return false;
    }
    // Only pure admin users (admin with no apps) can access admin routes
    return true;
  }

  // Non-admin routes:
  // - Regular customers (non-admin with apps) can access IF they have permission for the specific route
  // - Admin impersonating customers (admin with apps) can access IF they have permission for the specific route
  // - Pure admin users (admin with no apps) cannot access
  if (!isAdminRoute(pathname)) {
    if (authState.isAdmin && authState.userApps.length === 0) {
      // Pure admin user cannot access customer routes
      return false;
    }
    
    // Check if user has access to this specific route based on their app permissions
    const { hasAccessToPathname } = require('@/utils/navigation');
    const hasAccess = hasAccessToPathname(pathname, authState.userApps);
    
    return hasAccess;
  }

  return true;
}
