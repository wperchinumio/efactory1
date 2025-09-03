import React from 'react'
import classNames from 'classnames'
import PLCIActionsModal from './PLCIActionsModal'
import UploadingDialog from '../../../../_Shared/Components/Uploading'
import ComfirmModal from '../../../../OrderPoints/OrderEntry/Modals/Confirm'

const PLCI = ({
	ediState,
	ediActions
}) => {
	let {
		pl_url,
		ci_url
	} = ediState.addedShipmentData
  return (
  	<div>
  		<div className="shipping">
        <div className="addr-type">
          <i className="fa fa-file-pdf-o"></i> PL & CI
          <div className="pull-right">
			      <a
			        href="#ext-plci-actions"
			        className="addr-edit"
			        data-toggle="modal"
			        tabIndex="-1"
			      >
			        <i className="fa fa-book"></i> Action...
			      </a>
			    </div>
        </div>
      </div>
      <div className="section" style={{ margin: '0px', marginTop: '-5px' }}>
      	<div className="form-group padding-5" style={{marginBottom: "3px"}}>
	        <div className="row">
	            <div className="col-md-6">
	              <i 
	              	className={ classNames({
	              		'fa fa-file-pdf-o' : true,
	              		'font-red-haze' : pl_url,
	              		'font-grey-cascade' : !pl_url,
	              	}) }
	              	style={{ fontSize : "30px", marginTop : "10px" }}>
	              </i>
	              &nbsp;&nbsp; 
	              {
	              	pl_url 
	              	? <a 
		              	className="font-dark"
		              	style={{ position: "relative" , bottom: "4px" }}
		              	href={ pl_url }
                   	target="_blank"
		              >
		              	Packing List
		              </a> 
	              	: <span 
		              	className="font-grey-cascade"
		              	style={{ position: "relative" , bottom: "4px" }}
		              >
		              	Packing List
		              </span> 
	              }
	            </div>
	            <div className="col-md-6">
	              <i 
	              	className={ classNames({
	              		'fa fa-file-pdf-o' : true,
	              		'font-red-haze' : ci_url,
	              		'font-grey-cascade' : !ci_url,
	              	}) }
	              	style={{ fontSize : "30px", marginTop : "10px" }}>
	              </i>
	              &nbsp;&nbsp; 
	              {
	              	ci_url 
	              	? <a 
		              	className="font-dark"
		              	style={{ position: "relative" , bottom: "4px" }}
		              	href={ ci_url }
                   	target="_blank"
		              >
		              	Commercial Invoice
		              </a> 
	              	: <span 
		              	className="font-grey-cascade"
		              	style={{ position: "relative" , bottom: "4px" }}
		              >
		              	Commercial Invoice
		              </span> 
	              }
	            </div>
	        </div>
	      </div>
      </div>
	    <PLCIActionsModal 
	    	ediState={ ediState }
				ediActions={ ediActions }
	    />
	    <UploadingDialog />
	    <ComfirmModal
        id="pl-ci-delete"
        confirmationMessage="Are you sure you want to delete this document?"
        onConfirmHandler={ ediActions.deleteShipmentDocument }
      />
  	</div>
  )
}

export default PLCI