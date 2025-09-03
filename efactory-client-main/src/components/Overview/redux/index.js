import fulfillmentsReducer 			from './fulfillments'
import inventoryReducer 		    from './overviewInventory'
import latest50OrdersReducer 		from './overviewLatest50Orders'
import sidebarReducer 					from './sidebar'
import customizeOverviewReducer from './customizeOverview'

import { combineReducers } from 'redux'

const overviewReducer = combineReducers({
  inventory : inventoryReducer,
  fulfillment : fulfillmentsReducer,
  latest50Orders : latest50OrdersReducer,
  sidebar : sidebarReducer,
  customizeOverview : customizeOverviewReducer
})


export default overviewReducer
