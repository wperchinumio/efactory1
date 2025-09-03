import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import BarActions from './BarActions'
import Filters from './Filters'

const AnalyticsSingleReportBar = ({
  loaded, 
  generateReport, 
  exportReport, 
  analyticsActions, 
  filter, 
  pathname,
  quick_filters_config,
  globalApi
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Filters 
        analyticsActions={ analyticsActions }
        filter={ filter }
        globalApi={ globalApi }
        quick_filters_config={ quick_filters_config }
        pathname={pathname}
      />
      <BarActions 
        loaded={ loaded }
        generateReport={ generateReport }
        exportReport={ exportReport }
      />
    </div>
  )
}

AnalyticsSingleReportBar.propTypes = {
  loaded: PropTypes.bool,
  analyticsActions: PropTypes.object.isRequired,
  generateReport: PropTypes.func,
  exportReport: PropTypes.func,
  filter: PropTypes.object,
  globalApi: PropTypes.object,
  quick_filters_config: PropTypes.arrayOf( PropTypes.string ).isRequired
}

export default connect(
  state => ({
    globalApi: state.common.globalApi
  })
)(AnalyticsSingleReportBar)