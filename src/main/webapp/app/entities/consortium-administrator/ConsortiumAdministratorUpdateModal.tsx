import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, ThemeProvider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { createEntity, getEntities, updateEntity } from './consortium-administrator.reducer'

interface IConsortiumAdministratorUpdateModalProps {
  setOpenConsorciumAdministratorUpdateModal: (open: boolean) => void
  consortiumAdministrator?: IConsortiumAdministrator
}

export const ConsortiumAdministratorUpdateModal = ({ setOpenConsorciumAdministratorUpdateModal, consortiumAdministrator }: IConsortiumAdministratorUpdateModalProps) => {
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.consortiumAdministrator.loading)
  const updating = useAppSelector((state) => state.consortiumAdministrator.updating)
  const updateSuccess = useAppSelector((state) => state.consortiumAdministrator.updateSuccess)

  const [consortiumName, setConsortiumName] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (consortiumAdministrator) {
      setConsortiumName(consortiumAdministrator.name)
      setImage(consortiumAdministrator.image)
    }
  }, [consortiumAdministrator])

  const handleClose = () => {
    setOpenConsorciumAdministratorUpdateModal(false)
  }

  useEffect(() => {
    if (updateSuccess) {
      // handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (event) => {
    event.preventDefault()
    const entity = {
      ...consortiumAdministrator,
      name: consortiumName,
      image,
    }

    if (consortiumAdministrator?.id) {
      dispatch(updateEntity(entity)).then(() => {
        handleClose()
        getEntities({})
      })
    } else {
      dispatch(createEntity(entity)).then(() => {
        handleClose()
        getEntities({})
      })
    }
  }

  const handleUpload = ({ base64Image }) => {
    setImage(base64Image)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: {
            borderRadius: '1em',
            background: defaultTheme.palette.secondary['A100'],
            minWidth: { xs: '92vw', sm: '80vw', md: '600px' },
          },
        }}
        onClose={() => setOpenConsorciumAdministratorUpdateModal(false)}
      >
        <DialogTitle
          color='secondary'
          fontWeight={'600'}
          fontSize={'18px'}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Translate contentKey={`repasseconsorcioApp.consortiumAdministrator.home.title.${consortiumAdministrator?.id ? 'edit' : 'create'}`}>Create or edit a consortium administrator</Translate>
          <IconButton onClick={() => setOpenConsorciumAdministratorUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <TextField
              required
              id='consortium-administrator-name'
              name='numberOfInstallments'
              label={translate('repasseconsorcioApp.consortium.consortiumAdministrator')}
              type='text'
              fullWidth
              color='secondary'
              value={consortiumName}
              onChange={(e) => setConsortiumName(e.target.value)}
              sx={{ mt: 3 }}
              InputProps={{
                style: { borderRadius: '10px' },
              }}
            />
          )}
        </DialogContent>
        <form onSubmit={saveEntity}>
          <DialogActions>
            <Button onClick={() => setOpenConsorciumAdministratorUpdateModal(false)} sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }}>
              <Translate contentKey='entity.action.cancel'>Cancel</Translate>
            </Button>
            <Button type='submit' variant='contained' color='secondary' sx={{ fontWeight: '600', color: defaultTheme.palette.background.paper }}>
              <Translate contentKey='entity.action.save'>Save</Translate>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </ThemeProvider>
  )
}
