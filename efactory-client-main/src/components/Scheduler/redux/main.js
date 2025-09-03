import reportsReducer	 		    		from './reports';
import modalReducer	 		    			from './modal';
import { combineReducers } 					from 'redux';

const schedulerReducer = combineReducers({
  reports : reportsReducer,
  modal : modalReducer
});


export default schedulerReducer;
