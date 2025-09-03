import React from 'react'
import { connect } from 'react-redux'

const ReportDetailModal1 = ({
  analyticsActions,
  analyticsState
}) => {
  return (
    <div 
      className="analytics-detail"
      style={{
        height: 'calc( 100vh - 114px )',
        position: 'relative',
        backgroundColor: "white"
      }}
    >
    todo
    </div>
  )
}

export default connect(
  state => ({
    analyticsState : state.analytics
  })
)(ReportDetailModal1)