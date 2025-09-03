import React from 'react'
import PropTypes from 'prop-types'

const TableFooter = props => {
  function removeSelectedLines (event) {
    let { poRmaState, poRmaActions } = props
    let { checked_cart_items, po_cart_items } = poRmaState
    po_cart_items = [ ...po_cart_items ]
    let form_dirty = false
    checked_cart_items.forEach( item => {
      let index_to_delete = po_cart_items.findIndex( 
        ({ ts, voided }) => !voided && +ts === +item           
      )
      if (index_to_delete === -1) console.warn('checked_cart_items record did not match any item in po_cart_items array')
      if (po_cart_items[ index_to_delete ]['e1_line_number']) {
        form_dirty = true
        po_cart_items[ index_to_delete ] = {
          ...po_cart_items[ index_to_delete ],
          voided : true
        }
      } else {
        po_cart_items.splice( index_to_delete, 1 )
      }
    })
    
    poRmaActions.setRootReduxStateProp_multiple({
      po_cart_items,
      checked_cart_items : [],
      form_dirty
    })
  }

  let { checked_cart_items } = props.poRmaState
  return (
    <div className="op-cart-footer">
      <table>
        <tbody>
        <tr>
          <td style={{width: "100%", verticalAlign: "top"}}>
            <button
              className="btn red-soft btn-xs"
              onClick={ removeSelectedLines }
              disabled={ checked_cart_items.length === 0 }
            >
              Remove selected items
            </button>
          </td>
          <td style={{minWidth: "180px"}} className="small" />
        </tr>
        </tbody>
      </table>
    </div>
  )
}

TableFooter.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default TableFooter