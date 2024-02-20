import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ConsortiumAdministrator from './consortium-administrator';
import ConsortiumAdministratorDetail from './consortium-administrator-detail';
import { ConsortiumAdministratorUpdateModal } from './ConsortiumAdministratorUpdateModal';
import ConsortiumAdministratorDeleteDialog from './consortium-administrator-delete-dialog';

const Routes = ({ match }) => (
    <>
        <Switch>
            <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ConsortiumAdministratorUpdateModal} />
            <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ConsortiumAdministratorUpdateModal} />
            <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ConsortiumAdministratorDetail} />
            <ErrorBoundaryRoute path={match.url} component={ConsortiumAdministrator} />
        </Switch>
        <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ConsortiumAdministratorDeleteDialog} />
    </>
);

export default Routes;
