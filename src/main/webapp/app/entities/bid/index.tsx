import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Bid from './bid';
import BidDetail from './bid-detail';
import BidUpdate from './bid-update';
import BidDeleteDialog from './bid-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={BidUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={BidUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={BidDetail} />
      <ErrorBoundaryRoute path={match.url} component={Bid} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={BidDeleteDialog} />
  </>
);

export default Routes;
