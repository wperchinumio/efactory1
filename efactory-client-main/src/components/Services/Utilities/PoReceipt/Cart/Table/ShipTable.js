import React from 'react'
import PropTypes from 'prop-types'
import TableHead from './ShipTableHead'
import TableBody from './ShipTableBody'

const ShipTable = ({ poReceiptState, poReceiptActions }) => {
  return (
    <div>
      <div className="whole-table">
        <TableHead 
          poReceiptState={poReceiptState}
          poReceiptActions={poReceiptActions}
        />
        <TableBody 
          poReceiptState={poReceiptState}
          poReceiptActions={poReceiptActions}
        />
      </div>
    </div>
  )
}

ShipTable.propTypes = {
  poReceiptState: PropTypes.object.isRequired,
  poReceiptActions: PropTypes.object.isRequired
}

export default ShipTable