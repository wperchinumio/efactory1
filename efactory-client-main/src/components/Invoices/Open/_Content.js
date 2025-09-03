import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Bar from './Bar'
import ContentBar from './ContentBar'
import Table from './Table'
import * as invoiceActions from './redux'

const InvoiceOpen = ({
  invoiceActions
}) => {
  useEffect(
    () => {
      invoiceActions.listInvoices()
      return () => {
        invoiceActions.initializeReduxState()
      }
    },
    []
  )

  return (
    <div>
      <Bar 
        invoiceActions={invoiceActions}
      />
      <div className="container-page-bar-fixed">
        <div className="portlet light bordered">
          <ContentBar 
            invoiceActions={invoiceActions}
          />
          <Table 
            invoiceActions={invoiceActions}
          />
        </div>
      </div>
    </div>
  )
}

export default connect(
  null,
  dispatch => ({
    invoiceActions: bindActionCreators(invoiceActions, dispatch)
  })
)(InvoiceOpen)