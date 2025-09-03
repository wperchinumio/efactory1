import React from 'react'
import PropTypes from 'prop-types'
import TableHead from './ShipTableHead'
import TableFooter from './ShipTableFooter'
import TableBody from './ShipTableBody'

const ShipTable = props => {
  let { rmaEntryActions, inventoryActions } = props
  return (
    <div>
      <div className="whole-table">
        <TableHead 
          rmaEntryActions={ rmaEntryActions }
        />
        <TableBody 
          rmaEntryActions={ rmaEntryActions }
          inventoryActions={ inventoryActions }
        />
        <TableFooter 
          rmaEntryActions={ rmaEntryActions }
        />
      </div>
    </div>
  )
}

ShipTable.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired,
  inventoryActions: PropTypes.object.isRequired
}

export default ShipTable