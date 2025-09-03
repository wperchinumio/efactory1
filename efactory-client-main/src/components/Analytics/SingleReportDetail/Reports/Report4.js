import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/worldLow.js'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { formatDate } from '../../../_Helpers/OrderStatus'

const Report4 = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			analyticsActions.setRootReduxStateProp_multiple({
	      currentSortedField: 'cycle_count_date',
		  	sortType: 'ascending'
	    })
		},
		[]
	)

	function sortReportData () {
  	let { rows } = reportData
  	let { currentSortedField, sortType } = analyticsState
    if( !currentSortedField ) return rows
  	rows = [ ...rows ]
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

 	function sort (event) {
  	event.preventDefault()
  	let { sortType } = analyticsState
  	let field = event.currentTarget.getAttribute('data-field')
  	analyticsActions.setRootReduxStateProp_multiple({
			currentSortedField 	: field,
  		sortType 						: sortType === 'ascending' ? 'descending' : 'ascending'
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
  let { header, chart } = reportData
  let { currentSortedField, sortType } = analyticsState

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

	    <table>
	    	<tbody>
		      {
		        header.parameters && header.parameters.length > 0 && 
		        header.parameters.map( (p, i) => {
			        let {	label, value } = p
			        return (
	              <tr key={ `report-param-${i}` } className="analytics-params">
	                <td className="analytics-label">{label}:</td>
	                <td className="analytics-value">{value}</td>
	              </tr>
		          )
	         	})
		      }
	      </tbody>
	    </table>

			<div className="row" style={{margin: 0}}>
				<div className="col-xs-12" style={{height:"450px", margin: '0' }} >
	        <AmCharts.React
	          type="serial"
	          fontFamily='Open Sans'
	          color='#888888'
	          legend={{
	            equalWidths :      false,
	            useGraphSettings : true,
	            valueAlign :       "left",
	            valueWidth :       120,
	            position   :      'top'
	          }}
	          dataProvider={ chart }
	          valueAxes={[{
	            id :        "orderAxis",
	            axisAlpha : 0,
	            gridAlpha : 0,
	            position :  "left",
	            title :     "quantity"
	          }]} 
	          graphs={[
	            {
	              lineColor :       "#FF4500CC",
	              fillColors :      "#FF4500CC",
	              fillAlphas :      1,
	              type :            "column",
	              title :           "System Qty",
	              valueField :      "qty_onhand",
	              clustered :       true,
	              columnWidth :     0.7,
	              legendPeriodValueText : "[[value.sum]]",
	              balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	            },
	            {
	              valueAxis :       "orderAxis",
	              lineColor :       "#FF8C00AA",
	              fillAlphas :      1,
	              type :            "column",
	              title :           "Counted Qty",
	              valueField :      "qty_counted",
	              clustered :       true,
	              columnWidth :     0.7,
	              legendPeriodValueText : "[[value.sum]]",
	              balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	            },
	            {
	              lineColor :       "#555",
	              fillColors :      "#555",
	              fillAlphas :      1,
	              type :            "column",
	              title :           "Variance Qty",
	              valueField :      "qty_variance",
	              clustered :       true,
	              columnWidth :     0.7,
	              legendPeriodValueText : "[[value.sum]]",
	              balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	            }
	          ]}
	          chartCursor={{
	            categoryBalloonDateFormat : "DD",
	            cursorAlpha :               0.1,
	            cursorColor :               "#000000",
	            fullWidth :                 true,
	            valueBalloonsEnabled :      false,
	            zoomable :                  false
	          }}
	          dataDateFormat="YYYY-MM-DD"
	          categoryField="date"
	          categoryAxis={{
	            dateFormats :   [{
	              period : "DD",
	              format : "DD"
	            }, {
	              period : "WW",
	              format : "MMM DD"
	            }, {
	              period : "MM",
	              format : "MMM"
	            }, {
	              period : "YYYY",
	              format : "YYYY"
	            }],
	            parseDates :    true,
	            autoGridCount : false,
	            axisColor :     "#555555",
	            gridAlpha :     0.1,
	            gridColor :     "#FFFFFF",
	            gridCount :     50
	          }}
	          exportConfig={{
	            menuBottom : "20px",
	            menuRight :  "22px",
	            menuItems :  [{
	              icon :   global.App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
	              format : 'png'
	            }]
	          }}
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
						          'active' : currentSortedField === 'cycle_count_date' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'cycle_count_date' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="cycle_count_date"
											onClick={ sort }
										> Cycle Count Date </a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'item_number' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'item_number' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="item_number"
											onClick={ sort }
										> Item # </a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'description' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'description' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="description"
											onClick={ sort }
										> Description </a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'qty_onhand' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'qty_onhand' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="qty_onhand"
											onClick={ sort }
										> System Qty </a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'qty_counted' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'qty_counted' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="qty_counted"
											onClick={ sort }
										> Counted Qty </a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'qty_variance' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'qty_variance' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="qty_variance"
											onClick={ sort }
										> Variance Qty</a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'inv_type' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'inv_type' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="inv_type"
											onClick={ sort }
										> Warehouse </a>
									</th>
									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'cc_days' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'cc_days' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="cc_days"
											onClick={ sort }
										> CC Days </a>
									</th>
								</tr>
							</thead>
							<tbody>

								{
									chartTable.map( (d, i) => {
										let {
											cycle_count_date,
											item_number,
											description,
											qty_onhand,
											qty_counted,
											qty_variance,
											inv_type,
											cc_days,
										} = d

										return (
											<tr key={ `report-grid-${i}` } className="analytics-tr">
												<td className="text-right">{i+1}</td>
												<td className="text-right"> { cycle_count_date && formatDate( cycle_count_date, 'true' ) } </td>
												<td className="text-right"> { item_number } </td>
												<td className="text-right"> { description } </td>
												<td className="text-right"> { qty_onhand && formatNumber( qty_onhand, 0 ) } </td>
												<td className="text-right"> { qty_counted && formatNumber( qty_counted, 0 ) } </td>
												<td className="text-right"> { qty_variance && formatNumber( qty_variance, 0 ) } </td>
												<td className="text-right"> { inv_type } </td>
												<td className="text-right"> { cc_days } </td>
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

Report4.propTypes = {
  reportData: PropTypes.object,
  analyticsState: PropTypes.object,
  analyticsActions: PropTypes.object,
}

export default Report4