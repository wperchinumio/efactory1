import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import rmaConfig from '../../../../Settings/TabContents/MailTemplates/RmaTemplatesTable/TableConfig'

const TableBody = props => {
  const firstRun = useRef(true)
  const isRmaTypeSelected = useRef(null)
  const propsRef = useRef(null)
  propsRef.current = props

  useEffect(
    () => {
      activateEditable()
    },
    []
  )

  useEffect(
    () => {
      if (firstRun.current) {
        firstRun.current = false
        return
      }
      setTimeout( () => activateEditable(), 0 )
    },
    [props.rmaHeader.rma_type, props.rma_detail]
  )

  function quickEditField (fieldType, indexOfFieldsObject, fieldName, value) {
    if (!['to_receive','to_ship'].includes(fieldType)) {
      return console.error(
        `quickEditField expects fieldType must be one of 'to_receive' or 'to_ship' `+
        `instead received ${fieldType}`
      )
    }
    if (!fieldName) {
      return console.error(
        `quickEditField expects fieldName to be a valid string `+
        `instead received ${fieldType}`
      )
    }
    let { rmaHeader, rmaEntryActions, rma_detail } = propsRef.current
    let { rma_type } = rmaHeader
    rmaEntryActions.setRootReduxStateProp({ field: 'dirty', value: true })
    rmaEntryActions.editRmaDetailItemField({
      fieldType, indexOfFieldsObject, fieldName, value
    })
    if (fieldName === 'quantity' && fieldType === 'to_receive') {
      let isToShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
      if (isToShipButtonBlue) {
        let authItemBeingEdited = rma_detail[ fieldType ][ indexOfFieldsObject ]
        let { item_number } = authItemBeingEdited
        let indexOnToShipArray = -1
        rma_detail[ 'to_ship' ].some( (item,i) => {
          if (item.item_number === item_number) {
            indexOnToShipArray = i
            return true
          }
          return false
        })
        if (indexOnToShipArray === -1) {
          let itemObject = {
            description : authItemBeingEdited.description,
            item_number,
            qty_net  : 0
          }
          // add item to to_ship array 
          //make indexOnToShipArray to length of the array
          rmaEntryActions.addRmaDetailItem({ fieldType : 'to_ship', itemObject })
          indexOnToShipArray = rma_detail['to_ship'].length
        }
        // recalculate quantity in case there there are auth items w the same quantity
        let allAuthItemsToCalculateTotalQuantity = rma_detail.to_receive.filter( (item,index) => {
          return item.item_number === item_number && index !== +indexOfFieldsObject
        } )
        value = +value
        allAuthItemsToCalculateTotalQuantity.forEach( item => {
          value += +item.quantity
        } )
        rmaEntryActions.editRmaDetailItemField({
          fieldType : 'to_ship',
          indexOfFieldsObject : indexOnToShipArray,
          fieldName : 'quantity',
          value
        })
      }
    }
  }

  function activateEditable () {
    global.$('.editable').editable({
      success(response, value){
        //let index = this.getAttribute('data-item-index')
        let field = this.getAttribute('data-fieldname')
        //let indexOfFieldsObject = this.getAttribute('data-item-index')[6]
        let indexOfFieldsObject = this.getAttribute('data-item-index').substring(6)
        let fieldType = field.replace(/\.[a-z_]+/,'')
        let fieldName = field.replace(/(to_ship|to_receive)\./,'')
        quickEditField( fieldType, indexOfFieldsObject, fieldName, value )
      },
      validate: function(value) {
        if (!isRmaTypeSelected.current) {
          return 'Please select rma type to edit fields'
        }
        /* to_ship.quantity or to_receive.quantity */
        let field = this.getAttribute('data-fieldname')
        //let fieldType = field.replace(/\.[a-z_]+/,'')
        let fieldName = field.replace(/(to_ship|to_receive)\./,'')
        //if ([ 'ship_by', 'do_not_ship_before' ].includes(fieldName) ) return
        if ([ 'serialnumber' ].includes(fieldName) ) return // Not required
        value = value.trim()
        if ( value === '') return 'This field is required'
        if ([ 'unit_price', 'quantity' ].includes(fieldName) && isNaN(value)) {
          return 'This field must be an integer value'
        }
        if (fieldName === 'quantity' && +( (+value).toFixed() ) !== +value) {
          return 'Quantity can not be a floating number'
        }
      },
      // Little trick, to force formatting
      display: function(value) {
      }
    })
    global.$('.editable').off('shown').on('shown', function(e, editable) {
      let value = editable.$element[0].innerText
      if (value === 'Empty') value = ''
      editable.input.$input.val(value)
      setTimeout( () => {editable.input.$input.select()}, 100 )
    })
  }

  function onItemCheckboxChange ({
    item_type = '',
    item_number = '',
    line_number,
    checked = false
  }) {
    const { checkedItems, rmaEntryActions } = props
    const value = {
      ...checkedItems,
      [item_type]: {
        ...checkedItems[item_type],
        [`${item_number}__${line_number}`]: checked
      }
    }
    rmaEntryActions.setRootReduxStateProp({ field: 'checkedItems', value })
  }

  let { rma_detail, rmaHeader } = props
  let { rma_type } = rmaHeader
  let { to_receive = [], to_ship = [] } = rma_detail
  isRmaTypeSelected.current = rma_type ? true : false
  let isAuthButtonRed = false
  let isToShipButtonBlue = false
  if (isRmaTypeSelected.current) {
    isAuthButtonRed = rmaConfig[ rma_type ][1][0] ? true : false
    isToShipButtonBlue = rmaConfig[ rma_type ][1][1] ? true : false
  }
  let { checkedItems } = props
  let { allChecked } = checkedItems
  return (
    <div className="op-cart-table" style={{overflowY: "scroll"}}>
      <div className="table-responsive" style={{padding: 0}}>
        <table className="table table-striped table-hover table-bordered table-clickable">
          <colgroup>
            <col style={{width: "65px"}}/>
            <col />
            <col style={{width: "60px"}}/>
            <col style={{width: "160px"}}/>
            <col style={{width: "65px"}}/>
            <col style={{width: "85px"}}/>
            <col style={{width: "7px"}}/>
          </colgroup>
          <tbody>
            {
              to_receive.map( ( item, index ) => {
                let {
                  line_number,
                  item_number,
                  description,
                  quantity,
                  serialnumber,
                  voided
                } = item
                let itemChecked = checkedItems['to_receive'][ `${item_number}__${line_number}` ] ? true : false
                let isLastItem = index + 1 === to_receive.length
                return (
                  <tr
                    className={ classNames({
                      'cart-row cart-row-normal cart-row-prev clickable-row' : true,
                      'lineThrough' : voided
                    }) }
                    style={ isLastItem ? {borderBottom: "3px double #999"} : {} }
                    key={ `to-return-item-${ index }` }
                  >
                    <td className="text-right counter">
                      <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                        <input
                          type="checkbox"
                          className="pull-right"
                          checked={ voided ? false : allChecked ? true : itemChecked }
                          onChange={ event => {
                            if (!voided) {
                              onItemCheckboxChange({
                                item_type : 'to_receive',
                                item_number,
                                line_number,
                                checked : event.target.checked
                              })
                            }
                          } }
                        />
                        <span></span>
                        <div className="counter">{ index + 1 }</div>
                      </label>
                      <br/>
                      <i className={ classNames({
                        'fa fa-arrow-down' : true,
                        'font-red-soft' : isRmaTypeSelected.current && isAuthButtonRed,
                        'font-dark' : isRmaTypeSelected.current && !isAuthButtonRed,
                        'font-grey-salsa' : !isRmaTypeSelected.current
                      }) }></i>
                    </td>
                    <td>
                      <span className="sbold">{ item_number }</span>
                      <br/>
                      <a
                        className="desc editable-size editable editable-click"
                        data-fieldname='to_receive.description'
                        data-item-index={ `${String(new Date().getTime()).slice(-4)}__${index}`}
                        data-original-title="Item Description"
                        data-pk="1"
                      >
                        { description }
                      </a>
                    </td>
                    <td>
                      <a
                        className="pull-right editable-size editable editable-click"
                        data-fieldname='to_receive.quantity'
                        data-item-index={ `${String(new Date().getTime()).slice(-4)}__${index}`}
                        data-original-title="Quantity"
                        data-pk="1"
                        id={`to_receive__${item_number}__${line_number}`}
                      >
                        { quantity }
                      </a>
                    </td>
                    <td>
                      <a
                        className={ classNames({
                          'pull-right editable-size editable editable-click' : true,
                          'editable-empty' : true
                        }) }
                        data-fieldname='to_receive.serialnumber'
                        data-item-index={ `${String(new Date().getTime()).slice(-4)}__${index}`}
                        data-original-title="Expected Serial #"
                        data-pk="1"
                        id={ `serial_${line_number}`}
                      >
                        { serialnumber }
                      </a>
                    </td>
                    <td/>
                    <td/>
                  </tr>
                )
              })
            }
            {
              isToShipButtonBlue && to_ship.map( ( item, index ) => {
                let {
                  line_number,
                  item_number,
                  description,
                  quantity,
                  unit_price,
                  voided
                } = item
                let itemChecked = checkedItems['to_ship'][ `${item_number}__${line_number}` ] ? true : false
                return (
                  <tr
                    className={ classNames({
                      'cart-row cart-row-normal cart-row-prev clickable-row' : true,
                      'lineThrough' : voided
                    }) }
                    key={ `to-ship-item-${ index }` }
                  >
                    <td className="text-right counter">
                      <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                        <input
                          type="checkbox"
                          className="pull-right"
                          checked={ voided ? false : allChecked ? true : itemChecked }
                          onChange={ event => {
                            if (!voided) {
                              onItemCheckboxChange({
                                item_type : 'to_ship',
                                item_number,
                                line_number,
                                checked : event.target.checked
                              })
                            }
                          } }
                        />
                        <span></span>
                        <div className="counter">{ index + 1 }</div>
                      </label>
                      <br/>
                      <i className={ classNames({
                        'fa fa-arrow-up' : true,
                        'font-blue-soft' : isToShipButtonBlue,
                        'font-grey-salsa' : !isToShipButtonBlue
                      }) }></i>
                    </td>
                    <td>
                      <span className="sbold"> { item_number } </span>
                      <br/>
                      <a
                        className="desc editable-size editable editable-click"
                        data-fieldname='to_ship.description'
                        data-item-index={ `${String(new Date().getTime()).slice(-4)}__${index}`}
                        data-original-title="Item Description"
                        data-pk="1"
                      >
                        { description }
                      </a>
                    </td>
                    <td>
                      {' '}
                    </td>
                    <td>
                      {' '}
                    </td>
                    <td>
                      <a
                        className="pull-right editable-size editable editable-click"
                        data-fieldname='to_ship.quantity'
                        data-item-index={ `${String(new Date().getTime()).slice(-4)}__${index}`}
                        data-original-title="Ship Quantity"
                        data-pk="1"
                        id={`to_ship__${item_number}__${line_number}`}
                      >
                        { quantity }
                      </a>
                    </td>
                    <td>
                      <a
                        className="pull-right editable-size editable editable-click"
                        data-fieldname='to_ship.unit_price'
                        data-item-index={ `${String(new Date().getTime()).slice(-4)}__${index}`}
                        data-original-title="Unit Price"
                        data-pk="1"
                      >
                        { unit_price }
                      </a>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

TableBody.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired,
  inventoryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({
    rmaHeader : state.returnTrak.entry.rmaHeader,
    rma_detail : state.returnTrak.entry.rma_detail,
    checkedItems : state.returnTrak.entry.checkedItems
  })
)(TableBody)