import React from 'react'
import PropTypes from 'prop-types'
import TopHeader from './TopHeader'
import ShipTable from './ShipTable'


const CartTable = ({ poReceiptState, poReceiptActions }) => {
  return (
    <div className="col-md-12">
      <div className="items">          
        <TopHeader 
          poReceiptState={poReceiptState}
          poReceiptActions={poReceiptActions}
        />
        <ShipTable 
          poReceiptState={poReceiptState}
          poReceiptActions={poReceiptActions}
        />
      </div>
    </div>
  )
}

CartTable.propTypes = {
  poReceiptState: PropTypes.object.isRequired,
  poReceiptActions: PropTypes.object.isRequired
}

export default CartTable