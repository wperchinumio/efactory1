import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EditAmountsModal from '../../Modals/EditAmounts'
import FormatNumber from '../../../../_Helpers/FormatNumber'

const RmaSidebarAmount = props => {
  let {
    order_subtotal = 0,
    shipping_handling = 0,
    balance_due_us = 0,
    amount_paid = 0,
    total_due = 0,
    net_due_currency = 0,
    international_handling = 0,
    international_declared_value = 0,
    sales_tax = 0,
    insurance = 0
  } = props.amounts

  return (

    <div className="op-review-sidebar">
      <div className="addr-type"><i className="fa fa-dollar"></i> Amounts
        <div className="pull-right">
          <a
            href="#rma-edit-amounts"
            data-toggle="modal"
            className="addr-edit"
            tabIndex="-1"
          >
            <i className="fa fa-edit"></i> Edit...
          </a>
        </div>
      </div>
      <div className="section">
        <table style={{width: "100%"}}>
          <tbody>
          <tr>
            <td className="label2" style={{width: "100%"}}>Order Amount:</td>
            <td className="text-right">
              <FormatNumber number={order_subtotal}/></td>
          </tr>
          <tr>
            <td className="label2">S &amp; H:</td>
            <td className="text-right"> <FormatNumber number={ shipping_handling }/></td>
          </tr>
          <tr>
            <td className="label2">Sales Taxes:</td>
            <td className="text-right"> <FormatNumber number={ sales_tax }/></td>
          </tr>
          <tr>
            <td className="label2">Discount/Add. Chgs.:</td>
            <td className="text-right"> <FormatNumber number={ international_handling }/></td>
          </tr>
          <tr>
            <td className="label2" style={{paddingBottom: "5px", fontWeight: 700}}>Total Amount:</td>
            <td className="text-right" style={{borderTop: "1px double #999", minWidth: "45px", fontWeight: 700, paddingBottom: "5px"}}> <FormatNumber number={total_due}/></td>
          </tr>
          <tr>
            <td className="label2">Amount Paid:</td>
            <td className="text-right"> <FormatNumber number={amount_paid} /></td>
          </tr>
          <tr>
            <td className="label2" style={{paddingBottom: "5px", fontWeight: 700}}>Net Due:</td>
            <td className="text-right" style={{borderTop: "3px double #999", minWidth: "45px", fontWeight: 700, paddingBottom: "5px"}}> <FormatNumber number={ net_due_currency }/> </td>
          </tr>
          <tr>
            <td className="label2">Balance Due (US):</td>
            <td className="text-right"> <FormatNumber number={ balance_due_us }/></td>
          </tr>
          <tr>
            <td className="label2">Int. Decl. Value:</td>
            <td className="text-right"> <FormatNumber number={ international_declared_value }/></td>
          </tr>
          <tr>
            <td className="label2">Insurance:</td>
            <td className="text-right"> <FormatNumber number={ insurance }/></td>
          </tr>
          </tbody>
        </table>
      </div>
      <EditAmountsModal 
        rmaEntryActions={props.rmaEntryActions} 
        entryPageType={props.entryPageType}
      />
    </div>
  )
}

RmaSidebarAmount.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    amounts : state.returnTrak.entry.amounts,
    entryPageType : state.returnTrak.entry.entryPageType
  })
)(RmaSidebarAmount)