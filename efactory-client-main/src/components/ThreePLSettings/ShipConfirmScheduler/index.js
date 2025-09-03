import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AddShipConfirmScheduler from './AddShipConfirmScheduler'
import ComfirmModal from '../../OrderPoints/OrderEntry/Modals/Confirm'

const ShipConfirmScheduler = props => {
  const [editSchedulerData, setEditSchedulerData] = useState({})
  const [isAdd, setIsAdd] = useState(true)
  const [scheduler_id_to_delete, setScheduler_id_to_delete] = useState('')
  
  useEffect(
    () => {
      let { isPoReceipt, settingsActions } = props
      if (isPoReceipt) {
        settingsActions.read3PLPOReceiptScheduler().catch( e => {} )
        return
      }
      settingsActions.read3PLShipConfirmScheduler().catch( e => {} )
    },
    []
  )

  function addImportScheduler (event) {
    event.preventDefault()
    setIsAdd(true)
    setTimeout( () => global.$('#add-import-scheduler').modal('show'), 100 )
  }

  function editScheduler ({
    environment,
    id,
    product_group,
    time,
  }) {
    let { currentTimeIsoFormat, currentTimeShownFormat } = getFormatsFromTime(time)
    setEditSchedulerData({
      environment,
      id,
      product_group,
      currentTimeIsoFormat,
      currentTimeShownFormat,
    })
    setIsAdd(false)
    setTimeout(() => global.$('#add-import-scheduler').modal('show'), 100)
  }

  function getFormatsFromTime (time) {
    if (!time || time.length !== 5) {
      throw new Error("time length should be 5.");
    }
    let first = time.slice( 0, 2 )
    let last = time.slice( 2 )
    let currentTimeIsoFormat = time
    let currentTimeShownFormat
    first = +first
    if (first > 11) {
      currentTimeShownFormat = `${first - 12}${last} PM`
    } else {
      currentTimeShownFormat = `${currentTimeIsoFormat} AM`
    }
    return {
      currentTimeIsoFormat,
      currentTimeShownFormat
    }
  }

  function deleteScheduler (id) {
    setScheduler_id_to_delete(id)
    setTimeout(() => global.$('#delete-scheduler-confirm').modal('show'), 0)
  }

  function onConfirmDelete (event) {
    let { isPoReceipt, settingsActions } = props
    if (isPoReceipt) {
      settingsActions.delete3PLPOReceiptScheduler( scheduler_id_to_delete ).catch( e => {} )
    } else {
      settingsActions.delete3PLShipConfirmScheduler( scheduler_id_to_delete ).catch( e => {} )
    }
  }

  let { threePLState, settingsActions, isPoReceipt } = props
  let { plData_shipConfirm = [] } = threePLState
  return (
    <div>
      <div className={ classNames({
        'col-lg-10 col-md-12' : !isPoReceipt,
        'col-lg-8 col-md-12' : isPoReceipt,

      }) }>
        <p style={{ marginTop: '0px' }}>
          {
            isPoReceipt
            ? "List of active schedule for Purchase Order Receipts, Miscellaneous Receipts, Miscellaneous Issues, Sub Inventory Transfers and RMA Receipts."
            : "List of active schedule for Ship Confirms."
          }
        </p>
        <div className="table-responsive">
          <table className="accounts table table-striped table-hover">
            <colgroup>
              <col style={{width: "50px"}} />
              <col />
              <col />
              <col style={{width: "150px"}} />
              <col style={{width: "100px"}} />
              <col style={{width: "150px"}} />
            </colgroup>
            <thead>
              <tr className="uppercase noselect table-header-1 cart-row" style={{height: "37px"}}>
                <th style={{verticalAlign: "middle", textAlign: "right",  }}>#</th>
                <th style={{verticalAlign: "middle"}}>Environment</th>
                <th style={{verticalAlign: "middle"}} className={ classNames({
                    'hidden' : isPoReceipt
                  }) }>Product Group</th>
                <th style={{verticalAlign: "middle", textAlign: "center", }}>Time of Day</th>
                <th style={{verticalAlign: "middle", textAlign: "center", }}>One Time Only</th>
                <th style={{verticalAlign: "middle", textAlign: "center", borderLeft:"3px double #bbbbbb"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                plData_shipConfirm.map( ( scheduler, index ) => {
                  let {
                    environment,
                    id,
                    product_group,
                    time,
                    one_time
                  } = scheduler

                  return (
                    <tr key={`scheduler-${id}`}>
                      <td className="text-right">{ index + 1 }</td>
                      <td className="sbold">
                        { environment }
                      </td>
                      <td className={ classNames({
                        'sbold': true,
                        'hidden' : isPoReceipt
                      }) }>
                        { product_group }
                      </td>
                      <td className="sbold text-center">
                        { time }
                      </td>
                      <td className="sbold text-center">
                        {
                          one_time &&
                          <i className="fa font-blue-soft fa-check-square-o"></i>
                        }

                        {
                          !one_time &&
                          <i className="fa font-blue-soft fa-square-o"></i>
                        }
                      </td>
                      <td className="text-center" style={{whiteSpace: 'nowrap'}}>&nbsp;
                        <a
                          href=""
                          className="btn grey-gallery btn-xs"
                          type="button"
                          data-scheduler-id={ id }
                          onClick={ event => {
                            event.preventDefault()
                            editScheduler({
                              environment,
                              id,
                              product_group,
                              time
                            })
                          } }
                        >
                          Edit
                        </a>&nbsp;
                        <a
                          style={{ marginLeft : '10px' }}
                          className="btn red-soft btn-xs"
                          type="button"
                          data-scheduler-id={ id }
                          onClick={ event => {
                            event.preventDefault()
                            deleteScheduler( id )
                          } }
                        >
                          Delete
                        </a>&nbsp;
                      </td>
                    </tr>
                  )
                } )
              }
            </tbody>
          </table>
        </div>
        <a
          href=""
          className="btn green-soft"
          onClick={ addImportScheduler }
        >Add Schedule</a>
      </div>
      <AddShipConfirmScheduler
        threePLState={ threePLState }
        settingsActions={ settingsActions }
        isAdd={ isAdd }
        formDataInitial={ isAdd ? undefined : editSchedulerData }
        isPoReceipt={ isPoReceipt }
      />
      <ComfirmModal
        id="delete-scheduler-confirm"
        confirmationMessage="Are you sure you want to delete this schedule?"
        onConfirmHandler={ onConfirmDelete }
      />
    </div>
  )
}

ShipConfirmScheduler.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired
}

export default ShipConfirmScheduler