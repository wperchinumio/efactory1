import React, { useRef, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { ToastContainer, ToastMessage } from 'react-toastr'
import ScheduleReport from './ScheduleReport/_Content'
import * as reportActions from './redux/reports'
import * as modalActions from './redux/modal'

const CustomReports = props => {
  const firstRun = useRef(true)
  const toaster = useRef(null)
  const ToastMessageFactory = useRef(React.createFactory(ToastMessage.animation))

  const onModalHidden = useCallback(
    () => {
      props.modalActions.setScheduleField({ creatingStandardReport : false })
    },
    []
  )

  useEffect(
    () => {
      props.reportActions.listCustomReports()
      global.$('#schedule_report').on('hidden.bs.modal', onModalHidden)
      return () => {
        global.$('#schedule_report').off('hidden.bs.modal', onModalHidden)
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      if (props.submittedSchedule) {
        toaster.current.success(
          'CREATE TASK',
          `The task has been created successfully.`, {
          timeOut: 1500,
          extendedTimeOut: 10000
        })
      }
    },
    [props.submittedSchedule]
  )

  function determineImage (report_type_id) {
    if (!report_type_id) {
      return console.error('determineImage method required report_type_id')
    }
    report_type_id = +report_type_id
    if (report_type_id === 1000 || report_type_id === 1001 || report_type_id === 1007) {
      return 'price-tags'
    } else if (report_type_id === 1002 || report_type_id === 1003 || report_type_id === 1004 || report_type_id === 1005 || report_type_id === 1006 || report_type_id === 1008 || report_type_id === 1010 || report_type_id === 1011) {
      return 'truck'
    }  else if (report_type_id === 1009){
      return 'received'
    }
    else {
      console.error('report_type_id should be one of 1000, 1001, 1002, 1003, 1004 for determineImage method')
    }
  }

  function downloadView (format, report_type_id) {
    props.reportActions.downloadView(format,report_type_id)
  }

  let {
    custom_reports,
    modalActions,
    creatingStandardReport,
    fetched_custom_reports
  } = props

  return (
    <div>
      <ToastContainer
        ref={toaster}
        toastMessageFactory={ToastMessageFactory.current}
        className="toast-bottom-right"
      />
      {
        creatingStandardReport &&
        <ScheduleReport
          showOnlyTab={'daily'}
        />
      }
      <div className="page-bar orderpoints-page-bar page-bar-fixed">
        <div className="page-breadcrumb font-green-seagreen">
          <div className="caption"><i className="fa fa-th"></i>
            <span className="caption-subject font-green-seagreen sbold">CUSTOM REPORTS</span>
          </div>
        </div>
      </div>

      {
        fetched_custom_reports && custom_reports.length === 0 &&
        <div className="container-page-bar-fixed">
          <h3 className="font-red-soft">Sorry! You don't have any custom reports available at this time.</h3>
        </div>
      }

      {
        fetched_custom_reports && custom_reports.length > 0 &&
        <div className="container-page-bar-fixed">
          <p> You can automatically send reports by scheduling the desired reports daily or monthly. Once the Report Scheduler is configured, specified reports will be delivered to the recipients as an email attachment (XLSX format) or sent to an FTP server.</p>
          <div>
            <div className="portlet light portlet-fit bordered">
              <div className="portlet-title">
                <div className="caption">
                  <i className=" icon-layers font-green"></i>
                  <span className="caption-subject font-green bold uppercase">Custom reports</span>
                </div>
              </div>
              <div className="portlet-body">
                <div className="mt-element-card mt-element-overlay">
                  <div className="row">
                    {
                      custom_reports.map(({ report_type_id, title, description }, i) => {
                        return (
                          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={ report_type_id }>
                            <div className="mt-card-item">
                              <div className={ classNames({
                                'mt-card-avatar mt-overlay-1': true,
                                'mt-scroll-down' : i % 3 === 1,
                                'mt-scroll-right' : i % 3 === 2
                              })}>
                                <img src={ `/src/styles/images/${determineImage( report_type_id )}.svg` } style={{width: "100px", height: "100px", display: "inline"}} alt=""/>
                                <div className="mt-overlay">
                                  <ul className="mt-info">
                                    <li>
                                      <a
                                        data-toggle="modal"
                                        href="#schedule_report"
                                        onClick={ event => {
                                          modalActions.addCustomReport({
                                            report_type_id
                                          })
                                          modalActions.setScheduleField({
                                            creatingStandardReport : true
                                          }).then( () => {
                                            global.$('#schedule_report').modal('show')
                                          } )
                                        }}
                                        className="btn default btn-outline"
                                        data-report-type-id={report_type_id}
                                      >
                                        <i className="icon-plus"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="mt-card-content">
                                <h3 className="mt-card-name">{title}</h3>
                                <p className="mt-card-desc font-grey-mint" dangerouslySetInnerHTML={{__html: description}}></p>
                              </div>
                              <div style={{width:'100%', textAlign:'right'}}>
                              <div className="btn-group">
                                  <a className="btn default btn-outline btn-noborder" href="#" data-toggle="dropdown">
                                      <i className="fa fa-download"></i>
                                  </a>
                                  {
                                    (report_type_id === 1001)
                                    && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                          <li onClick={ event => downloadView('xml',report_type_id) } >
                                            <a>
                                              <i className="fa fa-file-excel-o font-green-soft"/>
                                                &nbsp;Xml
                                            </a>
                                          </li>
                                          <li onClick={ event => downloadView('txt',report_type_id) } >
                                            <a>
                                              <i className="fa fa-file-excel-o font-green-soft"/>
                                                &nbsp;Txt
                                            </a>
                                          </li>
                                      </ul>
                                  }
                                  {
                                    (report_type_id === 1000 || report_type_id === 1002 || report_type_id === 1004 || report_type_id === 1005 || report_type_id === 1006 || report_type_id === 1007 || report_type_id === 1008  || report_type_id === 1009  || report_type_id === 1010  || report_type_id === 1011)
                                     && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                          <li onClick={ event => downloadView('xml',report_type_id) } >
                                            <a>
                                              <i className="fa fa-file-excel-o font-green-soft"/>
                                                &nbsp;Xml
                                            </a>
                                        </li>
                                  </ul>
                                   }
                                   {
                                   (report_type_id === 1003 )
                                    && <ul className="dropdown-menu dropdown-left-side" role="menu">
                                          <li onClick={ event => downloadView('txt',report_type_id) } >
                                            <a>
                                              <i className="fa fa-file-excel-o font-green-soft"/>
                                                &nbsp;Txt
                                            </a>
                                        </li>
                                    </ul>
                                  }
                                </div>
                            </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default connect(
  state => ({
    custom_reports : state.scheduler.reports.custom_reports,
    creatingStandardReport : state.scheduler.modal.creatingStandardReport,
    fetched_custom_reports : state.scheduler.reports.fetched_custom_reports,
    submittedSchedule : state.scheduler.modal.submittedSchedule
  }),
  dispatch => ({
    reportActions : bindActionCreators(reportActions, dispatch ),
    modalActions : bindActionCreators(modalActions, dispatch ),
  })
)(CustomReports)
