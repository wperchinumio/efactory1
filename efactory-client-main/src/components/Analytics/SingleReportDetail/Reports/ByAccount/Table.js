import React, { useEffect, useMemo, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const ByAccountTable = props => {
	const firstRun = useRef(true)
	const [sortField, setSortField] = useState(null)
	const [sortType, setSortType] = useState(null)

	const { grid, grid_variable_header } = props.reportData
	let { valueField } = props.analyticsState

	const sortedGrid = useMemo(
  	() => sortGrid(),
  	[
  		sortField,
			sortType,
			grid,
			grid_variable_header,
			valueField
  	]
  ) 

	useEffect(
		() => {
			if (firstRun.current) {
				firstRun.current = false
				return 
			}
			if (props.analyticsState.exportReportClicked) {
				exportTable()
				props.analyticsActions.setRootReduxStateProp_multiple({ exportReportClicked: false })
			}
		},
		[props.analyticsState.exportReportClicked]
	)

	function exportTable () {
		const orders = []
		const lines = []
		const packages = []
		const units = []
		sortedGrid.forEach(
			(item, index) => {
				const {
					company_code,
					company_name,
					name, // acc #
					data,
				} = item
				let itemOrders = {
					'ACTNO #': name,
					'Company code': company_code,
					'Company name': company_name
				}
				let itemLines = {
					'ACTNO #': name,
					'Company code': company_code,
					'Company name': company_name
				}
				let itemPackages = {
					'ACTNO #': name,
					'Company code': company_code,
					'Company name': company_name
				}
				let itemUnits = {
					'ACTNO #': name,
					'Company code': company_code,
					'Company name': company_name
				}
				data.forEach(
					(aData, index_) => {
						const columnName = grid_variable_header[index_]['name']
						itemOrders[columnName] = aData['orders']
						itemLines[columnName] = aData['lines']
						itemPackages[columnName] = aData['packages']
						itemUnits[columnName] = aData['units']
					}
				)
				orders.push(itemOrders)
				lines.push(itemLines)
				packages.push(itemPackages)
				units.push(itemUnits)
			}
		)
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'
    const reportTitle = 'Analytics by Account'
		const ordersSheet = XLSX.utils.json_to_sheet(orders)
		const linesSheet = XLSX.utils.json_to_sheet(lines)
		const packagesSheet = XLSX.utils.json_to_sheet(packages)
		const unitsSheet = XLSX.utils.json_to_sheet(units)
    const wb = { 
    	Sheets: { 'Orders': ordersSheet, 'Lines': linesSheet, 'Packages': packagesSheet, 'Units': unitsSheet }, 
    	SheetNames: ['Orders', 'Lines', 'Packages', 'Units'] 
   	}
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], {type: fileType})
    FileSaver.saveAs(data, reportTitle + fileExtension)
	}

	function sort (event) {
  	event.preventDefault()
  	const sortFieldNext = event.currentTarget.getAttribute('data-field')
  	setSortField(sortFieldNext)
  	const sortTypeNext = sortType === 'ascending' ? 'descending' : 'ascending'
  	setSortType(sortTypeNext)
  }

  function sortGrid () {
  	if (!sortField) {
  		return grid
  	}
  	let gridNext = [...grid]
  	gridNext.sort(function(a, b){
			let a_ = a[ sortField ]
		 	let b_ = b[ sortField ]
		 	if (['company_code', 'company_name'].includes(sortField)) {
		 		a_ = a_ ?  a_.toLowerCase() : ''
		 		b_ = b_ ?  b_.toLowerCase() : ''
		 	}
		 	if ( a_ < b_ ) return -1 //sort string ascending
		 	if ( a_ > b_ ) return 1
		 	return 0
		})
		if( sortType !== 'ascending' ){
			gridNext.reverse()
		}
		return gridNext
  }

	return (
		<div className="table-responsive" style={{backgroundColor: "white"}}>
			<table className="table table-striped table-hover documents-table">
				<thead>
					<tr className="uppercase analytics-tr">
						<th className="text-right" style={{width: "35px"}}>#</th>
						<th className='white-space-nowrap user-select-none'>
							<span className="column-sort noprint">
								<i 
									className={ classNames({
			          		'fa fa-long-arrow-down' : true,
			          		'active' : sortField === 'account_number' && sortType === "descending" ? true : false
			        		}) } 
			        		aria-hidden="true"
			        	/>
			        </span>
			        <span className="column-sort column-sort-up noprint">
			        	<i 
			        		className={ classNames({
					          'fa fa-long-arrow-up' : true,
					          'active' : sortField === 'account_number' && sortType === "ascending" ? true : false,
			        		}) } 
			        		aria-hidden="true"
			        	/>
			        </span>
							<a data-field="account_number" onClick={ sort }>
								ACTNO #
							</a>
						</th>
						<th className='white-space-nowrap user-select-none'>
							<span className="column-sort noprint">
								<i 
									className={ classNames({
			          		'fa fa-long-arrow-down' : true,
			          		'active' : sortField === 'company_code' && sortType === "descending" ? true : false
			        		}) } 
			        		aria-hidden="true"
			        	/>
			        </span>
			        <span className="column-sort column-sort-up noprint">
			        	<i 
			        		className={ classNames({
					          'fa fa-long-arrow-up' : true,
					          'active' : sortField === 'company_code' && sortType === "ascending" ? true : false,
			        		}) } 
			        		aria-hidden="true"
			        	/>
			        </span>
							<a data-field="company_code" onClick={ sort }>
								Company code
							</a>
						</th>
						<th className='white-space-nowrap user-select-none'>
							<span className="column-sort noprint">
								<i 
									className={ classNames({
			          		'fa fa-long-arrow-down' : true,
			          		'active' : sortField === 'company_name' && sortType === "descending" ? true : false
			        		}) } 
			        		aria-hidden="true"
			        	/>
			        </span>
			        <span className="column-sort column-sort-up noprint">
			        	<i 
			        		className={ classNames({
					          'fa fa-long-arrow-up' : true,
					          'active' : sortField === 'company_name' && sortType === "ascending" ? true : false,
			        		}) } 
			        		aria-hidden="true"
			        	/>
			        </span>
							<a data-field="company_name" onClick={ sort }>
								Company name
							</a>
						</th>
						{
							grid_variable_header.map(
								({ name, sortkey }) => {
									return (
										<th className='text-right white-space-nowrap' key={sortkey}>{name}</th>
									)			
								}
							)
						}
					</tr>
				</thead>
				<tbody>
					{
						sortedGrid.map(
							(item, index) => {
								const {
									company_code,
									company_name,
									name, // acc #
									data,
								} = item
								return (
									<tr key={ `acc-grid-${index}` } className="analytics-tr">
										<td className="text-right">{index + 1}</td>
										<td className="bold">{name}</td>
										<td className="">{company_code}</td>
										<td className="text-primary">{company_name}</td>
										{
											data.map(
												(item_, index_) => {
													const value = item_[valueField]
													return (
														<td key={`acc-grid-${index}${index_}`} className="text-right">
															 { value ? formatNumber( value, 0 ) : <span className='zero-value'>0</span>}
														</td>
													)
												}
											)
										}
									</tr>
								)
							}
						)
					}
				</tbody>
			</table>
		</div>
	)
}

ByAccountTable.propTypes = {
  reportData: PropTypes.object,
  analyticsState: PropTypes.object,
  analyticsActions: PropTypes.object,
}

export default ByAccountTable