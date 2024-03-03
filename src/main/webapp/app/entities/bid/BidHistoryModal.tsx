import React, { Fragment, useEffect } from 'react'
import { Translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider } from '@mui/material'
import { NoDataIndicatorRelative } from 'app/shared/components/NoDataIndicator'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { formatCreated, formatCurrency } from 'app/shared/util/data-utils'
import { BidUpdateModal } from './BidUpdateModal'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AUTHORITIES } from 'app/config/constants'
import { getEntity } from '../consortium/consortium.reducer'
import { Loading } from 'app/shared/components/Loading'

interface IBidHistoryModalProps {
  setOpenBidHistoryModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const BidHistoryModal = ({ setOpenBidHistoryModal, entityConsortium }: IBidHistoryModalProps) => {
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const [openBidUpdateModal, setOpenBidUpdateModal] = React.useState(false)

  const entityConsortiumUpdated = useAppSelector((state) => state.consortium.entity)
  const loading = useAppSelector((state) => state.consortium.loading)

  useEffect(() => {
    if (entityConsortium?.id) {
      dispatch(getEntity(entityConsortium.id))
    }
  }, [])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { xs: 0, sm: 1 }, minWidth: { xs: '92vw', sm: '80vw', md: '500px' } },
        }}
        onClose={() => setOpenBidHistoryModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Translate contentKey='repasseconsorcioApp.bid.home.title'>Bid</Translate>
          <IconButton onClick={() => setOpenBidHistoryModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {!loading && entityConsortiumUpdated?.bids?.length
              ? entityConsortiumUpdated?.bids?.map((bid, index) => (
                  <Fragment key={index}>
                    <ListItem
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '1em',
                        ':hover': {
                          background: defaultTheme.palette.secondary['A100'],
                        },
                      }}
                    >
                      <ListItemIcon>
                        <Avatar alt={bid.user?.firstName} src={bid?.user?.image ?? bid.user?.firstName} sx={{ width: { sx: 40, sm: 50 }, height: { sx: 40, sm: 50 } }} />
                      </ListItemIcon>
                      <ListItemText secondary={formatCurrency(bid.value)} />
                      <ListItemText primary={formatCreated(bid.created)} primaryTypographyProps={{ flexWrap: 'nowrap' }} />
                    </ListItem>
                    {index !== entityConsortiumUpdated?.bids.length - 1 && <Divider sx={{ mx: 2 }} />}
                  </Fragment>
                ))
              : !loading && <NoDataIndicatorRelative message='Nenhum lance encontrado' />}
            {loading && <Loading height='10vh' />}
          </List>

          <DialogActions sx={{ mt: 2, px: 0 }}>
            <Button onClick={() => setOpenBidHistoryModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
              <Translate contentKey='entity.action.back'>Voltar</Translate>
            </Button>
            <Button
              sx={{
                background: defaultTheme.palette.secondary.main,
                color: defaultTheme.palette.secondary.contrastText,
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                '&:hover': {
                  backgroundColor: defaultTheme.palette.warning.main,
                },
              }}
              // disabled={isAdmin}
              onClick={() => setOpenBidUpdateModal(true)}
              variant='contained'
            >
              Dar um lance
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      {openBidUpdateModal && <BidUpdateModal setOpenBidUpdateModal={setOpenBidUpdateModal} entityConsortium={entityConsortiumUpdated} />}
    </ThemeProvider>
  )
}
