import React, { useRef } from 'react'
import classNames from 'classnames'

const PLCIActionsModal = ({
	ediState,
	ediActions
}) => {
	const upload = useRef(null)
	const upload2 = useRef(null)

	function onDeleteClicked (event) {
  	let delete_pl_ci_type = event.target.getAttribute('data-type')
  	ediActions.setRootReduxStateProp_multiple({
  		delete_pl_ci_type
  	}).then( 
  		() => {
  			global.$('#pl-ci-delete').modal('show')
  		}
  	).catch( e => {} )
  }

  function uploadFile (event) {
  	let type = event.target.getAttribute('data-type')
  	let {
  		addedShipmentData
  	} = ediState
  	let {
  		ship_id
  	} = addedShipmentData
    if (event.target.value !== '') {
      let file = event.target.files[0]
      ediActions.uploadDocument( file, ship_id, type )
      event.target.value = ''
    }
  }

  let {
		pl_url,
		ci_url
	} = ediState.addedShipmentData

  return (
    <div
	    className="modal modal-themed fade"
      data-backdrop="static"
	    id="ext-plci-actions"
	    tabIndex="-1"
	    role="dialog"
	    aria-hidden="true"
    >
	    <div className="modal-dialog">
	      <div className="modal-content">
	        <div className="modal-header">
	          <button
	            type="button"
	            className="close"
	            data-dismiss="modal"
	            aria-hidden="true">
	          </button>
	          <h4 className="modal-title">PL & CI</h4>
	        </div>
	        <div className="modal-body">
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
	            	<div className="pull-right">
	            		<input 
			              type="file"
			              ref={ upload2 }
			              onChange={ event => uploadFile(event) }
			              style={{ display : "none" }} 
			              data-type="PL"
			            />
	            		<button
				          	type="button"
				          	className="btn green-soft btn-sm"
				          	disabled={ pl_url }
				          	onClick={ event => upload2.current.click() }
				          	style={{ minWidth: '120px' }}
				          	
				          >
				          	<i className="fa fa-file-o"></i> Upload PL
				          </button>
				          &nbsp;&nbsp;
				          <button
				          	type="button"
				          	className="btn red-soft btn-sm"
				          	disabled={ !pl_url }
				          	data-type="PL"
				          	onClick={ onDeleteClicked }
				          >
				          	Delete
				          </button>
	            	</div>
	            </div>
		        </div>
		        <br/>
		        <div className="row">
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
	            <div className="col-md-6">
	            	<div className="pull-right">
		            	<input 
			              type="file"
			              ref={ upload }
			              onChange={ event => uploadFile(event) }
			              style={{ display : "none" }} 
			              data-type="CI"
			            />
	            		<button
				          	type="button"
				          	className="btn green-soft btn-sm"
				          	disabled={ ci_url }
				          	onClick={ event => upload.current.click() }
				          	style={{ minWidth: '120px' }}
				          >
				          	<i className="fa fa-file-o"></i> Upload CI
				          </button>
				          &nbsp;&nbsp;
				          <button
				          	type="button"
				          	className="btn red-soft btn-sm"
				          	disabled={ !ci_url }
				          	data-type="CI"
				          	onClick={ onDeleteClicked }
				          >
				          	Delete
				          </button>
	            	</div>
	            </div>
		        </div>
	        </div>
	        <div className="modal-footer">
	          <button
	          	type="button"
	          	className="btn dark btn-outline"
	          	data-dismiss="modal"
	          	style={{ marginTop: '-10px',  marginRight: '-5px' }}
	          >
	          	Close
	          </button>
	        </div>
	      </div>
	    </div>
	  </div>
  )
}

export default PLCIActionsModal