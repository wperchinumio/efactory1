import React from 'react';
import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { useRouter } from 'next/router';

const NoAppsPage = () => {
  const router = useRouter();

  const handleRefresh = () => {
    // Force a page reload to re-check authentication and apps
    window.location.reload();
  };

  const handleSignOut = () => {
    // Clear auth and redirect to sign-in
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('globalApiData');
      router.replace('/auth/sign-in');
    }
  };

  return (
    <div className='md:px-6 sm:px-3 pt-4 min-h-screen bg-body-color flex items-center justify-center'>
      <div className='container-fluid max-w-md mx-auto'>
        <div className='card bg-card-color rounded-xl border border-dashed border-border-color p-8 text-center'>
          <div className='w-[80px] h-[80px] mx-auto mb-6 rounded-full bg-warning-10 flex items-center justify-center'>
            <IconAlertTriangle className='w-[40px] h-[40px] text-warning' />
          </div>
          
          <h1 className='text-[24px]/[32px] font-bold text-font-color mb-4'>
            No Applications Available
          </h1>
          
          <p className='text-font-color-100 text-[16px]/[24px] mb-6'>
            Your account doesn't have access to any applications at this time. 
            Please contact your administrator to request access to the applications you need.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <button 
              onClick={handleRefresh}
              className='btn btn-outline-primary flex items-center justify-center gap-2'
            >
              <IconRefresh className='w-[16px] h-[16px]' />
              Refresh
            </button>
            
            <button 
              onClick={handleSignOut}
              className='btn btn-secondary flex items-center justify-center gap-2'
            >
              Sign Out
            </button>
          </div>
          
          <div className='mt-6 pt-6 border-t border-border-color'>
            <p className='text-[12px]/[18px] text-font-color-100'>
              Need help? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: false, // This is not an auth route, but requires authentication
    },
  };
}

export default NoAppsPage;
