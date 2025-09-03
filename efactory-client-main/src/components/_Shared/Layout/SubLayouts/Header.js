import React, { useRef, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../../../Login/redux'
import history from '../../../../history'
import Profile from '../../../Profile/ProfileDialog'
import ContactForm from '../../../ContactForm/ContactFormDialog'
import {
  getUserData,
  getAuthData,
  getThemeData
} from '../../../../util/storageHelperFuncs'
import global from 'window-or-global'
import classNames from 'classnames'
import headerConfig from '../Config/header'
import createRouteAppIdsConfig from '../Config/routeAppIdsTable'
import notImplementedAppIds from '../Config/notImplementedAppIds'

const PageHeader = props => {
  const firstRun = useRef(true)
  const servicesTab = useRef(null)

  useEffect(
    () => {
      global.Layout.initSidebar(true)
      return () => {
        global.$('body').removeClass('page-sidebar-closed')
      }
    },
    []
  )

  useEffect(
    () => {
      let body = global.$('body')
      if (body && body.hasClass('page-sidebar-closed')) {// CHANGED
        global.$('body').find('.page-sidebar-menu').addClass('page-sidebar-menu-closed')
      }
    }
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setTimeout( () => {
          global.window.requestAnimationFrame( () => {
            global.Layout.initSidebar(true)
          } )
      }, 0 )
    },
    [props.location.pathname]
  )

  function handleChangeUser () {
    props.authActions.listAccounts().then(
      () => {
        history.push('/logout-admin')
      }
    ).catch(
      () => {
        console.error('Error occured while changing the user. Forced logout.')
        handleLogout()
      }
    )
  }

  function handleLogout () {
    global.notific8( 'destroy' )
    history.push("/logout")
  }

  function currentTheme () {
    let theme = getThemeData()
    return theme || 'darkblue'
  }

  function getVisibleSectionIds (sectionKeyword) {
    if( !sectionKeyword ){
      console.error('<sectionKeyword> is required.')
      return []
    }
    let visibleAppIds = getUserData('apps') || []
    visibleAppIds = [ ...visibleAppIds, 2 ]
    let sectionAppIdsArray = headerConfig[ sectionKeyword ] || []
    sectionAppIdsArray = sectionAppIdsArray.filter(
      app_id => visibleAppIds.includes( app_id )
    )
    return sectionAppIdsArray
  }

  function matchAppIdToRoute (appId) {
    let routeAppIdsTable = createRouteAppIdsConfig()
    return Object.keys( routeAppIdsTable ).filter(
      route => routeAppIdsTable[ route ] === appId
    )[ 0 ] || ''
  }

  function getFirstMatchesArray (arrayToSearch, itemsToSearch) {
    if( !itemsToSearch.length ) return -1
    itemsToSearch = itemsToSearch.filter( app_id => !notImplementedAppIds.includes(app_id) )
    if( !itemsToSearch.length ) return -1
    return arrayToSearch.includes( itemsToSearch[ 0 ] )
           ? itemsToSearch[ 0 ]
           : getFirstMatchesArray( arrayToSearch, itemsToSearch.slice(1) )
  }

  let { pathname } = props.location

  let routeAppIdsTable = createRouteAppIdsConfig()
  let currentRouteAppId = routeAppIdsTable[ pathname ] || '0'

  let authData = getAuthData()
  // visible section ids
  let overview        = getVisibleSectionIds('overview') || []
  let orders          = getVisibleSectionIds('orders') || []
  let items           = getVisibleSectionIds('items') || []
  let orderpoints     = getVisibleSectionIds('orderpoints') || []
  let returntrak      = getVisibleSectionIds('returntrak') || []
  let analytics       = getVisibleSectionIds('analytics') || []
  let services        = getVisibleSectionIds('services') || []
  let edi             = getVisibleSectionIds('edi') || []
  let transportation  = getVisibleSectionIds('transportation') || []


  let name = getUserData('name')

  let is_local_admin = getUserData('is_local_admin')
  let is_valid_email_address = getUserData('is_valid_email_address')

   /*let {
     badgeCounterValues = {}
   } = props
   let announcementBadgeValue = badgeCounterValues[ '/announcements' ] || 0
   */


  return (
    <div id="pageHeaderRR">
      <Profile />
      <ContactForm />
      <div className="page-header navbar navbar-fixed-top noselect">
        <div className="page-header-inner ">
            <div className="page-logo hidden-sm hidden-xs">
              <Link to={ matchAppIdToRoute( overview[ 0 ] ) }>
                <img
                  src={ `/src/styles/images/logo-${currentTheme()}.svg`}
                  alt="logo"
                  id="dcl_logo"
                  className="logo-default"
                />
              </Link>
              <div className="menu-toggler sidebar-toggler">
                <span></span>
              </div>
            </div>
            <a href="#" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
              <span></span>
            </a>
            <div className="top-menu visible-xs left-menu">
              <ul className="nav navbar-nav">
                <li className="dropdown font-white">
                  <span className="span-menu dropdown-toggle" data-toggle="dropdown" data-close-others="true">
                    <span> Main Menu </span>
                    <i className="fa fa-angle-down"></i>
                  </span>
                  <ul className="dropdown-menu">
                    {
                      overview.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : overview.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( overview[ 0 ] ) }> Overview
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                      orders.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : orders.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( orders[ 0 ] ) }> Orders
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                      items.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : items.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( items[ 0 ] ) }> Items
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                      returntrak.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : returntrak.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( returntrak[ 0 ] ) }> ReturnTrak
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                      orderpoints.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : orderpoints.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( orderpoints[ 0 ] ) }> OrderPoints
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                      edi.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : edi.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( edi[ 0 ] ) }> EDI Central
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                      analytics.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : analytics.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( analytics[ 0 ] ) }> Analytics
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                    {
                       !!getUserData('is_local_admin') && transportation.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : transportation.includes( currentRouteAppId ),
                        })}
                      >
                        <Link to={ matchAppIdToRoute( transportation[ 0 ] ) }> Transportation
                          <span className="selected"> </span>
                        </Link>
                      </li>
                    }
                  </ul>
                </li>
              </ul>
            </div>
            <div className="hor-menu hidden-xs">
                <ul className="nav navbar-nav">

                    {
                      overview.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : overview.includes( currentRouteAppId ),
                          "classic-menu-dropdown" : true
                        })}
                      >
                          <Link to={ matchAppIdToRoute( overview[ 0 ] ) }> Overview
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      orders.length > 0 &&
                      <li
                        className={ classNames({
                          "classic-menu-dropdown" : true,
                          'active' : orders.includes( currentRouteAppId ),
                        })}
                      >
                          <Link to={ matchAppIdToRoute( orders[ 0 ] ) }> Orders
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      items.length > 0 &&
                      <li
                        className={ classNames({
                          "classic-menu-dropdown" : true,
                          'active' : items.includes( currentRouteAppId ),
                        })}
                      >
                          <Link to={ matchAppIdToRoute( items[ 0 ] ) }> Items
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      returntrak.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : returntrak.includes( currentRouteAppId ),
                          "classic-menu-dropdown" : true,
                        })}
                      >
                          <Link to={ matchAppIdToRoute( returntrak[ 0 ] ) }> ReturnTrak
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      orderpoints.length > 0 &&
                      <li
                        className={ classNames({
                          "classic-menu-dropdown" : true,
                          'active' : orderpoints.includes( currentRouteAppId ),
                        })}
                      >
                          <Link to={ matchAppIdToRoute( orderpoints[ 0 ] ) }> OrderPoints
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      edi.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : edi.includes( currentRouteAppId ),
                          "classic-menu-dropdown" : true,
                        })}
                      >
                          <Link to={ matchAppIdToRoute( edi[ 0 ] ) }> EDI Central
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      analytics.length > 0 &&
                      <li
                        className={ classNames({
                          'active' : analytics.includes( currentRouteAppId ),
                          "classic-menu-dropdown" : true,
                        })}
                      >
                          <Link to={ matchAppIdToRoute( analytics[ 0 ] ) }> Analytics
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                       !!getUserData('is_local_admin') && transportation.length > 0 &&
                      <li
                        className={ classNames({
                          "classic-menu-dropdown" : true,
                          'active' : transportation.includes( currentRouteAppId ),
                        })}
                      >
                          <Link to={ matchAppIdToRoute( transportation[ 0 ] ) }> Transportation
                              <span className="selected"> </span>
                          </Link>
                      </li>
                    }

                    {
                      services.length > 0 &&
                      <li
                        className={ classNames({
                          "mega-menu-dropdown" : true,
                          'active' : services.includes( currentRouteAppId )
                        })}
                        ref={servicesTab}
                      >
                          <a className="dropdown-toggle" data-toggle="dropdown" data-close-others="true"> Services
                              <i className="fa fa-angle-down"></i>
                          </a>
                          <ul className="dropdown-menu">
                              <li>
                                  <div className="mega-menu-content">
                                      <div className="row">

                                        {

                                          (
                                            services.includes(62) ||

                                            services.includes(67) ||
                                            services.includes(65) ||
                                            services.includes(66) ||

                                            services.includes(68) ||
                                            services.includes(69) ||

                                            services.includes(77) ||
                                            services.includes(78) ||
                                            services.includes(79) ||
                                            services.includes(80) ||
                                            services.includes(81) ||
                                            services.includes(99992)
                                          )
                                          &&
                                          <div className="col-md-12">
                                              <ul className="mega-menu-submenu">

                                                {
                                                  services.includes(62) &&
                                                  <li>
                                                    <h3 className="services-title">Communications</h3>
                                                  </li>
                                                }

                                                <li
                                                  className={ classNames({
                                                    'active' : currentRouteAppId === 62,
                                                    'not-visible' : !services.includes(62)
                                                  }) }
                                                  onClick={ event =>  {
                                                              servicesTab.current.classList.remove('open')}
                                                          }
                                                  >
                                                  <Link to="/documents"><i className="icon-folder-alt"></i> Documents</Link>
                                                </li>



                                                {
                                                  (
                                                    services.includes(67) ||
                                                    services.includes(65) ||
                                                    services.includes(66) ||

                                                    services.includes(68) ||
                                                    services.includes(69) ||

                                                    services.includes(77) ||
                                                    services.includes(78) ||
                                                    services.includes(79) ||
                                                    services.includes(80) ||
                                                    services.includes(81) ||
                                                    services.includes(99992)
                                                  ) &&
                                                  <li>
                                                    <h3 className="services-title">Setup</h3>
                                                  </li>
                                                }
                                                <li
                                                  className={ classNames({
                                                    'active' : (
                                                              currentRouteAppId === 65 ||
                                                              currentRouteAppId === 66 ||
                                                              currentRouteAppId === 67 ||

                                                              currentRouteAppId === 68 ||
                                                              currentRouteAppId === 69 ||

                                                              currentRouteAppId === 77 ||
                                                              currentRouteAppId === 78 ||
                                                              currentRouteAppId === 79 ||
                                                              currentRouteAppId === 80 ||
                                                              currentRouteAppId === 81 ||
                                                              currentRouteAppId === 99992
                                                            ),
                                                    'not-visible' : !(
                                                              services.includes(65) ||
                                                              services.includes(66) ||
                                                              services.includes(67) ||

                                                              services.includes(68) ||
                                                              services.includes(69) ||

                                                              services.includes(77) ||
                                                              services.includes(78) ||
                                                              services.includes(79) ||
                                                              services.includes(80) ||
                                                              services.includes(81) ||
                                                              services.includes(99992)
                                                            )
                                                  }) }
                                                  onClick={ event =>  {
                                                              servicesTab.current.classList.remove('open')}
                                                          }
                                                  >
                                                  <Link to={ matchAppIdToRoute( getFirstMatchesArray( services, [ 67, 65, 66, 68, 69, 77, 78, 79, 80, 81, 99992 ] ) ) }>
                                                    <i className="icon-lock">
                                                    </i> Administration Tasks
                                                  </Link>
                                                </li>
                                              </ul>
                                          </div>
                                        }

                                      </div>
                                  </div>
                              </li>
                          </ul>
                      </li>
                    }
                </ul>
            </div>
            <div className="top-menu">
                <ul className="nav navbar-nav pull-right">
                    {
                      /* announcementBadgeValue > 0 &&
                      !(
                        authData && authData.user_data && authData.user_data.is_local_admin
                      ) &&
                      <li
                        className="dropdown dropdown-extended dropdown-notification"
                        style={{ width: '50px', overflow: 'hidden' }}
                      >
                        <Link
                          to="/announcements"
                          className="dropdown-toggle"
                          style={{
                            width: "50px",
                            height : '100%',
                            marginLeft : '-4px',
                            textAlign : 'center'
                          }}
                        >
                          <i className="fa fa-bullhorn"></i>
                            <span className="badge badge-danger" style={{ right : '25px' }}>
                              { announcementBadgeValue }
                            </span>
                        </Link>
                        <a >

                        </a>
                      </li> */
                    }
                    <li className="dropdown dropdown-user">
                        <span className="span-menu dropdown-toggle" data-toggle="dropdown" data-close-others="true">
                          <i
                            className={ classNames({
                              'fa fa-user' : true,
                              'font-white' : !is_local_admin || is_valid_email_address,
                              'font-red' : is_local_admin && !is_valid_email_address
                            }) }
                          />&nbsp;
                          <span className="username username-hide-on-mobile"> { name } </span>
                          <i className="fa fa-angle-down"></i>
                        </span>
                        <ul className="dropdown-menu dropdown-menu-default">
                            <li>
                                <a data-toggle="modal" href="#profile"><i className="icon-user"></i> My Profile</a>
                            </li>

                            <li
                              className={ classNames({
                                'active' : pathname === '/team-members'
                              }) }
                              >
                              <Link to="/team-members" >
                                <i className="icon-users"></i> Team Members
                              </Link>
                            </li>

                            <li>
                              <a data-toggle="modal" href="#contact"><i className="fa fa-comments"></i> Leave a feedback</a>
                            </li>
                            <li className="divider"> </li>
                            <li>
                                <a  data-toggle="modal" href="#change-my-password-user">
                                  <i className="icon-key"></i> Change Password...
                                </a>
                            </li>


                            {
                              authData && authData.user_data && authData.user_data.is_local_admin &&
                              <li className="divider"> </li>
                            }

                            {
                              authData && authData.user_data && authData.user_data.is_local_admin &&
                              <li onClick={handleChangeUser}>
                                <a className="bold">
                                  <i className="fa fa-th-large dcl-menu-icon"></i> Back to DCL Menu
                                </a>
                              </li>
                            }
                            <li onClick={handleLogout}>
                                <a className="bg-red-soft bg-font-red-soft">
                                  <i className="fa fa-sign-out bg-font-red-soft"></i> Log Out
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
          </div>
        </div>
      <div className="clearfix"> </div>
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      badgeCounterValues: state.grid.badgeCounterValues
    }),
    dispatch => ({
      authActions: bindActionCreators( authActions, dispatch )
    })
  )(PageHeader)
)
