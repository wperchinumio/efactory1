
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
    IconUsers,
    IconFileSpreadsheet,
    IconReport,
} from '@tabler/icons-react'

export const menuList = [
    {
        devider: "Main",
    },
    {
        icon: IconHome,
        link: "Overview",
        children: [
            { link: "Dashboard", url: "/" },
        ]
    },
    {
        icon: IconUsers,
        link: "Admin",
        // visibility: roles includes 'ADM'
        children: [
            { link: "Login to eFactory", url: "/select-customer" },
            { link: "Online Customers", url: "/admin/online-customers" },
            { link: "License Summary", url: "/admin/license-summary" },
            { link: "eFactory Users", url: "/admin/users" },
        ]
    },
    {
        icon: IconReport,
        link: "Reports",
        children: [
            { link: "By Time", url: "/reports/by-time" },
            { link: "By Ship Service", url: "/reports/by-ship-service" },
            { link: "By Channel", url: "/reports/by-channel" },
            { link: "By Account", url: "/reports/by-account" },
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