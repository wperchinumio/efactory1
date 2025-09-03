import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import global from 'window-or-global'
import history from '../../history'
import * as loginActions from './redux'
import * as globalApiActions from '../Settings/redux/global'
import {removeExpiredViewsFromStorage} from '../../util/storageHelperFuncs'
import Login from './Login'
import AdminPages from './Admin'
import { ToastContainer, ToastMessage } from 'react-toastr'

const LoginWrapper = props => {
  const firstRun = useRef([true, true])
  const toasterNode = useRef(null)
  const ToastMessageFactory = useRef(React.createFactory(ToastMessage.animation))

  useEffect(
    () => {
      global.$('body').resize()
      global.$('body').css({ overflow : 'hidden' })
      removeExpiredViewsFromStorage()
      return () => {
        global.$('body').css({ overflow : '' })
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      if (props.location.pathname.startsWith('/admin')) {
        let availableAccountsExist = isAvailableAccountsExist()
        if (!availableAccountsExist ) {
          history.push('/login')
        }
      }
    },
    [props.location.pathname]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (props.auth.toasterMessage) {
        let { isSuccessToaster, toasterMessage } = props.auth
        if (isSuccessToaster ){
          toasterNode.current.success(
            toasterMessage,
            '',
            { timeOut : 1500, extendedTimeOut : 1000 }
          )
        } else {
          toasterNode.current.error(
            toasterMessage,
            '',
            { timeOut : 5000, extendedTimeOut : 2000 }
          )
        }
        props.loginActions.setRootReduxStateProp_multiple({
          toasterMessage: '',
          isSuccessToaster: ''
        })
      }
    },
    [props.auth.toasterMessage]
  )

  function isAvailableAccountsExist () {
    let authToken = JSON.parse(localStorage.getItem('authToken'))
    if (!authToken) {
      return false
    }
    let availableAccounts = authToken['available_accounts']
    if (!Array.isArray(availableAccounts) || !availableAccounts.length ) {
      return false
    }
    return availableAccounts
  }

  let { 
    auth, 
    loginActions, 
    location = {},
    analyticsState
  } = props

  let { pathname = '' } = location

  let availableAccounts = isAvailableAccountsExist()

  let isSelectUser = pathname.startsWith('/admin') && availableAccounts

  return (
    <div className="login-form login-account-form">
      <div className="page-login">
        <div className="page-container">
          <div className="page-content-wrapper"  id="toBlockUnblock">
            <div className="page-content login-fix" style={{ overflowY : 'auto' }}>
              <div className="fade-in-up-removed" id="main-content">
                {
                  !isSelectUser &&
                  <section className="section-account">
                    <div className="img-backdrop"></div>
                    <div className="spacer"></div>
                  </section>
                }
                <div>
                  {
                    !isSelectUser &&
                    <Login
                      loginActions={ loginActions }
                      auth={ auth }
                      onUserSuccessfullyLoggedIn={props.onUserSuccessfullyLoggedIn}
                    />
                  }
                  {

                    isSelectUser &&
                    <AdminPages
                      available_accounts={ availableAccounts }
                      loginActions={ loginActions }
                      globalApiActions={props.globalApiActions}
                      pathname={ pathname }
                      auth={ auth }
                      analyticsState={ analyticsState }
                      location={ location }
                      onUserSuccessfullyLoggedIn={props.onUserSuccessfullyLoggedIn}
                    />
                  }
                  {
                    !isSelectUser &&
                    <div className="version">eFactory 12.3.0 by DCL Logistics</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        ref={toasterNode}
        toastMessageFactory={ToastMessageFactory.current}
        className="toast-bottom-right"
      />
    </div>
  )
}

LoginWrapper.propTypes = {
  auth: PropTypes.object,
  onUserSuccessfullyLoggedIn: PropTypes.func.isRequired
}

export default withRouter(
  connect(
    state => ({
      auth : state.auth,
      analyticsState : state.analytics
    }),
    dispatch => ({
      loginActions : bindActionCreators( loginActions, dispatch ),
      globalApiActions : bindActionCreators( globalApiActions, dispatch )
    })
  )(LoginWrapper)
)