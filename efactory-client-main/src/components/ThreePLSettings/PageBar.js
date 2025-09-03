import React from 'react'

const PageBar = () => {
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption font-green-seagreen">
          <i className="fa fa-cog"></i>
          <span className="caption-subject"><span className="sbold">SPECIAL</span> - SETTINGS</span>
        </div>
      </div>
    </div>
  )  
}

export default React.memo(PageBar)