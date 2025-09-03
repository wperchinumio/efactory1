import React from 'react'
import PropTypes from 'prop-types'

const SaveAsPopup = props => {
  return (
    <div 
      className="modal modal-themed fade"
      data-backdrop="static"
      id="delete_view" 
      tabIndex="-1" 
      role="dialog" 
      aria-hidden={true}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden={true} />
            <h4 className="modal-title">Delete View</h4>
          </div>
          <div className="modal-body">
            Are you sure to delete this view ?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn dark btn-outline" data-dismiss="modal">Close</button>
            <button type="submit" className="btn btn-danger"
              onClick={ (e)=>{
                e.preventDefault();
                global.$('#delete_view').modal('hide');
                props.deleteViewAsync(props.settings.loadedDetails);
              }}
            >Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

SaveAsPopup.propTypes = {
  settings: PropTypes.object,
  saveAsAsync: PropTypes.func
}

export default SaveAsPopup