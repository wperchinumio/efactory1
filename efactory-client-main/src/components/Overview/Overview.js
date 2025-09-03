import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import OverviewFulfillment from './Fulfillment/_Content'
import Overview30DaysActivity from './30DaysActivity/_Content'
import Overview30DaysRMAsActivity from './30DaysRMAsActivity/_Content'
import Inventory from './Inventory/_Content'
import Latest50Orders from './Latest50Orders/_Content'
import DashboardStats from './DashboardStats/_Content'
import OverviewBar from './Bar'
import OrderDetails from '../DetailPages/OrderDetail/_Content'
import ItemDetails from '../DetailPages/ItemDetail/_Content'
import global from 'window-or-global'
import * as fulfillmentActions from './redux/fulfillments'
import * as inventoryActions from './redux/overviewInventory'
import * as latest50OrdersActions from './redux/overviewLatest50Orders'

const OverviewBody = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const firstRun = useRef([true,true])
  const refreshDataRef = useRef(null)
  const [scroll, setScroll] = useState(false)
  const [scrollY, setScrollY] = useState(null)
  const { search } = props.location

  const onOverviewRefreshed = useCallback(
    () => makeAllInitialRequestsForOverviewPage(true),
    []
  )

  useEffect(
    () => {
      setRefreshTimeout()
      if (isLastCallLessThanMinLimit()) {
        return
      }
      makeAllInitialRequestsForOverviewPage()
      global.document.addEventListener('overview_refreshed', onOverviewRefreshed, false)
      return () => {
        clearTimeout(refreshDataRef.current)
        global.document.removeEventListener('overview_refreshed', onOverviewRefreshed, false)
      }
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current[0]) {
        firstRun.current[0] = false
        return
      }
      setScroll(true)
      setScrollY(window.pageYOffset || document.body.scrollTop)
    },
    [search]
  )

  useEffect(
    () => {
      if (firstRun.current[1]) {
        firstRun.current[1] = false
        return
      }
      if (!scroll) {
        return
      }
      const isDetailPageOpen = search.includes("?orderNum=") || search.includes("?itemNum=")
      if (!isDetailPageOpen) {
        global.window.requestAnimationFrame(
          () => {
            window.scrollTo(0, scrollY)
            global.$('body').scrollTop(scrollY)
            global.document.documentElement.scrollTop = scrollY
          }
        )
        setScroll(false)
      }
    },
    [scroll]
  )

  function isLastCallLessThanMinLimit () {
    let { last_time_initially_called } = props
    if (!last_time_initially_called) {
      return false
    }
    let now_time = (new Date()).getTime()
    let LIMIT = 5000
    let difference = now_time - last_time_initially_called
    return difference < LIMIT
  }

  function makeAllInitialRequestsForOverviewPage (showSpinner = false) {
    let {
      fulfillmentActions,
      inventoryActions,
      latest50OrdersActions,
      config
    } = propsRef.current
    // Dashboard stats
    let { animation_on_next_query } = config

    if (animation_on_next_query) {
      fulfillmentActions.showLoadingSpinner()
    }

    Promise.all([
      fulfillmentActions.getFulfillmentsAsync(true),
      fulfillmentActions.getAnnouncementBadgeValue(true),

      // 30 days && Inventory
      fulfillmentActions.getFulfillment30DaysAsync({ animation_visible : showSpinner }),
      inventoryActions.getInventoryAsync(),
      latest50OrdersActions.getLatest50OrdersAsync('received'),

      // 30 days RMAs
      fulfillmentActions.getLast30DaysRMAsAsync({ animation_visible : showSpinner }),
    ]).then(
      () => {
        if (animation_on_next_query) {
          fulfillmentActions.hideLoadingSpinner()
        }
        fulfillmentActions.setRootReduxStateProp_multiple({
          last_time_initially_called: (new Date()).getTime(),
          is_initially_called: true
        })
      }
    ).catch( e => {
        if (animation_on_next_query) {
          fulfillmentActions.hideLoadingSpinner()
        }
    } )
  }

  function setRefreshTimeout () {
    let {
      fulfillmentActions,
      inventoryActions,
      latest50OrdersActions,
    } = props

    refreshDataRef.current = setTimeout( () => {
      fulfillmentActions.getFulfillment30DaysAsync()
      fulfillmentActions.getLast30DaysRMAsAsync()
      inventoryActions.getInventoryAsync()
      latest50OrdersActions.getLatest50OrdersAsync('received')
    }, 300000)
  }

  let itemDetailOpen = search.includes("?itemNum=")
  let { current_areas_for_overview = [] } = props.customizeOverviewState

  return (
    <div
      style={{ position:"relative", margin: itemDetailOpen ? '-26px -20px' : '' }}
    >
      <div
        style={ 
          (search.includes("?orderNum=") || search.includes("?itemNum="))
            ? {display:"none"} 
            : {}
        }
      >
        <OverviewBar />
        {
          current_areas_for_overview.map( ({ name, visible, areas }) => {
            if (visible) {
              if (name === 'tiles') {
                return <DashboardStats key="DashboardStats" sub_areas={ areas } />
              }else if (name === 'fulfillment') {
                return <OverviewFulfillment key="OverviewFulfillment" />
              }else if (name === '30days') {
                return <Overview30DaysActivity key="Overview30DaysActivity" />
              }else if (name === '30days_rmas') {
                return <Overview30DaysRMAsActivity key="Overview30DaysRMAsActivity" />
              }else if (name === 'inventory') {
                return <Inventory key="Inventory" />
              }else if (name === '50orders') {
                return <Latest50Orders key="Latest50Orders" />
              }
            }
            return '';
          } )
        }
      </div>

      {/* queryNumber is not available in orderDetails */}

      {
      search.includes("?orderNum=") ?
        <OrderDetails
          queryNumber={search.replace("?orderNum=", '')}
          navigationHidden_received={true}
        /> : ""
      }

      { itemDetailOpen && <ItemDetails/> }

    </div>
  )
}

OverviewBody.propTypes = {
  config: PropTypes.object.isRequired
}

export default connect(
  state => ({
    last_time_initially_called: state.overview.fulfillment.last_time_initially_called,
    customizeOverviewState: state.overview.customizeOverview
  }),
  dispatch => ({
    fulfillmentActions: bindActionCreators( fulfillmentActions, dispatch ),
    inventoryActions: bindActionCreators( inventoryActions, dispatch ),
    latest50OrdersActions: bindActionCreators( latest50OrdersActions, dispatch ),
  })
)(OverviewBody)