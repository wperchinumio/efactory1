import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { Prompt, withRouter } from 'react-router-dom'
import * as poReceiptActions_ from './redux'
import PageBar from './Bar'
import PageHeader from './Header'
import Cart from './Cart/_Content'
import ComfirmModal from '../../../OrderPoints/OrderEntry/Modals/Confirm'

function PoReceiptMain ({
  location
}) {
  const dispatch = useDispatch() 
  const poReceiptActions = bindActionCreators( poReceiptActions_, dispatch )
  const poReceiptState = useSelector( ({ services }) => services.utilities.poReceipt )

  useEffect(
    () => {
      return () => {
        poReceiptActions.initializeReduxState()
      }
    },
    []
  )

  function onNewReceiptClicked () {
    poReceiptActions.initializeReduxState().then( () => {
      poReceiptActions.setRootReduxStateProp( 'new_po_notification', true )
    } )
  }

  function preventRouteChange () {
    const { pathname } = location
    let authToken = localStorage.getItem('authToken')
    if( !authToken || pathname === '/login-user' ){
      return false
    }
    if ( !poReceiptState.form_dirty ) {
      return false
    }
    return true
  }

  return (
    <section className='po-notifications'>
      <div>
        <PageBar 
          poReceiptActions={poReceiptActions}
          poReceiptState={poReceiptState}
        />
        <div className="op-review container-page-bar-fixed">
          <div className="op-review-inner">
            <div className="row-low-padding" > 
              <div>
                <PageHeader 
                  poReceiptState={poReceiptState}
                  poReceiptActions={poReceiptActions}
                />
                <Cart 
                  poReceiptActions={poReceiptActions}
                  poReceiptState={poReceiptState}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComfirmModal
        id="new-notification"
        confirmationMessage="You have made some changes, are you sure to start a new Po Receipt?"
        onConfirmHandler={ onNewReceiptClicked }
      />
      <Prompt
        when={preventRouteChange()}
        message="You have made some changes, are you sure to leave?"
      />
    </section>
  )
}

export default withRouter(PoReceiptMain)