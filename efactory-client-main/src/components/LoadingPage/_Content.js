import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as authActions from '../Login/redux'

const LoadingPageMain = () => {
  useEffect(
    () => {
      if (!window.intended_route || window.intended_route === '/loading') {
        window.intended_route = '/overview'
      }
      return () => {
        global.$('#loading-page-wrapper').remove()
      }
    },
    []
  )
  return <div />
}

export default connect(
  null,
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(LoadingPageMain)