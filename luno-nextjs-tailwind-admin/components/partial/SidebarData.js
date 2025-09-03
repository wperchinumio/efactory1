
import {
    IconHome,
    IconSitemap,
    IconShieldLock,
    IconApps,
    IconNotebook,
    IconId,
    IconSquares,
    IconLayout2,
    IconChecklist,
    IconTimelineEventPlus,
} from '@tabler/icons-react'

export const menuList = [
    {
        devider: "Main",
    },
    {
        icon: IconHome,
        link: "My Dashboard",
        children: [
            {
                link: "Analysis",
                url: "/",
            },
            {
                link: "My Wallet",
                url: "/dashboard/my-wallet",
            },
            {
                link: "Smart IOT",
                url: "/dashboard/smart-iot",
            },
        ]
    },
    {
        icon: IconApps,
        link: "Applications",
        children: [
            {
                link: "Calendar",
                url: "/app/calendar",
            },
            // {
            //     link: "tui Calendar",
            //     url: "/app-calendar-tui",
            // },
            {
                link: "Email App",
                url: "/app/email",
            },
            {
                link: "Chat App",
                url: "/app/chat",
            },
            {
                link: "Campaigns",
                url: "/app/campaign",
            },
            {
                link: "Social App",
                url: "/app/social",
            },
            {
                link: "File Manager",
                url: "/app/file-manager",
            },
            {
                link: "Todo App",
                url: "/app/todo",
            },
            {
                link: "Contact",
                url: "/app/contact",
            },
            {
                link: "Task",
                url: "/app/task",
            },
            {
                link: "Project List",
                url: "/app/project/list",
            },
        ]
    },
    {
        icon: IconNotebook,
        link: "More Pages",
        children: [
            {
                link: "My Profile",
                url: "/page/my-profile",
            },
            {
                link: "Bookmarks",
                url: "/page/bookmark",
            },
            {
                link: "Timeline",
                url: "/page/timeline",
            },
            {
                link: "Image Gallery",
                url: "/page/image-gallery",
            },
            {
                link: "Pricing",
                url: "/page/pricing",
            },
            {
                link: "Teams Board",
                url: "/page/team-board",
            },
            {
                link: "Support Ticket",
                url: "/page/support-ticket",
            },
            {
                link: "FAQs",
                url: "/page/faq",
            },
            {
                link: "Search Page",
                url: "/page/search-page",
            },
            {
                link: "Footers",
                url: "/page/footers",
            },
        ]
    },
    {
        icon: IconId,
        link: "Account",
        children: [
            {
                link: "Setting",
                url: "/account/setting",
            },
            {
                link: "Invoice List",
                url: "/account/invoice",
            },
            {
                link: "Create Invoice",
                url: "/account/create-invoice",
            },
            {
                link: "Billing",
                url: "/account/billing",
            },
        ]
    },
    {
        icon: IconShieldLock,
        link: "Authentication",
        children: [
            {
                link: "404",
                url: "/auth/error",
            },
            {
                link: "Sign In",
                url: "/auth/sign-in",
            },
            {
                link: "Sign Up",
                url: "/auth/sign-up",
            },
            {
                link: "Forgot Password",
                url: "/auth/forgot-password",
            },
            {
                link: "2-Step Authentication",
                url: "/auth/two-step",
            },
            {
                link: "Lockscreen",
                url: "/auth/lockscreen",
            },
            {
                link: "Maintenance",
                url: "/auth/maintenance",
            },
        ]
    },
    {
        icon: IconSitemap,
        link: "Menu Level",
        children: [
            {
                link: "Level 1",
                children: [
                    {
                        link: "Level 2",
                        url: "#",
                    },
                ]
            },
            {
                link: "Level 1",
                url: "#",
            },
        ]
    },
    {
        devider: "RESOURCES",
    },
    {
        icon: IconSquares,
        link: "Modals Popups",
        url: "/modals",
    },
    {
        icon: IconLayout2,
        link: "Widget's",
        url: "/widgets",
    },
    {
        icon: IconChecklist,
        link: "Documentation",
        url: "/documentation",
    },
    {
        icon: IconTimelineEventPlus,
        link: "Changelog",
        url: "/documentation/change-log",
    },
]

export const documentationItem = [
    {
        devider: "DOCUMENTATION",
        color: "primary",
        fontWeight: "bold",
    },
    {
        link: "Overview",
        url: "/documentation",
    },
    {
        link: "Dev Setup",
        url: "/documentation/dev-setup",
    },
    {
        link: "File Structure",
        url: "/documentation/file-structure",
    },
    {
        link: "References",
        url: "/documentation/references",
    },
    {
        link: "Helper Class",
        url: "/documentation/helperclass",
    },
    {
        link: "Changelog",
        url: "/documentation/change-log",
    },
]

export const crmManagement = [
    {
        link: "sdfsdf",
        url: "#",
    },
    {
        link: "sdadasaffsdf",
        url: "#",
    },
]