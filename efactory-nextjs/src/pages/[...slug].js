import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken } from '@/lib/auth/storage';
import { getAppIdForPathname, hasAccessToPathname } from '@/utils/navigation';
import { getActiveTopMenu } from '@/config/navigation';

const DynamicRoutePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [routeAccess, setRouteAccess] = useState(true);

  useEffect(() => {
    if (!slug || !Array.isArray(slug)) return;

    // Reconstruct the pathname from slug array
    const pathname = '/' + slug.join('/');

    // Get user apps from auth token
    const auth = getAuthToken();
    
    // If no auth token at all, redirect to sign-in
    if (!auth || !auth.api_token) {
      router.replace('/auth/sign-in');
      return;
    }

    const userApps = auth?.user_data?.apps || [];
    const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
    const isAdmin = roles.includes('ADM');

    // If no apps, handle based on user type
    if (userApps.length === 0) {
      if (isAdmin) {
        // Admin with no apps should go to login-user page
        router.replace('/admin/login-user');
      } else {
        // Regular user with no apps - show no-apps page
        router.replace('/no-apps');
      }
      return;
    }

    // Check if user has access to this pathname
    const hasAccess = hasAccessToPathname(pathname, userApps);

    // Check if this is a valid route that should show a page
    const appId = getAppIdForPathname(pathname);
    
    if (!appId) {
      // Redirect to first available route
      const { getDefaultRoute } = require('@/utils/navigation');
      const defaultRoute = getDefaultRoute(userApps);
      router.replace(defaultRoute);
      return;
    }
    setRouteAccess(hasAccess);
    setIsValid(true);
    setIsLoading(false);

  }, [slug, router]);

  if (isLoading) {
    return (
      <div className='md:px-6 sm:px-3 pt-4'>
        <div className='container-fluid'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p className='text-font-color-100'>Loading page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className='md:px-6 sm:px-3 pt-4'>
        <div className='container-fluid'>
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <p className='text-font-color-100'>Access denied or page not found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the appropriate page content based on the route
  // For now, we'll show a generic page structure
  // In the future, this could dynamically import specific page components
  return (
    <div className='md:px-6 sm:px-3 pt-4'>
      <div className='container-fluid'>
        <h1 className="text-[32px]/[38px] font-semibold mb-6">
          Dynamic Page: /{slug?.join('/')}
        </h1>
        
        <div className='card bg-card-color rounded-xl border border-dashed border-border-color'>
          <div className='md:p-6 p-4'>
            <h2 className='text-xl font-semibold mb-4'>Page Content</h2>
            <p className='text-font-color-100 mb-4'>
              This is a dynamic page that loads based on the URL structure.
            </p>
            <div className='bg-primary-5 p-4 rounded-lg'>
              <p className='text-sm font-medium mb-2'>Route Information:</p>
              <ul className='text-sm text-font-color-100 space-y-1'>
                <li>• Pathname: /{slug?.join('/')}</li>
                <li>• App ID: {getAppIdForPathname('/' + slug?.join('/'))}</li>
                <li>• Access: {routeAccess ? 'Granted' : 'Denied'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRoutePage;
