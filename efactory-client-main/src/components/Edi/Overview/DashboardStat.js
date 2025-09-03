import React from 'react'
import SingleValueStat from '../../_Shared/Components/SingleValueStat'
import MultipleValueStat from '../../_Shared/Components/MultipleValueStat'
import { getUserData } from '../../../util/storageHelperFuncs'

const DashboardStat = ({
  customization,
  ediState,
  name
}) => {
  function calculateTotals (partners = []) {
    return partners.reduce(
      (
        {
          total_to_resolve_today,
          total_received_today,
          total_to_approve_today,
          total_to_ship_today,
        },
        next
      ) => {
        return {
          total_to_resolve_today : total_to_resolve_today + next.today.to_resolve,
          total_received_today : total_received_today + next.today.received,
          total_to_approve_today : total_to_approve_today + next.today.to_approve,
          total_to_ship_today : total_to_ship_today + next.today.to_ship
        }
      },
      {
        total_to_resolve_today : 0,
        total_received_today : 0,
        total_to_approve_today : 0,
        total_to_ship_today : 0,
      }
    )
  }

  function throwError (name) {
    console.error('DashboardStat component could not find ', name)
    return name
  }

  let {
    partners = [],
    multi_values = {}
  } = ediState

  let {
    total_to_resolve_today,
    total_received_today,
    total_to_approve_today,
    total_to_ship_today
  } = calculateTotals( partners )

  let {
    received_orders_today,
    received_value_today,
    shipped_orders_today,
    shipped_value_today,
    toresolve_orders,
    toresolve_value,
    toapprove_orders,
    toapprove_value,
    total_open_orders,
    total_open_value,
    total_back_orders,
    total_back_value,
  } = multi_values

  let receivedToday = { field : 'received_date', oper : '=', value : '0D' }
  let shippedToday = { field : 'shipped_date', oper : '=', value : '0D' }
  let processingToday = { field : 'processing_date', oper : '=', value : '0D' }

  let apps = getUserData('apps') || []

  if ( name === 'orders_received_today' ) {
    return <SingleValueStat
      key={ 'orders_received_today' }
      colorClassName={ 'blue' }
      iconClassName={ 'fa fa-shopping-cart' }
      value={ total_received_today }
      title={ 'Orders Received Today' }
      app_id={ 85 }
      filter_route={ '/edi/documents/order-history?query_filters_exist=true' }
      filters={{ received_date : [receivedToday] }}
      apps={ apps }
      customization={ customization }
    />

  } else if( name === 'to_resolve' ) {
    return <SingleValueStat
      key={ 'to_resolve' }
      colorClassName={ 'red' }
      iconClassName={ 'fa fa-check' }
      value={ total_to_resolve_today }
      title={ 'Orders To Resolve' }
      app_id={ 82 }
      filter_route={ '/edi/documents/orders-to-resolve?query_filters_exist=true' }
      filters={ undefined}
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'to_approve' ) {
    return <SingleValueStat
      key={ 'to_approve' }
      colorClassName={ 'yellow-casablanca' }
      iconClassName={ 'fa fa-question' }
      value={ total_to_approve_today }
      title={ 'Orders To Approve' }
      app_id={ 83 }
      filter_route={ '/edi/documents/orders-to-approve?query_filters_exist=true' }
      filters={ undefined}
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'to_ship' ) {
    return <SingleValueStat
      key={ 'to_ship' }
      colorClassName={ 'green-dark' }
      iconClassName={ 'fa fa-truck' }
      value={ total_to_ship_today }
      title={ 'Orders To Ship' }
      app_id={ 84 }
      filter_route={ '/edi/documents/orders-to-ship?query_filters_exist=true' }
      filters={ undefined}
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'multi_received_today' ) {
    return <MultipleValueStat
      key={ 'multi_received_today' }
      colorClassName={ 'blue-madison' }
      iconClassName={ 'fa fa-shopping-cart' }
      leadingTitles={ [ 'RECEIVED', 'TODAY' ] }
      config={ [
        {
          value: received_orders_today,
          title: 'Orders',
          app_id: 85,
          filters: { received_date : [receivedToday] },
          filter_route: '/edi/documents/order-history?query_filters_exist=true',
        },
        {
          value: received_value_today,
          title: 'Value',
          app_id: 85,
          filters: { received_date: [receivedToday] },
          filter_route: '/edi/documents/order-history?query_filters_exist=true',
        }
      ] }
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'multi_shipped_today' ) {
    return <MultipleValueStat
      key={ 'multi_shipped_today' }
      colorClassName={ 'green-seagreen' }
      iconClassName={ 'fa fa-truck' }
      leadingTitles={ [ 'SHIPPED', 'TODAY' ] }
      config={ [
        {
          value: shipped_orders_today,
          title: 'Orders',
          app_id: 85,
          filters: { shipped_date : [shippedToday], processing_date : [processingToday] },
          filter_route: '/edi/documents/order-history?query_filters_exist=true',
        },
        {
          value: shipped_value_today,
          title: 'Value',
          app_id: 85,
          filters: { shipped_date : [shippedToday], processing_date : [processingToday] },
          filter_route: '/edi/documents/order-history?query_filters_exist=true',
        }
      ] }
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'multi_toresolve' ) {
    return <MultipleValueStat
      key={ 'multi_toresolve' }
      colorClassName={ 'red-haze' }
      iconClassName={ 'fa fa-wrench' }
      leadingTitles={ [ 'TO RESOLVE', '' ] }
      config={ [
        {
          value: toresolve_orders,
          title: 'Orders',
          app_id: 82,
          filters: undefined,
          filter_route: '/edi/documents/orders-to-resolve?query_filters_exist=true',
        },
        {
          value: toresolve_value,
          title: 'Value',
          app_id: 82,
          filters: undefined,
          filter_route: '/edi/documents/orders-to-resolve?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'multi_toapprove' ) {
    return <MultipleValueStat
      key={ 'multi_toapprove' }
      colorClassName={ 'yellow-gold' }
      iconClassName={ 'fa fa-check' }
      leadingTitles={ [ 'TO APPROVE', '' ] }
      config={ [
        {
          value: toapprove_orders,
          title: 'Orders',
          app_id: 83,
          filters: undefined,
          filter_route: '/edi/documents/orders-to-approve?query_filters_exist=true',
        },
        {
          value: toapprove_value,
          title: 'Value',
          app_id: 83,
          filters: undefined,
          filter_route: '/edi/documents/orders-to-approve?query_filters_exist=true',
        },
      ] }
      apps={ apps }
      customization={ customization }
    />
  } else if( name === 'multi_open_orders' ) {
    return <MultipleValueStat
      key={ 'multi_open_orders' }
      colorClassName={ 'grey-mint' }
      iconClassName={ 'fa fa-shopping-cart' }
      leadingTitles={ [ 'OPEN', 'ORDERS' ] }
      config={ [
        {
          value: total_open_orders,
          title: 'Orders',
          app_id: 84,
          filters: undefined,
          filter_route: '/edi/documents/orders-to-ship?query_filters_exist=true',
        },
        {
          value: total_open_value,
          title: 'Value',
          app_id: 84,
          filters: undefined,
          filter_route: '/edi/documents/orders-to-ship?query_filters_exist=true',
        }
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else if( name === 'multi_backorders' ) {
    return <MultipleValueStat
      key={ 'multi_backorders' }
      colorClassName={ 'purple-soft' }
      iconClassName={ 'fa fa-shopping-cart' }
      leadingTitles={ [ 'BACK', 'ORDERS' ] }
      config={ [
        {
          value: total_back_orders,
          title: 'Orders',
          app_id: 7,
          filters: { order_type : [{ field: 'order_type', oper : '=', value : 'EDI'  }] },
          filter_route: '/orders/backorders?query_filters_exist=true',
        },
        {
          value: total_back_value,
          title: 'Value',
          app_id: 7,
          filters: { order_type : [{ field: 'order_type', oper : '=', value : 'EDI'  }] },
          filter_route: '/orders/backorders?query_filters_exist=true',
        }
      ] }
      apps={ apps }
      customization={ customization }
    /> 
  } else {
    throwError( name )
    return <div />
  }
}

export default DashboardStat