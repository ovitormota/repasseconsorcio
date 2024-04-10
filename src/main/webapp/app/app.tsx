import 'app/config/dayjs.ts'
import './app.scss'

import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Close } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useAppDispatch } from 'app/config/store'
import AppRoutes from 'app/routes'
import ErrorBoundary from 'app/shared/error/error-boundary'
import { Header } from 'app/shared/layout/header/header'
import { getProfile } from 'app/shared/reducers/application-profile'
import { getSession, requestPermission } from 'app/shared/reducers/authentication'
// import { onMessage } from 'firebase/messaging'
import { isMobile } from 'react-device-detect'
import toast, { ToastBar, Toaster } from 'react-hot-toast'
// import { messaging } from './FirebaseConfig'
import { useCustomToast } from './shared/components/CustomToast'
import { InstallPromptModal } from './shared/components/InstallPromptModal'
import { AppThemeProvider } from './shared/context/ThemeContext'

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '')

export const App = () => {
  const dispatch = useAppDispatch()
  const { CustomToastComponent, showToast } = useCustomToast()

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  // onMessage(messaging, (data) => {
  //   showToast(data.notification.title, data.notification.body)
  // })

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
      }, 15000)

      return () => clearTimeout(timeout)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [isMobile])

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
        <CustomToastComponent />
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
