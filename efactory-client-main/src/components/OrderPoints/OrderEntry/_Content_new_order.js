import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter, Prompt } from 'react-router-dom'
import { getUserData } from '../../../util/storageHelperFuncs'
import { useBlockUi } from '../../_Shared/hooks'
import Bar from './Bar'
import OrderHeader from './SubComponents/OrderHeader'
import ShippingAddress from './SubComponents/ShippingAddress'
import ItemsCart from './SubComponents/ItemsCart'
import Shipping from './SubComponents/Shipping'
import BillingAddress from './SubComponents/BillingAddress'
import Amounts from './SubComponents/Amounts'
import ExtraFields from './SubComponents/ExtraFields'
import * as reviewActions from './redux'
import * as settingsActions from '../Settings/redux'
import * as addressActions from '../AddressBook/redux'
import SuccessModal from './Modals/Success'
import ComfirmModal from './Modals/Confirm'
import OrderDetails from '../../DetailPages/OrderDetail/_Content'

// import OrderDetails                             from '../../DetailPages/OrderDetail/_Content'

const OpNewOrder = ({
  entryPageType,
  dirty,
  loading,
  orderHeader = {},
  reviewActions,
  settings = {},
  settingsActions,
  addressActions,
  location
}) => {
  let accountsLength
  useBlockUi(loading)
  const settingsRef = useRef(null)
  settingsRef.current = settings
  const orderHeaderRef = useRef(null)
  orderHeaderRef.current = orderHeader
  const [orderNumber, setOrderNumber] = useState(false)
  const [didMount, setDidMount] = useState(false)
  
  useEffect(
    () => {
      settingsActions.readOpSettings().then(() => {
        setCustomFieldLabels()
        if (entryPageType === 'create_new') {
          let shippingValues = settingsRef.current.opSettingsData.shipping.domestic || {}
          let {
            carrier : shipping_carrier,
            service : shipping_service,
            packing_list_type,
            freight_account,
            consignee_number,
            terms,
            int_code : international_code,
            fob,
            comments = ''
          } = shippingValues
          comments = comments ? String( comments ) : ''
          reviewActions.setRootReduxStateProp_multiple({ 
            shipping : {
              shipping_carrier,
              shipping_service,
              packing_list_type,
              freight_account,
              consignee_number,
              terms,
              international_code,
              fob
            },
            orderHeader : {
              ...orderHeaderRef.current,
              packing_list_comments: comments.trim().length > 0 ? comments : orderHeader.packing_list_comments
            }
          })
        }
      })
      focusOrderNumber()
      setDidMount(true)
      return () => {
        reviewActions.initializeEntryReduxState()
      }
    },
    []
  )
  
  useEffect(
    () => {
      global.$('#order-success-modal').modal('show')
    },
    [orderNumber]
  )

  function setCustomFieldLabels(){
    let {
      header_cf_1, header_cf_2, header_cf_3, header_cf_4, header_cf_5, detail_cf_1, detail_cf_2, detail_cf_5
    } = settingsRef.current.opSettingsData.custom_fields
    reviewActions.setSidebarExtraFieldsLabels({
      header_cf_1, header_cf_2, header_cf_3, header_cf_4, header_cf_5, detail_cf_1, detail_cf_2, detail_cf_5
    })
  }

  function focusOrderNumber(){
    if (accountsLength === undefined ){
      accountsLength = Object.keys(getUserData('calc_account_regions')).length
    }
    if (accountsLength === 1 ){
      setTimeout( () => { 
        global.$('#order-number-to-focus')[0].focus() 
      }, 100 )
    }
  }

  function createNewOrder () {
    let {
      initializeEntryReduxState,
      setSidebarExtraFieldsLabels,
      setRootReduxStateProp_multiple,
      setDirty,
      newOrderInitialized
    } = reviewActions
    let { readOpSettings } = settingsActions
    initializeEntryReduxState()
    readOpSettings().then( () => {
      let {
        header_cf_1 = 'Custom Field 1',
        header_cf_2 = 'Custom Field 2',
        header_cf_3 = 'Custom Field 3',
        header_cf_4 = 'Custom Field 4',
        header_cf_5 = 'Custom Field 5',
        detail_cf_1 = 'Custom Field 1',
        detail_cf_2 = 'Custom Field 2',
        detail_cf_5 = 'Custom Field 3'
      } = settings.opSettingsData.custom_fields
      setSidebarExtraFieldsLabels({
        header_cf_1,
        header_cf_2,
        header_cf_3,
        header_cf_4,
        header_cf_5,
        detail_cf_1,
        detail_cf_2,
        detail_cf_5
      })
      let {
        carrier : shipping_carrier,
        service : shipping_service,
        packing_list_type,
        freight_account,
        consignee_number,
        terms,
        int_code : international_code,
        comments
      } = settings.opSettingsData.shipping.domestic || {}
      comments = comments ? comments : ''
      setRootReduxStateProp_multiple({
        shipping : {
          shipping_carrier,
          shipping_service,
          packing_list_type,
          freight_account,
          consignee_number,
          terms,
          international_code
        },
        orderHeader : {
          ...orderHeader,
          packing_list_comments: comments.trim().length > 0 ? comments : ''
        }
      })
    })
    newOrderInitialized()
    setTimeout( () => {
      setRootReduxStateProp_multiple({
        ShippingAddress : {
          country : 'US'
        }
      })
    }, 200 )
    setTimeout( () => {
      setDirty( false )
      focusOrderNumber()
    }, 0 )
  }

  function preventRouteChange () {
    let authToken = localStorage.getItem('authToken')
    if (!authToken || location.pathname === '/login-user' ){
      return false
    }
    if ( !dirty) {
      return false
    }
    return true
  }

  let isOrderDetailDisplay  = false

  if (location.search && location.search.includes("?orderNum=")) {
    isOrderDetailDisplay = true
  }

  return (
    <div>

      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>

        {
          didMount &&
          <div>
            
            <Bar 
              reviewActions={reviewActions}
              settingsActions={settingsActions}
              setCustomFieldLabels={setCustomFieldLabels}
              showOrderSuccessModal={setOrderNumber}
              createNewOrder={ createNewOrder }
            />

            <div className="op-review container-page-bar-fixed">
              <div className="op-review-inner">
                <div className="row-low-padding" >
                  
                  <div className="col-md-9 op-review-main">
                    <div>
                      <div className="row">

                        <OrderHeader
                          reviewActions={reviewActions}
                          settings={settings}
                        />

                        <ShippingAddress
                          reviewActions={ reviewActions }
                          addressActions={ addressActions }
                        />

                        <ItemsCart
                          reviewActions={ reviewActions }
                        />

                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    
                    <Shipping
                      reviewActions={reviewActions}
                      settings={settings}
                      entryPageType={entryPageType}
                    />

                    <br/>

                    <BillingAddress reviewActions={reviewActions} />

                    <br/>

                    <Amounts reviewActions={reviewActions} />

                    <br/>

                    <ExtraFields reviewActions={reviewActions} />

                  </div>

                </div>
              </div>
            </div>

            <SuccessModal orderNumber={orderNumber}/>

            <ComfirmModal
              id="confirm-location-account-change"
              confirmationMessage="This operation will empty the cart, are you sure to change account/warehouse?"
              onConfirmHandler={ reviewActions.approveLocationAccountChange }
            />

            <ComfirmModal
              id="confirm-goto-order"
              confirmationMessage="You have made some changes, are you sure to start a new order?"
              onConfirmHandler={ createNewOrder }
            />

          </div>
        }
        
      </div>

      { 
        isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }

      <Prompt
        when={preventRouteChange()}
        message="You have made some changes, are you sure to leave?"
      />

    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      settings      : state.orderPoints.settings,
      entryPageType : state.orderPoints.entry.entryPageType,
      orderHeader   : state.orderPoints.entry.orderHeader,
      dirty         : state.orderPoints.entry.dirty,
      loading       : state.orderPoints.entry.loading
    }),
    dispatch => ({
      reviewActions   : bindActionCreators( reviewActions, dispatch ),
      settingsActions : bindActionCreators( settingsActions, dispatch ),
      addressActions  : bindActionCreators( addressActions, dispatch )
    })
  )(OpNewOrder)
)