import React from 'react'
import PropTypes from 'prop-types'
import TopHeader from './TopHeader'
import ShipTable from './ShipTable'
import BrowseItemsModal from '../BrowseItems/_Content'

const CartTable = ({ poRmaState, poRmaActions }) => {
  return (
    <div className="col-md-12">
      <div className="items">
        <TopHeader poRmaState={poRmaState} poRmaActions={poRmaActions} />
        <ShipTable poRmaState={poRmaState} poRmaActions={poRmaActions} />
      </div>
      <BrowseItemsModal poRmaState={poRmaState} poRmaActions={poRmaActions} />
    </div>
  )
}

CartTable.propTypes = {
  poRmaActions: PropTypes.object.isRequired,
  poRmaState: PropTypes.object.isRequired
}

export default CartTable