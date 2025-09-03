import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TopHeader from './TopHeader'
import ShipTable from './ShipTable'
import BrowseItemsModal from '../../../Modals/BrowseItems/_Content'
import * as rmaEntryActions from '../../../redux'
import * as inventoryActions from '../../../Modals/BrowseItems/redux'

const CartTable = props => {
  let { rmaEntryActions, inventoryActions } = props
  return (
    <div className="col-md-12">
      <div className="items">
        <TopHeader 
          rmaEntryActions={ rmaEntryActions }
          inventoryActions={ inventoryActions }
        />
        <ShipTable 
          rmaEntryActions={ rmaEntryActions }
          inventoryActions={ inventoryActions }
        />
      </div>
      <BrowseItemsModal />
    </div>
  )
}

CartTable.propTypes = {
  rmaEntryActions: PropTypes.object.isRequired,
  inventoryActions: PropTypes.object.isRequired
}

export default connect(
  state => ({ }),
  dispatch => ({
    rmaEntryActions : bindActionCreators( rmaEntryActions, dispatch ),
    inventoryActions : bindActionCreators( inventoryActions, dispatch )
  })
)(CartTable)