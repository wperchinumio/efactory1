const sidebarConfig = {


  /* OVERVIEW */
  overview : {
    searchBox     : 'order',
    menus         : [
      {
        keyword             : 'overview',
        iconClassName       : 'icon-home',
        title               : 'Overview',
        route               : '/overview'
      },
     /*   {
        keyword             : 'announcements',
        iconClassName       : 'fa fa-bullhorn',
        badge               : '/announcements',
        badgeClassName      : 'badge badge-danger badge-margin-fix',
        title               : 'Announcements',
        route               : '/announcements'
      }, */
      {
        keyword             : 'notes',
        iconClassName       : 'icon-pencil',
        title               : 'Personal notes',
        route               : '/overview/notes',
      }
    ]
  },

  /* ORDERS */
  orders : {
    searchBox     : 'order',
    menus         : [
      {
        keyword             : 'orders',
        iconClassName       : 'icon-book-open',
        title               : 'Orders',
        isDropdownOpenDefault: true,
        sectionTitleBefore  : 'FULFILLMENT',
        dropdownMenus       : [
          {
            keyword     : 'open',
            route       : '/orders/open',
            title       : 'Open',
            badge       : '/orders/open',
            badgeClassName  : 'badge badge-info',
          },
          {
            keyword     : 'on_hold',
            route       : '/orders/onhold',
            title       : 'On Hold',
            badge       : '/orders/onhold',
            badgeClassName  : 'badge badge-danger',
          },
          {
            keyword     : 'back_orders',
            route       : '/orders/backorders',
            title       : 'Back Orders',
            badge       : '/orders/backorders',
            badgeClassName  : 'badge bg-yellow-gold',
          },
          {
            keyword     : 'pre_released',
            route       : '/orders/prerelease',
            title       : 'Pre-Release',
            badge       : '/orders/prerelease',
            badgeClassName  : 'badge badge-danger',
          },


          {
            keyword     : 'shipped',
            route       : '/orders/shipped',
            title       : 'Shipped',
          },
          {
            keyword     : 'canceled',
            route       : '/orders/canceled',
            title       : 'Canceled',
          },
          {
            keyword     : 'all',
            route       : '/orders/all',
            title       : 'All',
          }
        ]
      },

      {
        keyword             : 'order_items',
        iconClassName       : 'icon-list',
        title               : 'Order Lines',
        dropdownMenus       : [
          {
            keyword     : 'open',
            route       : '/order-lines/open',
            title       : 'Open',
          },
          {
            keyword     : 'on_hold',
            route       : '/order-lines/onhold',
            title       : 'On Hold',
          },
          {
            keyword     : 'back_orders',
            route       : '/order-lines/backorders',
            title       : 'Back Orders',
          },
          {
            keyword     : 'pre_released',
            route       : '/order-lines/prerelease',
            title       : 'Pre-Release',
          },


          {
            keyword     : 'shipped',
            route       : '/order-lines/shipped',
            title       : 'Shipped',
          },
          {
            keyword     : 'canceled',
            route       : '/order-lines/canceled',
            title       : 'Canceled',
          },
          {
            keyword     : 'all',
            route       : '/order-lines/all',
            title       : 'All',
          }
        ]
      },

      {
        keyword             : 'order_items_2',
        iconClassName       : 'icon-tag',
        title               : 'Order Items',
        dropdownMenus       : [
          {
            keyword     : 'backlog_items',
            route       : '/order-items/backlog',
            title       : 'Backlog Items',
          },
          {
            keyword     : 'shipped_items',
            route       : '/order-items/shipped',
            title       : 'Shipped Items',
          } ,
          {
            keyword     : 'all_items',
            route       : '/order-items/all',
            title       : 'All Items',
          }
        ]
      },

      {
        keyword             : 'ship_detail',
        iconClassName       : 'icon-share',
        title               : 'Ship Detail',
        dropdownMenus       : [
          {
            keyword     : 'freight',
            title       : 'Freight',
            route       : '/detail/freight'
          },
          {
            keyword     : 'package',
            title       : 'Package',
            route       : '/detail/package'
          },
          {
            keyword     : 'serial_lot',
            title       : 'Serial/Lot #',
            route       : '/detail/serial'
          }
        ]
      },

      {
        keyword             : 'customer_docs',
        iconClassName       : 'fa fa-th-large',
        title               : 'Customer Docs.',
        isDropdownOpenDefault: false, // temp
        dropdownMenus       : [
          {
            keyword     : 'bill',
            route       : '/orders/documents/bill',
            title       : 'Bill Of Ladings',
          },
          {
            keyword     : 'etags',
            route       : '/orders/documents/etags',
            title       : 'Return eTags',
          },
          {
            keyword     : 'routing',
            route       : '/orders/documents/routing',
            title       : 'Routing Instructions',
          },
          /*{
            keyword     : 'reference',
            route       : '/orders/documents/reference',
            title       : 'Resources',
          },*/
        ]
      },
      {
        keyword             : 'help',
        iconClassName       : 'icon-info',
        sectionTitleBefore  : 'HELP',
        title               : 'Help and FAQ',
        dropdownMenus       : [
          {
            keyword     : 'orders',
            title       : 'Orders',
            route       : '/orders/help/1'
          }
        ]
      }

    ]
  },

/* ITEMS */
  items : {
    searchBox     : 'item',
    menus         : [
      {
        keyword             : 'items',
        iconClassName       : 'icon-tag',
        title               : 'Items',
        isDropdownOpenDefault: true,
        sectionTitleBefore  : 'INVENTORY',
        dropdownMenus       : [
          {
            keyword     : 'status',
            route       : '/inventory/items/status',
            title       : 'Status',
          },
          /*{
            keyword     : 'received',
            route       : '/inventory/items/received',
            title       : 'Received',
          },*/
          {
            keyword     : 'receiving',
            route       : '/inventory/items/receiving',
            title       : 'Receiving',
          },
          {
            keyword     : 'on_hold',
            route       : '/inventory/items/onhold',
            title       : 'On Hold',
          },
          {
            keyword     : 'transactions',
            route       : '/inventory/items/transactions',
            title       : 'Transactions',
          },
          /*{
            keyword     : 'to_receive',
            route       : '/inventory/items/toreceive',
            title       : 'To Receive',
          },*/
          {
            keyword     : 'lot_master',
            route       : '/inventory/items/lotmaster',
            title       : 'Lot Master',
          },
          {
            keyword     : 'as_of_a_date',
            route       : '/inventory/items/asofadate',
            title       : 'As of a Date',
          },

          {
            keyword     : 'transaction_summary',
            route       : '/inventory/items/trsummary',
            title       : 'Transaction Summary',
          },

          {
            keyword     : 'cycle_count',
            route       : '/inventory/items/cyclecount',
            title       : 'Cycle Count',
          },

          {
            keyword     : 'dangerous_goods',
            route       : '/inventory/items/dg-data',
            title       : 'DG Data',
          },
          {
            keyword     : 'bundle',
            route       : '/inventory/items/bundle',
            title       : 'Bundles',
          }
        ]
      },

      {
        keyword             : 'receipts',
        iconClassName       : 'icon-arrow-down',
        title               : 'Receipts',
        dropdownMenus       : [
          {
            keyword     : 'po_notifications',
            route       : '/inventory/receipts/po-notifications',
            title       : 'PO Notifications (ASN)',
          },
          {
            keyword     : 'po_receipt',
            route       : '/inventory/receipts/po-receipt',
            title       : 'Ext. PO Receipt',
          },
          {
            keyword     : 'po_rma',
            route       : '/inventory/receipts/rma-receipt',
            title       : 'Ext. RMA Receipt',
          }
        ]
      },

      {
        keyword             : 'assembly',
        iconClassName       : 'fa fa-cubes',
        title               : 'Assembly',
        route               : '/inventory/assembly'
      },

      {
        keyword             : 'returns',
        iconClassName       : 'fa fa-exchange',
        title               : 'Returns',
        route               : '/inventory/returns'
      },
      {
        keyword             : 'customer_docs',
        iconClassName       : 'fa fa-th-large',
        title               : 'Customer Docs.',
        dropdownMenus       : [
          {
            keyword     : 'assembly',
            route       : '/inventory/documents/assembly',
            title       : 'Assembly',
          },
          {
            keyword     : 'dangerousgoods',
            route       : '/documents/general/dangerousgoods',
            title       : 'DG Data',
          },
          {
            keyword     : 'label',
            route       : '/inventory/documents/labels',
            title       : 'Items and Labels',
          },
          {
            keyword     : 'consigned',
            route       : '/inventory/documents/consigned',
            title       : 'Material Receipts',
          },
          {
            keyword     : 'return',
            route       : '/inventory/documents/return',
            title       : 'Returned Items',
          },
          {
            keyword     : 'serial',
            route       : '/inventory/documents/serial',
            title       : 'Serial Numbers',
          },
         /* {
            keyword     : 'reference',
            route       : '/inventory/documents/reference',
            title       : 'Resources',
          },*/
        ]
      }
    ]
  },

/* ORDERPOINTS */

  orderpoints : {
    searchBox     : 'order',
    menus         : [
      {
        keyword             : 'order_entry',
        iconClassName       : 'fa fa-opencart',
        sectionTitleBefore  : 'ORDERPOINTS',
        title               : 'Order Entry',
        route               : '/orderpoints'
      },
      {
        keyword             : 'drafts',
        iconClassName       : 'fa fa-cubes',
        badge               : '/orderpoints/drafts',
        badgeClassName      : 'badge badge-info badge-margin-fix',
        title               : 'Drafts',
        route               : '/orderpoints/drafts',
      },
      {
        keyword             : 'address_book',
        iconClassName       : 'fa fa-location-arrow',
        title               : 'Address Book',
        route               : '/orderpoints/addressbook',
      },
      {
        keyword             : 'mass_upload',
        iconClassName       : 'fa fa-file-excel-o',
        title               : 'Mass Upload',
        route               : '/orderpoints/massupload',
      },
      {
        keyword             : 'ftp_batches',
        iconClassName       : 'fa fa-calendar',
        title               : 'FTP Batches',
        route               : '/orderpoints/ftp-batches',
      },
      {
        keyword             : 'ship_cost',
        iconClassName       : 'fa fa-calculator',
        sectionTitleBefore  : 'OTHERS',
        title               : 'Shipping Cost Estimator',
        route               : '/orderpoints/shippingcost',
      },
      {
        keyword             : 'customer_docs',
        //sectionTitleBefore  : 'OTHERS',
        iconClassName       : 'fa fa-th-large',
        title               : 'Customer Docs.',
        dropdownMenus       : [
          {
            keyword     : 'ftp-send',
            route       : '/orderpoints/documents/ftp-folders-send',
            title       : 'FTP Folders - Send',
          },
          {
            keyword     : 'ftp-get',
            route       : '/orderpoints/documents/ftp-folders-get',
            title       : 'FTP Folders - Get',
          },
          /*{
            keyword     : 'reference',
            route       : '/orderpoints/documents/reference',
            title       : 'Resources',
          }*/
        ]
      },
      {
        keyword             : 'help',
        iconClassName       : 'icon-info',
        sectionTitleBefore  : 'HELP',
        title               : 'Help and FAQ',
        dropdownMenus       : [
          {
            keyword     : 'order_entry',
            title       : 'Order Entry',
            route       : '/orderpoints/help/1'
          },
          {
            keyword     : 'drafts',
            title       : 'Drafts',
            route       : '/orderpoints/help/2'
          },
          {
            keyword     : 'address_book',
            title       : 'Address Book',
            route       : '/orderpoints/help/3'
          },
          {
            keyword     : 'mass_upload',
            title       : 'Mass Upload',
            route       : '/orderpoints/help/4'
          },
          {
            keyword     : 'shippingcost',
            title       : 'Shipping Cost Estimator',
            route       : '/orderpoints/help/5'
          }
        ]
      }
    ]
  },

  /* TRANSPORTATION */

  transportation : {
    menus : [
      {
        keyword             : 'by-time',
        sectionTitleBefore  : 'TRANSPORTATION',
        iconClassName       : 'fa fa-calendar bold',
        title               : 'By Time',
        route               : '/transportation/time',
      },
      {
        keyword             : 'by-ship-ervice',
        iconClassName       : 'fa fa-truck bold',
        title               : 'By Service',
        route               : '/transportation/service',
      },
      {
        keyword             : 'freight-analyzer',
        iconClassName       : 'fa fa-truck bold',
        title               : 'Analyzer',
        route               : '/transportation/analyzer',
      },
      {
        keyword             : 'shipping_detail',
        iconClassName       : 'fa fa-truck',
        sectionTitleBefore  : 'PACKAGES',
        title               : 'Shipping Detail',
        route               : '/transportation/packages/shipping-detail',
      },
      {
        keyword             : 'ship_cost',
        iconClassName       : 'fa fa-calculator',
        title               : 'Cost Estimator',
        route               : '/transportation/packages/cost-estimator',
      }
    ]
  },

  /* RETURNTRAK */

  returntrak : {
    searchBox     : 'rma',
    menus         : [
      {
        keyword             : 'rma_entry',
        iconClassName       : 'fa fa-opencart',
        title               : 'RMA Entry',
        sectionTitleBefore  : 'RETURNTRAK',
        route               : '/returntrak',
      },
      {
        keyword             : 'draft',
        iconClassName       : 'fa fa-cubes',
        badge               : '/returntrak/drafts',
        badgeClassName      : 'badge badge-info',
        title               : 'Drafts',
        route               : '/returntrak/drafts',
      },
      {
        keyword             : 'rmas',
        iconClassName       : 'fa fa-exchange',
        title               : 'RMAs',
        isDropdownOpenDefault: true,
        dropdownMenus       : [
          {
            keyword     : 'open',
            route       : '/returntrak/rmas/open',
            title       : 'Open',
            badge       : '/returntrak/rmas/open',
            badgeClassName      : 'badge badge-info',
          },
          {
            keyword     : 'all',
            route       : '/returntrak/rmas/all',
            title       : 'All',
          },
          {
            keyword     : 'items',
            route       : '/returntrak/rmas/items',
            title       : 'Items',
          }
        ]
      },
      {
        keyword             : 'shipped_orders',
        iconClassName       : 'icon-book-open',
        title               : 'Shipped Orders',
        route               : '/returntrak/shipped-orders'
      },
      {
        keyword             : 'customer_docs',
        iconClassName       : 'fa fa-th-large',
        title               : 'Customer Docs.',
        dropdownMenus       : [
          {
            keyword     : 'return',
            route       : '/returntrak/documents/return',
            title       : 'Returned Items',
          },
         /* {
            keyword     : 'reference',
            route       : '/returntrak/documents/reference',
            title       : 'Resources',
          },*/
        ]
      }
    ]
  },

  /* ANALYTICS */

  analytics : {
    searchBox           : 'order',
    menus : [
      {
        keyword             : 'analytics-domestic',
        sectionTitleBefore  : 'PROFILES',
        iconClassName       : 'fa fa-map-marker bold',
        title               : 'Domestic',
        route               : '/analytics/profiles/domestic',
      },
      {
        keyword             : 'analytics-international',
        iconClassName       : 'fa fa-globe bold',
        title               : 'International',
        route               : '/analytics/profiles/international',
      },
      {
        keyword             : 'analytics-time',
        iconClassName       : 'fa fa-calendar bold',
        title               : 'By Time',
        route               : '/analytics/profiles/time',
      },
      {
        keyword             : 'analytics-item',
        iconClassName       : 'fa fa-tag bold',
        title               : 'By Item',
        route               : '/analytics/profiles/item',
      },
      {
        keyword             : 'analytics-customer',
        iconClassName       : 'fa fa-building bold',
        title               : 'By Customer',
        route               : '/analytics/profiles/customer',
      },
      {
        keyword             : 'analytics-shipservice',
        iconClassName       : 'fa fa-truck bold',
        title               : 'By Ship Service',
        route               : '/analytics/profiles/shipservice',
      },
      {
        keyword             : 'analytics-channel',
        iconClassName       : 'fa fa-cloud bold',
        title               : 'By Channel',
        route               : '/analytics/profiles/channel',
      },
      {
        keyword             : 'analytics-incident-reports',
        sectionTitleBefore  : 'Quality',
        iconClassName       : 'fa fa-bolt bold',
        title               : 'Incident Reports',
        route               : '/analytics/slas/incident-reports',
      },
      {
        keyword             : 'analytics-shipment-times',
        sectionTitleBefore  : 'SLAs',
        iconClassName       : 'fa fa-clock-o bold',
        title               : 'Shipment Times',
        route               : '/analytics/slas/shipment-times',
      },
      {
        keyword             : 'analytics-rma-times',
        iconClassName       : 'fa fa-clock-o bold',
        title               : 'RMA Receive Times',
        route               : '/analytics/slas/rma-receive-times',
      },
      {
        keyword             : 'by-delivery-times',
        iconClassName       : 'fa fa-calendar-check-o bold',
        title               : 'Delivery Times',
        route               : '/analytics/deliverytimes',
      },
      {
        keyword             : 'analytics-cycle',
        iconClassName       : 'fa fa-bar-chart-o bold',
        title               : 'Cycle Count',
        route               : '/analytics/slas/cyclecount',
      },
      {
        keyword             : 'planning-replenishment',
        sectionTitleBefore  : 'PLANNING',
        iconClassName       : 'icon-calendar',
        title               : 'Replenishment',
        route               : '/analytics/planning/replenishment',
      },
      {
        keyword             : 'planning-slow-moving',
        iconClassName       : 'icon-calendar',
        title               : 'Slow Moving',
        route               : '/analytics/planning/slowmoving',
      },
      {
        keyword             : 'scheduled_reports',
        iconClassName       : 'fa fa-calendar',
        sectionTitleBefore  : 'REPORTS',
        title               : 'Scheduled Reports',
        route               : '/analytics/scheduler'
      },
      {
        keyword             : 'standard_reports',
        iconClassName       : 'fa fa-th-large',
        title               : 'Standard Reports',
        route               : '/analytics/scheduler/reports'
      },
      {
        keyword             : 'custom_reports',
        iconClassName       : 'fa fa-th',
        title               : 'Custom Reports',
        route               : '/analytics/scheduler/customreports'
      },
    ]
  },

  /* EDI */

  edi : {
    searchBox           : 'order',
    menus : [
      {
        keyword             : 'edi_overview',
        iconClassName       : 'icon-home',
        title               : 'Overview',
        route               : '/edi/overview'
      },
      // {
      //   keyword             : 'edi_form',
      //   iconClassName       : 'icon-pencil',
      //   title               : 'EDI Form',
      //   route               : '/edi/form'
      // },
      {
        keyword             : 'ediDocuments',
        sectionTitleBefore  : 'DOCUMENTS',
        iconClassName       : 'fa fa-th-large',
        title               : 'EDI Documents',
        isDropdownOpenDefault: true,
        dropdownMenus       : [
          {
            keyword         : 'ordersToResolve',
            route           : '/edi/documents/orders-to-resolve',
            title           : 'Orders to Resolve',
            badge           : '/edi/documents/orders-to-resolve',
            badgeClassName  : 'badge badge-danger',
          },
          {
            keyword         : 'ordersToApprove',
            route           : '/edi/documents/orders-to-approve',
            title           : 'Orders to Approve',
            badge           : '/edi/documents/orders-to-approve',
            badgeClassName  : 'badge bg-yellow-gold',
          },
          {
            keyword     : 'ordersToShip',
            route       : '/edi/documents/orders-to-ship',
            title       : 'Orders to Ship',
            badge           : '/edi/documents/orders-to-ship',
            badgeClassName  : 'badge badge-info',
          },
          {
            keyword     : 'orderHistory',
            route       : '/edi/documents/order-history',
            title       : 'Order History (<span class="edi-doc-sidemenu">850</span>)'
          },
          {
            keyword     : 'asn',
            route       : '/edi/documents/asn-856',
            title       : 'ASN (<span class="edi-doc-sidemenu">856</span>)'
          },
          {
            keyword     : 'invoice',
            route       : '/edi/documents/invoice-810',
            title       : 'Invoice (<span class="edi-doc-sidemenu">810</span>)'
          },
          {
            keyword     : 'remittance',
            route       : '/edi/documents/remittance-820',
            title       : 'Remittance (<span class="edi-doc-sidemenu">820</span>)'
          },
          {
            keyword     : 'productActivity',
            route       : '/edi/documents/product-activity-852',
            title       : 'Product Activity (<span class="edi-doc-sidemenu">852</span>)'
          },
          {
            keyword     : 'planningSchedule',
            route       : '/edi/documents/planning-schedule-830',
            title       : 'Planning Schedule (<span class="edi-doc-sidemenu">830</span>)'
          },
        ]
      },
      {
        keyword             : 'tradingPartners',
        sectionTitleBefore  : 'TRADING PARTNERS',
        iconClassName       : 'fa fa-industry',
        title               : 'Trading Partners',
        isDropdownOpenDefault: false,
        dropdownMenus       : [
          {
            keyword     : 'tpActivity',
            route       : '/edi/trading-partners/tp-activity',
            title       : 'TP Activity'
          },
          {
            keyword     : 'tpItems',
            route       : '/edi/trading-partners/tp-items',
            title       : 'TP Items'
          },
          {
            keyword     : 'tpAddresses',
            route       : '/edi/trading-partners/tp-addresses',
            title       : 'TP Addresses'
          },
          {
            keyword     : 'tpDShipMethods',
            route       : '/edi/trading-partners/tp-d-ship-methods',
            title       : 'TP D. Ship Methods'
          },
          {
            keyword     : 'tpStatus',
            route       : '/edi/trading-partners/tp-status',
            title       : 'TP Status'
          },
          {
            keyword     : 'basicProfile',
            route       : '/edi/trading-partners/basic-profile',
            title       : 'Basic Profile'
          },
          {
            keyword     : 'invoicingProfile',
            route       : '/edi/trading-partners/invoicing-profile',
            title       : 'Invoicing Profile'
          },
          {
            keyword     : 'dclPartners',
            route       : '/edi/trading-partners/dcl-partners',
            title       : 'DCL Partners'
          },
        ]
      },
      {
        keyword             : 'extShipments',
        sectionTitleBefore  : 'EXT. SHIPMENTS',
        iconClassName       : 'fa fa-truck',
        title               : 'Ext. Shipments',
        isDropdownOpenDefault: false,
        dropdownMenus       : [
          {
            keyword     : 'shipmentEntry',
            route       : '/edi/ext-shipments/shipment-entry',
            title       : 'Shipment Entry'
          },
          {
            keyword     : 'drafts',
            route       : '/edi/ext-shipments/drafts',
            title       : 'Drafts'
          }
        ]
      }
    ]
  },

/* DOCUMENTS */

  documents : {
    menus         : [
      {
        keyword             : 'document_submission',
        iconClassName       : 'fa fa-cloud-upload',
        sectionTitleBefore  : 'DOCUMENTS',
        title               : 'Document Submission',
        route               : '/documents'
      },
      {
        keyword             : 'customer_docs',
        iconClassName       : 'fa fa-th-large',
        title               : 'Customer Docs.',
        isDropdownOpenDefault: true,
        dropdownMenus       : [
          {
            keyword     : 'approvals',
            route       : '/documents/general/approvals',
            title       : 'Approvals',
          },
          {
            keyword     : 'assembly',
            route       : '/documents/general/assembly',
            title       : 'Assembly',
          },
          {
            keyword     : 'bill',
            route       : '/documents/general/bill',
            title       : 'Bill Of Ladings',
          },
          {
            keyword     : 'dangerousgoods',
            route       : '/documents/general/dangerousgoods',
            title       : 'DG Data',
          },
          {
            keyword     : 'general',
            route       : '/documents/general/general',
            title       : 'General Documents',
          },
          {
            keyword     : 'label',
            route       : '/documents/general/labels',
            title       : 'Items and Labels',
          },
          {
            keyword     : 'consigned',
            route       : '/documents/general/consigned',
            title       : 'Material Receipts',
          },
          {
            keyword     : 'purchase',
            route       : '/documents/general/purchase',
            title       : 'Purchase Orders',
          },
          {
            keyword     : 'etags',
            route       : '/documents/general/etags',
            title       : 'Return eTags',
          },
          {
            keyword     : 'return',
            route       : '/documents/general/return',
            title       : 'Returned Items',
          },
          {
            keyword     : 'routing',
            route       : '/documents/general/routing',
            title       : 'Routing Instructions',
          },
          {
            keyword     : 'serial',
            route       : '/documents/general/serial',
            title       : 'Serial Numbers',
          }
        ]
      },


      {
        keyword             : 'special_docs',
        iconClassName       : 'fa fa-briefcase',
        title               : 'Special Docs.',
        isDropdownOpenDefault: true,
        dropdownMenus       : [
          {
            keyword     : 'inc_po',
            route       : '/special-docs/token-incoming-po',
            title       : 'Token Incoming PO',
          },
          {
            keyword     : 'incoming_sn',
            route       : '/special-docs/token-incoming-sn',
            title       : 'Token Incoming SN',
          },
          {
            keyword     : 'sn_binding',
            route       : '/special-docs/token-sn-binding',
            title       : 'Token SN Binding',
          },
          {
            keyword     : 'sn_unbinding',
            route       : '/special-docs/token-sn-unbinding',
            title       : 'Token SN Unbinding',
          },
          {
            keyword     : 'count_info',
            route       : '/special-docs/token-cycle-count-info',
            title       : 'Token Cycle Count Info',
          }
        ]
      },

      {
        keyword             : 'ftp_folders',
        iconClassName       : 'fa fa-cloud',
        title               : 'FTP Folders',
        isDropdownOpenDefault: true,
        dropdownMenus       : [
          {
            keyword     : 'send',
            route       : '/ftp-folders/send',
            title       : 'Send',
          },
          {
            keyword     : 'get',
            route       : '/ftp-folders/get',
            title       : 'Get',
          }
        ]
      },

      /*{
        keyword             : 'reference',
        iconClassName       : 'fa fa-university',
        title               : 'Resources',
        route               : '/documents/reference'
      }*/
    ]
  },

  /* ADMINISTRATION TASKS */
  administration_tasks : {
    menus         : [
      {
        keyword             : 'accounts',
        iconClassName       : 'fa fa-user-plus',
        sectionTitleBefore  : 'SETTINGS',
        title               : 'Users',
        route               : '/services/administration-tasks/accounts'
      },
      {
        keyword             : 'orderpoints_settings',
        iconClassName       : 'fa fa-gear',
        title               : 'OrderPoints Settings',
        route               : '/services/administration-tasks/orderpoints-settings'
      },
      {
        keyword             : 'returntrak_settings',
        iconClassName       : 'fa fa-gear',
        title               : 'ReturnTrak Settings',
        route               : '/services/administration-tasks/returntrak-settings'
      },
      {
        keyword             : 'special_settings',
        iconClassName       : 'fa fa-gear',
        title               : 'Special Settings',
        route               : '/services/administration-tasks/special-settings'
      },
      {
        keyword : 'email_notif',
        iconClassName : 'fa fa-envelope',
        title : 'Email Notifications',
        isDropdownOpenDefault: true,
        dropdownMenus       : [
          {
            keyword     : 'ship-confirmation',
            route       : '/services/administration-tasks/email-notifications/ship-confirmation',
            title       : 'Ship Confirmation',
          },
          {
            keyword     : 'order_rec',
            route       : '/services/administration-tasks/email-notifications/order-receipt',
            title       : 'Order Receipt',
          },
          {
            keyword     : 'po_rec',
            route       : '/services/administration-tasks/email-notifications/po-receipt',
            title       : 'PO Receipt',
          },
          {
            keyword     : 'rma_rec',
            route       : '/services/administration-tasks/email-notifications/rma-receipt',
            title       : 'RMA Receipt',
          },
          {
            keyword     : 'unplanned_rec',
            route       : '/services/administration-tasks/email-notifications/unplanned-receipt',
            title       : 'Un-planned Receipt',
          }
        ]
      },
      {
        keyword             : 'invoices',
        iconClassName       : 'icon-share',
        title               : 'Invoices',
        sectionTitleBefore  : 'INVOICES',
        dropdownMenus       : [
          {
            keyword     : 'open',
            route       : '/services/administration-tasks/invoices/open',
            title       : 'Open',
          },
          {
            keyword     : 'all',
            route       : '/services/administration-tasks/invoices/all',
            title       : 'All',
          },
          {
            keyword     : 'freight-charges',
            route       : '/services/administration-tasks/invoices/freight-charges',
            title       : 'Freight Charges',
          },
          {
            keyword     : 'rate-cards',
            route       : '/services/administration-tasks/invoices/rate-cards',
            title       : 'Rate Cards',
          },
        ]
      },
    ]
  }
}

export default sidebarConfig
