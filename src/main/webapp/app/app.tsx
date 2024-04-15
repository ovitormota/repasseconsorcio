import 'app/config/dayjs'
import './app.scss'

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Close } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useAppDispatch } from 'app/config/store'
import AppRoutes from 'app/routes'
import ErrorBoundary from 'app/shared/error/error-boundary'
import { Header } from 'app/shared/layout/header/header'
import { getProfile } from 'app/shared/reducers/application-profile'
import { getSession } from 'app/shared/reducers/authentication'
import { onMessage } from 'firebase/messaging'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import { messaging } from './FirebaseConfig'
import { getEntities as getBids } from './entities/bid/bid.reducer'
import { getEntities as getMyProposals } from './modules/proposals/my-proposal.reducer'
import { getCountConsortiumsByProposalApprovals, getEntities as getProposalsForAproval } from './entities/proposals-for-approval/proposals-for-approval.reducer'
import { InstallPromptModal } from './shared/components/InstallPromptModal'
import { AppThemeProvider } from './shared/context/ThemeContext'
import { ConsortiumStatusType } from './shared/model/enumerations/consortium-status-type.model'
import { SegmentType } from './shared/model/enumerations/segment-type.model'
import { ITEMS_PER_PAGE } from './shared/util/pagination.constants'

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '')

export const App = () => {
  const dispatch = useAppDispatch()
  const [notificationUrl, setNotificationUrl] = useState<string>('')

  onMessage(messaging, ({ data }) => {
    if (data?.redirectUrl) {
      setNotificationUrl(data.redirectUrl)
    }

    toast(
      () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant='subtitle2' color='secondary' fontWeight={600}>
            {data?.title} 👏
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {data?.body}
          </Typography>
        </Box>
      ),
      {
        duration: 999999,
      }
    )
  })

  useEffect(() => {
    console.log('notificationUrl', notificationUrl)
    if (notificationUrl) {
      if (notificationUrl === '/my-proposals') {
        dispatch(
          getMyProposals({
            filterSegmentType: SegmentType.ALL,
            filterStatusType: ConsortiumStatusType.ALL,
            sort: 'id,desc',
            page: 0,
            size: ITEMS_PER_PAGE,
          })
        )
      } else if (notificationUrl === '/bid') {
        dispatch(
          getBids({
            sort: 'id,desc',
            page: 0,
            size: ITEMS_PER_PAGE,
          })
        )
      } else if (notificationUrl === '/proposal-approvals') {
        dispatch(getCountConsortiumsByProposalApprovals())
        dispatch(
          getProposalsForAproval({
            filterSegmentType: SegmentType.ALL,
            sort: 'id,desc',
            page: 0,
            size: ITEMS_PER_PAGE,
          })
        )
      }
    }
  }, [notificationUrl])

  useEffect(() => {
    dispatch(getSession())
    dispatch(getProfile())
  }, [])

  return (
    <Router basename={baseHref}>
      <AppThemeProvider>
        <Toaster gutter={2} position='top-center' toastOptions={{ duration: 10000, style: { flexWrap: 'nowrap', maxWidth: '400px' } }}>
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <IconButton>
                      <Close onClick={() => toast.dismiss(t.id)} fontSize='small' />
                    </IconButton>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
        <ErrorBoundary>
          <AppRoutes />
          <Header />
        </ErrorBoundary>
        <InstallPromptModal />
      </AppThemeProvider>
    </Router>
  )
}

export default App
