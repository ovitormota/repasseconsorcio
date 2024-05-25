import { OpenInNewRounded } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, List, ListItem, ThemeProvider, Typography } from '@mui/material'
import { AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { HomeLogin } from 'app/modules/login/HomeLogin'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AuctionTimer } from 'app/shared/components/AuctionTimer'
import { ConsortiumCardSkeleton } from 'app/shared/components/ConsortiumCardSkeleton'
import { ConsortiumInstallmentsModal } from 'app/shared/components/ConsortiumInstallmentsModal'
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
import { addPercentage, formatCurrency, getStatusColor, openPdfViewer, showElement } from 'app/shared/util/data-utils'
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
  const [openConsortiumInstallmentsModal, setOpenConsortiumInstallmentsModal] = useState(false)
  const [onConsortium, setOnConsortium] = useState<IConsortium>(null)
  const [currentSort, setCurrentSort] = useState('consortiumValue')
  const [order, setOrder] = useState(ASC)
  const sortTypes = ['consortiumAdministrator', 'contemplationStatus', 'numberOfInstallments', 'installmentValue', 'minimumBidValue', 'consortiumValue']

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

  const handleOpenConsortiumInstallmentsModal = (_event, _onConsortium: IConsortium) => {
    _event.stopPropagation()
    setOpenConsortiumInstallmentsModal(true)
    setOnConsortium(_onConsortium)
  }

  const ConsortiumCard = ({ consortium }: { consortium: IConsortium }) => {
    const { segmentType, consortiumValue, created, contemplationStatus, minimumBidValue, status, bids, amountsPaid } = consortium

    return (
      <Card
        sx={{
          m: { xs: 1.1, sm: 1.1 },
          width: { xs: '90vw', sm: '330px' },
          borderRadius: '1rem',
          position: 'relative',
        }}
        elevation={2}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, position: 'absolute', top: 15, left: 15 }}>
          <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '12px' }}>#{consortium?.id}</strong>
        </Box>
        <CardContent
          sx={{
            marginTop: '-30px',
            padding: '1em !important',
            paddingTop: '0.5em !important',
            paddingBottom: '0 !important',
          }}
        >
          <Box sx={{ mt: 1, p: 1, borderRadius: '1em', position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', mt: 1 }}>
              <Box
                onClick={() =>
                  (isAdmin ? !!consortium.consortiumExtract : !!consortium?.editedConsortiumExtract) && openPdfViewer(isAdmin ? consortium.consortiumExtract : consortium.editedConsortiumExtract)
                }
              >
                <Typography variant='caption' fontStyle='italic' fontSize={13} color={defaultTheme.palette.text.secondary}>
                  Mais informações{' '}
                </Typography>
                <OpenInNewRounded
                  style={{ fontSize: '16px', marginBottom: '1px' }}
                  color={(isAdmin ? !!consortium.consortiumExtract : !!consortium?.editedConsortiumExtract) ? 'secondary' : 'disabled'}
                />
              </Box>
              <Box onClick={() => handleBidHistory(consortium)} style={showElement(!!bids?.length && isAuthenticated)}>
                <Typography variant='caption' fontStyle='italic' fontSize={13} color={defaultTheme.palette.text.secondary}>
                  Visualizar Lances{''}
                </Typography>
                <OpenInNewRounded style={{ fontSize: '16px', marginBottom: '1px' }} color='secondary' />
              </Box>
            </Box>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.segmentType')}
              </Typography>
              <span className='divider' />
              <Typography variant='caption' color={defaultTheme.palette.text.primary} fontSize={13}>
                {translate(`repasseconsorcioApp.SegmentType.${segmentType}`)}
              </Typography>
            </Typography>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                {translate('repasseconsorcioApp.consortium.consortiumValue')}
              </Typography>
              <span className='divider' />
              <Typography variant='caption' color={defaultTheme.palette.text.primary} fontSize={13}>
                {formatCurrency(consortiumValue)}
              </Typography>
            </Typography>
          </Box>
          <Box
            sx={{
              mb: 1,
              p: 1,
              background: defaultTheme.palette.secondary['A100'],
              borderRadius: '1em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
              <Box
                sx={{
                  p: '5px 10px',
                  borderRadius: '1em',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: defaultTheme.palette.background.paper,
                }}
              >
                <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                  {translate('repasseconsorcioApp.consortium.minimumBidValue')}
                </Typography>
                <Typography fontSize={14} color={defaultTheme.palette.text.primary}>
                  {formatCurrency(bids?.length ? addPercentage(minimumBidValue) : minimumBidValue)}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: '5px 10px',
                  borderRadius: '1em',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: defaultTheme.palette.background.paper,
                }}
              >
                <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                  {translate('repasseconsorcioApp.consortium.amountsPaid')}
                </Typography>
                <Typography fontSize={14} color={defaultTheme.palette.text.primary}>
                  {formatCurrency(amountsPaid)}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                p: '5px 10px',
                borderRadius: '1em',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 1,
                backgroundColor: defaultTheme.palette.background.paper,
              }}
            >
              <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                Ganho de
              </Typography>
              <Typography
                sx={{
                  color: defaultTheme.palette.success.main,
                  display: 'inline',
                  fontWeight: 600,
                }}
                variant='h6'
              >
                {formatCurrency(amountsPaid - minimumBidValue)}
              </Typography>
            </Box>
          </Box>

          <AuctionTimer created={created} consortium={consortium} />
          <ListItem>
            <Button
              sx={{
                borderRadius: '1em',
                marginBottom: '0.5em',
                background: defaultTheme.palette.secondary.light,
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
              <Typography variant='button'>Participar</Typography>
            </Button>
          </ListItem>
        </CardContent>
      </Card>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} scrollableBoxRef={scrollableBoxRef}>
        {isAdmin && <StatusFilter filterStatusType={filterStatusType} setFilterStatusType={SetFilterStatusType} />}
        <SegmentFilterChip filterSegmentType={filterSegmentType} setFilterSegmentType={setFilterSegmentType} isAdmin={isAdmin} onMaxWidth={isAdmin} />
        <SortingBox
          setCurrentSort={setCurrentSort}
          currentSort={currentSort}
          setOrder={setOrder}
          order={order}
          sortTypes={sortTypes}
          translateKey='repasseconsorcioApp.consortium'
          onMaxWidth={isAdmin}
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
      {openBidUpdateModal && <BidUpdateModal setOpenBidUpdateModal={setOpenBidUpdateModal} entityConsortium={entityConsortium} />}
      {openConsortiumInstallmentsModal && <ConsortiumInstallmentsModal setOpenConsortiumInstallmentsModal={setOpenConsortiumInstallmentsModal} consortium={onConsortium} />}
    </ThemeProvider>
  )
}

export default Consortium
