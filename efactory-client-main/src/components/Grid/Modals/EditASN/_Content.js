import React, { useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import ButtonLoading from '../../../_Shared/Components/ButtonLoading'
import { bindActionCreators } from 'redux'
import * as bundleActions from   '../Bundle/redux'
import DatePicker from 'react-widgets/lib/DateTimePicker'
import moment from 'moment'

const EditASNModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(new Date())

  const handleModalOpening = useCallback(
    () => {
      global.$(".draggable-modal").css({ top : '0px', left : '0px' })
    },
    []
  )

  useEffect(
    () => {
      global.$('#edit-asn-line').on('show.bs.modal', handleModalOpening )
      global.$(".draggable-modal").draggable({ handle: ".modal-header"})
      return () => {
        global.$('#edit-asn-line').off('show.bs.modal', handleModalOpening )
      }
    },
    []
  )

  function handleDateFieldInput (dateObj) {
    let date = moment(dateObj ? dateObj : new Date()).format('YYYY-MM-DD')
    setExpectedDeliveryDate(date)
  }

  function saveChanges () {
    setLoading(true)
    const { bundleActions, activeRow } = props
    bundleActions.postASNEdit( 
      activeRow['dcl_po'],
      activeRow['dcl_po_line'],
      activeRow['order_type'],
      expectedDeliveryDate 
    ).then( 
      () => {
        setLoading(false)
        global.$('#edit-asn-line').modal('hide')
      }
    )
  }

  const expectedDeliveryDateValue = expectedDeliveryDate ? moment(expectedDeliveryDate).toDate()  : moment().toDate()

  return (
    <div
      className="modal modal-themed fade draggable-modal"
      id="edit-asn-line"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
      data-backdrop="static"
    >
      <div className="modal-dialog">
        <div className="modal-content"
          style={{ width: '80%', marginLeft: '10%' }}
        >
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">
              Expected at DCL
            </h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <label className="control-label">Expected Date:</label>
                <DatePicker
                  format="MM/DD/YYYY"
                  name="expectedDeliveryDate"
                  onChange={handleDateFieldInput}
                  time={false}
                  value={expectedDeliveryDateValue}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <p className="text-muted">
                  Once saved, please allow few seconds to see the changes reflected in the grid.
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn dark btn-outline"
              data-dismiss="modal">
              Cancel
            </button>
            &nbsp;&nbsp;
            <ButtonLoading
              className="btn green-soft"
              handleClick={ saveChanges }
              name={'Save'}
              loading={ loading }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  null,
  dispatch => ({
    bundleActions : bindActionCreators( bundleActions, dispatch ),
  })
)(EditASNModal)