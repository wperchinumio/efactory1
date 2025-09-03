import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import global from 'window-or-global'
import AmCharts from '../../../lib/amcharts3-react'

const OverviewLast30daysRMAsTab = ({ last30DaysRMAs }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(
    () => {
      setTimeout(() => setMounted(true), 50)
    },
    []
  )

  if( !mounted || !last30DaysRMAs.length ) return <div></div>

  return (
    <div className="tab-pane active" id="fullfillment_30_RMA">
      <AmCharts.React
        key="30daysrma"
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
        dataProvider={ last30DaysRMAs }
        valueAxes={[{
          id :        "rmaAxis",
          axisAlpha : 0,
          gridAlpha : 0,
          position :  "left",
          title :     "rmas"
        }]}
        graphs={[
          {
            lineColor :       "#E5D1BE",
            fillColors :      "#E5D1BE",
            fillAlphas :      1,
            type :            "column",
            title :           "Authorized",
            valueField :      "issued",
            clustered :       false,
            columnWidth :     0.7,
            legendPeriodValueText : "[[value.sum]]",
            balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
          },
          {
            valueAxis :       "rmaAxis",
            lineColor :       "#E87E04",
            fillAlphas :      1,
            type :            "column",
            title :           "Closed",
            valueField :      "closed",
            clustered :       false,
            columnWidth :     0.4,
            legendPeriodValueText : "[[value.sum]]",
            balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
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
    </div>
  )
}

export default connect(
  state => ({
    last30DaysRMAs: state.overview.fulfillment.last30DaysRMAs
  })
)(OverviewLast30daysRMAsTab)