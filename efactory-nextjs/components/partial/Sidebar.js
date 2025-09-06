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
            <div className='sidebar-header px-3 mb-4 flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 min-w-0'>
                    <svg className="w-[91px] h-auto text-primary flex-shrink-0" viewBox="0 0 106 29" xmlns="http://www.w3.org/2000/svg" aria-label="Logo">
                        <desc>Logo</desc>
                        <path d="M18.3,5.1l3.6-3.6c1.3-1.3,2.4-1.3,3.1-1.1c0.9,0.2,1.8,0.7,2.5,1.4c1.4,1.3,2.5,3.3,0.3,5.5 l-3.6,3.6c-1.3,1.3-2.4,1.3-3.1,1.1c-0.4-0.1-0.8-0.2-1.2-0.5l1.7-1.7c0.6-0.6,0.6-1.6,0-2.2l0,0c-0.6-0.6-1.6-0.6-2.2,0l-1.7,1.7 C16.9,8.1,16.7,6.6,18.3,5.1"></path>
                        <path d="M10.8,23.9l-3.6,3.6c-1.3,1.3-2.4,1.3-3.1,1.1c-0.9-0.2-1.8-0.7-2.5-1.4c-1.4-1.3-2.5-3.3-0.3-5.5 l3.6-3.6C6.2,16.9,7.3,16.9,8,17c0.4,0.1,0.8,0.2,1.2,0.5l-1.7,1.7c-0.6,0.6-0.6,1.6,0,2.2l0,0c0.6,0.6,1.6,0.6,2.2,0l1.7-1.7 C12.3,20.9,12.4,22.4,10.8,23.9"></path>
                        <path d="M2.3,16.7l-2.3,2.2V3c0-0.9,0.8-1.7,1.7-1.7h16.3l-2.5,2.4c-3.7,3.6-2.7,6.8-1.2,8.9l-2.9,2.8 c-0.9-0.6-1.9-1-2.9-1.2C5.5,13.6,3.5,15.5,2.3,16.7"></path>
                        <path d="M28,11.2V27c0,0.9-0.8,1.7-1.7,1.7H10.2l2.4-2.4c3.7-3.6,2.7-6.8,1.1-8.8l2.9-2.8 c0.9,0.6,1.9,1,2.9,1.2c3.2,0.6,5.1-1.4,6.3-2.5L28,11.2z"></path>
                        <polygon points="86.2,28.6 86.2,0.4 92.5,0.4 92.5,22.5 105.9,22.5 105.9,28.6 "></polygon>
                        <path d="M72.2,6.5h10.8V0.3H72.7c-8.8,0-12.3,4.5-13.6,9c-1.3-4.5-4.8-9-13.6-9H34.1v18.9h6.4V6.5h5.5 c5.9,0,7.1,4.3,7.1,8c0,2-0.5,4-1.4,5.5c-0.8,1.2-2.2,2.6-5.7,2.6H34.1v6.1H45c3.2,0,8.7,0,12.3-5.3c0.8-1.2,1.4-2.4,1.9-3.8 c0.4,1.4,1,2.6,1.9,3.8c3.6,5.3,9,5.3,12.3,5.3h9.9v-6.1H72.2c-3.5,0-4.9-1.5-5.7-2.6c-0.9-1.4-1.4-3.4-1.4-5.4 C65.2,10.8,66.4,6.5,72.2,6.5"></path>
                    </svg>
                    <h4 className='sidebar-title text-[16px]/[22px] font-medium mb-0 truncate'>
                        <span className='sm-txt'>e</span><span>Factory Admin</span>
                    </h4>
                </div>
                {/* Admin quick dropdown removed per request */}
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
