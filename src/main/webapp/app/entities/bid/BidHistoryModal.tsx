import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Translate, getSortState } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicatorRelative } from 'app/shared/components/NoDataIndicator'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { formatCreated, formatCurrency } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import { Spinner } from 'reactstrap'
import { BidUpdateModal } from './BidUpdateModal'
import { getEntitiesByConsortium, reset } from './bid.reducer'

interface IBidHistoryModalProps {
  setOpenBidHistoryModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const BidHistoryModal = ({ setOpenBidHistoryModal, entityConsortium }: IBidHistoryModalProps) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search))
  const [openBidUpdateModal, setOpenBidUpdateModal] = React.useState(false)
  const [order, setOrder] = useState<string>(DESC)
  const [isUser, setIsUser] = useState<boolean>(false)

  const bids = useAppSelector((state) => state.bid.entities)
  const links = useAppSelector((state) => state.bid.links)
  const loading = useAppSelector((state) => state.bid.loading)
  const account = useAppSelector((state) => state.authentication.account)

  const getAllEntities = useCallback(() => {
    dispatch(reset())
    dispatch(getEntitiesByConsortium({ consortiumId: entityConsortium.id, page: paginationState.activePage - 1, size: paginationState.itemsPerPage, sort: `${paginationState.sort},${order}` }))
  }, [paginationState, entityConsortium])

  const handleLoadMore = () => {
    if ((window as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      })
    }
  }

  useEffect(() => {
    getAllEntities()
  }, [getAllEntities])

  useEffect(() => {
    if (entityConsortium?.user?.id === account.id) {
      setIsUser(true)
    }
  }, [entityConsortium])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { xs: 0, sm: 1 }, minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenBidHistoryModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Translate contentKey='repasseconsorcioApp.bid.home.title'>Bid</Translate>
          <IconButton onClick={() => setOpenBidHistoryModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 1 }}>
          <Box style={{ overflow: 'auto' }} id='scrollableDiv'>
            <InfiniteScroll
              dataLength={bids?.length}
              next={handleLoadMore}
              hasMore={paginationState.activePage - 1 < links.next}
              scrollableTarget='scrollableDiv'
              pullDownToRefresh
              refreshFunction={getAllEntities}
              pullDownToRefreshThreshold={50}
              pullDownToRefreshContent={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography color='secondary' variant='overline'>
                    Puxe para atualizar
                  </Typography>
                  <Spinner color='warning' size='small' />
                </Box>
              }
              releaseToRefreshContent={
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                  <Typography color='secondary' variant='overline'>
                    Solte para atualizar
                  </Typography>
                  <Spinner color='warning' size='small' />
                </Box>
              }
              loader={
                <div className='loader' key={0}>
                  Loading ...
                </div>
              }
            >
              <List>
                {!loading && bids?.length
                  ? bids.map((bid, index) => (
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
                          <ListItemText
                            secondary={formatCurrency(bid.value)}
                            secondaryTypographyProps={{ textOverflow: 'ellipsis', maxWidth: { xs: '25vw', md: '200px' }, overflow: 'hidden', whiteSpace: 'nowrap' }}
                          />
                          <ListItemText primary={formatCreated(bid.created)} primaryTypographyProps={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }} />
                        </ListItem>
                        {index !== bids?.length - 1 && <Divider sx={{ mx: 2 }} />}
                      </Fragment>
                    ))
                  : !loading && <NoDataIndicatorRelative message='Nenhum lance encontrado' />}
                {loading && <Loading height='10vh' />}
              </List>

              <DialogActions sx={{ mt: 2, px: 2 }}>
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
                  disabled={isAdmin || isUser}
                  onClick={() => setOpenBidUpdateModal(true)}
                  variant='contained'
                >
                  Dar um lance
                </Button>
              </DialogActions>
            </InfiniteScroll>
          </Box>
        </DialogContent>
      </Dialog>
      {openBidUpdateModal && <BidUpdateModal setOpenBidUpdateModal={setOpenBidUpdateModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}
