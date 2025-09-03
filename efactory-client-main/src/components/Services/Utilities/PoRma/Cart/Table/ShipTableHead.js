import React from 'react'
import PropTypes from 'prop-types'

const TableHead = props => {
  function toggleCheckAllItems (event) {
    // checked_cart_items
    let checked = event.target.getAttribute('data-is-checked')
    let { poRmaState, poRmaActions } = props
    let { checked_cart_items, po_cart_items } = poRmaState
    if (checked !== 'checked') {
      po_cart_items = po_cart_items.filter( 
        ({ voided, fully_received, e1_line_number, received_qty, not_deletable }) => !(voided || fully_received || ( e1_line_number && +received_qty > 0  ) || not_deletable ) 
      )
      checked_cart_items = po_cart_items.map( ({ ts }) => String(ts) )
    } else {
      checked_cart_items = []
    }
    poRmaActions.setRootReduxStateProp_multiple({ checked_cart_items })
  }

  let { poRmaState } = props
  let { checked_cart_items, po_cart_items, searched } = poRmaState
  let allChecked = searched && checked_cart_items.length && 
                   po_cart_items.filter( 
                    ({ voided, fully_received, e1_line_number, received_qty, not_deletable }) => !(voided || fully_received || ( e1_line_number && +received_qty > 0  ) || not_deletable ) 
                   ).length === checked_cart_items.length

  return (
    <div>
      <div className="table-header-1" style={{ paddingRight: '15px' }}>
        <table className="table table-striped table-hover table-condensed table-bordered" style={{margin: 0}}>
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
          <thead>
            <tr className="uppercase noselect table-header-1 cart-row">
              <th className="text-right cart-row">
                <label className="mt-checkbox mt-checkbox-outline no-mrg-r color-inherit">
                  <input
                    type="checkbox"
                    className="pull-right"
                    disabled={ !searched }
                    checked={ allChecked }
                    data-is-checked={ allChecked ? 'checked' : '' }
                    onClick={ toggleCheckAllItems }
                  />
                  <div style={{minWidth: "18px"}}>
                    #
                  </div>
                  <span className="bg-grey"></span>
                </label>
              </th>
              <th className="text-right">
                Line #
              </th>
              <th className="text-left">
                Item # / Description
              </th>
              <th className="text-right">
                Auth. <br/>
                Qty
              </th>
              <th className="text-right">
                Recv. <br/>
                Qty
              </th>
              <th className="text-right">
                Qty. <br/>
                Now
              </th>
              <th className="text-left">
                Condition <br/>
                Code
              </th>
              <th className="text-left">
                Auth. <br/>
                S/N
              </th>
              <th className="text-left">
                Recv. <br/>
                S/N
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  )
}

TableHead.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default TableHead