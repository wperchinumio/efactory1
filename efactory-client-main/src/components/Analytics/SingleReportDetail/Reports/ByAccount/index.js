import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Chart from './Chart'
import Table from './Table'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const Report10 = ({
	analyticsActions,
	analyticsState,
	reportData = {}
}) => {
	useEffect(
		() => {
			
		},
		[]
	)

	function changeValueField (event) {
  	let field = event.currentTarget.getAttribute('data-field')
		analyticsActions.setRootReduxStateProp_multiple({
			valueField : field
		})
  }

  let { valueField } = analyticsState
  let { header, grid } = reportData

  let total = 0
  if (Array.isArray(grid) && grid.length) {
  	total = grid.reduce(
  		(prev, next) => {
  			const nextTotal = next.data.reduce(
  				(prev, next) => {
  					return {
							[valueField] : prev[ valueField ] + ( next[ valueField ] || 0  )
						} 
  				},
  				{ [valueField]: 0 }
  			)[valueField]
  			return {
					[ valueField ] : prev[ valueField ] + ( nextTotal || 0 )
				}
  		},
  		{ [valueField]: 0 }
  	)[valueField]
  	
  }
	
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
        </div>
				<div className="col-md-2 total-col">
				  <div>
				  	<span className="total-edge channel-2">
				  		<b>
				  			Total Accounts: &nbsp;
				  		</b> { formatNumber( grid.length, 0 ) }
				  	</span>
					</div>
					<div>
				  	<span className="total-edge channel-0">
				  		<b>
				  			Total Measure: &nbsp;&nbsp;
				  		</b> { formatNumber( total, 0 ) }
				  	</span>
					</div>
				</div>
      </div>
    }
    
		<div className="row" style={{margin: 0}}>
			<div className="col-xs-12" style={{height:"450px", margin: '0' }} >
				<Chart 
					analyticsActions={analyticsActions}
					analyticsState={analyticsState}
					reportData={reportData}
				/>
    	</div>	
		</div>

		<div className="row" style={{margin: "10px -25px 0 -15px"}}>
			<div className="col-md-12">
				<Table 
					analyticsActions={analyticsActions}
					analyticsState={analyticsState}
					reportData={reportData}
				/>
			</div>
		</div>
	</div>
	)
}

Report10.propTypes = {
  reportData: PropTypes.object,
  analyticsState: PropTypes.object,
  analyticsActions: PropTypes.object,
}

export default Report10