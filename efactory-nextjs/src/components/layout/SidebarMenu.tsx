import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CompanyLogo from '@/components/common/CompanyLogo';
import { useRouter } from 'next/router';
import { useNavigation } from '@/contexts/NavigationContext';
import { getVisibleSidebarMenus, sidebarConfigs, topMenuConfig } from '@/config/navigation';
import { MenuItem, DropdownMenuItem, TopMenuConfig } from '@/types/api/auth';
import { getAuthToken } from '@/lib/auth/storage';
import { getThemePreferences } from '@/lib/themeStorage';
import {
  IconChevronRight,
  IconChevronsDown,
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconHome,
  IconPencil,
  IconClipboardList,
  IconPackage,
  IconShip,
  IconFileText,
  IconCube,
  IconArrowDown,
  IconArrowsExchange,
  IconTag,
  IconShoppingCart,
  IconTruck,
  IconChartBar,
  IconCloud,
  IconFiles,
  IconSettings,
  IconMapPin,
  IconFileSpreadsheet,
  IconCalendar,
  IconCalculator,
  IconInfoCircle,
  IconCloudUpload,
  IconBriefcase,
  IconUserPlus,
  IconShare,
  IconBuilding,
  IconClock,
  IconBolt,
  IconCalendarCheck,
  IconBuildingWarehouse,
  IconBoxSeam,
  IconBarcode,
  IconEdit,
  IconEye,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconAlertTriangle,
  IconCircleCheck,
  IconX,
  IconMinus,
  IconFilter,
  IconSortAscending,
  IconDatabase,
  IconServer,
  IconNetwork,
  IconMail,
  IconBell,
  IconKey,
  IconLock,
  IconShield,
  IconUserCheck,
  IconCreditCard,
  IconReceipt,
  IconCurrency,
  IconPercentage,
  IconTarget,
  IconTrendingUp,
  IconChartPie,
  IconActivity,
  IconGlobe,
  IconLink,
  IconExternalLink,
  IconDownload as IconImport,
  IconUpload as IconExport,
  IconNote,
  IconMessage,
  IconPower,
} from '@tabler/icons-react';
import Calculator from '../../components/ui/Calculator';

interface SidebarMenuProps {
  setMobileNav?: (value: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ setMobileNav }) => {
  const { userApps, activeTopMenu, setActiveTopMenu } = useNavigation();
  
  // Track mini sidebar state
  const [isMiniSidebar, setIsMiniSidebar] = useState(false);
  const router = useRouter();
  
  // Helper function to strip query strings from URL
  const stripQueryString = (url: string): string => {
    return url.split('?')[0] || '';
  };
  
  const pageUrl = stripQueryString(router.asPath); // Strip query strings for proper route matching
  
  // Calculate active sidebar menu directly from URL - much simpler and more reliable
  const getActiveSidebarMenu = () => {
    const pathSegments = pageUrl.split('/').filter(Boolean);
    
    if (pathSegments.length === 1 && activeTopMenu) {
      // Only /[topmenu] - return first available sidebar menu
      const visibleMenus = getVisibleSidebarMenus(activeTopMenu, userApps);
      if (visibleMenus.length > 0) {
        const firstMenu = visibleMenus[0];
        if (firstMenu) {
          return firstMenu.keyword;
        }
      }
    } else if (pathSegments.length >= 2 && activeTopMenu) {
      // Find the sidebar menu that contains the current route
      const visibleMenus = getVisibleSidebarMenus(activeTopMenu, userApps);
      
      for (const menu of visibleMenus) {
        // Check if this menu has the current route
        if (menu.route === pageUrl) {
          return menu.keyword;
        }
        
        // Check if any dropdown menu has the current route
        if (menu.dropdownMenus) {
          const matchingDropdown = menu.dropdownMenus.find((dropdown: DropdownMenuItem) => dropdown.route === pageUrl);
          if (matchingDropdown) {
            return menu.keyword;
          }
        }
      }
      
      return visibleMenus.length > 0 && visibleMenus[0] ? visibleMenus[0].keyword : null;
    }
    
    return null;
  };
  
  const calculatedActiveSidebarMenu = getActiveSidebarMenu();

  // Helper function to check if a parent menu should be highlighted
  // Only highlight if one of its children is actually selected
  const shouldHighlightParent = (item: MenuItem) => {
    // If this menu has a direct route and it matches the current URL, highlight it
    if (item.route === pageUrl) {
      return true;
    }
    
    // If this menu has dropdown children, only highlight if one of the children is selected
    if (item.dropdownMenus && item.dropdownMenus.length > 0) {
      const hasSelectedChild = item.dropdownMenus.some(dropdown => dropdown.route === pageUrl);
      return hasSelectedChild;
    }
    
    return false;
  };

  // Helper function to render icons (Tabler components or CSS classes)
  const renderIcon = (item: MenuItem) => {
    if (item.iconComponent) {
      const IconComponent = item.iconComponent;
      return <IconComponent className="stroke-[1.5] w-[22px] h-[22px]" />;
    } else if (item.iconClassName) {
      return <i className={`${item.iconClassName} w-[22px] h-[22px]`} />;
    }
    // Fallback icon if no icon is defined
    return <IconBoxSeam className="stroke-[1.5] w-[22px] h-[22px] text-gray-400" />;
  };

  // Helper to render top menu icons
  const renderTopIcon = (menu: TopMenuConfig) => {
    if (menu.iconComponent) {
      const IconComponent = menu.iconComponent;
      return <IconComponent className="w-[18px] h-[18px]" />;
    } else if (menu.iconClassName) {
      return <i className={`${menu.iconClassName} w-[18px] h-[18px]`} />;
    }
    return null;
  };
  
  // Use exact Luno state management pattern
  const [adminMenu, setAdminMenu] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuActive, setMenuActive] = useState<number | null>(null);
  const [activeMenus, setActiveMenus] = useState<Set<number>>(new Set());
  const [sidebarAutoCollapse, setSidebarAutoCollapse] = useState(true);
  const [menusInitialized, setMenusInitialized] = useState(false);
  const [topSwitchOpen, setTopSwitchOpen] = useState(false);
  const topSwitchMenuRef = useRef<HTMLUListElement>(null);
  const topSwitchButtonRef = useRef<HTMLButtonElement>(null);

  const toggleAdminMenu = () => {
    setAdminMenu(!adminMenu);
  };

  const [schedule, setSchedule] = useState(false);
  const toggleSchedule = () => setSchedule(!schedule);

  const [note, setNote] = useState(false);
  const toggleNote = () => setNote(!note);

  const [calculatorOpen, setCalculatorOpen] = useState(false);

  // Replace toggleChat with toggleCalculator
  const toggleCalculator = () => setCalculatorOpen(!calculatorOpen);

  // Track mini sidebar state by observing CSS class changes
  useEffect(() => {
    const checkMiniSidebar = () => {
      const adminWrapper = document.querySelector('.admin-wrapper');
      setIsMiniSidebar(adminWrapper?.classList.contains('mini-sidebar') || false);
    };

    // Check initial state
    checkMiniSidebar();

    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkMiniSidebar();
        }
      });
    });

    // Start observing the admin-wrapper element
    const adminWrapper = document.querySelector('.admin-wrapper');
    if (adminWrapper) {
      observer.observe(adminWrapper, { attributes: true, attributeFilter: ['class'] });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Load theme preferences on component mount and listen for changes
  useEffect(() => {
    const themePrefs = getThemePreferences();
    setSidebarAutoCollapse(themePrefs.sidebarAutoCollapse);

    // Listen for theme changes (when user toggles setting in Theme Setting modal)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'efactory-theme-preferences') {
        const newThemePrefs = getThemePreferences();
        setSidebarAutoCollapse(newThemePrefs.sidebarAutoCollapse);
      }
    };

    // Listen for both storage events (cross-tab) and custom events (same-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab changes (when Theme Setting modal saves)
    const handleThemeChange = () => {
      const newThemePrefs = getThemePreferences();
      setSidebarAutoCollapse(newThemePrefs.sidebarAutoCollapse);
    };
    
    window.addEventListener('themePreferencesChanged', handleThemeChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themePreferencesChanged', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setAdminMenu(false);
      }

      // Close top menu switcher
      if (
        topSwitchMenuRef.current &&
        !topSwitchMenuRef.current.contains(event.target as Node) &&
        topSwitchButtonRef.current &&
        !topSwitchButtonRef.current.contains(event.target as Node)
      ) {
        setTopSwitchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const menuToggle = (key: number) => {
    if (sidebarAutoCollapse) {
      // Auto-collapse mode: only one menu can be open at a time
      setMenuActive(menuActive === key ? null : key);
    } else {
      // Multi-expand mode: multiple menus can be open simultaneously
      setActiveMenus(prev => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    }
  };

  // If no userApps yet, try to get them from auth token directly
  const effectiveUserApps = userApps.length > 0 ? userApps : (() => {
    try {
      const auth = getAuthToken();
      return auth?.user_data?.apps || [];
    } catch {
      return [];
    }
  })();

  // Compute the active top menu, including special-case mapping from services dropdown
  const effectiveActiveTopMenu = (() => {
    if (activeTopMenu) return activeTopMenu;
    const path = pageUrl;
    if (path === '/documents' || path.startsWith('/documents/')) return 'documents';
    if (path.startsWith('/services/administration-tasks')) return 'administration_tasks';
    return null;
  })();

  // Get visible menus using effective user apps
  let visibleMenus = effectiveActiveTopMenu ? getVisibleSidebarMenus(effectiveActiveTopMenu, effectiveUserApps) : [];

  // Determine search box type and placeholder from sidebar config
  const currentSidebarConfigKey = effectiveActiveTopMenu || '';
  const currentSidebarConfig = currentSidebarConfigKey ? sidebarConfigs[currentSidebarConfigKey as keyof typeof sidebarConfigs] : null;
  const searchType = currentSidebarConfig && 'searchBox' in currentSidebarConfig ? (currentSidebarConfig as any).searchBox as string | undefined : undefined;
  const searchPlaceholder = (() => {
    switch (searchType) {
      case 'order':
        return 'Search for Order #...';
      case 'item':
        return 'Search for Item #...';
      case 'rma':
        return 'Search for RMA #...';
      default:
        return undefined;
    }
  })();

  // Compute visible top menus for quick switching inside sidebar
  const visibleTopMenus: TopMenuConfig[] = topMenuConfig.filter(menu => {
    if (!menu.appIds || menu.appIds.length === 0) return true;
    return menu.appIds.some(appId => effectiveUserApps.includes(appId));
  });
  const activeTopMenuTitle = (() => {
    const found = visibleTopMenus.find(m => m.keyword === activeTopMenu);
    return found ? found.title : 'Select section';
  })();
  
  // Special case: if we're on overview page and no visible menus, show overview menu anyway
  if (pageUrl === '/overview' && visibleMenus.length === 0) {
    visibleMenus = getVisibleSidebarMenus('overview', effectiveUserApps);
  }

  // Show loading if still no userApps and no activeTopMenu, but only for a short time
  if (effectiveUserApps.length === 0 && !activeTopMenu && pageUrl !== '/overview') {
    return (
      <>
        {/* Sidebar header - exact Luno structure */}
        <div className='sidebar-header px-3 mb-6 flex items-center justify-between gap-2'>
          <h4 className='sidebar-title text-[24px]/[30px] font-medium mb-0'>
            <span className='sm-txt'>e</span><span>Factory</span>
          </h4>
        </div>
        <div className='px-3'>
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2'></div>
            <p className='text-sm text-font-color-100'>Loading...</p>
          </div>
        </div>
      </>
    );
  }


  // Initialize active menus based on current route - only run when route or mode changes
  // Initialize with null so the effect below runs on first mount
  const prevPageUrl = useRef<string | null>(null);
  const prevSidebarAutoCollapse = useRef<boolean | null>(null);
  const prevActiveTopMenu = useRef<string | null>(null);
  const prevUserApps = useRef<number[]>([]);
  
  useEffect(() => {
    // Safety check to prevent hooks errors during auth state changes
    try {
      const isFirstRun = prevPageUrl.current === null || prevSidebarAutoCollapse.current === null;
      const routeChanged = prevPageUrl.current !== pageUrl;
      const modeChanged = prevSidebarAutoCollapse.current !== sidebarAutoCollapse;
      const topMenuChanged = prevActiveTopMenu.current !== activeTopMenu;
      const userAppsChanged = JSON.stringify(prevUserApps.current) !== JSON.stringify(userApps);
      
      // Only run expansion logic on route changes or first run, not on every state change
      if (isFirstRun || routeChanged || topMenuChanged || userAppsChanged) {
      if (sidebarAutoCollapse) {
        // Auto-collapse mode: find first matching menu
        let foundIndex: number | null = null;
        for (let i = 0; i < visibleMenus.length; i++) {
          const item = visibleMenus[i];
          if (item && item.dropdownMenus) {
            for (const child of item.dropdownMenus) {
              if (child.route === pageUrl) {
                foundIndex = i;
                break;
              }
            }
          } else if (item && item.route === pageUrl) {
            foundIndex = i;
            break;
          }
          if (foundIndex !== null) break;
        }

        // Fallback: match by calculated active sidebar menu keyword
        if (foundIndex === null && calculatedActiveSidebarMenu) {
          const idx = visibleMenus.findIndex(m => m.keyword === calculatedActiveSidebarMenu);
          if (idx >= 0) foundIndex = idx;
        }

        // Fallback: find first menu that should be open by default
        if (foundIndex === null) {
          for (let i = 0; i < visibleMenus.length; i++) {
            const item = visibleMenus[i];
            if (item && item.isDropdownOpenDefault && item.dropdownMenus && item.dropdownMenus.length > 0) {
              foundIndex = i;
              break;
            }
          }
        }

        // Final fallback: first menu
        if (foundIndex === null && visibleMenus.length > 0) {
          foundIndex = 0;
        }

        setMenuActive(foundIndex);
      } else {
        // Multi-expand mode: find all matching menus
        const newActiveMenus = new Set<number>();
        for (let i = 0; i < visibleMenus.length; i++) {
          const item = visibleMenus[i];
          if (item && item.dropdownMenus) {
            for (const child of item.dropdownMenus) {
              if (child.route === pageUrl) {
                newActiveMenus.add(i);
                break;
              }
            }
          } else if (item && item.route === pageUrl) {
            newActiveMenus.add(i);
          }
        }

        // Add menus that should be open by default (isDropdownOpenDefault: true)
        for (let i = 0; i < visibleMenus.length; i++) {
          const item = visibleMenus[i];
          if (item && item.isDropdownOpenDefault && item.dropdownMenus && item.dropdownMenus.length > 0) {
            newActiveMenus.add(i);
          }
        }

        // Fallback: ensure at least the calculated menu is expanded
        if (newActiveMenus.size === 0 && calculatedActiveSidebarMenu) {
          const idx = visibleMenus.findIndex(m => m.keyword === calculatedActiveSidebarMenu);
          if (idx >= 0) {
            newActiveMenus.add(idx);
          }
        }

        setActiveMenus(newActiveMenus);
      }
      
        // Update refs
        prevPageUrl.current = pageUrl;
        prevSidebarAutoCollapse.current = sidebarAutoCollapse;
        prevActiveTopMenu.current = activeTopMenu;
        prevUserApps.current = userApps;
      }
    } catch (error) {
      console.error('Error in SidebarMenu useEffect:', error);
      // Reset to safe state on error
      setMenuActive(null);
      setActiveMenus(new Set());
    }
  }, [pageUrl, sidebarAutoCollapse, visibleMenus, activeTopMenu, userApps, calculatedActiveSidebarMenu]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && calculatorOpen) {
        setCalculatorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [calculatorOpen]);

  return (
    <>
      {/* Sidebar header - with logo and smaller title */}
      <div className='sidebar-header px-3 mb-4 flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2 min-w-0'>
          <CompanyLogo 
            className={isMiniSidebar ? "w-[30px] h-auto text-primary flex-shrink-0" : "w-[91px] h-auto text-primary flex-shrink-0"} 
            miniMode={isMiniSidebar} 
          />
          {!isMiniSidebar && (
            <h4 className='sidebar-title text-[16px]/[22px] font-medium mb-0 truncate'>
              <span className='sm-txt'>e</span><span>Factory</span>
            </h4>
          )}
        </div>
      </div>

      {/* Top menu switcher - show only on small screens and when sidebar is not collapsed */}
      {visibleTopMenus.length > 0 && !isMiniSidebar && (
        <div className='px-3 -mt-4 mb-4'>
          <div className='relative xl:hidden'>
            <button
              ref={topSwitchButtonRef}
              onClick={() => setTopSwitchOpen(prev => !prev)}
              className='relative select-project form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-4 pe-4 text-[14px]/[20px] w-full appearance-none border border-border-color focus:outline-0 focus:border-primary'
            >
              {(() => {
                const current = visibleTopMenus.find(m => m.keyword === activeTopMenu) || visibleTopMenus[0];
                if (!current) return null;
                return (
                  <>
                    <span className='absolute top-1/2 -translate-y-1/2 ltr:left-5 rtl:right-5 flex items-center'>
                      {renderTopIcon(current)}
                    </span>
                    <span className='truncate'>{activeTopMenuTitle}</span>
                  </>
                );
              })()}
            </button>

            <ul
              ref={topSwitchMenuRef}
              className={`bg-card-color text-font-color z-[2] rounded-xl shadow-shadow-lg absolute left-0 right-0 top-full mt-2 border border-border-color max-h-[60svh] overflow-auto custom-scrollbar
                origin-top transition-all duration-200 ${topSwitchOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'}`}
            >
              {visibleTopMenus.map(menu => (
                <li key={menu.keyword}>
                  <button
                    onClick={() => { setActiveTopMenu(menu.keyword); setTopSwitchOpen(false); }}
                    className={`w-full px-4 py-2 flex items-center gap-2 text-left text-sm transition-all whitespace-nowrap
                      ${activeTopMenu === menu.keyword ? 'text-secondary bg-secondary-10' : 'hover:bg-primary-10'}`}
                  >
                    <span className='flex items-center w-[18px] h-[18px]'>
                      {renderTopIcon(menu)}
                    </span>
                    <span className='whitespace-nowrap'>{menu.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Contextual search box (from navigation config) - hide when sidebar is collapsed */}
      {searchPlaceholder && !isMiniSidebar && (
        <div className='px-3 py-4'>
          <div className='relative flex-1 max-w-md'>
            <IconSearch className='w-[16px] h-[16px] text-font-color-100 absolute left-3 top-1/2 -translate-y-1/2' />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className='form-control pl-9 pr-3 py-2 text-[14px] w-full bg-card-color border border-border-color rounded-lg text-font-color placeholder:text-font-color-100 focus:outline-none focus:border-primary transition-colors'
            />
          </div>
        </div>
      )}

      {/* Menu items - exact Luno structure */}
      <ul className='sidebar-list px-3 mb-4 main-menu'>
        {!activeTopMenu || visibleMenus.length === 0 ? (
          // Default customer menu when no top menu selected - exact Luno pattern
          <>
            <li className='devider py-3 menu-devider uppercase text-[12px]/[15px]'>
              {activeTopMenu ? activeTopMenu.toUpperCase() : 'MAIN'}
            </li>
            <li className='sidebar-listitem'>
              <Link 
                href="/overview" 
                onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }} 
                className={`sidebar-list-link flex items-center gap-2.5 w-full py-2 transition-all hover:text-secondary ${(pageUrl === '/overview' || calculatedActiveSidebarMenu === 'overview') ? 'text-secondary' : ''}`}
              >
                <IconHome className="stroke-[1.5] w-[22px] h-[22px]" />
                <span className='link text-[15px]/[21px]'>Overview</span>
              </Link>
            </li>
            <li className='sidebar-listitem'>
              <Link 
                href="/overview/notes" 
                onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }} 
                className={`sidebar-list-link flex items-center gap-2.5 w-full py-2 transition-all hover:text-secondary ${(pageUrl === '/overview/notes' || calculatedActiveSidebarMenu === 'notes') ? 'text-secondary' : ''}`}
              >
                <IconPencil className="stroke-[1.5] w-[22px] h-[22px]" />
                <span className='link text-[15px]/[21px]'>Personal notes</span>
              </Link>
            </li>
          </>
        ) : (
          // Dynamic menu items - exact Luno pattern
          visibleMenus.map((item, key) => {
            // Handle section dividers first
            if (item.sectionTitleBefore) {
              const menuItems = [];
              
              // Add section divider
              menuItems.push(
                <li key={`divider-${key}`} className='devider py-3 menu-devider uppercase text-[12px]/[15px]'>
                  {item.sectionTitleBefore}
                </li>
              );

              // Add the menu item after divider
              if (item.dropdownMenus && item.dropdownMenus.length > 0) {
                menuItems.push(
                  <li key={key} className='sidebar-listitem'>
                    <button
                      onClick={() => menuToggle(key)}
                      className={`sidebar-list-button flex items-center gap-2.5 w-full py-2.5 transition-all hover:text-secondary ${shouldHighlightParent(item) ? 'text-secondary' : ''}`}
                    >
                      {renderIcon(item)}
                      <span className='link text-[15px]/[21px]'>{item.title}</span>
                      {(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 
                        <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : 
                        <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                      }
                    </button>
                    <ul className={`sidebar-sublist ps-8 relative before:absolute before:h-full before:w-[1px] ltr:before:left-2.5 rtl:before:right-2.5 before:top-0 before:bg-secondary ${(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 'block' : 'hidden'}`}>
                      {item.dropdownMenus.map((sub: DropdownMenuItem, subKey: number) => (
                        <li key={subKey}>
                          <Link 
                            href={sub.route} 
                            onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                            className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-26.5px] rtl:before:right-[-26.5px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${pageUrl === sub.route ? 'text-secondary before:!block' : ''}`}
                            dangerouslySetInnerHTML={{ __html: sub.title }}
                          />
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              } else {
                menuItems.push(
                  <li key={key} className='sidebar-listitem'>
                    <Link 
                      href={item.route || '#'} 
                      onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                      className={`sidebar-list-link flex items-center gap-2.5 w-full py-2 transition-all hover:text-secondary ${pageUrl === item.route ? 'text-secondary' : ''}`}
                    >
                      {renderIcon(item)}
                      <span className='link text-[15px]/[21px]'>{item.title}</span>
                    </Link>
                  </li>
                );
              }

              return menuItems;
            }

            // Regular menu items without section divider
            return item.dropdownMenus && item.dropdownMenus.length > 0 ? (
              <li key={key} className='sidebar-listitem'>
                <button
                  onClick={() => menuToggle(key)}
                  className={`sidebar-list-button flex items-center gap-2.5 w-full py-2.5 transition-all hover:text-secondary ${shouldHighlightParent(item) ? 'text-secondary' : ''}`}
                >
                  {renderIcon(item)}
                  <span className='link text-[15px]/[21px]'>{item.title}</span>
                  {(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 
                    <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : 
                    <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                  }
                </button>
                <ul className={`sidebar-sublist ps-8 relative before:absolute before:h-full before:w-[1px] ltr:before:left-2.5 rtl:before:right-2.5 before:top-0 before:bg-secondary ${(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 'block' : 'hidden'}`}>
                  {item.dropdownMenus.map((sub: DropdownMenuItem, subKey: number) => (
                    <li key={subKey}>
                      <Link 
                        href={sub.route} 
                        onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                        className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-26.5px] rtl:before:right-[-26.5px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${pageUrl === sub.route ? 'text-secondary before:!block' : ''}`}
                        dangerouslySetInnerHTML={{ __html: sub.title }}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={key} className='sidebar-listitem'>
                <Link 
                  href={item.route || '#'} 
                  onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                  className={`sidebar-list-link flex items-center gap-2.5 w-full py-2 transition-all hover:text-secondary ${shouldHighlightParent(item) ? 'text-secondary' : ''}`}
                >
                  {renderIcon(item)}
                  <span className='link text-[15px]/[21px]'>{item.title}</span>
                </Link>
              </li>
            );
          })
        )}
      </ul>
      <div className='sidebar-bottom-link flex justify-evenly gap-3 mx-3 border border-dashed rounded-xl p-2 mt-auto'>
  <button onClick={toggleSchedule} className={`transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:transition-all after:duration-500 after:ease-in-out ${schedule ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
    <span title='My Schedule'>
      <IconCalendar className='stroke-[1.5] w-[20px] h-[20px]' />
    </span>
  </button>
  <button onClick={toggleNote} className={`transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:transition-all after:duration-500 after:ease-in-out ${note ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
    <span title='My Note'>
      <IconNote className='stroke-[1.5] w-[20px] h-[20px]' />
    </span>
  </button>
  <button onClick={toggleCalculator} className={`transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:transition-all after:duration-500 after:ease-in-out ${calculatorOpen ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
    <span title='Calculator'>
      <IconCalculator className='stroke-[1.5] w-[20px] h-[20px]' />
    </span>
  </button>
  <Link href="/auth/sign-in" title='Log Out' className='transition-all duration-300 hover:text-secondary' onClick={() => {
    import('@/lib/auth/storage').then(({ clearAuthToken }) => clearAuthToken());
  }}>
    <IconPower className='stroke-[1.5] w-[20px] h-[20px]' />
  </Link>
</div>
{calculatorOpen && (
  <div className='fixed inset-0 z-50 flex items-center justify-center'>
    <Calculator onClose={() => setCalculatorOpen(false)} />
  </div>
)}
    </>
  );
};

export default SidebarMenu;