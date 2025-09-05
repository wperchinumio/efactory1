import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNavigation } from '../../contexts/NavigationContext';
import { getVisibleSidebarMenus, sidebarConfigs } from '../../config/navigation';
import { MenuItem, DropdownMenuItem } from '../../types/api/auth';
import { getAuthToken } from '../../../lib/auth/storage';
import { getThemePreferences } from '../../../lib/themeStorage';
import {
  IconChevronRight,
  IconChevronsDown,
  IconDots,
  IconPlus,
  IconHome,
  IconPencil,
  IconClipboardList,
  IconPackage,
  IconShip,
  IconFileText,
  IconCubes,
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
  IconGear,
  IconShare,
  IconBuilding,
  IconClock,
  IconBolt,
  IconCalendarCheck,
  IconFactory,
  IconBoxSeam,
  IconBarcode,
  IconSearch,
  IconEdit,
  IconEye,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconAlertTriangle,
  IconCheckCircle,
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
  IconPieChart,
  IconActivity,
  IconZap,
  IconGlobe,
  IconLink,
  IconExternalLink,
  IconDownload as IconImport,
  IconUpload as IconExport,
} from '@tabler/icons-react';

interface SidebarMenuProps {
  setMobileNav?: (value: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ setMobileNav }) => {
  const { userApps, activeTopMenu } = useNavigation();
  const router = useRouter();
  
  // Helper function to strip query strings from URL
  const stripQueryString = (url: string): string => {
    return url.split('?')[0];
  };
  
  const pageUrl = stripQueryString(router.asPath); // Strip query strings for proper route matching
  
  // Calculate active sidebar menu directly from URL - much simpler and more reliable
  const getActiveSidebarMenu = () => {
    const pathSegments = pageUrl.split('/').filter(Boolean);
    
    if (pathSegments.length === 1) {
      // Only /[topmenu] - return first available sidebar menu
      const visibleMenus = getVisibleSidebarMenus(activeTopMenu, userApps);
      if (visibleMenus.length > 0) {
        const firstMenu = visibleMenus[0].keyword;
        return firstMenu;
      }
    } else if (pathSegments.length >= 2) {
      // Find the sidebar menu that contains the current route
      const visibleMenus = getVisibleSidebarMenus(activeTopMenu, userApps);
      
      for (const menu of visibleMenus) {
        // Check if this menu has the current route
        if (menu.route === pageUrl) {
          return menu.keyword;
        }
        
        // Check if any dropdown menu has the current route
        if (menu.dropdownMenus) {
          const matchingDropdown = menu.dropdownMenus.find(dropdown => dropdown.route === pageUrl);
          if (matchingDropdown) {
            return menu.keyword;
          }
        }
      }
      
      return visibleMenus.length > 0 ? visibleMenus[0].keyword : null;
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
  
  // Use exact Luno state management pattern
  const [adminMenu, setAdminMenu] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuActive, setMenuActive] = useState<number | null>(null);
  const [activeMenus, setActiveMenus] = useState<Set<number>>(new Set());
  const [sidebarAutoCollapse, setSidebarAutoCollapse] = useState(true);

  const toggleAdminMenu = () => {
    setAdminMenu(!adminMenu);
  };

  // Load theme preferences on component mount and listen for changes
  useEffect(() => {
    const themePrefs = getThemePreferences();
    setSidebarAutoCollapse(themePrefs.sidebarAutoCollapse);

    // Listen for theme changes (when user toggles setting in Theme Setting modal)
    const handleStorageChange = (e) => {
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

  // Get visible menus using effective user apps
  let visibleMenus = activeTopMenu ? getVisibleSidebarMenus(activeTopMenu, effectiveUserApps) : [];
  
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
  const prevPageUrl = useRef(pageUrl);
  const prevSidebarAutoCollapse = useRef(sidebarAutoCollapse);
  
  useEffect(() => {
    const routeChanged = prevPageUrl.current !== pageUrl;
    const modeChanged = prevSidebarAutoCollapse.current !== sidebarAutoCollapse;
    
    if (routeChanged || modeChanged) {
      if (sidebarAutoCollapse) {
        // Auto-collapse mode: find first matching menu
        let foundIndex = null;
        for (let i = 0; i < visibleMenus.length; i++) {
          const item = visibleMenus[i];
          if (item.dropdownMenus) {
            for (const child of item.dropdownMenus) {
              if (child.route === pageUrl) {
                foundIndex = i;
                break;
              }
            }
          } else if (item.route === pageUrl) {
            foundIndex = i;
            break;
          }
          if (foundIndex !== null) break;
        }
        setMenuActive(foundIndex);
      } else {
        // Multi-expand mode: find all matching menus
        const newActiveMenus = new Set<number>();
        for (let i = 0; i < visibleMenus.length; i++) {
          const item = visibleMenus[i];
          if (item.dropdownMenus) {
            for (const child of item.dropdownMenus) {
              if (child.route === pageUrl) {
                newActiveMenus.add(i);
                break;
              }
            }
          } else if (item.route === pageUrl) {
            newActiveMenus.add(i);
          }
        }
        setActiveMenus(newActiveMenus);
      }
      
      // Update refs
      prevPageUrl.current = pageUrl;
      prevSidebarAutoCollapse.current = sidebarAutoCollapse;
    }
  }, [pageUrl, sidebarAutoCollapse, visibleMenus]);

  return (
    <>
      {/* Sidebar header - exact Luno structure */}
      <div className='sidebar-header px-3 mb-6 flex items-center justify-between gap-2'>
        <h4 className='sidebar-title text-[24px]/[30px] font-medium mb-0'>
          <span className='sm-txt'>e</span><span>Factory</span>
        </h4>
        <div className="sidebar-dropdown relative flex">
          <button 
            ref={buttonRef}
            onClick={toggleAdminMenu}
            className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'
          >
            <IconDots className='w-[20px] h-[20px]' />
          </button>
          <ul 
            ref={menuRef}
            className={`bg-card-color text-font-color z-[1] rounded-xl w-[180px] shadow-shadow-lg absolute end-0 top-full origin-top-right transition-all duration-300 ${adminMenu ? ' opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}`}
          >
            <li>
              <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                Landing page
              </Link>
            </li>
            <li>
              <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                eCommerce
              </Link>
            </li>
            <li>
              <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                HRMS
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Project selector - exact Luno structure */}
      <div className='create-new-project px-3 py-4 flex gap-5'>
        <input
          type="text"
          placeholder="Search for Order #..."
          className="select-project form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] w-full appearance-none border border-border-color focus:outline-0 focus:border-primary"
        />
        <button className='add-project bg-primary text-white rounded-full p-2 transition-all duration-300'>
          <IconPlus className='w-[20px] h-[20px]' />
        </button>
      </div>

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
                className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${(pageUrl === '/overview' || calculatedActiveSidebarMenu === 'overview') ? 'text-secondary' : ''}`}
              >
                <IconHome className="stroke-[1.5] w-[22px] h-[22px]" />
                <span className='link'>Overview</span>
              </Link>
            </li>
            <li className='sidebar-listitem'>
              <Link 
                href="/overview/notes" 
                onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }} 
                className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${(pageUrl === '/overview/notes' || calculatedActiveSidebarMenu === 'notes') ? 'text-secondary' : ''}`}
              >
                <IconPencil className="stroke-[1.5] w-[22px] h-[22px]" />
                <span className='link'>Personal notes</span>
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
              if (item.dropdownMenus) {
                menuItems.push(
                  <li key={key} className='sidebar-listitem'>
                    <button
                      onClick={() => menuToggle(key)}
                      className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) || shouldHighlightParent(item) ? 'text-secondary' : ''}`}
                    >
                      {renderIcon(item)}
                      <span className='link'>{item.title}</span>
                      {(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 
                        <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : 
                        <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                      }
                    </button>
                    <ul className={`sidebar-sublist ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 'block' : 'hidden'}`}>
                      {item.dropdownMenus.map((sub, subKey) => (
                        <li key={subKey}>
                          <Link 
                            href={sub.route} 
                            onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                            className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${pageUrl === sub.route ? 'text-secondary before:!block' : ''}`}
                          >
                            {sub.title}
                          </Link>
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
                      className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${pageUrl === item.route ? 'text-secondary' : ''}`}
                    >
                      {renderIcon(item)}
                      <span className='link'>{item.title}</span>
                    </Link>
                  </li>
                );
              }

              return menuItems;
            }

            // Regular menu items without section divider
            return item.dropdownMenus ? (
              <li key={key} className='sidebar-listitem'>
                <button
                  onClick={() => menuToggle(key)}
                  className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) || shouldHighlightParent(item) ? 'text-secondary' : ''}`}
                >
                  {renderIcon(item)}
                  <span className='link'>{item.title}</span>
                  {(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 
                    <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : 
                    <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                  }
                </button>
                <ul className={`sidebar-sublist ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${(sidebarAutoCollapse ? menuActive === key : activeMenus.has(key)) ? 'block' : 'hidden'}`}>
                  {item.dropdownMenus.map((sub, subKey) => (
                    <li key={subKey}>
                      <Link 
                        href={sub.route} 
                        onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                        className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${pageUrl === sub.route ? 'text-secondary before:!block' : ''}`}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={key} className='sidebar-listitem'>
                <Link 
                  href={item.route || '#'} 
                  onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }}
                  className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${shouldHighlightParent(item) ? 'text-secondary' : ''}`}
                >
                  {renderIcon(item)}
                  <span className='link'>{item.title}</span>
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </>
  );
};

export default SidebarMenu;