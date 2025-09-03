import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'
import TableBody from './TableBody'
import Paginations from '../Paginations'
import * as latest50OrdersActions from '../redux/overviewLatest50Orders'
import * as invoiceActions from '../../Invoices/Open/redux'

const OverviewOrders = props => {
  const { orders: ordersProps } = props
  let numberOfPaginationsNext = Math.ceil( ordersProps.length / 10 )
  numberOfPaginationsNext = numberOfPaginationsNext > 5 ? 5 : numberOfPaginationsNext
  const [orders, setOrders] = useState(ordersProps)
  const [numberOfPaginations, setNumberOfPaginations] = useState(numberOfPaginationsNext)
  const [activePagination, setActivePagination] = useState(ordersProps.length ? 1 : 0)
  const [filterInputValue, setFilterInputValue] = useState('')
  const [filterAvailable, setFilterAvailable] = useState(false)
  const [ordersAfterFilter, setOrdersAfterFilter] = useState([])

  useEffect(
    () => {
      setOrders(ordersProps)
      setActivePagination(ordersProps.length ? 1 : 0)
      setNumberOfPaginations(numberOfPaginationsNext)
    },
    [ordersProps]
  )

  function handleFilterInput (event) {
    let valueNext = event.target.value
    let filterInputValueTrimmed = valueNext.trim()
    if (filterInputValueTrimmed.length) {
      let ordersAfterFilter = getOrdersAfterFilter( filterInputValueTrimmed )
      setActivePagination(ordersAfterFilter.length ? 1 : 0)
      setFilterInputValue(valueNext)
      setFilterAvailable(true)
      setNumberOfPaginations(Math.ceil(ordersAfterFilter.length / 10))
      setOrdersAfterFilter(ordersAfterFilter)
      return
    }
    setActivePagination(filterAvailable ? ( orders.length ? 1 : 0 ) : activePagination)
    setFilterInputValue(valueNext)
    setFilterAvailable(false)
    setNumberOfPaginations(Math.ceil(orders.length / 10))
  }

  function getOrdersAfterFilter (filterKeyword = '') {
    filterKeyword = filterKeyword.toLowerCase()
    return orders.filter((order)=>{
      for(let orderField in order){
        if (isNaN(order[orderField]) && order[orderField].toLowerCase().includes(filterKeyword)) return true
        else if (!isNaN(order[orderField]) && order[orderField].toString().toLowerCase().includes(filterKeyword)) return true
      }
      return false
    })
  }

  function changeActiveTab (tab) {
    props.latest50OrdersActions.getLatest50OrdersAsync( tab, false, true)
    setActivePagination(1)
  }
  
  function getActivePaginationOrders () {
    if (!filterAvailable) {
      return orders.slice((activePagination - 1) * 10, activePagination * 10)
    }
    return ordersAfterFilter.slice((activePagination - 1) * 10, activePagination * 10)
  }
  
  function paginateToDirection (direction) {
    setActivePagination(direction === "left" ? activePagination - 1 : activePagination + 1)
  }

  let { invoiceActions, location } = props
  const { pathname } = location
  return (
    <div className="row" style={{ marginTop: "20px" }}>
      <div className="col-md-12 col-sm-12">
        <div className="portlet light bordered">
          <div className="portlet-title">
            <div className="caption caption-md font-dark">
              <i className="icon-clock font-blue-madison"></i>
              <span className="caption-subject bold uppercase font-blue-madison"> LATEST 50 ORDERS</span>
            </div>
            <div className="actions">
              <div className="btn-group btn-group-devided" data-toggle="buttons">
                <label 
                  className="btn btn-dashboard btn-outline btn-circle btn-sm active"
                  onClick={ () => changeActiveTab('received') }
                >
                  <input type="radio" className="toggle" />Received
                </label>
                <label 
                  className="btn btn-dashboard btn-outline btn-circle btn-sm"
                  onClick={ () => changeActiveTab("shipped") }
                >
                  <input type="radio" className="toggle"/>Shipped
                </label>
              </div>
            </div>
            <div className="inputs" style={{marginRight:"15px"}}>
              <div className="portlet-input input-inline input-medium">
                <div className="input-icon right">
                  <i className="icon-magnifier" />
                  <input 
                    type="text"
                    className="form-control input-circle ng-pristine ng-untouched ng-valid ng-empty"
                    value={ filterInputValue }
                    onChange={ event => handleFilterInput(event) }
                    placeholder="filter..." 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="portlet-body">
            <div className="table-responsive" style={{overflowX:"hidden"}}>
              <table className="table table-striped table-hover order-column" id="recent_activity">
                <thead>
                  <tr className="uppercase tb-header-3">
                    <th> # </th>
                    <th> Order # </th>
                    <th> Received </th>
                    <th> Order Stage </th>
                    <th> Ship To </th>
                    <th> Shipped </th>
                    <th> Carrier </th>
                  </tr>
                </thead>
                <TableBody
                  orders={ getActivePaginationOrders() }
                  startTableIndexNumbersFrom={(activePagination - 1 ) * 10 }
                  invoiceActions={invoiceActions}
                  pathname={pathname}
                />
              </table>
            </div>
          </div>
          <Paginations
            activePagination={ activePagination }
            numberOfPaginations={ numberOfPaginations }
            paginateToDirection={ paginateToDirection }
            setActivePagination={ setActivePagination }
          />
        </div>
      </div>
    </div>
  )
}

export default withRouter(
  connect(
    state => ({
      orders: state.overview.latest50Orders.orders
    }),
    dispatch => ({
      latest50OrdersActions: bindActionCreators( latest50OrdersActions, dispatch),
      invoiceActions: bindActionCreators( invoiceActions, dispatch )
    })
  )(OverviewOrders)
)