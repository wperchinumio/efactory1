import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import EditExtraFieldsModal from './EditExtraFieldsModal'

const ExtraFields = ({
  extraFieldsLabels, 
  extraFields,
  reviewActions
}) => {
  let {
    custom_field1,
    custom_field2,
    custom_field3,
    custom_field4,
    custom_field5
  } = extraFields

  let {
    header_cf_1 = 'Custom Field 1',
    header_cf_2 = 'Custom Field 2',
    header_cf_3 = 'Custom Field 3',
    header_cf_4 = 'Custom Field 4',
    header_cf_5 = 'Custom Field 5'
  } = extraFieldsLabels

  return (
    <div className="op-review-sidebar">
      <div className="addr-type"><i className="fa fa-fire"></i> Extra fields
        <div className="pull-right">
          <a
            href="#op-extra-fields"
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
            <td className="label2">{ header_cf_1 }:</td>
            <td className="text-right"> {custom_field1} </td>
          </tr>
          <tr>
            <td className="label2">{ header_cf_2 }:</td>
            <td className="text-right">{custom_field2}</td>
          </tr>
          <tr>
            <td className="label2">{ header_cf_3 }:</td>
            <td className="text-right">{custom_field3}</td>
          </tr>
          <tr>
            <td className="label2">{ header_cf_4 }:</td>
            <td className="text-right">{custom_field4}</td>
          </tr>
          <tr>
            <td className="label2">{ header_cf_5 }:</td>
            <td className="text-right">{custom_field5}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <EditExtraFieldsModal 
        reviewActions={reviewActions}
      />
    </div>
  )
}

ExtraFields.propTypes = {
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    extraFields: state.orderPoints.entry.extraFields,
    extraFieldsLabels: state.orderPoints.entry.extraFieldsLabels
  })
)(ExtraFields)