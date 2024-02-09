import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Consortium from './consortium';
import ConsortiumDetail from './consortium-detail';
import ConsortiumUpdate from './consortium-update';
import ConsortiumDeleteDialog from './consortium-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ConsortiumUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ConsortiumUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ConsortiumDetail} />
      <ErrorBoundaryRoute path={match.url} component={Consortium} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ConsortiumDeleteDialog} />
  </>
);

export default Routes;
