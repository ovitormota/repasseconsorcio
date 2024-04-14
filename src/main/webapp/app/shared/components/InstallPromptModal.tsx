import { Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
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
        sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { xs: 0, sm: 1 }, minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
      }}
      onClose={onClose}
    >
      <DialogTitle align='center'>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
          <img src='content/images/512x512.png' alt='Ícone do Aplicativo' style={{ width: '60px' }} />
          <Typography sx={{ color: defaultTheme.palette.secondary.main, fontSize: '16px', fontWeight: '600', textAlign: 'center' }}>
            Deseja adicionar o aplicativo Repasse Consórcio à tela inicial?
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 1, p: 0 }}>
        <DialogContentText sx={{ color: defaultTheme.palette.text.secondary, textAlign: 'center', m: 2 }}>
          Acesse de forma mais rápida, com menos cliques e receba notificações importantes.
        </DialogContentText>

        <DialogActions sx={{ px: 2, gap: 2, justifyContent: 'center', flexDirection: 'column' }}>
          <Button variant='contained' onClick={handleInstallClick} color='secondary' fullWidth>
            Adicionar
          </Button>
          <Button sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }} onClick={onClose} fullWidth>
            Agora não
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
