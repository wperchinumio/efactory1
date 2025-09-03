import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { withRouter } from 'react-router-dom'
import * as ediActions from '../redux'
import Bar from './Bar'
import Stats from './Sections/Stats'
import Summary from './Sections/Summary'
import Edi30Days from './Sections/Edi30Days'
import OrderDetails from '../../DetailPages/OrderDetail/_Content'
import TPDetails from '../../DetailPages/TPDetail/_Content'

const ContentEdiOverview = ({
  current_areas_for_edi = [],
  ediState,
  ediActions,
  location: {search},
  route = {},
}) => {
  let isOrderDetailVisible = search.includes("?orderNum=")
  let isTPDetailVisible = search.includes("?tradingPartner=")

  let { config = {} } = route

  return (
    <div className="edi-overview-wrapper">
      <div style={{ position: "relative"}}>
        <div 
          className={ classNames({
            'display-none' : isOrderDetailVisible || isTPDetailVisible
          }) }
        >
          <Bar 
            ediState={ ediState }
            ediActions={ ediActions }
          />
          <div style={{ marginTop: '20px' }}>
            {
              current_areas_for_edi.map( ({ name, visible, areas }) => {
                if( visible ){
                  if( name === 'tiles' ){
                    return <Stats 
                      key="EdiDashboardStats" 
                      ediState={ ediState }
                      ediActions={ ediActions }
                      sub_areas={ areas }
                    />
                  }else if( name === 'summary' ){
                    return <Summary 
                      key="EdiSummary"
                      config={ config }
                      ediActions={ ediActions } 
                      ediState={ ediState }
                    />
                  }else if( name === '30days' ){
                    return <Edi30Days 
                      key="Edi30Days"
                      config={ config }
                      ediActions={ ediActions } 
                      ediState={ ediState }
                    />
                  }
                }
                return '';
              } )
            }
          </div>
        </div>
        { 
          isOrderDetailVisible &&
          <OrderDetails />
        }
        { 
          isTPDetailVisible &&
          <TPDetails />
        }
      </div>
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      ediState : state.edi,
      current_areas_for_edi : state.ediCustomize.current_areas_for_edi
    }),
    dispatch => ({
      ediActions : bindActionCreators( ediActions, dispatch )
    })
  )(ContentEdiOverview)
)