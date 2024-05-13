import React from 'react'
import { Redirect, Switch } from 'react-router-dom'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'

import ConsortiumAdministrator from './consortium-administrator'
import Bid from './bid'
import Consortium from './consortium'
import { AUTHORITIES } from 'app/config/constants'
import PrivateRoute from 'app/shared/auth/private-route'
import { ProposalsForApproval } from 'app/entities/proposals-for-approval/ProposalsForApproval'
import { MyProposals } from 'app/modules/proposals/MyProposals'
import { UserManagement } from 'app/modules/administration/user-management/user-management'
import { RoutesRegister } from 'app/modules/account/register/RoutesRegister'
import NotificationToken from './notification-token/notification-token'
import ConsortiumDetail from './consortium/consortium-detail'
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <PrivateRoute path={`${match.url}usuarios`} component={UserManagement} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute path={`${match.url}administradoras`} component={ConsortiumAdministrator} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <ErrorBoundaryRoute path={`${match.url}meus-lances`} component={Bid} />
      <PrivateRoute path={`${match.url}aprovacoes`} component={ProposalsForApproval} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute path={`${match.url}minhas-propostas`} component={MyProposals} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <PrivateRoute path={`${match.url}register`} component={RoutesRegister} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <ErrorBoundaryRoute path={`${match.url}notification-token`} component={NotificationToken} />
      <ErrorBoundaryRoute exact path={`${match.url}consorcio/:id`} component={ConsortiumDetail} />
      <ErrorBoundaryRoute path={'/'} exact component={Consortium} />
      <Redirect path='*' to='/' />

      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
)

export default Routes
