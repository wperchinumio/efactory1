import React from 'react'

const DeleteModal = ({
  submitHandler,
}) => {
  return (
    <div 
      className="modal modal-themed fade" 
      data-backdrop="static"
      id="delete-documents" 
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
              aria-hidden="true"
            />
            <h4 className="modal-title">
              Delete Document(s)
            </h4>
          </div>
          <div className="modal-body">
            Are you sure you want to delete the selected document(s)?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn dark btn-outline" data-dismiss="modal">
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              data-dismiss="modal" 
              onClick={ event => submitHandler() }
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
