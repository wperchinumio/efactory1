import React from 'react'
import PropTypes from 'prop-types'

const ApproveModal = ({
	buttonApproveTitle,
	children,
	id,
	modalContent,
	onApprove,
	title,
}) => {
	return (
    <div
	    className="modal modal-themed fade"
	    data-backdrop="static"
	    id={id}
	    tabIndex="-1"
	    role="dialog"
	    aria-hidden="true">
	    <div className="modal-dialog">
	      <div className="modal-content"
	      	style={{ width: '80%', marginLeft: '10%' }}
	      >
	        <div className="modal-header">
	          <button
	            type="button"
	            className="close"
	            data-dismiss="modal"
	            aria-hidden="true">
	          </button>
	          <h4 className="modal-title">
	          	{ title ? title : 'Confirm' }
	          </h4>
	        </div>
	        <div className="modal-body" style={{marginBottom: "20px"}}>
	        	{ modalContent }
	        	{ children }
	        </div>
	        <div className="modal-footer" style={{ marginTop : '-40px' }} >

	          <button
	          	type="button"
	          	className="btn dark btn-outline"
	          	data-dismiss="modal"
	          >
	          	Cancel
	          </button>
	          <button
	            type="button"
	            className="btn btn-danger"
	            data-dismiss={ id === 'modal-put-on-hold' ? '' : 'modal' }
	            onClick={ event => onApprove() }>
	            { buttonApproveTitle ? buttonApproveTitle : 'Confirm' }
	          </button>
	        </div>
	      </div>
	    </div>
	  </div>
  )
}


ApproveModal.propTypes = {
  id: PropTypes.string.isRequired,
  buttonApproveTitle: PropTypes.string,
  title: PropTypes.string
}

export default ApproveModal