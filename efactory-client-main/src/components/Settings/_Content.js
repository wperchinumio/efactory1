import React, { useRef, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as settingActions from './redux/settings'
import Settings from './components/Settings'
import ViewTypeConfig from './ViewTypeConfig'

const SettingsContent = props => {
  const rootPathRef = useRef(props.location.pathname.slice(0, props.location.pathname.indexOf('/view')))

  useEffect(
    () => {
      let rootPath = rootPathRef.current.startsWith('/') ? rootPathRef.current.slice(1) : rootPathRef.current
      let path = rootPath.split('/')
      let viewType = path.reduce(
        ( prev,next ) => prev[ next ] ? prev[ next ] : prev,
        ViewTypeConfig
      )
      let viewId = props.location.pathname.slice( props.location.pathname.lastIndexOf("/") + 1 )
      props.settingActions.getDetailsAsync( viewType, viewId )
    },
    []
  )

  return(
    <Settings
      settings={props.settings}
      rootPath={rootPathRef.current}
      details={props.settings.loadedDetails}
      initialOrder={props.settings.initialOrder}
      changedOrder={props.settings.changedOrder}
      activeSelectedRowId={props.settings.activeSelectedRowId}
      activeAvailableRowId={props.settings.activeAvailableRowId}
      settingActions={props.settingActions}
      dispatch={props.dispatch}
    />
  )
}

export default withRouter(
  connect( 
    state => ({
      settings : state.common.settings,
      views : state.common.views
    }),
    dispatch => ({
      settingActions : bindActionCreators(settingActions, dispatch)
    })
  )(SettingsContent)
)