import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ButtonLoading from '../../_Shared/Components/ButtonLoading'

const InvoiceOpenBar = ({
  checkedRows = {},
  invoiceActions,
  loading,
}) => {
  let isPayDisabled = Object.keys(checkedRows).length === 0
  return (
    <div className="page-bar orderpoints-page-bar page-bar-fixed">
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "20px"}}>
          <span className="caption-subject font-green-seagreen">
            <i className="fa fa-credit-card"></i>
            { ' ' }
            <span className="sbold">INVOICES </span> OPEN
          </span>
        </div>
      </div>
      <div className="page-toolbar">
        <button
          type="button"
          className="btn green-soft btn-sm"
          disabled={isPayDisabled}
          onClick={ event => {
            if( !isPayDisabled ){
              invoiceActions.initializePayModal()
              global.$('#pay-selected').modal('show')
            }
          } }
        >
          <i className="fa fa-credit-card"></i> PAY SELECTED INVOICES
        </button>
        &nbsp;
        <ButtonLoading
          className="btn dark btn-sm"
          type="button"
          iconClassName="fa fa-refresh"
          handleClick={ event => invoiceActions.listInvoices(true) }
          name={'REFRESH'}
          loading={loading}
        />
      </div>
    </div>
  )
}

InvoiceOpenBar.propTypes = {
  invoiceActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    loading: state.invoices.open.loading,
    checkedRows: state.invoices.open.checkedRows
  })
)(InvoiceOpenBar)