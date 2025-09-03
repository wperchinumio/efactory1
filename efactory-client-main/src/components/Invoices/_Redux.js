import openReducer from './Open/redux'
import { combineReducers } from 'redux'

const invoicesReducer = combineReducers({
	open: openReducer
})

export default invoicesReducer