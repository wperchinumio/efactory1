import React from 'react'
import { connect } from 'react-redux'
import global from 'window-or-global'
import AmCharts from '../../../lib/amcharts3-react'

const OverviewFulfillment30daysTab = ({ fulfillment30Days }) => {

  if( !fulfillment30Days.length ) return <div></div>

  return (
    <div className="tab-pane active" id="fullfillment_30">
      <AmCharts.React
        key="30daysact"
        type="serial"
        fontFamily='Open Sans'
        color='#888888'
        legend={{
          equalWidths: false,
          useGraphSettings: true,
          valueAlign: "left",
          valueWidth: 120,
          position: 'top'
        }}
        dataProvider={ fulfillment30Days }
        valueAxes={[{
          id: "orderAxis",
          axisAlpha: 0,
          gridAlpha: 0,
          position: "left",
          title: "orders"
        }]} 
        graphs={[
          {
            lineColor: "#e1ede9",
            fillColors: "#e1ede9",
            fillAlphas: 1,
            type: "column",
            title: "Received",
            valueField: "received",
            clustered: false,
            columnWidth: 0.7,
            legendPeriodValueText: "[[value.sum]]",
            balloonText: "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
          },
          {
            valueAxis: "orderAxis",
            lineColor: "#44bdae",
            fillAlphas: 1,
            type: "column",
            title: "Shipped",
            valueField: "shipped",
            clustered: false,
            columnWidth: 0.4,
            legendPeriodValueText: "[[value.sum]]",
            balloonText: "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
          }
        ]}
        chartCursor={{
          categoryBalloonDateFormat: "DD",
          cursorAlpha: 0.1,
          cursorColor: "#000000",
          fullWidth: true,
          valueBalloonsEnabled: false,
          zoomable: false
        }}
        dataDateFormat="YYYY-MM-DD"
        categoryField="date"
        categoryAxis={{
          dateFormats :   [{
            period: "DD",
            format: "DD"
          }, {
            period: "WW",
            format: "MMM DD"
          }, {
            period: "MM",
            format: "MMM"
          }, {
            period: "YYYY",
            format: "YYYY"
          }],
          parseDates: true,
          autoGridCount: false,
          axisColor: "#555555",
          gridAlpha: 0.1,
          gridColor: "#FFFFFF",
          gridCount: 50
        }}
        exportConfig={{
          menuBottom: "20px",
          menuRight: "22px",
          menuItems: [{
            icon: global.App.getGlobalPluginsPath() + "amcharts/amcharts/images/export.png",
            format: 'png'
          }]
        }}
      />
    </div>
  )
}

export default connect(
  state => ({
    fulfillment30Days: state.overview.fulfillment.fulfillment30Days
  })
)(OverviewFulfillment30daysTab)