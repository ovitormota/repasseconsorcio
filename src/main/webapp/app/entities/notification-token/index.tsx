import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import NotificationToken from './notification-token'
import NotificationTokenDetail from './notification-token-detail'
import NotificationTokenUpdate from './notification-token-update'
import NotificationTokenDeleteDialog from './notification-token-delete-dialog'

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={NotificationTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={NotificationTokenUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={NotificationTokenDetail} />
      <ErrorBoundaryRoute path={match.url} component={NotificationToken} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={NotificationTokenDeleteDialog} />
  </>
)

export default Routes
