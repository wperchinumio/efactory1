import React from 'react'
import PropTypes from 'prop-types'
import history from '../../../history'

const CustomizeViewBar = ({
  customizeEdiActions,
  customizeEdiState,
}) => {
  function restoreDefaultView (event) {
    customizeEdiActions.fetchDefaultEdiLayout()
  }

  function saveView (event) {
    customizeEdiActions.saveEdiLayout().then( 
      () => {
        history.push('/edi/overview')
      }
    )
  }

  function onCloseClicked (event) {
    history.push('/edi/overview') 
  }

  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-home" />
            <span className="sbold"> OVERVIEW - </span> CUSTOMIZE
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button 
          type="button" className="btn btn-sm"  
          onClick={ onCloseClicked }
        >
          Close
        </button>
        &nbsp;&nbsp;
        <button 
          type="button" className="btn btn-topbar btn-sm"  
          onClick={ restoreDefaultView }
        >
          Restore Default View
        </button>
        &nbsp;&nbsp;
        <button 
          type="button" className="btn red btn-sm"  
          onClick={ saveView }
          disabled={ customizeEdiState.saved_view }
        >
          Save & Close
        </button>
      </div>
    </div>
  )
}

CustomizeViewBar.propTypes = {
  customizeEdiState: PropTypes.object.isRequired,
  customizeEdiActions: PropTypes.object.isRequired
}

export default CustomizeViewBar