import React from 'react'
import { Route, Switch } from 'react-router-dom'
import FtpFolders from '../components/Documents/_ContentFtpFolders'
import Items from '../components/Documents/_ContentItems'
import Main from '../components/Documents/_Content'
import Orderpoints from '../components/Documents/_ContentOrderpoints'
import Orders from '../components/Documents/_ContentOrders'
import Returntrak from '../components/Documents/_ContentReturntrak'
import SpecialDocs from '../components/Documents/_ContentSpecialDocs'

export default function DocumentsRoutes () {
  return <Switch>
    <Route
      exact
      path="/documents*"
      component={Main}
    />
    <Route
      exact
      path="/special-docs/*"
      component={SpecialDocs}
    />
    <Route
      exact
      path="/ftp-folders/*"
      component={FtpFolders}
    />
    <Route
      exact
      path="/orders/documents*"
      component={Orders}
    />
    <Route
      exact
      path="/inventory/documents*"
      component={Items}
    />
    <Route 
      exact
      path="/orderpoints/documents/*"
      component={Orderpoints}
    />
    <Route 
      exact
      path="/returntrak/documents/*"
      component={Returntrak}
    />
    <Route
      exact
      path={[
        '/orderpoints/documents/ftp-folders-get',
        '/orderpoints/documents/ftp-folders-send'
      ]}
      component={FtpFolders} 
    />
  </Switch>
}