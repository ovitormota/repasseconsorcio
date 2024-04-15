import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { defaultTheme } from '../layout/themes'

export const InstallPromptModal = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
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

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted installation')
        } else {
          console.log('User declined installation')
        }
        setModalOpen(false)
      })
    }
  }

  return (
    <Dialog
      open={modalOpen}
      sx={{ backgroundColor: defaultTheme.palette.background.default }}
      PaperProps={{
        sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { xs: 0, sm: 1 }, minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
      }}
      onClose={() => setModalOpen(false)}
    >
      <DialogTitle align='center'>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
          <img src='content/images/192x192.png' alt='Ícone do Aplicativo' style={{ width: '60px' }} />
          <Typography sx={{ color: defaultTheme.palette.secondary.main, fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>Deseja instalar o aplicativo Repasse Consórcio?</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 1, p: 0 }}>
        <DialogContentText sx={{ color: defaultTheme.palette.text.secondary, textAlign: 'center', my: 3, mx: 4 }}>
          Acesse com mais facilidade e receba notificações sobre suas propostas e lances.
        </DialogContentText>

        <DialogActions sx={{ px: 2, gap: 2, justifyContent: 'center', flexDirection: 'column' }}>
          <Button variant='contained' onClick={handleInstallClick} color='secondary' fullWidth>
            Instalar
          </Button>
          <Button sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px', ml: '0 !important' }} onClick={() => setModalOpen(false)} fullWidth>
            Agora não
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
