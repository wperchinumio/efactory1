import { combineReducers }      		from 'redux'
import draftsReducer          			from './Drafts/redux'
import entryReducer          				from './OrderEntry/redux'
import settingsReducer          		from './Settings/redux'

const orderPointsReducer = combineReducers({
  drafts 		: draftsReducer,
  settings 	: settingsReducer,
  entry 		: entryReducer
});


export default orderPointsReducer;
