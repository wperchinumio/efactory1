import React from 'react'
import global from 'window-or-global'
import classNames from 'classnames'

const Popup = ({
  title,
  description,
  modalId,
  isError = false,
  zIndexFix = false
}) =>  {
  function closeModal () {
    if( zIndexFix ){
      global.$(`#${modalId}`).hide()
      return document.querySelector('.modal-backdrop').parentNode.removeChild(document.querySelector('.modal-backdrop'))
    }
    global.$(`#${modalId}`).modal('hide')
  }
  return (
    <div
      className={ classNames({
        'modal fade': true,
        'zIndexFix': zIndexFix
      }) }
      id={modalId}
      tabIndex="-1"
      data-keyboard={ zIndexFix ? 'false' : 'true' }
      data-backdrop="static"
      role="dialog"
      aria-hidden={true}
    >
      <div className="modal-dialog">
        <div className={isError ? "modal-content alert-danger" : "modal-content alert-success"}>
          <form role="form" autoComplete="off">
            <div className={isError ? "modal-header alert-danger" : "modal-header alert-success"}>
              <button
                type="button"
                className="close"
                onClick={closeModal}
                aria-hidden={true}
              />
              <h4 className="modal-title"> { title } </h4>
            </div>
            <div className="modal-body">
              <p><strong>{ description }</strong></p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn dark btn-outline"
                onClick={closeModal}
              >Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Popup