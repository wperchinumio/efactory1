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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLUListElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter menus based on user permissions - memoized to prevent infinite re-renders
  const allMenus = useMemo(() => {
    return topMenuConfig.filter(menu => {
      if (!menu.appIds || menu.appIds.length === 0) return true;
      return menu.appIds.some(appId => userApps.includes(appId));
    });
  }, [userApps]);

  // Handle responsive menu overflow with actual space measurement
  useEffect(() => {
    if (!menuRef.current || allMenus.length === 0) {
      console.log('No container or menus available:', { 
        hasContainer: !!menuRef.current, 
        menuCount: allMenus.length 
      });
      return;
    }

    let resizeTimeout: NodeJS.Timeout;
    let lastWidth = 0;

    const measureActualSpace = () => {
      const container = menuRef.current;
      if (!container) return;
      
      const containerWidth = container.offsetWidth;
      
      // Skip if width hasn't changed significantly
      if (Math.abs(containerWidth - lastWidth) < 5) return;
      lastWidth = containerWidth;
      
      const availableWidth = containerWidth - 40; // Account for padding/margins
      
      console.log('Menu measurement:', {
        containerWidth,
        availableWidth,
        allMenusCount: allMenus.length,
        allMenus: allMenus.map(m => m.title)
      });
      
      // Start with all menus and work backwards
      let visibleCount = allMenus.length;
      let bestFit = { visible: allMenus, overflow: [] };
      
      // Fallback: if measurement fails, show all menus
      try {
        while (visibleCount > 0) {
          const visibleMenus = allMenus.slice(0, visibleCount);
          const overflowMenus = allMenus.slice(visibleCount);
          
          // Create a hidden measurement container
          const measureDiv = document.createElement('div');
          measureDiv.style.position = 'absolute';
          measureDiv.style.visibility = 'hidden';
          measureDiv.style.top = '-9999px';
          measureDiv.style.left = '-9999px';
          measureDiv.style.whiteSpace = 'nowrap';
          measureDiv.className = 'flex items-center space-x-1';
          
          // Add each visible menu button
          visibleMenus.forEach(menu => {
            const button = document.createElement('button');
            button.className = 'flex items-center gap-2 px-4 py-2 text-sm font-medium';
            button.innerHTML = `
              <div class="w-[18px] h-[18px]"></div>
              <span>${menu.title}</span>
              ${menu.isDropdown ? '<div class="w-[16px] h-[16px]"></div>' : ''}
            `;
            measureDiv.appendChild(button);
          });
          
          // Add overflow button if needed
          if (overflowMenus.length > 0) {
            const overflowBtn = document.createElement('button');
            overflowBtn.className = 'flex items-center gap-1 px-3 py-2 text-sm font-medium';
            overflowBtn.innerHTML = '<div class="w-[18px] h-[18px]"></div>';
            measureDiv.appendChild(overflowBtn);
          }
          
          // Measure the actual width
          document.body.appendChild(measureDiv);
          const measuredWidth = measureDiv.offsetWidth;
          document.body.removeChild(measureDiv);
          
          // Check if it fits
          if (measuredWidth <= availableWidth) {
            bestFit = { visible: visibleMenus, overflow: overflowMenus };
            break;
          }
          
          visibleCount--;
        }
      } catch (error) {
        // If measurement fails, show all menus as fallback
        console.warn('Menu measurement failed, showing all menus:', error);
        bestFit = { visible: allMenus, overflow: [] };
      }
      
      // Ensure we always have at least one menu visible
      if (bestFit.visible.length === 0) {
        bestFit = { visible: allMenus.slice(0, 1), overflow: allMenus.slice(1) };
      }
      
      // Apply the result
      console.log('Setting visible menus:', {
        visible: bestFit.visible.map(m => m.title),
        overflow: bestFit.overflow.map(m => m.title)
      });
      
      setVisibleMenus(bestFit.visible);
      setOverflowMenus(bestFit.overflow);
    };

    const debouncedMeasure = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measureActualSpace, 100);
    };

    // Initial fallback - show all menus immediately
    setVisibleMenus(allMenus);
    setOverflowMenus([]);
    
    // Then measure and optimize
    setTimeout(measureActualSpace, 50);
    
    // Listen for resize events
    window.addEventListener('resize', debouncedMeasure);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', debouncedMeasure);
    };
  }, [allMenus]);

  // Handle click outside for overflow menu and dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close overflow menu
      if (
        overflowRef.current &&
        !overflowRef.current.contains(event.target as Node) &&
        overflowButtonRef.current &&
        !overflowButtonRef.current.contains(event.target as Node)
      ) {
        setShowOverflowMenu(false);
      }

      // Close dropdowns
      const clickedOutsideDropdown = Object.values(dropdownRefs.current).every(ref => 
        !ref || !ref.contains(event.target as Node)
      );
      
      if (clickedOutsideDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menuKeyword: string) => {
    const menu = allMenus.find(m => m.keyword === menuKeyword);
    
    // If it's a dropdown menu, toggle it
    if (menu?.isDropdown) {
      setActiveDropdown(activeDropdown === menuKeyword ? null : menuKeyword);
      setShowOverflowMenu(false);
      return;
    }
    
    // Regular menu click
    setActiveTopMenu(menuKeyword);
    setShowOverflowMenu(false);
    setActiveDropdown(null);
    
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
        router.push(firstSubRoute);
      }
    }
  };

  const handleDropdownItemClick = (route: string) => {
    router.push(route);
    setActiveDropdown(null);
    setShowOverflowMenu(false); // Close overflow menu when navigating
  };

  const handleOverflowMenuClick = (menuKeyword: string) => {
    const menu = allMenus.find(m => m.keyword === menuKeyword);
    if (!menu) return;

    // If it's a dropdown menu, toggle it without closing overflow menu
    if (menu.isDropdown) {
      setActiveDropdown(activeDropdown === menuKeyword ? null : menuKeyword);
      return;
    }
    
    // Regular menu click - close overflow and navigate
    setActiveTopMenu(menuKeyword);
    setShowOverflowMenu(false);
    setActiveDropdown(null);
    
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
        router.push(firstSubRoute);
      }
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
        <div key={menu.keyword} className="relative">
          <button
            onClick={() => handleMenuClick(menu.keyword)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:text-secondary
              ${activeTopMenu === menu.keyword || activeDropdown === menu.keyword
                ? 'text-secondary bg-secondary-10 rounded-md'
                : 'text-font-color'
              }
            `}
          >
            {renderIcon(menu)}
            {menu.title}
            {menu.isDropdown && (
              <IconChevronDown className={`w-[16px] h-[16px] transition-transform duration-200 ${activeDropdown === menu.keyword ? 'rotate-180' : ''}`} />
            )}
          </button>

          {/* Dropdown menu */}
          {menu.isDropdown && activeDropdown === menu.keyword && menu.dropdownMenus && (
            <div
              ref={el => dropdownRefs.current[menu.keyword] = el}
              className="absolute top-full left-0 mt-1 bg-card-color text-font-color z-[1] rounded-xl min-w-[200px] shadow-shadow-lg border border-border-color"
            >
              <ul className="py-2">
                {menu.dropdownMenus.map((dropdownItem) => (
                  <li key={dropdownItem.keyword}>
                    <button
                      onClick={() => handleDropdownItemClick(dropdownItem.route)}
                      className="w-full px-4 py-2 text-left text-sm transition-all hover:text-secondary hover:bg-gray-100"
                    >
                      {dropdownItem.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
          </button>
          
          <ul 
            ref={overflowRef}
            className={`
              bg-card-color text-font-color z-[1] rounded-xl min-w-[280px] shadow-shadow-lg 
              absolute end-0 top-full origin-top-right transition-all duration-300 mt-1
              whitespace-nowrap
              ${showOverflowMenu ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}
            `}
          >
            {overflowMenus.map((menu) => (
              <li key={menu.keyword}>
                <button
                  onClick={() => handleOverflowMenuClick(menu.keyword)}
                  className={`
                    w-full px-4 py-2 flex items-center text-left transition-all hover:text-secondary
                    whitespace-nowrap
                    ${activeTopMenu === menu.keyword || activeDropdown === menu.keyword
                      ? 'text-secondary bg-secondary-10'
                      : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-3 flex-shrink-0">{renderIcon(menu)}</span>
                  {menu.title}
                  {menu.isDropdown && (
                    <IconChevronDown className={`w-[16px] h-[16px] ml-auto transition-transform duration-200 ${activeDropdown === menu.keyword ? 'rotate-180' : ''}`} />
                  )}
                </button>
                
                {/* Dropdown items in overflow menu */}
                {menu.isDropdown && activeDropdown === menu.keyword && menu.dropdownMenus && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {menu.dropdownMenus.map((dropdownItem) => (
                      <li key={dropdownItem.keyword}>
                        <button
                          onClick={() => handleDropdownItemClick(dropdownItem.route)}
                          className="w-full px-4 py-2 text-left text-sm transition-all hover:text-secondary hover:bg-gray-100 whitespace-nowrap"
                        >
                          {dropdownItem.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopMenu;