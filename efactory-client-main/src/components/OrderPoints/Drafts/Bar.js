import React from 'react'

export default function TabsBar () {
	return (
  	<div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
          	<i className="fa fa-cubes"></i>
          	{ ' ' }
          	<span className="sbold">ORDERPOINTS</span> - DRAFTS
          </span>
        </div>
      </div>
    </div>
  )
}