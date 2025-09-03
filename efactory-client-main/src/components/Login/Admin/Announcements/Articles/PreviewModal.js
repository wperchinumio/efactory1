import React from 'react'
import PreviewBody from './Preview'

const PreviewModal = ({ activeRow: {title, body} }) => {
  return (
    <div 
      className="modal modal-themed fade" 
      id="preview-modal" 
      tabIndex="-1" 
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
            <h4 className="modal-title f-green-seagreen">{ title }</h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-12">
                <PreviewBody  body={ body } />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal"
            >
            Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal