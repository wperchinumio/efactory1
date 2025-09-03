import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import AddImportSchedulerModal from './AddImportSchedulerModal'
import ComfirmModal from '../../OrderPoints/OrderEntry/Modals/Confirm'

const ImportScheduler = props => {
  const [editSchedulerData, setEditSchedulerData] = useState({})
  const [isAdd, setIsAdd] = useState(true)
  const [scheduler_id_to_delete, setScheduler_id_to_delete] = useState('')

  useEffect(
    () => {
      if (props.isRmaImport) {
        props.settingsActions.readRma3PLScheduler().catch(()=>{})
        return
      }
      props.settingsActions.read3PLScheduler().catch(()=>{})
    },
    []
  )

  function addImportScheduler (event) {
    event.preventDefault()
    setIsAdd(true)
    setTimeout( () => global.$('#add-import-scheduler').modal('show'), 100 )
  }

  function editScheduler ({ environment, id, product_group, time }) {
    let { currentTimeIsoFormat, currentTimeShownFormat } = getFormatsFromTime(time)
    setEditSchedulerData({
      environment,
      id,
      product_group,
      currentTimeIsoFormat,
      currentTimeShownFormat,
    })
    setIsAdd(false)
    setTimeout( () => global.$('#add-import-scheduler').modal('show'), 100 )
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
    return { currentTimeIsoFormat, currentTimeShownFormat }
  }

  function deleteScheduler (scheduler_id) {
    setScheduler_id_to_delete(scheduler_id)
    setTimeout( () => global.$('#delete-scheduler-confirm').modal('show'), 100 )
  }


  function onConfirmDelete (event) {
    if (props.isRmaImport) {
      props.settingsActions.deleteRma3PLScheduler( scheduler_id_to_delete ).catch( e => {} )
      return
    }
    props.settingsActions.delete3PLScheduler( scheduler_id_to_delete ).catch( e => {} )
  }

  let { threePLState, settingsActions, isRmaImport } = props
  let { plData = [], plData_rma = [] } = threePLState
  return (
    <div>
      <div className="col-lg-10 col-md-12">
        <p style={{ marginTop: '0px' }}>
          {
            `List of active schedule for ${ isRmaImport ? "RMA" : "Order" } Imports.`
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
                <th style={{verticalAlign: "middle"}}>Product Group</th>
                <th style={{verticalAlign: "middle", textAlign: "center", }}>Time of Day</th>
                <th style={{verticalAlign: "middle", textAlign: "center", }}>One Time Only</th>
                <th style={{verticalAlign: "middle", textAlign: "center", borderLeft:"3px double #bbbbbb"}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                ( isRmaImport ? plData_rma : plData ).map( 
                  ( scheduler, index ) => {
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
                        <td className="sbold">
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
                        <td className="text-center">
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
                          </a>
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
                          </a>
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
        >
          Add Schedule
        </a>
      </div>
      <AddImportSchedulerModal 
        threePLState={ threePLState }
        settingsActions={ settingsActions }
        isAdd={ isAdd }
        formDataInitial={ isAdd ? undefined : editSchedulerData } 
        isRmaImport={ isRmaImport }
      />
      <ComfirmModal
        id="delete-scheduler-confirm"
        confirmationMessage="Are you sure you want to delete this schedule?"
        onConfirmHandler={ onConfirmDelete }
      />
    </div>
  )
}

ImportScheduler.propTypes = {
  threePLState: PropTypes.object.isRequired,
  settingsActions: PropTypes.object.isRequired,
  isRmaImport: PropTypes.any
}

export default ImportScheduler