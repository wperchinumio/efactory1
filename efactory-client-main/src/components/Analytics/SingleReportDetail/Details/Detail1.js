/* eslint-disable */
import React, { useCallback, useEffect, useState, useRef } from 'react'
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

const ReportDetailModal1 = ({
  analyticsActions,
  analyticsState
}) => {
  const [scrollbarWidth, setScrollbarWidth] = useState('15')
  const shipmentTypeDaysRef = useRef(null)
  shipmentTypeDaysRef.current = analyticsState.shipmentTypeDays

  useEffect(
    () => {
      calculateScrollBarWidth()
    },
    []
  )

  const onBackToChartClicked = useCallback(
    event => {
      analyticsActions.setRootReduxStateProp_multiple({
        isReportDetailShown : false,
        shipmentTypeDays : {
          ...shipmentTypeDaysRef.current,
          page_num : 1
        },
        detail1_rows : [],
        detail1_total : 0,
      })
    },
    [analyticsState.shipmentTypeDays]
  )

  const paginate = useCallback(
    page_num => {
      analyticsActions.fetchShipmentTypeDays({ page_num })
    },
    []
  )

  function calculateScrollBarWidth () {
    // Create the measurement node
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv)

    // Get the scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    setScrollbarWidth(scrollbarWidth)

    // Delete the DIV 
    document.body.removeChild(scrollDiv)
  }

  function onTableBodyScrolled (event) {
    // TODO : scroll for ie11 etc.
    let last_known_scroll_position = 0
    let ticking = false
    last_known_scroll_position = event.target.scrollLeft
    if (!ticking) {
      window.requestAnimationFrame( () => {
        scrollHorizontally(last_known_scroll_position)
        ticking = false
      })
    }
    ticking = true
  }

  function scrollHorizontally (scroll_pos, body_width) {
    let header = document.querySelector("#table-header-to-scroll")
    header.style.left = -scroll_pos + "px"
  }

  function exportToExcel (event) {
    event.preventDefault()
    let exportType = event.target.getAttribute('data-export-type')

    let { download_params_and, selected_customer } = analyticsState
    let url = '/api/analytics'
    let headerParams = {
      stats : "shipment_times_days",
      action : "export",
      filter : { and : exportType === 'all' ? [] : download_params_and }
    }

    if( selected_customer ){
      headerParams.policy_code = selected_customer
    }

    let onSuccessAction = () => {}
    let onErrorAction = () => analyticsActions.showErrorToaster('An error occured while downloading')

    DownloadSource( url, JSON.stringify(headerParams), { onSuccessAction, onErrorAction } )
  }

  let { 
    detail1_rows = [], 
    shipmentTypeDays, 
    detail1_total ,
    days_formatted,
    location_to_display,
    account_to_display
  } = analyticsState

  let {
    page_num,
    page_size
  } = shipmentTypeDays

  return (

    <div 
      className="analytics-detail"
      style={{
        height: 'calc( 100vh - 114px )',
        position: 'relative',
        backgroundColor: "white"
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
            Days: </span> 
          <span className="sbold font-green-seagreen">{ days_formatted }</span>
        </div>
        <div className="btn-group" style={{position: "absolute", right: 0}}>
          <button className="btn btn-xs gridview-filter-btn dropdown-toggle no-animation analytics-export-to-excel" type="button" data-toggle="dropdown" aria-expanded="false">
            <i className="fa fa-download"></i><span>Export to Excel</span><span className="filter-value selected-filter"></span><i className="fa fa-angle-down"></i>
          </button>
          <ul className="dropdown-menu pull-right">
            <li>
              <a 
                onClick={ exportToExcel }
                data-export-type="all"
              >
                All
              </a>
            </li>
            <li>
              <a 
                onClick={ exportToExcel }
                data-export-type="custom"
              >
                { `${ location_to_display } - ${ account_to_display } (${ days_formatted })` }
              </a>
            </li>
          </ul>
        </div>          
      </div>
      
      <div 
        className="table-responsive" 
        style={{
          backgroundColor: "white",
          width: '100%',
          position: 'absolute',
          top: '47px',
          bottom: '58px',
          overflow : 'hidden'
        }}
      >
        <table 
          className="table table-striped table-hover documents-table"
          id="table-header-to-scroll"
          style={{
            margin: '0',
            position: 'absolute', 
            top: '0px',
            width : `calc( 100% - ${scrollbarWidth}px )`,
            right : `${scrollbarWidth}px`,
            tableLayout : 'fixed',
            left : '0'
          }}
        >
        <colgroup>
          <col style={{width: "65px"}}/>
          <col style={{width: "85px"}}/>
          <col style={{width: "80px"}}/>
          <col style={{width: "250px"}}/>
          <col style={{width: "280px"}}/>
          <col style={{width: "300px"}}/>
          <col style={{width: "155px"}}/>
          <col style={{width: "120px"}}/>
        </colgroup>
          <thead>
            <tr className="uppercase analytics-tr">
              <th className="text-right  bold" style={{ verticalAlign : 'middle' }}>#</th>
              <th></th>
              <th className="bold" style={{ verticalAlign : 'middle' }}>ACCT #</th>
              <th className="bold" style={{ verticalAlign : 'middle' }}>Order #</th>
              <th className="bold" style={{ verticalAlign : 'middle' }}>CARRIER & SERVICE</th>
              <th className="bold" style={{ verticalAlign : 'middle', height:'50px' }}>Shipping Instructions</th>
              <th className="bold" style={{ verticalAlign : 'middle' }}>Receipt Date</th>
              <th className="bold" style={{ verticalAlign : 'middle' }}>Ship Date</th>
            </tr>
          </thead>
        </table>
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            top: '51px',
            bottom: '-13px',
            overflow: 'scroll'
          }}
          className="analytics-detail-table-wrapper"
          onScroll={ onTableBodyScrolled }
        >
          <table 
            className="table table-striped table-hover documents-table"
            style={{ tableLayout: 'fixed' }}
          >
            <colgroup>
              <col style={{width: "65px"}}/>
              <col style={{width: "85px"}}/>
              <col style={{width: "80px"}}/>
              <col style={{width: "250px"}}/>
              <col style={{width: "280px"}}/>
              <col style={{width: "300px"}}/>
              <col style={{width: "155px"}}/>
              <col style={{width: "120px"}}/>
            </colgroup>
            <tbody>
                {
                  detail1_rows.map( ( item, index ) => {

                    let {
                      row_id,
                      account_number,
                      order_number,
                      received_date,
                      ship_date,
                      shipping_carrier,
                      shipping_service,
                      order_type,
                      order_status,
                      shipping_instructions,
                      location
                    } = item

                    return (
                      <tr 
                        key={ `report-grid-row-${row_id}` } 
                        className="analytics-tr detail-tr"
                      >
                        <td className="text-right">{ row_id }</td>
                        <td>
                          <div className="order-type-inner">
                            <span className={ orderTypeClass(order_type) }>
                              { order_type }
                            </span>
                            <span className="pull-right order-wh">
                              { location }
                            </span>
                          </div>
                          <span className={ orderStatusClass(order_status) }
                            style={ order_status === 1 ? {display:"none"} : {marginTop: "4px"} }>
                            { orderStatus(order_status) }
                          </span>
                          <span aria-hidden="true"
                                className="icon-bubble text-muted pull-right"
                                style={ shipping_instructions ? {display:"block",paddingTop: "1px"} : {display:"none"} }>
                          </span>
                        </td>
                        <td>{ account_number }</td>
                        <td className="bold text-nowrap">
                          <Link 
                            to={`${global.window.location.pathname}?orderNum=${encodeURIComponent(order_number)}&accountNum=${account_number ? account_number : ''}`}>
                            { order_number }
                          </Link>
                        </td>
                        <td>
                          <span>
                            <span className="bold">
                              { shipping_carrier }
                            </span> - <span>
                              { shipping_service }
                            </span>
                          </span>
                        </td>
                        <td 
                          style={{  
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }} 
                        >
                          { shipping_instructions }
                        </td>
                        <td>{ formatDate( received_date ) }</td>
                        <td>{ formatDate( ship_date, 'true' ) }</td>
                      </tr>
                    )
                  } )
                }
                
            </tbody>
          </table>
        </div>
      </div>

      <Pagination 
        className={''}
        activePagination={ page_num }
        paginate={ paginate }
        page_size={ page_size }
        number_of_items={ detail1_total }
      />

    </div>
  )
}

export default connect(
  state => ({
    analyticsState : state.analytics
  })
)(ReportDetailModal1)