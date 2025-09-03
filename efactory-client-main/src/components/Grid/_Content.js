import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Content2 from './_Content2'
import * as gridActions from './redux'

class GridContent extends Component {

  constructor (props) {
    super(props)
    props.gridActions.initializeGridReduxState(true)
  }

  render () {
    return (
      <Content2 
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
)(GridContent)