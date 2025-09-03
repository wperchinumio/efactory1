import React from 'react'

const Bar = () => {
	return (
		<div className="page-bar orderpoints-page-bar page-bar-fixed">
		  <div className="page-breadcrumb">
		    <div className="caption" style={{paddingLeft: 20}}>
		    	<span className="caption-subject font-green-seagreen">
		  		<i className="fa fa-pencil" /> &nbsp;
		  		<span className="sbold">EDI</span> - FORM</span>
		  	</div>
		  </div>
		  <div className="page-toolbar">
		  	<button className="btn green-soft btn-sm" type="button">
		  		<i className="fa fa-file-o" />
		  			NEW FORM
		  	</button>
		  	<span style={{display: 'inline-block', padding: '0px 3px'}}>|</span>
		  	<span>
		  		<button type="button" className="btn btn-topbar btn-sm loading-button" disabled>
		  			<span className="button-name">SUBMIT</span>
		  		</button>
		  	</span> 
		  </div>
		</div>
  )
}

export default Bar