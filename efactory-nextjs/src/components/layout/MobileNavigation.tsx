import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNavigation } from '../../contexts/NavigationContext';
import { getVisibleTopMenus, getVisibleSidebarMenus, sidebarConfigs } from '../../config/navigation';
import { TopMenuConfig, MenuItem, DropdownMenuItem } from '../../types/api/auth';

interface MobileNavigationProps {
  className?: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const { userApps, activeTopMenu, setActiveTopMenu, setActiveSidebarMenu } = useNavigation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  const allMenus = getVisibleTopMenus(userApps);
  const currentSidebarConfig = activeTopMenu ? sidebarConfigs[activeTopMenu] : null;
  const visibleSidebarMenus = currentSidebarConfig ? getVisibleSidebarMenus(activeTopMenu, userApps) : [];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-nav-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTopMenuClick = (menu: TopMenuConfig) => {
    setActiveTopMenu(menu.keyword);
    setExpandedMenus(new Set());
    // Don't close the menu, let user see the sidebar
  };

  const toggleSidebarMenu = (menuKeyword: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuKeyword)) {
        newSet.delete(menuKeyword);
      } else {
        newSet.add(menuKeyword);
      }
      return newSet;
    });
  };

  const isMenuExpanded = (menuKeyword: string) => expandedMenus.has(menuKeyword);

  const isRouteActive = (route: string) => {
    return router.pathname === route;
  };

  const renderBadge = (badge?: string, badgeClassName?: string) => {
    if (!badge) return null;
    
    // In a real implementation, you would fetch the badge count from an API
    const badgeCount = 0; // Placeholder
    
    if (badgeCount === 0) return null;

    return (
      <span className={`ml-auto ${badgeClassName || 'badge badge-info'}`}>
        {badgeCount}
      </span>
    );
  };

  const renderSidebarMenuItem = (menu: MenuItem) => {
    const isExpanded = isMenuExpanded(menu.keyword);
    const hasDropdown = menu.dropdownMenus && menu.dropdownMenus.length > 0;

    return (
      <div key={menu.keyword} className="mb-2">
        {/* Section title */}
        {menu.sectionTitleBefore && (
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {menu.sectionTitleBefore}
          </div>
        )}

        {/* Menu item */}
        <div>
          {hasDropdown ? (
            <button
              onClick={() => toggleSidebarMenu(menu.keyword)}
              className={`
                w-full flex items-center px-4 py-3 text-sm font-medium rounded-md
                transition-colors duration-200
                ${isExpanded
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }
              `}
            >
              <i className={`${menu.iconClassName} mr-3 flex-shrink-0`} />
              <span className="flex-1 text-left">{menu.title}</span>
              {renderBadge(menu.badge, menu.badgeClassName)}
              <i className={`fa fa-chevron-down ml-2 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </button>
          ) : (
            <Link
              href={menu.route || '#'}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-md
                transition-colors duration-200
                ${isRouteActive(menu.route || '')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }
              `}
            >
              <i className={`${menu.iconClassName} mr-3 flex-shrink-0`} />
              <span className="flex-1">{menu.title}</span>
              {renderBadge(menu.badge, menu.badgeClassName)}
            </Link>
          )}

          {/* Dropdown menu */}
          {hasDropdown && isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {menu.dropdownMenus?.map((dropdownItem: DropdownMenuItem) => (
                <Link
                  key={dropdownItem.keyword}
                  href={dropdownItem.route}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center px-4 py-2 text-sm rounded-md
                    transition-colors duration-200
                    ${isRouteActive(dropdownItem.route)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <span className="flex-1">{dropdownItem.title}</span>
                  {renderBadge(dropdownItem.badge, dropdownItem.badgeClassName)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`mobile-nav-container ${className}`}>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
        aria-label="Toggle mobile menu"
      >
        <i className={`fa ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          
          {/* Menu panel */}
          <div className="fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <i className="fa fa-times text-xl" />
                </button>
              </div>

              {/* Top menu selection */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Main Menu
                </h3>
                <div className="space-y-1">
                  {allMenus.map((menu) => (
                    <button
                      key={menu.keyword}
                      onClick={() => handleTopMenuClick(menu)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                        transition-colors duration-200
                        ${activeTopMenu === menu.keyword
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <i className={`${menu.iconClassName} mr-3`} />
                      {menu.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sidebar menu */}
              <div className="flex-1 overflow-y-auto">
                {activeTopMenu && visibleSidebarMenus.length > 0 ? (
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {allMenus.find(m => m.keyword === activeTopMenu)?.title} Menu
                    </h3>
                    <div className="space-y-1">
                      {visibleSidebarMenus.map(renderSidebarMenuItem)}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <i className="fa fa-info-circle text-2xl mb-2" />
                    <p>Select a main menu to see options</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNavigation;
