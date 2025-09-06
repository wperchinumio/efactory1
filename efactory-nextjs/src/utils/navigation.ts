// Route to app ID mapping based on legacy configuration
const routeAppIdsTable = {
  '/overview': 1,
  '/overview/customize-view': 1,
  '/announcements': 2,
  '/overview/notes': 3,

  '/orders/open': 5,
  '/orders/onhold': 6,
  '/orders/backorders': 7,
  '/orders/prerelease': 8,
  '/orders/shipped': 9,
  '/orders/canceled': 10,
  '/orders/all': 11,

  '/order-lines/open': 12,
  '/order-lines/onhold': 13,
  '/order-lines/backorders': 14,
  '/order-lines/prerelease': 15,
  '/order-lines/shipped': 16,
  '/order-lines/canceled': 17,
  '/order-lines/all': 18,

  '/order-items/backlog': 19,
  '/order-items/shipped': 20,
  '/order-items/all': 61,

  '/detail/freight': 21,
  '/detail/package': 22,
  '/detail/serial': 23,

  '/analytics/profiles/domestic': 42,
  '/analytics/profiles/international': 43,
  '/analytics/slas/shipment-times': 46,
  '/analytics/slas/rma-receive-times': 63,
  '/analytics/slas/cyclecount': 70,
  '/analytics/slas/incident-reports': 208,
  '/analytics/planning/replenishment': 44,
  '/analytics/planning/slowmoving': 45,
  '/analytics/scheduler': 64,
  '/analytics/scheduler/reports': 35,
  '/analytics/scheduler/customreports': 71,

  '/analytics/profiles/time': 201,
  '/analytics/profiles/customer': 202,
  '/analytics/profiles/item': 203,
  '/analytics/profiles/shipservice': 204,
  '/analytics/profiles/channel': 205,
  '/analytics/deliverytimes': 211,

  '/transportation/analyzer': 207,
  '/transportation/time': 209,
  '/transportation/service': 210,

  '/transportation/packages/shipping-detail': 212,
  '/transportation/packages/cost-estimator': 213,

  '/orders/documents/bill': 72,
  '/orders/documents/etags': 72,
  '/orders/documents/routing': 72,
  '/orders/documents/reference': 72,

  '/inventory/items/status': 26,
  '/inventory/items/receiving': 27,
  '/inventory/items/onhold': 28,
  '/inventory/items/transactions': 29,
  '/inventory/items/lotmaster': 31,
  '/inventory/items/asofadate': 32,
  '/inventory/items/trsummary': 33,
  '/inventory/items/cyclecount': 34,
  '/inventory/items/dg-data': 39,
  '/inventory/items/bundle': 206,

  '/inventory/receipts/po-notifications': 36,
  '/inventory/receipts/po-receipt': 37,
  '/inventory/receipts/rma-receipt': 38,

  '/inventory/assembly': 40,
  '/inventory/returns': 41,

  '/inventory/documents': 73,
  '/inventory/documents/assembly': 73,
  '/inventory/documents/labels': 73,
  '/inventory/documents/consigned': 73,
  '/inventory/documents/return': 73,
  '/inventory/documents/serial': 73,
  '/inventory/documents/reference': 73,

  '/orderpoints': 47,
  '/orderpoints/new-order': 47,
  '/orderpoints/drafts': 48,
  '/orderpoints/addressbook': 49,
  '/orderpoints/massupload': 50,
  '/orderpoints/ftp-batches': 76,
  '/orderpoints/shippingcost': 51,
  '/orderpoints/documents/reference': 74,
  '/orderpoints/documents/ftp-folders-send': 74,
  '/orderpoints/documents/ftp-folders-get': 74,
  '/orderpoints/help/1': 53,
  '/orderpoints/help/2': 53,
  '/orderpoints/help/3': 53,
  '/orderpoints/help/4': 53,
  '/orderpoints/help/5': 53,

  '/returntrak': 55,
  '/returntrak/drafts': 56,
  '/returntrak/shipped-orders': 54,
  '/returntrak/rmas/open': 57,
  '/returntrak/rmas/all': 58,
  '/returntrak/rmas/items': 59,

  '/returntrak/documents': 75,
  '/returntrak/documents/return': 75,
  '/returntrak/documents/reference': 75,

  '/edi/overview': 52,
  '/edi/overview/customize-view': 52,
  '/edi/form': 99991, // HIDDEN
  '/edi/documents/orders-to-resolve': 82,
  '/edi/documents/orders-to-approve': 83,
  '/edi/documents/orders-to-ship': 84,
  '/edi/documents/order-history': 85,
  '/edi/documents/asn-856': 86,
  '/edi/documents/invoice-810': 87,
  '/edi/documents/remittance-820': 88,
  '/edi/documents/product-activity-852': 89,
  '/edi/documents/planning-schedule-830': 90,
  '/edi/trading-partners/tp-activity': 91,
  '/edi/trading-partners/tp-items': 92,
  '/edi/trading-partners/tp-addresses': 93,
  '/edi/trading-partners/tp-d-ship-methods': 94,
  '/edi/trading-partners/tp-status': 95,
  '/edi/trading-partners/basic-profile': 96,
  '/edi/trading-partners/invoicing-profile': 97,
  '/edi/trading-partners/dcl-partners': 98,
  '/edi/ext-shipments/shipment-entry': 99,
  '/edi/ext-shipments/drafts': 100,

  '/documents': 62,
  '/documents/general/approvals': 62,
  '/documents/general/assembly': 62,
  '/documents/general/bill': 62,
  '/documents/general/consigned': 62,
  '/documents/general/dangerousgoods': 62,
  '/documents/general/general': 62,
  '/documents/general/labels': 62,
  '/documents/general/purchase': 62,
  '/documents/general/etags': 62,
  '/documents/general/return': 62,
  '/documents/general/routing': 62,
  '/documents/general/serial': 62,
  '/documents/reference': 62,

  '/special-docs/token-incoming-po': 62,
  '/special-docs/token-incoming-sn': 62,
  '/special-docs/token-sn-binding': 62,
  '/special-docs/token-sn-unbinding': 62,
  '/special-docs/token-cycle-count-info': 62,

  '/ftp-folders/send': 62,
  '/ftp-folders/get': 62,

  // Services top-level sections
  '/services/communications': 77,
  '/services/documents': 62,
  '/services/setup': 65,
  '/services/administration-tasks': 67,

  '/services/administration-tasks/accounts': 67,
  '/services/administration-tasks/orderpoints-settings': 65,
  '/services/administration-tasks/returntrak-settings': 66,
  '/services/administration-tasks/special-settings': 99992,

  '/services/administration-tasks/email-notifications/ship-confirmation': 77,
  '/services/administration-tasks/email-notifications/order-receipt': 78,
  '/services/administration-tasks/email-notifications/po-receipt': 79,
  '/services/administration-tasks/email-notifications/rma-receipt': 80,
  '/services/administration-tasks/email-notifications/unplanned-receipt': 81,

  '/services/administration-tasks/invoices/open': 68,
  '/services/administration-tasks/invoices/all': 69,
  '/services/administration-tasks/invoices/freight-charges': 214,
  '/services/administration-tasks/invoices/rate-cards': 214,
};

/**
 * Get the app ID for a given pathname
 * @param pathname - The current pathname
 * @returns The app ID or null if not found
 */
export const getAppIdForPathname = (pathname: string): number | null => {
  // Remove query string
  const cleanPathname = pathname.replace(/\?.+/, '');
  
	// Check for exact match first
	if (cleanPathname in routeAppIdsTable) {
		return (routeAppIdsTable as any)[cleanPathname];
	}
  
	// Check for view routes (e.g., /orders/view/123 -> /orders)
	if (cleanPathname.includes('/view/')) {
		const basePath = cleanPathname.substring(0, cleanPathname.indexOf('/view/'));
		if (basePath in routeAppIdsTable) {
			return (routeAppIdsTable as any)[basePath];
		}
	}
  
	// Check for manage-filters routes
	if (cleanPathname.includes('/manage-filters')) {
		const basePath = cleanPathname.substring(0, cleanPathname.indexOf('/manage-filters'));
		if (basePath in routeAppIdsTable) {
			return (routeAppIdsTable as any)[basePath];
		}
	}
  
  return null;
};

/**
 * Check if a user has access to a specific pathname
 * @param pathname - The pathname to check
 * @param userApps - Array of app IDs the user has access to
 * @returns True if user has access, false otherwise
 */
export const hasAccessToPathname = (pathname: string, userApps: number[]): boolean => {
  const appId = getAppIdForPathname(pathname);
  if (!appId) return false;
  
  return userApps.includes(appId);
};

/**
 * Get the default route for a user based on their app permissions
 * @param userApps - Array of app IDs the user has access to
 * @returns The default route path
 */
export const getDefaultRoute = (userApps: number[]): string => {
  // Order of preference for default routes (based on legacy orderOfAppIds)
  const defaultRoutes = [
    '/overview',
    '/orders/open',
    '/inventory/items/status',
    '/orderpoints',
    '/returntrak',
    '/edi/overview',
    '/analytics/profiles/domestic',
    '/transportation/time',
    '/documents'
  ];
  
  // Find the first route the user has access to
  for (const route of defaultRoutes) {
    if (hasAccessToPathname(route, userApps)) {
      return route;
    }
  }
  
  // Fallback to first available route
  const availableRoutes = Object.keys(routeAppIdsTable).filter(route => 
    hasAccessToPathname(route, userApps)
  );
  
  return availableRoutes[0] || '/no-apps';
};

/**
 * Get all routes a user has access to
 * @param userApps - Array of app IDs the user has access to
 * @returns Array of route paths the user can access
 */
export const getAccessibleRoutes = (userApps: number[]): string[] => {
  return Object.keys(routeAppIdsTable).filter(route => 
    hasAccessToPathname(route, userApps)
  );
};
