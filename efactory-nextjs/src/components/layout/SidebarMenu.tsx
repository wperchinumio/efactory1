import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useNavigation } from '../../contexts/NavigationContext';
import { getVisibleSidebarMenus, sidebarConfigs } from '../../config/navigation';
import { MenuItem, DropdownMenuItem } from '../../types/api/auth';
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
} from '@tabler/icons-react';

interface SidebarMenuProps {
  setMobileNav?: (value: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ setMobileNav }) => {
  const { userApps, activeTopMenu } = useNavigation();
  const router = useRouter();
  const pageUrl = router.pathname;

  // Helper function to render icons (Tabler components or CSS classes)
  const renderIcon = (item: MenuItem) => {
    console.log('RENDERING ICON FOR:', item.title, 'iconComponent:', !!item.iconComponent, 'iconClassName:', !!item.iconClassName);
    
    // FORCE show icons for debugging
    if (item.title === 'Order Lines') {
      return <IconClipboardList className="stroke-[1.5] w-[22px] h-[22px] text-red-500" />;
    }
    if (item.title === 'Order Items') {
      return <IconPackage className="stroke-[1.5] w-[22px] h-[22px] text-blue-500" />;
    }
    if (item.title === 'Ship Detail') {
      return <IconShip className="stroke-[1.5] w-[22px] h-[22px] text-green-500" />;
    }
    if (item.title === 'Customer Docs.') {
      return <IconFileText className="stroke-[1.5] w-[22px] h-[22px] text-purple-500" />;
    }
    
    if (item.iconComponent) {
      const IconComponent = item.iconComponent;
      return <IconComponent className="stroke-[1.5] w-[22px] h-[22px]" />;
    } else if (item.iconClassName) {
      return <i className={`${item.iconClassName} w-[22px] h-[22px]`} />;
    }
    return <div className="w-[22px] h-[22px] bg-yellow-500 text-white text-xs">?</div>;
  };
  
  // Use exact Luno state management pattern
  const [adminMenu, setAdminMenu] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuActive, setMenuActive] = useState<number | null>(null);

  const toggleAdminMenu = () => {
    setAdminMenu(!adminMenu);
  };

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
    setMenuActive(menuActive === key ? null : key);
  };

  // Get visible menus
  const visibleMenus = activeTopMenu ? getVisibleSidebarMenus(activeTopMenu, userApps) : [];
  console.log('USER APPS:', userApps);
  console.log('ACTIVE TOP MENU:', activeTopMenu);
  console.log('VISIBLE MENUS:', visibleMenus.map(m => m.title));

  // Auto-expand menus that contain the current route - exact Luno pattern
  useEffect(() => {
    visibleMenus.forEach((item, index) => {
      if (item.dropdownMenus) {
        item.dropdownMenus.forEach((child) => {
          if (child.route === pageUrl) {
            setMenuActive(index);
          }
        });
      } else if (item.route === pageUrl) {
        setMenuActive(index);
      }
    });
  }, [pageUrl, visibleMenus]);

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
              MAIN
            </li>
            <li className='sidebar-listitem'>
              <Link 
                href="/" 
                onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }} 
                className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${pageUrl === '/' ? 'text-secondary' : ''}`}
              >
                <IconHome className="stroke-[1.5] w-[22px] h-[22px]" />
                <span className='link'>Overview</span>
              </Link>
            </li>
            <li className='sidebar-listitem'>
              <Link 
                href="/personal-notes" 
                onClick={() => { window.innerWidth < 1200 && setMobileNav && setMobileNav(false) }} 
                className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${pageUrl === '/personal-notes' ? 'text-secondary' : ''}`}
              >
                <IconPencil className="stroke-[1.5] w-[22px] h-[22px]" />
                <span className='link'>Personal notes</span>
              </Link>
            </li>
          </>
        ) : (
          // Dynamic menu items - exact Luno pattern
          visibleMenus.map((item, key) => {
            console.log('RENDERING MENU ITEM:', key, item.title, 'hasDropdown:', !!(item.dropdownMenus && item.dropdownMenus.length > 0));
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
                      className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${menuActive === key ? 'text-secondary' : ''}`}
                    >
                      {renderIcon(item)}
                      <span className='link'>{item.title}</span>
                      {menuActive === key ? 
                        <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : 
                        <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                      }
                    </button>
                    <ul className={`sidebar-sublist ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${menuActive === key ? 'block' : 'hidden'}`}>
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
                  className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${menuActive === key ? 'text-secondary' : ''}`}
                >
                  {renderIcon(item)}
                  <span className='link'>{item.title}</span>
                  {menuActive === key ? 
                    <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : 
                    <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />
                  }
                </button>
                <ul className={`sidebar-sublist ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${menuActive === key ? 'block' : 'hidden'}`}>
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
                  className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${pageUrl === item.route ? 'text-secondary' : ''}`}
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