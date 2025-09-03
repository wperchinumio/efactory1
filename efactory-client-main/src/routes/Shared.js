import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import HelpSections from '../components/HelpSections/_Content'
import ManageFilters from '../components/Grid/ManageFilters/_Content'
import NoAppsContent from '../components/NoApps/_Content'
import SettingsContent from '../components/Settings/_Content'
import TeamMembers from '../components/Services/TeamMembers/_Content'

export default function SharedRoutes () {
  return <Switch>
    <Route
      exact
      path="*/view/:id"
      component={SettingsContent}
    />
    <Route
      exact
      path="*/manage-filters" 
      component={ManageFilters}
    />
    <Route
      exact
      path='*/help/:page_number'
      component={HelpSections}
    />
    <Route 
      exact
      path="/team-members" 
      component={TeamMembers}
    />
    <Route 
      exact
      path='/no-apps'
      component={NoAppsContent}
    />
    <Route
      exact
      path="/login"
      component={() => <Redirect to="/overview" />}
    />
  </Switch>
}