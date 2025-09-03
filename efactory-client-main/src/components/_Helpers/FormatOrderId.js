const formatOrderId = ( order_id, is_template, total_digits_after_letter = 4 ) => {
    if (typeof order_id === 'undefined') return ''

    total_digits_after_letter = +total_digits_after_letter
    let prefix = is_template ? 'T' : 'D'
    let suffix = ''
    if(String(order_id).length < total_digits_after_letter){
    	suffix = '0'.repeat( total_digits_after_letter - String(order_id).length )
    }
    return prefix + suffix + order_id
}

export default formatOrderId
