import React from 'react'
import { Link } from 'react-router-dom'
import FilterLink from '../../_Shared/FilterLink'
import {getUserData } from '../../../util/storageHelperFuncs'
import { formatNumber } from '../../_Helpers/FormatNumber'

const InnerContent = props => {
  function handleFulfillmentsTableBody (arrFulfillments) {
    let { dont_show_zero_qty } = props
    
    let k = 0
    let items= []
    let totals = {
      back_orders:0,
      ff_hold:0,
      in_process:0,
      orders_today:0,
      total_open_orders:0,
      total_open_qty:0,
      shipped_today:0,
      ship_today_units:0,
      shipped_others:0,
      shipped_units_others:0,
      open_rmas:0
    }
    let receivedTodayFilterObj = { field : 'received_date', oper : '=', value : '0D' }
    let shippedTodayFilterObj = { field : 'shipped_date', oper : '=', value : '0D' }
    let visibleAppIds = getUserData('apps') || []
    for (let account of arrFulfillments) {
      let {
        account_number,
        group,
        region,
        orders_today,
        back_orders,
        batches_today,
        ff_hold,
        total_open_orders,
        total_open_qty,
        shipped_today,
        ship_today_units,
        open_rmas,
        pre_release,
        ready_to_print,
        ready_to_release,
        ready_to_ship,
        shipped_others,
        shipped_units_others
      } = account

      totals.orders_today += orders_today
      totals.back_orders += back_orders
      totals.ff_hold += ff_hold
      totals.total_open_orders += total_open_orders
      totals.total_open_qty += total_open_qty
      totals.shipped_today += shipped_today
      totals.ship_today_units += ship_today_units
      totals.open_rmas += open_rmas
      totals.in_process += pre_release + ready_to_print + ready_to_release + ready_to_ship
      totals.shipped_others += shipped_others
      totals.shipped_units_others += shipped_units_others

      let locationFilterObj = { field : 'location', oper : '=', value : region },
          accountFilterObj = { field : 'account_number', oper : '=', value : account_number };
      
      let add_row_to_jsx_array = true

      if( dont_show_zero_qty ){
        add_row_to_jsx_array = +batches_today + +orders_today +  +pre_release +  +ready_to_print +  +back_orders +  +ff_hold +  +ready_to_release +  +ready_to_ship +  +total_open_orders +total_open_qty +shipped_today +ship_today_units +shipped_others +shipped_units_others > 0
      }

      items[k] =  add_row_to_jsx_array ? (
        <tr key={k}>
          <td className="bold"> {account_number} </td>
          <td className="bold text-center"> {group} </td>
          <td className="bold text-center"> {region} </td>
          <td className="text-center">
            {
              visibleAppIds.includes(11) ?
              <FilterLink
                to="/orders/all"
                filters={{
                  received_date : [ receivedTodayFilterObj ],
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( orders_today, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( orders_today, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(14) ?
              <FilterLink
                to="/orders/backorders"
                filters={{
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( back_orders, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( back_orders, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(13) ?
              <FilterLink
                to="/orders/onhold"
                filters={{
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( ff_hold, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( ff_hold, 0)}</span>
            }
          </td>
          <td className="text-center">
              <span className="bold">{formatNumber( pre_release + ready_to_print + ready_to_release + ready_to_ship, 0)}</span>
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(5) ?
              <FilterLink
                to="/orders/open"
                filters={{
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( total_open_orders, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( total_open_orders, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(5) ?
              <FilterLink
                to="/order-lines/open"
                filters={{
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( total_open_qty, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( total_open_qty, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(9) ?
              <FilterLink
                to="/orders/shipped"
                filters={{
                  shipped_date : [ shippedTodayFilterObj ],
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( shipped_today , 0 )}
              </FilterLink>
              :
              <span className="bold">{formatNumber( shipped_today, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(9) ?
              <FilterLink
                to="/order-lines/shipped"
                filters={{
                  shipped_date : [ shippedTodayFilterObj ],
                  account_number : [accountFilterObj],
                  location : [locationFilterObj]
                }}
                className="primary-link"
              >
              {formatNumber( ship_today_units, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( ship_today_units, 0)}</span>
            }
          </td>
          <td className="text-center">
              <span className="bold">{formatNumber( shipped_others, 0)}</span>
          </td>
          <td className="text-center">
              <span className="bold">{formatNumber( shipped_units_others, 0)}</span>
          </td>
        </tr>
      ) 
      : null;
      k++;
    }



    if( arrFulfillments.length > 1 ) {
      
      items.push((
        <tr key="total_orders" className="summary">
          <td className="bold"></td>
          <td className="bold text-center"></td>
          <td className="bold text-center"></td>
          <td className="text-center">
            {
              visibleAppIds.includes(11) ?
              <FilterLink
                to="/orders/all"
                filters={{ received_date : [ receivedTodayFilterObj ] }}
                className="primary-link"
              >
              {formatNumber( totals.orders_today, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( totals.orders_today, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(14) ?
              <Link to="/orders/backorders"
                  className="primary-link">{formatNumber( totals.back_orders, 0)}
              </Link>
              :
              <span className="bold">{formatNumber( totals.back_orders, 0)}</span>
            }
            
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(13) ?
              <Link to="/orders/onhold"
                    className="primary-link">{formatNumber( totals.ff_hold, 0)}
              </Link>
              :
              <span className="bold">{formatNumber( totals.ff_hold, 0)}</span>
            }
          </td>
          <td className="text-center">
            <span className="bold">{formatNumber( totals.in_process, 0)}</span>
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(5) ?
              <Link to="/orders/open" className="primary-link">
                {formatNumber( totals.total_open_orders, 0)}
              </Link>
              :
              <span className="bold">{formatNumber( totals.total_open_orders, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(5) ?
              <Link to="/order-lines/open" className="primary-link">
                {formatNumber( totals.total_open_qty, 0) }
              </Link>
              :
              <span className="bold">{formatNumber( totals.total_open_qty, 0)}</span>
            }
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(9) ?
              <FilterLink
                to="/orders/shipped"
                filters={{ shipped_date : [ shippedTodayFilterObj ] }}
                className="primary-link"
              >
              {formatNumber( totals.shipped_today, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( totals.shipped_today, 0)}</span>
            }
              
          </td>
          <td className="text-center">
            {
              visibleAppIds.includes(9) ?
              <FilterLink
                to="/order-lines/shipped"
                filters={{ shipped_date : [ shippedTodayFilterObj ] }}
                className="primary-link"
              >
              {formatNumber( totals.ship_today_units, 0)}
              </FilterLink>
              :
              <span className="bold">{formatNumber( totals.ship_today_units, 0)}</span>
            }
              
          </td>
          <td className="text-center">
            <span className="bold">{formatNumber( totals.shipped_others, 0)}</span>
          </td>
          <td className="text-center">
            <span className="bold">{formatNumber( totals.shipped_units_others, 0)}</span>
          </td>
        </tr>
      ))
    }

    return items;
  }


  let { fulfillments = [] } = props
  return (
    <div id="fullfillment_data">
      <div className="table-scrollable table-scrollable-borderless">
        <table className="table table-hover table-light">
          <thead>
            <tr className="uppercase tb-header-1">
              <th> ACCOUNT # </th>
              <th className="text-center"> GROUP </th>
              <th className="text-center"> WAREHOUSE </th>
              <th className="text-center"> ORDERS TODAY</th>
              <th className="text-center"> BACK ORDERS </th>
              <th className="text-center"> HOLD </th>
              <th className="text-center"> IN PROCESS </th>
              <th className="text-center"> TOTAL OPEN </th>
              <th className="text-center"> TOTAL OPEN UNITS</th>
              <th className="text-center"> SHIPPED TODAY</th>
              <th className="text-center"> SHIPPED TODAY UNITS</th>
              <th className="text-center"> OTHERS </th>
              <th className="text-center"> OTHERS UNITS </th>
            </tr>
          </thead>
          {
            fulfillments.length > 0 &&
            <tbody>
              { handleFulfillmentsTableBody(fulfillments) }
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}

export default InnerContent