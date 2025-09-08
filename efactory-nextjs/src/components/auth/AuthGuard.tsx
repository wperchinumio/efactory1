import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { getAuthState, getRedirectPath, validateAuthToken, performLogout } from '@/lib/auth/guards';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  isAuthRoute?: boolean;
}

export default function AuthGuard({ children, isAuthRoute = false }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const hasInitialized = useRef(false);
  const currentPath = useRef(router.asPath);

  useEffect(() => {
    // Update current path ref
    currentPath.current = router.asPath;
  }, [router.asPath]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for auth routes
        if (isAuthRoute) {
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Validate token first
        const hasValidToken = validateAuthToken();
        if (!hasValidToken) {
          await router.replace('/auth/sign-in');
          return;
        }

        // Get current auth state
        const authState = getAuthState();
        
        // Check if redirect is needed
        const redirectPath = getRedirectPath(currentPath.current, authState);
        
        if (redirectPath) {
          await router.replace(redirectPath);
          return;
        }

        // Check if user has access to current route
        const { hasRouteAccess } = await import('@/lib/auth/guards');
        const hasAccess = hasRouteAccess(currentPath.current, authState);
        
        if (hasAccess) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On any error, clear auth and redirect to login
        performLogout();
      } finally {
        setIsLoading(false);
        hasInitialized.current = true;
      }
    };

    // Always run auth check to ensure proper authorization
    checkAuth();
  }, [router, isAuthRoute]);

  // Handle storage events (for logout in other tabs)
  useEffect(() => {
    if (typeof window === 'undefined' || isAuthRoute) return;

    const handleStorageChange = (e: StorageEvent) => {
      // If authToken was removed in another tab, logout this tab too
      if (e.key === 'authToken' && e.newValue === null) {
        performLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthRoute]);

  // Handle visibility change (when tab becomes visible again)
  useEffect(() => {
    if (typeof window === 'undefined' || isAuthRoute) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Re-validate auth when tab becomes visible
        const hasValidToken = validateAuthToken();
        if (!hasValidToken) {
          performLogout();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthRoute]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-body-color flex items-center justify-center">
        <LoadingSpinner size="lg" message="Checking authentication..." />
      </div>
    );
  }

  // Show children only if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }


  // Fallback - should not reach here due to redirects
  const handleGoToLogin = () => {
    // Determine the appropriate login page based on current context
    const authState = getAuthState();
    
    if (authState.isAdmin) {
      // Admin users should go to admin login page
      router.push('/admin/login-user');
    } else {
      // Regular users go to customer login page
      router.push('/auth/sign-in');
    }
  };

  return (
    <div className="min-h-screen bg-body-color flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-font-color mb-4">Access Denied</h1>
        <p className="text-font-color-100 mb-4">You don't have permission to access this page.</p>
        <button 
          onClick={handleGoToLogin}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
