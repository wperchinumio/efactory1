import { combineReducers } 				from 'redux'

import freightEstimatorReducer 		from './FreightEstimator/redux'
import poNotificationReducer	 		from './PoNotifications/redux'
import poReceiptReducer	 					from './PoReceipt/redux'
import poRmaReducer	 							from './PoRma/redux'
import inventoryItemsReducer    	from './PoRma/Cart/BrowseItems/redux'
import ftpBatchActivityReducer 		from './FtpBatchActivity/redux'

const utilitiesReducer = combineReducers({
	freightEstimator 	: freightEstimatorReducer,
	ftpBatchActivity 	: ftpBatchActivityReducer,
	po 				 				: poNotificationReducer,
	poReceipt 		 		: poReceiptReducer,
	poRma 			 			: poRmaReducer,
	inventory 	     	: inventoryItemsReducer
})


export default utilitiesReducer