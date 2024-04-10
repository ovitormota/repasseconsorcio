import { DirectionsCarRounded, HomeRounded, MoreRounded } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, CircularProgress, IconButton, List, ListItem, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { HomeLogin } from 'app/modules/login/HomeLogin'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AuctionTimer } from 'app/shared/components/AuctionTimer'
import { ConsortiumCardSkeleton } from 'app/shared/components/ConsortiumCardSkeleton'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { SegmentFilterChip } from 'app/shared/components/SegmentFilterChip'
import { SortingBox } from 'app/shared/components/SortingBox'
import { StatusFilter } from 'app/shared/components/StatusFilter'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { defaultTheme } from 'app/shared/layout/themes'
import { IBid } from 'app/shared/model/bid.model'
import { IConsortium } from 'app/shared/model/consortium.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { formatCurrency, getStatusColor, showElement } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { BidHistoryModal } from '../bid/BidHistoryModal'
import { BidUpdateModal } from '../bid/BidUpdateModal'
import { getEntities } from './consortium.reducer'

export const Consortium = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'consortiumValue'), props.location.search))
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [openBidUpdateModal, setOpenBidUpdateModal] = useState(false)
  const [openBidHistoryModal, setOpenBidHistoryModal] = useState(false)
  const [entityConsortium, setEntityConsortium] = useState<IConsortium>(null)
  const [filterSegmentType, setFilterSegmentType] = useState(SegmentType.ALL)
  const [filterStatusType, SetFilterStatusType] = useState(ConsortiumStatusType.ALL)

  const [currentSort, setCurrentSort] = useState('consortiumValue')
  const [order, setOrder] = useState(ASC)
  const sortTypes = ['consortiumAdministrator', 'contemplationStatus', 'numberOfInstallments', 'installmentValue', 'consortiumValue']

  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const consortiumList = useAppSelector((state) => state.consortium.entities)
  const loading = useAppSelector((state) => state.consortium.loading)
  const links = useAppSelector((state) => state.consortium.links)

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${currentSort},${order}`,
        filterSegmentType,
        filterStatusType,
      })
    )
  }

  useEffect(() => {
    getAllEntities()
  }, [paginationState.activePage, filterSegmentType, filterStatusType, currentSort, order])

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  const renderStatusRibbon = () => (
    <div className='ribbon'>
      <a href=''>{translate('repasseconsorcioApp.consortium.contemplationTypeStatus.approved')}</a>
    </div>
  )

  const handleBid = (consortium: IConsortium) => {
    if (!isAuthenticated) {
      setOpenLoginModal(true)
    } else {
      setEntityConsortium(consortium), setOpenBidUpdateModal(true)
    }
  }

  const handleBidHistory = (consortium: IConsortium) => {
    setOpenBidHistoryModal(true)
    setEntityConsortium(consortium)
  }

  const findMinValue = (bids: IBid[]) => {
    const minValue = bids.reduce((min, bid) => (bid.value < min ? bid.value : min), bids[0].value)
    return formatCurrency(minValue)
  }

  const ConsortiumCard = ({ consortium }: { consortium: IConsortium }) => {
    const {
      consortiumAdministrator: { name, image },
      segmentType,
      consortiumValue,
      numberOfInstallments,
      installmentValue,
      created,
      contemplationStatus,
      minimumBidValue,
      status,
      bids,
    } = consortium

    return (
      <Card
        sx={{
          mx: { xs: 1.1, sm: 1.1 },
          my: { xs: 1.1, sm: 1.1 },
          width: { xs: '90vw', sm: '330px' },
          background: defaultTheme.palette.background.paper,
          border: '1px solid rgba(72, 86, 150, 0.05)',
          borderRadius: '1rem',
          ':hover': {
            backgroundColor: defaultTheme.palette.secondary['A400'],
            cursor: 'pointer',
          },
          position: 'relative',
        }}
        elevation={2}
        onClick={() => isAuthenticated && handleBidHistory(consortium)}
      >
        <Box
          sx={{
            borderRadius: '0% 0% 50% 50% / 21% 55% 30% 30%',
            background: defaultTheme.palette.secondary['A400'],
            overflow: 'hidden',
            width: { xs: '90vw', sm: '330px' },
            height: '55px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <IconButton
            sx={{
              background: defaultTheme.palette.background.paper,
              position: 'absolute',
              top: 30,
              ':hover': {
                background: defaultTheme.palette.background.paper,
              },
            }}
          >
            {segmentType === SegmentType.AUTOMOBILE ? (
              <DirectionsCarRounded sx={{ fontSize: '30px', color: defaultTheme.palette.secondary.light }} />
            ) : segmentType === SegmentType.REAL_ESTATE ? (
              <HomeRounded sx={{ fontSize: '30px', color: defaultTheme.palette.secondary.light }} />
            ) : (
              <MoreRounded sx={{ fontSize: '25px', color: defaultTheme.palette.secondary.light }} />
            )}
          </IconButton>
        </Box>
        <Chip
          label={consortium?.bids?.length ? `${consortium?.bids?.length} lances` : 'Sem lances'}
          color={getStatusColor(status)}
          variant='outlined'
          size='small'
          style={showElement(!!consortium?.bids?.length)}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            cursor: 'pointer',
          }}
        />
        {contemplationStatus && renderStatusRibbon()}
        <CardContent sx={{ p: 1.5 }}>
          <List>
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.consortiumAdministrator')} `}
              secondary={name}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')} `}
              secondary={numberOfInstallments}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              secondaryTypographyProps={{ fontWeight: '600 !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.installmentValue')} `}
              secondary={formatCurrency(installmentValue)}
            />
            <hr className='hr-text' data-content='' style={{ height: 0 }} />

            <ListItem sx={{ m: 0, p: 0 }}>
              <ListItemText
                primaryTypographyProps={{ fontSize: '12px !important' }}
                primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
                secondary={formatCurrency(consortiumValue)}
                secondaryTypographyProps={{
                  fontSize: '25px !important',
                  fontWeight: '600 !important',
                }}
              />
            </ListItem>
            <hr className='hr-text' data-content='' style={{ height: 0 }} />
            <ListItem sx={{ m: 0, p: 0 }}>
              <AuctionTimer created={created} />
            </ListItem>

            <ListItem>
              <Button
                sx={{
                  mb: -3.3,
                  borderRadius: '12px',
                }}
                variant='contained'
                color='secondary'
                fullWidth
                disabled={isAdmin}
                onClick={(event) => {
                  event.stopPropagation()
                  handleBid(consortium)
                }}
              >
                Dar um lance
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} scrollableBoxRef={scrollableBoxRef}>
        {isAdmin && <StatusFilter filterStatusType={filterStatusType} setFilterStatusType={SetFilterStatusType} loading={loading} />}
        <SegmentFilterChip filterSegmentType={filterSegmentType} setFilterSegmentType={setFilterSegmentType} isAdmin={isAdmin} onMaxWidth={isAdmin} loading={loading} />
        <SortingBox
          loading={loading}
          setCurrentSort={setCurrentSort}
          currentSort={currentSort}
          setOrder={setOrder}
          order={order}
          sortTypes={sortTypes}
          translateKey='repasseconsorcioApp.consortium'
          onMaxWidth={isAdmin}
        />
      </AppBarComponent>
      <Box style={{ overflow: 'auto', height: 'calc(100vh - 70px)', paddingTop: '70px' }} id='scrollableDiv' ref={scrollableBoxRef}>
        <InfiniteScroll
          dataLength={consortiumList.length * paginationState.itemsPerPage}
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
              <CircularProgress color='secondary' size={30} />
            </Box>
          }
          releaseToRefreshContent={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Typography color='secondary' variant='overline'>
                Solte para atualizar
              </Typography>
              <CircularProgress color='secondary' size={30} />
            </Box>
          }
          loader={
            <div className='loader' key={0}>
              Loading ...
            </div>
          }
        >
          {loading ? (
            <ConsortiumCardSkeleton />
          ) : (
            <List sx={{ mb: '150px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {!!consortiumList?.length &&
                consortiumList?.map((consortium) => (
                  <Fragment key={consortium?.id}>
                    <ConsortiumCard consortium={consortium} />
                  </Fragment>
                ))}
            </List>
          )}
        </InfiniteScroll>
        {!consortiumList?.length && !loading && <NoDataIndicator message='Nehuma proposta encontrada' />}
      </Box>
      {openBidHistoryModal && <BidHistoryModal setOpenBidHistoryModal={setOpenBidHistoryModal} entityConsortium={entityConsortium} />}
      {openLoginModal && <HomeLogin setOpenLoginModal={setOpenLoginModal} />}
      {openBidUpdateModal && <BidUpdateModal setOpenBidUpdateModal={setOpenBidUpdateModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}

export default Consortium
