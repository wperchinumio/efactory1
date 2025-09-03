import React, { useEffect, useRef, useState } from 'react'
import { ChromePicker } from 'react-color';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CompanyLogo from '../common/CompanyLogo';
import {
    IconArrowsMaximize,
    IconWorld,
    IconMoonStars,
    IconSettings,
    IconX,
    IconBrush,
    IconBellRinging,
    IconNote,
    IconMessage,
    IconThumbUpFilled,
    IconChartPieFilled,
    IconInfoCircleFilled,
    IconInfoTriangleFilled,
    IconUser,
    IconCreditCard,
    IconUsersGroup,
    IconCalendarFilled,
    IconTag,
    IconArrowBigLeftFilled,
} from '@tabler/icons-react';
import {
    dark_version,
    light_version,
    rtl_version,
    font_mali,
    font_quicksand,
    font_mulish,
    font_jura,
    profile_av,
    avatar5,
    avatar6,
    avatar1,
    avatar3,
    avatar4,
    avatar7,
    flag_uk,
    flag_us,
    flag_de,
    flag_in,
    flag_sa,
    sidebarImg1,
    sidebarImg5,
    sidebarImg4,
    sidebarImg3,
    sidebarImg2,
} from '/public/images';
import Link from 'next/link';
import Image from 'next/image';
import { clearAuthToken, getAuthToken, performLogout } from '@/lib/auth/storage';

export default function Header({ toggleMobileNav, mobileNav, toggleNote, toggleChat, containerToggle, container }) {

    // mini sidebar
    const [miniSidebar, setMiniSidebar] = useState(false)
    const toggleMiniSidebar = () => { setMiniSidebar(prev => !prev); }
    useEffect(() => {
        const sidebarElement = document.querySelector('.admin-wrapper');
        if (sidebarElement) {
            if (miniSidebar) {
                sidebarElement.classList.add('mini-sidebar');
            } else {
                sidebarElement.classList.remove('mini-sidebar');
            }
        }
    }, [miniSidebar]);

    // full screen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // theme setting sidebar
    const [themeSetting, setThemeSetting] = useState(false)
    const toggleThemeSetting = () => {
        setThemeSetting(!themeSetting)
        document.body.classList.toggle("overflow-hidden", !themeSetting)
    }

    // color setting
    const [selectedTheme, setSelectedTheme] = useState("indigo");
    const handleThemeChange = (name) => {
        setSelectedTheme(name);
        document.body.setAttribute("data-luno-theme", name);
    };
    useEffect(() => {
        document.body.setAttribute("data-luno-theme", selectedTheme);
    }, [selectedTheme]);

    // dynamic color setting
    const handleChangeDynamicColor = (newColor, index) => {
        const updatedDynamicColorItem = [...dynamicColorItem];
        updatedDynamicColorItem[index].colorValue = newColor.rgb;
        setDynamicColorItem(updatedDynamicColorItem);
        updateCssVariable(updatedDynamicColorItem[index].variable, newColor.rgb);
    };
    const handleClickDynamicColor = (index) => {
        const updatedDynamicColorItem = [...dynamicColorItem];
        updatedDynamicColorItem[index].displayColorPicker = !updatedDynamicColorItem[index].displayColorPicker;
        setDynamicColorItem(updatedDynamicColorItem);
    };
    const handleCloseDynamicColor = (index) => {
        const updatedDynamicColorItem = [...dynamicColorItem];
        updatedDynamicColorItem[index].displayColorPicker = false;
        setDynamicColorItem(updatedDynamicColorItem);
    };
    const updateCssVariable = (variable, color) => {
        document.documentElement.style.setProperty(variable, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
    };

    // light dark mode
    const [darkMode, setDarkMode] = useState(false)
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        document.documentElement.setAttribute("data-theme", newDarkMode ? "dark" : "light");
    };
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // rtl mode
    const [rtlMode, setRtlMode] = useState(false)
    const toggleRtlMode = () => {
        const newRtlMode = !rtlMode;
        setRtlMode(newRtlMode);
        document.documentElement.setAttribute("dir", newRtlMode ? "rtl" : "ltr");
    };
    useEffect(() => {
        document.documentElement.setAttribute('dir', rtlMode ? 'rtl' : 'ltr');
    }, [rtlMode]);

    // font family setting
    const [selectedFontFamily, setSelectedFontFamily] = useState("Mulish, sans-serif");
    const toggleFontFamily = (fontFamily) => {
        setSelectedFontFamily(fontFamily);
        document.body.style.setProperty("--font-family", fontFamily);
    };

    // dynamic font setting
    const [fontLink, setFontLink] = useState('');
    const [fontUrl, setFontUrl] = useState('');
    const handleApply = () => {
        const link = document.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        document.body.style.fontFamily = fontLink;
    };
    const handleClear = () => {
        const link = document.querySelector(`link[href="${fontUrl}"]`);
        if (link) {
            link.remove();
        }
        document.body.style.fontFamily = '';
        setFontLink('');
        setFontUrl('');
    };

    // page header setting
    const [headerFix, setHeaderFix] = useState(true);
    const headerFixToggle = () => {
        setHeaderFix(!headerFix);
    }

    // border radius setting
    const [showRadius, setShowRadius] = useState(true);
    const radiusToggle = () => {
        setShowRadius(!showRadius);
        document.body.classList.toggle("radius-0")
    }

    // sidebar background image setting
    const [sidebarBg, setSidebarBg] = useState(false);
    const [activeBgImage, setActiveBgImage] = useState(sidebarImg1);
    const sidebarBgItem = [
        {
            image: sidebarImg1,
        },
        {
            image: sidebarImg2,
        },
        {
            image: sidebarImg3,
        },
        {
            image: sidebarImg4,
        },
        {
            image: sidebarImg5,
        },
    ]
    const sidebarBgToggle = () => {
        setSidebarBg(!sidebarBg);
        const sidebar = document.getElementsByClassName('sidebar')[0];
        if (sidebar) {
            sidebar.classList.toggle('sidebar-image');
            // Set the CSS variable for the sidebar background
            document.documentElement.style.setProperty('--sidebar-bg-image', `url('${activeBgImage.src}')`);
        }
    };
    const handleImageClick = (image) => {
        setActiveBgImage(image); // Set the clicked image as the active one
        const sidebar = document.getElementsByClassName('sidebar')[0];
        if (sidebar) {
            document.documentElement.style.setProperty('--sidebar-bg-image', `url('${image.src}')`);
        }
    };

    // box shadow setting
    const [showShadow, setShowShadow] = useState(false);
    const [cardShadow, setCardShadow] = useState(false);
    useEffect(() => {
        const card = document.querySelectorAll(".card");
        setCardShadow(card);
    }, [])
    const shadowToggle = () => {
        setShowShadow(!showShadow);
        cardShadow.forEach(card => {
            card.classList.toggle("shadow-shadow-sm");
        });
    }

    // search bar open
    const [searchBar, setSearchBar] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchRef = useRef(null);
    const inputRef = useRef(null);
    const toggleSearchBar = () => {
        setSearchBar(true);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)
            ) {
                setSearchBar(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [searchBar]);

    function handleSearchChange(e){
        const value = e.target.value;
        setSearchText(value);
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('global-search-change', { detail: value }));
        }
    }

    const colorItem = [
        {
            name: "indigo",
            color: "bg-theme-indigo",
        },
        {
            name: "blue",
            color: "bg-theme-blue",
        },
        {
            name: "cyan",
            color: "bg-theme-cyan",
        },
        {
            name: "green",
            color: "bg-theme-green",
        },
        {
            name: "orange",
            color: "bg-theme-orange",
        },
        {
            name: "blush",
            color: "bg-theme-blush",
        },
        {
            name: "red",
            color: "bg-theme-red",
        },
        {
            name: "dynamic",
            color: "bg-primary-10",
            icon: IconBrush,
        },
    ]

    const [dynamicColorItem, setDynamicColorItem] = useState([
        {
            color: "bg-primary",
            label: "Primary Color",
            variable: "--primary",
        },
        {
            color: "bg-secondary",
            label: "Secondary Color",
            variable: "--secondary",
        },
        {
            color: "bg-body-color",
            label: "Body Background",
            variable: "--body-color",
        },
        {
            color: "bg-card-color",
            label: "Card Background",
            variable: "--card-color",
        },
        {
            color: "bg-border-color",
            label: "Border Color",
            variable: "--border-color",
        },
        {
            color: "bg-chart-color1",
            label: "Chart Color 1",
            variable: "--chart-color1",
        },
        {
            color: "bg-chart-color2",
            label: "Chart Color 2",
            variable: "--chart-color2",
        },
        {
            color: "bg-chart-color3",
            label: "Chart Color 3",
            variable: "--chart-color3",
        },
        {
            color: "bg-chart-color4",
            label: "Chart Color 4",
            variable: "--chart-color4",
        },
        {
            color: "bg-chart-color5",
            label: "Chart Color 5",
            variable: "--chart-color5",
        },
    ])

    const fontItem = [
        {
            image: font_mali,
            font: "Mali, sans-serif"
        },
        {
            image: font_quicksand,
            font: "Quicksand, sans-serif"
        },
        {
            image: font_mulish,
            font: "Mulish, sans-serif"
        },
        {
            image: font_jura,
            font: "Jura, sans-serif"
        },
    ]

    // logout
    async function handleLogout() {
        await performLogout();
        if (typeof window !== 'undefined') window.location.href = '/auth/sign-in';
    }

    const auth = getAuthToken();
    const roles = Array.isArray(auth?.user_data?.roles) ? auth?.user_data?.roles : [];
    const isAdmin = roles.includes('ADM');

    return (
        <>
            <div className={`md:py-4 md:px-6 sm:p-3 py-3 border-b-4 border-card-color bg-body-color ${headerFix ? 'sticky top-0 z-[2] xl:shadow-none shadow-lg' : ''}`}>
                <div className='container-fluid flex items-center'>
                <div className='flex items-center gap-3 sm:pe-4 pe-2'>
                        <button onClick={toggleMiniSidebar} className='xl:flex hidden items-center justify-center w-[36px] h-[36px] min-w-[36px] text-primary bg-primary-10 rounded-full'>
                            <IconArrowBigLeftFilled className={`transition-all ${miniSidebar ? 'rotate-180 rtl:rotate-0' : 'rotate-0 rtl:rotate-180'}`} />
                        </button>
                        <Link href="/">
                            <CompanyLogo />
                        </Link>
                    </div>
                    <div ref={searchRef} className='relative px-4 flex-1 md:block hidden'>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="filter customer"
                            value={searchText}
                            onChange={handleSearchChange}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            className={`w-full py-[6px] px-[12px] bg-card-color rounded-md border border-border-color focus:outline-0`}
                        />
                    </div>
                    <div className='flex items-center ms-auto'>
                        <div className='relative group'>
                            <button className='md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                                <span className='xl:block hidden'>
                                    Notification
                                </span>
                                <IconBellRinging className='stroke-[1.5] xl:hidden w-[20px] h-[20px]' />
                            </button>
                            <div className='bg-card-color text-font-color rounded-xl overflow-hidden md:w-[380px] w-[calc(100%-30px)] shadow-shadow-lg md:absolute fixed md:end-0 end-15 md:top-full top-[55px] origin-top-right rtl:origin-top-left z-[1] opacity-0 invisible scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100'>
                                <div className='flex items-center justify-between gap-10 p-4'>
                                    <div className='font-semibold'>
                                        Notifications Center
                                    </div>
                                    <span className='inline-block bg-danger text-white rounded-md text-[14px]/[1] py-1 px-2 font-semibold'>
                                        14
                                    </span>
                                </div>
                                <Tabs>
                                    <TabList className="flex flex-wrap sm:px-6 px-4 border-b border-border-color relative">
                                        <Tab className="flex-1 cursor-pointer py-2 px-3 border-b-[7px] border-transparent text-center -mb-1 text-secondary rounded-t-md transition-all hover:bg-primary-10 hover:border-primary focus:outline-0" selectedClassName='!border-primary'>
                                            Message
                                        </Tab>
                                        <Tab className="flex-1 cursor-pointer py-2 px-3 border-b-[7px] border-transparent text-center -mb-1 text-secondary rounded-t-md transition-all hover:bg-primary-10 hover:border-primary focus:outline-0" selectedClassName='!border-primary'>
                                            Events
                                        </Tab>
                                        <Tab className="flex-1 cursor-pointer py-2 px-3 border-b-[7px] border-transparent text-center -mb-1 text-secondary rounded-t-md transition-all hover:bg-primary-10 hover:border-primary focus:outline-0" selectedClassName='!border-primary'>
                                            Logs
                                        </Tab>
                                    </TabList>
                                    <div className='md:h-[calc(60svh-185px)] h-[calc(80svh-185px)] sm:p-6 p-4 overflow-auto custom-scrollbar'>
                                        <TabPanel>
                                            <ul>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <Image src={avatar5} alt='notification icon' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Olive Tree
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                13MIN
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            making it over 2000 years old
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <Image src={avatar6} alt='notification icon' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Del Phineum
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                1HR
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            There are many variations of passages
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <Image src={avatar1} alt='notification icon' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Rose Bush
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                2MIN
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            changed an issue from "In Progress" to <span className='text-white text-center text-[12px]/[1] bg-success rounded-md py-[2px] px-[5px]'>Review</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <div className='w-[36px] h-[36px] min-w-[36px] rounded-md font-semibold text-secondary bg-primary-10 flex items-center justify-center'>
                                                        PT
                                                    </div>
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Pat Thettick
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                13MIN
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            It is a long established fact that a reader will be distracted
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <Image src={avatar3} alt='notification icon' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Eileen Dover
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                1HR
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            There are many variations of passages
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <Image src={avatar4} alt='notification icon' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Carmen Goh
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                1DAY
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            Contrary to popular belief <span className='text-white text-center text-[12px]/[1] bg-danger rounded-md py-[2px] px-[5px]'>Code</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <Image src={avatar7} alt='notification icon' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] rounded-md' />
                                                    <div className='w-full'>
                                                        <div className='flex justify-between gap-10'>
                                                            <div className='font-medium'>
                                                                Karen Onnabit
                                                            </div>
                                                            <span className='text-[12px]/[1] text-font-color-100'>
                                                                1DAY
                                                            </span>
                                                        </div>
                                                        <div className='text-[14px]/[20px]'>
                                                            The generated Lorem Ipsum
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </TabPanel>
                                        <TabPanel>
                                            <ul>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <IconThumbUpFilled className='fill-secondary w-[24px] h-[24px] min-w-[24px]' />
                                                    <div className='w-full'>
                                                        <div className='font-medium mb-1'>
                                                            Your New Campaign <span className='text-primary font-semibold'>Holiday Sale</span> is approved.
                                                        </div>
                                                        <div className='text-[12px]/[18px] text-font-color-100'>
                                                            11:30 AM Today
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <IconChartPieFilled className='fill-secondary w-[24px] h-[24px] min-w-[24px]' />
                                                    <div className='w-full'>
                                                        <div className='font-medium mb-1'>
                                                            Website visits from Twitter is <span className='text-primary font-semibold'>27% higher</span> than last week.
                                                        </div>
                                                        <div className='text-[12px]/[18px] text-font-color-100'>
                                                            04:00 PM Today
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <IconInfoCircleFilled className='fill-secondary w-[24px] h-[24px] min-w-[24px]' />
                                                    <div className='w-full'>
                                                        <div className='font-medium mb-1'>
                                                            Campaign <span className='text-primary font-semibold'>Holiday Sale</span> is nearly reach budget limit.
                                                        </div>
                                                        <div className='text-[12px]/[18px] text-font-color-100'>
                                                            10:00 AM Today
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className='py-10 border-b border-border-color flex gap-4'>
                                                    <IconInfoTriangleFilled className='fill-secondary w-[24px] h-[24px] min-w-[24px]' />
                                                    <div className='w-full'>
                                                        <div className='font-medium mb-1'>
                                                            <span className='text-warning font-semibold'>Error</span> on website analytics configurations
                                                        </div>
                                                        <div className='text-[12px]/[18px] text-font-color-100'>
                                                            Yesterday
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </TabPanel>
                                        <TabPanel>
                                            <div className="text-font-color-400 text-[24px]/[30px] font-medium">No Logs right now!</div>
                                        </TabPanel>
                                    </div>
                                </Tabs>
                                <Link href="#" className='bg-primary text-[14px]/[20px] text-white py-5 px-10 text-center w-full inline-block'>
                                    View all notifications
                                </Link>
                            </div>
                        </div>
                        <button onClick={toggleFullScreen} className='xl:block hidden md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                            <IconArrowsMaximize className='stroke-[1.5]' />
                        </button>
                        <button onClick={toggleNote} className='xl:hidden sm:block hidden md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                            <IconNote className='stroke-[1.5] w-[20px] h-[20px]' />
                        </button>
                        <div className='relative group'>
                            <button className='xl:block hidden md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                                <IconWorld className='stroke-[1.5]' />
                            </button>
                            <div className='bg-card-color text-font-color rounded-xl overflow-auto max-h-[50svh] custom-scrollbar w-[200px] shadow-shadow-lg absolute end-0 top-full origin-top-right rtl:origin-top-left z-[1] opacity-0 invisible scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100'>
                                <ul>
                                    <li className='py-10 px-15 border-b border-dashed border-border-color transition-all hover:bg-primary-10'>
                                        <Link href="#" className='flex items-center gap-2'>
                                            <Image src={flag_uk} width="" height="" alt='language' className='w-[20px] h-[15px] min-w-[20px]' />
                                            UK English
                                        </Link>
                                    </li>
                                    <li className='py-10 px-15 border-b border-dashed border-border-color transition-all hover:bg-primary-10'>
                                        <Link href="#" className='flex items-center gap-2'>
                                            <Image src={flag_us} width="" height="" alt='language' className='w-[20px] h-[15px] min-w-[20px]' />
                                            US English
                                        </Link>
                                    </li>
                                    <li className='py-10 px-15 border-b border-dashed border-border-color transition-all hover:bg-primary-10'>
                                        <Link href="#" className='flex items-center gap-2'>
                                            <Image src={flag_de} width="" height="" alt='language' className='w-[20px] h-[15px] min-w-[20px]' />
                                            Germany
                                        </Link>
                                    </li>
                                    <li className='py-10 px-15 border-b border-dashed border-border-color transition-all hover:bg-primary-10'>
                                        <Link href="#" className='flex items-center gap-2'>
                                            <Image src={flag_in} width="" height="" alt='language' className='w-[20px] h-[15px] min-w-[20px]' />
                                            Hindi
                                        </Link>
                                    </li>
                                    <li className='py-10 px-15 transition-all hover:bg-primary-10'>
                                        <Link href="#" className='flex items-center gap-2'>
                                            <Image src={flag_sa} width="" height="" alt='language' className='w-[20px] h-[15px] min-w-[20px]' />
                                            Saudi Arabia
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button onClick={toggleChat} className='xl:hidden sm:block hidden md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                            <IconMessage className='stroke-[1.5] w-[20px] h-[20px]' />
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className='md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'
                        >
                            <IconMoonStars className='stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]' />
                        </button>
                        <div className='relative group flex'>
                            <button className='md:px-3 px-2'>
                                <Image src={profile_av} alt='profile' width="36" height="36" className='w-[36px] h-[36px] min-w-[36px] bg-white shadow-shadow-lg p-1 rounded-full saturate-50 transition-all hover:filter-none' />
                            </button>
                            <div className='bg-card-color text-font-color rounded-xl overflow-hidden md:w-[240px] w-[calc(100%-30px)] shadow-shadow-lg md:absolute fixed md:right-0 right-15 md:top-full top-[55px] origin-top-right z-[1] opacity-0 invisible scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100'>
                                <div className='p-4 border-b border-border-color'>
                                    <div className='font-semibold'>
                                        Allie Grater
                                    </div>
                                    <div className='text-font-color-100'>
                                        alliegrater@luno.com
                                    </div>
                                </div>
                                <div className='p-1 m-1 custom-scrollbar overflow-auto max-h-[calc(80svh-163px)]'>
                                    <Link href="#" className='py-2 px-4 flex items-center gap-3'>
                                        <IconUser className='w-[16px] h-[16px]' />
                                        My Profile
                                    </Link>
                                    {isAdmin ? (
                                        <Link href="/select-customer" className='py-2 px-4 flex items-center gap-3'>
                                            Switch Account
                                        </Link>
                                    ) : null}
                                    <Link href="#" className='py-2 px-4 flex items-center gap-3'>
                                        <IconSettings className='w-[16px] h-[16px]' />
                                        Settings
                                    </Link>
                                    <Link href="#" className='py-2 px-4 flex items-center gap-3'>
                                        <IconCreditCard className='w-[16px] h-[16px]' />
                                        Billing
                                    </Link>
                                    <Link href="#" className='py-2 px-4 flex items-center gap-3'>
                                        <IconUsersGroup className='w-[16px] h-[16px]' />
                                        Manage Team
                                    </Link>
                                    <Link href="#" className='py-2 px-4 flex items-center gap-3'>
                                        <IconCalendarFilled className='w-[16px] h-[16px]' />
                                        My Events
                                    </Link>
                                    <Link href="#" className='py-2 px-4 flex items-center gap-3'>
                                        <IconTag className='w-[16px] h-[16px]' />
                                        Support Ticket
                                    </Link>
                                </div>
                                <button onClick={handleLogout} className='bg-secondary uppercase text-[14px]/[20px] text-white py-5 px-10 text-center w-full inline-block'>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                        <button onClick={toggleThemeSetting} className='md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                            <IconSettings className='stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]' />
                        </button>
                        <button className={`md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300 xl:hidden hamburger-menu ${mobileNav ? 'opened' : ''}`} onClick={toggleMobileNav}>
                            <svg width="20" height="20" viewBox="0 0 100 100">
                                <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                                <path className="line line2" d="M 20,50 H 80" />
                                <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`fixed top-0 bg-card-color z-[5] h-svh w-full max-w-[500px] transition-all duration-200 ${themeSetting ? 'ltr:right-0 rtl:left-0' : 'ltr:-right-full rtl:-left-full'}`}>
                <div className='md:px-6 px-4 md:py-4 py-3 flex items-center justify-between gap-15 border-b border-border-color'>
                    <div className='text-[20px]/[30px] font-medium'>
                        Theme Setting
                    </div>
                    <button onClick={toggleThemeSetting}>
                        <IconX />
                    </button>
                </div>
                <div className='md:p-6 p-4 md:h-[calc(100svh-63px-67px)] h-[calc(100svh-55px-59px)] overflow-auto custom-scrollbar'>
                    <div className='relative mb-6 md:p-4 py-4 px-3 border border-dashed border-primary rounded-xl'>
                        <span className='inline-block bg-card-color px-5 font-semibold text-primary absolute -top-3'>
                            Color Setting
                        </span>
                        <ul className='flex gap-2'>
                            {colorItem.map((item, key) => (
                                <li
                                    key={key}
                                    onClick={() => handleThemeChange(item.name)}
                                    className={`sm:w-[30px] w-[24px] sm:h-[26px] h-[20px] rounded-md flex items-center justify-center relative cursor-pointer ${item.color} ${selectedTheme === item.name ? 'after:absolute after:-left-1 after:-top-1 sm:after:w-[38px] after:w-[32px] sm:after:h-[34px] after:h-[28px] after:rounded-md after:border after:border-primary' : ''}`}
                                >
                                    {item.icon && <item.icon className='stroke-[1.5] w-[20px] h-[20px] cursor-pointer' />}
                                </li>
                            ))}
                        </ul>
                        <div className='dynamic-color-setting relative md:p-4 py-4 px-3 border border-dashed border-primary rounded-xl mt-6'>
                            <span className='inline-block bg-card-color px-5 font-semibold text-primary absolute -top-3'>
                                Dynamic Color Setting
                            </span>
                            <ul className='sm:columns-2 gap-2'>
                                {dynamicColorItem.map((item, index) => (
                                    <li key={index}>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                className={`w-[26px] h-[16px] rounded-md border border-border-color ${item.color}`}
                                                onClick={() => handleClickDynamicColor(index)}
                                            ></button>
                                            <label>
                                                {item.label}
                                            </label>
                                        </div>
                                        {item.displayColorPicker && (
                                            <div className='absolute z-[2]'>
                                                <div onClick={() => handleCloseDynamicColor(index)} className='fixed top-0 right-0 bottom-0 left-0' />
                                                <ChromePicker color={item.colorValue} onChange={(newColor) => handleChangeDynamicColor(newColor, index)} />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='relative mb-6 md:p-4 py-4 px-3 border border-dashed border-border-color rounded-xl'>
                        <span className='inline-block bg-card-color px-5 font-semibold absolute -top-3'>
                            Light/Dark & RTL Mode
                        </span>
                        <div className='flex'>
                            <div
                                onClick={toggleDarkMode}
                                className={`p-2 m-1 rounded-xl border cursor-pointer hover:bg-primary-10 ${!darkMode ? 'bg-primary-10 border-dashed border-primary' : 'bg-card-color border-transparent'}`}
                            >
                                <Image src={light_version} alt='light version' width="300" height="168" />
                            </div>
                            <div
                                onClick={toggleDarkMode}
                                className={`p-2 m-1 rounded-xl border cursor-pointer hover:bg-primary-10 ${darkMode ? 'bg-primary-10 border-dashed border-primary' : 'bg-card-color border-transparent'}`}
                            >
                                <Image src={dark_version} alt='dark version' width="300" height="168" />
                            </div>
                            <div
                                onClick={toggleRtlMode}
                                className={`p-2 m-1 rounded-xl border cursor-pointer hover:bg-primary-10 ${rtlMode ? 'bg-primary-10 border-dashed border-primary' : 'bg-card-color border-transparent'}`}
                            >
                                <Image src={rtl_version} alt='rtl version' width="300" height="168" />
                            </div>
                        </div>
                    </div>
                    <div className='relative mb-6 md:p-4 py-4 px-3 border border-dashed border-border-color rounded-xl'>
                        <span className='inline-block bg-card-color px-5 font-semibold absolute -top-3'>
                            Google Font Setting
                        </span>
                        <div className='flex'>
                            {fontItem.map((item, key) => (
                                <div
                                    key={key}
                                    onClick={() => toggleFontFamily(item.font)}
                                    className={`p-2 m-1 rounded-xl border cursor-pointer hover:bg-primary-10 ${selectedFontFamily === item.font ? 'bg-primary-10 border-dashed border-primary' : 'bg-card-color border-transparent'}`}
                                >
                                    <Image src={item.image} alt='font mali' width="79" height="44" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='relative mb-6 md:p-4 py-4 px-3 bg-body-color rounded-xl'>
                        <span className='inline-block font-semibold mb-4'>
                            Dynamic Font Setting
                        </span>
                        <div className='mb-2 form-control'>
                            <label className="form-label">Enter font URL</label>
                            <input
                                type="text"
                                id="font_url"
                                value={fontUrl}
                                className="form-input"
                                onChange={(e) => setFontUrl(e.target.value)}
                                placeholder="http://fonts.cdnfonts.com/css/vonfont"
                            />
                        </div>
                        <div className='mb-4 form-control'>
                            <label className="form-label">Enter font family name</label>
                            <input
                                type="text"
                                id="font_family"
                                value={fontLink}
                                onChange={(e) => setFontLink(e.target.value)}
                                placeholder="vonfont"
                                className="form-input"
                            />
                        </div>
                        <div className='flex items-start gap-5'>
                            <button
                                onClick={handleApply}
                                className='btn btn-primary'
                            >
                                Apply Font
                            </button>
                            <button
                                onClick={handleClear}
                                className='btn btn-secondary'
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className='mb-5'>
                            More Setting
                        </div>
                        <ul>
                            <li className='py-3 px-4 border-b border-dashed border-border-color hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="header_fix"
                                        onChange={headerFixToggle}
                                        checked={headerFix}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="header_fix">Page Header Fix</label>
                                </div>
                            </li>
                            <li className='py-3 px-4 border-b border-dashed border-border-color hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="radius_checkbox"
                                        onChange={radiusToggle}
                                        checked={showRadius}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="radius_checkbox">Border Radius</label>
                                </div>
                            </li>
                            <li className='py-3 px-4 border-b border-dashed border-border-color hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="sidebar_background"
                                        onChange={sidebarBgToggle}
                                        checked={sidebarBg}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="sidebar_background">Background Image {'(Sidebar)'}</label>
                                </div>
                                {sidebarBg && <div className='flex flex-wrap gap-1 mt-2'>
                                    {sidebarBgItem.map((item, key) => (
                                        <button key={key} onClick={() => handleImageClick(item.image)}>
                                            <Image src={item.image} width="40" height="100" alt="Sidebar BG" className={`w-50 h-100 rounded-md object-cover border-2 ${activeBgImage === item.image ? 'grayscale-0 border-primary' : 'grayscale border-transparent'}`} />
                                        </button>
                                    ))}
                                </div>}
                            </li>
                            <li className='py-3 px-4 border-b border-dashed border-border-color hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="container_checkbox"
                                        onChange={containerToggle}
                                        checked={container}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="container_checkbox">Container</label>
                                </div>
                            </li>
                            <li className='py-3 px-4 hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="shadow_checkbox"
                                        onChange={shadowToggle}
                                        checked={showShadow}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="shadow_checkbox">Card Box-Shadow</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='md:px-6 px-4 md:py-4 py-3 flex items-center gap-10 border-t border-border-color'>
                    <button className='btn btn-primary w-full'>
                        Save Changes
                    </button>
                    <button className='btn btn-white !border-border-color w-full' onClick={toggleThemeSetting}>
                        Close
                    </button>
                </div>
            </div>
            <div onClick={toggleThemeSetting} className={`fixed z-[4] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px] transition-all duration-500 ease-in-out ${themeSetting ? 'opacity-1 visible overflow-auto' : 'opacity-0 invisible overflow-hidden'}`}></div>
        </>
    )
}
