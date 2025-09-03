const keywordsTableConfig = {
	orderLevel : [
		{ keyword : '[ORDER_NUMBER]', desc : 'Order number'},
		{ keyword : '[PO_NUMBER]', desc : 'PO number'},
		{ keyword : '[ORDER_DATE]', desc : 'Order date'},
		{ keyword : '[SHIPPING_CARRIER]', desc : 'Shipping carrier (ex: UPS)'},
		{ keyword : '[SHIPPING_SERVICE]', desc : 'Shipping service (ex: GROUND)'},
		{ keyword : '[TOTAL_WEIGHT]', desc : 'Total weight (in lb)'},
		{ keyword : '[TOTAL_PACKAGES]', desc : 'Total packages shipped'},
		{ keyword : '[SHIP_DATE]', desc : 'Ship date (date only)'},
		{ keyword : '[TRACKING_NUMBER_ONLY]', desc : 'Tracking number with no link'},
		{ keyword : '[TRACKING_NUMBER]', desc : 'Tracking number link (with tracking # as text)'},
		{ keyword : '[TRACKING_NUMBER_LINK]', desc : 'Tracking number link (with link as text)'},
		{ keyword : '[COMPANY]', desc : 'Consignee company name'},
		{ keyword : '[ATTENTION]', desc : 'Consignee attention name'},
		{ keyword : '[NAME]', desc : 'Consignee attention name or company if empty'},
		{ keyword : '[FIRST_NAME]', desc : 'Consignee first name (first word)'},
		{ keyword : '[ADDRESS1]', desc : 'Consignee address 1'},
		{ keyword : '[ADDRESS2]', desc : 'Consignee address 2'},
		{ keyword : '[CITY]', desc : 'Consignee city'},
		{ keyword : '[STATE]', desc : 'Consignee state'},
		{ keyword : '[POSTAL_CODE]', desc : 'Consignee postal code'},
		{ keyword : '[COUNTRY]', desc : 'Consignee country'},
		{ keyword : '[EMAIL]', desc : 'Consignee email'},
	],
	lineLevel : [
		{ keyword : '[DCL_LINE_NO]', desc : 'DCL line number'},
		{ keyword : '[LINE_NO]', desc : 'Customer line number'},
		{ keyword : '[QTY_ORDERED]', desc : 'Quantity ordered'},
		{ keyword : '[QTY_SHIPPED]', desc : 'Quantity shipped'},
		{ keyword : '[ITEM_NUMBER]', desc : 'Item number'},
		{ keyword : '[ITEM_DESCRIPTION]', desc : 'Item description'},
	]
}

export default keywordsTableConfig
