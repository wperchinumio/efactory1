import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ComfirmModal from '../../../../../OrderPoints/OrderEntry/Modals/Confirm'

const TableBody = props => {
  const firstRun = useRef(true)
  const propsRef = useRef(null)
  propsRef.current = props
  const [approveType, setApproveType] = useState('')
  const [approve_po_cart_items, setApprove_po_cart_items] = useState([])
  const [quick_edit_modal_selector, setQuick_edit_modal_selector] = useState('')
  const [typed_value, setTyped_value] = useState('')
  
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
      setTimeout( activateEditable, 0 )
    },
    [props.poRmaState.po_cart_items]
  )

  function processRecSnValue ({index, itemCheckedValue, item_number, value}) {
    let { poRmaActions, poRmaState } = propsRef.current
    let { po_cart_items } = poRmaState
    po_cart_items = [ ...po_cart_items ]
    index = +index 
    let item = po_cart_items[ index ]
    let { qty_now = 0, auth_qty = 0, received_qty = 0, e1_line_number } = item
    
    if (!value) {
      po_cart_items = [
        ...po_cart_items.slice( 0, index ),
        { 
          ...item,
          recv_sn : ''
        },
        ...po_cart_items.slice( index + 1 ),
      ]
    } else if (qty_now > 1 && item.is_serialized) {
      let updatedItem = { 
        ...item, 
        recv_sn : value,
        qty_now : 1,
        auth_qty : +auth_qty ? 1 : 0,
        not_deletable : +auth_qty > 1 ? true : false,
        received_qty : +received_qty ? 1 : 0,
      }
      let nextItem    = { 
        ...item, 
        recv_sn : '',
        auth_qty : +auth_qty ? +auth_qty - 1 : 0,
        not_deletable : +auth_qty > 1 ? true : false,
        qty_now : '',
        received_qty : +received_qty ? +received_qty - 1 : 0,
        e1_line_number : null,
        ts : ( new Date() ).getTime()
      }
      po_cart_items = [
        ...po_cart_items.slice( 0, index ),
        updatedItem,
        nextItem,
        ...po_cart_items.slice( index + 1 ),
      ]
      
      setApproveType('recv_sn')
      setApprove_po_cart_items(po_cart_items)
      setQuick_edit_modal_selector(`#recv_sn_${index}`)
      setTyped_value(value)

      if (e1_line_number) {
        global.$('#approve-quick-edit').modal('show')
        return ' '
      } else {
        props.poRmaActions.setRootReduxStateProp_multiple({ po_cart_items })
      }
    } else {
      po_cart_items = [
        ...po_cart_items.slice( 0, index ),
        { ...item, recv_sn: value },
        ...po_cart_items.slice( index + 1 ),
      ]
    }
    poRmaActions.setRootReduxStateProp_multiple({ po_cart_items })
  }

  function processQtyNowValue ({index, itemCheckedValue, item_number, value}) {
    let { poRmaActions, poRmaState } = propsRef.current
    let { po_cart_items } = poRmaState
    po_cart_items = [ ...po_cart_items ]
    let item = po_cart_items[ index ]
    let { is_serialized } = item
    value = +value
    index = +index
    po_cart_items[ index ] = { 
      ...item, 
      qty_now : value,
      recv_sn : value > 1 && is_serialized ? '' : item.recv_sn
    }
    poRmaActions.setRootReduxStateProp_multiple({
      po_cart_items
    })
  }

  function activateEditable () {
    global.$('.editable').editable({
      success(response, value){
        let index = this.getAttribute('data-item-index')
        let field = this.getAttribute('data-fieldname')
        if ([ 'recv_sn', 'qty_now' ].includes( field ) ) return 
        let { poRmaActions, poRmaState } = propsRef.current
        let { po_cart_items } = poRmaState
        po_cart_items = [ ...po_cart_items ]
        poRmaActions.setRootReduxStateProp( 'po_cart_items', [
          ...po_cart_items.slice( 0, index ),
          {
            ...po_cart_items[ index ],
            [ field ] : value
          },
          ...po_cart_items.slice( index + 1 ),
        ])

      },
      validate: function(value) {
        let index             = this.getAttribute('data-item-index')
        let field             = this.getAttribute('data-fieldname')
        let itemCheckedValue  = this.getAttribute('data-item-checked-value')
        let item_number       = this.getAttribute('data-item-number')
        let dataObj           = { index, itemCheckedValue, item_number, value }
        switch(field) {
          case 'recv_sn':
            return processRecSnValue( dataObj )
          case 'qty_now':
            if ( isNaN( value ) ) return 'This field only accepts integer values'
            return processQtyNowValue( dataObj )
          default:
            break
        }
      },
      // Little trick, to force formatting
      display: function(value) {
      },
      placement : 'left'
    })
    global.$('.editable').off('shown').on('shown', function(e, editable) {
      let value = editable.$element[0].innerText
      if (value === 'Empty') value = ''
      editable.input.$input.val(value)
      setTimeout( () => {editable.input.$input.select()}, 100 )
    })
  }

  function onFieldChanged (event) {
    let { name, value } = event.target
    value = value.trim()
    if (name === 'qty_now' && isNaN(value) ) return
    let index = event.target.getAttribute('data-item-index')
    index = +index
    let { poRmaActions, poRmaState } = props
    let { po_cart_items } = poRmaState
    po_cart_items = [
      ...po_cart_items.slice( 0, index ),
      {
        ...po_cart_items[ index ],
        [ name ] : value
      },
      ...po_cart_items.slice( index + 1 ),
    ]
    poRmaActions.setRootReduxStateProp_multiple({
      po_cart_items
    })
  }

  function removeFromCheckedCartItems (event) {
    let { name } = event.target
    let { poRmaState, poRmaActions } = props
    let { checked_cart_items } = poRmaState
    let checkedItemIndex = checked_cart_items.findIndex( checked =>  checked === name )
    checked_cart_items = [
      ...checked_cart_items.slice( 0, checkedItemIndex ),
      ...checked_cart_items.slice( checkedItemIndex + 1 ),
    ]
    poRmaActions.setRootReduxStateProp_multiple({ checked_cart_items })
  }

  function addToCheckedCartItems (event) {
    let { name } = event.target
    let { poRmaState, poRmaActions } = props
    let { checked_cart_items } = poRmaState
    checked_cart_items = [ ...checked_cart_items, name ]
    poRmaActions.setRootReduxStateProp_multiple({ checked_cart_items })
  }

  function onQuickEditApproved () {
    global.$( quick_edit_modal_selector ).editable('hide')
    props.poRmaActions.setRootReduxStateProp_multiple({ po_cart_items: approve_po_cart_items })
  }

  function onRejectHandler (event) {
    setTimeout( () => {
      global.$(quick_edit_modal_selector).editable('show')
      global.$(quick_edit_modal_selector).editable('option', 'value', typed_value)
    }, 200 )
  }

  let { po_cart_items, checked_cart_items } = props.poRmaState
  return (
    <div className="op-cart-table po-rma-cart" style={{overflowY: "scroll"}}>
      <div className="table-responsive" style={{padding: 0}}>
        <table className="table table-striped table-hover table-bordered table-clickable">
          <colgroup>
            <col style={{width: "65px"}}/>
            <col style={{width: "80px"}}/>
            <col />
            <col style={{width: "70px"}}/>
            <col style={{width: "70px"}}/>
            <col style={{width: "90px"}}/>
            <col style={{width: "230px"}}/>
            <col style={{width: "130px"}}/>
            <col style={{width: "130px"}}/>
          </colgroup>
          <tbody>
          {
            po_cart_items.map( ( item, index ) => {
              let {
                item_description,
                item_number,
                auth_qty,
                e1_line_number,
                received_qty,
                qty_now,
                fully_received,
                condition_code,
                auth_sn,
                recv_sn,
                voided = false,
                line_number,
                ts,
                not_deletable
              } = item
              if (!ts ) console.warn('ts field is required')
              let isWarningExist = +qty_now && ( +qty_now > ( +auth_qty - +received_qty ) )
              let isItemChecked = !voided && !fully_received && checked_cart_items.includes( String(ts) )                                
              return (
                <tr
                  className={ classNames({
                    'cart-row cart-row-normal cart-row-prev clickable-row' : true,
                    'lineThrough' : voided,
                    'disabled-table-tr' : fully_received
                  }) }
                  key={ `po-rma-${ index }` }
                >
                  <td className="text-right counter">
                    <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                      <input
                        type="checkbox"
                        className="pull-right"
                        checked={ isItemChecked }
                        disabled={ voided || fully_received || ( e1_line_number && +received_qty > 0  ) || not_deletable }
                        name={ ts }
                        onChange={ isItemChecked ? removeFromCheckedCartItems : addToCheckedCartItems }
                      />
                      <span></span>
                      <div className="counter">{ index + 1 }</div>
                    </label>
                  </td>
                  <td className="text-right">
                    { line_number }
                  </td>
                  <td>
                    <span className="sbold">
                      { item_number } 
                      { isWarningExist 
                        ? <i 
                            className="fa fa-warning font-xs font-yellow" 
                            aria-hidden="true"
                            style={{ float : 'right' }}
                          ></i>
                        : ''
                      }
                    </span>
                    <br/>
                    { item_description }
                  </td>
                  <td className="text-right">
                    { auth_qty }
                  </td>
                  <td className="text-right">
                    { received_qty }
                  </td>
                  <td>
                    {
                      ( voided || fully_received )
                      ? <span className="pull-right"> { qty_now } </span>
                      : <a
                          id={ `qty_now_${index}` }
                          className="editable-size editable editable-click pull-right"
                          data-fieldname='qty_now'
                          data-item-index={ index }
                          data-original-title="Qty. Now"
                        >
                          { qty_now ? qty_now : 'Empty' }
                        </a>
                    }
                  </td>
                  <td>
                    {
                      !fully_received &&
                      <select
                        className="input-sm form-control"
                        data-item-index={ index }
                        disabled={ voided  }
                        name="condition_code"
                        value={ condition_code ? condition_code : ''  } 
                        onChange={ onFieldChanged }
                      >
                        <option value="C1">C1 : Box in good condition </option>
                        <option value="C2">C2 : Box damaged </option>
                        <option value="C9">C9 : Invalid item returned </option>
                      </select>
                    }
                  </td>
                  <td>
                    { auth_sn }
                  </td>
                  <td>
                    {
                      ( voided || +qty_now < 1 || fully_received )
                      ? <span> {recv_sn} </span>
                      : <a
                          id={ `recv_sn_${index}` }
                          className="editable-size editable editable-click"
                          data-fieldname='recv_sn'
                          data-item-index={ index }
                          data-original-title="Received S/N"
                          data-pk="1"
                          data-is-checked={ isItemChecked ? 'checked' : '' }
                          data-item-checked-value={ ts }
                          data-item-number={ item_number }
                        >
                          { recv_sn ? recv_sn : 'Empty' } 
                        </a>
                    }
                  </td>
                </tr>
              )
            } )
          }
          </tbody>
        </table>
      </div>
      <ComfirmModal
        id="approve-quick-edit"
        confirmationMessage={  
          approveType === 'qty_now' 
          ? 'A new line needs to be added to accomodate the extra quantities. Do you want to proceed?'
          : 'A new line needs to be added because of S/N. Do you want to proceed?'
        }
        onConfirmHandler={ onQuickEditApproved }
        onRejectHandler={ onRejectHandler }
      />
    </div>
  )
}

TableBody.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default TableBody