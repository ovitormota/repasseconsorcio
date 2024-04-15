import 'app/config/dayjs.ts'
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
import { getSession, requestPermission } from 'app/shared/reducers/authentication'
import { onMessage } from 'firebase/messaging'
import { isMobile } from 'react-device-detect'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
import { messaging } from './FirebaseConfig'
import { InstallPromptModal } from './shared/components/InstallPromptModal'
import { AppThemeProvider } from './shared/context/ThemeContext'

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '')

export const App = () => {
  const dispatch = useAppDispatch()
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  onMessage(messaging, (data) => {
    toast(
      () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant='subtitle2' color='secondary' fontWeight={600}>
            {data.notification.title} 👏
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {data.notification.body}
          </Typography>
        </Box>
      ),
      {
        duration: 999999,
      }
    )
  })

  useEffect(() => {
    requestPermission()
    dispatch(getSession())
    dispatch(getProfile())

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      const timeout = setTimeout(() => {
        if (isMobile) {
          setModalOpen(true)
        }
      }, 5000)

      return () => clearTimeout(timeout)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [isMobile])

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
        {<InstallPromptModal deferredPrompt={deferredPrompt} isOpen={modalOpen} onClose={() => setModalOpen(false)} />}
      </AppThemeProvider>
    </Router>
  )
}

export default App
