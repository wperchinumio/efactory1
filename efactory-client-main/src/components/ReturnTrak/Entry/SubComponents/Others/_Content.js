import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EditOthersModal from '../../Modals/EditOthers'

const OthersMain = props => {
  let {
    original_order_number = '',
    customer_number = '',
    shipping_instructions = '',
    comments = '',
    return_weight_lb
  } = props.others

  return (
    <div className="op-review-sidebar">
      <div className="addr-type"><i className="fa fa-fire"></i> Others
        <div className="pull-right">
          <a
            href="#rma-edit-others"
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
            <td className="label2">Original Order #:</td>
            <td className="text-right">
              { original_order_number }
            </td>
          </tr>
          <tr>
            <td className="label2">Customer Number:</td>
            <td className="text-right">
              { customer_number }
            </td>
          </tr>
          <tr>
            <td className="label2" style={{paddingBottom: '10px' }}>Est. Weight for RS Label (lb):</td>
            <td className="text-right" style={{ paddingBottom: '10px' }}>
              { return_weight_lb }
            </td>
          </tr>
          <tr>
            <td className="label2" colSpan="2">
              Shipping Instructions:
            </td>
          </tr>
          <tr>
            <td className="" style={{padding: "3px",paddingBottom: "10px"}} colSpan="2">
              <div className="ef-info">
                { shipping_instructions }
              </div>
            </td>
          </tr>
          <tr>
            <td className="label2" colSpan="2">
              Comments:
            </td>
          </tr>
          <tr>
            <td className="" style={{padding: "5px"}} colSpan="2">
              <div className="ef-info">
                { comments }
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <EditOthersModal
        rmaEntryActions={props.rmaEntryActions}
      />
    </div>
  )
}

OthersMain.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    others : state.returnTrak.entry.others
  })
)(OthersMain)