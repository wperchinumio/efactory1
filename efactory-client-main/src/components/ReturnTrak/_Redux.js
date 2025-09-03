import draftReducer 								from './Drafts/redux'
import entryReducer 								from './Entry/redux'
import inventoryItemsReducer 				from './Entry/Modals/BrowseItems/redux'
import mailTemplatesReducer 				from './Settings/TabContents/MailTemplates/redux'
import settingsReducer 							from './Settings/redux'

import { combineReducers } from 'redux'

const returnTrakReducer = combineReducers({
	draft : draftReducer,
	entry : entryReducer,
	inventory : inventoryItemsReducer,
  mailTemplates : mailTemplatesReducer,
  settings : settingsReducer
})


export default returnTrakReducer