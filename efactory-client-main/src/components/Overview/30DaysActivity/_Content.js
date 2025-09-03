import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ContentBar from './ContentBar'
import InnerContent from  './InnerContent'
import * as fulfillmentActions from '../redux/fulfillments'

let OverviewFulfillment = ({
  fulfillmentActions
}) => {
  return (
    <div 
      className="row"
      style={{ marginTop: "20px", marginBottom: '-20px' }}
    >
      <div className="col-md-12">
        <div className="portlet light bordered ">
          <ContentBar 
            fulfillmentActions={fulfillmentActions}
          />
          <div className="portlet-body">
            <div className="tab-content">
              <InnerContent 
                fulfillmentActions={fulfillmentActions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 

OverviewFulfillment = connect(
  state => ({}),
  dispatch => ({    
    fulfillmentActions : bindActionCreators( fulfillmentActions, dispatch )
  })
)(OverviewFulfillment)

export default OverviewFulfillment