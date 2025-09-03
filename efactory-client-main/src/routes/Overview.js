import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AnnouncementsContent from '../components/Announcements'
import OverviewContent from '../components/Overview/_Content'
import OverviewCustomizeView from '../components/Overview/CustomizeView/_Content'

export default function OverviewRoutes () {
  return <Switch>
    <Route
      exact
      path={
        [
          '/overview',
          '/overview?orderNum=:id',
          '/overview?itemNum=:id',
          '/overview/notes',
        ]
      } 
      render={
        props => <OverviewContent 
          config={{ 
            animation_on_next_query : false
          }}
        />
      }
    />
 
    <Route
      exact
      path="/overview/customize-view"
      render={
        props => <OverviewCustomizeView 
          config={{ 
            animation_on_next_query : false
          }}
        />
      }
    />

    <Route
      exact
      path="/announcements"
      component={AnnouncementsContent}
    />
  </Switch>
}