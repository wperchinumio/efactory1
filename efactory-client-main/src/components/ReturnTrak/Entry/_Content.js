import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import { withRouter, Prompt } from 'react-router-dom'
import history from '../../../history'
import PageBar from './Bar'
import Amounts from './SubComponents/Amounts/_Content'
import Others from './SubComponents/Others/_Content'
import RmaHeader from './SubComponents/RmaHeader/_Content'
import ShippingAddress from './SubComponents/ShippingAddress/_Content'
import Shipping from './SubComponents/Shipping/_Content'
import RmaDetail from '../../DetailPages/RmaDetail/_Content'
import * as rmaEntryActions_ from './redux'
import * as rmaSettingsActions_ from '../Settings/redux'
import Cart from './SubComponents/Cart/_Content'
import ComfirmModal from '../../OrderPoints/OrderEntry/Modals/Confirm'

const EntryContent = ({
  location
}) => {
  const dispatch = useDispatch()
  const rmaEntryActions = bindActionCreators( rmaEntryActions_, dispatch )
  const rmaSettingsActions = bindActionCreators( rmaSettingsActions_, dispatch )
  const dirty = useSelector( ({ returnTrak }) => returnTrak.entry.dirty )
  const createdRmaNumber = useSelector( ({ returnTrak }) => returnTrak.entry.createdRmaNumber )

  useEffect(
    () => {
      if( location.search === '?noReadSettings=true' ){
        history.push('/returntrak')
      }else{
        rmaSettingsActions.readRmaSettings()
      }
      return () => {
        rmaEntryActions.initializeReduxState()
      }
    },
    []
  )

  function preventRouteChange () {
    const { pathname } = location
    let authToken = localStorage.getItem('authToken')
    if( !authToken || pathname === '/login-user' ){
      return false
    }
    if ( !dirty ) {
      return false
    }
    return true
  }

  let rmaDetailModalOpen = location.search && location.search.includes('?rmaNum')

  return (
    <section className='return-trak-entry'>
      <div className={ classNames({ hidden : rmaDetailModalOpen }) } >
        <PageBar 
          rmaEntryActions={rmaEntryActions}
        />
        <div className="op-review container-page-bar-fixed">
          <div className="op-review-inner">
            <div className="row-low-padding" >
              <div className="col-md-9 op-review-main">
                  <div className="">
                    <div className="row">
                      <RmaHeader 
                        rmaEntryActions={rmaEntryActions}
                      />
                      <ShippingAddress 
                        rmaEntryActions={rmaEntryActions}
                      />
                      <Cart />
                    </div>
                  </div>
                </div>
              <div className="col-md-3">
                <Shipping 
                  rmaSettingsActions={rmaSettingsActions}
                  rmaEntryActions={rmaEntryActions}
                />
                <br/>
                <Amounts 
                  rmaEntryActions={rmaEntryActions}
                />
                <br/>
                <Others 
                  rmaEntryActions={rmaEntryActions}
                />
              </div>
            </div>
          </div>
        </div>
        <ComfirmModal
          id="confirm-goto-order"
          confirmationMessage="You have made some changes, are you sure to start a new RMA ?"
          onConfirmHandler={ rmaEntryActions.createNewRma }
        />
        <div 
          className="modal modal-themed fade"
          data-backdrop="static"
          id="rma-success-modal" 
          tabIndex="-1" 
          role="dialog" 
          aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button 
                  type="button" 
                  className="close" 
                  data-dismiss="modal" 
                  aria-hidden="true">
                </button>
                <h4 className="modal-title">CREATED RMA SUCCESSFULLY !</h4>
              </div>
              <div className="modal-body">
                RMA # <b>{ createdRmaNumber }</b>  created successfully
              </div>
              <div className="modal-footer">
                <button type="button" className="btn dark btn-outline" data-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        rmaDetailModalOpen &&
        <RmaDetail marginFix />
      }
      <Prompt
        when={preventRouteChange()}
        message="You have made some changes, are you sure to leave?"
      />
    </section>
  )
}

export default withRouter(EntryContent)