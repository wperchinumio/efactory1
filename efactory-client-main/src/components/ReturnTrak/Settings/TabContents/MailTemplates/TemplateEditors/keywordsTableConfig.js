const keywordsTableConfig = {
	issue : [
		{ keyword : '[RMA_NUMBER]', desc : 'RMA number'},
		{ keyword : '[RMA_DATE]', desc : 'RMA creation date only'},
		{ keyword : '[ORIGINAL_ORDER]', desc : 'Original order #'},
		{ keyword : '[ATTENTION]', desc : 'Attention name'},
		{ keyword : '[COMPANY]', desc : 'Company name'},
		{ keyword : '[NAME]', desc : 'Attention name or company if empty'},
		{ keyword : '[FIRST_NAME]', desc : 'First name (first word)'},
		{ keyword : '[EMAIL]', desc : 'Email address'},
		{ keyword : '[CUSTOMER_NUMBER]', desc : 'Customer #'},
		{ keyword : '[ADDRESS1]', desc : 'Address 1'},
		{ keyword : '[ADDRESS2]', desc : 'Address 2'},
		{ keyword : '[CITY]', desc : 'City'},
		{ keyword : '[STATE]', desc : 'State'},
		{ keyword : '[POSTAL_CODE]', desc : 'Postal code'},
		{ keyword : '[COUNTRY]', desc : 'Country'},
		{ keyword : '[PHONE]', desc : 'Phone'},
		{ keyword : '[COMMENTS]', desc : 'Comments'},
		{ keyword : '[CUSTOM_FIELDX]', desc : 'Custom field X (X from 1 to 7)'},
		{ keyword : '[ITEMS]', desc : 'Authorized items list'},
		{ keyword : '[RETURN_LABEL_URL]', desc : 'Return Label URL (default UPS)'},
		{ keyword : '[RETURN_LABEL_URL:UPS]', desc : 'Return Label URL - UPS'},
		{ keyword : '[RETURN_LABEL_URL:USPS]', desc : 'Return Label URL - USPS'},
		{ keyword : '[WH_RECEIVING_ADDRESS]', desc : 'Receiving warehouse address'},
		{ keyword : '[WH_CONTACT_INFO]', desc : 'Contact info'}
	],
	receive : [
		{ keyword : '[RMA_NUMBER]', desc : 'RMA number'},
		{ keyword : '[NAME]', desc : 'Attention name or company if empty'},
		{ keyword : '[FIRST_NAME]', desc : 'First name (first word)'},
		{ keyword : '[CUSTOM_FIELDX]', desc : 'Custom field X (X from 1 to 7)'},
    { keyword : '[WH_CONTACT_INFO]', desc : 'Contact info'}
	],
	ship : [
		{ keyword : '[ORDER_NUMBER]', desc : 'Order number'},
		{ keyword : '[ORDER_DATE]', desc : 'Order creation date (date only)'},
		{ keyword : '[SHIPPED_DATE]', desc : 'Ship date (date only)'},
		{ keyword : '[SHIPMENT_CARRIER]', desc : 'Carrier name'},
		{ keyword : '[TRACKING_NUMBER_ONLY]', desc : 'Tracking number with no link'},
		{ keyword : '[TRACKING_NUMBER]', desc : 'Tracking number link (with tracking # as text)'},
		{ keyword : '[TRACKING_NUMBER_LINK]', desc : 'Tracking number link (with link as text)'},
		{ keyword : '[NAME]', desc : 'Attention name or company if empty'},
		{ keyword : '[FIRST_NAME]', desc : 'First name (first word)'},
		{ keyword : '[ADDRESS1]', desc : 'Address 1'},
		{ keyword : '[ADDRESS2]', desc : 'Address 2'},
		{ keyword : '[CITY]', desc : 'City'},
		{ keyword : '[STATE]', desc : 'State'},
		{ keyword : '[POSTAL_CODE]', desc : 'Postal code'},
		{ keyword : '[COUNTRY]', desc : 'Country'},
		{ keyword : '[EMAIL]', desc : 'Email'},
		{ keyword : '[ITEMS]', desc : 'Shipped items list'},
    { keyword : '[WH_CONTACT_INFO]', desc : 'Contact info'}
	],
  cancel : [
    { keyword : '[RMA_NUMBER]', desc : 'RMA number'},
    { keyword : '[RMA_DATE]', desc : 'RMA creation date only'},
    { keyword : '[ATTENTION]', desc : 'Attention name'},
    { keyword : '[COMPANY]', desc : 'Company name'},
    { keyword : '[NAME]', desc : 'Attention name or company if empty'},
    { keyword : '[FIRST_NAME]', desc : 'First name (first word)'},
    { keyword : '[EMAIL]', desc : 'Email address'},
    { keyword : '[CUSTOMER_NUMBER]', desc : 'Customer #'},
    { keyword : '[WH_CONTACT_INFO]', desc : 'Contact info'}
  ]
}

export default keywordsTableConfig
