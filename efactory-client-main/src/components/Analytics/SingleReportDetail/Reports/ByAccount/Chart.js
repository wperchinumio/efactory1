import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import AmCharts from '../../../../../lib/amcharts3-react'
import '../../../../../lib/amcharts3/ammap/ammap.js'
import '../../../../../lib/amcharts3/ammap/maps/js/worldLow.js'

const ByAccountChart = props => {
	let { valueField, compareYears } = props.analyticsState

	function createGraphsPropsForChart () {
		const { grid_variable_header } = props.reportData

		if (!(Array.isArray(grid_variable_header) && grid_variable_header.length)) {
			console.error('grid_variable_header should be an array')
			return []
		}

		return grid_variable_header.map(
			({ name, from: from_, to }, index) => {
				const balloonText = `<div><b>[[company_code]] - [[company_name]]</b></div><div style='font-size:10px'><div> Time: <b>${name}</b> </div><div> From: <b>${from_}</b> </div><div> To: <b>${to}</b> </div><div>Account #: <b>[[category]]</b></div><br/><div><span style='text-transform: capitalize'>${valueField}</span>: <b>[[value]]</b></div></div>`

				return {
					balloonText,
					legendPeriodValueText : "[[value.sum]]",
	        "fillAlphas": 0.8,
	        "labelText": "[[value]]",
	        "lineAlpha": 0.3,
	        "type": "column",
	    		"color": "#000000",
	        "valueField": `value_${index}`
				}
			}
		)
	}

	function createDataProvider () {
		const { grid } = props.reportData
		if (!(Array.isArray(grid) && grid.length)) {
			console.error('no grid item found')
			return []
		}
		return grid.map(
			(gridItem, index) => {
				const item = {
					account: gridItem.name,
					company_name: gridItem.company_name,
					company_code: gridItem.company_code
				}
				gridItem.data.forEach(
					(d, index2) => {
						item[`value_${index2}`] = d[valueField]
					}
				)
				return item
			}
		)
	}

	const graphs = useMemo(
		() => createGraphsPropsForChart(),
		[
			props.reportData.grid_variable_header,
			valueField
		]
	) 

	const dataProvider = useMemo(
		() => createDataProvider(),
		[
			props.reportData.grid,
			valueField
		]
	)

	return (
		<AmCharts.React
			key={`key${compareYears}${valueField}`}
			type="serial"
			theme="none"
			fontFamily='Open Sans'
			color='#888888'
			dataProvider={dataProvider}
			valueAxes={[{
        stackType: "regular",
        axisAlpha: 0,
        gridAlpha: 0,
        // totalText: "[[total]]"
	    }]}
	    categoryAxis={{
				labelRotation: 90
			}}
	    categoryField="account"
	    graphs={graphs}
		/>
	)
}

ByAccountChart.propTypes = {
  reportData: PropTypes.object,
  analyticsState: PropTypes.object,
  analyticsActions: PropTypes.object,
}

export default ByAccountChart