import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import DebounceInput from 'react-debounce-input'
import { getUserData } from '../../../../../../util/storageHelperFuncs'
import * as inventoryActions from './redux'
import Pagination from './Pagination'

const EditItemsModal = props => {
  const warehousesRef = useRef(getUserData('warehouses') || {})

  const handleModalOpening = useCallback(
    () => {
      setWarehouseFilterValue('')
      setSearchFilterValue('')
      setOmitZeroQtyFilterValue('')
      fetchItems()
    },
    []
  )

  useEffect(
    () => {
      global.$('#browse-items-po').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#browse-items-po').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  function setWarehouseFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field: 'warehouse', value })
  }

  function fetchItems () {
    props.inventoryActions.fetchInventoryItems(false)
  }

  function setSearchFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field: 'searchFilter', value })
  }

  function setOmitZeroQtyFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field: 'omit_zero_qty', value })
  }

  function paginate (pageNumber) {
    props.inventoryActions.setRootReduxStateProp({ field: 'currentPagination', value: pageNumber })
    fetchItems()
  }

  function handleFilterInput (event) {
    let { value } = event.target
    if( props.searchFilter !== value ){
      setSearchFilterValue(value)
      fetchItems()
    }
  }

  function getWarehouseOptions () {
    let options = []
    let warehousesOptionValues = []
    Object.keys(warehousesRef.current).forEach( ( aWarehouse, i1 ) => {
      warehousesRef.current[aWarehouse].forEach( ( invType, i2 ) => {
        Object.keys( invType ).forEach( ( anInvType, i3) => {
          let optionValue = `${aWarehouse}-${anInvType}`
          warehousesOptionValues.push( optionValue )
          options.push( (
            <option
              key={`${i1}${i2}${i3}-pair`}
              value={ optionValue } >
              { `${aWarehouse} - ${anInvType}` }
            </option>
          ) )

        } )
      } )
    } )
    return options
  }

  function onShowZeroQtyChanged (event) {
    setOmitZeroQtyFilterValue(!event.target.checked)
    fetchItems()
  }

  function onWarehouseChanged (event) {
    setWarehouseFilterValue(event.target.value)
    fetchItems()
  }

  function onRefreshClicked (event) {
    props.inventoryActions.fetchInventoryItems(false)
  }

  let {
    items,
    totalItems,
    currentPagination,
    inventoryActions,
    searchFilter,
    warehouse,
    omit_zero_qty,
  } = props

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="browse-items-po"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Items</h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-5">
                <div className="input-icon">
                  <i className="icon-magnifier"></i>
                  <DebounceInput
                    className="form-control input-circle"
                    placeholder="search by item # or description"
                    debounceTimeout={350}
                    value={searchFilter}
                    onChange={ handleFilterInput }
                    style={{minWidth:"280px"}}
                  />
                </div>
              </div>
              <div className="col-md-4 col-md-offset-1">
                <label
                  className="mt-checkbox mt-checkbox-outline op-opt no-mrg"
                  style={{marginTop:"5px"}}
                >
                  <input
                    type="checkbox"
                    checked={ !omit_zero_qty }
                    onChange={ onShowZeroQtyChanged }
                  />
                  <label className="">Show 0 QTY</label>
                  <span style={{backgroundColor: "white"}}></span>
                </label>
                <select
                  name=""
                  value={warehouse || ''}
                  className="form-control input-sm"
                  style={{maxWidth: '160px', display: 'inline-block', marginLeft: '10px'}}
                  onChange={ onWarehouseChanged }
                >
                  <option value="">Warehouse: All</option>
                    { getWarehouseOptions() }
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn dark btn-circle btn-sm pull-right"
                  onClick={ onRefreshClicked }
                >
                  <i className="fa fa-refresh"></i>
                  Refresh
                </button>
              </div>
              <div className="col-md-12" style={{paddingTop: "10px"}}>
                <div>
                  <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
                    <colgroup>
                      <col style={{width: "50px"}}/>
                      <col />
                      <col style={{width: "80px"}}/>
                      <col style={{width: "80px"}}/>
                      <col style={{width: "7px"}}/>
                    </colgroup>
                    <thead>
                      <tr className="uppercase noselect table-header-1 cart-row">
                        <th className="text-right">
                          #
                        </th>
                        <th className="text-left">
                          Item # / Description
                        </th>
                        <th className="text-right">
                          In Cart
                        </th>
                        <th className="text-right">
                          Add Qty
                        </th>
                        <th className="text-left">
                          &nbsp;
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="op-cart-table op-cart-table-ext" style={{ minHeight: "470px" }}>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover table-bordered table-clickable">
                      <colgroup>
                        <col style={{width: "50px"}}/>
                        <col />
                        <col style={{width: "80px"}}/>
                        <col style={{width: "80px"}}/>  
                      </colgroup>
                      <tbody>
                      {
                        items.map( (item, index) => {
                          let {
                            quantity = '0',
                            item_number,
                            description,
                            qty_now = '0',
                            isInTheCart
                          } = item

                          let is_bold =  +qty_now > 0 || +quantity > 0

                          return (
                            <tr
                              className="cart-row clickable-row"
                              key={ `item-key-${index}` }
                            >
                              <td className="text-right">
                                { (currentPagination - 1) * totalItems + index + 1 }
                              </td>
                              <td>
                                <span className={ classNames({
                                  'bold': is_bold
                                }) } >
                                  { item_number }
                                </span>
                                <br/>
                                <span className="desc">
                                  { description }
                                </span>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ isInTheCart ? qty_now : '0' }
                                  disabled={true}
                                  className="form-control input-sm"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ quantity }
                                  disabled={ isInTheCart }
                                  onChange={  event => {
                                    let value = event.target.value.trim()
                                    if( !isNaN( value ) ){
                                      value = (+value).toFixed()
                                      inventoryActions.updateItemFieldValue({
                                        index, value
                                      })
                                    }
                                  } }
                                  className="form-control input-sm"
                                />
                              </td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="pull-left" style={{marginTop: "-30px"}}>
              <Pagination
                paginate={ paginate }
                totalItems={ totalItems }
                currentPagination={ currentPagination }
              />
            </div>
            <div>
              <button
                type="button"
                className="btn dark btn-outline"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={false}
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={ event => inventoryActions.addItemsToCart() }>
                Add to order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

EditItemsModal.propTypes = {
  inventoryActions: PropTypes.object,
  totalItems: PropTypes.any
}

export default connect(
  state => {
    let { inventory } = state.services.utilities
    return {
      currentPagination: inventory.currentPagination,
      items: inventory.items,
      omit_zero_qty: inventory.omit_zero_qty,
      searchFilter: inventory.searchFilter,
      totalItems: inventory.totalItems,
      warehouse: inventory.warehouse
    }
  },
  dispatch => ({
    inventoryActions: bindActionCreators( inventoryActions, dispatch )
  })
)(EditItemsModal)