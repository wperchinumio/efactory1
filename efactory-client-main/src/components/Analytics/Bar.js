import React from 'react'
import { Link } from 'react-router-dom'
import reportTypes from './_ReportTypesConfig'

const AnalyticsBar = ({
  id
}) => {
  function createBreadCrumbs () {
    if( !id ){
      return (
      <ul className="page-breadcrumb">
        <li>
          <i className="fa fa-bar-chart-o bold"></i>&nbsp;
          <span>
            Analytics
          </span>
        </li>
      </ul>
      )
    }else{
      let selectedReportType = reportTypes.filter( reportType => reportType.id === id )[0]
      return (
        <ul className="page-breadcrumb">  
          <li>
            <i className="fa fa-bar-chart-o bold"></i> &nbsp;
            <Link to="/analytics/geographic-reports/domestic" style={{ marginLeft: '-3px' }}>
              Analytics
            </Link>
            <i className="fa fa-angle-right"></i>
          </li>
          <li>
            <span className="font-green-seagreen">
              { selectedReportType.title }
            </span>
          </li>
        </ul>
      )
    }
  }

  return (
    <div className="page-bar orderpoints-page-bar" style={{ margin : '0' }}>
      <div className="page-breadcrumb">
        <div className="caption" style={{paddingLeft: "35px"}}>
          <span className="caption-subject font-green-seagreen sbold">
            { 
              createBreadCrumbs() 
            }
          </span>
        </div>
      </div>
      <div className="page-toolbar"></div>
    </div>
  );
}

export default AnalyticsBar