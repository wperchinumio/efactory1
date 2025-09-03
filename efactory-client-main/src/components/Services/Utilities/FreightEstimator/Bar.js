import React from 'react'

const FreightEstimator = () => {
	return (
  	<div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
          	<i className="fa fa-calculator"></i>
          	{ ' ' }
          	<span className="sbold">SHIPPING COST</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default React.memo(FreightEstimator)