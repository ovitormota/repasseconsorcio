import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, ThemeProvider, Typography } from '@mui/material/'
import React from 'react'
import { Translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { IConsortium } from '../model/consortium.model'

interface IModalUseTerms {
  isOpen: boolean
  title?: string
  setOpen: (isOpen: boolean) => void
  acceptTerms: boolean
  entityConsortium?: IConsortium
  setAcceptTerms: React.Dispatch<React.SetStateAction<boolean>>
}

export const BidModalUseTerms = ({ setOpen, setAcceptTerms }: IModalUseTerms) => {
  const [checked, setChecked] = React.useState<boolean>(false)
  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{ sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } } }}
      >
        <DialogTitle width='100%' color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Translate contentKey='termsOfUse'>Termos de uso</Translate>

          <IconButton onClick={() => setOpen(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 4 }}></DialogContentText>
          <Box>
            <Typography sx={{ color: defaultTheme.palette.text.primary }}>
              <DialogContentText textAlign='start' mb={2}>
                Ao dar o lance, você concorda com os seguintes termos:
              </DialogContentText>
              <ul style={{ fontSize: '15px' }} className='modal-user-terms'>
                <li style={{ marginBottom: '5px' }}>O valor do lance é inalterável e representa um compromisso de compra.</li>
                <li style={{ marginBottom: '5px' }}>Certifique-se de que tem os recursos necessários para honrar o lance.</li>
                <li style={{ marginBottom: '5px' }}>Os lances não podem ser cancelados ou retirados após a confirmação.</li>
              </ul>
            </Typography>
            <Typography sx={{ mb: 2, color: defaultTheme.palette.secondary.main }} fontSize='13px' fontWeight={600}>
              Obs: A taxa de administração para realizar a transferência da cota já está inclusa no valor do lance.
            </Typography>
          </Box>
          <Box sx={{ textAlign: { sm: 'center' } }}>
            <FormControlLabel
              label={<Typography fontSize='15px'>Aceito as condições de participação</Typography>}
              control={<Checkbox checked={checked} onClick={() => setChecked((prevChecked: boolean) => !prevChecked)} color='secondary' />}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
            <Translate contentKey='entity.action.back'>Voltar</Translate>
          </Button>
          <Button variant='contained' color='secondary' disabled={!checked} onClick={() => setAcceptTerms(true)} sx={{ fontSize: '12px' }}>
            <Translate contentKey='entity.action.confirm'>Confirmar</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}
