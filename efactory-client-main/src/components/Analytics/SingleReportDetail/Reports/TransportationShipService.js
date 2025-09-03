import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/worldLow.js'

const mainBar = [
	{
		lineColor :       "#731F0B",
		fillColors :      "#731F0B",
		fillAlphas :      0.9,
		type :            "column",
		title :           "Total",
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
		lineColor :       "#D08472",
		fillColors :      "#D08472",
		fillAlphas :      0.7,
		type :            "column",
		title :           "Total (-2 years)",
		valueField :      "value_2",
		clustered :       true,
		columnWidth :     0.6,
		legendPeriodValueText : "[[value.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	},
	{
		lineColor :       "#BB4C31",
		fillColors :      "#BB4C31",
		fillAlphas :      0.7,
		type :            "column",
		title :           "Total (-1 year)",
		valueField :      "value_1",
		clustered :       true,
		columnWidth :     0.6,
		legendPeriodValueText : "[[value.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
	}
]

const TransportationShipService = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			let { bars } = analyticsState
		  analyticsActions.setRootReduxStateProp_multiple({
		    currentSortedField: 'packages',
			  valueField: 'packages',
			  sortType: 'descending',
			  bars: !bars? mainBar: bars
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
  	let { valueField } = analyticsState

  	chart = chart.map( d => ({
	    ...d,
	    value : d[ valueField ],
		  value_1 : d.year_1[ valueField ],
		  value_2 : d.year_2[ valueField ]
	  }) )

		chart = chart.slice(0).sort( 
			(a, b) => {
				if(a.value > b.value) return -1 * (valueField === 'avg_delivery_time' || valueField === 'freight_per_package'? -1: 1)
		    if(a.value < b.value) return 1 * (valueField === 'avg_delivery_time' || valueField === 'freight_per_package'? -1: 1)
		    return 0
			} 
		)
		if (valueField === 'avg_delivery_time') {
			chart = chart.filter(o => !!o.avg_delivery_time !== false)
		}
		if (valueField === 'freight_per_package') {
			chart = chart.filter(o => !!o.freight_per_package !== false)
		}

		chart = chart.map( (o, i, a) => {
	    let sum_index = 10
	    if (i < sum_index || valueField === 'avg_delivery_time' || valueField === 'freight_per_package') return o
	    else {
	      if (i === sum_index) {
	        a[sum_index] = {
	          id: 'Summary',
	          name: 'Others',
	          value: o.value,
	          freight_cost: o.freight_cost,
	          packages: o.packages,
	          packages_with_freight: o.packages_with_freight,
	          avg_delivery_time: o.avg_delivery_time,
	          freight_per_package: o.freight_per_package
	        }
	      }
	      else {
	        a[sum_index].value += o.value
	        a[sum_index].freight_cost += o.freight_cost
	        a[sum_index].packages += o.packages
	        a[sum_index].packages_with_freight += o.packages_with_freight
	        a[sum_index].avg_delivery_time += o.avg_delivery_time
	        a[sum_index].freight_per_package += o.freight_per_package
	      }
	      return a[sum_index]
    	}
  	}).slice(0,(valueField === 'avg_delivery_time' || valueField === 'freight_per_package'? 10: 11))
		
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
			valueField: field
		})
  }

  function changeCompareYears (event) {
	  analyticsActions.setRootReduxStateProp_multiple({
			compareYears: event.target.checked,
			bars: event.target.checked? [...secondaryBars, ...mainBar]: [...mainBar]
	  })
  }

  let chartTable = sortReportData()
  let { valueField, compareYears } = analyticsState
  let { chart = [], header } = reportData

	chart = chart.map( d => ({
    ...d,
    value : d[ valueField ],
	  value_1 : d.year_1[ valueField ],
	  value_2 : d.year_2[ valueField ]
  }) )

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

	if (bars.length > 0) {
		bars = bars.map(o => {
			o.title =  o.title.replace('Days', 'Total')
			return o
		})	
		switch (valueField) {
			case 'avg_delivery_time':
				bars = bars.map(o => {
					o.title =  o.title.replace('Total', 'Days')
					return o
				})	
				break
			default:
				break
		}
	}

	let decimals = 0
	if (valueField === 'freight_cost' || valueField === 'freight_per_package') decimals = 2

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
	          			[ 'packages', 'packages_with_freight', 'freight cost', '$ / #', 'avg delivery time' ].map(
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
					                <input type="radio" className="toggle"/> { i === 'avg delivery time'? 'avg delivery days': (i === 'freight cost'? 'freight': i.replace('_',' ').replace('_',' ')) }
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
					  	!compareYears &&
			        <span>
						  	<span className="total-edge t-service-0"> <b className="total">Total: &nbsp;</b> { valueField !== 'avg_delivery_time' && valueField !== 'freight_per_package'? formatNumber( total, decimals ): 'N/A' } </span>
							</span>
					  }
					  {	
					  	compareYears &&
			        <span>
							  <span className="total-edge t-service-0"> <b className="total">Total: &nbsp;</b> { valueField !== 'avg_delivery_time' && valueField !== 'freight_per_package'? formatNumber( total, decimals ): 'N/A' } </span>
							  <br/>
							  <span className="total-edge t-service-1"> <b className="total">Total (-1 y): &nbsp;</b> { valueField !== 'avg_delivery_time' && valueField !== 'freight_per_package'? formatNumber( total_1, decimals ): 'N/A' } </span>
							  <br/>
							  <span className="total-edge t-service-2"> <b className="total">Total (-2 y): &nbsp;</b> { valueField !== 'avg_delivery_time' && valueField !== 'freight_per_package'? formatNumber( total_2, decimals ): 'N/A' } </span>
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
						position   :      'top',
						enabled:           valueField === 'avg_delivery_time'? false: true
          }}*/
					dataProvider={ processedReportData }
			    valueAxes={[{
            id :        "orderAxis",
            axisAlpha : 0,
            gridAlpha : 0,
            position :  "left",
            title :     valueField === 'avg_delivery_time'? "days": "total"
          }]}
			    graphs={bars}
			    chartCursor={{
            cursorAlpha :               0.1,
            cursorColor :               "#000000",
            fullWidth :                 true,
            valueBalloonsEnabled :      false,
            zoomable :                  false
          }}
			    categoryField="name"
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
					titleField="name"
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
						          'active' : currentSortedField === 'name' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'name' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="name"
											onClick={ sort }
										> Ship Service </a>
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

									{ compareYears && <th className="text-right bl-light">
									Avg. Delivery Days (-2)
									</th>}

									{ compareYears && <th className="text-right">
									Avg. Delivery Days (-1)
									</th>}

									<th className="text-right">
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'avg_delivery_time' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'avg_delivery_time' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="avg_delivery_time"
											onClick={ sort }
										> Avg. Delivery Days </a>
									</th>

								</tr>
							</thead>
							<tbody>

								{
									chartTable.map( (d, i) => {
										let {
											id,
											freight_cost,
											name,
											packages,
											packages_with_freight,
											freight_per_package,
											avg_delivery_time,
											year_1,
											year_2
										} = d

										return (
											<tr key={ `report-grid-${id}` } className="analytics-tr">
												<td className="text-right">{i+1}</td>
												<td><span className="text-primary">{name}</span></td>
												
												{compareYears && <td className="text-right bl-light"> { year_2.packages && formatNumber( year_2.packages, 0 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.packages && formatNumber( year_1.packages, 0 ) } </td>}
												<td className="text-right"> { packages && formatNumber( packages, 0 ) } </td>

												{compareYears && <td className="text-right bl-light"> { year_2.packages_with_freight && formatNumber( year_2.packages_with_freight, 0 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.packages_with_freight && formatNumber( year_1.packages_with_freight, 0 ) } </td>}
												<td className="text-right"> { packages_with_freight && formatNumber( packages_with_freight, 0 ) } </td>

												{compareYears && <td className="text-right bl-light"> { year_2.freight_cost && formatNumber( year_2.freight_cost, 2 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.freight_cost && formatNumber( year_1.freight_cost, 2 ) } </td>}
												<td className="text-right"> { freight_cost && formatNumber( freight_cost, 2 ) } </td>

												{compareYears && <td className="text-right bl-light"> { year_2.freight_per_package && formatNumber( year_2.freight_per_package, 2 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.freight_per_package && formatNumber( year_1.freight_per_package, 2 ) } </td>}
												<td className="text-right"> { freight_per_package && formatNumber( freight_per_package, 2 ) } </td>

												{compareYears && <td className="text-right bl-light"> { year_2.avg_delivery_time && formatNumber( year_2.avg_delivery_time, 1 ) } </td>}
												{compareYears && <td className="text-right "> { year_1.avg_delivery_time && formatNumber( year_1.avg_delivery_time, 1 ) } </td>}
												<td className="text-right"> { avg_delivery_time && formatNumber( avg_delivery_time, 1 ) } </td>
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

TransportationShipService.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default TransportationShipService