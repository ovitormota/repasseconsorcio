import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, IconButton, ThemeProvider, Typography } from '@mui/material/'
import React from 'react'
import { Translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { formatCurrency } from '../util/data-utils'

interface IModalUseTerms {
  isOpen: boolean
  title?: string
  setOpen: (isOpen: boolean) => void
  acceptTerms: boolean
  adminstrationFee: number
  setAcceptTerms: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalUseTerms = ({ setOpen, setAcceptTerms, adminstrationFee }: IModalUseTerms) => {
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
            <Box>
              <Typography sx={{ color: defaultTheme.palette.text.primary }}>
                <DialogContentText textAlign='start' mb={2}>
                  Ao criar a proposta e enviar para leilão, você concorda com os seguintes termos de uso:
                </DialogContentText>
                <ul style={{ fontSize: '15px' }} className='modal-user-terms'>
                  <li style={{ marginBottom: '5px', marginLeft: 0 }}>As informações fornecidas são verdadeiras e precisas.</li>
                  <li style={{ marginBottom: '5px' }}>Você se responsabiliza integralmente por qualquer informação incorreta ou imprecisa fornecida.</li>
                  <li style={{ marginBottom: '5px' }}>Você está ciente de que o fornecimento de dados falsos pode resultar em medidas legais.</li>
                </ul>
              </Typography>
              <Typography sx={{ my: 2, color: defaultTheme.palette.secondary.main }} fontSize='13px' fontWeight={600}>
                {adminstrationFee > 0 && `Observação: A taxa de administração para realizar a transferência desta cota é de 5% sobre o lance vencedor.`}
              </Typography>
            </Box>
            <Box sx={{ textAlign: { sm: 'center' } }}>
              <FormControlLabel
                label={<Typography fontSize='15px'>Aceito as condições de participação</Typography>}
                control={<Checkbox checked={checked} onClick={() => setChecked((prevChecked: boolean) => !prevChecked)} color='secondary' />}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }}>
            <Translate contentKey='entity.action.back'>Voltar</Translate>
          </Button>
          <Button variant='contained' color='secondary' disabled={!checked} onClick={() => setAcceptTerms(true)}>
            <Translate contentKey='entity.action.save'>Salvar</Translate>
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}
