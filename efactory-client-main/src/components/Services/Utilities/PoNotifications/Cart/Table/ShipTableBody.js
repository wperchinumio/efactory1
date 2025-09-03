import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

const TableBody = props => {
  const firstRun = useRef(true)
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
      setTimeout(activateEditable, 0)
    },
    [props.po.lines]
  )

  function toggleItemChecked (event) {
    let item_number = event.target.name
    let { checkedRows } = props.po
    checkedRows = { ...checkedRows }
    if (checkedRows[item_number]) {
      delete checkedRows[item_number]
    } else {
      checkedRows[item_number] = true
    }
    props.poActions.setRootReduxStateProp('checkedRows', checkedRows)
  }

  function onLineQuantityChanged ( value, index ) {
    let { po, poActions } = props
    let { lines = [] } = po
    index = +index 
    lines = [...lines]
    lines = [
      ...lines.slice(0,index),
      {
        line_number: lines[index]['line_number'],
        item_number: lines[index]['item_number'],
        description: lines[index]['description'],
        quantity: value
      },
      ...lines.slice( index + 1 )
   ]
    poActions.setRootReduxStateProp('lines', lines)
  }

  function activateEditable () {
    global.$('.editable').editable({
      success(response, value){
        let indexOfFieldsObject = this.getAttribute('data-item-index')
        onLineQuantityChanged( value ,indexOfFieldsObject )
      },
      validate: function(value) {
        value = value.trim()
        if ( value === '') return 'This field is required'
        if (isNaN(value)) {
          return 'This field must be an integer value'
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

  let { lines = [], checkedRows = {} } = props.po
  return (
    <div className="op-cart-table po-notification-cart" style={{overflowY: "scroll"}}>
      <div className="table-responsive" style={{padding: 0}}>
        <table className="table table-striped table-hover table-bordered table-clickable">
          <colgroup>
            <col style={{width: "65px"}}/>
            <col />
            <col style={{width: "60px"}}/>
            <col style={{width: "7px"}}/>
          </colgroup>
          <tbody>
            {
              lines.map( ( item, index ) => {
                let {
                  item_number,
                  description,
                  quantity
                } = item
                let isItemChecked = checkedRows[item_number] ? true : false
                return (
                  <tr
                    className={ classNames({
                      'cart-row cart-row-normal cart-row-prev clickable-row' : true
                    }) }
                    key={ `to-return-item-${ index }` }
                  >
                    <td className="text-right counter">
                      <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                        <input
                          type="checkbox"
                          className="pull-right"
                          checked={ isItemChecked }
                          name={ item_number }
                          onChange={ toggleItemChecked }
                        />
                        <span></span>
                        <div className="counter">{ index + 1 }</div>
                      </label>
                    </td>
                    <td>
                      <span className="sbold">{ item_number }</span>
                      <br/>
                      <a className="desc">
                        { description }
                      </a>
                    </td>
                    <td>
                      <a
                        className="pull-right editable-size editable editable-click"
                        data-fieldname='to_receive.quantity'
                        data-item-index={ `${index}`}
                        data-original-title="Quantity"
                        data-pk="1"
                        id={`po-${item_number}`}
                      >
                        { quantity }
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
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default connect(
  state => ({
    rmaHeader : state.returnTrak.entry.rmaHeader,
    rma_detail : state.returnTrak.entry.rma_detail,
    checkedItems : state.returnTrak.entry.checkedItems
  })
)(TableBody)