import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ConsortiumAdministrator from './consortium-administrator';
import Bid from './bid';
import Consortium from './consortium';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}consortium-administrator`} component={ConsortiumAdministrator} />
      <ErrorBoundaryRoute path={`${match.url}bid`} component={Bid} />
      <ErrorBoundaryRoute path={`${match.url}consortium`} component={Consortium} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
