import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/worldLow.js'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const mainBar = [
	{
	  lineColor :       "red",
	  fillColors :      "red",
	  fillAlphas :      1,
	  type :            "column",
	  title :           "Quantity",
	  valueField :      "value",
	  //clustered :       true,
	  columnWidth :     0.7,
	  lineThickness:    1,
	  legendPeriodValueText : "[[value.sum]]",
	  showBalloon:      true,
	  balloonText :     "<span style=\"text-align: left\">From: <b>[[from]]</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To: <b>[[to]]</b></span> <br/><br/>[[title]]:<br/><b style='font-size: 130%'>[[value]]</b>",
	  labelText :       "[[value]]"
	}
]

const secondaryBars = [
	{
		lineColor :       "#FFC500CC",
		fillColors :      "#FFC500CC",
		fillAlphas :      1,
		type :            "column",
		title :           "Quantity (-2 years)",
		valueField :      "value_2",
		//clustered :       true,
		columnWidth :     0.6,
		lineThickness:    1,
		legendPeriodValueText : "[[value.sum]]",
		showBalloon :     false
	},
	{
		lineColor :       "#FF6800CC",
		fillColors :      "#FF6800CC",
		fillAlphas :      1,
		type :            "column",
		title :           "Quantity (-1 year)",
		valueField :      "value_1",
		//clustered :       true,
		columnWidth :     0.6,
		lineThickness:    1,
		legendPeriodValueText : "[[value.sum]]",
		showBalloon :     false
	}
]

const Time = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			let { bars, showTrendLine, compareYears } = analyticsState
	    analyticsActions.setRootReduxStateProp_multiple({
	      currentSortedField: 'sortkey',
	      sortType: 'ascending',
		  	bars: !bars? mainBar: bars
	    })
			adjustChart(showTrendLine, compareYears)
		},
		[]
	)

	function sortReportData () {
		let { currentSortedField, sortType, valueField } = analyticsState
  	let { chart = [] } = reportData
  	
  	chart = chart.map( d => ({
	    ...d,
		  value : d[ valueField ],
		  value_1 : d.year_1[ valueField ],
		  value_2 : d.year_2[ valueField ]
	  }) )

    if (!currentSortedField) {
    	return chart
    }

		chart.sort(function(a, b){
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
			chart.reverse()
		}

		return chart
  }

  function sort (event) {
  	event.preventDefault()
  	let { sortType } = analyticsState
  	let field = event.currentTarget.getAttribute('data-field')
  	analyticsActions.setRootReduxStateProp_multiple({
			currentSortedField: field,
  		sortType: sortType === 'ascending' ? 'descending' : 'ascending'
		})
  }

  function changeValueField (event) {
	  let field = event.currentTarget.getAttribute('data-field')
		analyticsActions.setRootReduxStateProp_multiple({
			valueField : field
		})
  }

  function adjustChart (showTrendLine, compareYears) {
		let new_bars = compareYears? [...secondaryBars, ...mainBar]: [...mainBar]
		let mainBarIndex = compareYears === false? 0: 2
		if (new_bars) {
			new_bars.forEach( (bar, i) => {
				if (showTrendLine) {
					delete bar.type
					bar.lineThickness = i === mainBarIndex? 4: 3
					bar.fillAlphas = i === mainBarIndex? 0.05: 0
				}
				else {
					bar.type = "column"
					bar.lineThickness = 1
					bar.fillAlphas = 1
				}
			})
		}

		analyticsActions.setRootReduxStateProp_multiple({
			bars : new_bars
		})
  }

  function changeCompareYears (event) {
		let { showTrendLine } = analyticsState
		analyticsActions.setRootReduxStateProp_multiple({
			compareYears : event.target.checked,
		  })
		adjustChart(showTrendLine, event.target.checked)
  }

  function changeShowTrendLine (event) {
		let { compareYears } = analyticsState
		analyticsActions.setRootReduxStateProp_multiple({
			showTrendLine : event.target.checked,
	  })
    adjustChart(event.target.checked, compareYears)
  }

  let isWeek = false
	let chartTable = useMemo(
  	() => sortReportData(),
  	[
			reportData.chart, 
			analyticsState.currentSortedField,
			analyticsState.sortType,
			analyticsState.valueField
		]
  )
	let { valueField, compareYears, showTrendLine } = analyticsState

	let { header, chart = [] } = reportData
	
  chart = chart.map( d => ({
    ...d,
	  value : d[ valueField ],
	  value_1 : d.year_1[ valueField ],
	  value_2 : d.year_2[ valueField ]
  }) )

  let { currentSortedField, sortType, bars } = analyticsState

	if (analyticsState.filter && analyticsState.filter["time_dimension"] && analyticsState.filter["time_dimension"][0].value === "weekly") {
		isWeek = true
	}

	if (bars) {
		bars.forEach( bar => {
			if (bar.balloonText && isWeek) {
				bar.balloonText = "<span style=\"text-align: left\">From: <b>[[from]]</b><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To: <b>[[to]]</b></span> <br/><br/>[[title]]:<br/><b style='font-size: 130%'>[[value]]</b>"
			}
			else if (bar.balloonText && !isWeek) {
				bar.balloonText = "[[title]]:<br/><b style='font-size: 130%'>[[value]]</b>"
			}
		});
	}
	
	let total = chart.length 
    				? chart.reduce( 
    						( prev, next ) => {
    							return {
    								[ valueField ] : prev[ valueField ] + ( next[ valueField ] || 0  )
    							} 
    						}, 
    						{ [ valueField ] : 0 } 
    					)[ valueField ]
					: 0

	let total_1 = chart.length 
	? chart.map(r => r.year_1).reduce( 
			( prev, next ) => {
				return {
					[ valueField ] : prev[ valueField ] + ( next[ valueField ] || 0  )
				} 
			}, 
			{ [ valueField ] : 0 } 
		)[ valueField ]
	: 0

	let total_2 = chart.length 
	? chart.map(r => r.year_2).reduce( 
			( prev, next ) => {
				return {
					[ valueField ] : prev[ valueField ] + ( next[ valueField ] || 0  )
				} 
			}, 
			{ [ valueField ] : 0 } 
		)[ valueField ]
	: 0

	if (!bars) return <div></div>

  return (
	  <div>
	    {
	      header.title && 
	      <div className="row">
	        <div className="col-md-5">
	          <h3 className="analytics-report-title-h3">
	            {header.title}
	          </h3>
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
									} )
								}
							</tbody>
						</table>
	        </div>
	        <div className="col-md-5">
			  		<div>
							<div className="btn-group" data-toggle="buttons">
								{
									[ 'Orders', 'Lines', 'Packages', 'Units' ].map(
										i => {

											let i_ = i.toLowerCase()
											return (
												<label 
												className={ classNames({
													'btn btn-default' : true,
													'active' 					: valueField === i_
												}) }
												data-field={ i_ }
												key={i_}
												onClick={ changeValueField }
											>
												<input type="radio" className="toggle"/> { i }
											</label>
											)
										}
									)
								}
							</div>
			  		</div>
			  		<div>
				  		<label className="mt-checkbox mt-checkbox-outline" style={{marginTop: "5px", marginBottom: "5px"}}>
                <input
                  type="checkbox"
                  checked={ compareYears }
									onChange={ changeCompareYears }
								/>
                Compare to previous 2 years
                <span/>
	            </label>
			  		</div>
			  		<div>
				  		<label className="mt-checkbox mt-checkbox-outline">
	            	<input
	                type="checkbox"
	                checked={ showTrendLine }
									onChange={ changeShowTrendLine }
								/>
	              Show Trend Line
	              <span></span>
	            </label>
			  		</div>
	        </div>
					<div className="col-md-2 total-col">
			  		{	
			  			!compareYears &&
	          	<span>
							  <span className="total-edge time-0"> <b className="total">Total: &nbsp;</b> { formatNumber( total, 0 ) } </span>
							</span>
			  		}
			  		{	
			  			compareYears &&
	          	<span>
							  <span className="total-edge time-0"> <b className="total">Total: &nbsp;</b> { formatNumber( total, 0 ) } </span>
							  <br/>
							  <span className="total-edge time-1"> <b className="total">Total (-1 y): &nbsp;</b> { formatNumber( total_1, 0 ) } </span>
							  <br/>
							  <span className="total-edge time-2"> <b className="total">Total (-2 y): &nbsp;</b> { formatNumber( total_2, 0 ) } </span>
							</span>
			  		}
					</div>
	      </div>
	    }
    

			<div className="row" style={{margin: 0}}>
				<div className="col-xs-12" style={{height:"450px", margin: '0' }} >
      		<AmCharts.React
	          key={`key${compareYears}${valueField}${showTrendLine}`}
		        type="serial"
		        fontFamily='Open Sans'
		        color='#888888'
	          /*legend={{
	            equalWidths :      false,
	            useGraphSettings : true,
	            valueAlign :       "left",
	            valueWidth :       120,
	            position   :      'top'
	          }}*/
		        dataProvider={ chart }
		        valueAxes={[{
	            id :        "orderAxis",
	            axisAlpha : 0,
	            gridAlpha : 0,
	            position :  "left",
	            title :     "quantity"
				  	}]}
				  	graphs={bars}
		        chartCursor={{
	            cursorAlpha :               0.1,
	            cursorColor :               "#000000",
	            fullWidth :                 true,
	            valueBalloonsEnabled :      true,
	            zoomable :                  false
	          }}
	          categoryField="name"
				  	categoryAxis={{
							labelRotation: 90,
							labelFunction:function(label, item, axis) {
							  if ( ( label.length > 20 ) ){
								  return label.substr(0, 20) + '...';
							  }
							  return label;
							}
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
						          'active' : currentSortedField === 'sortkey' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'sortkey' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="sortkey"
											onClick={ sort }
										> Time </a>
									</th>

									{ compareYears && <th className="text-right bl-light">
										Orders (-2)
									</th>}

									{ compareYears && <th className="text-right">
										Orders (-1)
									</th>}

									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'orders' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'orders' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="orders"
											onClick={ sort }
										> Orders </a>
									</th>


									{ compareYears && <th className="text-right bl-light">
										Lines (-2)
									</th>}

									{ compareYears && <th className="text-right">
										 Lines (-1)
									</th>}

									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'lines' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'lines' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="lines"
											onClick={ sort }
										> Lines </a>
									</th>



									{ compareYears && <th className="text-right bl-light">
										Packages (-2)
									</th>}

									{ compareYears && <th className="text-right">
										Packages (-1)
									</th>}


									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'packages' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'packages' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="packages"
											onClick={ sort }
										> Packages </a>
									</th>


									{ compareYears && <th className="text-right bl-light">
										Units (-2)
									</th>}

									{ compareYears && <th className="text-right">
										Units (-1)
									</th>}

									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'units' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'units' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="units"
											onClick={ sort }
										> Units </a>
									</th>

								</tr>
							</thead>
							<tbody>

								{
									chartTable.map( (d, i) => {
										let {
											id,
											lines,
											name,
											orders,
											packages,
											units,
											year_1,
											year_2
										} = d

										return (
											<tr key={ `report-grid-${id}` } className="analytics-tr">
												<td className="text-right">{i+1}</td>
												<td><span className="text-primary">{name}</span></td>
												
												{compareYears && <td className="text-right sbold bl-light"> { year_2.orders && formatNumber( year_2.orders, 0 ) } </td>}
												{compareYears && <td className="text-right sbold"> { year_1.orders && formatNumber( year_1.orders, 0 ) } </td>}
												<td className="text-right sbold"> { orders && formatNumber( orders, 0 ) } </td>
												
												{compareYears && <td className="text-right sbold bl-light"> { year_2.lines && formatNumber( year_2.lines, 0 ) } </td>}
												{compareYears && <td className="text-right sbold"> { year_1.lines && formatNumber( year_1.lines, 0 ) } </td>}
												<td className="text-right"> { lines && formatNumber( lines, 0 ) } </td>

												{compareYears && <td className="text-right sbold bl-light"> { year_2.packages && formatNumber( year_2.packages, 0 ) } </td>}
												{compareYears && <td className="text-right sbold"> { year_1.packages && formatNumber( year_1.packages, 0 ) } </td>}
												<td className="text-right"> { packages && formatNumber( packages, 0 ) } </td>

												{compareYears && <td className="text-right sbold bl-light"> { year_2.units && formatNumber( year_2.units, 0 ) } </td>}
												{compareYears && <td className="text-right sbold"> { year_1.units && formatNumber( year_1.units, 0 ) } </td>}
												<td className="text-right"> { units && formatNumber( units, 0 ) } </td>
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

Time.propTypes = {
  reportData: PropTypes.object,
  analyticsState: PropTypes.object,
  analyticsActions: PropTypes.object,
}

export default Time