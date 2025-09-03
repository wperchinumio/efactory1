import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import moment from 'moment'
import EditItemsModal from './EditItemsModal'
import { formatNumber } from '../../../../_Helpers/FormatNumber'

const ReviewItems = props => {
  const addItemNode = useRef(null)
  const [addItemBeingEdited, setAddItemBeingEdited] = useState(false)
  const addItemBeingEditedRef = useRef(null)
  addItemBeingEditedRef.current = addItemBeingEdited
  const [openItemItemNumber, setOpenItemItemNumber] = useState('')

  useEffect(
    () => {
      activateEditable()
    },
    []
  )

  function activateEditable () {
    global.$('.editable').editable({
      success: function(response, value){
        let { updateOrderDetail } = props.reviewActions
        let index = this.getAttribute('data-item-index')
        let field = this.getAttribute('data-fieldname')
        if ([ 'ship_by', 'do_not_ship_before' ].includes(field)) {
          value = moment(value).utc().format('YYYY-MM-DD')
        }
        updateOrderDetail( index, { [field]: value } )
      },
      validate: function(value) {
        let field = this.getAttribute('data-fieldname')
        if ([ 'ship_by', 'do_not_ship_before' ].includes(field) ) {
          return
        }
        value = value.trim()
        if (value === '') return 'This field is required'
        if ([ 'price', 'quantity' ].includes(field) && isNaN(value) ) {
          return 'This field must be an integer value'
        }
        if (field === 'quantity' && +( (+value).toFixed() ) !== +value) {
          return 'Quantity can not be a floating number'
        }
      },
      // Little trick, to force formatting
      display: function(value) {
      }
    })
    global.$('.editable').off('shown').on('shown', function(e, editable) {
      editable.input.$input.val(editable.$element[0].innerText)
      setTimeout( () => {editable.input.$input.select()}, 100 )
    })
    global.$('.editable').off('hidden').on('hidden', () => {
      if (addItemBeingEditedRef.current) {
        setAddItemBeingEdited(false)
        let { setFindItemValue } = props.reviewActions
        setFindItemValue('')
        addItemNode.current.focus()
      }
    })
  }

  function getOrderDetailRows (order_detail = []) {
    let allJsxArray = []
    let { setSelectedItemsRows, updateOrderDetail } = props.reviewActions
    order_detail.forEach( ( aOrderDetail, index ) => {
      let {
        comments,
        custom_field1,
        custom_field2,
        custom_field5,
        item_number,
        description,
        quantity,
        price,
        do_not_ship_before,
        ship_by,
        voided,
        line_number,
        is_kit_component
      } = aOrderDetail
      let isItemOpen = openItemItemNumber === `${item_number}_${line_number}`
      let { selectedItemRows } = props
      let isRowSelected = selectedItemRows.includes( [item_number, line_number].join("-") )
      allJsxArray.push(
        <tr
        
          className={ classNames({
            'cart-row cart-row-normal cart-row-prev clickable-row' : true,
            'lineThrough' : voided
          }) }
          key={ `orderdetail-row-${item_number}-${index}` }
        >
          <td className="text-right counter">
            {!is_kit_component &&
            <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
              <input
                type="checkbox"
                checked={ isRowSelected }
                onChange={ event => { if (!voided) { setSelectedItemsRows( [ item_number, line_number ].join("-") ) } }  }
                className="pull-right"
              />
              <span></span>
              <div className="counter">{line_number}</div>
            </label>
            }
            {is_kit_component &&
            <span>
              <div className="counter">{line_number}</div>
            </span>
            }   
            <br/>
            <div>
              <i className={ classNames({
                'icon-bubble text-muted item-msg' : comments || custom_field1 || custom_field2 || custom_field5
              }) }></i>
            </div>
          </td>
          <td>
            <span className="sku">{ item_number }</span>
            <br/>
            <button
              className="btn blue-dark"
              onClick={ event => setOpenItemItemNumber(isItemOpen ? null : `${item_number}_${line_number}`) }
            >
              <i className={`fa fa-chevron-${ isItemOpen ? 'down' : 'right'}`}></i>
            </button>
            <a
              className="desc editable-size editable editable-click"
              data-fieldname='description'
              data-item-index={ index }
              data-original-title="Item Description"
              data-pk="1"
            >
              {description}
            </a>
          </td>
          <td>
            {!is_kit_component && 
            <a
            className="pull-right editable-size editable editable-click"
              data-fieldname='quantity'
              data-item-index={ index }
              data-original-title="Item Quantity"
              data-pk="1"
              id={ !voided ? `${item_number}_${line_number}` : ''}
            >
              {quantity}
            </a>
            }
            {is_kit_component && 
            <span className="pull-right">
              {quantity}
            </span>
            }  
          </td>
          <td>
            <a
              className="pull-right editable-size editable editable-click"
              data-fieldname='price'
              data-item-index={ index }
              data-original-title="Item Price"
              data-pk="1"
            >
              { formatNumber(price) }
            </a>
          </td>
          <td className="text-right">
            { formatNumber(price * quantity) }
          </td>
          <td className="text-center">
            {!is_kit_component &&
            <a
            className="editable-size editable editable-click"
              data-fieldname='do_not_ship_before'
              data-type="date"
              data-format="YYYY-MM-DD"
              data-viewformat="mm/dd/yyyy"
              data-item-index={ index }
              data-original-title="Select Do Not Ship Before Date"
            >
              { moment(do_not_ship_before).format('MM/DD/YYYY') }
            </a>
            }
            {is_kit_component && 
            <span className="pull-right">
              { moment(do_not_ship_before).format('MM/DD/YYYY') }
            </span>
            }  
          </td>
          <td className="text-center">
          {!is_kit_component &&
            <a
            className="editable-size editable editable-click"
              data-fieldname='ship_by'
              data-type="date"
              data-format="MM-DD-YYYY"
              data-viewformat="mm/dd/yyyy"
              data-item-index={ index }
              data-original-title="Select Ship by Date"
            >
              { moment(ship_by).format('MM/DD/YYYY') }
            </a>
            }
            {is_kit_component && 
            <span className="pull-right">
              { moment(ship_by).format('MM/DD/YYYY') }
            </span>
            }  
          </td>
        </tr>
      )

      let {
        detail_cf_1,
        detail_cf_2,
        detail_cf_5
      } = props.extraFieldsLabels

      allJsxArray.push(
        <tr
          className={ classNames({
            'cart-row cart-row-normal cart-row-prev clickable-row extra-info' : true,
            'hidden' : !isItemOpen
          }) }
          key={ `orderdetail-info-row-${item_number}-${index}` }
        >
          <td className="text-right counter">
          </td>
          <td colSpan="6">
            <div className="extra-info">
              <div className="row">
                <div className="col-md-4">
                  <div className="col-md-12">
                    <label className="control-label">{ detail_cf_1 }:</label>
                    <input
                      type="text"
                      className="form-control input-sm"
                      value={custom_field1}
                      onChange={ event => {
                        updateOrderDetail( index , { 'custom_field1' : event.target.value } )
                      } }
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">{ detail_cf_2 }:</label>
                    <input
                      type="text"
                      className="form-control input-sm"
                      value={custom_field2}
                      onChange={ event => {
                        updateOrderDetail( index , { 'custom_field2' : event.target.value } )
                      } }
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="control-label">{ detail_cf_5 }:</label>
                    <input
                      type="text"
                      className="form-control input-sm"
                      value={custom_field5}
                      onChange={ event => {
                        updateOrderDetail( index , { 'custom_field5' : event.target.value } )
                      } }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="control-label">Comments:</label>
                  <textarea
                    type="text"
                    className="form-control input-sm"
                    rows="6"
                    value={comments}
                    onChange={ event => {
                      updateOrderDetail( index , { 'comments' : event.target.value } )
                    } }
                  ></textarea>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )
    } )
    return allJsxArray
  }
  
  function addItem () {
    let { findItemValue, reviewActions } = props
    let { setItemFilterValue, updateOrderDetails } = reviewActions
    setItemFilterValue(findItemValue, false).then(
      ({ isSuccess, inventoryItems }) => {
        if (isSuccess) {
          if (inventoryItems.length === 1) {
            let item = inventoryItems[0]
            let { order_detail } = props
            let matched = order_detail.filter( o => o.item_number === item.item_number && !o.voided )
            if (matched.length && !matched[ matched.length - 1 ][ 'custom_field2' ]) {
              matched = matched[ matched.length - 1 ]
              global.$(`#${matched.item_number}_${matched.line_number}`).editable('show')
              setAddItemBeingEdited(true)
            }else{
              order_detail = [ ...order_detail ]

              let maxLineNumber = 0
              order_detail.forEach(
                v => { 
                  if (v.is_kit_component) return
                  maxLineNumber = +v.line_number > +maxLineNumber ? +v.line_number : +maxLineNumber 
                } 
              )
              order_detail.push(
                { ...item,
                  quantity : 1,
                  price : 0,
                  detail_id : 0,
                  line_number : ++maxLineNumber,
                  do_not_ship_before : moment().format('YYYY-MM-DD'), //today
                  ship_by : moment().add(1,'days').format('YYYY-MM-DD'), // tomorrow
                  custom_field1 : "",
                  custom_field2 : "",
                  custom_field3 : "",
                  custom_field4 : "",
                  custom_field5 : "",
                  comments : "",
                  voided : false,
                })
              updateOrderDetails(order_detail).then(
                () => {
                  setAddItemBeingEdited(true)
                  setTimeout(
                    () => {
                      activateEditable()
                      global.$(`#${item.item_number}_${maxLineNumber}`).editable('show')
                    },
                    0
                  )
              } )
            }
          }else{
            global.$('#op-edit-items').modal('show')
          }
        }else{
          console.error('fail')
        }
      }
    )
  }

  let {
    order_detail = [],
    selectedItemRows,
    findItemValue,
    orderHeader
  } = props

  let {
    setSelectedItemsRowsAll,
    removeSelectedItems,
    setFindItemValue
  } = props.reviewActions

  let notVoidedOrderDetails = order_detail.map( anItem => !anItem.voided )
  let allChecked = selectedItemRows.length ? selectedItemRows.length === notVoidedOrderDetails.length : false

  let { accountNumberLocation = '' } = orderHeader
  return (
    <div className="col-md-12">
      <div className="items">
        <div className="addr-type items-title" style={{height: "40px", verticalAlign: "middle", lineHeight: "33px", overflow: "hidden"}}>
          <div>
            <span className="col-md-3"><i className="fa fa-tags"></i> Items</span>
            <div style={{display: "inline-block", textAlign: "center"}} className="col-md-6">
              <form
                onSubmit={ event => {
                  event.preventDefault()
                  addItem()
                } }
                autoComplete="off"
              >
                <div className="input-icon" style={{display: "inline-block", textAlign: "center"}}>
                  <i className="fa fa-tag" style={{marginTop: "9px"}} />
                  <input
                    type="text"
                    ref={addItemNode}
                    disabled={ accountNumberLocation === '' }
                    value={findItemValue}
                    onChange={ event => setFindItemValue(event.target.value) }
                    className="form-control input-circle input-sm search-item"
                    placeholder="Add item..."
                  />
                </div>
              </form>
            </div>
            <span className="col-md-3">
              <a
                href="#op-edit-items"
                className="addr-edit pull-right"
                data-toggle="modal"
                style={{paddingLeft: "15px"}}
                tabIndex="-1"
              ><i className="fa fa-search" /> Browse Items...</a>
            </span>
          </div>
        </div>
        <div className="whole-table">
          <div>
            <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
              <colgroup>
                <col style={{width: "65px"}}/>
                <col />
                <col style={{width: "65px"}}/>
                <col style={{width: "85px"}}/>
                <col style={{width: "85px"}}/>
                <col style={{width: "90px"}}/>
                <col style={{width: "90px"}}/>
                <col style={{width: "7px"}}/>
              </colgroup>
              <thead>
              <tr className="uppercase noselect table-header-1 cart-row">
                <th className="text-right cart-row">
                  <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                    <input
                      type="checkbox"
                      checked={ allChecked }
                      onChange={ event => setSelectedItemsRowsAll(!allChecked) }
                      className="pull-right"
                    />
                    <div style={{minWidth: "18px"}}>
                      #
                    </div>
                    <span className="bg-grey"></span>
                  </label>
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
                  Ext Price
                </th>
                <th className="text-center">
                  Don't Ship Before
                </th>
                <th className="text-center">
                  Ship By
                </th>
                <th className="text-left">
                  &nbsp;
                </th>
              </tr>
              </thead>
            </table>
          </div>
          <div className="op-cart-table" style={{overflowY: "scroll"}}>
            <div className="table-responsive" style={{padding: 0}}>
              <table className="table table-striped table-hover table-bordered table-clickable">
                <colgroup>
                  <col style={{width: "65px"}}/>
                  <col />
                  <col style={{width: "65px"}}/>
                  <col style={{width: "85px"}}/>
                  <col style={{width: "85px"}}/>
                  <col style={{width: "90px"}}/>
                  <col style={{width: "90px"}}/>
                  <col style={{width: "7px"}}/>
                </colgroup>
                <tbody>
                {
                  order_detail.length > 0 &&
                  getOrderDetailRows(order_detail)
                }
                </tbody>
              </table>
            </div>
          </div>
          <div className="op-cart-footer">
            <table>
              <tbody>
              <tr>
                <td style={{width: "100%", verticalAlign: "top"}}>
                  <button
                    className="btn red-soft btn-xs"
                    disabled={ selectedItemRows.length === 0 }
                    onClick={ event => {
                      removeSelectedItems().then( () => {
                        activateEditable()
                      } )
                    } }
                  >Remove selected items</button>
                </td>
                <td style={{minWidth: "180px"}} className="small">
                  <div className="row">
                    <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                      Total Lines:
                    </div>
                    <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                      <strong>{order_detail.length}</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                      Total Qty:
                    </div>
                    <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                      <strong>{order_detail.reduce((total, elem) => (total + parseInt(elem.quantity,10)), 0)}</strong>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-xs-6 col-sm-6 op-totals">
                      Total Ext Price:
                    </div>
                    <div className="col-md-6 col-xs-6 col-sm-6 text-right">
                      <strong>{ formatNumber(order_detail.reduce((total, elem) => (total + elem.quantity * elem.price), 0)) }</strong>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <EditItemsModal
        reviewActions={ props.reviewActions }
        activateEditable={ activateEditable }
      />
    </div>
  )
}

ReviewItems.propTypes = {
  reviewActions: PropTypes.object,
}

export default connect(
  state => ({
    order_detail: state.orderPoints.entry.order_detail,
    selectedItemRows: state.orderPoints.entry.selectedItemRows,
    extraFieldsLabels: state.orderPoints.entry.extraFieldsLabels,
    findItemValue: state.orderPoints.entry.findItemValue,
    orderHeader: state.orderPoints.entry.orderHeader
  })
)(ReviewItems)