import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import DebounceInput from 'react-debounce-input'
import Pagination from './Pagination'
import { getUserData } from '../../../../../util/storageHelperFuncs'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const EditItemsModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const matchedWarehouses = useRef(null)
  const warehouses = useRef(getUserData('warehouses') || {})

  const handleModalOpening = useCallback(
    () => {
      let { orderHeader } = propsRef.current
      let { accountNumberLocation = '' } = orderHeader
      if (accountNumberLocation) {
        let isThereAMatch = false
        let locationDerived = accountNumberLocation.split('.')[1]
        let accountDerived = accountNumberLocation.split('.')[0]
        let matchedLocation = Object.keys(warehouses.current).filter(
          w => w.toLowerCase() === locationDerived.toLowerCase()
        )
        matchedLocation = matchedLocation.length ? matchedLocation[0] : ''
        if (matchedLocation) {
          let optionMatched = null
          warehouses.current[matchedLocation].some( w => {
            let isMatch = false
            Object.keys(w).forEach( branch => {
              if (w[branch].indexOf(accountDerived) !== -1) {
                optionMatched = matchedLocation + '-' + branch
                isMatch = true
              }
            })
            return isMatch
          })
          if (optionMatched) {
            props.reviewActions.setItemsModalFilterField({
              warehouses: optionMatched
            }) 
            matchedWarehouses.current = optionMatched
            isThereAMatch = true
          }
        }
        if (!isThereAMatch) {
          console.error('There is no option matched selected accountNumberLocation')
        }
      } else {
        matchedWarehouses.current = ''
        props.reviewActions.fetchInventoryItems()
      }
    },
    []
  )

  useEffect(
    () => {
      global.$('#op-edit-items').on('show.bs.modal', handleModalOpening)
      global.$('#op-edit-items').on('hide.bs.modal', props.reviewActions.clearBrowseItemsFilters)
      return () => {
        global.$('#op-edit-items').off('show.bs.modal', handleModalOpening)
        global.$('#op-edit-items').off('hide.bs.modal', props.reviewActions.clearBrowseItemsFilters)
      }
    },
    []
  )

  function paginate (pageNumber) {
    props.reviewActions.setItemPagination(pageNumber)
  }

  function handleFilterInput (value) {
    let { item_filter, reviewActions } = props
    if (item_filter !== value) {
      reviewActions.setItemFilterValue(value)
    }
  }

  function getWarehouseOptions () {
    let options = []
    Object.keys(warehouses.current).forEach( (aWarehouse, i1) => {
      warehouses.current[ aWarehouse ].forEach( (invType, i2) => {
        Object.keys(invType).forEach( (anInvType, i3) => {
          let optionValue = `${aWarehouse}-${anInvType}`
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

  let {
    inventoryItems,
    totalNumberOfItems,
    itemPagination,
    itemPageSize,
    reviewActions,
    item_filter,
    custom_field_2_item_numbers
  } = props

  let {
    omit_zero_qty,
    warehouses: warehousesProps
  } = props.entry

  let formFieldsDisabled = warehousesProps === '' || 
                           matchedWarehouses.current === '' ||
                           matchedWarehouses.current !== warehousesProps
  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="op-edit-items"
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
                    value={item_filter}
                    onChange={ event => handleFilterInput(event.target.value) }
                    style={{minWidth:"280px"}}
                  />
                </div>
              </div>
              <div className="col-md-4 col-md-offset-1">
                <label className="mt-checkbox mt-checkbox-outline op-opt no-mrg" style={{marginTop:"5px"}}>
                  <input
                    type="checkbox"
                    checked={ !omit_zero_qty }
                    onChange={ event => {
                      reviewActions.setItemsModalFilterField({
                        omit_zero_qty : !event.target.checked
                      })
                    } }
                  />
                  <label className="">Show 0 QTY</label>
                  <span style={{backgroundColor: "white"}}></span>
                </label>
                <select
                  name=""
                  value={warehousesProps || ''}
                  className="form-control input-sm"
                  style={{maxWidth: '160px', display: 'inline-block', marginLeft: '10px'}}
                  onChange={ event => {
                    reviewActions.setItemsModalFilterField({ warehouses: event.target.value })
                  }}
                >
                  <option value="">Warehouse: All</option>

                    { getWarehouseOptions() }

                </select>
              </div>

              <div className="col-md-2">
                <button
                  className="btn dark btn-circle btn-sm pull-right"
                  onClick={ event => reviewActions.fetchInventoryItems() }
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
                      <col style={{width: "90px"}}/>
                      <col style={{width: "90px"}}/>
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
                          Qty
                        </th>
                        <th className="text-right">
                          Unit Price
                        </th>
                        <th className="text-right">
                          Net Available
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
                        <col style={{width: "90px"}}/>
                        <col style={{width: "90px"}}/>
                      </colgroup>
                      <tbody>
                      {
                        Object.keys(inventoryItems).map( ( item_number, index ) => {

                          let anItem = inventoryItems[item_number]

                          let exist_in_cart = custom_field_2_item_numbers.includes( item_number )

                          if( anItem.voided ){
                            return <span></span>
                          }
                          
                          let quantity =  anItem.quantity
                          let is_bold =  +quantity > 0 || exist_in_cart

                          return (
                            <tr
                              className="cart-row clickable-row"
                              key={ `item-key-${index}` }
                            >
                              <td className="text-right">
                                { (itemPagination - 1) * itemPageSize + index + 1 }
                              </td>
                              <td>
                                <span className={ classNames({
                                  'bold' : is_bold
                                }) } >
                                  { anItem.item_number }
                                </span>
                                <br/>
                                <span className="desc">
                                  { anItem.description }
                                </span>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ quantity }
                                  disabled={ formFieldsDisabled }
                                  onChange={ event => {
                                    let value = event.target.value.trim()

                                    if( !isNaN( value ) ){
                                      value = (+value).toFixed()
                                      let inventoryItemsCopy = {
                                        ...inventoryItems,
                                        [item_number] : {
                                          ...inventoryItems[item_number],
                                          quantity : value
                                        }
                                      }
                                      reviewActions.updateInventoryItems(inventoryItemsCopy)
                                    }
                                  } }
                                  className="form-control input-sm"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ anItem.price }
                                  onChange={ event => {
                                    let value = event.target.value.trim()
                                    // change how to filter @TODO
                                    if( !isNaN( value ) ){
                                      let inventoryItemsCopy = {
                                        ...inventoryItems,
                                        [item_number] : {
                                          ...inventoryItems[item_number],
                                          price : value
                                        }
                                      }
                                      reviewActions.updateInventoryItems(inventoryItemsCopy)
                                    }
                                  } }
                                  disabled={ formFieldsDisabled }
                                  className="form-control input-sm"
                                />
                              </td>
                              <td className="text-right sbold">
                                { formatNumber(anItem.qty_net, 0) }
                              </td>
                            </tr>
                          )
                        } )
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
                total_items={totalNumberOfItems}
                current_page={itemPagination}
                page_size={itemPageSize}
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
                onClick={ event => reviewActions.processItems().then( () => {
                  props.activateEditable()
                } ) }>
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
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    entry               : state.orderPoints.entry,
    inventoryItems      : state.orderPoints.entry.inventoryItems,
    itemPagination      : state.orderPoints.entry.itemPagination,
    itemPageSize        : state.orderPoints.entry.itemPageSize,
    totalNumberOfItems  : state.orderPoints.entry.totalNumberOfItems,
    item_filter         : state.orderPoints.entry.item_filter,
    order_detail        : state.orderPoints.entry.order_detail,
    orderHeader         : state.orderPoints.entry.orderHeader,
    custom_field_2_item_numbers : state.orderPoints.entry.custom_field_2_item_numbers
  })
)(EditItemsModal)