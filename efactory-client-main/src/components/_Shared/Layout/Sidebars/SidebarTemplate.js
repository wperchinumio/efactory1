import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import history from '../../../../history'
import SidebarOrderSearch from './OrderSearch'

const SidebarTemplate = props => {
  const [collapseState, setCollapseState] = useState({})

  const onMouseEnter = useCallback(
    () => {
      var body = global.$('body');
      if ( body.hasClass('page-sidebar-closed') ){
        global.$('.page-sidebar-menu').removeClass('page-sidebar-menu-closed')
      }
    },
    []
  )

  const onMouseLeave = useCallback(
    () => {
      var body = global.$('body');
      if (body.hasClass('page-sidebar-closed')) {
        global.$('.page-sidebar-menu').addClass('page-sidebar-menu-closed');
      }
    },
    []
  )

  useEffect(
    () => {
      global.$('.page-sidebar').on('mouseenter', onMouseEnter)
      global.$('.page-sidebar').on('mouseleave', onMouseLeave)
      determineCollapseState()
      return () => {
        global.$('.page-sidebar').off('mouseenter', onMouseEnter)
        global.$('.page-sidebar').off('mouseleave', onMouseLeave)
      }
    },
    []
  )

  useEffect(
    () => {
      toggleCollapseStateForActiveRouteIfNeeded()
    },
    [props.location.pathname]
  )

  function determineCollapseState () {
    let { menus } = props
    let menusMatchCurrentRoute = menus.filter( menu => {
      let { 
        notImplemented, 
        dropdownMenus = [] 
      } = menu
      if( notImplemented ) return false
      if( dropdownMenus.length > 0 ){ // isDropDown
        return isDropdownActive( dropdownMenus )
      }
      return false
    } )
    let collapseStateNext = {}
    if( menusMatchCurrentRoute.length === 1 ){
      let matched = menusMatchCurrentRoute[ 0 ]
      collapseStateNext[ matched.keyword ] = true
    }
    let dropdownsDefaultOpen = menus.filter(
      ({ isDropdownOpenDefault, notImplemented, dropdownMenus = []  }) => {
        return !notImplemented && dropdownMenus.length > 0 && isDropdownOpenDefault 
      }
    )
    dropdownsDefaultOpen.forEach( d => { 
      collapseStateNext[ d.keyword ] = true
    } )
    setCollapseState(collapseStateNext)
    return collapseStateNext
  }

  function toggleCollapseStateForActiveRouteIfNeeded () {
    let { menus } = props
    let menusMatchCurrentRoute = menus.filter( menu => {
      let { 
        notImplemented, 
        dropdownMenus = [] 
      } = menu
      if( notImplemented ) return false
      if( dropdownMenus.length > 0 ){ // isDropDown
        return isDropdownActive(dropdownMenus)
      }
      return false
    } )
    let collapseStateNext = {}
    if( menusMatchCurrentRoute.length === 1 ){
      let matched = menusMatchCurrentRoute[ 0 ]
      collapseStateNext[ matched.keyword ] = true
      setCollapseState({ ...collapseState, ...collapseStateNext })
    }
  }
  
  function isDropdownActive (dropdownMenus) {
    let { pathname } = props.location
    dropdownMenus = dropdownMenus.filter( 
      d => !d.notImplemented && d.route === pathname
    )
    return dropdownMenus.length > 0
  }

  function isActive (route, availableRoutes) {
    let { pathname } = props.location
    if( availableRoutes && Array.isArray( availableRoutes ) ){
      return availableRoutes.includes( pathname )
    }
    return route === pathname
  }

  let { 
    menus     = [],
    searchBox = '',
    badges = {},
    diskUsage, 
    //ediCentral = false
  } = props

  return (
    <div id="pageSidebarRR">
      <div className="page-sidebar-wrapper" >
        <div className="page-sidebar navbar-collapse collapse noselect">
          <div>
            <div className="slimScrollDiv fulfillmentSidebar">
              <ul 
                className="page-sidebar-menu" 
                data-keep-expanded="false" 
                data-auto-scroll="true" 
                data-slide-speed="1"  
                data-bound="true" 
                data-initialized="1"
              >
                {
                  searchBox &&
                  <li className="sidebar-search-wrapper">
                    <SidebarOrderSearch detailType={ searchBox } />  
                  </li>
                }
                {
                  !searchBox &&
                  <div style={{ marginTop : '30px' }}></div>
                }
                {
                  menus.map( ( menu, index ) => {
                    let menuJSX = []
                    let {
                      keyword = '',
                      iconClassName = '',
                      badge = '',
                      badgeClassName = '',
                      sectionTitleBefore = '',
                      title = '',
                      route = '',
                      availableRoutes,
                      notImplemented = '',
                      dropdownMenus = []
                    } = menu
                    let isDropdown = dropdownMenus.length > 0
                    if( sectionTitleBefore ){
                      if( diskUsage && sectionTitleBefore === 'HELP' ){
                        menuJSX.push(
                          <li key={`diskUsage-1-${index}`} >
                              <span className="sidebar-section-title font-green-meadow">DISK USAGE</span>
                          </li>
                        )
                        menuJSX.push(
                          <li 
                            key={`diskUsage-2-${index}`} 
                            className={ classNames({
                              'start nav-item' : true
                            }) }>
                            <a id="disk-usage" className="nav-toggle">
                              <i className="fa fa-pie-chart font-yellow-gold"></i>
                              <span className="title">Total:</span>
                              <label className="pull-right">{diskUsage.total}</label>
                            </a>
                          </li>
                        )
                        menuJSX.push(
                          <li 
                            key={`diskUsage-3-${index}`} 
                            className={ classNames({
                              'start nav-item' : true
                            }) }>
                            <a id="disk-usage" className="nav-toggle" style={{paddingTop: 0}}>
                              <i className="fa fa-recycle font-yellow-gold"></i>
                              <span className="title">Recycle:</span>
                              <label className="pull-right">{diskUsage.recycle}</label>
                            </a>
                          </li>
                        )
                      }
                      menuJSX.push(
                        <li key={`4-${index}`}> 
                           <span className="sidebar-section-title">
                            {
                              sectionTitleBefore
                            }
                           </span>
                        </li>
                      )
                    }
                    menuJSX.push( (
                      <li 
                        key={`diskUsage-5-${index}`} 
                        className={ classNames({
                          'start nav-item' : true,
                          'active' :  !notImplemented 
                                      ? isDropdown 
                                       ? isDropdownActive( dropdownMenus ) 
                                       : isActive( route, availableRoutes )
                                      : false,
                          'open' :  isDropdown && collapseState[ keyword ]
                        }) }
                      >
                        <a 
                          className="nav-link nav-toggle"
                          href={ route && route.includes('https') ? route : '' }
                          target={ route && route.includes('https') ? '_blank' : '_self' }
                          onClick={
                            event => {
                              if( route && route.includes('https') ) return 
                              event.preventDefault()
                              if( notImplemented ) {
                                return
                              }
                              if( isDropdown ){
                                setCollapseState({
                                  ...collapseState,
                                  [keyword]: collapseState[keyword] ? false : true
                                })
                                return
                              }
                              if( route && route.includes('https') ) return 
                              history.push( route )
                            }
                          }
                        >
                          <i className={ iconClassName }></i>
                          <span 
                            className="title" 
                            dangerouslySetInnerHTML={{ __html: notImplemented ? `[${title}]` : title }}
                          />
                          { 
                            badge &&
                            badges[ badge ] > 0 && 
                            <span 
                              className={ badgeClassName }
                            > 
                              { badges[ badge ] }
                            </span> 
                          }
                          {
                            isDropdown &&
                            <span 
                              className={ classNames({
                                'arrow' : true,
                                'open'  : collapseState[ keyword ]
                              }) }
                            >
                            </span> 
                          }
                       </a>
                       {
                        isDropdown &&
                        <ul 
                          className="sub-menu" 
                          style={  collapseState[ keyword ] 
                                   ? {display:"block"} 
                                   : {display:"none"}
                          }
                        >
                          {
                            dropdownMenus.map( dropdownMenu => {

                              let {
                                keyword : keyword_,
                                route : route_,
                                title : title_,
                                badge : badge_,
                                badgeClassName : badgeClassName_,
                                notImplemented : notImplemented_,
                                availableRoutes : availableRoutes_
                              } = dropdownMenu

                              return (
                                <li 
                                  className={ classNames({ 
                                    'active' : isActive( route_, availableRoutes_ ) 
                                  }) }
                                  key={ `sbar-ddown--${ keyword }-${ keyword_ }` }
                                >
                                  <a onClick={ event => {
                                    event.preventDefault()
                                    if( notImplemented_ ) return
                                    history.push( route_ )
                                  } }>
                                    
                                    <span
                                      dangerouslySetInnerHTML={{ 
                                        __html: notImplemented_ ? `[${title_}]` : title_
                                      }}
                                    />
                                    
                                    { 
                                      badge_ &&
                                      badges[ badge_ ] > 0 && 
                                      <span 
                                        className={ badgeClassName_ }
                                      > 
                                        { badges[ badge_ ] } 
                                      </span> 
                                    }
                                  </a>
                                </li>
                              )
                            } )
                          }
                        </ul>
                       }
                      </li>
                      ) )
                      return menuJSX
                    } )
                  }
               </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SidebarTemplate.propTypes = {
  searchBox: PropTypes.oneOf( [ 'order', 'item', 'rma', '' ] ),
  location: PropTypes.object.isRequired,
  menus: PropTypes.arrayOf( PropTypes.shape({
    keyword: PropTypes.string.isRequired,
    iconClassName: PropTypes.string.isRequired,
    badge: PropTypes.string,
    sectionTitleBefore: PropTypes.string,
    title: PropTypes.string.isRequired,
    route: PropTypes.string,
    dropdownsDefaultOpen: PropTypes.bool,
    notImplemented: PropTypes.bool,
    dropdownMenus: PropTypes.arrayOf( PropTypes.shape({
      route: PropTypes.string,
      title: PropTypes.string,
      badge: PropTypes.string,
      badgeClassName: PropTypes.string,
      notImplemented: PropTypes.bool
    }) )
  }) ),
  diskUsage: PropTypes.any
}

export default withRouter(SidebarTemplate)