import { Box, Card, CardContent, Chip, List, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { BidHistoryModal } from 'app/entities/bid/BidHistoryModal'
import { HomeLogin } from 'app/modules/login/HomeLogin'
import { AuctionTimer } from 'app/shared/components/AuctionTimer'
import { ConsortiumCardSkeleton } from 'app/shared/components/ConsortiumCardSkeleton'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { SegmentFilterChip } from 'app/shared/components/SegmentFilterChip'
import { SortingBox } from 'app/shared/components/SortingBox'
import { StatusFilter } from 'app/shared/components/StatusFilter'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { addPercentage, formatCurrency, getStatusColor, showElement } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { getEntities } from './my-proposal.reducer'

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
        onClick={() => (isAuthenticated ? handleBidHistory(consortium) : setOpenLoginModal(true))}
      >
        <Box
          sx={{
            overflow: 'hidden',
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            my: 1,
            background: defaultTheme.palette.secondary['A100'],
          }}
        >
          {<img src={`content/images/${segmentType === SegmentType.AUTOMOBILE ? 'car' : segmentType === SegmentType.REAL_ESTATE ? 'house' : 'other'}.png`} height='100%' />}
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
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
        <CardContent
          sx={{
            marginTop: '-30px',
            padding: '1em !important',
            paddingTop: '0.5em !important',
            paddingBottom: '0 !important',
          }}
        >
          <Box sx={{ my: 1, p: 1, borderRadius: '1em', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: -15, right: 7 }}>
              <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '12px' }}>#{consortium?.id}</strong>
            </Box>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.segmentType')}
              </Typography>
              <span className='divider' />
              <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                {translate(`repasseconsorcioApp.SegmentType.${segmentType}`)}
              </Typography>
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.consortiumAdministrator')}
              </Typography>
              <span className='divider' />
              <Typography variant='caption'>{name}</Typography>
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.numberOfInstallments')}
              </Typography>
              <span className='divider' />
              <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                {numberOfInstallments}
              </Typography>
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.installmentValue')}
              </Typography>
              <span className='divider' />
              <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                {formatCurrency(installmentValue)}
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              my: 1,
              p: 1,
              background: defaultTheme.palette.secondary['A100'],
              borderRadius: '1em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 5,
                left: 5,
                p: '5px 10px',
                borderRadius: '1em',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: defaultTheme.palette.primary.main,
              }}
            >
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.minimumBidValue')}
              </Typography>
              <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                {formatCurrency(bids?.length ? addPercentage(minimumBidValue) : minimumBidValue)}
              </Typography>
            </Box>
            <Typography variant='caption' color={defaultTheme.palette.text.secondary} sx={{ marginLeft: 12 }}>
              {translate('repasseconsorcioApp.consortium.consortiumValue')}
            </Typography>
            <Typography variant='h5' color={defaultTheme.palette.text.primary} sx={{ marginLeft: 12 }}>
              {formatCurrency(consortiumValue)}
            </Typography>
          </Box>

          <AuctionTimer created={created} consortium={consortium} />
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
