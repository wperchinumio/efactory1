import React from 'react'
import PropTypes from 'prop-types'
import TableHead from './ShipTableHead'
import TableFooter from './ShipTableFooter'
import TableBody from './ShipTableBody'

const ShipTable = ({ poRmaState, poRmaActions }) => {
  return (
    <div>
      <div className="whole-table">
        <TableHead 
          poRmaState={poRmaState}
          poRmaActions={poRmaActions}
        />
        <TableBody 
          poRmaState={poRmaState}
          poRmaActions={poRmaActions}
        />
        <TableFooter 
          poRmaState={poRmaState}
          poRmaActions={poRmaActions}
        />
      </div>
    </div>
  )
}

ShipTable.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default ShipTable