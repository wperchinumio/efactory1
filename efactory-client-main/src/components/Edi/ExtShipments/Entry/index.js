import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter, Prompt } from 'react-router-dom'
import classNames from 'classnames'
import Bar from './Bar'
import ShippingHeader from './ShippingHeader'
import PLCI from './PLCI'
import ShippingAddress from './ShippingAddress'
import BillingAddress from './BillingAddress'
import Others from './Others'
import Containers from './Containers'
import AddShipmentModal from './AddShipmentModal'
import ComfirmModal from '../../../OrderPoints/OrderEntry/Modals/Confirm'
import OrderDetails from '../../../DetailPages/OrderDetail/_Content'
import * as ediActions_ from '../../redux'

const ExtShipmentsEntry = ({ location }) => {
  const dispatch = useDispatch()
  const ediActions = bindActionCreators( ediActions_, dispatch )
  const ediState = useSelector( ({ edi }) => edi )
  const globalApiData = useSelector( ({ common }) => common.globalApi.globalApiData )

  useEffect(
    () => {
      return () => {
        ediActions.initializeGridReduxState()
      }
    },
    []
  )

  function confirmNewShipment () { 
    ediActions.initializeGridReduxState()
    global.$('#add-shipment').modal('show'); 
  }

  function confirmPlacePartialShipment () {
    ediActions.placeShipment( true, true ).then( ({ is_shipping_document_missing, is_partial }) => {
      if( is_shipping_document_missing ){
        return global.$('#confirm-missing-doc').modal('show');
      }
      if( is_partial ){
        return global.$('#confirm-place-partial-shipment').modal('show');
      }
    } ).catch( e => {} )
  }

  function confirmMissingDoc () {
    ediActions.placeShipment( false, true ).then( ({ is_shipping_document_missing, is_partial }) => {
      if( is_shipping_document_missing ){
        return global.$('#confirm-missing-doc').modal('show');
      }
      if( is_partial ){
        return global.$('#confirm-place-partial-shipment').modal('show');
      }
    } ).catch( e => {} )
  }

  function preventRouteChange () {
    const { pathname } = location
    let authToken = localStorage.getItem('authToken')
    if( !authToken || pathname === '/login-user' ){
      return false
    }
    if ( !ediState.is_form_values_dirty ) {
      return false
    }
    return true
  }

  let {
    is_new_shipment_added
  } = ediState

  let isOrderDetailDisplay  = false

  if( location.search && location.search.includes("?orderNum=") ) {
    isOrderDetailDisplay = true
  }

  return (
    <div className="op-review">
      <div style={ isOrderDetailDisplay ? { display:'none' } : {}}>
        <Bar 
          ediState={ ediState }
          ediActions={ ediActions }
        />
        <div className="container-page-bar-fixed">
          <div 
            className={ classNames({
              'form-disabled' : !is_new_shipment_added
            }) }
          >
          </div>
          <div className="row-low-padding">
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-6">
                  <ShippingHeader 
                    ediState={ ediState }
                    ediActions={ ediActions }
                    globalApiData={ globalApiData }
                  />
                  <br/>
                  <PLCI 
                    ediState={ ediState }
                    ediActions={ ediActions }
                  />
                </div>
                <div className="col-md-6">
                  <ShippingAddress 
                    ediState={ ediState }
                    ediActions={ ediActions }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <BillingAddress 
                ediState={ ediState }
                ediActions={ ediActions }
              />
              <br/>
              <Others
                ediState={ ediState }
                ediActions={ ediActions }
              />
            </div>
          </div>
          <div className="row-low-padding margin-top-10">
            <div className="col-md-12">
              <div style={{ paddingLeft: '0px', paddingRight: '5px', marginTop: '17px' }}>
            
                <Containers 
                  ediState={ ediState }
                  ediActions={ ediActions }
                />
            </div>
          </div>
        </div>
        </div>
      </div>
      <AddShipmentModal 
        ediState={ ediState }
        ediActions={ ediActions }
      />
      { 
        isOrderDetailDisplay &&
        <OrderDetails 
          style={{ margin: '-25px -20px -10px -20px' }}
        />
      }
      <ComfirmModal
        id="confirm-new-shipment"
        confirmationMessage="You have made some changes, are you sure to start a new shipment?"
        onConfirmHandler={ confirmNewShipment }
      />
      <ComfirmModal
        id="confirm-place-partial-shipment"
        confirmationMessage="This is a partial shipment. Are you sure you want to proceed?"
        onConfirmHandler={ confirmPlacePartialShipment }
      />
      <ComfirmModal
        id="confirm-missing-doc"
        confirmationMessage="Packing List and/or Commercial Invoice document is missing. Are you sure you want to proceed?"
        onConfirmHandler={ confirmMissingDoc }
      />
      <Prompt
        when={preventRouteChange()}
        message="You have made some changes, are you sure to leave?"
      />
    </div>
  )
}

export default withRouter( ExtShipmentsEntry )