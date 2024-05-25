import React, { useEffect, useState } from 'react'
import { translate } from 'react-jhipster'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from '@mui/material'

import { CloseOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { ImageUploader } from 'app/shared/components/ImageUploader'
import { defaultTheme } from 'app/shared/layout/themes'
import { login } from 'app/shared/reducers/authentication'
import { toast } from 'react-hot-toast'
import { handleRegister, reset } from './register.reducer'

export const AccountRegister = ({ setOpenAccountRegisterModal }) => {
  const dispatch = useAppDispatch()
  const [fields, setFields] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [image, setImage] = useState(null)
  const registrationSuccess = useAppSelector((state) => state.register.registrationSuccess)
  const successMessage = useAppSelector((state) => state.register.successMessage)

  useEffect(() => {
    if (registrationSuccess) {
      toast.success(translate(successMessage))
      dispatch(reset())
      dispatch(login(fields.email, fields.password, true))
      handleClose()
    }
  }, [registrationSuccess])

  const handleClose = () => {
    setOpenAccountRegisterModal(false)
  }

  const handleValidSubmit = (event: any) => {
    event.preventDefault()
    dispatch(handleRegister({ data: { ...fields, login: fields.email }, file: image }))
  }

  const updateField = (field, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }))
  }

  const isPasswordsMatch = () => {
    if (fields.password.trim() === '' || fields.confirmPassword.trim() === '') {
      return true
    }
    return fields.password === fields.confirmPassword
  }

  const isEmailValid = () => {
    if (fields.email.trim() === '') {
      return true
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(fields.email)
  }

  const handleUpload = (imageField) => {
    setImage(imageField)
  }

  const handleBack = () => {
    setOpenAccountRegisterModal(false)
  }

  const handleDisabledButton = () => {
    return fields.firstName === '' || fields.email === '' || !isEmailValid() || fields.password === '' || fields.confirmPassword === '' || !isPasswordsMatch()
  }

  return (
    <React.Fragment>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.paper }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '550px' }, maxWidth: '550px' },
        }}
      >
        <DialogTitle width='100%' color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Cadastre sua conta
          <IconButton onClick={() => setOpenAccountRegisterModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ position: 'relative', mt: 2 }}>
            <ImageUploader onUpload={handleUpload} currentImage={image} name={null} />
          </Box>
          <Box sx={{ flex: 12, display: { sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <TextField
              type='text'
              name='firstName'
              label={translate('userManagement.firstName')}
              variant='outlined'
              required
              fullWidth
              color='secondary'
              data-cy='firstName'
              value={fields.firstName}
              InputProps={{
                style: { borderRadius: '10px' },
              }}
              sx={{ mt: 2 }}
              onChange={(e) => updateField('firstName', e.target.value)}
            />
            <TextField
              name='email'
              label={translate('global.form.email.label')}
              placeholder={translate('global.form.email.placeholder')}
              type='email'
              variant='outlined'
              required
              fullWidth
              color='secondary'
              data-cy='email'
              value={fields.email}
              helperText={!isEmailValid() && 'Seu e-mail é inválido'}
              InputProps={{
                style: { borderRadius: '10px' },
              }}
              sx={{ mt: 2 }}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </Box>
          <Box sx={{ flex: 12, display: { sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <TextField
              name='password'
              label={translate('global.form.password.label')}
              placeholder={translate('global.form.password.label')}
              type={showPassword ? 'text' : 'password'}
              variant='outlined'
              required
              fullWidth
              color='secondary'
              data-cy='password'
              value={fields.password}
              InputProps={{
                style: { borderRadius: '10px' },
              }}
              sx={{ mt: 2, mb: 1 }}
              onChange={(e) => updateField('password', e.target.value)}
            />
            <TextField
              name='confirmPassword'
              label={translate('global.form.confirmpassword.label')}
              placeholder={translate('global.form.confirmpassword.label')}
              type={showPassword ? 'text' : 'password'}
              variant='outlined'
              required
              fullWidth
              color='secondary'
              data-cy='confirmPassword'
              value={fields.confirmPassword}
              helperText={!isPasswordsMatch() && 'As senhas não conferem'}
              InputProps={{
                style: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position='end' style={{ marginRight: '5px' }}>
                    <IconButton edge='end' onClick={() => setShowPassword(!showPassword)} color='secondary'>
                      {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 2, mb: 1 }}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
            />
          </Box>

          <DialogActions sx={{ m: 0, p: 0, mt: 2 }}>
            <Button
              color='secondary'
              variant='contained'
              disabled={handleDisabledButton()}
              sx={{ fontWeight: '600', color: defaultTheme.palette.background.paper }}
              onClick={(e) => handleValidSubmit(e)}
            >
              {translate('register.form.button')}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
