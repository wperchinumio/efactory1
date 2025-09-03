import React from 'react'
import history from '../../history'

const OverviewPageBar = props => {
  function onCustomizeViewClicked (event) {
    event.preventDefault()
    history.push( '/overview/customize-view' )
  }

  function onRefreshClicked () {
    let event = new Event('overview_refreshed')
    global.document.dispatchEvent(event)
  }

  return (
    <div className="page-bar">
      <div className="page-breadcrumb">
        <div className="caption">
          <span className="caption-subject font-green-seagreen sbold">
            <i className="icon-home" style={{marginRight:"5px"}}></i>
            OVERVIEW
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <div className="btn-group btn-group-refresh">
          <button 
            type="button" className="btn btn-topbar btn-sm" id="refresh-btn"
            onClick={ onRefreshClicked }
          >
            <i className="fa fa-refresh"></i> &nbsp; Refresh
          </button>
          <button 
            type="button" 
            className="btn btn-topbar btn-sm dropdown-toggle" 
            data-toggle="dropdown" 
            data-delay="1000" 
            data-close-others="true" 
            aria-expanded="false"
          >
            <i className="fa fa-angle-down"></i>
          </button>
          <ul className="dropdown-menu pull-right" role="menu">
            <li>
              <a href="#" onClick={onCustomizeViewClicked}>
                Customize...
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OverviewPageBar