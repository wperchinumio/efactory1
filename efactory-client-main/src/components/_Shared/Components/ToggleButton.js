import React from 'react'
import PropTypes from 'prop-types'

const ToggleButton = props => {
  return (
    <div className="btn-group btn-group-circle">
      <button type="button" className="btn btn-outline green btn-sm">Appove</button>
      <button type="button" className="btn btn-outline red btn-sm">Reject</button>
    </div>
  )
}

export default ToggleButton