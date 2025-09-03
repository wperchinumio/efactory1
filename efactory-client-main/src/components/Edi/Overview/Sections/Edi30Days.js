import React from 'react'
import AmCharts from '../../../../lib/amcharts3-react'

const Edi30Days = ({
  ediState: { chart_30days }
}) => {
  return (
    <div 
      className="row"
      style={{ marginTop: "20px", marginBottom: '-20px' }}
    >
      <div className="col-md-12">
        <div className="portlet light bordered ">
            
          <div className="portlet-title tabbable-line">
    
            <div className="caption caption-md">
              <i className="icon-bar-chart font-blue-soft"></i>
              <span className="caption-subject font-blue-soft bold uppercase">
                30 Days Activity
              </span>
            </div>
          </div>
          <div className="portlet-body">
            <div className="tab-content">
              <div className="tab-pane active" id="fullfillment_30">
                {
                  chart_30days && chart_30days.length > 0 &&
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
                    dataProvider={ chart_30days }
                    valueAxes={[{
                      id :        "orderAxis",
                      axisAlpha : 0,
                      gridAlpha : 0,
                      position :  "left",
                      title :     "orders"
                    }]} 
                    graphs={[
                      {
                        lineColor :       "#D2E5F2",
                        fillColors :      "#D2E5F2",
                        fillAlphas :      1,
                        type :            "column",
                        title :           "Received",
                        valueField :      "received",
                        clustered :       false,
                        columnWidth :     0.7,
                        legendPeriodValueText : "[[value.sum]]",
                        balloonText :     "[[title]]<br/><b style='font-size: 130%'>[[value]]</b>"
                      },
                      {
                        valueAxis :       "orderAxis",
                        lineColor :       "#4595D0",
                        fillAlphas :      1,
                        type :            "column",
                        title :           "Shipped",
                        valueField :      "shipped",
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
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Edi30Days