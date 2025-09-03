import React from 'react'
import PropTypes from 'prop-types'

const ConfirmModal = props => {
	let {
		confirmationMessage,
		onConfirmHandler,
		id,
		onRejectHandler
	} = props
  return (
    <div
			className="modal modal-themed fade"
			data-backdrop="static"
			id={id}
			tabIndex="-1"
			role="dialog"
			aria-hidden="true">
			<div className="modal-dialog">
		  	<div className="modal-content">
		    	<div className="modal-header">
	      		<button
	        		type="button"
	        		className="close"
	        		data-dismiss="modal"
	        		aria-hidden="true">
	      		</button>
	      		<h4 className="modal-title">Confirmation</h4>
		    	</div>
		    	<div className="modal-body">
            <p style={{marginTop: 0}}>{ confirmationMessage }</p>
		    	</div>
		    	<div className="modal-footer" style={{ marginTop : '-40px' }} >
	      		<button
	      			type="button"
	      			className="btn dark btn-outline"
							onClick={ onRejectHandler ? onRejectHandler : () => {}  }
	      			data-dismiss="modal" >
	      			No
	      		</button>
	      		<button
	        		type="button"
	        		className="btn btn-danger"
	        		data-dismiss="modal"
	        		onClick={ onConfirmHandler }>
	        		Yes
	      		</button>
		    	</div>
		  	</div>
			</div>
		</div>
  )
}

ConfirmModal.propTypes = {
  confirmationMessage: PropTypes.string.isRequired,
  onConfirmHandler: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

export default ConfirmModal