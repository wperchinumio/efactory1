import React from 'react'

const AccountsBar = props => {
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-user-plus"/>
            { ' ' }
            <span className="sbold">USERS</span>
            { ' ' } - Settings
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(AccountsBar)