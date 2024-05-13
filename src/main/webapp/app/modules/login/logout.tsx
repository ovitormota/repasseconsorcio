import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { logout } from 'app/shared/reducers/authentication'
import { Redirect } from 'react-router-dom'
import { defaultTheme } from 'app/shared/layout/themes'
import { Translate } from 'react-jhipster'
import { getEntities, reset } from 'app/entities/consortium/consortium.reducer'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'

export const Logout = ({ setOpenLogoutModal }) => {
  const logoutUrl = useAppSelector((state) => state.authentication.logoutUrl)
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isAuthenticated) {
      setOpenLogoutModal(false)
      dispatch(reset())
      dispatch(
        getEntities({
          page: 0,
          size: 20,
          sort: 'id,asc',
          filterSegmentType: SegmentType.ALL,
          filterStatusType: ConsortiumStatusType.ALL,
        })
      )
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    dispatch(logout())
    if (logoutUrl) {
      window.location.href = logoutUrl
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenLogoutModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'}>
          <Translate contentKey='repasseconsorcioApp.logout.title'>Logout</Translate>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 4 }}>
            <Translate contentKey='repasseconsorcioApp.logout.message'>Are you sure you want to logout?</Translate>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenLogoutModal(false)} sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }}>
            <Translate contentKey='repasseconsorcioApp.logout.buttons.cancel'>Cancel</Translate>
          </Button>
          <Button onClick={handleLogout} variant='contained' color='secondary' sx={{ fontWeight: '600', color: defaultTheme.palette.background.paper }}>
            <Translate contentKey='repasseconsorcioApp.logout.buttons.confirm'>Logout</Translate>
          </Button>
        </DialogActions>
      </Dialog>

      <Redirect to={'/'} />
    </ThemeProvider>
  )
}

export default Logout
