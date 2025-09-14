import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { NavigationProvider } from '../../contexts/NavigationContext';
import TopMenu from './TopMenu';
import SidebarMenu from './SidebarMenu';
import MobileNavigation from './MobileNavigation';

interface MainLayoutProps {
  children: React.ReactNode;
  userApps: number[];
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, userApps }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show navigation on auth pages
  const isAuthPage = router.pathname.startsWith('/auth') || router.pathname === '/login';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <NavigationProvider userApps={userApps}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--body-color)' }}>
        {/* Main header with logo and navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">DCL</h1>
              </div>

              {/* Top navigation menu */}
              <div className="hidden lg:flex items-center">
                <TopMenu />
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-4">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md">
                  REFRESH
                </button>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">acs</span>
                  <i className="fa fa-chevron-down text-xs text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Desktop sidebar - Dynamic menu system */}
          <aside className="hidden lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
            <SidebarMenu />
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-40">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
                <div className="p-4">
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="mb-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <i className="fa fa-times text-xl" />
                  </button>
                  <SidebarMenu />
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-h-screen">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NavigationProvider>
  );
};

export default MainLayout;
