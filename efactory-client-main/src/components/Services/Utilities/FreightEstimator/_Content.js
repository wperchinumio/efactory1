import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Bar from './Bar'
import Tabs from '../../../_Shared/Components/Tabs'
import CalculationForm from './CalculationForm'
import Results from './Results'
import * as freightEstimatorActions from './redux'
import OrderDetails from '../../../DetailPages/OrderDetail/_Content'

const FreightEstimator = props => {
  useEffect(
    () => {
      return () => {
        props.freightEstimatorActions.initializeReduxState()
      }
    },
    []
  )

  function onTabClicked (tabType) {
    props.freightEstimatorActions.setRootReduxStateProp({ field : 'activeTab', value : tabType })
  }

  let {
    activeTab,
    freightEstimatorActions,
    location
  } = props
  let isOrderDetailDisplay  = false
  if( location && location.search && location.search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }

  return (
    <div>
      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>
        <Bar />
        <div className="container-page-bar-fixed">
          <div className="portlet light bordered ">
            <div className="portlet-body">
              <h5>Please provide information about your shipment including destination, origin, and weight. Required fields are in <span style={{fontWeight: 500}}>bold</span>.</h5>
              <div className="tabbable-line">
                <Tabs
                  activeTab={activeTab}
                  onTabClicked={ onTabClicked }
                  tabs={
                    [{
                      type : 'freight',
                      name : 'Freight'
                    },{
                      type : 'package',
                      name : 'Package'
                    }]
                  }
                />
                <div className="tab-content">
                  <div className="tab-pane active" id="package">
                    <table style={{width: "100%"}}>
                      <tbody>
                      <tr>
                        <CalculationForm
                          freightEstimatorActions={ freightEstimatorActions }
                        />
                        <Results
                          freightEstimatorActions={ freightEstimatorActions }
                        />
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      { 
        isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
    </div>
  )
}

export default connect(
  state => ({
    activeTab : state.services.utilities.freightEstimator.activeTab
  }),
  dispatch => ({
    freightEstimatorActions : bindActionCreators( freightEstimatorActions, dispatch )
  })
)(FreightEstimator)