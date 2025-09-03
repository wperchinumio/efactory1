import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/worldLow.js'

const mainBar = [
	{
	  lineColor :       "red",
	  fillColors :      "red",
	  fillAlphas :      1,
	  type :            "column",
	  title :           "Total",
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
		title :           "Total (-2 years)",
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
		title :           "Total (-1 year)",
		valueField :      "value_1",
		//clustered :       true,
		columnWidth :     0.6,
		lineThickness:    1,
		legendPeriodValueText : "[[value.sum]]",
		showBalloon :     false
	}
]

const TransportationTime = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			let { bars, showTrendLine, compareYears } = analyticsState
	    analyticsActions.setRootReduxStateProp_multiple({
	      currentSortedField: 'sortkey',
		  	valueField: 'packages',
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

    if( !currentSortedField ) {
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
			compareYears: event.target.checked,
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
	let { 
		valueField,
		compareYears,
		showTrendLine
	} = analyticsState
	
	let { chart = [], header } = reportData
  
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

	let decimals = 0;
	if (valueField === 'freight_cost' || valueField === 'freight_per_package') decimals = 2;

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
									[ 'packages', 'packages_with_freight', 'freight cost', '$ / #' ].map(
										i => {

											let i_ = i.toLowerCase()
											return (
												<label 
												className={ classNames({
													'btn btn-default' : true,
													'active' 					: valueField === i_
												}) }
												data-field={ i_.replace(' ','_').replace(' ','_').replace('$_/_#', 'freight_per_package') }
												key={i_}
												onClick={ changeValueField }
											>
												<input type="radio" className="toggle"/> { i === 'freight cost'? 'freight': i.replace('_',' ').replace('_',' ') }
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
                <span></span>
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
						  	<span className="total-edge t-time-0"> <b className="total">Total: &nbsp;</b> {  valueField !== 'freight_per_package'? formatNumber( total, decimals ): 'N/A' } </span>
							</span>
					  }
					  {	
					  	compareYears &&
			        <span>
							  <span className="total-edge t-time-0"> <b className="total">Total: &nbsp;</b> { valueField !== 'freight_per_package'? formatNumber( total, decimals ): 'N/A' } </span>
							  <br/>
							  <span className="total-edge t-time-1"> <b className="total">Total (-1 y): &nbsp;</b> { valueField !== 'freight_per_package'? formatNumber( total_1, decimals ): 'N/A' } </span>
							  <br/>
							  <span className="total-edge t-time-2"> <b className="total">Total (-2 y): &nbsp;</b> { valueField !== 'freight_per_package'? formatNumber( total_2, decimals ): 'N/A' } </span>
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
	          title :     "total"
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
									Packages With Freight (-2)
								</th>}

								{ compareYears && <th className="text-right">
									Packages With Freight (-1)
								</th>}

								<th className="text-right">
									<span className="column-sort noprint"><i className={ classNames({
					          'fa fa-long-arrow-down' : true,
					          'active' : currentSortedField === 'packages_with_freight' && sortType === "descending" ? true : false
					        }) } aria-hidden="true"></i></span>
					        <span className="column-sort column-sort-up noprint"><i className={ classNames({
					          'fa fa-long-arrow-up' : true,
					          'active' : currentSortedField === 'packages_with_freight' && sortType === "ascending" ? true : false,
					        }) } aria-hidden="true"></i></span>
									<a 
										data-field="packages_with_freight"
										onClick={ sort }
									> Packages With Freight </a>
								</th>

								{ compareYears && <th className="text-right bl-light">
									Freight (-2)
								</th>}

								{ compareYears && <th className="text-right">
									Freight (-1)
								</th>}

								<th className="text-right">
									<span className="column-sort noprint"><i className={ classNames({
					          'fa fa-long-arrow-down' : true,
					          'active' : currentSortedField === 'freight_cost' && sortType === "descending" ? true : false
					        }) } aria-hidden="true"></i></span>
					        <span className="column-sort column-sort-up noprint"><i className={ classNames({
					          'fa fa-long-arrow-up' : true,
					          'active' : currentSortedField === 'freight_cost' && sortType === "ascending" ? true : false,
					        }) } aria-hidden="true"></i></span>
									<a 
										data-field="freight_cost"
										onClick={ sort }
									> Freight </a>
								</th>

								{ compareYears && <th className="text-right bl-light">
									$ / # (-2)
								</th>}

								{ compareYears && <th className="text-right">
								    $ / # (-1)
								</th>}

								<th className="text-right">
									<span className="column-sort noprint"><i className={ classNames({
					          'fa fa-long-arrow-down' : true,
					          'active' : currentSortedField === 'freight_per_package' && sortType === "descending" ? true : false
					        }) } aria-hidden="true"></i></span>
					        <span className="column-sort column-sort-up noprint"><i className={ classNames({
					          'fa fa-long-arrow-up' : true,
					          'active' : currentSortedField === 'freight_per_package' && sortType === "ascending" ? true : false,
					        }) } aria-hidden="true"></i></span>
									<a 
										data-field="freight_per_package"
										onClick={ sort }
									> $ / # </a>
								</th>



							</tr>
						</thead>
						<tbody>

							{
								chartTable.map( (d, i) => {
									let {
										id,
										name,
										packages,
										packages_with_freight,
										freight_cost,
										freight_per_package,
										year_1,
										year_2
									} = d

									return (
										<tr key={ `report-grid-${id}` } className="analytics-tr">
											<td className="text-right">{i+1}</td>
											<td><span className="text-primary">{name}</span></td>
											
											{compareYears && <td className="text-right sbold bl-light"> { year_2.packages && formatNumber( year_2.packages, 0 ) } </td>}
											{compareYears && <td className="text-right sbold"> { year_1.packages && formatNumber( year_1.packages, 0 ) } </td>}
											<td className="text-right sbold"> { packages && formatNumber( packages, 0 ) } </td>
											
											{compareYears && <td className="text-right sbold bl-light"> { year_2.packages_with_freight && formatNumber( year_2.packages_with_freight, 0 ) } </td>}
											{compareYears && <td className="text-right sbold"> { year_1.packages_with_freight && formatNumber( year_1.packages_with_freight, 0 ) } </td>}
											<td className="text-right sbold"> { packages_with_freight && formatNumber( packages_with_freight, 0 ) } </td>
											
											{compareYears && <td className="text-right sbold bl-light"> { year_2.freight_cost && formatNumber( year_2.freight_cost, 2 ) } </td>}
											{compareYears && <td className="text-right sbold"> { year_1.freight_cost && formatNumber( year_1.freight_cost, 2 ) } </td>}
											<td className="text-right"> { freight_cost && formatNumber( freight_cost, 2 ) } </td>

											{compareYears && <td className="text-right sbold bl-light"> { year_2.freight_per_package && formatNumber( year_2.freight_per_package, 2 ) } </td>}
											{compareYears && <td className="text-right sbold"> { year_1.freight_per_package && formatNumber( year_1.freight_per_package, 2 ) } </td>}
											<td className="text-right"> { freight_per_package && formatNumber( freight_per_package, 2 ) } </td>
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

TransportationTime.propTypes = {
  reportData: PropTypes.object,
  analyticsState: PropTypes.object,
  analyticsActions: PropTypes.object,
}

export default TransportationTime