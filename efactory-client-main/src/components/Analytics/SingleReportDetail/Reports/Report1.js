import React, { useEffect, useMemo } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import AmCharts from '../../../../lib/amcharts3-react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const Report1 = ({
  reportData,
  analyticsState,
  analyticsActions,
}) => {
  useEffect(
    () => {
      analyticsActions.setRootReduxStateProp_multiple({
        currentSortedField: 'account_number',
        sortType: 'ascending'
      })
    },
    []
  )

  function sortReportData () {
    let { rows = [] } = reportData
    let { currentSortedField, sortType } = analyticsState

    if ( !currentSortedField ) {
      return rows
    }
    
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
    } )

    rows.sort(function(a, b){
      let a_ = a[ currentSortedField ]
        let b_ = b[ currentSortedField ]
        if( [ 'location', 'account_number'  ].includes( currentSortedField ) ){
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

  function sort (event) {
    event.preventDefault()
    let { sortType } = analyticsState
    let field = event.currentTarget.getAttribute('data-field')
    analyticsActions.setRootReduxStateProp_multiple({
      currentSortedField  : field,
      sortType            : sortType === 'ascending' ? 'descending' : 'ascending'
    })
  }

  function onDaysClicked (event) {

    event.preventDefault()
    
    let account_number = event.currentTarget.getAttribute('data-param-account-number')
    let location       = event.currentTarget.getAttribute('data-param-location')
    let client_id      = event.currentTarget.getAttribute('data-param-client-id')
    let days           = event.currentTarget.getAttribute('data-param-days')
    let oper           = event.currentTarget.getAttribute('data-param-days-oper')
    let days_formatted = event.currentTarget.getAttribute('data-param-days-formatted')

    if( !account_number || !location || !client_id || !days ){
      return console.warn( 'onDaysClicked data param is missing.' )
    }
    
    // shape filters and 
    let and = [
      {
        field : 'account_number',
        oper  : '=',
        value : account_number
      },
      {
        field : 'location',
        oper  : '=',
        value : location
      },
      {
        field : 'client_id',
        oper  : '=',
        value : client_id
      },
      {
        field : 'days',
        oper  : oper || '=',
        value : days
      }
    ]

    analyticsActions.fetchShipmentTypeDays({
      and,
      days_formatted
    })

    analyticsActions.setRootReduxStateProp_multiple({
      location_to_display: location,
      account_to_display: account_number
    })
  }

  let chartTable = useMemo(
    () => sortReportData(),
    [
      reportData.rows, 
      analyticsState.currentSortedField,
      analyticsState.sortType,
    ]
  )
  let { currentSortedField, sortType } = analyticsState
  let { header, chart } = reportData

  // Set colors
  chart[0].color = '#92D050';
  chart[1].color = '#C6E0B4';
  chart[2].color = '#FFE699';
  chart[3].color = '#FFD966';
  chart[4].color = '#FFA654';
  chart[5].color = '#C65911';
  chart[6].color = '#D91E18';
  
  let sum = 0
  sum = chart.reduce((sum, item) => sum + item.total, 0);

  let { client_id } = header

  return (
    <div>

    {
      header.title && 
      <div className="row">
        <div className="col-md-6">
          <h3 className="analytics-report-title-h3">
            {header.title}
          </h3>
        </div>
      </div>
    }

    <table><tbody>
    {
      header.parameters && header.parameters.length > 0 && 
        header.parameters.map( (p, i) => {
          let { label, value } = p
          return (
            <tr key={ `report-param-${i}` } className="analytics-params">
              <td className="analytics-label">{label}:</td>
              <td className="analytics-value">{value}</td>
            </tr>
          )
        } )
    }
    </tbody></table>

      <div className="row" style={{margin: 0}}>
        <div className="display-analytics-chart col-lg-10 col-md-12 col-sm-12 col-xs-12" style={{height:"450px", backgroundColor: "whitesmoke"}}>
          <AmCharts.React
            printWidth="900px"
            type="pie"
            startDuration={0}
            theme="light"
            addClassNames={true}
            legend={{
              "position":"right",
              "marginRight":0,
              "autoMargins":false,
              "valueText": "[[value]] ([[percents]]%)",
              "valueWidth": 120
            }}
            innerRadius="30%"
            depth3D={15}
            angle={30}
            outlineAlpha={0.4}
            valueField="total"
            titleField="title"
            dataProvider={chart}
            colorField="color"
            allLabels={
              [{
                "y": "54%",
                "align": "center",
                "size": 20,
                "bold": true,
                "text": formatNumber(sum,0),
                "color": "#555"
              }, {
                "y": "49%",
                "align": "center",
                "size": 15,
                "text": "Total",
                "color": "#555"
              }]
            }
          />
        </div>
      </div>
      <div className="row" style={{margin: "10px -25px 0 -15px"}}>
        <div className="col-md-12">
          <div className="table-responsive" style={{backgroundColor: "white"}}>
            <table className="table table-striped table-hover documents-table">
              <thead>
                <tr className="uppercase analytics-tr">
                  <th className="text-right" style={{width: "35px"}}>#</th>
                  <th>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'location' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'location' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="location"
                      onClick={ sort }
                    > Location </a>
                  </th>

                  <th>
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'account_number' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'account_number' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="account_number"
                      onClick={ sort }
                    > Account # </a>
                  </th>

                  <th className="text-center bold">CUT-OFF TIME</th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'same_day' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'same_day' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="same_day"
                      onClick={ sort }
                    > Same Day </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'day1' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'day1' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="day1"
                      onClick={ sort }
                    > 1 Day </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'days2' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'days2' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="days2"
                      onClick={ sort }
                    > 2 Days </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'days3' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'days3' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="days3"
                      onClick={ sort }
                    > 3 Days </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'days4' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'days4' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="days4"
                      onClick={ sort }
                    > 4 Days </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'days5' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'days5' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="days5"
                      onClick={ sort }
                    > 5 Days </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'many_days' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'many_days' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="many_days"
                      onClick={ sort }
                    > Over 5 Days </a>
                  </th>

                  <th className="text-right" >
                    <span className="column-sort noprint"><i className={ classNames({
                      'fa fa-long-arrow-down' : true,
                      'active' : currentSortedField === 'total_orders' && sortType === "descending" ? true : false
                    }) } aria-hidden="true"></i></span>
                    <span className="column-sort column-sort-up noprint"><i className={ classNames({
                      'fa fa-long-arrow-up' : true,
                      'active' : currentSortedField === 'total_orders' && sortType === "ascending" ? true : false,
                    }) } aria-hidden="true"></i></span>
                    <a 
                      data-field="total_orders"
                      onClick={ sort }
                    > Total Orders </a>
                  </th>

                </tr>
              </thead>
              <tbody>
                  {
                    chartTable.map( ( item, index ) => {

                      let {
                        account_number = '',
                        location = '',
                        order_time = '',
                        same_day,
                        day1,
                        days2,
                        days3,
                        days4,
                        days5,
                        many_days
                      } = item

                      let total = same_day + day1 + days2 + days3 + days4 + days5 + many_days

                      return (
                        <tr key={ `report-grid-${index}` } className="analytics-tr">
                          <td className="text-right">{ index + 1 }</td>
                          <td>{ location }</td>
                          <td>{ account_number }</td>
                          <td className="text-center">{ order_time }</td>
                          <td className="text-right">
                            { formatNumber( same_day, 0 ) }
                          </td>
                          <td className="text-right">
                            {
                              +day1 > 0 
                              ? <a 
                                onClick={ onDaysClicked }
                                data-param-account-number={ account_number }
                                data-param-location={ location }
                                data-param-client-id={ client_id }
                                data-param-days={ '1' }
                                data-param-days-formatted="1 DAY"
                              >
                                { formatNumber( day1, 0 ) }
                              </a>
                              : formatNumber( day1, 0 )
                            }
                            
                          </td>
                          <td className="text-right">
                            {
                              +days2 > 0
                              ? <a 
                                onClick={ onDaysClicked }
                                data-param-account-number={ account_number }
                                data-param-location={ location }
                                data-param-client-id={ client_id }
                                data-param-days={ '2' }
                                data-param-days-formatted="2 DAYS"
                              >
                                { formatNumber( days2, 0 ) }
                              </a>
                              : formatNumber( days2, 0 )
                            }
                          </td>
                          <td className="text-right">
                            {
                              +days3 > 0 
                              ? <a 
                                onClick={ onDaysClicked }
                                data-param-account-number={ account_number }
                                data-param-location={ location }
                                data-param-client-id={ client_id }
                                data-param-days={ '3' }
                                data-param-days-formatted="3 DAYS"
                              >
                                { formatNumber( days3, 0 ) }
                              </a>
                              : formatNumber( days3, 0 )
                            }
                          </td>
                          <td className="text-right">
                            {
                              +days4 > 0 
                              ? <a 
                                onClick={ onDaysClicked }
                                data-param-account-number={ account_number }
                                data-param-location={ location }
                                data-param-client-id={ client_id }
                                data-param-days={ '4' }
                                data-param-days-formatted="4 DAYS"
                              >
                                { formatNumber( days4, 0 ) }
                              </a>
                              : formatNumber( days4, 0 )
                            }
                              
                          </td>
                          <td className="text-right">
                            {
                              +days5 > 0 
                              ? <a 
                                onClick={ onDaysClicked }
                                data-param-account-number={ account_number }
                                data-param-location={ location }
                                data-param-client-id={ client_id }
                                data-param-days={ '5' }
                                data-param-days-formatted="5 DAYS"
                              >
                                { formatNumber( days5, 0 ) }
                              </a> 
                              : formatNumber( days5, 0 )
                            }
                          </td>
                          <td className="text-right">
                            {
                              +many_days > 0 
                              ? <a 
                                onClick={ onDaysClicked }
                                data-param-account-number={ account_number }
                                data-param-location={ location }
                                data-param-client-id={ client_id }
                                data-param-days={ '5' }
                                data-param-days-oper={ '>' }
                                data-param-days-formatted="OVER 5 DAYS"
                              >
                                { formatNumber( many_days, 0 ) }
                              </a>
                              : formatNumber( many_days, 0 )
                            }
                              
                          </td>
                          <td className="text-right sbold">
                            { formatNumber( total, 0 ) } 
                          </td>
                        </tr>
                      )
                    } )
                  }
                  
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </div>
  )
}

Report1.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default Report1