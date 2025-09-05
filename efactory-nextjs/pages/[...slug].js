import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuthToken } from '@/lib/auth/storage';
import { getAppIdForPathname, hasAccessToPathname } from '../src/utils/navigation';
import { getActiveTopMenu } from '../src/config/navigation';

const DynamicRoutePage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug || !Array.isArray(slug)) return;

    // Reconstruct the pathname from slug array
    const pathname = '/' + slug.join('/');
    console.log('🔍 Dynamic route accessed:', pathname);

    // Get user apps from auth token
    const auth = getAuthToken();
    const userApps = auth?.user_data?.apps || [];

    if (userApps.length === 0) {
      console.log('❌ No user apps, redirecting to no-apps');
      router.replace('/no-apps');
      return;
    }

    // Check if user has access to this pathname
    console.log('🔍 Checking access for pathname:', pathname, 'user apps:', userApps);
    const hasAccess = hasAccessToPathname(pathname, userApps);
    console.log('🔍 Has access result:', hasAccess);
    
    if (!hasAccess) {
      console.log('❌ No access to pathname:', pathname, 'user apps:', userApps);
      // Redirect to first available route
      const { getDefaultRoute } = require('../src/utils/navigation');
      const defaultRoute = getDefaultRoute(userApps);
      console.log('🔄 Redirecting to default route:', defaultRoute);
      router.replace(defaultRoute);
      return;
    }

    // Check if this is a valid route that should show a page
    console.log('🔍 Getting app ID for pathname:', pathname);
    const appId = getAppIdForPathname(pathname);
    console.log('🔍 App ID result:', appId);
    
    if (!appId) {
      console.log('❌ No app ID found for pathname:', pathname);
      // Redirect to first available route
      const { getDefaultRoute } = require('../src/utils/navigation');
      const defaultRoute = getDefaultRoute(userApps);
      console.log('🔄 Redirecting to default route:', defaultRoute);
      router.replace(defaultRoute);
      return;
    }

    console.log('✅ Valid route, showing page for:', pathname, 'app ID:', appId);
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
                <li>• Access: Granted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRoutePage;
