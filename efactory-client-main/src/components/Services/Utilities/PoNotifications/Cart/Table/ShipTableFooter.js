import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const TableFooter = props => {
  function isRemoveItemsDisabled () {
    return Object.keys( props.po.checkedRows ).length === 0
  } 

  function removeSelectedItems () {
    if (!isRemoveItemsDisabled()) {
      let { po, poActions } = props
      let { checkedRows, lines } = po
      lines = lines.filter( line => !checkedRows[line.item_number] )
      lines = lines.map( (line,index) => ({ ...line, line_number: index + 1 }) )
      poActions.setRootReduxStateProp_multiple({ lines, checkedRows: {} })
    }
  }

  function calculateTotalQuantity () {
    let { lines } = props.po
    if (!lines.length) {
      return 0
    }
    let reducedQuantity = lines.reduce( 
      ( prev, next ) => ({quantity: next.quantity ? prev.quantity + +next.quantity : prev.quantity}),
      { quantity: 0 }
    )
    return reducedQuantity['quantity']
  }

  let { lines = [] } = props.po
  return (
    <div className="op-cart-footer">
      <table>
        <tbody>
          <tr>
            <td style={{width: "100%", verticalAlign: "top"}}>
              <button
                className="btn red-soft btn-xs"
                disabled={isRemoveItemsDisabled()}
                onClick={removeSelectedItems}
              >
                Remove selected items
              </button>
            </td>
            <td style={{minWidth: "180px"}} className="small">
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Lines:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{ lines.length }</strong>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                  Total Qty:
                </div>
                <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                  <strong>{calculateTotalQuantity()}</strong>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

TableFooter.propTypes = {
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default connect(
  state => ({
    amounts: state.returnTrak.entry.amounts,
    checkedItems: state.returnTrak.entry.checkedItems,
    rmaHeader: state.returnTrak.entry.rmaHeader,
    rma_detail: state.returnTrak.entry.rma_detail
  })
)(TableFooter)