import React from 'react'
import PropTypes from 'prop-types'
import TopHeader from './TopHeader'
import ShipTable from './ShipTable'
import BrowseItemsModal from '../BrowseItems/_Content'

const CartTable = props => {
  let { po, poActions } = props
  return (
    <div className="col-md-12">
      <div className="items">
        <TopHeader po={po} poActions={poActions} />
        <ShipTable po={po} poActions={poActions} />
      </div>
      <BrowseItemsModal po={po} poActions={poActions} />
    </div>
  )
}

CartTable.propTypes = {
  poActions: PropTypes.object.isRequired,
  po: PropTypes.object.isRequired
}

export default CartTable