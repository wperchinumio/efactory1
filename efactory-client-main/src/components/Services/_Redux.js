import { combineReducers } 			from 'redux'
import utilitiesReducer 				from './Utilities/_Redux'

const servicesReducer = combineReducers({
	utilities : utilitiesReducer
})


export default servicesReducer