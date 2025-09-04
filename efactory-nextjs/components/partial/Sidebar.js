import React, { useEffect, useRef, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useRouter } from 'next/router';
import {
    menuList,
    documentationItem,
    crmManagement,
} from './SidebarData';
import {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
    gallery1,
    gallery2,
    gallery3,
    gallery4,
} from '/public/images'
import {
    IconCalendar,
    IconNote,
    IconMessage,
    IconPower,
    IconPlus,
    IconChevronRight,
    IconX,
    IconPhoneFilled,
    IconMessageCircle2Filled,
    IconMoodSmile,
    IconLeaf,
    IconStarFilled,
    IconTrash,
    IconCamera,
    IconVideo,
    IconDots,
    IconChevronsDown,
    IconLogin2,
    IconUsers,
    IconLicense,
    IconClockHour4,
    IconTruckDelivery,
    IconChartBar,
    IconUserCircle,
} from '@tabler/icons-react'
import NewProject from '../../pages/app/project/NewProject';
import Link from 'next/link';
import Image from 'next/image';
import { getAuthToken } from '@/lib/auth/storage';

export default function Sidebar({ setMobileNav, note, toggleNote, chat, toggleChat }) {

    const pageUrl = useRouter().pathname;

    const [adminMenu, setAdminMenu] = useState(false)
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const toggleAdminMenu = () => {
        setAdminMenu(!adminMenu)
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setAdminMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const [menuActive, setMenuActive] = useState(0)
    const menuToggle = (key) => {
        setMenuActive(menuActive === key ? null : key)
    }

    const [menuActiveSub, setMenuActiveSub] = useState(false)
    const menuToggleSub = (key) => {
        setMenuActiveSub(menuActiveSub === key ? null : key)
    }

    const [schedule, setSchedule] = useState(false)
    const toggleSchedule = () => {
        setSchedule(!schedule)
    }

    const [newProjectSidebar, setNewProjectSidebar] = useState(false)
    const toggleNewProject = () => {
        setNewProjectSidebar(!newProjectSidebar)
    }

    // Defer role detection to the client after mount to avoid SSR hydration mismatch
    const [isAdmin, setIsAdmin] = useState(false)
    useEffect(() => {
        const auth = getAuthToken();
        const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
        setIsAdmin(roles.includes('ADM'))
    }, [])

    const adminData = [
        { devider: 'ADMIN' },
        { icon: IconLogin2, link: 'Login to eFactory', url: '/admin/login-user' },
        { icon: IconUsers, link: 'Online Customers', url: '/admin/online-customers' },
        { icon: IconLicense, link: 'License Summary', url: '/admin/license-summary' },
        { icon: IconUserCircle, link: 'eFactory Users', url: '/admin/users' },
        { icon: IconClockHour4, link: 'By Time', url: '/admin/analytics/profiles/by-time' },
        { icon: IconTruckDelivery, link: 'By Ship Service', url: '/admin/analytics/profiles/by-ship-service' },
        { icon: IconChartBar, link: 'By Channel', url: '/admin/analytics/profiles/by-channel' },
        { icon: IconChartBar, link: 'By Account', url: '/admin/analytics/profiles/by-account' },
    ];

    const isDocumentationPage = (url) => {
        return documentationItem.some(item => item.url === url);
    };

    const isCrmManagement = (url) => {
        return crmManagement.some(item => item.url === url);
    };

    let data;
    if (isAdmin) {
        data = adminData; // show only admin menu for DCL users
    } else if (isDocumentationPage(pageUrl)) {
        data = documentationItem;
    } else if (isCrmManagement(pageUrl)) {
        data = crmManagement;
    } else {
        data = menuList;
    }

    useEffect(() => {
        data.forEach((item, index) => {
            if (item.children) {
                item.children.forEach((child, subIndex) => {
                    if (child.url === pageUrl) {
                        setMenuActive(index);
                        setMenuActiveSub(subIndex);
                    } else if (child.children) {
                        child.children.forEach((subChild) => {
                            if (subChild.url === pageUrl) {
                                setMenuActive(index);
                                setMenuActiveSub(subIndex);
                            }
                        });
                    }
                });
            } else if (item.url === pageUrl) {
                setMenuActive(index);
            }
        });
    }, [pageUrl, data]);

    return (
        <>
            <div className='sidebar-header px-3 mb-6 flex items-center justify-between gap-2'>
                <h4 className='sidebar-title text-[24px]/[30px] font-medium mb-0'>
                    <span className='sm-txt'>e</span><span>Factory Admin</span>
                </h4>
                <div className="sidebar-dropdown relative flex">
                    <button ref={buttonRef} onClick={toggleAdminMenu} className='bg-primary-10 p-[2px] rounded-full text-primary transition-all hover:bg-primary hover:text-white'>
                        <IconDots className='w-[20px] h-[20px]' />
                    </button>
                    <ul ref={menuRef} className={`bg-card-color text-font-color z-[1] rounded-xl w-[180px] shadow-shadow-lg absolute end-0 top-full origin-top-right transition-all duration-300 ${adminMenu ? ' opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}`}>
                        <li>
                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                Landing page
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="px-4 py-2 flex hover:bg-gray-100">
                                Inventary
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
            <div className='create-new-project px-3 py-4 flex gap-5'>
                <select className="select-project form-select cursor-pointer rounded-full bg-card-color py-[6px] ps-15 pe-30 text-[14px]/[20px] w-full appearance-none border border-border-color focus:outline-0 focus:border-primary">
                    <option defaultValue="">Select Project</option>
                    <option value="1">Luno University</option>
                    <option value="2">Book Manager</option>
                    <option value="3">Luno Sass App</option>
                </select>
                <button onClick={toggleNewProject} className={`add-project bg-primary text-white rounded-full p-2 transition-all duration-300 after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${newProjectSidebar ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                    <IconPlus className='w-[20px] h-[20px]' />
                </button>
                <NewProject newProjectSidebar={newProjectSidebar} toggleNewProject={toggleNewProject} />
            </div>
            {/* When admin, render a flat list (no groups) */}
            <ul className='sidebar-list px-3 mb-4 main-menu'>
                {data.map((item, key) => (
                    item.children ? <li key={key} className='sidebar-listitem'>
                        <button
                            onClick={() => menuToggle(key)}
                            className={`sidebar-list-button flex items-center gap-10 w-full py-10 transition-all hover:text-secondary ${menuActive === key ? 'text-secondary' : ''}`}
                        >
                            <item.icon className='stroke-[1.5] w-[22px] h-[22px]' />
                            <span className='link'>{item.link}</span>
                            {menuActive === key ? <IconChevronsDown className="arrow-icon stroke-[1.5] w-[20px] h-[20px] ms-auto" /> : <IconChevronRight className="arrow-icon stroke-[1.5] w-[18px] h-[18px] ms-auto rtl:rotate-180" />}
                        </button>
                        <ul className={`sidebar-sublist ps-30 relative before:absolute before:h-full before:w-[1px] ltr:before:left-10 rtl:before:right-10 before:top-0 before:bg-secondary ${menuActive === key ? 'block' : 'hidden'}`}>
                            {item.children.map((sub, subKey) => (
                                <li key={subKey}>
                                    <Link href={sub.url} onClick={() => { window.innerWidth < 1200 && setMobileNav(false) }} className={`py-1 text-[14px]/[20px] flex relative before:hidden before:absolute before:rounded-full before:h-[9px] before:w-[9px] ltr:before:left-[-24px] rtl:before:right-[-24px] before:top-[50%] before:translate-y-[-50%] before:bg-secondary hover:text-secondary hover:before:block transition-all ${pageUrl === sub.url ? 'text-secondary before:!block' : ''}`}>
                                        {sub.link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                        : item.url ?
                            <li key={key} className='sidebar-listitem'>
                                <Link href={item.url} onClick={() => { window.innerWidth < 1200 && setMobileNav(false) }} className={`sidebar-list-link flex items-center gap-10 w-full py-2 transition-all hover:text-secondary ${pageUrl === item.url ? 'text-secondary' : ''}`}>
                                    {item.icon ? <item.icon className='stroke-[1.5] w-[22px] h-[22px] rtl:rotate-180' /> : <IconChevronRight className='stroke-[1.5] w-[22px] h-[22px] rtl:rotate-180' />}
                                    <span className='link'>{item.link}</span>
                                </Link>
                            </li>
                            :
                            <li key={key} className={`devider py-3 menu-devider uppercase text-[12px]/[15px]${item.color ? ` text-${item.color}` : ''}${item.fontWeight ? ` font-${item.fontWeight}` : ''}`}>
                                {item.devider}
                            </li>
                ))}
            </ul>
            {/* bottom shortcuts unchanged */}
            <div className='sidebar-bottom-link flex justify-evenly gap-3 mx-3 border border-dashed rounded-xl p-2 mt-auto'>
                <button onClick={toggleSchedule} className={`transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${schedule ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                    <span title='My Schedule'>
                        <IconCalendar className='stroke-[1.5] w-[20px] h-[20px]' />
                    </span>
                </button>
                <button onClick={toggleNote} className={`transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${note ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                    <span title='My Note'>
                        <IconNote className='stroke-[1.5] w-[20px] h-[20px]' />
                    </span>
                </button>
                <button onClick={toggleChat} className={`transition-all duration-300 hover:text-secondary after:fixed after:z-[4] after:w-full after:h-full after:left-0 after:top-0 after:bg-black-50 after:backdrop-blur-[2px] after:transition-all after:duration-500 after:ease-in-out ${chat ? 'after:opacity-1 after:visible after:overflow-auto' : 'after:opacity-0 after:invisible after:overflow-hidden'}`}>
                    <span title='My Chat'>
                        <IconMessage className='stroke-[1.5] w-[20px] h-[20px]' />
                    </span>
                </button>
                <Link href="/auth/sign-in" title='Log Out' className='transition-all duration-300 hover:text-secondary'>
                    <IconPower className='stroke-[1.5] w-[20px] h-[20px]' />
                </Link>
            </div>
        </>
    )
}
