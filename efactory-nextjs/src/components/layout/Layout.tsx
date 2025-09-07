import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Header from '../partial/Header'
import Sidebar from '../partial/Sidebar'
import Footer from '../partial/Footer'
import { NavigationProvider } from '@/contexts/NavigationContext'
import SidebarMenu from '@/components/layout/SidebarMenu'
import { getAuthToken } from '@/lib/auth/storage'
import type { UserApp } from '@/types/api'

interface LayoutProps {
  children: React.ReactNode;
  userApps?: UserApp[];
}

export default function Layout({ children, userApps = [] }: LayoutProps) {
  const router = useRouter();
  
  // Hide footer on login-user, online-customer, users, analytics, and license-summary pages
  const hideFooter = router.pathname.includes('/login-user') || router.pathname.includes('/online-customer') || router.pathname.includes('/admin/users') || router.pathname.includes('/admin/analytics') || router.pathname.includes('/admin/license-summary');
  const [container, setContainer] = useState<boolean>(false);

  // Initialize container state from localStorage after hydration
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const savedContainer = localStorage.getItem('container') === 'true';
      setContainer(savedContainer);
    }
  }, []);

  useEffect(() => {
    // Update the container class based on state
    const containerElements = document.querySelectorAll('.container, .container-fluid');
    containerElements.forEach(el => {
      if (container) {
        el.classList.add('container');
        el.classList.remove('container-fluid');
      } else {
        el.classList.add('container-fluid');
        el.classList.remove('container');
      }
    });
    if (typeof localStorage !== "undefined") {
      localStorage.setItem('container', container.toString());
    }
  }, [container, router.pathname]); // Update on container state or pageUrl change

  const containerToggle = (): void => {
    setContainer(prev => !prev);
  };

  const [mobileNav, setMobileNav] = useState<boolean>(false);
  const toggleMobileNav = (): void => setMobileNav(prev => !prev);

  const [note, setNote] = useState<boolean>(false);
  const toggleNote = (): void => setNote(prev => !prev);

  const [chat, setChat] = useState<boolean>(false);
  const toggleChat = (): void => setChat(prev => !prev);

  // Determine which navigation system to show - use state to avoid hydration mismatch
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  
  useEffect(() => {
    // Only run on client side after hydration
    setIsHydrated(true);
    const auth = getAuthToken();
    const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
    setIsAdmin(roles.includes('ADM'));
  }, []);
  
  // Clear navigation logic:
  // 1. If user is on /admin routes AND no userApps → show admin sidebar
  // 2. If admin has userApps (impersonating customer) → show customer sidebar
  // 3. Otherwise → show dynamic sidebar following /[topmenu]/[sidemenu] pattern
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isAdminImpersonating = isAdmin && userApps.length > 0;
  const isCustomerContext = !isAdminRoute || isAdminImpersonating; // Customer context if not admin route OR admin impersonating customer

  
  // Don't render navigation until hydrated to avoid mismatch
  if (!isHydrated) {
    return (
      <div className='admin-wrapper overflow-hidden'>
        <div className='flex h-svh relative'>
          <div className='main flex-1 flex flex-col overflow-auto custom-scrollbar bg-body-color'>
            <div className="p-4">
              <div className="animate-pulse bg-gray-200 h-16 rounded mb-4"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded mb-2"></div>
              <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  
  // Convert userApps to number array for NavigationProvider
  const userAppIds = userApps.map(app => parseInt(app.id) || 0);

  return (
    <NavigationProvider userApps={userAppIds}>
      <div className='admin-wrapper overflow-hidden'>
        <div className='flex h-svh relative'>
          <div className={`sidebar sm:w-[280px] sm:min-w-[280px] w-full px-2 py-4 overflow-y-scroll flex flex-col custom-scrollbar xl:static fixed xl:h-screen md:h-[calc(100vh-74px)] h-[calc(100vh-64px)] md:top-[74px] top-[64px] z-[3] bg-body-color xl:shadow-none transition-all duration-300 ${mobileNav ? 'shadow-shadow-lg left-0' : '-left-full'}`}>
            {isCustomerContext ? (
              <SidebarMenu setMobileNav={setMobileNav} />
            ) : (
              <Sidebar setMobileNav={setMobileNav} note={note} toggleNote={toggleNote} chat={chat} toggleChat={toggleChat} />
            )}
          </div>
          <div className='main flex-1 flex flex-col overflow-auto custom-scrollbar bg-body-color'>
            <Header toggleMobileNav={toggleMobileNav} mobileNav={mobileNav} toggleNote={toggleNote} toggleChat={toggleChat} containerToggle={containerToggle} container={container} userApps={userAppIds} />
            {children}
            {!hideFooter && <Footer />}
          </div>
        </div>
      </div>
    </NavigationProvider>
  )
}
