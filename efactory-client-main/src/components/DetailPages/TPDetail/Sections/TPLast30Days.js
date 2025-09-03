import React from 'react'
import PropTypes from 'prop-types'
import AmCharts from '../../../../lib/amcharts3-react'

const TPLast30Days = ({
  field_type,
  tp_last30days = []
}) => {
  return (
    <AmCharts.React
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
      dataProvider={ tp_last30days }
      valueAxes={[{
        id :        "orderAxis",
        axisAlpha : 0,
        gridAlpha : 0,
        position :  "left",
        title :     field_type
      }]}
      numberFormatter={{
        precision:0,
        //decimalSeparator:",",
        //thousandsSeparator:""
      }}
      graphs={[
        {
          lineColor :       field_type === 'orders' ? "#4595d0" : '#85bb65',
          fillColors :      field_type === 'orders' ? "#4595d0" : '#85bb65',
          fillAlphas :      1,
          type :            "column",
          title :           field_type === 'orders' ? 'Orders' : 'Value ($)',
          valueField :      field_type,
          clustered :       false,
          columnWidth :     0.7,
          legendPeriodValueText : "[[value.sum]]",
          balloonText :    "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
        }
      ]}
      chartCursor={{
        categoryBalloonDateFormat : "DD",
        cursorAlpha :               0.1,
        cursorColor :               "#000000",
        fullWidth :                 true,
        valueBalloonsEnabled :      false,
        zoomable :                  false
      }}
      dataDateFormat="YYYY-MM-DD"
      categoryField="date"
      categoryAxis={{
        dateFormats :   [{
          period : "DD",
          format : "DD"
        }, {
          period : "WW",
          format : "MMM DD"
        }, {
          period : "MM",
          format : "MMM"
        }, {
          period : "YYYY",
          format : "YYYY"
        }],
        parseDates :    true,
        autoGridCount : false,
        axisColor :     "#555555",
        gridAlpha :     0.1,
        gridColor :     "#FFFFFF",
        gridCount :     50
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
  )
}

TPLast30Days.propTypes = {
  field_type : PropTypes.string,
  tp_last30days : PropTypes.array,
}

export default TPLast30Days