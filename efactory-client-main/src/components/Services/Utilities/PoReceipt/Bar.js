import React from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const PoReceiptBar = props => {
  function sendPoReceipt (event) {
    props.poReceiptActions.sendPoReceipt()
  }

  function onNewPoReceiptClicked (event) {
    if (props.poReceiptState.form_dirty) {
      global.$('#new-notification').modal('show')
    } else {
      approveNewNotification()
    }
  }

  function approveNewNotification (event) {
    let { poReceiptActions } = props
    poReceiptActions.initializeReduxState().then( () => {
      poReceiptActions.setRootReduxStateProp( 'new_po_receipt', true )
    } )
  }

  function isSendPoReceiptDisabled () {
    let { lines, supplier } = props.poReceiptState
    if (supplier.length === 0 ) return true
    if (!lines.length ) return true
    let is_any_qty = false
    lines = lines.some( ({ qty }, index) => {
      if (qty.length) {
        is_any_qty = true
        return true
      }
      return false
    } )
    if (is_any_qty ) return false
    return true
  }

  let { savingPoReceipt }  = props.poReceiptState
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-opencart"></i>
            { ' ' }
            <span className="sbold">Ext. PO Receipt</span> 
            </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button
          className="btn green-soft btn-sm"
          type="button"
          onClick={ onNewPoReceiptClicked }
        >
          <i className="fa fa-file-o"></i>
          NEW PO RECEIPT
        </button>
        <span style={{display: "inline-block", padding: "0 3px"}} >|</span>
        <ButtonLoading
          className="btn btn-topbar btn-sm"
          type="button"
          disabled={ isSendPoReceiptDisabled() }
          iconClassName="fa fa-cloud-upload"
          handleClick={ sendPoReceipt }
          name={ 'SEND PO RECEIPT' }
          loading={ savingPoReceipt }
        />
      </div>
    </div>
  )
}

PoReceiptBar.propTypes = {
  poReceiptState: PropTypes.object.isRequired,
  poReceiptActions: PropTypes.object.isRequired
}

export default PoReceiptBar