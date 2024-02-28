import 'app/config/dayjs.ts'
import './app.scss'

import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import AppRoutes from 'app/routes'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import ErrorBoundary from 'app/shared/error/error-boundary'
import { Header } from 'app/shared/layout/header/header'
import { getProfile } from 'app/shared/reducers/application-profile'
import { getSession } from 'app/shared/reducers/authentication'
import { Toaster } from 'react-hot-toast'

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '')

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getSession())
    dispatch(getProfile())
  }, [])

  const currentLocale = useAppSelector((state) => state.locale.currentLocale)
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const ribbonEnv = useAppSelector((state) => state.applicationProfile.ribbonEnv)
  const isInProduction = useAppSelector((state) => state.applicationProfile.inProduction)
  const isOpenAPIEnabled = useAppSelector((state) => state.applicationProfile.isOpenAPIEnabled)

  return (
    <Router basename={baseHref}>
      <Toaster gutter={2} />
      <ErrorBoundary>
        <AppRoutes />
        <Header />
      </ErrorBoundary>
    </Router>
  )
}

export default App
