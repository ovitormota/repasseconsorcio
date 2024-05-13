import React from 'react'
import { Switch } from 'react-router-dom'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import ConsortiumInstallments from './consortium-installments'
import ConsortiumInstallmentsDetail from './consortium-installments-detail'
import ConsortiumInstallmentsUpdate from './consortium-installments-update'
import ConsortiumInstallmentsDeleteDialog from './consortium-installments-delete-dialog'

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ConsortiumInstallmentsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ConsortiumInstallmentsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ConsortiumInstallmentsDetail} />
      <ErrorBoundaryRoute path={match.url} component={ConsortiumInstallments} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ConsortiumInstallmentsDeleteDialog} />
  </>
)

export default Routes
