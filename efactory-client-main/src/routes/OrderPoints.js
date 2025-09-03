import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AddressBook from '../components/OrderPoints/AddressBook'
import AddAddress from '../components/OrderPoints/AddEditAddress/Add'
import DraftsContent from '../components/OrderPoints/Drafts/_Content'
import EditAddress from '../components/OrderPoints/AddEditAddress/Edit'
import FreightEstimator from '../components/Services/Utilities/FreightEstimator/_Content'
import FtpBatchActivity from '../components/Services/Utilities/FtpBatchActivity'
import MassUploadContent from '../components/OrderPoints/MassUpload/_Content'
import NewOrder from '../components/OrderPoints/OrderEntry/_Content_new_order'
import SettingsContent from '../components/OrderPoints/Settings/_Content'

export default function OrdersRoutes () {
  return <Switch>
    <Route 
      exact
      path={[
        "/orderpoints/new-order",
        "/orderpoints"
      ]}
      component={NewOrder} 
    />
    <Route 
      exact
      path="/orderpoints/drafts"
      component={DraftsContent} 
    />
    <Route 
      exact
      path="/orderpoints/settings"
      component={SettingsContent} 
    />
    <Route 
      exact
      path="/orderpoints/addressbook"
      component={AddressBook} 
    />
    <Route 
      exact
      path='/orderpoints/addressbook/add'
      component={AddAddress} 
    />
    <Route 
      exact
      path='/orderpoints/addressbook/edit'
      component={EditAddress} 
    />
    <Route 
      exact
      path="/orderpoints/massupload"
      component={MassUploadContent} 
    />
    <Route 
      exact
      path="/orderpoints/shippingcost"
      component={FreightEstimator} 
    />
    <Route 
      exact
      path="/orderpoints/ftp-batches"
      component={FtpBatchActivity} 
    />
  </Switch>
}