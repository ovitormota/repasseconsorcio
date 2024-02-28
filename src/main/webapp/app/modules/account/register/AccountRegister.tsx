import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, InputAdornment, TextField } from '@mui/material'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { ImageUploader } from 'app/shared/components/ImageUploader'
import { toast } from 'react-hot-toast'
import { defaultTheme } from 'app/shared/layout/themes'
import { handleRegister, reset } from './register.reducer'

export const AccountRegister = ({ setOpenAccountRegisterModal }) => {
  const dispatch = useAppDispatch()
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  })
  const [visibleFields, setVisibleFields] = useState(['firstName'])
  const [showPassword, setShowPassword] = useState(false)

  const currentLocale = useAppSelector((state) => state.locale.currentLocale)
  const registrationSuccess = useAppSelector((state) => state.register.registrationSuccess)
  const successMessage = useAppSelector((state) => state.register.successMessage)
  const loading = useAppSelector((state) => state.register.loading)

  useEffect(() => {
    if (registrationSuccess) {
      toast.success(translate(successMessage))
      dispatch(reset())
      handleClose()
    }
  }, [registrationSuccess])

  const handleClose = () => {
    setOpenAccountRegisterModal(false)
  }

  const handleValidSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(
      handleRegister({
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        password: fields.password,
        login: fields.email,
        langKey: currentLocale,
        image: fields.image,
      })
    )
  }

  const updateField = (field, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }))

    if (!visibleFields.includes(field)) {
      setVisibleFields((prevVisibleFields) => [...prevVisibleFields, field])
    }
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

  const handleUpload = ({ base64Image }) => {
    setFields({
      ...fields,
      image: base64Image,
    })
  }

  return (
    <React.Fragment>
      <Dialog open={true} sx={{ backgroundColor: defaultTheme.palette.background.default }} PaperProps={{ sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { sm: 2 }, minWidth: { xs: '92vw', sm: '80vw', md: '50vw' } } }}>
        <DialogContent>
          <form onSubmit={handleValidSubmit}>
            <ImageUploader onUpload={handleUpload} currentImage={fields.image} />
            {visibleFields.includes('firstName') && (
              <TextField
                type='text'
                name='firstName'
                label={translate('userManagement.firstName')}
                variant='outlined'
                required
                fullWidth
                color='secondary'
                data-cy='firstName'
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
                sx={{ mt: 2, mb: 1 }}
                onChange={(e) => updateField('firstName', e.target.value)}
              />
            )}
            {visibleFields.includes('firstName') && (
              <TextField
                type='text'
                name='lastName'
                label={translate('userManagement.lastName')}
                variant='outlined'
                required
                fullWidth
                color='secondary'
                data-cy='lastName'
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
                sx={{ mt: 2, mb: 1 }}
                onChange={(e) => updateField('lastName', e.target.value)}
              />
            )}
            {visibleFields.includes('lastName') && (
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
                error={!isEmailValid()}
                helperText={!isEmailValid() && 'Seu e-mail é inválido'}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
                sx={{ mt: 2, mb: 1 }}
                onChange={(e) => updateField('email', e.target.value)}
              />
            )}
            {visibleFields.includes('email') && (
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
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
                sx={{ mt: 2, mb: 1 }}
                onChange={(e) => updateField('password', e.target.value)}
              />
            )}
            {visibleFields.includes('password') && (
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
                error={!isPasswordsMatch()}
                helperText={!isPasswordsMatch() && 'As senhas não conferem'}
                InputProps={{
                  style: { borderRadius: '8px' },
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
            )}
            <DialogActions sx={{ mt: 3, px: 0 }}>
              <Button variant='text' sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }} onClick={() => handleClose()}>
                <Translate contentKey='entity.action.cancel'>Cancel</Translate>
              </Button>
              <Button type='submit' color='secondary' variant='contained' sx={{ fontWeight: '600' }} disabled={fields.firstName === '' || fields.lastName === '' || fields.email === '' || fields.password === '' || fields.confirmPassword === '' || !isPasswordsMatch() || !isEmailValid()}>
                <Translate contentKey='register.form.button'>Register</Translate>
                {loading && <CircularProgress size={20} sx={{ color: defaultTheme.palette.common.black }} />}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
