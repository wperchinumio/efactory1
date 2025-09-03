import settingsReducer 			from './settings'
import globalApiReducer     from './global'

import { combineReducers } from 'redux';

const mainReducer = combineReducers({
  settings : settingsReducer,
  globalApi : globalApiReducer
});


export default mainReducer;
