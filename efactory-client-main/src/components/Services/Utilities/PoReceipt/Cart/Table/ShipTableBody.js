import React from 'react'
import PropTypes from 'prop-types'

const TableBody = props => {
  function onFieldChange (event) {
    let { name, value } = event.target
    value = value.trim()
    if( name === 'qty' && isNaN( value ) ) return 
    let index = event.target.getAttribute('data-line-index')
    index = +index
    let { poReceiptActions, poReceiptState } = props
    let { lines } = poReceiptState
    poReceiptActions.setRootReduxStateProp_multiple({
      lines: [
        ...lines.slice( 0, index ),
        { ...lines[ index ], [name]: value },
        ...lines.slice( index + 1 )
      ]
    })
  }

  let { rows, lines } = props.poReceiptState
  return (
    <div 
      className="op-cart-table po-receipt-cart" 
      style={{
        overflowY: "scroll"
      }}
    >
      <div className="table-responsive" style={{padding: 0}}>
        <table className="table table-striped table-hover table-bordered table-clickable">
          <colgroup>
            <col style={{width: "40px"}}/>
            <col style={{width: "200px"}}/>
            <col style={{width: "70px"}}/>
            <col style={{width: "70px"}}/>
            <col style={{width: "120px"}}/>
            <col style={{width: "100px"}}/>
            <col style={{width: "100px"}}/>
            <col style={{width: "100px"}}/>
          </colgroup>
          <tbody>
            {
              rows.map( ( row, index ) => {
                let {
                  row_id,
                  line_number,
                  item_number,
                  inv_type,
                  lot_required,
                  open_qty
                } = row

                let {
                  container_id,
                  qty,
                  lot_number,
                  loc_number
                } = lines[ index ]

                return (
                  <tr key={ `line-${row_id}` }>
                    <td className="padding-10">
                      <span className="sbold">{ line_number }</span>
                    </td>
                    <td className="padding-10">
                      <span className="sbold">{ item_number }</span>
                    </td>
                    <td className="padding-10">
                      <span className="sbold">{ open_qty }</span>
                    </td>
                    <td className="padding-10">
                      <input 
                        type="text"
                        name="qty"
                        value={ qty }
                        data-line-index={ index }
                        onChange={ onFieldChange }
                        className="form-control input-sm"
                        placeholder="Recv. Qty"
                      />
                    </td>
                    <td className="padding-10">
                      <input 
                        type="text"
                        name="lot_number"
                        value={ lot_number }
                        data-line-index={ index }
                        onChange={ onFieldChange }
                        disabled={ !lot_required }
                        className="form-control input-sm"
                        placeholder="Lot #"
                      />
                    </td>
                    <td className="padding-10">
                      <input 
                        type="text"
                        name="container_id"
                        value={ container_id }
                        data-line-index={ index }
                        onChange={ onFieldChange }
                        className="form-control input-sm uppercase"
                        placeholder="Container (B*/P*)"
                      />
                    </td>
                    <td className="padding-10">
                      <span className="sbold">{ inv_type }</span>
                    </td>
                    <td className="padding-10">
                      <span className="sbold">{ loc_number }</span>
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
  poReceiptState: PropTypes.object.isRequired,
  poReceiptActions: PropTypes.object.isRequired
}

export default TableBody