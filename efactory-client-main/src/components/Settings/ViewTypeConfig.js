const config = {
	analytics : {
		planning : {
			replenishment : 'inventory-replenishment',
			slowmoving : 'inventory-slowmoving'
		},
	},
	orders : {
		open : 'fulfillment-open',
		onhold : 'fulfillment-onhold',
		backorders : 'fulfillment-backorders',
		risk : 'fulfillment-risk',
		shipped : 'fulfillment-shipped',
		canceled : 'fulfillment-cancelled',
		all : 'fulfillment-any'
	},
	edi : {
		documents : {
			'orders-to-resolve' : 'edi-850-to-resolve',
			'orders-to-approve' : 'edi-850-to-approve',
			'orders-to-ship'    : 'edi-850-to-ship',
			'order-history' 	: 'edi-850-history',
			'asn-856' 			: 'edi-856-asn',
			'invoice-810'       : 'edi-810-invoice',
			'remittance-820'    : 'edi-820-remittance',
			'product-activity-852': 'edi-852-product',
      		'planning-schedule-830': 'edi-830-planning',
    },
    'trading-partners': {
      'tp-activity' : 'edi-tp-activity',
			'tp-items' : 'edi-tp-items',
			'tp-addresses' : 'edi-tp-addresses',
			'tp-d-ship-methods' : 'edi-tp-d-ship-methods',
			'tp-status' : 'edi-tp-status',
			'basic-profile' : 'edi-basic-profile',
			'invoicing-profile' : 'edi-invoicing-profile',
			'dcl-partners' : 'edi-dcl-partners',
    },
  },
 	'order-lines' : {
		open : 'fulfillment-lines-open',
		onhold : 'fulfillment-lines-onhold',
		backorders : 'fulfillment-lines-backorders',
		risk : 'fulfillment-lines-risk',
		shipped : 'fulfillment-lines-shipped',
		canceled : 'fulfillment-lines-cancelled',
		all : 'fulfillment-lines-any'
	},
	'order-items' : {
		backlog : 'inventory-backlog',
		shipped : 'inventory-shipped',
		all     : 'inventory-all-items'
	},
	detail : {
		item : 'fulfillment-item',
		freight : 'fulfillment-freight',
		package : 'fulfillment-package',
		serial : 'fulfillment-serial'
	},
	inventory : {
		items : {
			status : 'inventory-status',
			//received : 'inventory-received',
			receiving : 'inventory-receiving',
			onhold : 'inventory-onhold',
			transactions : 'inventory-transactions',
			//toreceive : 'inventory-toreceive',
			lotmaster : 'inventory-lotmaster',
			asofadate : 'inventory-asofadate',
			trsummary : 'inventory-transaction-summary',
		    cyclecount : 'inventory-cyclecount',
      		'dg-data':'inventory-dangerous-goods',
      		bundle:'inventory-bundle',
		},
		planning : {
			replenishment : 'inventory-replenishment',
			slowmoving : 'inventory-slowmoving'
		},
		assembly : 'inventory-assembly',
		returns : 'inventory-returns'
	},
	invoices : {
		all : 'invoice-all',
		'freight-charges' : 'freight-charges',
	},
	returntrak : {
		'shipped-orders' : 'fulfillment-rma',
		rmas : {
			open : 'returntrak-open',
			all : 'returntrak-all',
			items : 'returntrak-items'
		}
	}
}

export default config
