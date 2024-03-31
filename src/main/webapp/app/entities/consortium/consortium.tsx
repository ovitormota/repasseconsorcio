import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { HomeLogin } from 'app/modules/login/HomeLogin'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AuctionTimer } from 'app/shared/components/AuctionTimer'
import { Loading } from 'app/shared/components/Loading'
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
import { formatCurrency, getStatusColor } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { BidHistoryModal } from '../bid/BidHistoryModal'
import { BidUpdateModal } from '../bid/BidUpdateModal'
import { getEntities } from './consortium.reducer'
import { ConsortiumCardSkeleton } from 'app/shared/components/ConsortiumCardSkeleton'
import { AvatarWithSkeleton } from 'app/shared/components/AvatarWithSkeleton'

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
          boxShadow: '1px 1px rgba(97, 57, 173, 0.2)',
          borderRadius: '10px',
          ':hover': {
            backgroundColor: defaultTheme.palette.primary.main,
            cursor: 'pointer',
          },
        }}
        onClick={() => isAuthenticated && handleBidHistory(consortium)}
      >
        <CardContent sx={{ p: 1.5 }}>
          <List>
            {contemplationStatus && renderStatusRibbon()}

            <ListItem sx={{ mb: 1 }}>
              <ListItemIcon sx={{ mr: 1 }}>
                <AvatarWithSkeleton imageUrl={image} firstName={name} width='50px' />
              </ListItemIcon>
              <ListItemText
                sx={{
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'flex-start',
                  flexDirection: 'column-reverse',
                  background: 'none !important',
                  padding: '0 !important',
                }}
                primaryTypographyProps={{
                  fontSize: '12px !important',
                  sx: {
                    justifyContent: 'space-between',
                    display: 'flex',
                    width: '100%',
                  },
                }}
                primary={
                  <>
                    <span>
                      {translate('repasseconsorcioApp.consortium.segmentType')}: {translate(`repasseconsorcioApp.SegmentType.${segmentType}`)}
                    </span>
                    {isAdmin && <strong style={{ color: defaultTheme.palette.secondary.main }}>#{consortium?.id}</strong>}
                  </>
                }
                secondary={name}
              />
            </ListItem>

            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')} `}
              secondary={numberOfInstallments}
            />
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.installmentValue')} `}
              secondary={formatCurrency(installmentValue)}
            />

            <ListItem sx={{ mt: 1, mb: -2 }}>
              <ListItemText
                primaryTypographyProps={{ fontSize: '12px !important' }}
                primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
                secondary={formatCurrency(consortiumValue)}
                secondaryTypographyProps={{
                  fontSize: '22px !important',
                  fontWeight: '600',
                }}
              />
            </ListItem>

            <ListItem>
              <AuctionTimer created={created} />
            </ListItem>

            <ListItem>
              <Button
                sx={{
                  mb: -3,
                  background: defaultTheme.palette.secondary.main,
                  color: defaultTheme.palette.secondary.contrastText,
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  '&:hover': {
                    backgroundColor: defaultTheme.palette.secondary.light,
                  },
                }}
                variant='contained'
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
            <Chip
              label={translate(`repasseconsorcioApp.ConsortiumStatusType.${status}`)}
              color={getStatusColor(status)}
              variant='filled'
              size='small'
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                cursor: 'pointer',
                color: 'white',
              }}
            />
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
          dataLength={consortiumList.length}
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
