import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { Translate } from 'react-jhipster'
import { useAppSelector } from 'app/config/store'
import ErrorBoundary from 'app/shared/error/error-boundary'

interface IOwnProps extends RouteProps {
  hasAnyAuthorities?: string[]
}

export const PrivateRouteComponent = ({ component: Component, hasAnyAuthorities = [], ...rest }: IOwnProps) => {
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const sessionHasBeenFetched = useAppSelector((state) => state.authentication.sessionHasBeenFetched)
  const account = useAppSelector((state) => state.authentication.account)
  const isAuthorized = hasAnyAuthority(account.authorities, hasAnyAuthorities)

  const checkAuthorities = (props) =>
    isAuthorized ? (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    ) : (
      <div className='insufficient-authority'>
        <div className='alert alert-danger'>
          <Translate contentKey='error.http.403'>You are not authorized to access this page.</Translate>
        </div>
      </div>
    )

  const renderRedirect = (props) => {
    if (!sessionHasBeenFetched) {
      return <div></div>
    } else {
      return isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <Redirect
          to={{
            pathname: '/',
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      )
    }
  }

  if (!Component) throw new Error(`A component needs to be specified for private route for path ${(rest as any).path}`)

  return <Route {...rest} render={renderRedirect} />
}

export const hasAnyAuthority = (authorities: string[], hasAnyAuthorities: string[]) => {
  if (authorities && authorities.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true
    }
    return hasAnyAuthorities.some((auth) => authorities.includes(auth))
  }
  return false
}

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export default PrivateRouteComponent
