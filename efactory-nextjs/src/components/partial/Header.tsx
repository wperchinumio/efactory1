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
    IconMenu2,
    IconChevronLeft,
} from '@tabler/icons-react';
import ContactForm from '../common/ContactForm';
import UserProfileModal from '../common/UserProfileModal';
import {
    dark_version,
    light_version,
    rtl_version,
    font_mali,
    font_roboto,
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
} from '../../../public/images';
import Link from 'next/link';
import Image from 'next/image';
import { clearAuthToken, getAuthToken, performLogout, setAuthToken } from '@/lib/auth/storage';
import type { AuthToken, UserProfileData } from '@/types/api';
import { loadAccounts } from '@/lib/api/auth';
import { 
    getThemePreferences, 
    saveThemePreferences, 
    applyThemePreferences, 
    initializeThemeFromStorage 
} from '@/lib/themeStorage';
import TopMenu from '../layout/TopMenu';
import { useLoading } from '@/contexts/LoadingContext';

interface HeaderProps {
	toggleMobileNav: () => void;
	mobileNav: boolean;
	toggleNote: () => void;
	toggleChat: () => void;
	userApps?: number[];
}

export default function Header({ toggleMobileNav, mobileNav, toggleNote, toggleChat, userApps = [] }: HeaderProps) {
    const { loadingStates, setChangingUser } = useLoading();
    const { isChangingUser } = loadingStates;
    
    // Determine if we should show the new navigation - use state to avoid hydration mismatch
    const [showNewNavigation, setShowNewNavigation] = useState(false);
    
    useEffect(() => {
        const auth = getAuthToken();
        const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
        const hasAdminRole = roles.includes('ADM');
        
        // Check if we're on demo page or root page
        const isOnDemoPage = typeof window !== 'undefined' && (window.location.pathname === '/demo-navigation' || window.location.pathname === '/');
        
        // Show new navigation ONLY if:
        // 1. Not an admin user (regular customer login)
        // 2. OR admin has selected a customer (userApps provided)
        // 3. OR on demo page (always show for demo)
        const shouldShow = (!hasAdminRole) || 
                          (hasAdminRole && userApps.length > 0) ||
                          isOnDemoPage;
        setShowNewNavigation(shouldShow);
    }, [userApps]);

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

    // feedback modal
    const [feedbackOpen, setFeedbackOpen] = useState(false)
    const toggleFeedback = () => {
        setFeedbackOpen(!feedbackOpen)
        document.body.classList.toggle("overflow-hidden", !feedbackOpen)
    }

    // user profile dropdown
    const [userProfileOpen, setUserProfileOpen] = useState(false)
    const toggleUserProfile = () => {
        setUserProfileOpen(!userProfileOpen)
    }
    const closeUserProfile = () => {
        setUserProfileOpen(false)
    }

    // user profile modal
    const [userProfileModalOpen, setUserProfileModalOpen] = useState(false)
    const toggleUserProfileModal = () => {
        setUserProfileModalOpen(!userProfileModalOpen)
        setUserProfileOpen(false) // Close dropdown when opening modal
    }

    // color setting - initialize from localStorage
    const [selectedTheme, setSelectedTheme] = useState("indigo");
    const handleThemeChange = (name: string) => {
        setSelectedTheme(name);
        document.body.setAttribute("data-luno-theme", name);
        // Save to localStorage
        saveThemePreferences({ lunoTheme: name as any });
    };

    // sidebar auto-collapse setting
    const [sidebarAutoCollapse, setSidebarAutoCollapse] = useState(true);
    const handleSidebarToggle = (checked: boolean) => {
        setSidebarAutoCollapse(checked);
        // Save immediately to localStorage (like color settings)
        saveThemePreferences({ sidebarAutoCollapse: checked });
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('themePreferencesChanged'));
    };

    // top menu icons visibility setting
    const [showTopMenuIcons, setShowTopMenuIcons] = useState(false);
    const handleTopMenuIconsToggle = (checked: boolean) => {
        setShowTopMenuIcons(checked);
        // Save immediately to localStorage
        saveThemePreferences({ showTopMenuIcons: checked });
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('themePreferencesChanged'));
    };
    useEffect(() => {
        document.body.setAttribute("data-luno-theme", selectedTheme);
    }, [selectedTheme]);

    // Load sidebar setting from localStorage
    useEffect(() => {
        const themePrefs = getThemePreferences();
        setSidebarAutoCollapse(themePrefs.sidebarAutoCollapse);
        setShowTopMenuIcons(themePrefs.showTopMenuIcons);
    }, []);

    // dynamic color setting
    const handleChangeDynamicColor = (newColor: any, index: number) => {
        const updatedDynamicColorItem = [...dynamicColorItem];
        if (updatedDynamicColorItem[index]) {
            updatedDynamicColorItem[index].colorValue = newColor.rgb;
            setDynamicColorItem(updatedDynamicColorItem);
            updateCssVariable(updatedDynamicColorItem[index].variable, newColor.rgb);
        }
        
        // Save dynamic colors to localStorage
        const dynamicColors = updatedDynamicColorItem.map(item => ({
            variable: item.variable,
            colorValue: item.colorValue
        }));
        saveThemePreferences({ dynamicColors });
    };
    const handleClickDynamicColor = (index: number) => {
        const updatedDynamicColorItem = [...dynamicColorItem];
        if (updatedDynamicColorItem[index]) {
            updatedDynamicColorItem[index].displayColorPicker = !updatedDynamicColorItem[index].displayColorPicker;
            setDynamicColorItem(updatedDynamicColorItem);
        }
    };
    const handleCloseDynamicColor = (index: number) => {
        const updatedDynamicColorItem = [...dynamicColorItem];
        if (updatedDynamicColorItem[index]) {
            updatedDynamicColorItem[index].displayColorPicker = false;
            setDynamicColorItem(updatedDynamicColorItem);
        }
    };
    const updateCssVariable = (variable: string, color: any) => {
        document.documentElement.style.setProperty(variable, `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`);
    };

    // light dark mode - initialize from localStorage
    const [darkMode, setDarkMode] = useState(false)
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        document.documentElement.setAttribute("data-theme", newDarkMode ? "dark" : "light");
        // Save to localStorage
        saveThemePreferences({ mode: newDarkMode ? 'dark' : 'light' });
    };
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    // rtl mode - initialize from localStorage
    const [rtlMode, setRtlMode] = useState(false)
    const toggleRtlMode = () => {
        const newRtlMode = !rtlMode;
        setRtlMode(newRtlMode);
        document.documentElement.setAttribute("dir", newRtlMode ? "rtl" : "ltr");
        // Save to localStorage
        saveThemePreferences({ rtlMode: newRtlMode });
    };
    useEffect(() => {
        document.documentElement.setAttribute('dir', rtlMode ? 'rtl' : 'ltr');
    }, [rtlMode]);

    // font family setting - initialize from localStorage
    const [selectedFontFamily, setSelectedFontFamily] = useState("Mulish, sans-serif");
    const toggleFontFamily = (fontFamily: string) => {
        setSelectedFontFamily(fontFamily);
        document.body.style.setProperty("--font-family", fontFamily);
        // Save to localStorage
        saveThemePreferences({ fontFamily });
    };





    // search bar open
    const [searchBar, setSearchBar] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toggleSearchBar = () => {
        setSearchBar(true);
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current && !searchRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)
            ) {
                setSearchBar(false);
            }
            // Close user profile dropdown when clicking outside
            if (userProfileOpen && event.target && !(event.target as Element).closest('.user-profile-dropdown')) {
                setUserProfileOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [searchBar, userProfileOpen]);

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>){
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
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-secondary",
            label: "Secondary Color",
            variable: "--secondary",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-body-color",
            label: "Body Background",
            variable: "--body-color",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-card-color",
            label: "Card Background",
            variable: "--card-color",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-border-color",
            label: "Border Color",
            variable: "--border-color",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-chart-color1",
            label: "Chart Color 1",
            variable: "--chart-color1",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-chart-color2",
            label: "Chart Color 2",
            variable: "--chart-color2",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-chart-color3",
            label: "Chart Color 3",
            variable: "--chart-color3",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-chart-color4",
            label: "Chart Color 4",
            variable: "--chart-color4",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
        {
            color: "bg-chart-color5",
            label: "Chart Color 5",
            variable: "--chart-color5",
            colorValue: { r: 0, g: 0, b: 0, a: 1 },
            displayColorPicker: false
        },
    ])

    // Initialize theme preferences from localStorage on component mount
    useEffect(() => {
        const preferences = initializeThemeFromStorage();
        
        // Update component state with loaded preferences
        setSelectedTheme(preferences.lunoTheme);
        setDarkMode(preferences.mode === 'dark');
        setRtlMode(preferences.rtlMode);
        setSelectedFontFamily(preferences.fontFamily);
        
        // Apply dynamic colors if they exist
        if (preferences.dynamicColors && preferences.dynamicColors.length > 0) {
            setDynamicColorItem(prev => 
                prev.map((item, index) => ({
                    ...item,
                    colorValue: preferences.dynamicColors?.[index]?.colorValue || { r: 0, g: 0, b: 0, a: 1 },
                    displayColorPicker: false
                }))
            );
        }
    }, []);

    const fontItem = [
        {
            image: font_mali,
            font: "Mali, sans-serif"
        },
        {
            image: font_roboto,
            font: "Roboto, sans-serif"
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

    // handle change user (back to DCL menu) - optimized for speed like legacy
    async function handleChangeUser() {
        setChangingUser(true, 'Switching to DCL Menu...');
        
        try {
            // Just clear the apps from auth token to show admin sidebar (like legacy)
            const currentAuth = getAuthToken();
            if (currentAuth && currentAuth.user_data) {
                const updatedAuth: AuthToken = {
                    ...currentAuth,
                    user_data: {
                        ...currentAuth.user_data,
                        apps: [] // Clear apps to show admin sidebar
                    }
                };
                setAuthToken(updatedAuth);
            }
            
            // Navigate immediately - let the target page handle data loading
            if (typeof window !== 'undefined') {
                // Short delay just to show the loading indicator
                setTimeout(() => {
                    window.location.replace('/admin/login-user');
                }, 300);
            }
        } catch (error) {
            console.error('Failed to switch to DCL menu:', error);
            // Fallback to direct navigation
            if (typeof window !== 'undefined') {
                window.location.replace('/admin/login-user');
            }
        } finally {
            // Reset loading state quickly
            setTimeout(() => {
                setChangingUser(false);
            }, 500);
        }
    }

    // Avoid reading localStorage during SSR to prevent hydration mismatch
    const [isAdmin, setIsAdmin] = useState(false)
    const [userInfo, setUserInfo] = useState({ username: '', email: '' })
    const [userProfileData, setUserProfileData] = useState<UserProfileData | null>(null)
    
    useEffect(() => {
        const auth = getAuthToken();
        const roles = Array.isArray(auth?.user_data?.roles) ? auth.user_data.roles : [];
        const isLocalAdmin = auth?.user_data?.is_local_admin === true;
        // Admin if has ADM role OR is_local_admin (like legacy)
        const adminStatus = roles.includes('ADM') || isLocalAdmin;
        setIsAdmin(adminStatus)
        
        // Get user info from auth token
        if (auth && auth.user_data) {
            // If in pure admin context (no impersonation), always show Admin User
            const showAdminUser = adminStatus && (Array.isArray(userApps) ? userApps.length === 0 : true);
            const username = showAdminUser
                ? 'Admin User'
                : (auth.user_data.name || 
                    String(auth.user_data.user_id || '') || 
                    auth.user_data.username || 
                    auth.user_data.login || 
                    auth.user_data.account || 
                    'Admin User');
            
            setUserInfo({
                username: String(username || ''),
                email: showAdminUser ? '' : String(auth.user_data.email || '')
            });

            // Build user profile data for the modal
            if (!showAdminUser) {
                // Calculate accounts visibility like legacy system
                const calc_account_regions = auth.user_data.calc_account_regions || {};
                const accountRegions = Object.values(calc_account_regions);
                const accounts_visibility = Array.isArray(accountRegions) ? accountRegions.join(', ') : '';

                const profileData: UserProfileData = {
                    username: String(auth.user_data.name || auth.user_data.username || auth.user_data.login || ''),
                    company_name: String(auth.user_data.company_name || ''),
                    company_code: String(auth.user_data.company_code || ''),
                    policy_code: String(auth.user_data.policy_code || ''),
                    policy_account: String(auth.user_data.account || ''),
                    policy_region: String(auth.user_data.region || ''),
                    accounts_visibility: accounts_visibility,
                    email: String(auth.user_data.email || '')
                };
                setUserProfileData(profileData);
            }
        }
    }, [userApps]); // Re-run when userApps changes (impersonation state)

    return (
        <>
            <div className="md:py-3 md:px-4 sm:p-2 py-2 border-b-4 border-card-color bg-body-color sticky top-0 z-[2] xl:shadow-none shadow-lg">
                <div className='container-fluid flex items-center'>
                <div className='flex items-center gap-1 sm:pe-4 pe-2 flex-1 min-w-0'>
                        <button onClick={toggleMiniSidebar} className='xl:flex hidden items-center justify-center w-[36px] h-[36px] min-w-[36px] text-primary bg-primary-10 rounded-full' aria-label={miniSidebar ? 'Expand sidebar' : 'Collapse sidebar'}>
                            {miniSidebar ? (
                                <IconMenu2 className="w-5 h-5" />
                            ) : (
                                <IconChevronLeft className="w-5 h-5" />
                            )}
                        </button>
                        <Link href="/">
                            <CompanyLogo />
                        </Link>
                        
                        {/* Top Navigation Menu - Only show for customer context */}
                        {showNewNavigation && (
                            <div className='flex items-center ml-6 flex-1 min-w-0'>
                                <TopMenu />
                            </div>
                        )}
                    </div>

                    <div className='flex flex-col items-end ms-auto'>
                        {/* Buttons Row */}
                        <div className='flex items-center'>
                            <button onClick={toggleFullScreen} className='xl:block hidden md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                                <IconArrowsMaximize className='stroke-[1.5]' />
                            </button>
                            {/* Removed note and chat buttons per request */}
                            <button
                                onClick={toggleDarkMode}
                                className='md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'
                            >
                                <IconMoonStars className='stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]' />
                            </button>
                            
                            <div className='relative flex user-profile-dropdown'>
                                <button onClick={toggleUserProfile} className='md:py-2 md:px-3 p-2 hover:bg-primary-10 transition-all duration-300'>
                                    <IconUser className='stroke-[1.5] xl:w-[24px] xl:h-[24px] w-[20px] h-[20px]' />
                                </button>
                                <div className={`bg-card-color text-font-color rounded-xl overflow-hidden md:w-[320px] w-[calc(100%-30px)] shadow-shadow-lg md:absolute fixed md:right-0 right-15 md:top-full top-[55px] origin-top-right z-[1] transition-all duration-300 ${userProfileOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-0'}`}>
                                <div className='p-4 border-b border-border-color'>
                                    <div className='font-semibold text-font-color'>
                                        {userInfo.username}
                                    </div>
                                    {userProfileData?.company_code && (
                                        <div className='text-font-color-100 text-xs mt-1'>
                                            {userProfileData.company_code}
                                        </div>
                                    )}
                                    {userInfo.email && (
                                        <div className='text-font-color-100 text-xs break-words mt-1'>
                                            {userInfo.email}
                                        </div>
                                    )}
                                </div>
                                <div className='p-1 m-1 custom-scrollbar overflow-auto max-h-[calc(80svh-163px)]'>
                                    {/* Show My Profile, Team Members, and Leave Feedback only for regular users or admin impersonating */}
                                    {(!isAdmin || (isAdmin && userApps.length > 0)) ? (
                                        <>
                                            <button onClick={() => { closeUserProfile(); toggleUserProfileModal(); }} className='py-2 px-4 flex items-center gap-3 rounded-lg hover:bg-primary-10 transition-all duration-200 hover:text-primary w-full text-left'>
                                                <IconUser className='w-[16px] h-[16px]' />
                                                My Profile
                                            </button>
                                            <Link href="/team-members" onClick={closeUserProfile} className='py-2 px-4 flex items-center gap-3 rounded-lg hover:bg-primary-10 transition-all duration-200 hover:text-primary'>
                                                <IconUsersGroup className='w-[16px] h-[16px]' />
                                                Team Members
                                            </Link>
                                            <button onClick={() => { closeUserProfile(); toggleFeedback(); }} className='py-2 px-4 flex items-center gap-3 rounded-lg hover:bg-primary-10 transition-all duration-200 hover:text-primary w-full text-left'>
                                                <IconThumbUpFilled className='w-[16px] h-[16px]' />
                                                Leave a feedback
                                            </button>
                                        </>
                                    ) : null}
                                    
                                    {/* Settings is always available */}
                                    <button onClick={() => { closeUserProfile(); toggleThemeSetting(); }} className='py-2 px-4 flex items-center gap-3 rounded-lg hover:bg-primary-10 transition-all duration-200 hover:text-primary w-full text-left'>
                                        <IconBrush className='w-[16px] h-[16px]' />
                                        Theme Settings
                                    </button>
                                    
                                    {/* Back to DCL Menu only shows when admin is impersonating */}
                                    {isAdmin && userApps.length > 0 ? (
                                        <button 
                                            onClick={() => { closeUserProfile(); handleChangeUser(); }} 
                                            disabled={isChangingUser}
                                            className={`py-2 px-4 flex items-center gap-3 rounded-lg transition-all duration-200 font-semibold w-full text-left ${
                                                isChangingUser 
                                                    ? 'opacity-50 cursor-not-allowed' 
                                                    : 'hover:bg-primary-10 hover:text-primary'
                                            }`}
                                        >
                                            {isChangingUser ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    <IconArrowBigLeftFilled className='w-[16px] h-[16px]' />
                                                    Back to DCL Menu
                                                </>
                                            )}
                                        </button>
                                    ) : null}
                                </div>
                                <button onClick={() => { closeUserProfile(); handleLogout(); }} className='bg-secondary uppercase text-[14px]/[20px] text-white py-1.5 px-2.5 text-center w-full inline-block'>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                        </div>
                        
                        
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
                <div className='md:px-6 px-4 md:py-4 py-3 flex items-center justify-between gap-4 border-b border-border-color'>
                    <div className='text-[20px]/[30px] font-medium'>
                        Theme Settings
                    </div>
                    <button onClick={toggleThemeSetting}>
                        <IconX />
                    </button>
                </div>
                <div className='md:p-6 p-4 md:h-[calc(100svh-63px-67px)] h-[calc(100svh-55px-1.59px)] overflow-auto custom-scrollbar'>
                    <div className='relative mb-6 md:p-4 py-4 px-3 border border-dashed border-primary rounded-xl'>
                        <span className='inline-block bg-card-color px-1.5 font-semibold text-primary absolute -top-3'>
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
                            <span className='inline-block bg-card-color px-1.5 font-semibold text-primary absolute -top-3'>
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
                        <span className='inline-block bg-card-color px-1.5 font-semibold absolute -top-3'>
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
                        <span className='inline-block bg-card-color px-1.5 font-semibold absolute -top-3'>
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
                    <div>
                        <div className='mb-1.5'>
                            More Setting
                        </div>
                        <ul>
                            <li className='py-3 px-4 hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="sidebar_auto_collapse_checkbox"
                                        onChange={(e) => handleSidebarToggle(e.target.checked)}
                                        checked={sidebarAutoCollapse}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="sidebar_auto_collapse_checkbox">Auto-collapse sidebar menus</label>
                                </div>
                            </li>
                            <li className='py-3 px-4 hover:bg-primary-10'>
                                <div className="form-check form-switch">
                                    <input
                                        type="checkbox"
                                        id="show_top_menu_icons_checkbox"
                                        onChange={(e) => handleTopMenuIconsToggle(e.target.checked)}
                                        checked={showTopMenuIcons}
                                        className="form-check-input"
                                    />
                                    <label className="form-check-label" htmlFor="show_top_menu_icons_checkbox">Show top menu icons</label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='md:px-6 px-4 md:py-4 py-3 flex items-center gap-2.5 border-t border-border-color'>
                    <button className='btn btn-white !border-border-color w-full' onClick={toggleThemeSetting}>
                        Close
                    </button>
                </div>
            </div>
            <div onClick={toggleThemeSetting} className={`fixed z-[4] w-full h-full left-0 top-0 bg-black-50 backdrop-blur-[2px] transition-all duration-500 ease-in-out ${themeSetting ? 'opacity-1 visible overflow-auto' : 'opacity-0 invisible overflow-hidden'}`}></div>
            
            {/* Feedback Modal */}
            <ContactForm 
                isOpen={feedbackOpen} 
                onClose={() => {
                    setFeedbackOpen(false);
                    document.body.classList.remove("overflow-hidden");
                }} 
            />

            {/* User Profile Modal */}
            {userProfileData && (
                <UserProfileModal
                    open={userProfileModalOpen}
                    onOpenChange={setUserProfileModalOpen}
                    userData={userProfileData}
                />
            )}
        </>
    )
}
