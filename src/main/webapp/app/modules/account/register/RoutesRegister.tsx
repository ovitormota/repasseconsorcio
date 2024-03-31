import React from 'react'

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route'
import { AccountRegisterUpdate } from './AccountRegisterUpdate'

export const RoutesRegister = ({ match }) => (
  <div>
    {console.log('match.url', match.url)}

    <ErrorBoundaryRoute path={`${match.url}/update/:login`} component={AccountRegisterUpdate} />
  </div>
)
