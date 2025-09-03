import React from 'react'

const MailTemplatesBar = props => {
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-cog"></i>
            { ' ' }
            <span className="sbold">SETUP</span>
              { ' ' } - Mail Templates
            </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MailTemplatesBar)