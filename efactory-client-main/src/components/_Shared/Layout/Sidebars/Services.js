import React from 'react'
import { connect } from 'react-redux'
import SidebarTemplate from './SidebarTemplate'
import sidebarConfig from '../Config/sidebar'
import createRouteAppIdsConfig from '../Config/routeAppIdsTable'
import { getUserData } from '../../../../util/storageHelperFuncs'

const Services = props => {
  function processSidebarConfig () {
    let routeAppIdsTable = createRouteAppIdsConfig()
    let { searchBox, menus } = sidebarConfig[ 'administration_tasks' ]
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

  let { badges = {} } = props
  let { searchBox, menus } = processSidebarConfig()
  return (
    <SidebarTemplate
      badges={ badges }
      searchBox={ searchBox }
      menus={ menus }
    />
  )
}

export default connect(
  state => ({
    badges : state.grid.badgeCounterValues
  }),
  null,
  null,
  {
    pure: false
  }
)(Services)