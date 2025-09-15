const formatOrderId = (order_id: number | string | undefined, is_template: boolean, total_digits_after_letter: number = 4): string => {
  if (typeof order_id === 'undefined' || order_id === null || order_id === '') return ''

  total_digits_after_letter = +total_digits_after_letter
  let prefix = is_template ? 'T' : 'D'
  let suffix = ''
  const orderIdStr = String(order_id)
  
  if (orderIdStr.length < total_digits_after_letter) {
    suffix = '0'.repeat(total_digits_after_letter - orderIdStr.length)
  }
  
  return prefix + suffix + orderIdStr
}

export default formatOrderId
