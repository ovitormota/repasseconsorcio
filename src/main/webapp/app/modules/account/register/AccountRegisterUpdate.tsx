import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, TextField, ThemeProvider } from '@mui/material'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { deleteUserImage, updateUser, uploadUserImage } from 'app/modules/administration/user-management/user-management.reducer'
import { ImageUploader } from 'app/shared/components/ImageUploader'
import { defaultTheme } from 'app/shared/layout/themes'
import { IUser } from 'app/shared/model/user.model'
import { AccountDeleteModal } from './AccountDeleteModal'

interface IAccountRegisterUpdateProps {
  setOpenAccountRegisterUpdateModal: (open: boolean) => void
  editUser: IUser | null
  getAllEntities?: () => void
}

export const AccountRegisterUpdate = ({ setOpenAccountRegisterUpdateModal, editUser, getAllEntities }: IAccountRegisterUpdateProps) => {
  const dispatch = useAppDispatch()

  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false)
  const [image, setImage] = useState(null)
  const [fields, setFields] = useState({
    firstName: '',
    email: '',
  })

  const loading = useAppSelector((state) => state.userManagement.loading)
  const isAdmin = useAppSelector((state) => state.authentication.account.authorities.includes('ROLE_ADMIN'))

  useEffect(() => {
    if (editUser.id) {
      setImage(editUser.imageUrl)
      setFields({
        firstName: editUser.firstName,
        email: editUser.email,
      })
    }
  }, [editUser])

  const handleClose = () => {
    setOpenAccountRegisterUpdateModal(false)
  }

  const handleValidSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const fieldsToUpdate: Partial<IUser> = {}
    if (editUser) {
      if (editUser.firstName !== fields.firstName) {
        fieldsToUpdate.firstName = fields.firstName
      }
      if (editUser.email !== fields.email) {
        fieldsToUpdate.email = fields.email
        fieldsToUpdate.login = fields.email
      }
    }

    const imageToUpdate = image !== editUser?.imageUrl

    try {
      if (Object.keys(fieldsToUpdate).length > 0 || imageToUpdate) {
        if (Object.keys(fieldsToUpdate).length > 0) {
          dispatch(updateUser({ ...editUser, ...fieldsToUpdate })).then(() => {
            if (isAdmin && getAllEntities) {
              getAllEntities()
            }
          })
        }

        if (imageToUpdate && image) {
          dispatch(uploadUserImage({ userId: editUser.id, file: image })).then(() => {
            if (isAdmin && getAllEntities) {
              getAllEntities()
            }
          })
        } else {
          if (editUser?.imageUrl && !image) {
            dispatch(deleteUserImage(editUser.id)).then(() => {
              if (isAdmin && getAllEntities) {
                getAllEntities()
              }
            })
          }
        }
      }

      !loading && handleClose()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
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

  const handleUpload = (imageField) => {
    setImage(imageField)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.paper }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '550px' }, maxWidth: '550px' },
        }}
      >
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <ImageUploader onUpload={handleUpload} currentImage={image} name={null} />
          </Box>
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
            disabled
            value={fields.email}
            helperText={'Para alterar o email, entre em contato com o suporte.'}
            InputProps={{
              style: { borderRadius: '10px' },
            }}
            sx={{ mt: 2 }}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </DialogContent>
        <form onSubmit={handleValidSubmit}>
          <DialogActions>
            <Box>
              <Button variant='text' sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px', mr: 2 }} onClick={() => handleClose()}>
                <Translate contentKey='entity.action.back'>Back</Translate>
              </Button>
              <Button type='submit' color='secondary' variant='contained' sx={{ fontWeight: '600', gap: 1 }} disabled={fields.firstName === '' || fields.email === '' || !isEmailValid()}>
                <Translate contentKey='entity.action.save'>Save</Translate>
                {loading && <CircularProgress size={20} sx={{ color: defaultTheme.palette.background.paper }} />}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
      {deleteAccountModalOpen && <AccountDeleteModal setDeleteAccountModalOpen={setDeleteAccountModalOpen} />}
    </ThemeProvider>
  )
}
