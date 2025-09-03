import documentRecordsReducer 		    from './documentRecords';
import { combineReducers }            from 'redux';

const documentReducer = combineReducers({
  documents : documentRecordsReducer
});


export default documentReducer;
