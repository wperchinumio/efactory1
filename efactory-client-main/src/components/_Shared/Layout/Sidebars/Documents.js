import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SidebarTemplate from './SidebarTemplate'
import sidebarConfig from '../Config/sidebar'
import createRouteAppIdsConfig from '../Config/routeAppIdsTable'
import { getUserData } from '../../../../util/storageHelperFuncs'
import * as documentsActions from '../../../Documents/redux/documentRecords'

const DocumentsSidebar = props => {
  useEffect(
    () => {
      props.documentsActions.getDiskUsage()
    },
    []
  )

  function processSidebarConfig () {
    let routeAppIdsTable = createRouteAppIdsConfig()
    let { searchBox, menus } = sidebarConfig[ 'documents' ]
    menus = [ ...menus ]
    let visibleAppIdsArray = getUserData('apps') || []
    menus = menus.map( menu => {
      let { dropdownMenus = [], route } = menu
      if( dropdownMenus.length ){
        dropdownMenus = dropdownMenus.filter( d => {
          let { route, notImplemented } = d
          if( route ){
            return visibleAppIdsArray.includes( routeAppIdsTable[ route ] )
          }else if( notImplemented ){
            return true
          } 
          return false
        } )
        if( !dropdownMenus.length ) return false
      }else if( route && !visibleAppIdsArray.includes( routeAppIdsTable[ route ] ) ){
        return false
      }
      return {
        ...menu,
        dropdownMenus
      }
    } )
    menus = menus.filter( menu => menu !== false )
    return {
      searchBox,
      menus
    }
  }

  let { diskUsage } = props

  let { searchBox, menus } = processSidebarConfig()

  return (
    <SidebarTemplate
      badges={ {} }
      searchBox={ searchBox }
      menus={ menus }
      diskUsage={ diskUsage }
    />
  )
}

export default connect(
  state => ({
    diskUsage : state.documents.documents.disk_usage,
    badges : state.grid.badgeCounterValues
  }),
  dispatch => ({
    documentsActions : bindActionCreators(documentsActions, dispatch )
  }),
  null,
  {
    pure: false
  }
)(DocumentsSidebar)