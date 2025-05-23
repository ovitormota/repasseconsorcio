import { CloseOutlined } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'
import { toast } from 'react-hot-toast'
import { defaultTheme } from 'app/shared/layout/themes'
import { handlePasswordResetInit, reset } from '../account/password-reset/password-reset.reducer'

export const RequestPassword = ({ setOpenRequestModal }) => {
  const successMessage = useAppSelector((state) => state.passwordReset.successMessage)

  const dispatch = useAppDispatch()

  const [email, setEmail] = useState('')

  const isEmailValid = () => {
    if (email.trim() === '') {
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleClose = () => {
    setOpenRequestModal(false)
  }

  const handleValidSubmit = (event) => {
    event.preventDefault()
    dispatch(handlePasswordResetInit(email))
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(translate(successMessage))
      dispatch(reset())
      handleClose()
    }
  }, [successMessage])

  return (
    <React.Fragment>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{ sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } } }}
      >
        <DialogTitle width='100%' color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Translate contentKey='reset.request.title'>Reset your password</Translate>
          <IconButton onClick={() => setOpenRequestModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 4 }}>
            <Translate contentKey='reset.request.messages.info'>Enter the email address you used to register</Translate>
          </DialogContentText>
          <TextField
            autoFocus
            required
            id='email'
            name='email'
            label={translate('global.form.email.placeholder')}
            type='email'
            fullWidth
            color='secondary'
            value={email}
            error={!isEmailValid()}
            helperText={!isEmailValid() && 'Seu e-mail é inválido'}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 4 }}
            InputProps={{
              style: { borderRadius: '10px' },
            }}
          />
        </DialogContent>
        <form onSubmit={isEmailValid() ? handleValidSubmit : null}>
          <DialogActions>
            <Button onClick={() => handleClose()} sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }}>
              <Translate contentKey='entity.action.cancel'>Cancel</Translate>
            </Button>
            <Button type='submit' variant='contained' color='secondary' disabled={!isEmailValid() || email.trim() === ''} sx={{ fontWeight: '600', color: defaultTheme.palette.background.paper }}>
              <Translate contentKey='reset.request.form.button'>Reset password</Translate>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}
