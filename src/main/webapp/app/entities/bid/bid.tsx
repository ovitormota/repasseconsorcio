import React, { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row, Spinner, Table } from 'reactstrap'
import { Translate, TextFormat, getSortState, translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getEntities, reset } from './bid.reducer'
import { IBid } from 'app/shared/model/bid.model'
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { AppBar, Avatar, Box, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Tooltip, Typography } from '@mui/material'
import { defaultTheme } from 'app/shared/layout/themes'
import { Loading } from 'app/shared/components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { formatCreated, formatCurrency } from 'app/shared/util/data-utils'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import { ConsortiumHistoryModal } from '../consortium/ConsortiumHistoryModal'
import { IConsortium } from 'app/shared/model/consortium.model'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'

export const Bid = (props: RouteComponentProps<{ url: string }>) => {
  const { isSMScreen, isMDScreen } = useBreakpoints()
  const dispatch = useAppDispatch()
  const history = props.history

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'created'), props.location.search))
  const [sorting, setSorting] = useState(false)
  const [openConsortiumHistoryModal, setOpenConsortiumHistoryModal] = useState<boolean>(false)
  const [entityConsortium, setEntityConsortium] = useState<IConsortium | null>(null)

  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const updateSuccess = useAppSelector((state) => state.bid.updateSuccess)
  const totalItems = useAppSelector((state) => state.bid.totalItems)
  const bidList = useAppSelector((state) => state.bid.entities)
  const loading = useAppSelector((state) => state.bid.loading)
  const links = useAppSelector((state) => state.bid.links)
  const [order, setOrder] = useState(DESC)

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${order}`,
      })
    )
  }

  const resetAll = () => {
    dispatch(reset())
    setPaginationState({
      ...paginationState,
      activePage: 1,
    })
    dispatch(getEntities({}))
  }

  useEffect(() => {
    resetAll()
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      resetAll()
    }
  }, [updateSuccess])

  useEffect(() => {
    getAllEntities()
  }, [paginationState.activePage])

  const handleLoadMore = () => {
    if ((window as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      })
    }
  }

  useEffect(() => {
    if (sorting) {
      getAllEntities()
      setSorting(false)
    }
  }, [sorting])

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar
        position='fixed'
        sx={{
          top: 0,
          bottom: 'auto',
          background: 'transparent',
          boxShadow: 'none',
          height: '60px',
        }}
      >
        {!loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              gap: { xs: 1, sm: 10 },
            }}
          >
            {isAuthenticated && isMDScreen && (
              <Tooltip title='Início' style={{ cursor: 'pointer', position: 'absolute', left: 20, top: 10 }} onClick={() => history.replace('/')}>
                <Box sx={{ width: '110px', height: '40px', maxWidth: '110px' }}>
                  <img src='content/images/logo-repasse-consorcio-text.png' alt='Logo' width='100%' height='100%' />
                </Box>
              </Tooltip>
            )}
            <Typography color='secondary' fontWeight={'600'} fontSize={'18px'}>
              <Translate contentKey='repasseconsorcioApp.bid.home.myBids'>Meus lances</Translate>
            </Typography>
          </Box>
        )}
      </AppBar>
      {loading ? (
        <Loading />
      ) : (
        <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)', marginTop: '60px' }} id='scrollableDiv'>
          <InfiniteScroll
            dataLength={bidList?.length}
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
            <List sx={{ mb: '150px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', p: { xs: 0, sm: 3 } }}>
              {!!bidList?.length &&
                bidList?.map((bid, index) => (
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
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => [setOpenConsortiumHistoryModal(true), setEntityConsortium(bid.consortium)]}
                    >
                      <ListItemIcon>
                        <Avatar
                          alt={bid?.consortium?.consortiumAdministrator?.name}
                          src={bid?.consortium?.consortiumAdministrator?.name}
                          sx={{ width: { sx: 40, sm: 50 }, height: { sx: 40, sm: 50 } }}
                        />
                      </ListItemIcon>
                      {isMDScreen && (
                        <>
                          <ListItemText primary={bid?.consortium?.consortiumAdministrator?.name} />
                          <ListItemText primary={translate(`repasseconsorcioApp.SegmentType.${bid.consortium?.segmentType}`)} />
                        </>
                      )}
                      <ListItemText primary={formatCurrency(bid.value)} primaryTypographyProps={{ fontWeight: 'bold' }} />
                      <ListItemText primary={formatCreated(bid.created)} />
                    </ListItem>
                  </Fragment>
                ))}
            </List>
          </InfiniteScroll>
          {!bidList?.length && <NoDataIndicator />}
        </Box>
      )}
      {openConsortiumHistoryModal && <ConsortiumHistoryModal setOpenConsortiumHistoryModal={setOpenConsortiumHistoryModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}

export default Bid
