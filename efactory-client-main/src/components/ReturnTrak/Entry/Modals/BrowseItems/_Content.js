import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'
import DebounceInput from 'react-debounce-input'
import { getUserData } from '../../../../../util/storageHelperFuncs'
import { formatNumber } from '../../../../_Helpers/FormatNumber'
import * as inventoryActions from './redux'
import Pagination from './Pagination'

const EditItemsModal = props => {
  const matchedWarehouseRef = useRef(null)
  const warehousesRef = useRef(getUserData('warehouses') || {})
  const propsRef = useRef(null)
  propsRef.current = props

  const handleModalOpening = useCallback(
    () => {
      let { activeCartButton, accountShippingWarehouse } = propsRef.current
      if (activeCartButton === 'ship') {
        if (accountShippingWarehouse) {
          let isThereAMatch = false
          let locationDerived = accountShippingWarehouse.split('.')[1]
          let accountDerived = accountShippingWarehouse.split('.')[0]

          let matchedLocation = Object.keys(warehousesRef.current).filter(
            w => w.toLowerCase() === locationDerived.toLowerCase()
          )
          matchedLocation = matchedLocation.length ? matchedLocation[0] : ''
          if (matchedLocation) {
            let optionMatched = null
            
            warehousesRef.current[matchedLocation].some( w => {
              let isMatch = false
              Object.keys(w).forEach( branch => {
                if (w[branch].indexOf(accountDerived) !== -1) {
                  optionMatched = matchedLocation + '-' + branch;
                  isMatch = true
                }
              })
              return isMatch
            })

            if (optionMatched) {
              let matchedWarehouse = optionMatched
              setWarehouseFilterValue( matchedWarehouse )
              setSearchFilterValue('')
              setOmitZeroQtyFilterValue(true)
              fetchItems()
              matchedWarehouseRef.current = matchedWarehouse
              isThereAMatch = true
            }
          }
          if (!isThereAMatch ) console.error('There is no option matched selected accountShippingWarehouse')
        }else{
          setWarehouseFilterValue('')
          setSearchFilterValue('')
          setOmitZeroQtyFilterValue(true)
          fetchItems()
        }
      }else{
        setWarehouseFilterValue('')
        setSearchFilterValue('')
        setOmitZeroQtyFilterValue('')
        fetchItems()
      }
    },
    []
  )

  useEffect(
    () => {
      global.$('#rma-edit-items').on('show.bs.modal', handleModalOpening)
      return () => {
        global.$('#rma-edit-items').off('show.bs.modal', handleModalOpening)
      }
    },
    []
  )

  /*
    gets called when warehouse options changes,
    sets warehouse state on redux,
    then calls fetchItems
  */
  function setWarehouseFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field : 'warehouse', value })
  }

  function fetchItems () {
    props.inventoryActions.fetchInventoryItems(false)
  }

  /*
    gets called when search filter input value changes,
    then calls fetchItems
  */
  function setSearchFilterValue (value) {
    props.inventoryActions.setRootReduxStateProp({ field : 'searchFilter', value })
  }

  /*
    gets called when search filter input value changes,
    then calls fetchItems
  */
  function setOmitZeroQtyFilterValue (value) {
    let { setRootReduxStateProp } = props.inventoryActions
    setRootReduxStateProp({ field : 'omit_zero_qty', value })
  }

  

  function paginate (pageNumber) {
    let { setRootReduxStateProp } = props.inventoryActions
    setRootReduxStateProp({ field : 'currentPagination', value : pageNumber })
    fetchItems()
  }

  function handleFilterInput (event) {
    let { value } = event.target
    if (props.searchFilter !== value) {
      setSearchFilterValue(value)
      fetchItems()
    }
  }

  function getWarehouseOptions () {
    let options = []
    Object.keys(warehousesRef.current).forEach( ( aWarehouse, i1 ) => {
      warehousesRef.current[aWarehouse].forEach( ( invType, i2 ) => {
        Object.keys( invType ).forEach( ( anInvType, i3) => {
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

  function onShowZeroQtyChanged (event) {
    setOmitZeroQtyFilterValue(!event.target.checked)
    fetchItems()
  }

  function onWarehouseChanged (event) {
    setWarehouseFilterValue( event.target.value )
    fetchItems()
  }

  function onRefreshClicked (event) {
    props.inventoryActions.fetchInventoryItems(false)
  }

  let {
    activeCartButton,
    items,
    totalItems,
    currentPagination,
    inventoryActions,
    searchFilter,
    warehouse,
    omit_zero_qty,
    rma_detail,
    rma_type
  } = props
  let formFieldsDisabled = warehouse === '' ||
                           matchedWarehouseRef.current === '' ||
                           matchedWarehouseRef.current !== warehouse

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="rma-edit-items"
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
                      {
                        activeCartButton !== 'ship' &&
                        <col style={{width: "90px"}}/>
                      }
                      {
                        activeCartButton === 'ship' &&
                      <col style={{width: "90px"}}/>
                      }
                      {
                        activeCartButton === 'ship' &&
                        <col style={{width: "90px"}}/>
                      }
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
                        {
                          activeCartButton !== 'ship' &&
                          <th className="text-right">
                            In Cart
                          </th>
                        }
                        {
                          activeCartButton !== 'ship' &&
                          <th className="text-right">
                            Add Qty
                          </th>
                        }
                        {
                          activeCartButton === 'ship' &&
                          <th className="text-right">
                            Qty
                          </th>
                        }
                        {
                          activeCartButton === 'ship' &&
                          <th className="text-right">
                            Unit Price
                          </th>
                        }
                        {
                          activeCartButton === 'ship' &&
                          <th className="text-right">
                            Net Available
                          </th>
                        }
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
                        {
                          activeCartButton === 'ship' &&
                          <col style={{width: "90px"}}/>
                        }
                      </colgroup>
                      <tbody>
                      {
                        items.map( ( item, index ) => {
                          // if (inventoryItems[item_number].voided) {
                            //return <span></span>
                          //}
                          let {
                            quantity = 0,
                            price = 0,
                            item_number,
                            description,
                            qty_net
                          } = item
                          let quantityOnCart = 0
                          if (activeCartButton !== 'ship') {
                            quantityOnCart = rma_detail.to_receive.filter( i => {
                                    if (i.item_number !== item_number || i.voided || +i.quantity === 0 ) return false
                                    return true
                                  } ).concat( [{quantity:0}] ).reduce( (p,n) => {
                                    return { quantity : +p.quantity + +n.quantity}
                                  }, {quantity : 0} )['quantity']
                          }
                          let is_bold =  +quantity > 0
                          return (
                            activeCartButton === 'ship' ?
                            <tr
                              className="cart-row clickable-row"
                              key={ `item-key-${index}` }
                            >
                              <td className="text-right">
                                { (currentPagination - 1) * totalItems + index + 1 }
                              </td>
                              <td>
                                <span className={ classNames({
                                  'bold' : is_bold
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
                                  value={ quantity }
                                  disabled={ !rma_type || formFieldsDisabled }
                                  onChange={  event => {
                                    let value = event.target.value.trim()
                                    if (!isNaN( value )) {
                                      value = (+value).toFixed()
                                      inventoryActions.updateItemFieldValue({
                                        index, field : 'quantity', value
                                      })
                                    }
                                  } }
                                  className="form-control input-sm"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ price }
                                  onChange={ event => {
                                    let value = event.target.value.trim()
                                    if (!isNaN( value )) {
                                      inventoryActions.updateItemFieldValue({
                                        index, field : 'price', value
                                      })
                                    }
                                  } }
                                  disabled={ formFieldsDisabled }
                                  className="form-control input-sm"
                                />
                              </td>
                              <td className="text-right sbold">
                                { formatNumber(qty_net, 0) }
                              </td>
                            </tr> :
                            <tr
                              className="cart-row clickable-row"
                              key={ `item-key-${index}` }
                            >
                              <td className="text-right">
                                { (currentPagination - 1) * totalItems + index + 1 }
                              </td>
                              <td>
                                <span className={ classNames({
                                  'bold' : quantityOnCart !== 0 || is_bold
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
                                  value={ quantityOnCart }
                                  disabled={ true }
                                  onChange={ event => {} }
                                  className="form-control input-sm"
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ quantity }
                                  disabled={ !rma_type || ( activeCartButton === 'ship' ? formFieldsDisabled : false ) }
                                  onChange={ event => {
                                    let value = event.target.value.trim()
                                    if (!isNaN( value )) {
                                      value = (+value).toFixed()
                                      inventoryActions.updateItemFieldValue({
                                        index, field : 'quantity', value
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
  state => ({
    accountShippingWarehouse: state.returnTrak.entry.rmaHeader.accountShippingWarehouse,
    accountReceivingWarehouse: state.returnTrak.entry.rmaHeader.accountReceivingWarehouse,
    activeCartButton: state.returnTrak.entry.activeCartButton,
    currentPagination: state.returnTrak.inventory.currentPagination,
    items: state.returnTrak.inventory.items,
    omit_zero_qty: state.returnTrak.inventory.omit_zero_qty,
    rma_type: state.returnTrak.entry.rmaHeader.rma_type,
    searchFilter: state.returnTrak.inventory.searchFilter,
    rma_detail: state.returnTrak.entry.rma_detail,
    totalItems: state.returnTrak.inventory.totalItems,
    warehouse: state.returnTrak.inventory.warehouse
  }),
  dispatch => ({
    inventoryActions: bindActionCreators( inventoryActions, dispatch )
  })
)(EditItemsModal)