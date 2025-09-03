import React from 'react'
import PropTypes from 'prop-types'
import TableHead from './ShipTableHead'
import TableFooter from './ShipTableFooter'
import TableBody from './ShipTableBody'

const ShipTable = props => {
  let { po, poActions } = props
  return (
    <div>
      <div className="whole-table">
        <TableHead po={po} poActions={poActions} />
        <TableBody po={po} poActions={poActions} />
        <TableFooter po={po} poActions={poActions} />
      </div>
    </div>
  )
}

ShipTable.propTypes = {
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default ShipTable