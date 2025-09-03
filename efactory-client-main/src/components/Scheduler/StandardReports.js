import React, { useRef, useState, useCallback, useEffect } from 'react'
import classNames from 'classnames'
import ScheduleReport from './ScheduleReport/_Content'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as modalActions from './redux/modal'
import { ToastContainer, ToastMessage } from 'react-toastr'
import * as reportActions from './redux/reports'

const StandardReports = props => {
  const firstRun = useRef(true)
  const ToastMessageFactory = useRef(React.createFactory(ToastMessage.animation))
  const toaster = useRef(null)
  const [activeTab, setActiveTab] = useState(false)

  const onModalHidden = useCallback(
    event => {
      props.modalActions.setScheduleField({ creatingStandardReport: false })
    },
    []
  )

  useEffect(
    () => {
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

  let { creatingStandardReport, modalActions } = props
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
          showOnlyTab={activeTab}
        />
      }
      <div className="page-bar orderpoints-page-bar page-bar-fixed">
        <div className="page-breadcrumb font-green-seagreen">
          <div className="caption"><i className="fa fa-th-large"></i>
            <span className="caption-subject font-green-seagreen sbold">STANDARD REPORTS</span>
          </div>
        </div>
      </div>
      <div className="container-page-bar-fixed">
        <p> You can automatically send reports by scheduling the desired reports daily or monthly. Once the Report Scheduler is configured, specified reports will be delivered to the recipients as an email attachment (XLSX format) or sent to an FTP server.</p>
        {
          [
            {
              name: "Fulfillment",
              reports: [
                {
                  title: "Orders received today",
                  view_type: "fulfillment-any",
                  desc: "Return the list of orders <br/> received today",
                  icon: "cart.svg",
                  report_type_id: 1,
                  frequency: ["daily"]
                },
                {
                  title: "Orders received yesterday",
                  view_type: "fulfillment-any",
                  desc: "Return the list of orders <br/> received yesterday",
                  icon: "cart.svg",
                  report_type_id: 2,
                  frequency: ["daily"]
                },
                {
                  title: "Orders received this month",
                  view_type: "fulfillment-any",
                  desc: "Return the list of orders <br/> received this month",
                  icon: "cart.svg",
                  report_type_id: 3,
                  frequency: ["monthly"]
                },
                {
                  title: "Orders received previous month",
                  view_type: "fulfillment-any",
                  desc: "Return the list of orders <br/> received on the previous month",
                  icon: "cart.svg",
                  report_type_id: 4,
                  frequency: ["monthly"]
                },
                {
                  title: "Items shipped today",
                  view_type: "inventory-shipped",
                  desc: "Return all items shipped today <br/> with relative quantity",
                  icon: "price-tags.svg",
                  report_type_id: 5,
                  frequency: ["daily"]
                },
                {
                  title: "Items shipped yesterday",
                  view_type: "inventory-shipped",
                  desc: "Return all items shipped yesterday <br/> with relative quantity",
                  icon: "price-tags.svg",
                  report_type_id: 6,
                  frequency: ["daily"]
                },
                {
                  title: "Items shipped this month",
                  view_type: "inventory-shipped",
                  desc: "Return all items shipped this month <br/> with relative quantity",
                  icon: "price-tags.svg",
                  report_type_id: 7,
                  frequency: ["monthly"]
                },
                {
                  title: "Items shipped previous month",
                  view_type: "inventory-shipped",
                  desc: "Return all items shipped on the previous month <br/> with relative quantity",
                  icon: "price-tags.svg",
                  report_type_id: 8,
                  frequency: ["monthly"]
                },
                {
                  title: "Orders shipped today",
                  view_type: "fulfillment-shipped",
                  desc: "Return all orders shipped <br/> today",
                  icon: "truck.svg",
                  report_type_id: 9,
                  frequency: ["daily"]
                },
                {
                  title: "Orders shipped yesterday",
                  view_type: "fulfillment-shipped",
                  desc: "Return all orders shipped <br/> yesterday",
                  icon: "truck.svg",
                  report_type_id: 10,
                  frequency: ["daily"]
                },
                {
                  title: "Orders shipped this month",
                  view_type: "fulfillment-shipped",
                  desc: "Return all orders shipped <br/> this month",
                  icon: "truck.svg",
                  report_type_id: 11,
                  frequency: ["monthly"]
                },
                {
                  title: "Orders shipped previous month",
                  view_type: "fulfillment-shipped",
                  desc: "Return all orders shipped <br/> on the previous month",
                  icon: "truck.svg",
                  report_type_id: 12,
                  frequency: ["monthly"]
                },
                {
                  title: "Delivery Exceptions",
                  view_type: "delivery-exceptions",
                  desc: "Return all carrier exceptions",
                  icon: "truck.svg",
                  report_type_id: 13,
                  frequency: ["daily"]
                }
              ]
            },
            {
              name: "Items",
              reports: [
                {
                  title: "Items status",
                  view_type: "inventory-status",
                  desc: "Return the list of all items <br/> with relative quantity",
                  icon: "price-tags.svg",
                  report_type_id: 51,
                  frequency: ["daily","monthly"]
                },
                {
                  title: "Items backlog",
                  view_type: "inventory-backlog",
                  desc: "Return on items in backlog <br/> status",
                  icon: "price-tags.svg",
                  report_type_id: 52,
                  frequency: ["daily","monthly"]
                },
                {
                  title: "Items received today",
                  view_type: "inventory-received",
                  desc: "Return all items received today <br/> with relative quantity",
                  icon: "received.svg",
                  report_type_id: 53,
                  frequency: ["daily"]
                },
                {
                  title: "Items received yesterday",
                  view_type: "inventory-received",
                  desc: "Return all items received yesterday <br/> with relative quantity",
                  icon: "received.svg",
                  report_type_id: 54,
                  frequency: ["daily"]
                },
                {
                  title: "Items received this month",
                  view_type: "inventory-received",
                  desc: "Return all items received this month <br/> with relative quantity",
                  icon: "received.svg",
                  report_type_id: 55,
                  frequency: ["monthly"]
                },
                {
                  title: "Items received previous month",
                  view_type: "inventory-received",
                  desc: "Return all items received on the previous month <br/> with relative quantity",
                  icon: "received.svg",
                  report_type_id: 56,
                  frequency: ["monthly"]
                }
              ]
            },
            {
              name: "RMAs",
              reports: [
                {
                  title: "RMAs authorized today",
                  view_type: "returntrak-all",
                  desc: "Return the list of all RMAs <br/> authorized today",
                  icon: "received.svg",
                  report_type_id: 57,
                  frequency: ["daily"]
                },
                {
                  title: "RMA units received today",
                  view_type: "returntrak-items",
                  desc: "Return the list of all RMA units <br/> received today",
                  icon: "received.svg",
                  report_type_id: 58,
                  frequency: ["daily"]
                }
              ]
            }
          ].map( section => {
            return (
              <div key={section.name}>
                <div className="portlet light portlet-fit bordered">
                  <div className="portlet-title">
                    <div className="caption">
                      <i className=" icon-layers font-green"></i>
                      <span className="caption-subject font-green bold uppercase">{section.name}</span>
                    </div>
                  </div>
                  <div className="portlet-body">
                    <div className="mt-element-card mt-element-overlay">
                      <div className="row">
                        {
                          section.reports.map((report, i) => {
                            return (
                              <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12" key={section.name + i}>
                                <div className="mt-card-item">
                                  <div className={ classNames({
                                    'mt-card-avatar mt-overlay-1': true,
                                    'mt-scroll-down': i % 3 === 1,
                                    'mt-scroll-right': i % 3 === 2
                                  })}>
                                    <img src={'/src/styles/images/' + report.icon} style={{width: "100px", height: "100px", display: "inline"}} alt=""/>
                                    <div className="mt-overlay">
                                      <ul className="mt-info">
                                        <li>
                                          <a
                                            data-toggle="modal"
                                            href="#schedule_report"
                                            onClick={ event => {
                                              setActiveTab(report.frequency[0])
                                              modalActions.addStandardReport({
                                                report_type_id: report.report_type_id,
                                                activeFrequency: report.frequency[0],
                                                view_type: report.view_type
                                              })
                                              modalActions.setScheduleField({
                                                creatingStandardReport: true
                                              }).then( () => {
                                                global.$('#schedule_report').modal('show')
                                              } )
                                            }}
                                            className="btn default"
                                            data-report-type-id={report.report_type_id}
                                            data-frequency={report.frequency}
                                          >
                                            <i className="icon-plus"></i>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="mt-card-content">
                                    <h3 className="mt-card-name">{report.title}</h3>
                                    <p className="mt-card-desc font-grey-mint" dangerouslySetInnerHTML={{__html: report.desc}}></p>
                                  </div>
                                  <div style={{width:'100%', textAlign:'right'}}>
                                    <div className="btn-group">
                                        <a className="btn default btn-outline btn-noborder" href="#" data-toggle="dropdown">
                                            <i className="fa fa-download"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                          <li onClick={ event => props.reportActions.downloadView('excel',report.report_type_id) } >
                                              <a>
                                                <i className="fa fa-file-excel-o font-green-soft"/>
                                                  &nbsp;Excel
                                              </a>
                                            </li>
                                            <li onClick={ event => props.reportActions.downloadView('csv',report.report_type_id) } >
                                              <a>
                                                <i className="fa fa-file-text-o font-green-soft"/>
                                                  &nbsp;Csv
                                              </a>
                                            </li>
                                            <li onClick={ event => props.reportActions.downloadView('zip',report.report_type_id) } >
                                              <a>
                                                <i className="fa fa-file-archive-o font-green-soft"/>
                                                  &nbsp;Zip
                                              </a>
                                            </li>
                                        </ul>
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
            )
          })
        }
      </div>
    </div>
  )
}

export default connect(
  state => ({
    creatingStandardReport: state.scheduler.modal.creatingStandardReport,
    submittedSchedule: state.scheduler.modal.submittedSchedule
  }),
  dispatch => ({
    modalActions: bindActionCreators(modalActions, dispatch ),
    reportActions: bindActionCreators(reportActions, dispatch ),
  })
)(StandardReports)
