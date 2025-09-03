import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { Prompt, withRouter } from 'react-router-dom'
import * as poRmaActions_ from './redux'
import PageBar from './Bar'
import PageHeader from './Header'
import Cart from './Cart/_Content'
import ComfirmModal from '../../../OrderPoints/OrderEntry/Modals/Confirm'

const PoRmaMain = ({ location }) => {
  const dispatch = useDispatch() 
  const poRmaActions = bindActionCreators( poRmaActions_, dispatch )
  const poRmaState = useSelector( ({ services }) => services.utilities.poRma )

  useEffect(
    () => {
      return () => {
        poRmaActions.initializeReduxState()
      }
    },
    []
  )

  function onNewNotificationClicked () {
    poRmaActions.initializeReduxState().then( () => {
      poRmaActions.setRootReduxStateProp('new_po_rma', true)
    })
  }

  function isAnyQtyNowBiggerThanZero () {
    let { po_cart_items } = poRmaState
    let index = po_cart_items.findIndex( ({ qty_now }) => qty_now && !isNaN( qty_now ) && +qty_now > 0 )
    if( index === -1 ) return true
    return false
  }

  function preventRouteChange () {
    const { pathname } = location
    let authToken = localStorage.getItem('authToken')
    if( !authToken || pathname === '/login-user' ){
      return false
    }
    let anyQtyNowBiggerThanZero = !isAnyQtyNowBiggerThanZero()
    let { form_dirty } = poRmaState
    if ( anyQtyNowBiggerThanZero || form_dirty ) {
      return true
    }
    return false
  }

  return (
    <section className='po-notifications'>
      <div>
        <PageBar poRmaState={poRmaState} poRmaActions={poRmaActions} />
        <div className="op-review container-page-bar-fixed">
          <div className="op-review-inner">
            <div className="row-low-padding" > 
              <div>
                <PageHeader poRmaState={poRmaState} poRmaActions={poRmaActions} />
                <Cart poRmaState={poRmaState} poRmaActions={poRmaActions} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComfirmModal
        id="new-notification"
        confirmationMessage="You have made some changes, are you sure to start a new RMA Receipt?"
        onConfirmHandler={ onNewNotificationClicked }
      />
      <Prompt
        when={preventRouteChange()}
        message="You have made some changes, are you sure to leave?"
      />
    </section>
  )
}

export default withRouter(PoRmaMain)