import React from 'react'

const SuccessModal = ({ orderNumber }) => {
  return (
    <div 
      className="modal modal-themed fade"
      data-backdrop="static"
      id="order-success-modal" 
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
            <h4 className="modal-title">CREATED ORDER SUCCESSFULLY !</h4>
          </div>
          <div className="modal-body">
            Order # <b>{ orderNumber }</b>  created successfully
          </div>
          <div className="modal-footer">
            <button type="button" className="btn dark btn-outline" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal