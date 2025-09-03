import React from 'react'
import PropTypes from 'prop-types'
import AmCharts from '../../../../lib/amcharts3-react'
import { formatNumber } from '../../../_Helpers/FormatNumber'

const TPItemsShipped = ({
  tp_items_shipped = [],
}) => {
  
  let sum = 0
  sum = tp_items_shipped.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AmCharts.React
      printWidth="900px"
      type="pie"
      startDuration={0}
      theme="light"
      addClassNames={true}
      legend={{
        equalWidths :      false,
        valueAlign :       "left",
        position   :      'left',
        //"valueText": "[[description]] - [[value]] ([[percents]]%)",
        "valueText": " - [[value]] ([[percents]]%)",
      }}
      innerRadius="30%"
      depth3D={15}
      angle={30}
      outlineAlpha={0.4}
      valueField="qty"
      descriptionField="description"
      titleField="item_number"
      dataProvider={ tp_items_shipped }
      colorField="color"
      allLabels={
        [{
          "y": "54%",
          "align": "center",
          "size": 20,
          "bold": true,
          "text": formatNumber(sum,0),
          "color": "#555"
        }, {
          "y": "49%",
          "align": "center",
          "size": 15,
          "text": "Total",
          "color": "#555"
        }]
      }
    />  
  )
}

TPItemsShipped.propTypes = {
  field_type : PropTypes.string,
  tp_items_shipped: PropTypes.array
}

export default TPItemsShipped