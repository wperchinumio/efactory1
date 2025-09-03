import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/worldLow.js'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const mainBar = [
	{
		lineColor :       "#2B7017",
		fillColors :      "#2B7017",
		fillAlphas :      0.9,
		type :            "column",
		title :           "Quantity",
		valueField :      "value",
		clustered :       true,
		columnWidth :     0.8,
		legendPeriodValueText : "[[value.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>",
		labelText :       "[[value]]"
  }
]
const secondaryBars = [
	{
		lineColor :       "#8CC66A",
		fillColors :      "#8CC66A",
		fillAlphas :      0.7,
		type :            "column",
		title :           "Quantity (-2 years)",
		valueField :      "value_2",
		clustered :       true,
		columnWidth :     0.6,
		legendPeriodValueText : "[[value.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	},
		{
		lineColor :       "#4c8f39",
		fillColors :      "#4c8f39",
		fillAlphas :      0.7,
		type :            "column",
		title :           "Quantity (-1 year)",
		valueField :      "value_1",
		clustered :       true,
		columnWidth :     0.6,
		legendPeriodValueText : "[[value.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	}
]

const Report8 = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			let { bars } = analyticsState
		  analyticsActions.setRootReduxStateProp_multiple({
		    currentSortedField: 'units',
			  valueField: 'units',
		    sortType: 'descending',
			  bars: !bars? mainBar: bars
		  })
		},
		[]
	)

	function sortReportData () {
		let { currentSortedField, sortType } = analyticsState
  	let { chart = [] } = reportData
    if( !currentSortedField ) return chart
  	chart = [ ...chart ]
		chart.sort(function(a, b){
			let a_ = a[ currentSortedField ]
		 	let b_ = b[ currentSortedField ]
		 	if( currentSortedField === 'id' || currentSortedField === 'name' ){
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

  function processReportData () {
  	let { chart = [] } = reportData
  	let { valueField } = analyticsState
  	chart = chart.map( 
			d => ({
	      ...d,
	      value : d[ valueField ],
			  value_1 : d.year_1[ valueField ],
			  value_2 : d.year_2[ valueField ]
	  	}) 
	  )
  	chart = chart.filter(p => p.id !== 'Others')
		chart = chart.slice(0).sort( 
			(a, b) => {
				if(a.value > b.value) return -1
		    if(a.value < b.value) return 1
		    return 0
			} 
		)
		chart = chart.slice(0,10)
		return chart
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

  function changeValueField (event) {
  	let field = event.currentTarget.getAttribute('data-field')
		analyticsActions.setRootReduxStateProp_multiple({
			valueField : field
		})
  }

  function changeCompareYears (event) {
	  analyticsActions.setRootReduxStateProp_multiple({
			compareYears : event.target.checked,
			bars : event.target.checked? [...secondaryBars, ...mainBar]: [...mainBar]
	  })
  }

  let chartTable = useMemo(
  	() => sortReportData(),
  	[
			reportData.chart, 
			analyticsState.currentSortedField,
			analyticsState.sortType,
		]
  )
  let { valueField, compareYears } = analyticsState
  let { header, chart = [] } = reportData
	chart = chart.map( 
		d => ({
      ...d,
      value : d[ valueField ],
		  value_1 : d.year_1[ valueField ],
		  value_2 : d.year_2[ valueField ]
  	}) 
  )
  let { currentSortedField, sortType, bars } = analyticsState
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

	const processedReportData = useMemo(
  	() => processReportData(),
  	[
  		reportData.chart,
  		analyticsState.valueField
  	]
  )
									
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
									header.parameters &&
									header.parameters.length > 0 && 
									header.parameters.map(
										(p, i) => {
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
			  			<label className="mt-checkbox mt-checkbox-outline" style={{marginTop: "5px"}}>
		            <input
		            	type="checkbox"
		              checked={ compareYears }
									onChange={ changeCompareYears }
								/>
		            Compare to previous 2 years
		            <span></span>
          		</label>
		  			</div>
      		</div>
					<div className="col-md-2 total-col">
					{	
						valueField === 'units' &&
						!compareYears &&
						<span>
					  	<span className="total-edge item-0"> <b className="total">Total: &nbsp;</b> { formatNumber( total, 0 ) } </span>
						</span>
					}
					{	
						valueField === 'units' && 
						compareYears &&
						<span>
						  <span className="total-edge item-0"> <b className="total">Total: &nbsp;</b> { formatNumber( total, 0 ) } </span>
						  <br/>
						  <span className="total-edge item-1"> <b className="total">Total (-1 y): &nbsp;</b> { formatNumber( total_1, 0 ) } </span>
						  <br/>
						  <span className="total-edge item-2"> <b className="total">Total (-2 y): &nbsp;</b> { formatNumber( total_2, 0 ) } </span>
						</span>
					}
				</div>
	    </div>
  	}

		<div className="row" style={{margin: 0}}>
			<div className="col-xs-12 col-sm-12 col-md-12 col-lg-7" style={{height:"450px", margin: '0' }} >
      <AmCharts.React
	      key={`key${compareYears}${valueField}`}
		    type="serial"
				rotate={true}
		    fontFamily='Open Sans'
		    color='#888888'
        /*legend={{
          equalWidths :      false,
          useGraphSettings : true,
          valueAlign :       "left",
          valueWidth :       120,
          position   :      'top'
        }}*/
				dataProvider={ processedReportData }
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
          valueBalloonsEnabled :      false,
          zoomable :                  false
        }}
				categoryField="id"
				categoryAxis={{
					labelRotation: 90,
				  	/*labelFunction:function(label, item, axis) {
						if ( ( label.length > 20 ) ){
							return label.substr(0, 20) + '...';
						}
						return label;
						}*/
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
		<div className="col-xs-12 col-sm-12 col-md-12 col-lg-5" style={{height:"450px", margin: '0' }} >
			<AmCharts.React
				key={`key${compareYears}${valueField}`}
				printWidth="450px"
				type="pie"
				startDuration={0}
				theme="light"
				addClassNames={true}
				innerRadius="30%"
				outlineAlpha={0.4}
				valueField="value"
				titleField="id"
				percentPrecision={1}
				dataProvider={ processedReportData }
        balloonText="[[name]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>"
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
						          'active' : currentSortedField === 'id' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'id' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="id"
											onClick={ sort }
										> Item # </a>
									</th>
									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'name' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'name' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="name"
											onClick={ sort }
										> Description </a>
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
												<td><span className="text-primary">{id}</span></td>
												<td className="text-secondary"> { name } </td>
												{compareYears && <td className="text-right bl-light"> { year_2.orders && formatNumber( year_2.orders, 0 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.orders && formatNumber( year_1.orders, 0 ) } </td>}
												<td className="text-right sbold"> { orders && formatNumber( orders, 0 ) } </td>
												
												{compareYears && <td className="text-right bl-light"> { year_2.lines && formatNumber( year_2.lines, 0 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.lines && formatNumber( year_1.lines, 0 ) } </td>}
												<td className="text-right"> { lines && formatNumber( lines, 0 ) } </td>

												{compareYears && <td className="text-right bl-light"> { year_2.packages && formatNumber( year_2.packages, 0 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.packages && formatNumber( year_1.packages, 0 ) } </td>}
												<td className="text-right"> { packages && formatNumber( packages, 0 ) } </td>

												{compareYears && <td className="text-right bl-light"> { year_2.units && formatNumber( year_2.units, 0 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.units && formatNumber( year_1.units, 0 ) } </td>}
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

Report8.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default Report8