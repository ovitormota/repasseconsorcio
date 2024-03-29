import { ArrowOutward } from '@mui/icons-material'
import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { SegmentFilterChip } from 'app/shared/components/SegmentFilterChip'
import { SortingBox } from 'app/shared/components/SortingBox'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { IUser } from 'app/shared/model/user.model'
import { getStatusColor } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { getEntities, partialUpdateEntity } from './proposals-for-approval.reducer'

export const ProposalsForApproval = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()
  const { isSMScreen, isMDScreen } = useBreakpoints()
  const history = props.history
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'consortiumValue'), props.location.search))
  const [openAccountRegisterUpdateModal, setOpenAccountRegisterUpdateModal] = React.useState(false)
  const [editUser, setEditUser] = useState<IUser | null>(null)
  const [filterSegmentType, setFilterSegmentType] = useState(SegmentType.ALL)
  const [currentSort, setCurrentSort] = useState('consortiumValue')
  const [order, setOrder] = useState(ASC)
  const sortTypes = ['consortiumAdministrator', 'contemplationStatus', 'numberOfInstallments', 'installmentValue', 'consortiumValue']

  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const consortiumList = useAppSelector((state) => state.proposalsForApproval.entities)
  const loading = useAppSelector((state) => state.proposalsForApproval.loading)
  const links = useAppSelector((state) => state.proposalsForApproval.links)

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${currentSort},${order}`,
        filterSegmentType,
      })
    )
  }

  useEffect(() => {
    getAllEntities()
  }, [paginationState.activePage, filterSegmentType, currentSort, order])

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  const setApproved = (consortium: IConsortium) => {
    const updatedConsortium = {
      ...consortium,
      status: ConsortiumStatusType.OPEN,
    }

    dispatch(partialUpdateEntity(updatedConsortium))
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const renderStatusRibbon = () => (
    <div className='ribbon'>
      <a href=''>{translate('repasseconsorcioApp.consortium.contemplationTypeStatus.approved')}</a>
    </div>
  )

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
      user: { firstName },
    } = consortium
    return (
      <Card
        sx={{
          mx: { xs: 1.1, sm: 1.1 },
          my: { xs: 1.1, sm: 1.1 },
          width: { xs: '90vw', sm: '330px' },
          background: defaultTheme.palette.background.paper,
          boxShadow: '0px 2px 2px 1px rgba(97, 57, 173, 0.2)',
          borderRadius: '10px',
        }}
      >
        <CardContent>
          <List>
            {contemplationStatus && renderStatusRibbon()}

            <ListItem sx={{ mb: 1 }}>
              <ListItemIcon sx={{ mr: 1 }}>
                <Avatar alt={name} src={name} sx={{ width: 50, height: 50 }} />
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
                    <strong style={{ color: defaultTheme.palette.secondary.main }}>#{consortium?.id}</strong>
                  </>
                }
                secondary={name}
              />
            </ListItem>

            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              onClick={() => [setOpenAccountRegisterUpdateModal(true), setEditUser(consortium.user)]}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.user')} `}
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 1, cursor: 'pointer', ':hover': { scale: '1.1 !important' } }}>
                  <Typography variant='caption'>{firstName}</Typography>
                  <ArrowOutward style={{ fontSize: '16px', marginBottom: '3px' }} color='secondary' />
                </Box>
              }
            />

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
            <ListItemText
              primaryTypographyProps={{ fontSize: '12px !important' }}
              sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
              primary={`${translate('repasseconsorcioApp.consortium.minimumBidValue')} `}
              secondary={formatCurrency(minimumBidValue)}
            />

            <ListItem sx={{ mt: 2, mb: 1 }}>
              <ListItemText
                primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
                secondary={formatCurrency(consortiumValue)}
                secondaryTypographyProps={{
                  fontSize: '22px !important',
                  fontWeight: '600',
                }}
              />
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
                onClick={() => setApproved(consortium)}
              >
                {translate('repasseconsorcioApp.consortium.approve')}
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
        <SegmentFilterChip filterSegmentType={filterSegmentType} setFilterSegmentType={setFilterSegmentType} />
        <SortingBox setCurrentSort={setCurrentSort} currentSort={currentSort} setOrder={setOrder} order={order} sortTypes={sortTypes} translateKey='repasseconsorcioApp.consortium' />
      </AppBarComponent>
      {loading ? (
        <Loading />
      ) : (
        <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)', paddingTop: '60px' }} id='scrollableDiv' ref={scrollableBoxRef}>
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
            <List sx={{ mb: '150px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {!!consortiumList?.length &&
                consortiumList?.map((consortium) => (
                  <Fragment key={consortium?.id}>
                    <ConsortiumCard consortium={consortium} />
                  </Fragment>
                ))}
            </List>
          </InfiniteScroll>
          {!consortiumList?.length && <NoDataIndicator />}
          {openAccountRegisterUpdateModal && <AccountRegisterUpdate setOpenAccountRegisterUpdateModal={setOpenAccountRegisterUpdateModal} editUser={editUser} />}
        </Box>
      )}
    </ThemeProvider>
  )
}
