import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Button from '@mui/material/Button'
import React from 'react'
import { defaultTheme } from '../layout/themes'

interface InstallPromptModalProps {
  deferredPrompt: any // Correct type for deferredPrompt
  isOpen: boolean
  onClose: () => void
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({ deferredPrompt, isOpen, onClose }) => {
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted installation')
        } else {
          console.log('User declined installation')
        }
        onClose()
      })
    }
  }

  return (
    <Dialog
      open={isOpen}
      sx={{ backgroundColor: defaultTheme.palette.background.default }}
      PaperProps={{
        sx: { borderRadius: '10px', background: defaultTheme.palette.primary.main, p: { xs: 0, sm: 1 }, minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
      }}
      onClose={onClose}
    >
      <DialogTitle align='center'>
        <DialogContentText sx={{ color: defaultTheme.palette.secondary.main, fontSize: '18px', fontWeight: '600', textAlign: 'center', mt: 2 }}>
          Que tal adicionar nosso aplicativo à sua tela inicial?
        </DialogContentText>
      </DialogTitle>
      <DialogContent sx={{ px: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, mt: 2 }}>
          <img src='content/images/logo-repasse-consorcio.png' alt='Ícone do Aplicativo' style={{ width: '100px' }} />
        </Box>

        <DialogActions sx={{ px: 2, justifyContent: 'center' }}>
          <Button sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }} onClick={onClose} fullWidth>
            Cancelar
          </Button>
          <Button variant='contained' onClick={handleInstallClick} color='secondary' fullWidth>
            Adicionar
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
