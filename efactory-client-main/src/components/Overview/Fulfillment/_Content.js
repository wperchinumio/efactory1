import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import OverviewFulfillmentBar from './ContentBar'
import InnerContent from './InnerContent'
import * as fulfillmentActions from '../redux/fulfillments'

let OverviewFulfillment = ({
  fulfillmentActions,
  fulfillments,
  dont_show_zero_qty
}) => {
  return (
    <div 
      className="row"
      style={{ marginTop: "20px", marginBottom: '-20px' }}
    >
      <div className="col-md-12">
        <div className="portlet light bordered ">
          <OverviewFulfillmentBar 
            dont_show_zero_qty={ dont_show_zero_qty }
            fulfillmentActions={fulfillmentActions}
          />
          <div className="portlet-body">
            <div className="tab-content">
              <InnerContent 
                fulfillmentActions={fulfillmentActions}
                fulfillments={ fulfillments }
                dont_show_zero_qty={ dont_show_zero_qty }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

OverviewFulfillment = connect(
  state => ({
    fulfillments : state.overview.fulfillment.fulfillments,
    dont_show_zero_qty : state.overview.fulfillment.dont_show_zero_qty
  }),
  dispatch => ({    
    fulfillmentActions : bindActionCreators( fulfillmentActions, dispatch )
  })
)(OverviewFulfillment)

export default OverviewFulfillment