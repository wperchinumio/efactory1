import React from 'react'

const ShowErrorPopup = ({ errorDescription }) => {
  return (
    <div 
      className="modal modal-themed fade"
      id="error_popup" 
      tabIndex="-1" 
      role="dialog" 
      aria-hidden={true}
      data-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content alert-danger">
          <form role="form" autoComplete="off">
            <div className="modal-header alert alert-danger">
              <button type="button" className="close" data-dismiss="modal" aria-hidden={true}></button>
              <h4 className="modal-title">Error</h4>
            </div>
            <div className="modal-body">
              <p><strong>{ errorDescription }</strong></p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn dark btn-outline" data-dismiss="modal">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) 
}

export default ShowErrorPopup