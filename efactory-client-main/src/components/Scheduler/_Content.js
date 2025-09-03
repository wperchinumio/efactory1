import React, { useRef,  useEffect } from 'react'
import { ToastContainer, ToastMessage } from 'react-toastr'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as reportActions from './redux/reports'
import * as modalActions from './redux/modal'
import { formatDate } from '../_Helpers/FormatDate'
import Modal from './ScheduleReport/_Content'
import { getUserData } from '../../util/storageHelperFuncs';
import classNames from 'classnames';
import downloadSource from '../_Helpers/DownloadSource';

const SchedulerMain = props => {
  const firstRun = useRef([true, true])
  const prevProps = useRef(null)
  const ToastMessageFactory = useRef(React.createFactory(ToastMessage.animation))
  const toaster = useRef(null)

  useEffect(
    () => {
      props.reportActions.readTasks()
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        prevProps.current = props
        firstRun.current[0] = false
        return
      }
      let isDeleted = !prevProps.current.deletedTask && props.deletedTask
      let isUpdated = !prevProps.current.updatedTask && props.updatedTask
      let isEdited  = !prevProps.current.submittedSchedule && props.submittedSchedule

      let toasterHeader = isDeleted ? 'DELETE TASK' : 'UPDATE TASK'
      let toasterType = isDeleted ? 'deleted' : 'updated'
      if (isDeleted || isUpdated || isEdited) {
        toaster.current.success(
          toasterHeader,
          `The task has been ${toasterType} successfully.`, {
          timeOut: 1500,
          extendedTimeOut: 10000
        })
      }
      prevProps.current = props
    },
    [props]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (props.loading) {
        global.App.blockUI({ animate: true })
      } else {
        global.App.unblockUI()
      }
    },
    [props.loading]
  )

  function determineDeliveryType (ftp, emailTo) {
    let protocol = ''
    if (ftp.username && ftp.password && ftp.url ) {
      protocol = 'FTP'
    }
    emailTo = emailTo ? 'EMAIL' : ''
    if (protocol) {
      protocol = emailTo ? `${protocol}, ` : protocol
    }
    return protocol + emailTo
  }

  function exportToExcel (event) {
    event.preventDefault()
    let format = event.target.getAttribute('data-format')
    let report_id = event.target.getAttribute('data-id')
    let url = '/api/scheduler'
    let headerParams = {
      format,
      report_id
    }
    let onSuccessAction = () => {}
    let onErrorAction = () => props.reportActions.showErrorToaster('An error occured while downloading')
    downloadSource( url, JSON.stringify(headerParams), { onSuccessAction, onErrorAction } )
  }

  let { activeFrequency, readTasksSuccess } = props
  return (
    <div>
      <div className="page-bar orderpoints-page-bar page-bar-fixed">
        <div className="page-breadcrumb font-green-seagreen">
          <div className="caption"><i className="fa fa-calendar"></i>
            <span className="caption-subject font-green-seagreen sbold">
              SCHEDULED REPORTS
            </span>
          </div>
        </div>
        <div className="page-toolbar">
            <button
              className="btn btn-topbar btn-sm"
              onClick={ event => props.reportActions.readTasks() }
              type="button"
            >
              <i className="fa fa-refresh"></i>
              { ' ' }
              REFRESH
            </button>
          </div>
      </div>
      <div className="container-page-bar-fixed report-scheduler">
        {
          readTasksSuccess && props.allTasks.length === 0  &&
          <div className="container-page-bar-fixed all-tasks">
            <h3 className="font-red-soft">There are no scheduled reports at this time.</h3>
          </div>
        }
        {
          readTasksSuccess && props.allTasks.length !== 0 &&
          <div className="scheduler-container ">
            <ul>
              { props.allTasks &&
                props.allTasks.map(( row , index ) => {
                  let lastStatus =  row.last_run ? ( row.last_error === '' ? 'Success' : 'Error' ) : ''
                  return (
                  <li
                    className="scheduler-item clearfix"
                    key={index+'-scheduler-items'}
                  >
                    <div className="scheduler-content">
                      <div className="row">
                        <div className="col-sm-4 col-xs-12">
                          <span className="report-icon">
                            <i className={`fa fa-clock-o font${row.active ? '-silver' : ''}-grey`} />
                          </span>
                          <span className="report-detail">
                            <h2 className={ classNames({
                                'report-title': true,
                                'report-title-admin' : getUserData('is_master'),
                              })} >
                              {
                                row.name
                              }
                            </h2>

                            <p className="report-delivery"> Delivery method:
                              <span
                                className="font-green-jungle bold text-success"
                              >{ ' ' }
                                {
                                  determineDeliveryType(
                                    row.task.delivery_options.ftp,
                                    row.task.delivery_options.email.to
                                  )
                                }
                              </span>
                              <span className={ classNames({
                                'hidden' : !getUserData('is_master'),
                              })} style={{display: "block"}}
                              >Username: <span className="font-blue-steel sbold">{ row.username}</span></span>
                            </p>
                          </span>
                        </div>
                        <div className="col-sm-2 col-xs-3 report-border">
                          <p className="report-label uppercase">Last Status</p>
                          <p className="report-value">
                            <span className={`font-${lastStatus === 'Error' ? 'red' : 'green'}-soft`}>
                              { lastStatus === 'Error' ? row.last_error : lastStatus  }
                            </span>
                          </p>
                        </div>
                        <div className="col-sm-2 col-xs-3 report-border">
                          <p className="report-label uppercase">
                            Last Run
                          </p>
                          <p className="report-value">
                            { row.last_run && formatDate(row.last_run)}
                            <span className="small"></span>
                          </p>
                        </div>
                        <div className="col-sm-2 col-xs-3 report-border">
                          <p className="report-label uppercase">Next Run</p>
                          <p className="report-value">
                            { row.next_run && formatDate(row.next_run)}
                            <span className="small"></span>
                          </p>
                        </div>
                        <div className="col-sm-2 col-xs-3 report-border">
                          <p className="report-label uppercase">
                            Frequency
                          </p>
                          <p className="report-value capitalized">
                            {row.task.frequency.type}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="report-menu">
                      <div className="btn-group">
                        <button
                          className="btn blue "
                          data-toggle="dropdown"
                          aria-expanded="true"
                          style={{
                            background: 'rgba(0,0,0,0)',
                            border: 'none',
                            boxShadow: 'none',
                            color: 'black'
                          }}
                        >
                          <i className="fa fa-bars "></i>
                        </button>
                        <ul className="dropdown-menu pull-right" role="menu">
                          <li role="presentation">
                            <a
                              role="menuitem" tabIndex="-1"
                              onClick={ event => {
                                props.modalActions.editTask(index)
                                setTimeout( ()=>{
                                  global.$('#schedule_report').modal('show')
                                },100 )
                              } }
                            >
                              <i className="fa fa-pencil font-green-seagreen"></i>
                              { ' ' }{ ' ' }
                              EDIT
                            </a>
                          </li>
                          <li role="presentation">
                            <a role="menuitem" tabIndex="-1"
                               onClick={ event => {
                                props.reportActions.getScheduleToDelete(row.id)
                                global.$('#confirm-delete-task').modal('show')
                              } }>
                              <i className="fa fa-trash font-green-seagreen"></i>
                              { ' ' }{ ' ' }
                              DELETE
                            </a>
                          </li>
                          <li role="presentation">
                            <a role="menuitem" tabIndex="-1"
                               onClick={ event =>
                                  props.reportActions.updateScheduler(row, index) }>
                               <i className={`fa fa-toggle-${!row.active ? 'on' : 'off'} font-green-seagreen`}></i>
                               { ' ' }{ ' ' }
                               { !row.active ? 'ENABLE' : 'DISABLE'}
                            </a>
                          </li>
                          <li className="divider"></li>
                          <li className="dropdown-submenu">
                            <a>
                              <i className="fa fa-cloud-download font-green-seagreen"></i>
                              &nbsp; Export To
                            </a>
                            {
                              +row.report_type_id !== 1000 && +row.report_type_id !== 1001 && +row.report_type_id !== 1002 && +row.report_type_id !== 1003 && +row.report_type_id !== 1004 && +row.report_type_id !== 1005 && +row.report_type_id !== 1006 && +row.report_type_id !== 1007 && +row.report_type_id !== 1008 && +row.report_type_id !== 1009 && +row.report_type_id !== 1010 && +row.report_type_id !== 1011
                              && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                <li>
                                  <a
                                    data-id={ row.id }
                                    data-format={ 'excel' }
                                    onClick={ exportToExcel }
                                  >
                                    <i className="fa fa-file-excel-o font-green-soft"></i>
                                    &nbsp;Excel
                                  </a>
                                </li>
                                <li>
                                  <a
                                    data-id={ row.id }
                                    data-format={ 'csv' }
                                    onClick={ exportToExcel }
                                  >
                                    <i className="fa fa-file-text-o font-green-soft"></i>
                                    &nbsp;Csv
                                  </a>
                                </li>
                                <li>
                                  <a
                                    data-id={ row.id }
                                    data-format={ 'zip' }
                                    onClick={ exportToExcel }
                                  >
                                    <i className="fa fa-file-archive-o font-green-soft"></i>
                                    &nbsp;
                                    Zip
                                  </a>
                                </li>
                              </ul>
                            }
                            {
                              (+row.report_type_id === 1001)
                              && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                <li>
                                  <a
                                    data-id={ row.id }
                                    data-format={ 'xml' }
                                    onClick={ exportToExcel }
                                  >
                                    <i className="fa fa-file-excel-o font-green-soft"></i>
                                    &nbsp;Xml
                                  </a>
                                </li>
                                <li>
                                  <a
                                    data-id={ row.id }
                                    data-format={ 'txt' }
                                    onClick={ exportToExcel }
                                  >
                                    <i className="fa fa-file-excel-o font-green-soft"></i>
                                    &nbsp;Txt
                                  </a>
                                </li>
                              </ul>
                            }
                            {
                              (+row.report_type_id === 1000 || +row.report_type_id === 1002 || +row.report_type_id === 1004 || +row.report_type_id === 1005 || +row.report_type_id === 1006 || +row.report_type_id === 1007 || +row.report_type_id === 1008 || +row.report_type_id === 1009 || +row.report_type_id === 1010 || +row.report_type_id === 1011)
                               && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                <li>
                                <a
                                  data-id={ row.id }
                                  data-format={ 'xml' }
                                  onClick={ exportToExcel }
                                >
                                  <i className="fa fa-file-excel-o font-green-soft"></i>
                                  &nbsp;Xml
                                </a>
                              </li>
                            </ul>
                             }
                             {
                             (+row.report_type_id === 1003 )
                              && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                <li>
                                  <a
                                    data-id={ row.id }
                                    data-format={ 'txt' }
                                    onClick={ exportToExcel }
                                  >
                                    <i className="fa fa-file-excel-o font-green-soft"></i>
                                    &nbsp;Txt
                                  </a>
                                </li>
                              </ul>
                            }
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                )}
              )}
            </ul>
          </div>
        }
      </div>
      <div
        className="modal modal-themed fade"
        data-backdrop="static"
        id="confirm-delete-task"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-hidden="true">
              </button>
              <h4 className="modal-title">Confirmation</h4>
            </div>
            <div className="modal-body">
              <h4>Are you sure you want to delete this scheduled report?</h4>
            </div>
            <div className="modal-footer" style={{ marginTop : '-40px' }} >
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal" >
                No
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={ event => {
                  let id = props.taskToDelete
                  props.reportActions.deleteScheduler(id)
                } }>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        ref={toaster}
        toastMessageFactory={ToastMessageFactory.current}
        className="toast-bottom-right"
      />
      {
        props.currentTaskIndex !== undefined &&
        <Modal
          showOnlyTab={activeFrequency}
        />
      }
    </div>
  )
}

export default connect(
  state => ({
    allTasks : state.scheduler.reports.allTasks,
    deletedTask : state.scheduler.reports.deletedTask,
    taskToDelete : state.scheduler.reports.taskToDelete,
    readTasksSuccess : state.scheduler.reports.readTasksSuccess,
    updatedTask : state.scheduler.reports.updatedTask,
    submittedSchedule : state.scheduler.modal.submittedSchedule,
    currentTask : state.scheduler.modal.currentTask,
    currentTaskIndex : state.scheduler.modal.currentTaskIndex,
    activeFrequency : state.scheduler.modal.activeFrequency,
    loading : state.scheduler.reports.loading
  }),
  dispatch => ({
    reportActions : bindActionCreators(reportActions, dispatch ),
    modalActions : bindActionCreators(modalActions, dispatch )
  })
)(SchedulerMain)
