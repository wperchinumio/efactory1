import React from 'react'
import PropTypes from 'prop-types'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'

const PoRmaBar = props => {
  function isSendPoDisabled () {
    let { po_cart_items, form_dirty } = props.poRmaState
    let index = po_cart_items.findIndex( ({ qty_now }) => qty_now && !isNaN( qty_now ) && +qty_now > 0 )
    if( index === -1 && !form_dirty  ){
      return true
    } 
    return false
  }

  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-opencart"></i>
            { ' ' }
            <span className="sbold">Ext. RMA Receipt</span>
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button
          className="btn green-soft btn-sm"
          type="button"
          onClick={ props.poRmaActions.initializeReduxState }
        >
          <i className="fa fa-file-o"></i>
          NEW RMA RECEIPT
        </button>
        <span style={{display: "inline-block", padding: "0 3px"}} >|</span>
        <ButtonLoading
          className="btn btn-topbar btn-sm"
          type="button"
          disabled={ isSendPoDisabled() }
          iconClassName="fa fa-cloud-upload"
          handleClick={props.poRmaActions.sendPoRma}
          name={ 'SEND RMA RECEIPT' }
          loading={ false }
        />
      </div>
    </div>
  )
}

PoRmaBar.propTypes = {
  poRmaState: PropTypes.object.isRequired,
  poRmaActions: PropTypes.object.isRequired
}

export default PoRmaBar