import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import DebounceInput from 'react-debounce-input'
import { getUserData } from '../../../../../../util/storageHelperFuncs'
import Pagination from './Pagination'

const EditItemsModal = props => {
  const propsRef = useRef(null)
  propsRef.current = props
  const matchedWarehouseRef = useRef(null)
  const warehousesOptionValuesRef = useRef(null)
  const warehousesRef = useRef(getUserData('warehouses') || {})

  const handleModalOpening = useCallback(
    () => {
      let { po, poActions } = propsRef.current
      let { location, account_number } = po
      let { inv_region, inv_type } = determineInvParams( location, account_number )
      let modal_selected_wh_filter = inv_region ? `${inv_region}-${inv_type}` : ''
      matchedWarehouseRef.current = modal_selected_wh_filter
      let filter = { and : [
        { field : 'omit_zero_qty',oper  : '=', value : false }
      ] }
      if (modal_selected_wh_filter) {
        filter.and.push({ field: 'inv_type',     oper: '=', value: inv_type })
        filter.and.push({ field: 'inv_region',   oper: '=', value: inv_region })
      }
      poActions.setRootReduxStateProp_multiple({
        fetchInventoryParams: {
          filter,
          modal_selected_wh_filter,
          page_num: 1,
          modalSearchFilter: ''
        },
        addItemSearchFilterValue: ''
      }).then( () => fetchItems() )
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

  function determineInvParams (location, account_number) {
    if (!location) {
      return { inv_type: '', inv_region: '' }
    }
    let matchedLocation = Object.keys(warehousesRef.current).filter(
      w => w.toLowerCase() === location.toLowerCase()
    )
    matchedLocation = matchedLocation.length ? matchedLocation[0] : ''
    let optionMatched = ''
    if (matchedLocation) {
      warehousesRef.current[matchedLocation].some( w => {
        let isMatch = false
        Object.keys(w).forEach( branch => {
          if (w[branch].indexOf(account_number) !== -1) {
            optionMatched = matchedLocation + '-' + branch;
            isMatch = true
          }
        })
        return isMatch
      })
    }

    let optionsMatched = []

    if (optionMatched) {
      optionsMatched = warehousesOptionValuesRef.current.filter(
        o => o.toLowerCase() === optionMatched.toLowerCase()
      )
    }
    if (!optionsMatched.length ) {
      return console.error('There is no option matched given location')
    }
    let matchedWarehouse = optionsMatched[0] // "EX-ZCLC"
    let inv_type   = matchedWarehouse.replace(/[a-zA-Z]+-/, '')
    let inv_region = matchedWarehouse.replace(/-[a-zA-Z]+/, '')
    return { inv_type, inv_region }
  }

  function fetchItems () {
    props.poActions.fetchInventoryItems(false)
  }

  function paginate (page_num) {
    let { po, poActions } = props
    poActions.setRootReduxStateProp_multiple({
      fetchInventoryParams : {
        ...po.fetchInventoryParams,
        page_num
      }
    }).then(fetchItems)
  }

  function handleFilterInput (event) {
    let { po, poActions } = props
    let { value } = event.target
    if (po.fetchInventoryParams.modalSearchFilter !== value) {
      poActions.setRootReduxStateProp( 'fetchInventoryParams', {
        ...po.fetchInventoryParams,
        modalSearchFilter: value
      } ).then(fetchItems)
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
          ))
        })
      })
    })
    if (!warehousesOptionValuesRef.current) {
      warehousesOptionValuesRef.current = warehousesOptionValues
    }
    return options
  }

  function onWarehouseChanged (event) {
    let { po, poActions } = props
    let { value } = event.target
    if (po.fetchInventoryParams.modal_selected_wh_filter !== value) {
      let filter = { and: [
        { field: 'omit_zero_qty',oper: '=', value: false }
      ] }
      if (value) {
        filter.and.push( { field: 'inv_region',   oper: '=', value: value.replace( /-\w+/, '' ) } )
        filter.and.push( { field: 'inv_type',     oper: '=', value: value.replace( /\w+-/, '' ) } )
      }
      poActions.setRootReduxStateProp( 'fetchInventoryParams', {
        ...po.fetchInventoryParams,
        filter,
        modal_selected_wh_filter: value
      } ).then(fetchItems)
    }
  }

  function updateQuantityValue (index, value) {
    let { po, poActions } = props
    let { rows } = po
    poActions.setRootReduxStateProp( 'rows', [
      ...rows.slice(0,index),
      {
        description: rows[ index ]['description'],
        item_number: rows[ index ]['item_number'],
        row_id: rows[ index ]['row_id'],
        quantity: value
      },
      ...rows.slice( +index + 1 )
    ] )
  }

  function onQuantityChanged (event) {
    let value = event.target.value.trim()
    let index = +event.target.name.replace('index-','')
    if (!isNaN(value)) {
      updateQuantityValue(index, value)
    }
  }

  function addItemsToCart () {
    let { po, poActions } = props
    let { lines, lines_hashmap, rows } = po
    rows.forEach( row => {
      let is_item_exist_on_cart = lines_hashmap[ row.item_number ] || lines_hashmap[ row.item_number ] === 0   // which is the quantity
      let is_item_quantity_zero = +row.quantity === 0
      if (is_item_quantity_zero) {
        if (is_item_exist_on_cart) {
          lines = lines.filter( line => line.item_number !== row.item_number )
        }
      }else{
        if (is_item_exist_on_cart) {
          if (+lines_hashmap[ row.item_number ] !== +row.quantity) {
            lines = lines.map( 
              line => ({ 
                ...line, 
                quantity: line.item_number === row.item_number ? row.quantity : line.quantity
              }) 
            )
          }
        }else{
          lines = [
            ...lines,
            {
              line_number : lines.length + 1,
              item_number : row.item_number,
              description : row.description,
              quantity    : row.quantity
            }
          ]
        }
      }
    })
    lines = lines.map( (line,index) => ({ ...line, line_number : index + 1 }) )
    poActions.setRootReduxStateProp_multiple({ lines, form_dirty : true })
  }

  let { po } = props
  let { fetchInventoryParams, rows = [], total } = po
  let {
    modal_selected_wh_filter,
    page_num,
    modalSearchFilter = ''
  } = fetchInventoryParams
  let formFieldsDisabled = !matchedWarehouseRef.current 
                           || modal_selected_wh_filter !== matchedWarehouseRef.current

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
                    value={ modalSearchFilter }
                    onChange={ handleFilterInput }
                    style={{ minWidth : '280px' }}
                  />
                </div>
              </div>
              <div className="col-md-4 col-md-offset-1">
                <select
                  name=""
                  value={ modal_selected_wh_filter || '' }
                  className="form-control input-sm"
                  style={{maxWidth: '160px', display: 'inline-block', marginLeft: '10px',float: 'right' }}
                  onChange={ onWarehouseChanged }
                >
                  <option value="">Warehouse: All</option>
                  { getWarehouseOptions() }
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn dark btn-circle btn-sm pull-right"
                  onClick={ fetchItems }
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
                        <col style={{width: "7px"}}/>
                      </colgroup>
                      <tbody>
                        {
                          rows.map( ( row, index ) => {
                            let {
                              quantity = 0,
                              item_number,
                              //row_id,
                              description
                            } = row
                            let is_bold =  +quantity > 0
                            return (
                              <tr
                                className="cart-row clickable-row"
                                key={ `item-key-${index}` }
                              >
                                <td className="text-right">
                                  { ( +page_num - 1) * 100 + index + 1 }
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
                                    name={`index-${index}`}
                                    disabled={ formFieldsDisabled }
                                    onChange={  onQuantityChanged }
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
                totalItems={ total }
                currentPagination={ page_num }
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
                onClick={ addItemsToCart }>
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
  totalItems: PropTypes.any,
  po: PropTypes.object.isRequired,
  poActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    accountShippingWarehouse: state.returnTrak.entry.rmaHeader.accountShippingWarehouse,
    accountReceivingWarehouse: state.returnTrak.entry.rmaHeader.accountReceivingWarehouse,
    currentPagination: state.returnTrak.inventory.currentPagination,
    items: state.returnTrak.inventory.items,
    searchFilter: state.returnTrak.inventory.searchFilter,
    rma_detail: state.returnTrak.entry.rma_detail,
    totalItems: state.returnTrak.inventory.totalItems,
    warehouse: state.returnTrak.inventory.warehouse
  })
)(EditItemsModal)