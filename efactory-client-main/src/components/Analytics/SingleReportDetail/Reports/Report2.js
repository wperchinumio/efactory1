import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/usa2High.js'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const Report2 = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			analyticsActions.setRootReduxStateProp_multiple({
	      currentSortedField: 'orders',
		  	sortType: 'descending'
	    })
		},
		[]
	)

	function sortReportData () {
  	let { chart = [] } = reportData
  	let { currentSortedField, sortType } = analyticsState  	
    if( !currentSortedField ) {
    	return chart
    }
  	chart = [ ...chart ]
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

  function processReportData () {
  	let { chart = [] } = reportData
  	chart = chart.map( d => ({
	    ...d,
	    value: d[ analyticsState.valueField ]
	  }) )
		chart = chart.slice(0).sort( 
			(a, b) => {
				if(a.value > b.value) return -1
		    if(a.value < b.value) return 1
		    return 0
			} 
		)
		chart = chart.map( (o, i, a) => {
	    let sum_index = 4
	    if (i < sum_index) return o
	    else {
	      if (i === sum_index) {
	        a[sum_index] = {
	          id: 'Summary',
	          name: 'Others',
	          iso2: 'Others',
	          orders: o.orders,
	          value: o.value,
	          lines: o.lines,
	          packages: o.packages,
	          units: o.units
	        }
	      }
	      else {
	        a[sum_index].orders += o.orders
	        a[sum_index].value += o.value
	        a[sum_index].lines += o.lines
	        a[sum_index].packages += o.packages
	        a[sum_index].units += o.units
	      }
	      return a[sum_index]
    	}
  	}).slice(0,5)
		
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

  let chartTable = useMemo(
  	() => sortReportData(),
  	[
			reportData.chart, 
			analyticsState.currentSortedField,
			analyticsState.sortType,
		]
  )
  let icon = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z"
	let { valueField, currentSortedField, sortType } = analyticsState
	let { chart = [], header } = reportData
	chart = chart.map( d => ({
    ...d,
    value: d[ valueField ]
  }) )

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

  const processedReportData = useMemo(
  	() => processReportData(),
  	[
  		reportData.chart,
  		analyticsState.valueField
  	]
  )
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
	        <div className="col-md-6">
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
	          <span style={{ verticalAlign: 'sub', paddingLeft : '20px' }}> <b>Total:</b> { formatNumber( total, 0 ) } </span>
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
			        } )
			    }
			  </tbody>
			</table>

			<div className="row" style={{margin: 0}}>
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-6" style={{height:"450px", margin: '0' }} >
	        <AmCharts.React
						printWidth="500px"
	          type="map"
	          theme="light"
	          colorSteps={6}
	          areasSettings={{
	          "autoZoom": true,
	          "balloonText": "[[title]]: <strong>[[value]]</strong>"
	          }}
	          valueLegend={{
	            "right": 10,
	            "minValue": "few",
	            "maxValue": "many"
	          }}
	          dataProvider={{
	            map: "usa2High",
	            areas : chart,
	            images: [ 
	            	{
				 					latitude: 34.0633,
				 					longitude: -117.6509,
				 					svgPath: icon,
				 					color: "#cc4748",
									labelColor: "#fff",
									labelRollOverColor: "#fff",
									labelFontSize: "13",
				 					scale: 1.2,
				 					label: "DCL (Ontario)",
				 					labelShiftY: 2,
				 					labelShiftX: 2,
			 					},
				 				{
				 					"latitude": 37.5483,
				 					"longitude": -121.9886,
				 					"svgPath": icon,
				 					"color": "#cc4748",
									"labelColor": "#fff",
									"labelRollOverColor": "#fff",
				 					"scale": 1.2,
				 					"label": "DCL (Fremont)",
									"labelFontSize": "13",
				 					"labelShiftY": 2,
				 					"labelShiftX": 2
				 				},
				 				{
				 					"latitude": 38.2527,
				 					"longitude": -85.7585,
				 					"svgPath": icon,
				 					"color": "#cc4748",
									"labelColor": "#fff",
									"labelRollOverColor": "#fff",
									"labelFontSize": "13",
				 					"scale": 1.2,
				 					"label": "DCL (Louisville)",
				 					"labelShiftY": 20,
				 					"labelShiftX": -30
				 				},
				 				{
				 					"latitude": 40.0112,
				 					"longitude": -76.7091,
				 					"svgPath": icon,
				 					"color": "#cc4748",
									"labelColor": "#fff",
									"labelRollOverColor": "#fff",
									"labelFontSize": "13",
				 					"scale": 1.2,
				 					"label": "DCL (York)",
				 					"labelShiftY": -20,
				 					"labelShiftX": -60
				 				}
				 			],
	          }}       
	        />
				</div>
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-6" style={{height:"450px", margin: '0' }} >
					<AmCharts.React
						printWidth="450px"
						type="pie"
						startDuration={0}
						theme="light"
						addClassNames={true}
						legend={{
							"position":"right",
							"marginRight":0,
							"autoMargins":false,
							"valueWidth":80
						}}
						innerRadius="30%"
						outlineAlpha={0.4}
						valueField="value"
						titleField="iso2"
						dataProvider={processedReportData}
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
							          'active' : currentSortedField === 'name' && sortType === "descending" ? true : false
							        }) } aria-hidden="true"></i></span>
							        <span className="column-sort column-sort-up noprint"><i className={ classNames({
							          'fa fa-long-arrow-up' : true,
							          'active' : currentSortedField === 'name' && sortType === "ascending" ? true : false,
							        }) } aria-hidden="true"></i></span>
											<a 
												data-field="name"
												onClick={ sort }
											> State </a>
										</th>
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
											> Total Orders </a>
										</th>
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
											> Total Lines </a>
										</th>
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
											> Total Packages </a>
										</th>
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
											> Total Units </a>
										</th>
									</tr>
								</thead>
								<tbody>

									{
										chartTable.map( (d, i) => {
											let {
												id,
												iso2,
												lines,
												name,
												orders,
												packages,
												units
											} = d

											return (
												<tr key={ `report-grid-${id}` } className="analytics-tr">
													<td className="text-right">{i+1}</td>
													<td><span className="text-primary">{name}</span> - <span className="bold">{iso2}</span></td>
													<td className="text-right sbold"> { orders && formatNumber( orders, 0 ) } </td>
													<td className="text-right"> { lines && formatNumber( lines, 0 ) } </td>
													<td className="text-right"> { packages && formatNumber( packages, 0 ) } </td>
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

Report2.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default Report2