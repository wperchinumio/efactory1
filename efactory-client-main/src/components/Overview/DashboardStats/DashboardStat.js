import React from 'react'
import PropTypes from 'prop-types'
import SingleValueStat from '../../_Shared/Components/SingleValueStat'
import MultipleValueStat from '../../_Shared/Components/MultipleValueStat'
import { formatNumber } from '../../_Helpers/FormatNumber'
import { getUserData } from '../../../util/storageHelperFuncs'

const DashboardStat = props => {
  function getDashboardCounterValues (fieldName) {
    let orderReceivedToday = 0,
      orderShippedToday = 0,
      backOrders = 0,
      openRMAs = 0,
      recvTodayLines = 0,
      recvTodayUnits = 0,
      shipTodayLines = 0,
      shipTodayUnits = 0,
      issuedRmas = 0,
      receivedRmas = 0,
      rmaUnitsAuth = 0,
      rmaUnitsRecv = 0,
      rmaUnitsOpen = 0,
      totalOpenOrders = 0,
      totalOpenLines = 0,
      totalOpenQty = 0,
      totalBackOrders = 0,
      totalBackLines = 0,
      backQty = 0,
      subtotalReceivedToday = 0,
      subtotalShippedToday = 0,
      subtotalOpen = 0,
      shReceivedToday = 0,
      shShippedToday = 0,
      shOpen = 0

    let {
      fulfillments
    } = props

    fulfillments.forEach( item => {
      orderReceivedToday += +item.orders_today
      orderShippedToday += +item.shipped_today
      backOrders += +item.back_orders
      openRMAs += +item.open_rmas
      recvTodayLines += +item.recv_today_lines
      recvTodayUnits += +item.recv_today_units
      shipTodayLines += +item.ship_today_lines
      shipTodayUnits += +item.ship_today_units
      issuedRmas += +item.issued_rmas_today
      receivedRmas += +item.received_rmas_today
      rmaUnitsAuth += +item.rma_units_auth
      rmaUnitsRecv += +item.rma_units_recv
      rmaUnitsOpen += +item.rma_units_open
      totalOpenOrders += +item.total_open_orders
      totalOpenLines += +item.total_open_lines
      totalOpenQty += +item.total_open_qty
      totalBackOrders += +item.total_back_orders
      totalBackLines += +item.total_back_lines
      backQty += +item.back_qty
      subtotalReceivedToday += +item.subtotal_received_today
      subtotalShippedToday += +item.subtotal_shipped_today
      subtotalOpen += +item.subtotal_open
      shReceivedToday += +item.sh_received_today
      shShippedToday += +item.sh_shipped_today
      shOpen += +item.sh_open
    } )
    return {
      orderReceivedToday,
      orderShippedToday,
      backOrders,
      openRMAs,
      recvTodayLines,
      recvTodayUnits,
      shipTodayLines,
      shipTodayUnits,
      issuedRmas,
      receivedRmas,
      rmaUnitsAuth,
      rmaUnitsRecv,
      rmaUnitsOpen,
      totalOpenOrders,
      totalOpenLines,
      totalOpenQty,
      totalBackOrders,
      totalBackLines,
      backQty,
      subtotalReceivedToday,
      subtotalShippedToday,
      subtotalOpen,
      shReceivedToday,
      shShippedToday,
      shOpen,
    }
  }

  function throwError (name) {
    console.error('DashboardStat component could not find ', name)
    return name
  }

  let {
    orderReceivedToday,
    orderShippedToday,
    backOrders,
    openRMAs,
    recvTodayLines,
    recvTodayUnits,
    shipTodayLines,
    shipTodayUnits,
    issuedRmas,
    receivedRmas,
    rmaUnitsAuth,
    rmaUnitsRecv,
    rmaUnitsOpen,
    totalOpenOrders,
    totalOpenLines,
    totalOpenQty,
    totalBackOrders,
    totalBackLines,
    backQty,
    subtotalReceivedToday,
    subtotalShippedToday,
    subtotalOpen,
    shReceivedToday,
    shShippedToday,
    shOpen,
  } = getDashboardCounterValues()

  let
    receivedToday = { field : 'received_date', oper : '=', value : '0D' },
    shippedToday = { field : 'shipped_date', oper : '=', value : '0D' },
    shippedTotalItem = { field : 'total', oper : '=', value : 'item' },

    rmaDate = { field : 'rma_date', oper : '=', value : '0D' },
    lastReceiveDate = { field : 'last_receive_date', oper : '=', value : '0D' }
  let apps = getUserData('apps') || []

  let {
    name,
    customization
  } = props

  if( name === 'orders_received_today' ){
                
    return <SingleValueStat
      key={ 'orders_received_today' }
      colorClassName={ 'blue' }
      iconClassName={ 'fa fa-shopping-cart' }
      value={ orderReceivedToday }
      title={ 'Orders Received Today' }
      app_id={ 11 }
      filter_route={ '/orders/all?query_filters_exist=true' }
      filters={{ received_date : [receivedToday] }}
      apps={ apps }
      customization={ customization }
    /> 

  }else if( name === 'orders_shipped_today' ){

    return <SingleValueStat
      key={ 'orders_shipped_today' }
      colorClassName={ 'green' }
      iconClassName={ 'fa fa-truck' }
      value={ orderShippedToday }
      title={ 'Orders Shipped Today' }
      app_id={ 9 }
      filter_route={ '/orders/shipped?query_filters_exist=true' }
      filters={{ shipped_date : [shippedToday] }}
      apps={ apps }
      customization={ customization }
    /> 

  }else if( name === 'back_orders' ){
    return <SingleValueStat
      key={ 'back_orders' }
      colorClassName={ 'red' }
      iconClassName={ 'fa fa-caret-square-o-left' }
      value={ backOrders }
      title={ 'Back Orders' }
      app_id={ 7 }
      filter_route={ '/orders/backorders?query_filters_exist=true' }
      filters={undefined}
      apps={ apps }
      customization={ customization }
    /> 
  }else if( name === 'open_rma' ){
    return <SingleValueStat
      key={ 'open_rma' }
      colorClassName={ 'yellow' }
      iconClassName={ 'fa fa-tags' }
      value={ openRMAs }
      title={ 'Open RMAs' }
      app_id={ 57 }
      filter_route={ '/returntrak/rmas/open?query_filters_exist=true' }
      filters={undefined}
      apps={ apps }
      customization={ customization }
    /> 
  }else if( name === 'multi_received_today' ){
    return <MultipleValueStat
      key={ 'multi_received_today' }
      colorClassName={ 'blue-madison' }
      iconClassName={ 'fa fa-shopping-cart' }
      leadingTitles={ [ 'RECEIVED', 'TODAY' ] }
      config={ [
        {
          value : orderReceivedToday,
          title : 'Orders',
          app_id : 11,
          filters : { received_date : [receivedToday] },
          filter_route : '/orders/all?query_filters_exist=true',
        },
        {
          value : recvTodayLines,
          title : 'Lines',
          app_id : 18,
          filters : { received_date : [receivedToday] },
          filter_route : '/order-lines/all?query_filters_exist=true',
        },
        {
          value : recvTodayUnits,
          title : 'Units',
          app_id : 61,
          filters : { received_date : [receivedToday] },
          filter_route : '/order-items/all?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  }else if( name === 'multi_shipped_today' ){
    return <MultipleValueStat
      key={ 'multi_shipped_today' }
      colorClassName={ 'green-seagreen' }
      iconClassName={ 'fa fa-truck' }
      leadingTitles={ [ 'SHIPPED', 'TODAY' ] }
      config={ [
        {
          value : orderShippedToday,
          title : 'Orders',
          app_id : 9,
          filters : { shipped_date : [shippedToday] },
          filter_route : '/orders/shipped?query_filters_exist=true',
        },
        {
          value : shipTodayLines,
          title : 'Lines',
          app_id : 16,
          filters : { shipped_date : [shippedToday] },
          filter_route : '/order-lines/shipped?query_filters_exist=true',
        },
        {
          value : shipTodayUnits,
          title : 'Units',
          app_id : 20,
          filters : { shipped_date : [shippedToday], shippedTotalItem: [shippedTotalItem] },
          filter_route : '/order-items/shipped?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  }else if( name === 'multi_rmas_today' ){
    return <MultipleValueStat
      key={ 'multi_rmas_today' }
      colorClassName={ 'yellow-gold' }
      iconClassName={ 'fa fa-tags' }
      leadingTitles={ [ 'RMA', 'TODAY' ] }
      config={ [
        {
          value : issuedRmas,
          title : 'Authorized',
          app_id : 58,
          filters : { rma_date : [rmaDate] },
          filter_route : '/returntrak/rmas/all?query_filters_exist=true',
        },
        {
          value : receivedRmas,
          title : 'Received',
          app_id : 58,
          filters : { last_receive_date : [lastReceiveDate] },
          filter_route : '/returntrak/rmas/all?query_filters_exist=true',
        },
        {
          value : openRMAs,
          title : 'Total Open',
          app_id : 57,
          filters : undefined,
          filter_route : '/returntrak/rmas/open?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else if( name === 'multi_rma_units_today' ){
    return <MultipleValueStat
      key={ 'multi_rma_units_today' }
      colorClassName={ 'yellow-casablanca' }
      iconClassName={ 'fa fa-tags' }
      leadingTitles={ [ 'RMA UNITS', 'TODAY' ] }
      config={ [
        {
          value : rmaUnitsAuth,
          title : 'Authorized',
          app_id : 59,
          filters : { rma_date : [rmaDate], items_view: [ { field : 'items_view', oper : '=', value : "authorized" } ] },
          filter_route : '/returntrak/rmas/items?query_filters_exist=true',
        },
        {
          value : rmaUnitsRecv,
          title : 'Received',
          app_id : 59,
          filters : { last_receive_date : [lastReceiveDate], items_view: [ { field : 'items_view', oper : '=', value : "authorized" } ] },
          filter_route : '/returntrak/rmas/items?query_filters_exist=true',
        },
        {
          value : rmaUnitsOpen,
          title : 'Total Open',
          app_id : 59,
          filters : { rma_status : [ { field : 'rma_status', oper : '=', value : 1 } ], items_view: [ { field : 'items_view', oper : '=', value : "authorized" } ] },
          filter_route : '/returntrak/rmas/items?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else if( name === 'multi_open_orders' ){
    return <MultipleValueStat
      key={ 'multi_open_orders' }
      colorClassName={ 'grey-mint' }
      iconClassName={ 'fa fa-shopping-cart' }
      leadingTitles={ [ 'OPEN', 'ORDERS' ] }
      config={ [
        {
          value : totalOpenOrders,
          title : 'Orders',
          app_id : 5,
          filters : undefined,
          filter_route : '/orders/open?query_filters_exist=true',
        },
        {
          value : totalOpenLines,
          title : 'Lines',
          app_id : 12,
          filters : { d_voided: [{ field : 'd_voided', oper : '=', value : '0' }] },
          filter_route : '/order-lines/open?query_filters_exist=true',
        },
        {
          value : totalOpenQty,
          title : 'Units',
          app_id : 19,
          filters : undefined,
          filter_route : '/order-items/backlog?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else if( name === 'multi_backorders' ){
    return <MultipleValueStat
      key={ 'multi_backorders' }
      colorClassName={ 'purple-soft' }
      iconClassName={ 'fa fa-shopping-cart' }
      leadingTitles={ [ 'BACK', 'ORDERS' ] }
      config={ [
        {
          value : totalBackOrders,
          title : 'Orders',
          app_id : 7,
          filters : undefined,
          filter_route : '/orders/backorders?query_filters_exist=true',
        },
        {
          value : totalBackLines,
          title : 'Lines',
          app_id : 14,
          filters : { bo_lines : [{ field : 'bo_lines', oper : '=', value : true }], d_voided: [{ field : 'd_voided', oper : '=', value : '0' }] },
          filter_route : '/order-lines/backorders?query_filters_exist=true',
        },
        {
          value : backQty,
          title : 'Units',
          app_id : 19,
          filters : { qty_short : [{ field : 'qty_short', oper : '<', value : 0 }] },
          filter_route : '/order-items/backlog?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else if( name === 'multi_subtotal' ){
    return <MultipleValueStat
      key={ 'multi_subtotal' }
      colorClassName={ 'blue-hoki' }
      iconClassName={ 'fa fa-dollar' }
      leadingTitles={ [ 'ORDER VALUE ($)', '' ] }
      uniqueId="multi_subtotal"
      config={ [
        {
          value : formatNumber( subtotalReceivedToday , 0 ),
          title : 'Recv. Today',
          app_id : 11,
          filters : { received_date : [ receivedToday ] },
          filter_route : '/orders/all?query_filters_exist=true',
        },
        {
          value : formatNumber( subtotalShippedToday , 0 ),
          title : 'Ship. Today',
          app_id : 9,
          filters : { shipped_date : [ shippedToday ] },
          filter_route : '/orders/shipped?query_filters_exist=true',
        },
        {
          value : formatNumber( subtotalOpen , 0 ),
          title : 'Open',
          app_id : 5,
          filters : undefined,
          filter_route : '/orders/open?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else if( name === 'multi_sh' ){
    return <MultipleValueStat
      key={ 'multi_sh' }
      colorClassName={ 'red-sunglo' }
      iconClassName={ 'fa fa-dollar' }
      leadingTitles={ [ 'ORDER S & H ($)', '' ] }
      uniqueId="multi_sh"
      config={ [
        {
          value : formatNumber( shReceivedToday , 0 ),
          title : 'Recv. Today',
          app_id : 11,
          filters : { received_date : [ receivedToday ] },
          filter_route : '/orders/all?query_filters_exist=true',
        },
        {
          value : formatNumber( shShippedToday , 0 ),
          title : 'Ship. Today',
          app_id : 9,
          filters : { shipped_date : [ shippedToday ] },
          filter_route : '/orders/shipped?query_filters_exist=true',
        },
        {
          value : formatNumber( shOpen , 0 ),
          title : 'Open',
          app_id : 5,
          filters : undefined,
          filter_route : '/orders/open?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else {
    return <div data-temp={ throwError( name ) }></div>
  }
}

DashboardStat.propTypes = {
  name: PropTypes.string,
  customization: PropTypes.string,
  fulfillments: PropTypes.arrayOf( PropTypes.object ),
}

export default DashboardStat