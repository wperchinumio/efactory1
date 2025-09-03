import React, { useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Reports from './Reports'
import * as Details from './Details'
import Bar from './Bar'
import BarST from './BarShipmentTimesOnly'
import LoadingAnimation from './LoadingAnimation'
import QUICK_FILTERS_CONFIGS from './QUICK_FILTERS_CONFIGS'
import * as analyticsActions from '../redux'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const SingleReportDetail = ({
  analyticsActions,
  analyticsState,
  filter,
  id,
  pathname,
  shipment_times_only = false
}) => {
  useEffect(
    () => {
      setFilters()
      generateReport()
      return () => {
        analyticsActions.initializeReduxState()
      }
    },
    []
  )

  function setFilters () {
    if (+id === 6 || +id === 13 || +id === 16) {
      analyticsActions.setRootReduxStateProp_multiple({
        filter     : {
          'shipped_date' : [
            {
              field : 'shipped_date' ,
              value : '-90D',
              oper  : '='
            }
          ],
          'time_dimension' : [
            {
              field : 'time_dimension' ,
              value : 'weekly',
              oper  : '='
            }
          ]
        },
      })
    } else if (+id === 11) {
      analyticsActions.setRootReduxStateProp_multiple({
        filter     : {
          'shipped_date' : [
            {
              field : 'shipped_date' ,
              value : '-1W',
              oper  : '='
            }
          ]
        },
      })
    } else if (+id ===17 ) {
      analyticsActions.setRootReduxStateProp_multiple({
        filter     : {
          'carrier' : [
            {
              field : 'carrier' ,
              value : 'UPS',
              oper  : '='
            }
          ],
          'region' : [
            {
              field : 'region' ,
              value : 'FR',
              oper  : '='
            }
          ]
        },
      })
    }
    else if (+id !== 4 && +id !== 5) {
      analyticsActions.setRootReduxStateProp_multiple({
        filter     : {
          'shipped_date' : [
            {
              field : 'shipped_date' ,
              value : '-90D',
              oper  : '='
            }
          ]
        },
      })
    }
    else {
      analyticsActions.setRootReduxStateProp_multiple({
        filter     : {
          [ +id === 4 ? 'cycle_count_date' : +id === 5 ?'received_date': 'shipped_date' ] : [
            {
              field : +id === 4 ? 'cycle_count_date' : +id === 5 ? 'received_date': 'shipped_date' ,
              value : '-30D',
              oper  : '='
            }
          ]
        },
      })
    }

    analyticsActions.setRootReduxStateProp_multiple({
      global_analytics: pathname && pathname.includes('admin/')
    })
  }

  function generateReport () {
    const idNumbered = +id
    if (idNumbered === 4) {
      return analyticsActions.runReportCycleCount( id )
    }
    else if (idNumbered === 17) {
      return analyticsActions.runReportRateCards( id )
    } else {
      analyticsActions.runReport(
        idNumbered === 3
        ? 'international'
        : idNumbered === 1
          ? 'shipment_times'
          : idNumbered === 6
          ? 'time_historical'
          : idNumbered === 7
          ? 'customer_historical'
          : idNumbered === 8
          ? 'item_historical'
          : idNumbered === 9
          ? 'ship_service_historical'
          : idNumbered === 10
          ? 'channel_historical'
          : idNumbered === 11
          ? 'freightanalyzer'
          : idNumbered === 12
          ? 'incident_report'
          : idNumbered === 13
          ? 'time_freight_historical'
          : idNumbered === 14
          ? 'ship_service_freight_historical'
          : idNumbered === 15
          ? 'ssas_shipment_times'
          : idNumbered === 5
          ? 'rma_times'
          : idNumbered === 16
          ? 'time_historical_account'
          : 'domestic',
        id
      )
    }
  }

  function sortReport () {
    let { currentSortedField, sortType } = analyticsState
    const report = analyticsState[ `reportData${id}` ]
    let rows = ((id === "1" || id === "15" || id === "4" || id === "5" || id === "12")? report.rows: report.chart) || []

    if( !currentSortedField ) return rows

    rows = [ ...rows ]

    if (id === "1") {
      rows = rows.map( item => {
        let {
        same_day,
        day1,
        days2,
        days3,
        days4,
        days5,
        many_days
      } = item

      return {
        ...item,
        total_orders : same_day + day1 + days2 + days3 + days4 + days5 + many_days
      }
      })
    } else if (id === "15") {
      rows = rows.map( item => {
        let {
          same_day,
          day1,
          days2,
          days3,
          days4,
          days5,
          days6,
          days7,
          many_days
        } = item

        return {
          ...item,
          total_orders : same_day + day1 + days2 + days3 + days4 + days5 + days6 + days7 + many_days
        }
      })
    } else if (id === "5") {
      rows = rows.map( item => {
        let {
          same_day,
          day1,
          days2,
          days3,
          days4,
          days5,
          many_days
        } = item
        return {
          ...item,
          total_items : same_day + day1 + days2 + days3 + days4 + days5 + many_days
        }
      })
    }
    rows.sort(function(a, b){
      let a_ = a[ currentSortedField ]
      let b_ = b[ currentSortedField ]
      if( currentSortedField === 'name' ){
        a_ = a_ ?  a_.toLowerCase() : ''
        b_ = b_ ?  b_.toLowerCase() : ''
      }
      if ( a_ < b_ ) return -1 //sort string ascending
      if ( a_ > b_ ) return 1
      return 0
    })
    if( sortType !== 'ascending' ){
      rows.reverse()
    }
    return rows
  }

  function exportReport () {
    if (id === '16') {
      analyticsActions.setRootReduxStateProp_multiple({ exportReportClicked: true })
      return
    }
    if (id === 17) {

      return analyticsActions.exportReportRateCards( id )
    }
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const report = analyticsState[ `reportData${id}` ]
    const reportTitle = report.header.title
    const { compareYears = false} = analyticsState
    let reportData = null

    if (id === "1") { // Shipment-times
      reportData = sortReport().map( (line) => {
        return { Location: line.location,
                  'Account #': line.account_number,
                  'Cut-Off Time': line.order_time,
                  'Same Day': line.same_day,
                  '1 Day': line.day1,
                  '2 Days': line.days2,
                  '3 Days': line.days3,
                  '4 Days': line.days4,
                  '5 Days': line.days5,
                  'Over 5 Days': line.many_days,
                  'Total Orders': line.same_day + line.day1 + line.days2 + line.days3 + line.days4 + line.days5 + line.many_days }
                })
    } else if (id === "15") { // Analytics Delivery Times
      reportData = sortReport().map( (line) => {
        return { Location: line.location,
                  'Account #': line.account_number,
                  'Same Day': line.same_day,
                  '1 Day': line.day1,
                  '2 Days': line.days2,
                  '3 Days': line.days3,
                  '4 Days': line.days4,
                  '5 Days': line.days5,
                  '6 Days': line.days6,
                  '7 Days': line.days7,
                  'Over 7 Days': line.many_days,
                  'Packages With Delivery': line.same_day + line.day1 + line.days2 + line.days3 + line.days4 + line.days5 +  line.days6 + line.days7 + line.many_days,
                  'Packages W/O Delivery': line.not_delivered }
                })
    } else if (id === "5") { // RMA Receive Times
      reportData = sortReport().map( (line) => {
        return {
                  'Warehouse': line.location,
                  'Same Day': line.same_day,
                  '1 Day': line.day1,
                  '2 Days': line.days2,
                  '3 Days': line.days3,
                  '4 Days': line.days4,
                  '5 Days': line.days5,
                  'Over 5 Days': line.many_days,
                  'Total Items': line.same_day + line.day1 + line.days2 + line.days3 + line.days4 + line.days5 + line.many_days }
                })
    } else if (id === "4") { // Cycle Count
      reportData = sortReport().map( (line) => {
        return {
                  'Cycle Count Date': line.cycle_count_date,
                  'Item #': line.item_number,
                  'Description': line.description,
                  'System Qty': line.qty_onhand,
                  'Counted Qty': line.qty_counted,
                  'Variance Qty': line.qty_variance,
                  'Warehouse': line.inv_type,
                  'CC Days': line.cc_days }
                })
    } else if (id === "12") { // Incident Reports
      reportData = sortReport().map( (line) => {
        return {
                  'Incident Id': line.id,
                  'Warehouse': line.warehouse,
                  'Incident Date': line.incident_date,
                  'Title': line.title,
                  'Reason': line.reason,
                  'Group': line.group,
                  'Status': line.status }
                })
    } else {
        let title = 'Name'
        if (id === "2") {
          title = 'State'
        }
        else if (id === "3") {
          title = 'Country'
        }
        else if (id === "6") {
          title = 'Time'
        }
        else if (id === "7") {
          title = 'Customer'
        }
        else if (id === "8") {
          title = 'Item #'
        }
        else if (id === "9") {
          title = 'Ship Service'
        }
        else if (id === "10") {
          title = 'Channel'
        }
        else if (id === "11") {
          title = 'FreightAnalyzer'
        }
        else if (id === "13") {
          title = 'Transportation Time'
        }
        else if (id === "14") {
          title = 'Transportation Service'
        }

        if (compareYears && (id === "6" || id === "7" || id === "8" || id === "9" || id === "10" || id === "13" || id === "14")) {
          reportData = sortReport().map( (line) => {
            if (id === "8") {
              return { [title]: line.id, 'Description': line.name,
                      "Orders - 2": line.year_2.orders,
                      "Orders - 1": line.year_1.orders,
                      Orders: line.orders,
                      "Lines - 2": line.year_2.lines,
                      "Lines - 1": line.year_1.lines,
                       Lines: line.lines,
                      "Packages - 2": line.year_2.packages,
                      "Packages - 1": line.year_1.packages,
                       Packages: line.packages,
                       "Units - 2": line.year_2.units,
                       "Units - 1": line.year_1.units,
                        Units: line.units }
            } else if (id === "13") {
              return { [title]: line.id,
                      "Packages - 2": line.year_2.packages,
                      "Packages - 1": line.year_1.packages,
                       Packages: line.packages,
                       "Packages With Freight - 2": line.year_2.packages_with_freight,
                       "Packages With Freight - 1": line.year_1.packages_with_freight,
                      "Packages With Freight": line.packages_with_freight,
                        "Freight Cost - 2": line.year_2.freight_cost,
                       "Freight Cost - 1": line.year_1.freight_cost,
                       'Freight Cost': line.freight_cost,
                       "$ / # - 2": line.year_2.freight_per_package,
                       "$ / # - 1": line.year_1.freight_per_package,
                       '$ / #': line.freight_per_package  }
            } else if (id === "14") {
              return { [title]: line.id,
                      "Packages - 2": line.year_2.packages,
                      "Packages - 1": line.year_1.packages,
                       Packages: line.packages,
                       "Packages With Freight - 2": line.year_2.packages_with_freight,
                       "Packages With Freight - 1": line.year_1.packages_with_freight,
                      "Packages With Freight": line.packages_with_freight,
                       "Freight Cost - 2": line.year_2.freight_cost,
                       "Freight Cost - 1": line.year_1.freight_cost,
                       'Freight Cost': line.freight_cost,
                       "$ / # - 2": line.year_2.freight_per_package,
                       "$ / # - 1": line.year_1.freight_per_package,
                       '$ / #': line.freight_per_package,
                       "Avg. Delivery Time - 2": line.year_2.avg_delivery_time ,
                       "Avg. Delivery Time - 1": line.year_1.avg_delivery_time ,
                       'Avg. Delivery Time': line.avg_delivery_time
                        }
            } else {
              return { [title]: line.name,
                      "Orders - 2": line.year_2.orders,
                      "Orders - 1": line.year_1.orders,
                      Orders: line.orders,
                      "Lines - 2": line.year_2.lines,
                      "Lines - 1": line.year_1.lines,
                       Lines: line.lines,
                      "Packages - 2": line.year_2.packages,
                      "Packages - 1": line.year_1.packages,
                       Packages: line.packages,
                       "Units - 2": line.year_2.units,
                       "Units - 1": line.year_1.units,
                        Units: line.units }
            }
          })
        } else {
          reportData = sortReport().map( (line) => {
            if (id === "8") {
              return { [title]: line.id, 'Description': line.name, Orders: line.orders, Lines: line.lines, Packages: line.packages, Units: line.units }
            }
            else if (id === "13") {
              return { [title]: line.id, Packages: line.packages, "Packages With Freight": line.packages_with_freight, 'Freight Cost': line.freight_cost, '$ / #': line.freight_per_package }
            }
            else if (id === "14") {
              return { [title]: line.id, Packages: line.packages, "Packages With Freight": line.packages_with_freight, 'Freight Cost': line.freight_cost,'$ / #': line.freight_per_package, 'Avg. Delivery Time': line.avg_delivery_time }
            }
            else {
              return { [title]: line.name, Orders: line.orders, Lines: line.lines, Packages: line.packages, Units: line.units }
            }
          })
        }

    }

    const ws = XLSX.utils.json_to_sheet(reportData)
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], {type: fileType})
    FileSaver.saveAs(data, reportTitle + fileExtension)
  }

  let reportData = analyticsState[ `reportData${id}` ]
  let loaded = analyticsState[ `loaded${id}` ]
  let loading = analyticsState[ `loading${id}` ]
  let Report = Reports[ `Report${id}` ]
  let Detail = Details[ `Detail${id}` ]
  let isDetailExist = Detail ? true : false
  if( !Report ) return console.error(`no report found for id === ${id}`)
  let quick_filters_config = QUICK_FILTERS_CONFIGS[ id ]
  let { isReportDetailShown = false } = analyticsState

  return (
    <div>
      {
        isDetailExist &&
        isReportDetailShown &&
        <Detail
          analyticsActions={ analyticsActions }
        />
      }
      <div style={{ display : isDetailExist && isReportDetailShown ? 'none' : 'block' }} >
        <div className="analytics-bar noprint">
          {
            shipment_times_only
            ? <BarST
              loaded={ loaded }
              generateReport={ generateReport }
              exportReport={ exportReport }
              analyticsActions={ analyticsActions }
              filter={ filter }
              quick_filters_config={ quick_filters_config }
              analyticsState={ analyticsState }
              pathname={pathname}
            />
            : <Bar
              loaded={ loaded }
              generateReport={ generateReport }
              exportReport={ parseInt(id,10) !== 11? exportReport: null }
              analyticsActions={ analyticsActions }
              filter={ filter }
              quick_filters_config={ quick_filters_config }
              pathname={pathname}
            />
          }
        </div>
        {
          !loaded &&
          !loading &&
          <div
            style={{
              height: '200px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <h4 style={{padding:"20px"}}>
              Choose filter values in the filter area and click the <span className="sbold">RUN REPORT</span> button.
            </h4>
          </div>
        }
        {
          loaded &&
          <div className="report-print-body" style={{ minHeight: '410px', padding: "15px 25px 10px 15px", overflow: "hidden" }}>
            <Report
              reportData={ reportData }
              analyticsState={ analyticsState }
              analyticsActions={ analyticsActions }
            />
          </div>
        }
        {
          loading &&
          <LoadingAnimation />
        }
      </div>
    </div>
  )
}

export default connect(
  state => ({
    analyticsState : state.analytics,
    filter         : state.analytics.filter,
    loading        : state.analytics.loading,
    loaded         : state.analytics.loaded
  }),
  dispatch => ({
    analyticsActions : bindActionCreators( analyticsActions, dispatch )
  })
)(SingleReportDetail)
