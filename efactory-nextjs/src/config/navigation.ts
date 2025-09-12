import { TopMenuConfig, SidebarConfig, MenuItem } from '../types/api';
import {
  IconHome,
  IconBook,
  IconTag,
  IconShoppingCart,
  IconTruck,
  IconArrowsExchange,
  IconChartBar,
  IconCloud,
  IconFiles,
  IconSettings,
  IconList,
  IconShare,
  IconArrowDown,
  IconPencil,
  IconCube,
  IconMapPin,
  IconFileSpreadsheet,
  IconCalendar,
  IconCalculator,
  IconInfoCircle,
  IconUsers,
  IconCloudUpload,
  IconBriefcase,
  IconUserPlus,
  IconBuilding,
  IconClock,
  IconBolt,
  IconCalendarCheck,
  IconChartBarOff,
  IconReportAnalytics,
  IconBuildingWarehouse,
  IconPackage,
  IconClipboardList,
  IconShip,
  IconFileText,
  IconBoxSeam,
  IconBarcode,
  IconSearch,
  IconEdit,
  IconEye,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconAlertTriangle,
  IconCircleCheck,
  IconX,
  IconPlus,
  IconMinus,
  IconFilter,
  IconSortAscending,
  IconDatabase,
  IconServer,
  IconNetwork,
  IconMail,
  IconBell,
  IconKey,
  IconLock,
  IconShield,
  IconUserCheck,
  IconCreditCard,
  IconReceipt,
  IconCurrency,
  IconPercentage,
  IconTarget,
  IconTrendingUp,
  IconChartPie,
  IconActivity,
  IconGlobe,
  IconLink,
  IconExternalLink,
  IconDownload as IconImport,
  IconUpload as IconExport,
} from '@tabler/icons-react';

// Top menu configuration - maps to app IDs from header.js
export const topMenuConfig: TopMenuConfig[] = [
  {
    keyword: 'overview',
    title: 'Overview',
    iconComponent: IconHome,
    appIds: [1, 2, 3],
    sidebarConfig: 'overview'
  },
  {
    keyword: 'orders',
    title: 'Orders',
    iconComponent: IconBook,
    appIds: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 61, 21, 22, 23, 72, 25],
    sidebarConfig: 'orders'
  },
  {
    keyword: 'items',
    title: 'Items',
    iconComponent: IconTag,
    appIds: [26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 37, 38, 39, 40, 41, 73, 206],
    sidebarConfig: 'items'
  },
  {
    keyword: 'returntrak',
    title: 'ReturnTrak',
    iconComponent: IconArrowsExchange,
    appIds: [55, 56, 54, 57, 58, 59, 75],
    sidebarConfig: 'returntrak'
  },
  {
    keyword: 'orderpoints',
    title: 'OrderPoints',
    iconComponent: IconShoppingCart,
    appIds: [47, 48, 49, 50, 76, 74, 53, 51],
    sidebarConfig: 'orderpoints'
  },
  {
    keyword: 'edi',
    title: 'EDI Central',
    iconComponent: IconCloud,
    appIds: [52, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    sidebarConfig: 'edi'
  },
  {
    keyword: 'analytics',
    title: 'Analytics',
    iconComponent: IconChartBar,
    appIds: [42, 43, 201, 202, 203, 204, 205, 208, 46, 63, 70, 44, 45, 64, 35, 71, 211],
    sidebarConfig: 'analytics'
  },
  {
    keyword: 'transportation',
    title: 'Transportation',
    iconComponent: IconTruck,
    appIds: [209, 210, 207, 212, 213],
    sidebarConfig: 'transportation'
  },
  {
    keyword: 'services',
    title: 'Services',
    iconComponent: IconSettings,
    appIds: [67, 65, 66, 99992, 77, 78, 79, 80, 81, 68, 69, 214],
    isDropdown: true,
    dropdownMenus: [
      // Section title: Communications (no route)
      { keyword: 'section_communications', title: 'Communications', route: '', appId: undefined as any },
      // Documents behaves like a main menu
      { keyword: 'documents', title: 'Documents', route: '/documents', appId: 62 },
      // Section title: Setup (no route)
      { keyword: 'section_setup', title: 'Setup', route: '', appId: undefined as any },
      // Administration Tasks behaves like a main menu
      { keyword: 'administration_tasks', title: 'Administration Tasks', route: '/services/administration-tasks/accounts', appId: 67 },
      // Test Components - dev only
      { keyword: 'test_components', title: 'Test Components', route: '/testcomponents', appId: undefined as any, isDevOnly: true }
    ]
  }
];

// Sidebar configurations - based on sidebar.js
export const sidebarConfigs: Record<string, SidebarConfig> = {
  overview: {
    searchBox: 'order', // Legacy shows Order # search here
    menus: [
      {
        keyword: 'overview',
        iconComponent: IconHome,
        title: 'Overview',
        route: '/overview',
        appId: 1
      },
      {
        keyword: 'notes',
        iconComponent: IconPencil,
        title: 'Personal notes',
        route: '/overview/notes',
        appId: 3
      }
    ]
  },
  orders: {
    searchBox: 'order', // Legacy shows Order # search here
    menus: [
      {
        keyword: 'orders',
        iconComponent: IconBook,
        title: 'Orders',
        isDropdownOpenDefault: true,
        sectionTitleBefore: 'FULFILLMENT',
        dropdownMenus: [
          {
            keyword: 'open',
            route: '/orders/open',
            title: 'Open',
            badge: '/orders/open',
            badgeClassName: 'badge badge-info',
            appId: 5
          },
          {
            keyword: 'on_hold',
            route: '/orders/onhold',
            title: 'On Hold',
            badge: '/orders/onhold',
            badgeClassName: 'badge badge-danger',
            appId: 6
          },
          {
            keyword: 'back_orders',
            route: '/orders/backorders',
            title: 'Back Orders',
            badge: '/orders/backorders',
            badgeClassName: 'badge bg-yellow-gold',
            appId: 7
          },
          {
            keyword: 'pre_released',
            route: '/orders/prerelease',
            title: 'Pre-Release',
            badge: '/orders/prerelease',
            badgeClassName: 'badge badge-danger',
            appId: 8
          },
          {
            keyword: 'shipped',
            route: '/orders/shipped',
            title: 'Shipped',
            appId: 9
          },
          {
            keyword: 'canceled',
            route: '/orders/canceled',
            title: 'Canceled',
            appId: 10
          },
          {
            keyword: 'all',
            route: '/orders/all',
            title: 'All',
            appId: 11
          }
        ]
      },
      {
        keyword: 'order_items',
        iconComponent: IconClipboardList,
        title: 'Order Lines',
        dropdownMenus: [
          {
            keyword: 'open',
            route: '/order-lines/open',
            title: 'Open',
            appId: 12
          },
          {
            keyword: 'on_hold',
            route: '/order-lines/onhold',
            title: 'On Hold',
            appId: 13
          },
          {
            keyword: 'back_orders',
            route: '/order-lines/backorders',
            title: 'Back Orders',
            appId: 14
          },
          {
            keyword: 'pre_released',
            route: '/order-lines/prerelease',
            title: 'Pre-Release',
            appId: 15
          },
          {
            keyword: 'shipped',
            route: '/order-lines/shipped',
            title: 'Shipped',
            appId: 16
          },
          {
            keyword: 'canceled',
            route: '/order-lines/canceled',
            title: 'Canceled',
            appId: 17
          },
          {
            keyword: 'all',
            route: '/order-lines/all',
            title: 'All',
            appId: 18
          }
        ]
      },
      {
        keyword: 'order_items_2',
        iconComponent: IconPackage,
        title: 'Order Items',
        dropdownMenus: [
          {
            keyword: 'backlog_items',
            route: '/order-items/backlog',
            title: 'Backlog Items',
            appId: 19
          },
          {
            keyword: 'shipped_items',
            route: '/order-items/shipped',
            title: 'Shipped Items',
            appId: 20
          },
          {
            keyword: 'all_items',
            route: '/order-items/all',
            title: 'All Items',
            appId: 61
          }
        ]
      },
      {
        keyword: 'ship_detail',
        iconComponent: IconShip,
        title: 'Ship Detail',
        dropdownMenus: [
          {
            keyword: 'freight',
            title: 'Freight',
            route: '/detail/freight',
            appId: 21
          },
          {
            keyword: 'package',
            title: 'Package',
            route: '/detail/package',
            appId: 22
          },
          {
            keyword: 'serial_lot',
            title: 'Serial/Lot #',
            route: '/detail/serial',
            appId: 23
          }
        ]
      },
      {
        keyword: 'customer_docs',
        iconComponent: IconFileText,
        title: 'Customer Docs.',
        isDropdownOpenDefault: false,
        dropdownMenus: [
          {
            keyword: 'bill',
            route: '/orders/documents/bill',
            title: 'Bill Of Ladings',
            appId: 72
          },
          {
            keyword: 'etags',
            route: '/orders/documents/etags',
            title: 'Return eTags',
            appId: 72
          },
          {
            keyword: 'routing',
            route: '/orders/documents/routing',
            title: 'Routing Instructions',
            appId: 72
          }
        ]
      }
    ]
  },
  items: {
    searchBox: 'item', // Legacy shows Item # search here
    menus: [
      {
        keyword: 'items',
        iconComponent: IconTag,
        title: 'Items',
        isDropdownOpenDefault: true,
        sectionTitleBefore: 'INVENTORY',
        dropdownMenus: [
          {
            keyword: 'status',
            route: '/inventory/items/status',
            title: 'Status',
            appId: 26
          },
          {
            keyword: 'receiving',
            route: '/inventory/items/receiving',
            title: 'Receiving',
            appId: 27
          },
          {
            keyword: 'on_hold',
            route: '/inventory/items/onhold',
            title: 'On Hold',
            appId: 28
          },
          {
            keyword: 'transactions',
            route: '/inventory/items/transactions',
            title: 'Transactions',
            appId: 29
          },
          {
            keyword: 'lot_master',
            route: '/inventory/items/lotmaster',
            title: 'Lot Master',
            appId: 31
          },
          {
            keyword: 'as_of_a_date',
            route: '/inventory/items/asofadate',
            title: 'As of a Date',
            appId: 32
          },
          {
            keyword: 'transaction_summary',
            route: '/inventory/items/trsummary',
            title: 'Transaction Summary',
            appId: 33
          },
          {
            keyword: 'cycle_count',
            route: '/inventory/items/cyclecount',
            title: 'Cycle Count',
            appId: 34
          },
          {
            keyword: 'dangerous_goods',
            route: '/inventory/items/dg-data',
            title: 'DG Data',
            appId: 39
          },
          {
            keyword: 'bundle',
            route: '/inventory/items/bundle',
            title: 'Bundles',
            appId: 206
          }
        ]
      },
      {
        keyword: 'receipts',
        iconComponent: IconArrowDown,
        title: 'Receipts',
        dropdownMenus: [
          {
            keyword: 'po_notifications',
            route: '/inventory/receipts/po-notifications',
            title: 'PO Notifications (ASN)',
            appId: 36
          },
          {
            keyword: 'po_receipt',
            route: '/inventory/receipts/po-receipt',
            title: 'Ext. PO Receipt',
            appId: 37
          },
          {
            keyword: 'po_rma',
            route: '/inventory/receipts/rma-receipt',
            title: 'Ext. RMA Receipt',
            appId: 38
          }
        ]
      },
      {
        keyword: 'assembly',
        iconComponent: IconCube,
        title: 'Assembly',
        route: '/inventory/assembly',
        appIds: [40]
      },
      {
        keyword: 'returns',
        iconComponent: IconArrowsExchange,
        title: 'Returns',
        route: '/inventory/returns',
        appIds: [41]
      },
      {
        keyword: 'customer_docs',
        iconComponent: IconFileText,
        title: 'Customer Docs.',
        dropdownMenus: [
          {
            keyword: 'assembly',
            route: '/inventory/documents/assembly',
            title: 'Assembly',
            appId: 73
          },
          {
            keyword: 'dangerousgoods',
            route: '/documents/general/dangerousgoods',
            title: 'DG Data',
            appId: 73
          },
          {
            keyword: 'label',
            route: '/inventory/documents/labels',
            title: 'Items and Labels',
            appId: 73
          },
          {
            keyword: 'consigned',
            route: '/inventory/documents/consigned',
            title: 'Material Receipts',
            appId: 73
          },
          {
            keyword: 'return',
            route: '/inventory/documents/return',
            title: 'Returned Items',
            appId: 73
          },
          {
            keyword: 'serial',
            route: '/inventory/documents/serial',
            title: 'Serial Numbers',
            appId: 73
          }
        ]
      }
    ]
  },
  orderpoints: {
    searchBox: 'order',
    menus: [
      {
        keyword: 'order_entry',
        iconComponent: IconShoppingCart,
        sectionTitleBefore: 'ORDERPOINTS',
        title: 'Order Entry',
        route: '/orderpoints',
        appIds: [47]
      },
      {
        keyword: 'drafts',
        iconComponent: IconCube,
        badge: '/orderpoints/drafts',
        badgeClassName: 'badge badge-info badge-margin-fix',
        title: 'Drafts',
        route: '/orderpoints/drafts',
        appIds: [48]
      },
      {
        keyword: 'address_book',
        iconComponent: IconMapPin,
        title: 'Address Book',
        route: '/orderpoints/addressbook',
        appIds: [49]
      },
      {
        keyword: 'mass_upload',
        iconComponent: IconFileSpreadsheet,
        title: 'Mass Upload',
        route: '/orderpoints/massupload',
        appIds: [50]
      },
      {
        keyword: 'ftp_batches',
        iconComponent: IconCalendar,
        title: 'FTP Batches',
        route: '/orderpoints/ftp-batches',
        appIds: [76]
      },
      {
        keyword: 'ship_cost',
        iconComponent: IconCalculator,
        sectionTitleBefore: 'OTHERS',
        title: 'Shipping Cost Estimator',
        route: '/orderpoints/shippingcost',
        appIds: [51]
      },
      {
        keyword: 'customer_docs',
        iconComponent: IconFileText,
        title: 'Customer Docs.',
        dropdownMenus: [
          {
            keyword: 'ftp-send',
            route: '/orderpoints/documents/ftp-folders-send',
            title: 'FTP Folders - Send',
            appId: 74
          },
          {
            keyword: 'ftp-get',
            route: '/orderpoints/documents/ftp-folders-get',
            title: 'FTP Folders - Get',
            appId: 74
          }
        ]
      },
      {
        keyword: 'help',
        iconComponent: IconInfoCircle,
        sectionTitleBefore: 'HELP',
        title: 'Help and FAQ',
        dropdownMenus: [
          {
            keyword: 'order_entry',
            title: 'Order Entry',
            route: '/orderpoints/help/1',
            appId: 53
          },
          {
            keyword: 'drafts',
            title: 'Drafts',
            route: '/orderpoints/help/2',
            appId: 53
          },
          {
            keyword: 'address_book',
            title: 'Address Book',
            route: '/orderpoints/help/3',
            appId: 53
          },
          {
            keyword: 'mass_upload',
            title: 'Mass Upload',
            route: '/orderpoints/help/4',
            appId: 53
          },
          {
            keyword: 'shippingcost',
            title: 'Shipping Cost Estimator',
            route: '/orderpoints/help/5',
            appId: 53
          }
        ]
      }
    ]
  },
  transportation: {
    menus: [
      {
        keyword: 'by-time',
        sectionTitleBefore: 'TRANSPORTATION',
        iconComponent: IconCalendar,
        title: 'By Time',
        route: '/transportation/time',
        appIds: [209]
      },
      {
        keyword: 'by-ship-service',
        iconComponent: IconTruck,
        title: 'By Service',
        route: '/transportation/service',
        appIds: [210]
      },
      {
        keyword: 'freight-analyzer',
        iconComponent: IconTruck,
        title: 'Analyzer',
        route: '/transportation/analyzer',
        appIds: [207]
      },
      {
        keyword: 'shipping_detail',
        iconComponent: IconTruck,
        sectionTitleBefore: 'PACKAGES',
        title: 'Shipping Detail',
        route: '/transportation/packages/shipping-detail',
        appIds: [212]
      },
      {
        keyword: 'ship_cost',
        iconComponent: IconCalculator,
        title: 'Cost Estimator',
        route: '/transportation/packages/cost-estimator',
        appIds: [213]
      }
    ]
  },
  returntrak: {
    searchBox: 'rma', // Legacy shows RMA search here
    menus: [
      {
        keyword: 'rma_entry',
        iconComponent: IconShoppingCart,
        title: 'RMA Entry',
        sectionTitleBefore: 'RETURNTRAK',
        route: '/returntrak',
        appIds: [55]
      },
      {
        keyword: 'draft',
        iconComponent: IconCube,
        badge: '/returntrak/drafts',
        badgeClassName: 'badge badge-info',
        title: 'Drafts',
        route: '/returntrak/drafts',
        appIds: [56]
      },
      {
        keyword: 'rmas',
        iconComponent: IconArrowsExchange,
        title: 'RMAs',
        isDropdownOpenDefault: true,
        dropdownMenus: [
          {
            keyword: 'open',
            route: '/returntrak/rmas/open',
            title: 'Open',
            badge: '/returntrak/rmas/open',
            badgeClassName: 'badge badge-info',
            appId: 57
          },
          {
            keyword: 'all',
            route: '/returntrak/rmas/all',
            title: 'All',
            appId: 58
          },
          {
            keyword: 'items',
            route: '/returntrak/rmas/items',
            title: 'Items',
            appId: 59
          }
        ]
      },
      {
        keyword: 'shipped_orders',
        iconComponent: IconBook,
        title: 'Shipped Orders',
        route: '/returntrak/shipped-orders',
        appIds: [54]
      },
      {
        keyword: 'customer_docs',
        iconComponent: IconFileText,
        title: 'Customer Docs.',
        dropdownMenus: [
          {
            keyword: 'return',
            route: '/returntrak/documents/return',
            title: 'Returned Items',
            appId: 75
          }
        ]
      }
    ]
  },
  analytics: {
    searchBox: 'order',
    menus: [
      {
        keyword: 'analytics-domestic',
        sectionTitleBefore: 'PROFILES',
        iconComponent: IconMapPin,
        title: 'Domestic',
        route: '/analytics/profiles/domestic',
        appIds: [42]
      },
      {
        keyword: 'analytics-international',
        iconComponent: IconGlobe,
        title: 'International',
        route: '/analytics/profiles/international',
        appIds: [43]
      },
      {
        keyword: 'analytics-time',
        iconComponent: IconCalendar,
        title: 'By Time',
        route: '/analytics/profiles/time',
        appIds: [201]
      },
      {
        keyword: 'analytics-item',
        iconComponent: IconTag,
        title: 'By Item',
        route: '/analytics/profiles/item',
        appIds: [203]
      },
      {
        keyword: 'analytics-customer',
        iconComponent: IconBuilding,
        title: 'By Customer',
        route: '/analytics/profiles/customer',
        appIds: [202]
      },
      {
        keyword: 'analytics-shipservice',
        iconComponent: IconTruck,
        title: 'By Ship Service',
        route: '/analytics/profiles/shipservice',
        appIds: [204]
      },
      {
        keyword: 'analytics-channel',
        iconComponent: IconCloud,
        title: 'By Channel',
        route: '/analytics/profiles/channel',
        appIds: [205]
      },
      {
        keyword: 'analytics-incident-reports',
        sectionTitleBefore: 'Quality',
        iconComponent: IconBolt,
        title: 'Incident Reports',
        route: '/analytics/slas/incident-reports',
        appIds: [208]
      },
      {
        keyword: 'analytics-shipment-times',
        sectionTitleBefore: 'SLAs',
        iconComponent: IconClock,
        title: 'Shipment Times',
        route: '/analytics/slas/shipment-times',
        appIds: [46]
      },
      {
        keyword: 'analytics-rma-times',
        iconComponent: IconClock,
        title: 'RMA Receive Times',
        route: '/analytics/slas/rma-receive-times',
        appIds: [63]
      },
      {
        keyword: 'by-delivery-times',
        iconComponent: IconCalendarCheck,
        title: 'Delivery Times',
        route: '/analytics/deliverytimes',
        appIds: [211]
      },
      {
        keyword: 'analytics-cycle',
        iconComponent: IconChartBar,
        title: 'Cycle Count',
        route: '/analytics/slas/cyclecount',
        appIds: [70]
      },
      {
        keyword: 'planning-replenishment',
        sectionTitleBefore: 'PLANNING',
        iconComponent: IconCalendar,
        title: 'Replenishment',
        route: '/analytics/planning/replenishment',
        appIds: [44]
      },
      {
        keyword: 'planning-slow-moving',
        iconComponent: IconCalendar,
        title: 'Slow Moving',
        route: '/analytics/planning/slowmoving',
        appIds: [45]
      },
      {
        keyword: 'scheduled_reports',
        iconComponent: IconCalendar,
        sectionTitleBefore: 'REPORTS',
        title: 'Scheduled Reports',
        route: '/analytics/scheduler',
        appIds: [64]
      },
      {
        keyword: 'standard_reports',
        iconComponent: IconFiles,
        title: 'Standard Reports',
        route: '/analytics/scheduler/reports',
        appIds: [35]
      },
      {
        keyword: 'custom_reports',
        iconComponent: IconFiles,
        title: 'Custom Reports',
        route: '/analytics/scheduler/customreports',
        appIds: [71]
      }
    ]
  },
  edi: {
    searchBox: 'order',
    menus: [
      {
        keyword: 'edi_overview',
        iconComponent: IconHome,
        title: 'Overview',
        route: '/edi/overview',
        appIds: [52]
      },
      {
        keyword: 'ediDocuments',
        sectionTitleBefore: 'DOCUMENTS',
        iconComponent: IconFiles,
        title: 'EDI Documents',
        isDropdownOpenDefault: true,
        dropdownMenus: [
          {
            keyword: 'ordersToResolve',
            route: '/edi/documents/orders-to-resolve',
            title: 'Orders to Resolve',
            badge: '/edi/documents/orders-to-resolve',
            badgeClassName: 'badge badge-danger',
            appId: 82
          },
          {
            keyword: 'ordersToApprove',
            route: '/edi/documents/orders-to-approve',
            title: 'Orders to Approve',
            badge: '/edi/documents/orders-to-approve',
            badgeClassName: 'badge bg-yellow-gold',
            appId: 83
          },
          {
            keyword: 'ordersToShip',
            route: '/edi/documents/orders-to-ship',
            title: 'Orders to Ship',
            badge: '/edi/documents/orders-to-ship',
            badgeClassName: 'badge badge-info',
            appId: 84
          },
          {
            keyword: 'orderHistory',
            route: '/edi/documents/order-history',
            title: 'Order History (<span class="edi-doc-sidemenu">850</span>)',
            appId: 85
          },
          {
            keyword: 'asn',
            route: '/edi/documents/asn-856',
            title: 'ASN (<span class="edi-doc-sidemenu">856</span>)',
            appId: 86
          },
          {
            keyword: 'invoice',
            route: '/edi/documents/invoice-810',
            title: 'Invoice (<span class="edi-doc-sidemenu">810</span>)',
            appId: 87
          },
          {
            keyword: 'remittance',
            route: '/edi/documents/remittance-820',
            title: 'Remittance (<span class="edi-doc-sidemenu">820</span>)',
            appId: 88
          },
          {
            keyword: 'productActivity',
            route: '/edi/documents/product-activity-852',
            title: 'Product Activity (<span class="edi-doc-sidemenu">852</span>)',
            appId: 89
          },
          {
            keyword: 'planningSchedule',
            route: '/edi/documents/planning-schedule-830',
            title: 'Planning Schedule (<span class="edi-doc-sidemenu">830</span>)',
            appId: 90
          }
        ]
      },
      {
        keyword: 'tradingPartners',
        sectionTitleBefore: 'TRADING PARTNERS',
        iconComponent: IconBuildingWarehouse,
        title: 'Trading Partners',
        isDropdownOpenDefault: false,
        dropdownMenus: [
          {
            keyword: 'tpActivity',
            route: '/edi/trading-partners/tp-activity',
            title: 'TP Activity',
            appId: 91
          },
          {
            keyword: 'tpItems',
            route: '/edi/trading-partners/tp-items',
            title: 'TP Items',
            appId: 92
          },
          {
            keyword: 'tpAddresses',
            route: '/edi/trading-partners/tp-addresses',
            title: 'TP Addresses',
            appId: 93
          },
          {
            keyword: 'tpDShipMethods',
            route: '/edi/trading-partners/tp-d-ship-methods',
            title: 'TP D. Ship Methods',
            appId: 94
          },
          {
            keyword: 'tpStatus',
            route: '/edi/trading-partners/tp-status',
            title: 'TP Status',
            appId: 95
          },
          {
            keyword: 'basicProfile',
            route: '/edi/trading-partners/basic-profile',
            title: 'Basic Profile',
            appId: 96
          },
          {
            keyword: 'invoicingProfile',
            route: '/edi/trading-partners/invoicing-profile',
            title: 'Invoicing Profile',
            appId: 97
          },
          {
            keyword: 'dclPartners',
            route: '/edi/trading-partners/dcl-partners',
            title: 'DCL Partners',
            appId: 98
          }
        ]
      },
      {
        keyword: 'extShipments',
        sectionTitleBefore: 'EXT. SHIPMENTS',
        iconComponent: IconTruck,
        title: 'Ext. Shipments',
        isDropdownOpenDefault: false,
        dropdownMenus: [
          {
            keyword: 'shipmentEntry',
            route: '/edi/ext-shipments/shipment-entry',
            title: 'Shipment Entry',
            appId: 99
          },
          {
            keyword: 'drafts',
            route: '/edi/ext-shipments/drafts',
            title: 'Drafts',
            appId: 100
          }
        ]
      }
    ]
  },
  documents: {
    menus: [
      {
        keyword: 'document_submission',
        iconComponent: IconCloudUpload,
        sectionTitleBefore: 'DOCUMENTS',
        title: 'Document Submission',
        route: '/documents',
        appIds: [62]
      },
      {
        keyword: 'customer_docs',
        iconComponent: IconFileText,
        title: 'Customer Docs.',
        isDropdownOpenDefault: true,
        dropdownMenus: [
          {
            keyword: 'approvals',
            route: '/documents/general/approvals',
            title: 'Approvals',
            appId: 62
          },
          {
            keyword: 'assembly',
            route: '/documents/general/assembly',
            title: 'Assembly',
            appId: 62
          },
          {
            keyword: 'bill',
            route: '/documents/general/bill',
            title: 'Bill Of Ladings',
            appId: 62
          },
          {
            keyword: 'dangerousgoods',
            route: '/documents/general/dangerousgoods',
            title: 'DG Data',
            appId: 62
          },
          {
            keyword: 'general',
            route: '/documents/general/general',
            title: 'General Documents',
            appId: 62
          },
          {
            keyword: 'label',
            route: '/documents/general/labels',
            title: 'Items and Labels',
            appId: 62
          },
          {
            keyword: 'consigned',
            route: '/documents/general/consigned',
            title: 'Material Receipts',
            appId: 62
          },
          {
            keyword: 'purchase',
            route: '/documents/general/purchase',
            title: 'Purchase Orders',
            appId: 62
          },
          {
            keyword: 'etags',
            route: '/documents/general/etags',
            title: 'Return eTags',
            appId: 62
          },
          {
            keyword: 'return',
            route: '/documents/general/return',
            title: 'Returned Items',
            appId: 62
          },
          {
            keyword: 'routing',
            route: '/documents/general/routing',
            title: 'Routing Instructions',
            appId: 62
          },
          {
            keyword: 'serial',
            route: '/documents/general/serial',
            title: 'Serial Numbers',
            appId: 62
          }
        ]
      },
      {
        keyword: 'special_docs',
        iconComponent: IconBriefcase,
        title: 'Special Docs.',
        isDropdownOpenDefault: true,
        dropdownMenus: [
          {
            keyword: 'inc_po',
            route: '/special-docs/token-incoming-po',
            title: 'Token Incoming PO',
            appId: 62
          },
          {
            keyword: 'incoming_sn',
            route: '/special-docs/token-incoming-sn',
            title: 'Token Incoming SN',
            appId: 62
          },
          {
            keyword: 'sn_binding',
            route: '/special-docs/token-sn-binding',
            title: 'Token SN Binding',
            appId: 62
          },
          {
            keyword: 'sn_unbinding',
            route: '/special-docs/token-sn-unbinding',
            title: 'Token SN Unbinding',
            appId: 62
          },
          {
            keyword: 'count_info',
            route: '/special-docs/token-cycle-count-info',
            title: 'Token Cycle Count Info',
            appId: 62
          }
        ]
      },
      {
        keyword: 'ftp_folders',
        iconComponent: IconCloud,
        title: 'FTP Folders',
        isDropdownOpenDefault: true,
        dropdownMenus: [
          {
            keyword: 'send',
            route: '/ftp-folders/send',
            title: 'Send',
            appId: 62
          },
          {
            keyword: 'get',
            route: '/ftp-folders/get',
            title: 'Get',
            appId: 62
          }
        ]
      }
    ]
  },
  administration_tasks: {
    menus: [
      {
        keyword: 'accounts',
        iconComponent: IconUserPlus,
        sectionTitleBefore: 'SETTINGS',
        title: 'Users',
        route: '/services/administration-tasks/accounts',
        appIds: [67]
      },
      {
        keyword: 'orderpoints_settings',
        iconComponent: IconSettings,
        title: 'OrderPoints Settings',
        route: '/services/administration-tasks/orderpoints-settings',
        appIds: [65]
      },
      {
        keyword: 'returntrak_settings',
        iconComponent: IconSettings,
        title: 'ReturnTrak Settings',
        route: '/services/administration-tasks/returntrak-settings',
        appIds: [66]
      },
      {
        keyword: 'special_settings',
        iconComponent: IconSettings,
        title: 'Special Settings',
        route: '/services/administration-tasks/special-settings',
        appIds: [99992]
      },
      {
        keyword: 'email_notif',
        iconComponent: IconMail,
        title: 'Email Notifications',
        isDropdownOpenDefault: true,
        dropdownMenus: [
          {
            keyword: 'ship-confirmation',
            route: '/services/administration-tasks/email-notifications/ship-confirmation',
            title: 'Ship Confirmation',
            appId: 77
          },
          {
            keyword: 'order_rec',
            route: '/services/administration-tasks/email-notifications/order-receipt',
            title: 'Order Receipt',
            appId: 78
          },
          {
            keyword: 'po_rec',
            route: '/services/administration-tasks/email-notifications/po-receipt',
            title: 'PO Receipt',
            appId: 79
          },
          {
            keyword: 'rma_rec',
            route: '/services/administration-tasks/email-notifications/rma-receipt',
            title: 'RMA Receipt',
            appId: 80
          },
          {
            keyword: 'unplanned_rec',
            route: '/services/administration-tasks/email-notifications/unplanned-receipt',
            title: 'Un-planned Receipt',
            appId: 81
          }
        ]
      },
      {
        keyword: 'invoices',
        iconComponent: IconShare,
        title: 'Invoices',
        sectionTitleBefore: 'INVOICES',
        dropdownMenus: [
          {
            keyword: 'open',
            route: '/services/administration-tasks/invoices/open',
            title: 'Open',
            appId: 68
          },
          {
            keyword: 'all',
            route: '/services/administration-tasks/invoices/all',
            title: 'All',
            appId: 69
          },
          {
            keyword: 'freight-charges',
            route: '/services/administration-tasks/invoices/freight-charges',
            title: 'Freight Charges',
            appId: 214
          },
          {
            keyword: 'rate-cards',
            route: '/services/administration-tasks/invoices/rate-cards',
            title: 'Rate Cards',
            appId: 214
          }
        ]
      }
    ]
  }
};

// Helper function to get visible top menus based on user apps
export const getVisibleTopMenus = (userApps: number[]): TopMenuConfig[] => {
  return topMenuConfig.map(menu => {
    // If it's a dropdown menu, filter the dropdown items
    if (menu.isDropdown && menu.dropdownMenus) {
      const filteredDropdownMenus = menu.dropdownMenus.filter(dropdownItem => {
        // Check if it's a dev-only dropdown item
        if (dropdownItem.isDevOnly) {
          return process.env.NODE_ENV === 'development';
        }
        
        // For regular dropdown items, check app access
        return !dropdownItem.appId || userApps.includes(dropdownItem.appId);
      });
      
      return {
        ...menu,
        dropdownMenus: filteredDropdownMenus
      };
    }
    
    // For regular menus, check app access
    if (menu.isDevOnly) {
      return process.env.NODE_ENV === 'development' ? menu : null;
    }
    
    return menu.appIds.some(appId => userApps.includes(appId)) ? menu : null;
  }).filter(Boolean) as TopMenuConfig[];
};

// Helper function to get visible sidebar menus based on user apps
export const getVisibleSidebarMenus = (sidebarKey: string, userApps: number[]): MenuItem[] => {
  const config = sidebarConfigs[sidebarKey];
  if (!config) {
    return [];
  }

  const filteredMenus = config.menus.filter(menu => {
    // If no appIds, always show (like legacy system)
    if (!menu.appIds || menu.appIds.length === 0) {
      return true;
    }
    
    // Check if menu has direct app IDs
    const hasAccess = menu.appIds.some(appId => userApps.includes(appId));
    return hasAccess;
  });

  return filteredMenus.map(menu => ({
    ...menu,
    dropdownMenus: menu.dropdownMenus?.filter(dropdown =>
      dropdown.appId ? userApps.includes(dropdown.appId) : false
    ) || []
  }));
};

// Helper function to determine which top menu should be active based on pathname
export const getActiveTopMenu = (pathname: string, userApps: number[]): string | null => {
  // Normalize pathname (strip query)
  const cleanPath = pathname.split('?')[0] || '';

  // Special-case mapping: some sections live under "Services" dropdown but have their own sidebars
  if (cleanPath === '/documents' || cleanPath.startsWith('/documents/')) {
    return 'documents';
  }
  if (cleanPath.startsWith('/services/administration-tasks')) {
    return 'administration_tasks';
  }
  
  // Handle testcomponents route
  if (cleanPath === '/testcomponents') {
    return 'test_components';
  }

  const visibleMenus = getVisibleTopMenus(userApps);
  
  // Handle root path - return first available menu
  if (cleanPath === '/') {
    return visibleMenus.length > 0 && visibleMenus[0] ? visibleMenus[0].keyword : null;
  }
  
  for (const menu of visibleMenus) {
    if (!menu.sidebarConfig) continue;
    const sidebarConfig = sidebarConfigs[menu.sidebarConfig];
    if (sidebarConfig) {
      // Check if any menu item in this sidebar matches the pathname
      const hasMatchingRoute = sidebarConfig.menus.some(menuItem => {
        if (menuItem.route === cleanPath) return true;
        if (menuItem.dropdownMenus) {
          return menuItem.dropdownMenus.some(dropdown => dropdown.route === cleanPath);
        }
        return false;
      });
      
      if (hasMatchingRoute) {
        return menu.keyword;
      }
    }
  }
  
  // If no exact match, try to match by URL structure /(topmenu)/(sidemenu)
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length >= 1) {
    const topMenuKeyword = pathSegments[0];
    const matchingMenu = visibleMenus.find(menu => menu.keyword === topMenuKeyword);
    if (matchingMenu) {
      return matchingMenu.keyword;
    }
  }
  
  return null;
};
