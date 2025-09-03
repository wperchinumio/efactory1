import React from 'react'
import history from '../../../history'

const AccountsBar = ({
  ediActions
}) => {
  function onCustomizeViewClicked (event) {
    event.preventDefault()
    history.push( '/edi/overview/customize-view' )
  }

  return (
    <div className="page-bar">
      <div className="page-breadcrumb">
        <div className="caption">
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-home"></i>
            { ' ' }
            <span className="sbold">EDI</span>
            { ' ' } - Overview
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <div className="btn-group btn-group-refresh">
          <button 
            type="button"
            className="btn btn-topbar btn-sm"
            disabled={ false }
            onClick={ () => ediActions.fetchEdiOverview( false ) }
            style={{ marginLeft: '10px', marginTop: '0' }}
          >
            <i className="fa fa-refresh"></i> Refresh
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

export default AccountsBar