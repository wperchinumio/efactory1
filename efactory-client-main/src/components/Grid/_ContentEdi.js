import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ContentEdi2 from './_ContentEdi2'
import * as gridActions from './redux'

class ContentEdi extends Component {

  constructor (props) {
    super(props)
    props.gridActions.initializeGridReduxState(true)
  }

  render () {
    return (
      <ContentEdi2
        {...this.props}
      />
    )
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    gridActions: bindActionCreators(gridActions, dispatch),
  })
)(ContentEdi)