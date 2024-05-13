import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Step, StepLabel, Stepper, TextField } from '@mui/material'

import { CloseOutlined, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { ImageUploader } from 'app/shared/components/ImageUploader'
import PhoneInput from 'app/shared/components/PhoneInput'
import { defaultTheme } from 'app/shared/layout/themes'
import { login } from 'app/shared/reducers/authentication'
import { showElement } from 'app/shared/util/data-utils'
import { toast } from 'react-hot-toast'
import { handleRegister, reset } from './register.reducer'

export const AccountRegister = ({ setOpenAccountRegisterModal }) => {
  const dispatch = useAppDispatch()
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [image, setImage] = useState(null)
  const registrationSuccess = useAppSelector((state) => state.register.registrationSuccess)
  const successMessage = useAppSelector((state) => state.register.successMessage)
  const loading = useAppSelector((state) => state.register.loading)
  const [activeStep, setActiveStep] = useState(0)

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

  const isPhoneValid = () => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/
    return phoneRegex.test(fields.phoneNumber)
  }

  const handleUpload = (imageField) => {
    setImage(imageField)
  }

  const steps = [0, 1, 2]

  const handleNext = (event: any) => {
    if (activeStep === steps.length - 1) {
      handleValidSubmit(event)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleDisabledButton = (step) => {
    if (step === 0) {
      return fields.firstName === '' || fields.lastName === ''
    }
    if (step === 1) {
      return fields.email === '' || fields.phoneNumber === '' || !isEmailValid() || !isPhoneValid()
    }
    if (step === 2) {
      return fields.password === '' || fields.confirmPassword === '' || !isPasswordsMatch()
    }
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
          {activeStep === 0 && 'Informações Pessoais'}
          {activeStep === 1 && 'Informações de Contato'}
          {activeStep === 2 && 'Crie sua senha'}
          <IconButton onClick={() => setOpenAccountRegisterModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Stepper activeStep={activeStep} sx={{ my: 1 }}>
              {steps.map((label) => (
                <Step
                  key={label}
                  sx={{
                    '& .MuiStepLabel-root .Mui-completed': {
                      color: 'success.main', // circle color (COMPLETED)
                    },
                    '& .MuiStepLabel-root .Mui-active': {
                      color: 'secondary.main', // circle color (ACTIVE)
                    },
                    '& .MuiStepIcon-root': {
                      color: 'grey.100', // circle color (INACTIVE)
                    },
                    '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                      color: 'common.white', // Just text label (ACTIVE)
                    },
                    '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                      fill: 'white', // circle's number (ACTIVE)
                    },
                  }}
                >
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: '1 1 auto', mt: 2 }} />
              {activeStep === 0 && (
                <>
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
                      type='text'
                      name='lastName'
                      label={translate('userManagement.lastName')}
                      variant='outlined'
                      required
                      fullWidth
                      color='secondary'
                      data-cy='lastName'
                      value={fields.lastName}
                      InputProps={{
                        style: { borderRadius: '10px' },
                      }}
                      sx={{ mt: 2 }}
                      onChange={(e) => updateField('lastName', e.target.value)}
                    />
                  </Box>
                </>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === 1 && (
                <>
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
                  <PhoneInput value={fields?.phoneNumber} onChange={(e) => updateField('phoneNumber', e.target.value)} />
                </>
              )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === 2 && (
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
                    error={!isPasswordsMatch()}
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
              )}
            </Box>

            <DialogActions sx={{ m: 0, p: 0, mt: 2 }}>
              <Button sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }} onClick={handleBack} style={showElement(activeStep !== 0)}>
                Voltar
              </Button>
              <Button
                color='secondary'
                variant='contained'
                disabled={handleDisabledButton(activeStep)}
                sx={{ fontWeight: '600', color: defaultTheme.palette.background.paper }}
                onClick={(e) => handleNext(e)}
              >
                {activeStep === steps.length - 1 ? <Translate contentKey='entity.action.register'>Register</Translate> : 'Próximo'}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
