import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import '../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../lib/amcharts3/ammap/maps/js/worldLow.js'
import SortableTh from './SortableTh'
import { formatNumber } from '../../../_Helpers/FormatNumber'
import { parseInt } from 'window-or-global'

const FreightAnalyzer = ({
	reportData,
	analyticsState,
	analyticsActions,
}) => {
	useEffect(
		() => {
			analyticsActions.setRootReduxStateProp_multiple({
				t1_currentSortedField : 'freight',
				t1_sortType           : 'descending',
				t2_currentSortedField : 'freight',
				t2_sortType           : 'descending',
				t3_currentSortedField : 'freight',
				t3_sortType           : 'descending',
				t4_currentSortedField : 'freight',
				t4_sortType           : 'descending',
				t5_currentSortedField : 'freight',
				t5_sortType           : 'descending',
				t6_currentSortedField : 'freight',
				t6_sortType           : 'descending',
	    })
		},
		[]
	)

  function formatWeight (value) {
	  switch (parseInt(value, 10)) {
			case 1:
				return "0 - 1"
			case 2:
				return "1 - 2"
			case 3:
				return "2 - 3"
			case 4:
				return "3 - 4"
			case 5:
				return "4 - 5"
			case 6:
				return "5 - 6"
			case 7:
				return "6 - 7"
			case 8:
				return "7 - 8"
			case 9:
				return "8 - 9"
			case 10:
				return "9 - 10"
			case 20:
				return "10 - 20"
			case 30:
				return "20 - 30"
			case 40:
				return "30 - 40"
			case 50:
				return "40 - 50"
			case 60:
				return "50 - 60"
			case 70:
				return "60 - 70"
			case 80:
				return "70 - 80"
			case 90:
				return "80 - 90"
			case 100:
				return "90 - 100"
			case 101:
				return "> 100"
			default:
				return "?"
	  }
  }

  function sortTh (tableIndex, sortedField, sortType, analyticsActions) {
		sortType = sortType === 'descending'? 'ascending': 'descending'
		analyticsActions.setRootReduxStateProp_multiple({
			[ `t${tableIndex}_currentSortedField` ] : sortedField,
			[ `t${tableIndex}_sortType` ] : sortType,
		})
  }

  function sortedArray (tableIndex) {
		function pad(num, size) {
			var s = "000000000" + num
			return s.substr(s.length-size)
		}
		function parseIntEx(value) {
			if (value === '') return 0
			else return parseInt(value, 10)
		}
		function parseIntStrEx(value) {
			if (value === '') return ''
			else if (isNaN(parseInt(value, 10))) return value
			else return pad(value, 10)
		}
		function parseDimension(value) {
			if (typeof(value) !== 'string' || value === '') return 0
			var res = value.split('x')
			if (res.length === 3) {
				return parseInt(res[0], 10) *  parseInt(res[1], 10) *  parseInt(res[2], 10)
			}
			else return 0
		}
		  
		let { measure_2 } = reportData
		let { 
			t1_currentSortedField,
			t1_sortType,
			t2_currentSortedField,
			t2_sortType,
			t3_currentSortedField,
			t3_sortType,
			t4_currentSortedField,
			t4_sortType,
			t5_currentSortedField,
			t5_sortType,
			t6_currentSortedField,
			t6_sortType,
		} = analyticsState

	 	var array = []
	 	if (tableIndex === 1) {
			array = measure_2.warehouse
			return array.sort(function(a, b) {
		  	if(a[t1_currentSortedField] < b[t1_currentSortedField]) return t1_sortType === 'descending'? 1: -1
		    if(a[t1_currentSortedField] > b[t1_currentSortedField]) return t1_sortType === 'descending'? -1: 1
		   	return 0
			})
		}
		if (tableIndex === 2) {
			array = measure_2.ship_service
			return array.sort(function(a, b) {
			  if(a[t2_currentSortedField] < b[t2_currentSortedField]) return t2_sortType === 'descending'? 1: -1
			  if(a[t2_currentSortedField] > b[t2_currentSortedField]) return t2_sortType === 'descending'? -1: 1
			  return 0
			})
		} 
		if (tableIndex === 3) {
			array = measure_2.ship_zone
			if (t3_currentSortedField === 'name') {
				return array.sort(function(a, b) {
					if(parseIntStrEx(a[t3_currentSortedField]) < parseIntStrEx(b[t3_currentSortedField])) return t3_sortType === 'descending'? 1: -1
					if(parseIntStrEx(a[t3_currentSortedField]) > parseIntStrEx(b[t3_currentSortedField])) return t3_sortType === 'descending'? -1: 1
					return 0
				})
			} else {
				return array.sort(function(a, b) {
					if(a[t3_currentSortedField] < b[t3_currentSortedField]) return t3_sortType === 'descending'? 1: -1
					if(a[t3_currentSortedField] > b[t3_currentSortedField]) return t3_sortType === 'descending'? -1: 1
					return 0
				})
			}
		} 
		if (tableIndex === 4) {
			array = measure_2.weight
			if (t4_currentSortedField === 'name') {
				return array.sort(function(a, b) {
					if(parseIntEx(a[t4_currentSortedField]) < parseIntEx(b[t4_currentSortedField])) return t4_sortType === 'descending'? 1: -1
					if(parseIntEx(a[t4_currentSortedField]) > parseIntEx(b[t4_currentSortedField])) return t4_sortType === 'descending'? -1: 1
					return 0
				})
			} else {
				return array.sort(function(a, b) {
					if(a[t4_currentSortedField] < b[t4_currentSortedField]) return t4_sortType === 'descending'? 1: -1
					if(a[t4_currentSortedField] > b[t4_currentSortedField]) return t4_sortType === 'descending'? -1: 1
					return 0
				})
			}
		}
    if (tableIndex === 5) {
			array = measure_2.ship_dimension
		 	if (t5_currentSortedField === 'name') {
				return array.sort(function(a, b) {
					if(parseDimension(a[t5_currentSortedField]) < parseDimension(b[t5_currentSortedField])) return t5_sortType === 'descending'? 1: -1
					if(parseDimension(a[t5_currentSortedField]) > parseDimension(b[t5_currentSortedField])) return t5_sortType === 'descending'? -1: 1
					return 0
				})
		 	} else {
				return array.sort(function(a, b) {
					if(a[t5_currentSortedField] < b[t5_currentSortedField]) return t5_sortType === 'descending'? 1: -1
					if(a[t5_currentSortedField] > b[t5_currentSortedField]) return t5_sortType === 'descending'? -1: 1
					return 0
				})
		 	}
	 	} 
	 	if (tableIndex === 6) {
			array = measure_2.delivery_time
			if (t6_currentSortedField === 'name') {
				return array.sort(function(a, b) {
					if(parseIntEx(a[t6_currentSortedField]) < parseIntEx(b[t6_currentSortedField])) return t6_sortType === 'descending'? 1: -1
					if(parseIntEx(a[t6_currentSortedField]) > parseIntEx(b[t6_currentSortedField])) return t6_sortType === 'descending'? -1: 1
					return 0
				})
			} else {
				return array.sort(function(a, b) {
					if(a[t6_currentSortedField] < b[t6_currentSortedField]) return t6_sortType === 'descending'? 1: -1
					if(a[t6_currentSortedField] > b[t6_currentSortedField]) return t6_sortType === 'descending'? -1: 1
					return 0
				})
			}
		}
 	}

 	let { 
		t1_currentSortedField,
		t1_sortType,
		t2_currentSortedField,
		t2_sortType,
		t3_currentSortedField,
		t3_sortType,
		t4_currentSortedField,
		t4_sortType,
		t5_currentSortedField,
		t5_sortType,
		t6_currentSortedField,
		t6_sortType,
	} = analyticsState

	let { header, measure_1 } = reportData

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
									header.parameters &&
									header.parameters.length > 0 && 
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
      		</div>
    		</div>
  		}
  
			<br/>
			<br/>

			<h5 className="freight_section">
				Summary
			</h5>

			<div className="row">
				<div className="col-md-4">
					<table className="table documents-table measure1">
						<thead>
							<tr className="uppercase">
								<th  ></th>
								<th className="text-right"></th>
								<th className="text-right">Actual</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="text-primary">Packages</td>
								<td className="text-center">#</td>
								<td className="text-right bold">{formatNumber(measure_1.actual.packages,0)}</td>
							</tr>
							<tr>
								<td className="text-primary">Freight</td>
								<td className="text-center">$</td>
								<td className="text-right bold">{formatNumber(measure_1.actual.freight_cost,2)}</td>
							</tr>
							<tr>
								<td className="text-primary">Freight per Package</td>
								<td className="text-center">$ / #</td>
								<td className="text-right bold">{measure_1.actual.packages > 0? formatNumber(measure_1.actual.freight_cost/measure_1.actual.packages,2): ''}</td>
							</tr>
							<tr>
								<td className="text-primary">Delivery Time<br/>(Min / Avg / Max)</td>
								<td className="text-center">Days</td>
								<td className="text-right bold">{formatNumber(measure_1.actual.delivery_time[0],0)} <span className="freight_sep">/</span> {formatNumber(measure_1.actual.delivery_time[1],1)} <span className="freight_sep">/</span> {formatNumber(measure_1.actual.delivery_time[2],0)}</td>
							</tr>
						</tbody>

					</table>
				</div>
			</div>

			<br/>
			<h5 className="freight_section" style={{marginBottom: "20px"}}>
				Analysis
			</h5>

			<div className="row">
				<div className="col-lg-4 col-md-6">
				<div>
					<h5 className="text-primary uppercase bold">Warehouse</h5>
					<table className="table documents-table scrolldownheader">
						<thead>
							<tr className="uppercase analytics-tr">
								<SortableTh title="Location" currentSortedField={t1_currentSortedField} sortType={t1_sortType} sortedField="name" tableIndex={1} sortTh={sortTh} analyticsActions={analyticsActions}/>
							    <SortableTh title="Pkg (#)" currentSortedField={t1_currentSortedField} sortType={t1_sortType} sortedField="packages" tableIndex={1} sortTh={sortTh} analyticsActions={analyticsActions} />
							    <SortableTh title="Freight ($)" currentSortedField={t1_currentSortedField} sortType={t1_sortType} sortedField="freight" tableIndex={1} sortTh={sortTh} analyticsActions={analyticsActions} />

								{/*<th className="vertical-align-top">Location</th>
								<th className="text-right vertical-align-top">Packages (#)</th>
								<th className="text-right vertical-align-top">Freight ($)</th>*/}
								<th className="text-right vertical-align-top" style={{fontWeight: "700"}}>$ / #</th>
								<th className="text-right vertical-align-top">&nbsp;</th>
							</tr>
						</thead>
					</table>
					<table className="table documents-table scrolldown">
						<tbody>
							{
								sortedArray(1).map((v, i) => {
									let {
										name,
										packages,
										freight
									} = v
							
									return (
								<tr key={ `report-grid-${i}` }>
									<td className="text-primary">{name}</td>
									<td className="text-right">{formatNumber(packages,0)}</td>
									<td className="text-right bold">{formatNumber(freight,2)}</td>
									<td className="text-right">{packages > 0? formatNumber(freight/packages,2): ''}</td>
								</tr>
									)
								} )
							}
						</tbody>

					</table>
					</div>
				</div>

				<div className="col-lg-4 col-md-6">
				<div>
					<h5 className="text-primary uppercase bold">Ship Service</h5>
					<table className="table documents-table scrolldownheader">
						<thead>
							<tr className="uppercase analytics-tr">
						    <SortableTh title="Service" currentSortedField={t2_currentSortedField} sortType={t2_sortType} sortedField="name" tableIndex={2} sortTh={sortTh} analyticsActions={analyticsActions}/>
						    <SortableTh title="Pkg (#)" currentSortedField={t2_currentSortedField} sortType={t2_sortType} sortedField="packages" tableIndex={2} sortTh={sortTh} analyticsActions={analyticsActions} />
						    <SortableTh title="Freight ($)" currentSortedField={t2_currentSortedField} sortType={t2_sortType} sortedField="freight" tableIndex={2} sortTh={sortTh} analyticsActions={analyticsActions} />
								<th className="text-right vertical-align-top" style={{fontWeight: "700"}}>$ / #</th>
								{/*<th className="vertical-align-top">Service</th>
								<th className="text-right vertical-align-top">Packages (#)</th>
								<th className="text-right vertical-align-top">Freight ($)</th>
								<th className="text-right vertical-align-top">$ / #</th>*/}
								<th className="text-right vertical-align-top">&nbsp;</th>
							</tr>
						</thead>
					</table>
					<table className="table documents-table scrolldown">
						<tbody>
							{
								sortedArray(2).map((v, i) => {
									let {
										name,
										packages,
										freight
									} = v
							
									return (
										<tr key={ `report-grid-${i}` }>
											<td className="text-primary">{name}</td>
											<td className="text-right">{formatNumber(packages,0)}</td>
											<td className="text-right bold">{formatNumber(freight,2)}</td>
											<td className="text-right">{packages > 0? formatNumber(freight/packages,2): ''}</td>
										</tr>
									)
								})
							}
						</tbody>
					</table>
				</div>
			</div>

				<div className="col-lg-4 col-md-6">
				  <div>
					<h5 className="text-primary uppercase bold">Ship Zone</h5>
					<table className="table documents-table scrolldownheader">
						<thead>
							<tr className="uppercase analytics-tr">
								<SortableTh title="Zone" currentSortedField={t3_currentSortedField} sortType={t3_sortType} sortedField="name" tableIndex={3} sortTh={sortTh} analyticsActions={analyticsActions}/>
							    <SortableTh title="Pkg (#)" currentSortedField={t3_currentSortedField} sortType={t3_sortType} sortedField="packages" tableIndex={3} sortTh={sortTh} analyticsActions={analyticsActions} />
							    <SortableTh title="Freight ($)" currentSortedField={t3_currentSortedField} sortType={t3_sortType} sortedField="freight" tableIndex={3} sortTh={sortTh} analyticsActions={analyticsActions} />
								{/*<th className="vertical-align-top">Zone</th>
								<th className="text-right vertical-align-top">Packages (#)</th>
								<th className="text-right vertical-align-top">Freight ($)</th>*/}
								<th className="text-right vertical-align-top" style={{fontWeight: "700"}}>$ / #</th>
								<th className="text-right vertical-align-top">&nbsp;</th>
							</tr>
						</thead>
					</table>
					<table className="table documents-table scrolldown">
						<tbody>
							{
								sortedArray(3).map((v, i) => {
									let {
										name,
										packages,
										freight
									} = v
							
									return (
								<tr key={ `report-grid-${i}` }>
									<td className="text-primary">{name}</td>
									<td className="text-right">{formatNumber(packages,0)}</td>
									<td className="text-right bold">{formatNumber(freight,2)}</td>
									<td className="text-right">{packages > 0? formatNumber(freight/packages,2): ''}</td>
								</tr>
									)
								} )
							}
						</tbody>
					</table>
					</div>
				</div>
			</div>

			<div className="row">

				<div className="col-lg-4 col-md-6">
					<div>
						<h5 className="text-primary uppercase bold">Ship Weight</h5>
						<table className="table documents-table scrolldownheader">
							<thead>
								<tr className="uppercase analytics-tr">
									<SortableTh title="Weight (lbs)" currentSortedField={t4_currentSortedField} sortType={t4_sortType} sortedField="name" tableIndex={4} sortTh={sortTh} analyticsActions={analyticsActions}/>
									<SortableTh title="Pkg (#)" currentSortedField={t4_currentSortedField} sortType={t4_sortType} sortedField="packages" tableIndex={4} sortTh={sortTh} analyticsActions={analyticsActions} />
									<SortableTh title="Freight ($)" currentSortedField={t4_currentSortedField} sortType={t4_sortType} sortedField="freight" tableIndex={4} sortTh={sortTh} analyticsActions={analyticsActions} />
									{/*<th className="vertical-align-top">Weight (lbs)</th>
									<th className="text-right vertical-align-top">Packages (#)</th>
									<th className="text-right vertical-align-top">Freight ($)</th>*/}
									<th className="text-right vertical-align-top" style={{fontWeight: "700"}}>$ / #</th>
									<th className="text-right vertical-align-top">&nbsp;</th>
								</tr>
							</thead>

						</table>
						<table className="table documents-table scrolldown">
							<tbody>
								{
									sortedArray(4).map((v, i) => {
										let {
											name,
											packages,
											freight
										} = v
								
										return (
									<tr key={ `report-grid-${i}` }>
										<td className="text-primary">{formatWeight(name)}</td>
										<td className="text-right">{formatNumber(packages,0)}</td>
										<td className="text-right bold">{formatNumber(freight,2)}</td>
										<td className="text-right">{packages > 0? formatNumber(freight/packages,2): ''}</td>
									</tr>
										)
									} )
								}
							</tbody>

						</table>
					</div>
				</div>

				<div className="col-lg-4 col-md-6">
					<div>
						<h5 className="text-primary uppercase bold">Ship Dimension</h5>

						<table className="table documents-table scrolldownheader">
							<thead>
							<tr className="uppercase analytics-tr">
								<SortableTh title="Dimension" currentSortedField={t5_currentSortedField} sortType={t5_sortType} sortedField="name" tableIndex={5} sortTh={sortTh} analyticsActions={analyticsActions}/>
								<SortableTh title="Pkg (#)" currentSortedField={t5_currentSortedField} sortType={t5_sortType} sortedField="packages" tableIndex={5} sortTh={sortTh} analyticsActions={analyticsActions} />
								<SortableTh title="Freight ($)" currentSortedField={t5_currentSortedField} sortType={t5_sortType} sortedField="freight" tableIndex={5} sortTh={sortTh} analyticsActions={analyticsActions} />
								{/*<th className="vertical-align-top">Dimension</th>
								<th className="text-right vertical-align-top">Packages (#)</th>
								<th className="text-right vertical-align-top">Freight ($)</th>*/}
								<th className="text-right vertical-align-top" style={{fontWeight: "700"}}>$ / #</th>
								<th className="text-right vertical-align-top">&nbsp;</th>
							</tr>
						</thead>
						</table>
						<table className="table documents-table scrolldown">
							<tbody>
								{
									sortedArray(5).map((v, i) => {
										let {
											name,
											packages,
											freight
										} = v
								
										return (
									<tr key={ `report-grid-${i}` }>
										<td className="text-primary">{name}</td>
										<td className="text-right">{formatNumber(packages,0)}</td>
										<td className="text-right bold">{formatNumber(freight,2)}</td>
										<td className="text-right">{packages > 0? formatNumber(freight/packages,2): ''}</td>
									</tr>
										)
									} )
								}
							</tbody>

						</table>
					</div>
				</div>

				<div className="col-lg-4 col-md-6">
				  <div>
					<h5 className="text-primary uppercase bold">Delivery Time</h5>
					<table className="table documents-table scrolldownheader">
						<thead>
							<tr className="uppercase analytics-tr">
								<SortableTh title="Delivery Days" currentSortedField={t6_currentSortedField} sortType={t6_sortType} sortedField="name" tableIndex={6} sortTh={sortTh} analyticsActions={analyticsActions}/>
								<SortableTh title="Pkg (#)" currentSortedField={t6_currentSortedField} sortType={t6_sortType} sortedField="packages" tableIndex={6} sortTh={sortTh} analyticsActions={analyticsActions} />
								<SortableTh title="Freight ($)" currentSortedField={t6_currentSortedField} sortType={t6_sortType} sortedField="freight" tableIndex={6} sortTh={sortTh} analyticsActions={analyticsActions} />
								{/*<th className="vertical-align-top">Delivery Days</th>
								<th className="text-right vertical-align-top">Packages (#)</th>
								<th className="text-right vertical-align-top">Freight ($)</th>*/}
								<th className="text-right vertical-align-top" style={{fontWeight: "700"}}>$ / #</th>
								<th className="text-right vertical-align-top">&nbsp;</th>
							</tr>
						</thead>
					</table>
					<table className="table documents-table scrolldown">
						<tbody>
							{
								sortedArray(6).map((v, i) => {
									let {
										name,
										packages,
										freight
									} = v
							
									return (
								<tr key={ `report-grid-${i}` }>
									<td className="text-primary">{name}</td>
									<td className="text-right">{formatNumber(packages,0)}</td>
									<td className="text-right bold">{formatNumber(freight,2)}</td>
									<td className="text-right">{packages > 0? formatNumber(freight/packages,2): ''}</td>
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

FreightAnalyzer.propTypes = {
  reportData : PropTypes.object,
  analyticsState : PropTypes.object,
  analyticsActions : PropTypes.object,
}

export default FreightAnalyzer