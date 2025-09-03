import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AmCharts from '../../../../lib/amcharts3-react'

const mainBar = [
	{
		lineColor :       "#ff6347",
		fillColors :      "#ff6347",
		fillAlphas :      0.9,
		type :            "column",
		title :           "Open",
		valueField :      "tot_open",
		clustered :       true,
		columnWidth :     0.8,
		legendPeriodValueText : "[[tot_open.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[tot_open]]</b>",
		labelText:        "[[tot_open]]",
		color:            "black",
		//labelPosition:    "top"
	},
	{
		lineColor :       "#4caf50",
		fillColors :      "#4caf50",
		fillAlphas :      0.9,
		type :            "column",
		title :           "Processed",
		valueField :      "tot_processed",
		clustered :       true,
		columnWidth :     0.8,
		legendPeriodValueText : "[[tot_processed.sum]]",
		balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[tot_processed]]</b>",
		labelText:        "[[tot_processed]]",
		color:            "black",
		//labelPosition:    "top"
	}
]

const IncidentReport = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			analyticsActions.setRootReduxStateProp_multiple({
				currentSortedField: 'incident_date',
				sortType: 'descending',
				bars: mainBar
	    })
		},
		[]
	)

	function sortReportData () {
  	let { rows = [] } = reportData
  	let { currentSortedField, sortType } = analyticsState
    if( !currentSortedField ) return rows
		rows = [ ...rows ]
		rows.sort(function(a, b){
			let a_ = a[ currentSortedField ]
		 	let b_ = b[ currentSortedField ]
		 	if( currentSortedField !== 'id' ){
				a_ = a_ ?  a_.toLowerCase() : ''
				b_ = b_ ?  b_.toLowerCase() : ''
			}
		 	if ( a_ < b_ ) return -1
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

  function onIncidentClicked (event) {
    event.preventDefault()
    let incident_id = event.currentTarget.getAttribute('data-param-incident-id')
    analyticsActions.fetchIncidentDetail(incident_id)
  }

  let chartTable = useMemo(
  	() => sortReportData(),
  	[
			reportData.rows, 
			analyticsState.currentSortedField,
			analyticsState.sortType,
		]
  )
	let { 
		chart = [],
		header
	} = reportData

  let { currentSortedField, sortType, bars } = analyticsState

	if (!bars) return <div></div>

	let maxY = 10

	chart.forEach( 
		bar => { 
			if (bar.tot_open + bar.tot_processed > maxY) {
				maxY =  bar.tot_open + bar.tot_processed 
			} 
		}
	)

	let chart_params= [{
		id :        "orderAxis",
		axisAlpha : 0,
		gridAlpha : 0,
		position :  "left",
		title :     "Total incidents",
		stackType: "regular",
		maximum:   maxY
  }]

	return (
	  <div>
    	{
      	header.title && 
    		<div className="row">
        	<div className="col-md-6">
          	<h3 className="analytics-report-title-h3">
            	{header.title}
          	</h3>
		  			<table>
		  				<tbody>
								{
									header.parameters && header.parameters.length > 0 && 
									header.parameters.map( 
										(p, i) => {
											let {	label, value } = p
											return (
												<tr key={ `report-param-${i}` } className="analytics-params">
													<td className="analytics-label">{label}:</td>
													<td className="analytics-value">{value}</td>
												</tr>
											)
										}
									)
								}
							</tbody>
						</table>
        	</div>
      	</div>
    	}

			<div className="row" style={{margin: 0}}>
				<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{height:"450px", margin: '0' }} >
      		<AmCharts.React
	          key={"amchar-" + maxY}
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
	          valueAxes={chart_params} 
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
						          'active' : currentSortedField === 'id' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'id' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="id"
											onClick={ sort }
										> Incident ID </a>
									</th>

									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'warehouse' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'warehouse' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="warehouse"
											onClick={ sort }
										> Warehouse </a>
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

									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'incident_date' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'incident_date' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="incident_date"
											onClick={ sort }
										> Incident Date </a>
									</th>

									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'title' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'title' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="title"
											onClick={ sort }
										> Title </a>
									</th>


									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'reason' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'reason' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="reason"
											onClick={ sort }
										> Reason </a>
									</th>

									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'group' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'group' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="group"
											onClick={ sort }
										> Group </a>
									</th>

									<th>
										<span className="column-sort noprint"><i className={ classNames({
						          'fa fa-long-arrow-down' : true,
						          'active' : currentSortedField === 'status' && sortType === "descending" ? true : false
						        }) } aria-hidden="true"></i></span>
						        <span className="column-sort column-sort-up noprint"><i className={ classNames({
						          'fa fa-long-arrow-up' : true,
						          'active' : currentSortedField === 'status' && sortType === "ascending" ? true : false,
						        }) } aria-hidden="true"></i></span>
										<a 
											data-field="status"
											onClick={ sort }
										> Status </a>
									</th>

								</tr>
							</thead>
							<tbody>

								{
									chartTable.map( (d, i) => {
										let {
											id,
											warehouse,
											incident_date,
											title,
											reason,
											group,
											status,
											account_number
										} = d

										return (
											<tr key={ `report-grid-${id}` } className="analytics-tr">
												<td className="text-right">{i+1}</td>
												<td><span>
													<a 
														onClick={ onIncidentClicked }
														data-param-incident-id={ id }>
														{ id }
													</a>
													</span>
												</td>
												<td><span>{warehouse}</span></td>
												<td><span>{account_number}</span></td>
												<td><span>{incident_date}</span></td>
												<td><span className="text-primary">{title}</span></td>
												<td><span>{reason}</span></td>
												<td><span>{group}</span></td>
												<td><span>{status}</span></td>
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

IncidentReport.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default IncidentReport