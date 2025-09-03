import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gridActions from '../Grid/redux'

const FilterLink = props => {
  function onFilterLinkClicked () {
    let { gridActions, filters } = props
    gridActions.setQueryFilters( filters )
  }

  let { 
    to,
    className,
    children,
    style
  } = props
  return (
    <div 
      onClick={ onFilterLinkClicked }
      style={ style }
    >
      <Link 
        to={to} 
        className={className}
      > 
        { children } 
      </Link>
    </div>
  )
}

FilterLink.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  filters: PropTypes.object,
  to: PropTypes.string.isRequired,
  style: PropTypes.object
}

export default connect( 
  state     => ({}),
  dispatch  => ({
    gridActions : bindActionCreators( gridActions, dispatch )
  })
)(FilterLink)