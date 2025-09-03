import { combineReducers } from 'redux'
import addressBookReducer from '../components/OrderPoints/AddressBook/redux'
import addEditAddressReducer from '../components/OrderPoints/AddEditAddress/redux'
import accountReducer from '../components/Services/Accounts/redux'
import analyticsReducer from '../components/Analytics/redux'
import announcementsReducer from '../components/Announcements/redux'
import authReducer from '../components/Login/redux'
import bundleReducer from '../components/Grid/Modals/Bundle/redux'
import commonReducer from '../components/Settings/redux/main'
import documentsReducer from '../components/Documents/redux/documents'
import ediReducer from '../components/Edi/redux'
import ediCustomizeReducer from '../components/Edi/CustomizeView/redux'
import gridReducer from '../components/Grid/redux'
import invoicesReducer from '../components/Invoices/_Redux'
import orderPointsReducer from '../components/OrderPoints/_redux'
import overviewReducer from '../components/Overview/redux'
import notesReducer from '../components/Notes/redux/notes'
import returnTrakReducer from '../components/ReturnTrak/_Redux'
import servicesReducer from '../components/Services/_Redux'
import schedulerReducer from '../components/Scheduler/redux/main'
import threePLReducer from '../components/ThreePLSettings/redux'
import shipNotificationReducer from '../components/Notification/ShipConfirmation/redux'


let reducersCombined = combineReducers({
  account     : accountReducer,
  addressBook : combineReducers({
    allAddresses: addressBookReducer,
    addEditAddress: addEditAddressReducer
  }),
  announcements:announcementsReducer,
  analytics   : analyticsReducer,
  auth        : authReducer,
  bundle      : bundleReducer, 
  common      : commonReducer,
  documents   : documentsReducer,
  edi         : ediReducer,
  ediCustomize: ediCustomizeReducer,
  grid        : gridReducer,
  invoices    : invoicesReducer,
  notes       : notesReducer,
  orderPoints : orderPointsReducer,
  overview    : overviewReducer,
  returnTrak  : returnTrakReducer,
  services    : servicesReducer,
  scheduler   : schedulerReducer,
  shipNotification : shipNotificationReducer,
  threePL     : threePLReducer
})

const rootReducer = (state, action) => {
  if ( [ 'LOGOUT_WITHOUT_DELETE_TOKEN', 'LOGOUT' ].includes( action.type ) ) {
    state = {} 
  }
  return reducersCombined(state, action)
}

export default rootReducer

