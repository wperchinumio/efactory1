import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as settingsActions from './redux'
import PageBar from './PageBar'
import OrderImport from './OrderImport'
import ShipConfirm from './ShipConfirm'
import Inventory from './Inventory'
import RmaImport from './RmaImport'
import Tabs from '../_Shared/Components/Tabs'
import OrderDetails from '../DetailPages/OrderDetail/_Content'
import RmaDetails from '../DetailPages/RmaDetail/_Content'
import ItemDetails from '../DetailPages/ItemDetail/_Content'

const Content = props => {
  useEffect(
    () => {
      return () => {
        props.settingsActions.initializeGridReduxState()
      }
    },
    []
  )

  function onTabClicked (activeTab) {
    let { setRootReduxStateProp_multiple, initializeGridReduxState } = props.settingsActions
    initializeGridReduxState().then( () => setRootReduxStateProp_multiple({ activeTab }) )
  }

  let { threePLState, settingsActions } = props
  let { activeTab } = threePLState
  let isOrderDetailShown = props.location.search.includes("?orderNum=")
  let isRmaDetailDisplay    = props.location.search.includes("?rmaNum=")
  let isItemDetailDisplay    = props.location.search.includes("?itemNum=")
  return (
    <div>
      {
        isOrderDetailShown &&
        <OrderDetails 
          navigationHidden_received={ true }
        />
      }
      {
        isRmaDetailDisplay &&
        <RmaDetails 
          navigationHidden={ true }
        />
      }
      {
        isItemDetailDisplay &&
        <ItemDetails 
          navigationHidden={ true }
        />
      }
      <div 
        style={ 
          ( isOrderDetailShown || isRmaDetailDisplay || isItemDetailDisplay ) 
          ? { display : 'none' } 
          : {} 
        }
      >
        <PageBar />
        <div className="container-page-bar-fixed">
          <Tabs
            activeTab={activeTab}
            onTabClicked={ onTabClicked }
            tabs={
              [{
                type : 'order_import',
                name : 'Order Import'
              },{
                type : 'ship_confirm',
                name : 'Ship Confirm'
              },{
                type : 'inventory',
                name : 'Inventory'
              },{
                type : 'rma_import',
                name : 'RMA Import'
              }]
            }
          />
          {
            activeTab === 'order_import' &&
            <OrderImport
              threePLState={ threePLState }
              settingsActions={ settingsActions }
            />
          }
          {
            activeTab === 'ship_confirm' &&
            <ShipConfirm
              threePLState={ threePLState }
              settingsActions={ settingsActions }
            />
          }
          {
            activeTab === 'inventory' &&
            <Inventory
              threePLState={ threePLState }
              settingsActions={ settingsActions }
            />
          }
          {
            activeTab === 'rma_import' &&
            <RmaImport
              threePLState={ threePLState }
              settingsActions={ settingsActions }
            />
          }
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    threePLState: state.threePL,
    settings: state.threePL
  }),
  dispatch => ({
    settingsActions: bindActionCreators( settingsActions, dispatch )
  })
)(Content)