import React from 'react'
import PropTypes from 'prop-types'

const AnalyticsSingleReportBarActions = ({
  exportReport,
  generateReport, 
  loaded
}) => {

  const isRateCards = global.window.location.pathname.indexOf('rate-cards') > 0;

  return (
    <div className="page-breadcrumb">
      <div className="caption">
        <span className="caption-subject font-green-seagreen sbold">

          <div className="actions">
            <div className="btn-group ">

              {
                loaded && !isRateCards &&
                <button 
                  type="button" 
                  className="btn action-button btn-sm"
                  onClick={ global.window.print }
                >
                  <i className="icon-printer bold" style={{color: '#333'}}></i>
                </button>
              }

              {loaded && exportReport &&
              <button 
                  type="button" 
                  className="btn action-button btn-sm"
                  onClick={ exportReport }
              >
                  <i className="fa fa-download" style={{color: '#333'}}>
                  </i>
                </button>
              }
              <button 
                type="button" 
                className="btn action-button btn-sm"
                onClick={ generateReport }
                style={{ backgroundColor: '#333', color: 'white' }}
              >
                <i className="fa fa-bar-chart"></i> {isRateCards? 'GET RATES':'RUN REPORT'}
              </button>
              
            </div>
          </div>

        </span>
      </div>
    </div>
  )
}

AnalyticsSingleReportBarActions.propTypes = {
  loaded    : PropTypes.bool,
  generateReport : PropTypes.func,
  exportReport : PropTypes.func
}

export default AnalyticsSingleReportBarActions