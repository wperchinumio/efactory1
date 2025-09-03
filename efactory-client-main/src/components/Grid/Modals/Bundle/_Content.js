import React, { useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import Pagination from './Pagination'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as reviewActions from './redux'
import classNames from 'classnames'
import { getUserData } from '../../../../util/storageHelperFuncs'
import DebounceInput from 'react-debounce-input'
import * as gridActions from '../../../Grid/redux'

const BundleModal = (props) => {
  const propsRef = useRef(null)
  propsRef.current = props
  const warehousesRef = useRef(getUserData('warehouses') || {})
  const warehousesOptionValuesRef = useRef(null)
  
  const handleModalOpening = useCallback(
    () => {
      let accountNumberLocation = propsRef.current.main_warehouse 
      if( accountNumberLocation ){
        let locationDerived = accountNumberLocation.split('-')[0].trim()
        let accountDerived = accountNumberLocation.split('-')[1].trim()

        let matchedLocation = Object.keys(warehousesRef.current).filter( 
          w => w.toLowerCase() === locationDerived.toLowerCase() 
        )
        matchedLocation = matchedLocation.length ? matchedLocation[0] : ''

        let query_location = ''

        warehousesRef.current[matchedLocation].some( w => {
          let isMatch = false
          Object.keys(w).forEach( branch => {
            if (accountDerived === branch) {
              query_location = matchedLocation + '-' + branch;
              isMatch = true;
            }
          })
          return isMatch
        })

        props.reviewActions.setItemsModalFilterField({
          query_warehouse: query_location
        }) 
      }
      props.reviewActions.fetchInventoryItems()
    },
    []
  )

  const handleModalClosing = useCallback(
    () => {
      props.reviewActions.clearBrowseItemsFilters()
    },
    []
  )

  useEffect(
    () => {
      global.$('#bundle').on('show.bs.modal', handleModalOpening )
      global.$('#bundle').on('hide.bs.modal', handleModalClosing )
      return () => {
        global.$('#bundle').off('show.bs.modal', handleModalOpening )
        global.$('#bundle').off('hide.bs.modal', handleModalClosing )
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
    let warehousesOptionValues = []
    Object.keys( warehousesRef.current ).forEach( ( aWarehouse, i1 ) => {
      warehousesRef.current[ aWarehouse ].forEach( ( invType, i2 ) => {
        Object.keys( invType ).forEach( ( anInvType, i3) => {
          let optionValue = `${aWarehouse}-${anInvType}`
          warehousesOptionValues.push( optionValue )
          options.push((
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

  let {
    bundle_item_number,
    bundle_upc,
    bundle_type,
    bundle_pl,
    bundle_description,
    bundle_item_id,
    main_warehouse,
    query_warehouse,
    inventoryItems,
    totalNumberOfItems,
    itemPagination,
    itemPageSize,
    item_filter,
    show_bundle_only,
    reviewActions,
  } = props

  let formFieldsDisabled = query_warehouse !== main_warehouse || bundle_type === 9 /* Configured bundle */ || bundle_type === 3 /*expired bundle */

  let disabledSave = !(bundle_item_number && bundle_type !== '' && query_warehouse === main_warehouse) || bundle_type === 9 || bundle_type === 3

  let disabledHeader = bundle_item_id > 0;

  return (
    <div
      className="modal modal-themed fade"
      data-backdrop="static"
      id="bundle"
      tabIndex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content op-review">
          <div className="modal-header">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true">
            </button>
            <h4 className="modal-title">Bundle Items</h4>
          </div>
          <div className="modal-body">
            <div className="row" style={{marginBottom: "5px"}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="col-md-2 control-label text-right" style={{paddingTop: "5px"}}>
                  Bundle Item #:
                </label>
                <div className="col-md-4">
                  <input
                    className="uppercase form-control input-sm"
                    type="text"
                    value={ bundle_item_number }
                    disabled={disabledHeader}
                    onChange={ event => {
                      let value = event.target.value.trim()
                      reviewActions.setBundleItemValue('bundle_item_number', value)
                    } }
                  />
                </div>
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="col-md-2 control-label text-right" style={{paddingTop: "5px"}}>
                  Bundle Type:
                </label>
                <div className="col-md-4">
                    <select
                      name=""
                      value={ bundle_type }
                      className="form-control input-sm"
                      onChange={ event => {
                        let value = event.target.value.trim()
                        reviewActions.setBundleItemValue('bundle_type', value)
                      } }
                    >
                      <option value="1">Assembled</option>
                      <option value="2">Bundled</option>
                      <option value="3">Configured</option>
                      <option value="9">Expired</option>
                    </select>
                  </div>
              </div>
            </div>
            <div className="row" style={{marginBottom: "5px"}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="col-md-2 control-label text-right" style={{paddingTop: "5px"}}>
                  UPC #:
                </label>
                <div className="col-md-4">
                  <input
                    className="uppercase form-control input-sm"
                    type="text"
                    disabled={bundle_type !== 'A' || disabledHeader}
                    value={ bundle_upc }
                    onChange={ event => {
                      let value = event.target.value.trim()
                      reviewActions.setBundleItemValue('bundle_upc', value)
                    } }
                  />
                  </div>
              </div>
            </div>
            <div className="row" style={{marginBottom: "15px"}}>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="col-md-2 control-label text-right" style={{paddingTop: "5px"}}>
                  B. Description:
                </label>
                <div className="col-md-4">
                  <input
                    className="form-control input-sm"
                    type="text"
                    disabled={bundle_type !== 'A' || disabledHeader}
                    value={ bundle_description }
                    onChange={ event => {
                      let value = event.target.value.trim()
                      reviewActions.setBundleItemValue('bundle_description', value)
                    } }
                  />
                  </div>
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="col-md-2 control-label text-right" style={{paddingTop: "5px"}}>
                  PL Print:
                </label>
                <div className="col-md-4">
                    <select
                      name=""
                      value={ bundle_pl }
                      className="form-control input-sm"
                      onChange={ event => {
                        let value = event.target.value.trim()
                        reviewActions.setBundleItemValue('bundle_pl', value)
                      } }
                    >
                      <option value="0">No Print</option>
                      <option value="1">Print</option>
                    </select>
                  </div>
              </div>
            </div>
            <hr/>
            <div className="row">
              <div className="col-md-5">
                <div className="input-icon">
                  <i className="icon-magnifier"></i>
                  <DebounceInput
                    className="form-control input-circle"
                    placeholder="search by item # or description"
                    debounceTimeout={350}
                    value={item_filter}
                    disabled={show_bundle_only}
                    onChange={ event => handleFilterInput(event.target.value) }
                    style={{minWidth:"280px"}}
                  />
                </div>
              </div>
              <div className="col-md-5" style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                  <label className="mt-checkbox mt-checkbox-outline op-opt no-mrg" style={{marginTop:"5px"}}>
                    <input
                      type="checkbox"
                      checked={ show_bundle_only }
                      //disabled={formFieldsDisabled}
                      onChange={ event => {
                        reviewActions.setItemsModalFilterField({
                          show_bundle_only : event.target.checked
                        })
                      }}
                    />
                    <label className="">Show bundle items only</label>
                    <span style={{backgroundColor: "white"}}></span>
                  </label>
                </div>
                <div>
                  <select
                    name=""
                    value={query_warehouse || ''}
                    className="form-control input-sm"
                    style={{maxWidth: '160px', display: 'none', marginLeft: '10px'}}
                    onChange={ event => {
                      reviewActions.setItemsModalFilterField({
                        query_warehouse : event.target.value
                      })
                    }}
                  >
                    <option value="">Warehouse: All</option>
                      { getWarehouseOptions() }
                  </select>
                </div>
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
                      <col style={{width: "150px"}}/>
                      <col style={{width: "80px"}}/>
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
                        <th className="text-left">
                          PL Print
                        </th>
                        <th className="text-right">
                          Line #
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
                        <col style={{width: "150px"}}/>
                        <col style={{width: "80px"}}/>
                        <col style={{width: "90px"}}/>
                        <col style={{width: "7px"}}/>
                      </colgroup>
                      <tbody>
                      {
                        Object.keys(inventoryItems).map( ( item_number, index ) => {
                          let anItem = inventoryItems[item_number]
                          let quantity =  anItem.quantity
                          let line_num =  anItem.line_num
                          let item_pl =  anItem.item_pl
                          let is_bold =  +quantity > 0
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
                                <select
                                  name=""
                                  value={ item_pl }
                                  className="form-control input-sm"
                                  onChange={ event => {
                                    let value = event.target.value.trim()
                                    let inventoryItemsCopy = {
                                      ...inventoryItems,
                                      [item_number] : {
                                        ...inventoryItems[item_number],
                                        item_pl : value
                                      }
                                    }
                                    reviewActions.updateInventoryItems(inventoryItemsCopy)
                                  } }
                                >
                                  <option value="0">No Print</option>
                                  <option value="1">Print</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={ line_num }
                                  disabled={ formFieldsDisabled }
                                  onChange={ event => {
                                    let value = event.target.value.trim()

                                    if( !isNaN( value ) ){
                                      value = (+value).toFixed()
                                      let inventoryItemsCopy = {
                                        ...inventoryItems,
                                        [item_number] : {
                                          ...inventoryItems[item_number],
                                          line_num : value
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
                totalItems={totalNumberOfItems}
                currentPagination={itemPagination}
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
                disabled={disabledSave}
                className="btn btn-success"
                //data-dismiss="modal"
                onClick={ event => reviewActions.saveBundle()
                  .then( (response) => {
                  global.$('#bundle').modal('hide')
                  //props.activateEditable()
                  props.gridActions.fetchRowsWithChangedParams()
                } )
                .catch( error => {
                  // Don't close dialog
                })            
                }>
                Save bundle
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

BundleModal.propTypes = {
  reviewActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    inventoryItems: state.bundle.inventoryItems,
    itemPagination: state.bundle.itemPagination,
    itemPageSize: state.bundle.itemPageSize,
    totalNumberOfItems: state.bundle.totalNumberOfItems,
    item_filter: state.bundle.item_filter,
    omit_zero_qty: state.bundle.omit_zero_qty,
    show_bundle_only: state.bundle.show_bundle_only,
    main_warehouse: state.bundle.main_warehouse,
    query_warehouse: state.bundle.query_warehouse,
    bundle_detail: state.bundle.bundle_detail,
    bundle_item_number: state.bundle.bundle_item_number,
    bundle_upc: state.bundle.bundle_upc,
    bundle_type: state.bundle.bundle_type,
    bundle_item_id: state.bundle.bundle_item_id,
    account_number: state.bundle.account_number,
    bundle_pl: state.bundle.bundle_pl,
    bundle_description: state.bundle.bundle_description,
  }),
  dispatch => ({
    reviewActions: bindActionCreators( reviewActions, dispatch ),
    gridActions: bindActionCreators( gridActions, dispatch )
  })
)(BundleModal)