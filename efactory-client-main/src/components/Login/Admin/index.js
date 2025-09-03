import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import ChangeTheme from '../../_Shared/Components/ChangeTheme'
import LoginUser from './LoginUser'
import AnnouncementsTabs from './Announcements'
import OnlineCustomers from './OnlineCustomers'
import LicenseSummary from './LicenseSummary'
import ActiveUsers from './ActiveUsers'
import AnalyticsContent from '../../Analytics/_Content'
import { clearAuthData, getThemeData } from '../../../util/storageHelperFuncs'
import BlockUi from '../../_Shared/Components/BlockPageContent'
import history from '../../../history'

const AdminPages = props => {
  const admin_roles = useRef(getAdminRoles())
  const theme = useRef(getThemeData() || 'darkblue')

  useEffect(
    () => {
      props.globalApiActions.getGlobalApiAsync(true)
    },
    []
  )

  function getAdminRoles () {
    let authToken = JSON.parse( localStorage.getItem('authToken') )
    if( !authToken || !Array.isArray( authToken['admin_roles'] ) ) {
      return []
    }
    return authToken['admin_roles']
  }

  function handleSelectUserLogout (event) {
    clearAuthData()
    props.loginActions.setRootReduxStateProp_multiple({
      isAvailableAccounts : false,
      available_accounts  : []
    }).then(
      () => {
        history.push('/logout')
      }
    )
  }

  let {
    available_accounts = [],
    loginActions,
    pathname,
    auth,
    analyticsState
  } = props

  let { loading } = auth
  let { loading : analyticsState_loading } = analyticsState

  return (
    <div
      id="login-admin-pages"
    >
      <div className="page-header navbar navbar-fixed-top noselect">
        <div className="page-header-inner ">
          <div className="page-logo" style={{ paddingLeft: '0' }}>
            <Link to="/admin/login-user" style={{ marginLeft : '60px' }}>
              <img
                src={ `/src/styles/images/logo-${theme.current}.svg`}
                alt="logo"
                id="dcl_logo"
                className="logo-default change-user-logo"
              />
            </Link>
            <div
              className="btn-group btn-group-refresh"
              style={{
                position: 'absolute',
                right   : '20px',
                top     : '9px'
              }}
            >
              <button
                type="button"
                className="btn bg-red-soft bg-font-green-seagreen"
                onClick={ handleSelectUserLogout }
              >
                LOGOUT
                <i className="icon-circle-right2 position-right "></i>
              </button>
              <button
                type="button"
                className="btn bg-red-soft dropdown-toggle"
                data-toggle="dropdown" data-delay="1000" data-close-others="true"
                aria-expanded="false"
              >
                  <i className="fa fa-angle-down"/>
              </button>
              <ul className="dropdown-menu pull-right" role="menu">
                <li className="">
                  <a
                    data-toggle="modal"
                    href="#change-theme"
                  >
                    <i className="fa fa-adjust font-green-seagreen"/>
                    <span className="">Change theme</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="page-wrapper">
        <div className="page-container" id="pageContainer">
          <div>
            <div id="pageSidebarRR" style={{ position : 'relative', left: '-20px' }}>
              <div className="page-sidebar-wrapper">
                <div className="page-sidebar navbar-collapse collapse noselect">
                  <div>
                    <div className="slimScrollDiv" style={{position: 'relative', overflow: 'hidden', width: 'auto', height: 390}}>
                      <ul className="page-sidebar-menu" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed={1} data-bound="true" data-height={390} data-initialized={1} style={{overflow: 'hidden', width: 'auto', height: 390}}>
                        <div style={{ marginTop: '30px' }}></div>
                        <li
                          className={ classNames({
                            'start nav-item' : true,
                            'active' : pathname === '/admin/login-user'
                          }) }
                        >
                          <Link
                            to="/admin/login-user"
                            className="nav-link nav-toggle"
                          >
                            <i className="fa fa-sign-in"></i>
                            <span className="title">Login to eFactory</span>
                          </Link>
                        </li>
                        {
                          /* admin_roles.current.includes('AN') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/announcement'
                            }) }
                          >
                            <Link
                              to="/admin/announcement"
                              className="nav-link nav-toggle"
                            >
                              <i className="fa fa-bullhorn"></i>
                              <span className="title">Announcements</span>
                            </Link>
                          </li> */
                        }
                        <li
                          className={ classNames({
                            'start nav-item' : true,
                            'active' : pathname === '/admin/online-customers'
                          }) }
                        >
                          <Link
                            to="/admin/online-customers"
                            className="nav-link nav-toggle"
                          >
                            <i className="fa fa-users"></i>
                            <span className="title">Online Customers</span>
                          </Link>
                        </li>
                        {
                          admin_roles.current.includes('LS') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/license-summary'
                            }) }
                          >
                            <Link
                              to="/admin/license-summary"
                              className="nav-link nav-toggle"
                            >
                              <i className="fa fa-dollar"></i>
                              <span className="title">License Summary</span>
                            </Link>
                          </li>
                        }
                        {
                          admin_roles.current.includes('US') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/users'
                            }) }
                          >
                            <Link
                              to="/admin/users"
                              className="nav-link nav-toggle"
                            >
                              <i className="icon-users" style={{ fontWeight: '600' }} />
                              <span className="title">eFactory Users</span>
                            </Link>
                          </li>
                        }
                        {
                          admin_roles.current.includes('PR') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/analytics/profiles/by-time'
                            }) }
                          >
                            <Link
                              to="/admin/analytics/profiles/by-time"
                              className="nav-link nav-toggle"
                            >
                              <i className="fa fa-calendar"></i>
                              <span className="title">By Time</span>
                            </Link>
                          </li>
                        }

                        {
                          admin_roles.current.includes('PR') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/analytics/profiles/by-ship-service'
                            }) }
                          >
                            <Link
                              to="/admin/analytics/profiles/by-ship-service"
                              className="nav-link nav-toggle"
                            >
                              <i className="fa fa-truck"></i>
                              <span className="title">By Ship Service</span>
                            </Link>
                          </li>
                        }

                        {
                          admin_roles.current.includes('PR') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/analytics/profiles/by-channel'
                            }) }
                          >
                            <Link
                              to="/admin/analytics/profiles/by-channel"
                              className="nav-link nav-toggle"
                            >
                              <i className="fa fa-cloud"></i>
                              <span className="title">By Channel</span>
                            </Link>
                          </li>
                        }
                        {
                          admin_roles.current.includes('PR') &&
                          <li
                            className={ classNames({
                              'start nav-item' : true,
                              'active' : pathname === '/admin/analytics/profiles/by-account'
                            }) }
                          >
                            <Link
                              to="/admin/analytics/profiles/by-account"
                              className="nav-link nav-toggle"
                            >
                              <i className="fa fa-cloud"></i>
                              <span className="title">By Account</span>
                            </Link>
                          </li>
                        }
                      </ul>
                      <div className="slimScrollBar" style={{background: 'rgb(187, 187, 187)', width: 7, position: 'absolute', top: 0, opacity: '0.4', display: 'none', borderRadius: 7, zIndex: 99, right: 1, height: 340}} />
                      <div className="slimScrollRail" style={{width: 7, height: '100%', position: 'absolute', top: 0, display: 'none', borderRadius: 7, background: 'rgb(234, 234, 234)', opacity: '0.2', zIndex: 90, right: 1}} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="pageContentRR"
              className={ pathname.includes('/admin') ? 'admin-content-wrapper' : '' }
              style={
                !pathname.includes('/admin')
                ? { position: 'absolute', top: '60px', left: '250px', width: '100%' }
                : {}
              }
            >
              {
                pathname === '/admin/login-user' &&
                <LoginUser
                  available_accounts={ available_accounts }
                  loginActions={ loginActions }
                  onUserSuccessfullyLoggedIn={props.onUserSuccessfullyLoggedIn}
                />
              }
              {
                pathname === '/admin/announcement' &&
                <AnnouncementsTabs />
              }
              {
                pathname === '/admin/online-customers' &&
                <OnlineCustomers
                  loginActions={ loginActions }
                  auth={ auth }
                />
              }
              {
                pathname === '/admin/license-summary' &&
                <LicenseSummary
                  loginActions={ loginActions }
                  auth={ auth }
                />
              }
              {
                pathname === '/admin/users' &&
                <ActiveUsers
                  loginActions={ loginActions }
                  auth={ auth }
                />
              }
              {
                [
                  '/admin/analytics/profiles/by-time',
                  '/admin/analytics/profiles/by-ship-service',
                  '/admin/analytics/profiles/by-channel',
                  '/admin/analytics/profiles/by-account'
                ].includes(pathname)
                &&
                <AnalyticsContent
                  loginActions={loginActions}
                  auth={auth}
                  location={props.location}
                />
              }

              <BlockUi loading={ auth.loadingAdminPage } />
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal modal-themed fade"
        id="change-theme"
        tabIndex="-1"
        role="dialog"
        aria-hidden={true}
        data-backdrop="static"
      >
        <div className="modal-dialog">
          <div className="modal-content" style={{ width: '300px', marginLeft: '150px' }}>
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="modal-title">Change theme</h4>
            </div>
            <div className="modal-body">
              <ChangeTheme isLayoutHidden={ true }  />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <BlockUi
        loading={ loading || analyticsState_loading }
        hideLoadingAnimation={ analyticsState_loading }
      />
    </div>
  )
}

AdminPages.propTypes = {
  available_accounts: PropTypes.array,
  loginActions: PropTypes.object.isRequired,
  globalApiActions: PropTypes.object.isRequired,
  analyticsState: PropTypes.object.isRequired,
  pathname: PropTypes.string,
  auth: PropTypes.object,
  onUserSuccessfullyLoggedIn: PropTypes.func.isRequired
}

export default AdminPages
