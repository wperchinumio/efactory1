import React from 'react'

const RmaDraftsBar = () => {
	return (
  	<div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
          	<i className="fa fa-cubes"></i>
          	{ ' ' }
          	<span className="sbold">RETURNTRAK</span> - DRAFTS
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(RmaDraftsBar)