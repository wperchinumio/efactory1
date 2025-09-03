import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TableBody from './TableBody'
import Paginations from '../Paginations'
import * as inventoryActions from '../redux/overviewInventory'
import * as invoiceActions from '../../Invoices/Open/redux'

const OverviewInventory = props => {
  const firstRun = useRef(true)
  let { items = [] } = props
  const [activePagination, setActivePagination] = useState(items.length ? 1 : 0)
  const [numberOfPaginations, setNumberOfPaginations] = useState(Math.ceil(items.length / 10))

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setActivePagination(items.length ? 1 : 0)
      setNumberOfPaginations(Math.ceil(items.length / 10))
    },
    [items]
  )

  function getActivePaginationItems () {
    return props.items.slice((activePagination - 1) * 10, activePagination * 10)
  }

  function paginateToDirection (direction) {
    setActivePagination(direction === "left" ? activePagination - 1 : activePagination + 1)
  }

  function handleFilterChange (event, filterFieldToChange = '') {
    if( filterFieldToChange === '' ){
      return console.error('handleFilterChange expected a valid filterFieldToChange')
    }
    props.inventoryActions.updateInventoryFilters({
      ...props.filters,
      [filterFieldToChange]: event.target.checked
    })
  }

  let { invoiceActions } = props
  let {
    hasKey,
    isShort,
    needReorder
  } = props.filters
  return (
    <div className="row" style={{ marginTop: "20px", marginBottom: '-20px' }}>
      <div className="col-md-12">
        <div className="portlet light bordered ">
          <div className="portlet-title">
            <div className="caption caption-md">
                <i className="icon-bar-chart font-yellow-gold"></i>
                <span className="caption-subject font-yellow-gold bold uppercase">Inventory</span>
            </div>
            <div className="actions">
              <div className="btn-group">
                <a
                  className="btn btn-sm btn-dashboard btn-circle"
                  href="#"
                  data-toggle="dropdown"
                  data-close-others="true">
                    Filter By
                  <i className="fa fa-angle-down"></i>
                </a>
                <div className="dropdown-menu dropdown-checkboxes pull-right">
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={hasKey}
                      onChange={ event => handleFilterChange( event, 'hasKey' ) }
                    />
                      Key
                    <span></span>
                  </label>
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={needReorder}
                      onChange={ event => handleFilterChange( event, 'needReorder' ) }
                    /> Reorder
                    <span></span>
                  </label>
                  <label className="mt-checkbox mt-checkbox-outline">
                    <input
                      type="checkbox"
                      checked={isShort}
                      onChange={ event => handleFilterChange( event, 'isShort' ) }
                    /> Short
                    <span></span>
                  </label>
                </div>
              </div>&nbsp;&nbsp;
              <a
                className="btn btn-circle btn-icon-only btn-dashboard"
                onClick={ event => {
                  event.preventDefault()
                  props.inventoryActions.getInventoryAsync( false, true )
                } }
              >
                <i className="icon-reload"></i>
              </a>
            </div>
          </div>
          <div className="portlet-body">
            <div className="table-responsive" style={{overflowX:"hidden"}}>
              <table className="table table-light table-striped table-hover order-column">
                <thead>
                  <tr className="uppercase tb-header-2">
                    <th> # </th>
                    <th className="text-center"> WAREHOUSE </th>
                    <th> ITEM # </th>
                    <th> DESCRIPTION </th>
                    <th className="text-center"> FLAGS </th>
                    <th className="text-right"> ON HAND </th>
                    <th className="text-right"> ON HOLD </th>
                    <th className="text-right"> COMM </th>
                    <th className="text-right"> PROC </th>
                    <th className="text-right"> FF </th>
                    <th className="text-right"> NET </th>
                    <th className="text-right"> MIN </th>
                    <th className="text-right"> DCL </th>
                    <th className="text-right"> WO </th>
                    <th className="text-right"> PO </th>
                    <th className="text-right"> RMA </th>
                  </tr>
                </thead>
                <TableBody
                  items={ getActivePaginationItems() }
                  startTableIndexNumbersFrom={(activePagination - 1 ) * 10 }
                  invoiceActions={invoiceActions}
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

export default connect(
  state => ({
    items: state.overview.inventory.items,
    filters: state.overview.inventory.filters
  }),
  dispatch => ({
    inventoryActions: bindActionCreators(inventoryActions, dispatch),
    invoiceActions: bindActionCreators(invoiceActions, dispatch),
  })
)(OverviewInventory)
