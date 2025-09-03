import {orderTypeClass} from '../_Helpers/OrderStatus'
export const
  dateType = () => {},
  account_number = () => {},
  order_type = orderTypeClass,
  location = () => {},
  destinationType = {},
  last30Days = 'Last 30 Days',
  quickFilter1 = {
    'received_date': {title: 'RECEIVED DATE', type: dateType},
    'ordered_date': {title: 'ORDER DATE', type: dateType},
    account_number,
      order_type,
      location,
      destinationType
  },
  quickFilter2 = {
    'shipped_date': {title: 'SHIPPED DATE', type: dateType},
    'ordered_date': {title: 'ORDER DATE', type: dateType},
    account_number,
    order_type,
    location,
    destinationType
  }

