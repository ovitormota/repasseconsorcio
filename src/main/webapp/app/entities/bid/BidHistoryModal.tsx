import React, { useEffect, useState } from 'react'
import { Translate, getSortState } from 'react-jhipster'

import { CloseOutlined, StarsRounded } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicatorRelative } from 'app/shared/components/NoDataIndicator'
import { TypographStyled } from 'app/shared/layout/table/TableComponents'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { IUser } from 'app/shared/model/user.model'
import { formatCreated, formatCurrency, showElement } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import { BidUpdateModal } from './BidUpdateModal'
import { getEntitiesByConsortium, reset } from './bid-by-consortium.reducer'

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

  const bids = useAppSelector((state) => state.bidByConsortium.entities)
  const links = useAppSelector((state) => state.bidByConsortium.links)
  const loading = useAppSelector((state) => state.bid.loading)
  const account = useAppSelector((state) => state.authentication.account)

  const getAllEntities = () => {
    dispatch(getEntitiesByConsortium({ consortiumId: entityConsortium.id, page: paginationState.activePage - 1, size: paginationState.itemsPerPage, sort: `${paginationState.sort},${order}` }))
  }

  useEffect(() => {
    dispatch(reset())
    if (entityConsortium?.id) {
      getAllEntities()
    }
  }, [paginationState.activePage, order, entityConsortium?.id])

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  useEffect(() => {
    if (entityConsortium?.user?.id === account.id) {
      setIsUser(true)
    }
  }, [entityConsortium])

  const handleClose = () => {
    setOpenBidHistoryModal(false)
  }

  const setUser = (user: IUser) => {
    if (account.id === user.id) {
      return 'Você'
    }
    return `${user.firstName}`
  }

  const renderWinner = () => {
    return <StarsRounded sx={{ color: defaultTheme.palette.secondary.light, position: 'absolute', top: 10, fontSize: '1em' }} />
  }

  const renderWinnerLegend = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        <StarsRounded sx={{ color: defaultTheme.palette.secondary.main, fontSize: '1em' }} />
        <Typography color='secondary' variant='overline' fontSize={10}>
          {entityConsortium.status === ConsortiumStatusType.WON ? 'Vencedor' : 'Vencedor até o momento'}
        </Typography>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={handleClose}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Translate contentKey='repasseconsorcioApp.bid.home.title'>Bid</Translate>
          <IconButton onClick={handleClose}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        {!!bids?.length && renderWinnerLegend()}
        <DialogContent sx={{ px: 1 }}>
          <Box>
            <InfiniteScroll
              dataLength={bids?.length}
              next={handleLoadMore}
              hasMore={paginationState.activePage - 1 < links.next}
              scrollableTarget='scrollableDiv'
              loader={loading && <Loading height='150px' />}
            >
              {!loading && bids?.length ? (
                <TableContainer sx={{ px: { xs: 0, sm: 2 } }}>
                  <Table>
                    <TableHead style={{ position: 'relative' }}>
                      <TableRow>
                        <TableCell>
                          <TypographStyled>Usuário</TypographStyled>
                        </TableCell>
                        <TableCell>
                          <TypographStyled>Lance</TypographStyled>
                        </TableCell>
                        <TableCell>
                          <TypographStyled>Data</TypographStyled>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {bids?.map((bid, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{setUser(bid.user)}</TableCell>
                            <TableCell sx={{ position: 'relative' }}>
                              {formatCurrency(bid.value)} {index === 0 && renderWinner()}
                            </TableCell>
                            <TableCell>{formatCreated(bid.created)}</TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                !loading && <NoDataIndicatorRelative message='Nenhum lance encontrado' />
              )}
            </InfiniteScroll>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pt: '1em' }}>
          <Button onClick={() => setOpenBidHistoryModal(false)} sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }}>
            <Translate contentKey='entity.action.back'>Voltar</Translate>
          </Button>
          <Button
            sx={{
              background: defaultTheme.palette.secondary.main,
              color: defaultTheme.palette.secondary.contrastText,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              '&:hover': {
                backgroundColor: defaultTheme.palette.secondary.main,
              },
            }}
            style={showElement(!isAdmin && !isUser && entityConsortium.status !== ConsortiumStatusType.WON)}
            onClick={() => setOpenBidUpdateModal(true)}
            variant='contained'
          >
            Dar um lance
          </Button>
        </DialogActions>
      </Dialog>
      {openBidUpdateModal && <BidUpdateModal setOpenBidUpdateModal={setOpenBidUpdateModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}
