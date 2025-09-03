import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

const HasEmailModal = props => {
	const propsRef = useRef(null)
    propsRef.current = props
	const handleModalOpening = useCallback(
  	() => {
	  	global.$(".draggable-modal").css({ top: 0, left: 0 })
	  	props.batchActions.getBatchEmail( propsRef.current.id )
	  	global.$(".draggable-modal").css({ top: '0px', left: '0px' })
	  },
	  []
  )

	useEffect(
		() => {
			global.$('#has-email-modal').on('show.bs.modal', handleModalOpening)
    	global.$(".draggable-modal").draggable({ handle: ".modal-header"})
    	return () => {
    		global.$('#has-email-modal').off('show.bs.modal', handleModalOpening)
    	}
		},
		[]
	)

	return (
		<div
		  className="modal modal-themed fade draggable-modal ui-draggable"
		  data-backdrop="static"
		  id="has-email-modal"
		  tabIndex="-1"
		  role="dialog"
		  aria-hidden="true"
		>
		  <div className="modal-dialog modal-lg draggable-modal">
		    <div className="modal-content">
		      <div className="modal-header rs_title_bar">
		        <button type="button" className="close" data-dismiss="modal" aria-hidden={true} />
		        <h4 className="uppercase" style={{margin:0}}>
		        	<i className="fa fa-book" aria-hidden="true"></i> Report
		        </h4>
		      </div>
		      <div className="modal-body">
		        <div 
		        	dangerouslySetInnerHTML={{ __html: props.batchEmail }}
		        	style={{
		        		overflowY: 'auto',
		        		height: '400px'
		        	}}
		        />
		      </div>
		      <div className="modal-footer">
		        <button
		          type="button"
		          className="btn dark btn-outline"
		          data-dismiss="modal">
		          Close
		        </button>
		      </div>
		    </div>
		  </div>
		</div>
  )
}

HasEmailModal.propTypes = {
  id: PropTypes.string,
  batchEmail: PropTypes.any,
  batchActions: PropTypes.object.isRequired
}

export default HasEmailModal