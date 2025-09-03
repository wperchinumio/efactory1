/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDate } from '../../../_Helpers/OrderStatus'
import {  
  orderStatusClass,
  orderStatus,
  orderTypeClass 
} from '../../../_Helpers/OrderStatus'
import DownloadSource from '../../../_Helpers/DownloadSource'
import Pagination from './Shared/Pagination'

const IncidentDetailModal = ({
  analyticsActions,
  analyticsState
}) => {
  const [scrollbarWidth, setScrollbarWidth] = useState('15')

  useEffect(
    () => {
      calculateScrollBarWidth()
    },
    []
  )

  function onBackToChartClicked (event) {
    analyticsActions.setRootReduxStateProp_multiple({
      isReportDetailShown : false,
    })
  }

  function calculateScrollBarWidth(){
    // Create the measurement node
    let scrollDiv = document.createElement("div")
    scrollDiv.className = "scrollbar-measure"
    document.body.appendChild(scrollDiv)

    // Get the scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    setScrollbarWidth(scrollbarWidth)

    // Delete the DIV 
    document.body.removeChild(scrollDiv)
  }

  let { 
    incident_detail = {}, 
  } = analyticsState

  return (

    <div 
      className="analytics-detail"
      style={{
        position: 'relative'
      }}
    >
      <div style={{display: "flex", alignItems: "center"}} className="analytics-bar">
        <div className="analytics-filters">
          <div className="btn-group">
            <button 
              type="button" 
              className="btn btn-sm go-back-button"
              onClick={ onBackToChartClicked }
            >
            <i className="fa fa-chevron-circle-left" style={{marginRight: "5px", fontSize: "18px"}}></i> Go Back to Report
            </button>
          </div>
        </div>
        <div>
          <span 
            className="bold font-grey-mint" 
            style={{marginLeft: "50px"}}
          >
            Title: </span> 
          <span className="sbold font-red-soft" style={{fontSize: "1.2em", marginLeft: "5px"}}>{ incident_detail.title }</span>
        </div>
      </div>


      <div  style={{margin: "30px", overflow: "hidden"}}>

      <div className="row">
          <div className="col-md-8" >


            <div className="row inc_section">
              <div className="col-md-6" >
                <div className="row">
                  <div className="col-md-4" >
                    <span className="inc_label_det">ID:</span>
                    <span className="form-control inc_value_input">{incident_detail.id}</span>
                  </div>
                  <div className="col-md-4" >
                    <span className="inc_label_det">Warehouse:</span>
                    <span className="form-control inc_value_input">{incident_detail.warehouse}</span>
                  </div>
                  <div className="col-md-4" >
                    <span className="inc_label_det">Type:</span>
                    <span className="form-control inc_value_input">{incident_detail.type}</span>
                  </div>
                </div>
              </div>

              <div className="col-md-6" >
                <div className="row">
                  <div className="col-md-4" >
                    <span className="inc_label_det">Incident Date:</span>
                    <span className="form-control inc_value_input">{incident_detail.incident_date}</span>
                  </div>
                  <div className="col-md-8">
                    <span className="inc_label_det">Ref. 1:</span>
                    <span className="form-control inc_value_input">{incident_detail.ref_1}</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="row inc_section">
              <div className="col-md-2" >
                <span className="inc_label_det">Account #:</span>
                <span className="form-control inc_value_input">{incident_detail.account_number}</span>
              </div>

              <div className="col-md-4" >
                <span className="inc_label_det">Status:</span>
                <span className="form-control inc_value_input">{incident_detail.status}</span>
              </div>

              <div className="col-md-6" >
                <div className="row">
                  <div className="col-md-4" >
                      <span className="inc_label_det">Open Date:</span>
                      <span className="form-control inc_value_input">{incident_detail.open_date}</span>
                  </div>
                  <div className="col-md-8">
                      <span className="inc_label_det">Ref. 2:</span>
                      <span className="form-control inc_value_input">{incident_detail.ref_2}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row inc_section">
              <div className="col-md-6" >
                <span className="inc_label_det">Reason:</span>
                <span className="form-control inc_value_input">{incident_detail.reason}</span>
              </div>

              <div className="col-md-6" >
                <div className="row">
                  <div className="col-md-4" >
                    <span className="inc_label_det">Closed Date:</span>
                    <span className="form-control inc_value_input">{incident_detail.closed_date}</span>
                  </div>
                  <div className="col-md-8">
                    <span className="inc_label_det">Ref. 3:</span>
                    <span className="form-control inc_value_input">{incident_detail.ref_3}</span>
                  </div>
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 inc_section" >
                <span className="inc_label">Correction:</span>
                <div className="inc_value_area">{incident_detail.correction}</div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 inc_section" >
                <span className="inc_label">Root Cause:</span>
                <div className="inc_value_area">{incident_detail.root_cause}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 inc_section" >
                <span className="inc_label">Correction Action:</span>
                <div className="inc_value_area">{incident_detail.correction_action}</div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 inc_section" >
                <span className="inc_label">Effectiveness:</span>
                <div className="inc_value_area">{incident_detail.effectiveness}</div>
              </div>
            </div>
          </div>

          <div className="col-md-4" >
            <div className="row">
              <div className="col-md-12 inc_section" >
                  <span className="inc_label">Group:</span>
                  <span className="form-control inc_value_input">{incident_detail.group}</span>
              </div>
              <div className="col-md-12 inc_section" >
                  <span className="inc_label">Summary:</span>
                  <div className="inc_value_area inc_value_area_short form-control">{incident_detail.summary}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default connect(
  state => ({
    analyticsState : state.analytics
  })
)(IncidentDetailModal)