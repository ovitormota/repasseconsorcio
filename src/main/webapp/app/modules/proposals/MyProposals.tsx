import { DirectionsCarRounded, HomeRounded, MoreRounded } from '@mui/icons-material'
import { Box, Card, CardContent, Chip, CircularProgress, IconButton, List, ListItem, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { BidHistoryModal } from 'app/entities/bid/BidHistoryModal'
import { HomeLogin } from 'app/modules/login/HomeLogin'
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
import { getEntities } from './my-proposal.reducer'
import { Loading } from 'app/shared/components/Loading'

export const MyProposals = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const sortTypes = ['consortiumAdministrator', 'contemplationStatus', 'numberOfInstallments', 'installmentValue', 'consortiumValue']
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'consortiumValue'), props.location.search))
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [openBidHistoryModal, setOpenBidHistoryModal] = useState(false)
  const [entityConsortium, setEntityConsortium] = useState<IConsortium>(null)
  const [filterSegmentType, setFilterSegmentType] = useState(SegmentType.ALL)
  const [filterStatusType, setFilterStatusType] = useState(ConsortiumStatusType.ALL)
  const [currentSort, setCurrentSort] = useState('consortiumValue')
  const [order, setOrder] = useState(ASC)

  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const consortiumList = useAppSelector((state) => state.myProposals.entities)
  const loading = useAppSelector((state) => state.myProposals.loading)
  const links = useAppSelector((state) => state.myProposals.links)

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
          m: { xs: 1.1, sm: 1.1 },
          width: { xs: '90vw', sm: '330px' },
          borderRadius: '1rem',
          position: 'relative',

          ':hover': {
            md: {
              scale: '1.03',
              transition: 'all 0.3s ease',
            },
          },
        }}
        elevation={2}
      >
        <Box
          sx={{
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
              top: 45,
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, position: 'absolute', top: 10, right: 10 }}>
          <Chip
            label={consortium.bids?.length ? `${consortium.bids.length} ${consortium.bids.length > 1 ? 'lances' : 'lance'}` : 'Sem lances'}
            variant='filled'
            size='small'
            style={showElement(!!consortium?.bids?.length)}
            sx={{
              cursor: 'pointer',
              background: defaultTheme.palette.background.paper,
              color: defaultTheme.palette.secondary.main,
            }}
          />
          <Chip
            label={translate(`repasseconsorcioApp.ConsortiumStatusType.${status}`)}
            color={getStatusColor(status)}
            size='small'
            sx={{
              cursor: 'pointer',
              color: defaultTheme.palette.secondary.contrastText,
            }}
          />
        </Box>
        {contemplationStatus && renderStatusRibbon()}
        <CardContent sx={{ p: 1.5 }}>
          <List>
            <ListItem sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: -15, right: 4 }}>
                <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '14px' }}>#{consortium?.id}</strong>
              </Box>
            </ListItem>
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
            <List sx={{ p: 0 }}>
              <AuctionTimer created={created} consortium={consortium} />
            </List>
          </List>
        </CardContent>
      </Card>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} scrollableBoxRef={scrollableBoxRef}>
        <StatusFilter filterStatusType={filterStatusType} setFilterStatusType={setFilterStatusType} loading={loading} />
        <SegmentFilterChip filterSegmentType={filterSegmentType} setFilterSegmentType={setFilterSegmentType} onMaxWidth loading={loading} />
        <SortingBox
          loading={loading}
          setCurrentSort={setCurrentSort}
          currentSort={currentSort}
          setOrder={setOrder}
          order={order}
          sortTypes={sortTypes}
          translateKey='repasseconsorcioApp.consortium'
          onMaxWidth
        />
      </AppBarComponent>
      <Box sx={{ overflow: 'auto', height: 'calc(100vh - 70px)', paddingY: '70px' }} id='scrollableDiv' ref={scrollableBoxRef}>
        <InfiniteScroll
          dataLength={consortiumList?.length}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          scrollableTarget='scrollableDiv'
          loader={loading && <Loading height='150px' />}
        >
          {consortiumList?.length ? (
            <List sx={{ mb: '150px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {!!consortiumList?.length &&
                consortiumList?.map((consortium) => (
                  <Fragment key={consortium?.id}>
                    <ConsortiumCard consortium={consortium} />
                  </Fragment>
                ))}
            </List>
          ) : !loading ? (
            <NoDataIndicator message='Nenhuma proposta encontrada' />
          ) : (
            <ConsortiumCardSkeleton items={ITEMS_PER_PAGE} />
          )}
        </InfiniteScroll>
      </Box>

      {openBidHistoryModal && <BidHistoryModal setOpenBidHistoryModal={setOpenBidHistoryModal} entityConsortium={entityConsortium} />}
      {openLoginModal && <HomeLogin setOpenLoginModal={setOpenLoginModal} />}
    </ThemeProvider>
  )
}
