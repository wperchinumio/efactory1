import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as fulfillmentActions from '../redux/fulfillments'
import DashboardStat from './DashboardStat'

const OverviewDashboardStats = props => {
  let { sub_areas, fulfillment } = props
  return (
    <div className="row" style={{ marginTop: "20px", marginBottom: '-20px' }}>
      {
        sub_areas.map( 
          ({ name, visible }) => {
            if( visible ){
              return <DashboardStat
                fulfillments={ fulfillment.fulfillments } 
                name={ name }
                key={name}
              />
            }
            return ''
          } 
        )
      }
    </div>
  )
}

OverviewDashboardStats.propTypes = {
  fulfillmentActions: PropTypes.object.isRequired,
  sub_areas: PropTypes.arrayOf( PropTypes.object ).isRequired
}

export default connect(
  state => ({
    fulfillment : state.overview.fulfillment
  }),
  dispatch => ({    
    fulfillmentActions : bindActionCreators( fulfillmentActions, dispatch )
  })
)(OverviewDashboardStats)