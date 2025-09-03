import React from 'react'
import PropTypes from 'prop-types'
import MultipleValueStat from '../../../_Shared/Components/MultipleValueStat'
import { getUserData } from '../../../../util/storageHelperFuncs'
        
const TPTiles = ({
  tp_tiles = {},
  trading_partner = '',
}) => {
  let {
    month_received_orders,
    month_received_value,
    month_shipped_orders,
    month_shipped_value,
    year_received_orders,
    year_received_value,
    year_shipped_orders,
    year_shipped_value,
  } = tp_tiles

  let apps = getUserData('apps') || []

  return (
    <div className="tp-tiles" style={{ marginLeft: '-15px', marginRight: '-15px' }}>
      <MultipleValueStat
        colorClassName={ 'blue-dark' }
        styleObj={{backgroundColor:"#445d75"}}
        iconClassName={ 'fa fa-shopping-cart' }
        leadingTitles={ [ 'CURRENT MONTH RECEIVED', '' ] }
        config={ [
          {
            value : month_received_orders,
            title : 'Orders',
            app_id : 85,
            filters : { 
              received_date : [{field: "received_date", oper: "=", value: "0M"}],
              partner       : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          },
          {
            value : month_received_value,
            title : 'Value',
            app_id : 85,
            filters : { 
              received_date : [{field: "received_date", oper: "=", value: "0M"}],
              partner       : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          }
        ] }
        apps={ apps }
      />

      <MultipleValueStat
        colorClassName={ 'green-soft' }
        iconClassName={ 'fa fa-shopping-cart' }
        leadingTitles={ [ 'CURRENT MONTH SHIPPED', '' ] }
        styleObj={{backgroundColor:"#356a92"}}
        config={ [
          {
            value : month_shipped_orders,
            title : 'Orders',
            app_id : 85,
            filters : { 
              processing_date : [{field: "processing_date", oper: "=", value: "0M"}],
              partner         : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          },
          {
            value : month_shipped_value,
            title : 'Value',
            app_id : 85,
            filters : { 
              processing_date : [{field: "processing_date", oper: "=", value: "0M"}],
              partner         : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          }
        ] }
        apps={ apps }
      />

      <MultipleValueStat
        colorClassName={ 'blue-chambray' }
        iconClassName={ 'fa fa-shopping-cart' }
        leadingTitles={ [ 'YEAR RECEIVED', '' ] }
        config={ [
          {
            value : year_received_orders,
            title : 'Orders',
            app_id : 85,
            filters : { 
              received_date   : [{field: "received_date", oper: "=", value: "0Y"}],
              partner         : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          },
          {
            value : year_received_value,
            title : 'Value',
            app_id : 85,
            filters : { 
              received_date   : [{field: "received_date", oper: "=", value: "0Y"}],
              partner         : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          }
        ] }
        apps={ apps }
      />

      <MultipleValueStat
        colorClassName={ 'green-seagreen' }
        iconClassName={ 'fa fa-shopping-cart' }
        leadingTitles={ [ 'YEAR SHIPPED', '' ] }
        styleObj={{backgroundColor:"#0760a2"}}
        config={ [
          {
            value : year_shipped_orders,
            title : 'Orders',
            app_id : 85,
            filters : { 
              processing_date : [{field: "processing_date", oper: "=", value: "0Y"}],
              partner         : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          },
          {
            value : year_shipped_value,
            title : 'Value',
            app_id : 85,
            filters : { 
              processing_date : [{field: "processing_date", oper: "=", value: "0Y"}],
              partner         : [{field: "partner", oper: "=", value: trading_partner }],
            },
            filter_route : '/edi/documents/order-history?query_filters_exist=true',
          }
        ] }
        apps={ apps }
      />
    </div>
  )
}

TPTiles.propTypes = {
  field_type : PropTypes.string,
  tp_items_shipped: PropTypes.array
}

export default TPTiles