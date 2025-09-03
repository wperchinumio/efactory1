import React, { useRef, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import global from 'window-or-global'
import history from '../../../history'
import Header from './SubLayouts/Header'
import MainContent from './SubLayouts/ContentComponent'
import { getThemeData, setThemeData, getLayoutData, setLayoutData, getUserData } from '../../../util/storageHelperFuncs'
import * as globalApiActions from '../../Settings/redux/global'
import * as settingsActions from '../../Settings/redux/settings'
import * as overviewActions from '../../Overview/redux/fulfillments'
import * as customizeOverviewActions from '../../Overview/redux/customizeOverview'
import * as customizeEdiActions from '../../Edi/CustomizeView/redux'
import * as ediActions from '../../Edi/redux'
import getSidebarForPathname from './Sidebars/getSidebarForPathname'
import { useForceUpdate } from '../hooks'

const CommonLayout = props => {
  const forceUpdate = useForceUpdate()
  const unlisten = useRef(null)
  const refresher1 = useRef(null)
  const refresher2 = useRef(null)
  const refresher3 = useRef(null)

  useEffect(
    () => {
      setOverviewLayoutConfig()
      initUiSettings()
      refresher1.current = setInterval(
        () => props.overviewActions.getFulfillmentsAsync(true),
        300000
      )
      refresher2.current = setInterval( () => props.overviewActions.getAnnouncementBadgeValue(true) , 120000)
      refresher3.current = setInterval(
        () => {
          let visibleAppIdsArray = getUserData('apps') || []
          if (visibleAppIdsArray.includes(52)) {
            props.settingsActions.getTradingPartners()
            props.ediActions.fetchEdiOverview()
          }
        }, 
        900000
      )
      global.App.initComponents()
      let is_valid_email_address = getUserData('is_valid_email_address')
      let is_local_admin = getUserData('is_local_admin')
      if (!is_local_admin && !is_valid_email_address) {
        global.notific8(
           'To update your e-mail address, go to "<b>My Profile</b>" and choose "<b>Update e-mail address</b>".', 
           { 
             sticky: true,
             heading: 'Missing e-mail address',
             color: 'ruby',
             theme:'chicchat'
           }
        )
      }
      let visibleAppIdsArray = getUserData('apps') || []
      const { pathname } = props.location || {}
      if (pathname !== '/overview') {
        props.overviewActions.getFulfillmentsAsync( true, false, false )
        props.overviewActions.getAnnouncementBadgeValue(true)
      }
      if (visibleAppIdsArray.includes(52)) {
        props.settingsActions.getTradingPartners()
        if (pathname !== '/edi/overview') {
          props.ediActions.fetchEdiOverview()
        }
      }
      props.globalApiActions.getGlobalApiAsync()
      /***
      since we will toggle classes , we check one of the options
      in this case, we check if layout is boxed, and we check if
      body has page-boxed class. This is enough to check if the layout
      and corresponding classes match. This logic assumes noone changes
      layout from localstorage manually !!
      ***/
      let bodyEl = global.$('body'),
          pageHeaderInnerEl = global.$('.page-header-inner'),
          pageContainerEl = global.$('#pageContainer')
      /* toggle classes */
      let currentLayout = getLayoutData()
      if(currentLayout === 'boxed' && !bodyEl.attr('class').includes('page-boxed')) {
          bodyEl.toggleClass( 'page-boxed' )
          pageHeaderInnerEl.toggleClass( 'container' )
          pageContainerEl.toggleClass( 'container' ).toggleClass( 'page-container' )
          forceUpdate()
      }

      // listen route changes
      unlisten.current = history.listen( location => {
        let { pathname }  = props.location
        // if filter_id to remember exist and next pathname doesn t match the route, delete it
        let remember_filter_id            = localStorage.getItem('remember_filter_id')
        let remember_filter_id_for_route  = localStorage.getItem('remember_filter_id_for_route')
        if (remember_filter_id && remember_filter_id_for_route && pathname !== remember_filter_id_for_route) {
          localStorage.removeItem('remember_filter_id')
          localStorage.removeItem('remember_filter_id_for_route')
        }
        let { filter_id } = props.grid.fetchRowsParams
        // if next route is one of two routes, set remember_filter_id and remember_filter_id_for_route 
        // so that if next route matches 'remember_filter_id_for_route'
        if (filter_id && ( pathname.includes('/view/') || pathname.includes('/manage-filters') )) {
          localStorage.setItem('remember_filter_id', filter_id )
          localStorage.setItem('remember_filter_id_for_route', pathname )
        }
        
      })
      return () => {
        clearInterval(refresher1.current)
        clearInterval(refresher2.current)
        clearInterval(refresher3.current)
        
        let bodyEl = global.$('body'),
            pageHeaderInnerEl = global.$('.page-header-inner'),
            pageContainerEl = global.$('#pageContainer')
        if (bodyEl.attr('class').includes('page-boxed')) {
          bodyEl.toggleClass( 'page-boxed' )
          pageHeaderInnerEl.toggleClass( 'container' )
          pageContainerEl.toggleClass( 'container' ).toggleClass( 'page-container' )
        }
        unlisten.current()
      }
    },
    []
  )

  useEffect(
    () => {
      if (document.querySelector("body").className.indexOf("page-content-white page-sidebar-closed") !== -1) {
        global.$('.page-sidebar-menu').addClass("page-sidebar-menu-closed")
      }
    }
  )

  function setOverviewLayoutConfig () {
    let overview_layout = getUserData('overview_layout')
    let { areas = [] } = overview_layout || {}
    let areas_string = JSON.stringify( areas )
    props.customizeOverviewActions.setRootReduxStateProp_multiple({
      current_areas: [ ...JSON.parse( areas_string ) ],
      current_areas_for_overview: [ ...JSON.parse( areas_string ) ],
    })
    let edi_layout = getUserData('edi_overview_layout')
    let { areas: areas2  } = edi_layout || {}
    areas2 = Array.isArray( areas2 ) ? areas2 : []
    let areas_string_2 = JSON.stringify( areas2 )
    props.customizeEdiActions.setRootReduxStateProp_multiple({
      current_areas: [ ...JSON.parse( areas_string_2 ) ],
      current_areas_for_edi: [ ...JSON.parse( areas_string_2 ) ],
    })
  }

  function initUiSettings () {
    let selectedTheme = getThemeData()
    let selectedLayout = getLayoutData()
    if (!selectedTheme ) setThemeData('darkblue')
    if (!selectedLayout ) setLayoutData('fluid')
  }

  let { location, children } = props
  return (
    <div>
      <Header/>
      <div className="page-wrapper">
        <div className="page-container" id="pageContainer">
          { getSidebarForPathname(location.pathname) }
          <MainContent>
            { children }
          </MainContent>
        </div>
      </div>
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      globalApi: state.common.globalApi,
      grid: state.grid
    }),
    dispatch => ({
      globalApiActions: bindActionCreators( globalApiActions, dispatch ),
      overviewActions: bindActionCreators( overviewActions, dispatch ),
      settingsActions: bindActionCreators( settingsActions, dispatch ),
      ediActions: bindActionCreators( ediActions, dispatch ),
      customizeOverviewActions: bindActionCreators( customizeOverviewActions, dispatch ),
      customizeEdiActions: bindActionCreators( customizeEdiActions, dispatch ),
    })
  )(CommonLayout)
)