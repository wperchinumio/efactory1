import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getDefaultRoute } from '@/utils/navigation';
import { getAuthToken } from '@/lib/auth/storage';

const DynamicRootPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Get user apps from auth token
    const auth = getAuthToken();
    const userApps = auth?.user_data?.apps || [];
    const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
    const isAdmin = roles.includes('ADM');
    
    if (userApps.length > 0) {
      // Get the default route for this user based on their permissions
      const defaultRoute = getDefaultRoute(userApps);
      
      // Redirect to the first available menu
      router.replace(defaultRoute);
    } else {
      // No apps available - handle based on user type
      if (isAdmin) {
        // Admin with no apps should go to login-user page
        router.replace('/admin/login-user');
      } else {
        // Regular user with no apps - show no-apps page
        router.replace('/no-apps');
      }
    }
  }, [router]);

  // Show loading while redirecting
  return (
    <div className='md:px-6 sm:px-3 pt-4'>
      <div className='container-fluid'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
            <p className='text-font-color-100'>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicRootPage;