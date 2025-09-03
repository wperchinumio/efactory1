import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { Prompt, withRouter } from 'react-router-dom'
import * as poActions_ from './redux'
import PageBar from './Bar'
import PageHeader from './Header'
import Cart from './Cart/_Content'
import ComfirmModal from '../../../OrderPoints/OrderEntry/Modals/Confirm'

const PoNotificationsMain = ({ location }) => {
  const dispatch = useDispatch()
  const poActions = bindActionCreators( poActions_, dispatch )
  const po = useSelector( ({ services }) => services.utilities.po )
  
  useEffect(
    () => {
      return () => {
        poActions.initializeReduxState()
      }
    },
    []
  )

  function onNewNotificationClicked () {
    poActions.initializeReduxState().then( () => {
      poActions.setRootReduxStateProp( 'new_po_notification', true )
    } )
  }

  function preventRouteChange () {
    const { pathname } = location
    let authToken = localStorage.getItem('authToken')
    if( !authToken || pathname === '/login-user' ){
      return false
    }
    if ( !po.form_dirty ) {
      return false
    }
    return true
  }

  return (
    <section className='po-notifications'>
      <div>
        <PageBar 
          poActions={poActions}
          po={po}
        />
        <div className="op-review container-page-bar-fixed">
          <div className="op-review-inner">
            <div className="row-low-padding" > 
              <div>
                <PageHeader 
                  po={po}
                  poActions={poActions}
                />
                <Cart 
                  poActions={poActions}
                  po={po}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComfirmModal
        id="new-notification"
        confirmationMessage="You have made some changes, are you sure to start a new Po Notification?"
        onConfirmHandler={ onNewNotificationClicked }
      />
      <Prompt
        when={preventRouteChange()}
        message="You have made some changes, are you sure to leave?"
      />
    </section>
  )
}

export default withRouter(PoNotificationsMain)