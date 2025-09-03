import React from 'react'
import PropTypes from 'prop-types'

const Bar = props => {
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-calendar"></i>
            { ' ' }
            <span className="sbold">
              FTP BATCHES
            </span>
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button 
          type="button" 
          className="btn btn-topbar btn-sm"
          onClick={ props.listBatches }
          style={{ marginRight : '10px' }}
        >
          <i className="fa fa-refresh"></i> Refresh
        </button>
      </div>
    </div>
  )
}

Bar.propTypes = {
  listBatches: PropTypes.func.isRequired
}

export default Bar