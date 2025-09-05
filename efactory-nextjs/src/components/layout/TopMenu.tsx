import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useNavigation } from '../../contexts/NavigationContext';
import { topMenuConfig, sidebarConfigs } from '../../config/navigation';
import { TopMenuConfig } from '../../types/api/auth';
import {
  IconDots,
  IconChevronDown,
} from '@tabler/icons-react';

const TopMenu: React.FC = () => {
  const router = useRouter();
  const { userApps, activeTopMenu, setActiveTopMenu } = useNavigation();

  // Helper function to render icons (Tabler components or CSS classes)
  const renderIcon = (menu: TopMenuConfig) => {
    if (menu.iconComponent) {
      const IconComponent = menu.iconComponent;
      return <IconComponent className="w-[18px] h-[18px]" />;
    } else if (menu.iconClassName) {
      return <i className={`${menu.iconClassName} w-[18px] h-[18px]`} />;
    }
    return null;
  };
  const [visibleMenus, setVisibleMenus] = useState<TopMenuConfig[]>([]);
  const [overflowMenus, setOverflowMenus] = useState<TopMenuConfig[]>([]);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLUListElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null);

  // Filter menus based on user permissions - memoized to prevent infinite re-renders
  const allMenus = useMemo(() => {
    return topMenuConfig.filter(menu => {
      if (!menu.appIds || menu.appIds.length === 0) return true;
      return menu.appIds.some(appId => userApps.includes(appId));
    });
  }, [userApps]);

  // Handle responsive menu overflow with debouncing
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!menuRef.current || allMenus.length === 0) return;
        const container = menuRef.current;
        const containerWidth = container.offsetWidth;
        
        if (containerWidth > 800) { // Wide screen
          setVisibleMenus(allMenus);
          setOverflowMenus([]);
        } else if (containerWidth > 600) { // Medium screen
          const visibleCount = Math.max(1, allMenus.length - 2);
          setVisibleMenus(allMenus.slice(0, visibleCount));
          setOverflowMenus(allMenus.slice(visibleCount));
        } else { // Small screen
          const visibleCount = Math.max(1, Math.floor(allMenus.length / 2));
          setVisibleMenus(allMenus.slice(0, visibleCount));
          setOverflowMenus(allMenus.slice(visibleCount));
        }
      }, 150); // Debounce resize events
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [allMenus]);

  // Handle click outside for overflow menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overflowRef.current &&
        !overflowRef.current.contains(event.target as Node) &&
        overflowButtonRef.current &&
        !overflowButtonRef.current.contains(event.target as Node)
      ) {
        setShowOverflowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menuKeyword: string) => {
    console.log('🚀 TOP MENU CLICKED:', menuKeyword);
    setActiveTopMenu(menuKeyword);
    setShowOverflowMenu(false);
    
    // Get the first available sub-route for this top menu
    const sidebarConfig = sidebarConfigs[menuKeyword];
    if (sidebarConfig && sidebarConfig.menus && sidebarConfig.menus.length > 0) {
      const firstMenu = sidebarConfig.menus[0];
      let firstSubRoute = null;
      
      // Check if first menu has a direct route
      if (firstMenu.route) {
        firstSubRoute = firstMenu.route;
      } 
      // Check if first menu has dropdown menus
      else if (firstMenu.dropdownMenus && firstMenu.dropdownMenus.length > 0) {
        firstSubRoute = firstMenu.dropdownMenus[0].route;
      }
      
      if (firstSubRoute) {
        console.log('🚀 Navigating to first sub-route:', firstSubRoute);
        console.log('🚀 Current URL before navigation:', router.asPath);
        
        router.push(firstSubRoute).then(() => {
          console.log('✅ Navigation completed to:', firstSubRoute);
        }).catch((error) => {
          console.error('❌ Navigation failed:', error);
        });
      } else {
        console.error('❌ No sub-routes found for top menu:', menuKeyword);
      }
    } else {
      console.error('❌ No sidebar config found for top menu:', menuKeyword);
    }
  };

  const toggleOverflowMenu = () => {
    setShowOverflowMenu(!showOverflowMenu);
  };

  if (allMenus.length === 0) {
    return null;
  }

  return (
    <div ref={menuRef} className="flex items-center space-x-1">
      {/* Visible menu items - using exact Luno theme pattern */}
      {visibleMenus.map((menu) => (
        <button
          key={menu.keyword}
          onClick={() => {
            console.log('🖱️ TOP MENU BUTTON CLICKED:', menu.keyword);
            handleMenuClick(menu.keyword);
          }}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:text-secondary
            ${activeTopMenu === menu.keyword
              ? 'text-secondary bg-secondary-10 rounded-md'
              : 'text-font-color'
            }
          `}
        >
          {renderIcon(menu)}
          {menu.title}
        </button>
      ))}

      {/* Overflow menu - using Luno dropdown pattern */}
      {overflowMenus.length > 0 && (
        <div className="relative">
          <button
            ref={overflowButtonRef}
            onClick={toggleOverflowMenu}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition-all hover:text-secondary text-font-color"
          >
            <IconDots className="w-[18px] h-[18px]" />
            <IconChevronDown className={`w-[16px] h-[16px] transition-transform duration-200 ${showOverflowMenu ? 'rotate-180' : ''}`} />
          </button>
          
          <ul 
            ref={overflowRef}
            className={`
              bg-card-color text-font-color z-[1] rounded-xl min-w-[180px] shadow-shadow-lg 
              absolute end-0 top-full origin-top-right transition-all duration-300 mt-1
              ${showOverflowMenu ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}
            `}
          >
            {overflowMenus.map((menu) => (
              <li key={menu.keyword}>
                <button
                  onClick={() => handleMenuClick(menu.keyword)}
                  className={`
                    w-full px-4 py-2 flex items-center text-left transition-all hover:text-secondary
                    ${activeTopMenu === menu.keyword
                      ? 'text-secondary bg-secondary-10'
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-3 flex-shrink-0">{renderIcon(menu)}</span>
                  {menu.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopMenu;