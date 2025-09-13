import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useNavigation } from '../../contexts/NavigationContext';
import { topMenuConfig, sidebarConfigs } from '../../config/navigation';
import { TopMenuConfig } from '../../types/api/auth';
import { isPublicCustomerRoute } from '@/utils/navigation';
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

  // Helper function to get the first available route for a top menu
  const getFirstRoute = (menuKeyword: string): string | null => {
    const sidebarConfig = sidebarConfigs[menuKeyword];
    if (sidebarConfig && sidebarConfig.menus && sidebarConfig.menus.length > 0) {
      const firstMenu = sidebarConfig.menus[0];
      if (!firstMenu) return null;
      
      // Check if first menu has a direct route
      if (firstMenu.route) {
        return firstMenu.route;
      } 
      // Check if first menu has dropdown menus
      else if (firstMenu.dropdownMenus && firstMenu.dropdownMenus.length > 0) {
        const firstDropdown = firstMenu.dropdownMenus[0];
        if (firstDropdown) {
          return firstDropdown.route;
        }
      }
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
  const itemWidthCacheRef = useRef<Record<string, number>>({});
  const overflowButtonWidthRef = useRef<number>(0);
  const gapWidthRef = useRef<number>(0);

  // Filter menus based on user permissions - memoized to prevent infinite re-renders
  const allMenus = useMemo(() => {
    return topMenuConfig.filter(menu => {
      if (!menu.appIds || menu.appIds.length === 0) return true;
      return menu.appIds.some(appId => userApps.includes(appId));
    });
  }, [userApps]);

  // Precompute widths of items and overflow button for instant layout calculation
  const recomputeItemWidths = () => {
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.top = '-9999px';
    measureDiv.style.left = '-9999px';
    measureDiv.style.whiteSpace = 'nowrap';
    measureDiv.className = 'flex items-center space-x-1';

    // Add one button per menu to measure
    allMenus.forEach(menu => {
      const button = document.createElement('button');
      button.className = 'flex items-center gap-2 px-4 py-2 text-sm font-medium';
      button.innerHTML = `
        <div class="w-[18px] h-[18px]"></div>
        <span class="whitespace-nowrap">${menu.title}</span>
        ${menu.isDropdown ? '<div class="w-[16px] h-[16px]"></div>' : ''}
      `;
      measureDiv.appendChild(button);
    });

    // Add sample overflow button
    const overflowBtn = document.createElement('button');
    overflowBtn.className = 'flex items-center gap-1 px-3 py-2 text-sm font-medium';
    overflowBtn.innerHTML = '<div class="w-[18px] h-[18px]"></div>';
    measureDiv.appendChild(overflowBtn);

    document.body.appendChild(measureDiv);

    // Determine inter-item gap from Tailwind space-x-1 (read from second child)
    const second = measureDiv.children.item(1) as HTMLElement | null;
    gapWidthRef.current = second ? parseFloat(getComputedStyle(second).marginLeft || '0') : 0;

    // Cache each button width (excluding gap)
    const cache: Record<string, number> = {};
    for (let i = 0; i < allMenus.length; i += 1) {
      const el = measureDiv.children.item(i) as HTMLElement | null;
      const menu = allMenus[i];
      if (menu) {
        cache[menu.keyword] = el ? el.offsetWidth : 0;
      }
    }

    // Overflow button width
    const overflowEl = measureDiv.lastElementChild as HTMLElement | null;
    overflowButtonWidthRef.current = overflowEl ? overflowEl.offsetWidth : 0;

    document.body.removeChild(measureDiv);
    itemWidthCacheRef.current = cache;
  };

  // Handle responsive menu overflow with faster, cached measurement
  useEffect(() => {
    if (!menuRef.current || allMenus.length === 0) {
      return;
    }

    let rafId = 0;
    let lastWidth = -1;
    let resizeObserver: ResizeObserver | null = null;

    const measureActualSpace = () => {
      const container = menuRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      if (containerWidth === lastWidth) return;
      lastWidth = containerWidth;

      const availableWidth = containerWidth;

      // Ensure widths are cached
      const cacheMissing = !allMenus.every(m => (itemWidthCacheRef.current[m.keyword] || 0) > 0);
      if (cacheMissing || overflowButtonWidthRef.current === 0 || gapWidthRef.current === 0) {
        recomputeItemWidths();
      }

      let visibleCount = 0;
      let used = 0;
      for (let i = 0; i < allMenus.length; i += 1) {
        const menu = allMenus[i];
        if (!menu) continue;
        const w = itemWidthCacheRef.current[menu.keyword] || 0;
        const gap = i === 0 ? 0 : gapWidthRef.current;
        const needOverflow = (i < allMenus.length - 1);
        const overflowCost = needOverflow && (i >= 0) ? (gapWidthRef.current + overflowButtonWidthRef.current) : 0;
        const candidate = used + gap + w + overflowCost;
        if (candidate <= availableWidth) {
          used += gap + w;
          visibleCount = i + 1;
        } else {
          break;
        }
      }

      if (visibleCount <= 0) visibleCount = 1; // Always show at least one

      const newVisible = allMenus.slice(0, visibleCount);
      const newOverflow = allMenus.slice(visibleCount);
      setVisibleMenus(newVisible);
      setOverflowMenus(newOverflow);
      if (newOverflow.length === 0) setShowOverflowMenu(false);
    };

    const scheduleMeasure = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(measureActualSpace);
    };

    // Initial compute and measure immediately
    recomputeItemWidths();
    measureActualSpace();

    // Listen for resize events and container size changes
    window.addEventListener('resize', scheduleMeasure);
    if (typeof ResizeObserver !== 'undefined' && menuRef.current) {
      resizeObserver = new ResizeObserver(() => scheduleMeasure());
      resizeObserver.observe(menuRef.current);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleMeasure);
      if (resizeObserver) resizeObserver.disconnect();
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

  // Close any open menus on route change (ensures dropdown/overflow closes after navigation)
  useEffect(() => {
    setActiveDropdown(null);
    setShowOverflowMenu(false);
  }, [router.asPath]);

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
      if (!firstMenu) return;
      let firstSubRoute = null;
      
      // Check if first menu has a direct route
      if (firstMenu.route) {
        firstSubRoute = firstMenu.route;
      } 
      // Check if first menu has dropdown menus
      else if (firstMenu.dropdownMenus && firstMenu.dropdownMenus.length > 0) {
        const firstDropdown = firstMenu.dropdownMenus[0];
        if (firstDropdown) {
          firstSubRoute = firstDropdown.route;
        }
      }
      
      if (firstSubRoute) {
        router.push(firstSubRoute);
      }
    }
  };

  const handleDropdownItemClick = (route: string) => {
    // Navigate and close menus synchronously
    setActiveDropdown(null);
    setShowOverflowMenu(false);
    router.push(route);
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
      if (!firstMenu) return;
      let firstSubRoute = null;
      
      // Check if first menu has a direct route
      if (firstMenu.route) {
        firstSubRoute = firstMenu.route;
      } 
      // Check if first menu has dropdown menus
      else if (firstMenu.dropdownMenus && firstMenu.dropdownMenus.length > 0) {
        const firstDropdown = firstMenu.dropdownMenus[0];
        if (firstDropdown) {
          firstSubRoute = firstDropdown.route;
        }
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
    <div ref={menuRef} className="flex items-center space-x-1 w-full">
      {/* Visible menu items - using exact Luno theme pattern */}
      {visibleMenus.map((menu) => {
        const firstRoute = getFirstRoute(menu.keyword);
        const isActive = !isPublicCustomerRoute(router.asPath) && (
          activeTopMenu === menu.keyword ||
          (menu.keyword === 'services' && (router.asPath.startsWith('/documents') || router.asPath.startsWith('/services/administration-tasks'))) ||
          activeDropdown === menu.keyword
        );

        return (
          <div key={menu.keyword} className="relative">
            {firstRoute ? (
              <Link
                href={firstRoute}
                onClick={() => {
                  setActiveTopMenu(menu.keyword);
                  setShowOverflowMenu(false);
                  setActiveDropdown(null);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:text-secondary
                  ${isActive
                    ? 'text-secondary bg-secondary-10 rounded-md'
                    : 'text-font-color'
                  }
                `}
              >
                {renderIcon(menu)}
                <span className="whitespace-nowrap">{menu.title}</span>
                {menu.isDropdown && (
                  <IconChevronDown className={`w-[16px] h-[16px] transition-transform duration-200 ${activeDropdown === menu.keyword ? 'rotate-180' : ''}`} />
                )}
              </Link>
            ) : (
              <button
                onClick={() => handleMenuClick(menu.keyword)}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:text-secondary
                  ${isActive
                    ? 'text-secondary bg-secondary-10 rounded-md'
                    : 'text-font-color'
                  }
                `}
              >
                {renderIcon(menu)}
                <span className="whitespace-nowrap">{menu.title}</span>
                {menu.isDropdown && (
                  <IconChevronDown className={`w-[16px] h-[16px] transition-transform duration-200 ${activeDropdown === menu.keyword ? 'rotate-180' : ''}`} />
                )}
              </button>
            )}

            {/* Dropdown menu */}
            {menu.isDropdown && activeDropdown === menu.keyword && menu.dropdownMenus && (
            <div
              ref={el => { dropdownRefs.current[menu.keyword] = el; }}
              className="absolute top-full left-0 mt-1 bg-card-color text-font-color z-[1] rounded-xl min-w-[200px] shadow-shadow-lg border border-border-color"
            >
              <ul className="py-2">
                {menu.dropdownMenus.map((dropdownItem) => {
                  const isSection = !dropdownItem.route;
                  const route = dropdownItem.route || '';
                  const isActiveChild = !!route && (router.asPath === route || router.asPath.startsWith(route));
                  return (
                    <li key={dropdownItem.keyword}>
                      {isSection ? (
                        <div className="mx-2 my-1 px-3 py-2 text-sm font-semibold text-secondary bg-secondary-10 rounded-md w-[calc(100%-1rem)] cursor-default select-none">
                          {dropdownItem.title}
                        </div>
                      ) : (
                        <button
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownItemClick(route); }}
                          onClick={(e) => { e.preventDefault(); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-all whitespace-nowrap ${isActiveChild ? 'text-secondary bg-secondary-10' : 'hover:bg-gray-100'}`}
                        >
                          {dropdownItem.title}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          </div>
        );
      })}

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
              bg-card-color text-font-color z-[50] rounded-xl min-w-[280px] shadow-shadow-lg 
              absolute end-0 top-full origin-top-right transition-all duration-200 mt-1
              whitespace-nowrap
              ${showOverflowMenu ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}
            `}
          >
            {overflowMenus.map((menu) => {
              const firstRoute = getFirstRoute(menu.keyword);
              const isActive = activeTopMenu === menu.keyword || activeDropdown === menu.keyword;

              return (
                <li key={menu.keyword}>
                  {firstRoute ? (
                    <Link
                      href={firstRoute}
                      onClick={() => {
                        setActiveTopMenu(menu.keyword);
                        setShowOverflowMenu(false);
                        setActiveDropdown(null);
                      }}
                      className={`
                        w-full px-4 py-2 flex items-center text-left transition-all hover:text-secondary
                        whitespace-nowrap
                        ${isActive
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
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleOverflowMenuClick(menu.keyword)}
                      className={`
                        w-full px-4 py-2 flex items-center text-left transition-all hover:text-secondary
                        whitespace-nowrap
                        ${isActive
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
                  )}
                
                {/* Dropdown items in overflow menu */}
                {menu.isDropdown && activeDropdown === menu.keyword && menu.dropdownMenus && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {menu.dropdownMenus.map((dropdownItem) => {
                      const isSection = !dropdownItem.route;
                      return (
                        <li key={dropdownItem.keyword}>
                          {isSection ? (
                            <div className="px-4 py-2 text-sm font-semibold text-secondary bg-secondary-10 rounded-md cursor-default select-none">
                              {dropdownItem.title}
                            </div>
                          ) : (
                            <button
                              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); handleDropdownItemClick(dropdownItem.route); }}
                              onClick={(e) => { e.preventDefault(); }}
                              className="w-full px-4 py-2 text-left text-sm transition-all hover:text-secondary hover:bg-gray-100 whitespace-nowrap"
                            >
                              {dropdownItem.title}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopMenu;