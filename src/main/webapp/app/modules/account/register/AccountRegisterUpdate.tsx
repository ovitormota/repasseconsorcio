import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, TextField, ThemeProvider, Typography } from '@mui/material'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { reset, updateUser } from 'app/modules/administration/user-management/user-management.reducer'
import { ImageUploader } from 'app/shared/components/ImageUploader'
import { defaultTheme } from 'app/shared/layout/themes'
import { AccountDeleteModal } from './AccountDeleteModal'

export const AccountRegisterUpdate = ({ setOpenAccountRegisterUpdateModal }) => {
  const dispatch = useAppDispatch()

  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    image: null,
  })

  const account = useAppSelector((state) => state.authentication.account)
  const updateSuccess = useAppSelector((state) => state.userManagement.updateSuccess)
  const loading = useAppSelector((state) => state.userManagement.loading)

  useEffect(() => {
    if (account?.id) {
      setFields({
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        image: account.image,
      })
    }
  }, [account])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const handleClose = () => {
    setOpenAccountRegisterUpdateModal(false)
    dispatch(reset())
  }

  const handleValidSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(
      updateUser({
        ...account,
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        login: fields.email,
        image: fields.image,
      })
    )
  }

  const updateField = (field, value) => {
    setFields((prevFields) => ({
      ...prevFields,
      [field]: value,
    }))
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
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { sm: 2 }, minWidth: { xs: '92vw', sm: '80vw', md: '50vw' } },
        }}
      >
        <DialogContent>
          <form onSubmit={handleValidSubmit}>
            <ImageUploader onUpload={handleUpload} currentImage={fields.image} />

            <TextField
              type='text'
              name='firstName'
              label={translate('userManagement.firstName')}
              variant='outlined'
              required
              fullWidth
              color='secondary'
              value={fields.firstName}
              data-cy='firstName'
              InputProps={{
                style: { borderRadius: '8px' },
              }}
              sx={{ mt: 2, mb: 1 }}
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
              value={fields.lastName}
              data-cy='lastName'
              InputProps={{
                style: { borderRadius: '8px' },
              }}
              sx={{ mt: 2, mb: 1 }}
              onChange={(e) => updateField('lastName', e.target.value)}
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
              disabled
              value={fields.email}
              helperText={'Para alterar o email, entre em contato com o suporte.'}
              InputProps={{
                style: { borderRadius: '8px' },
              }}
              sx={{ mt: 2, mb: 1 }}
              onChange={(e) => updateField('email', e.target.value)}
            />

            <DialogActions sx={{ p: 0, m: 0, mt: 4, justifyContent: 'space-between' }}>
              <Button variant='text' onClick={() => setDeleteAccountModalOpen(true)}>
                <Typography variant='overline' fontSize={10} sx={{ color: defaultTheme.palette.text.secondary }}>
                  <Translate contentKey='userManagement.delete.button'>Delete Account</Translate>
                </Typography>
              </Button>
              <Box>
                <Button variant='text' sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px', mr: 2 }} onClick={() => handleClose()}>
                  <Translate contentKey='entity.action.cancel'>Cancel</Translate>
                </Button>
                <Button type='submit' color='secondary' variant='contained' sx={{ fontWeight: '600', gap: 1 }} disabled={fields.firstName === '' || fields.lastName === '' || fields.email === '' || !isEmailValid()}>
                  <Translate contentKey='entity.action.save'>Save</Translate>
                  {loading && <CircularProgress size={20} sx={{ color: defaultTheme.palette.common.black }} />}
                </Button>
              </Box>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      {deleteAccountModalOpen && <AccountDeleteModal setDeleteAccountModalOpen={setDeleteAccountModalOpen} />}
    </ThemeProvider>
  )
}
