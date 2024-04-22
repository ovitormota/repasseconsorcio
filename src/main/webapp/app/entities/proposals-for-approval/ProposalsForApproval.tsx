import { ArrowOutward, DirectionsCarRounded, HomeRounded, MoreRounded } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, IconButton, List, ListItem, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate'
import { ConsortiumCardSkeleton } from 'app/shared/components/ConsortiumCardSkeleton'
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
import { addPercentage, getStatusColor } from 'app/shared/util/data-utils'
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

  // const ConsortiumCard = ({ consortium }: { consortium: IConsortium }) => {
  //   const {
  //     consortiumAdministrator: { name, image },
  //     segmentType,
  //     consortiumValue,
  //     numberOfInstallments,
  //     installmentValue,
  //     created,
  //     contemplationStatus,
  //     minimumBidValue,
  //     status,
  //     bids,
  //     user: { firstName },
  //   } = consortium

  //   return (
  //     <Card
  //       sx={{
  //         m: { xs: 1.1, sm: 1.1 },
  //         width: { xs: '90vw', sm: '330px' },
  //         borderRadius: '1rem',
  //         position: 'relative',
  //       }}
  //       elevation={2}
  //     >
  //       <Box
  //         sx={{
  //           overflow: 'hidden',
  //           width: { xs: '90vw', sm: '330px' },
  //           height: '45px',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           mb: 1,
  //         }}
  //       >
  //         <IconButton
  //           sx={{
  //             background: defaultTheme.palette.background.paper,
  //             position: 'absolute',
  //             top: 30,
  //             ':hover': {
  //               background: defaultTheme.palette.background.paper,
  //             },
  //           }}
  //         >
  //           {segmentType === SegmentType.AUTOMOBILE ? (
  //             <DirectionsCarRounded sx={{ fontSize: '30px', color: defaultTheme.palette.secondary.light }} />
  //           ) : segmentType === SegmentType.REAL_ESTATE ? (
  //             <HomeRounded sx={{ fontSize: '30px', color: defaultTheme.palette.secondary.light }} />
  //           ) : (
  //             <MoreRounded sx={{ fontSize: '25px', color: defaultTheme.palette.secondary.light }} />
  //           )}
  //         </IconButton>
  //       </Box>
  //       <Chip
  //         label={translate(`repasseconsorcioApp.ConsortiumStatusType.${status}`)}
  //         color={getStatusColor(status)}
  //         variant='filled'
  //         size='small'
  //         sx={{
  //           position: 'absolute',
  //           top: 10,
  //           right: 10,
  //           cursor: 'pointer',
  //           color: 'white',
  //         }}
  //       />
  //       {contemplationStatus && renderStatusRibbon()}
  //       <CardContent sx={{ p: 1 }}>
  //         <List>
  //           <ListItem sx={{ position: 'relative' }}>
  //             <Box sx={{ position: 'absolute', top: -15, right: 4 }}>
  //               <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '14px' }}>#{consortium?.id}</strong>
  //             </Box>
  //           </ListItem>
  //           <ListItemText
  //             primaryTypographyProps={{ fontSize: '12px !important' }}
  //             onClick={() => [setOpenAccountRegisterUpdateModal(true), setEditUser(consortium.user)]}
  //             sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
  //             primary={`${translate('repasseconsorcioApp.consortium.user')} `}
  //             secondary={
  //               <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 1, cursor: 'pointer', ':hover': { scale: '1.1 !important' } }}>
  //                 {firstName}
  //                 <ArrowOutward style={{ fontSize: '16px', marginBottom: '3px' }} color='secondary' />
  //               </Box>
  //             }
  //           />
  //           <ListItemText
  //             primaryTypographyProps={{ fontSize: '12px !important' }}
  //             sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
  //             primary={`${translate('repasseconsorcioApp.consortium.consortiumAdministrator')} `}
  //             secondary={name}
  //           />
  //           <ListItemText
  //             primaryTypographyProps={{ fontSize: '12px !important' }}
  //             sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
  //             primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')} `}
  //             secondary={numberOfInstallments}
  //           />
  //           <ListItemText
  //             primaryTypographyProps={{ fontSize: '12px !important' }}
  //             secondaryTypographyProps={{ fontWeight: '600 !important' }}
  //             sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
  //             primary={`${translate('repasseconsorcioApp.consortium.installmentValue')} `}
  //             secondary={formatCurrency(installmentValue)}
  //           />
  //           <ListItemText
  //             primaryTypographyProps={{ fontSize: '12px !important' }}
  //             sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'nowrap' }}
  //             primary={`${translate('repasseconsorcioApp.consortium.minimumBidValue')} `}
  //             secondary={formatCurrency(minimumBidValue)}
  //           />

  //           <hr className='hr-text' data-content='' style={{ height: 0 }} />

  //           <ListItem sx={{ m: 0, p: 0, py: 0.5 }}>
  //             <ListItemText
  //               primaryTypographyProps={{ fontSize: '12px !important' }}
  //               primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
  //               secondary={formatCurrency(consortiumValue)}
  //               secondaryTypographyProps={{
  //                 fontSize: '25px !important',
  //                 fontWeight: '600 !important',
  //               }}
  //             />
  //           </ListItem>
  //           <ListItem>
  //             <Button
  //               sx={{
  //                 borderRadius: '1em',
  //                 marginX: '0.6em',
  //                 background: defaultTheme.palette.secondary['A400'],

  //                 ':hover': {
  //                   background: defaultTheme.palette.secondary.light,
  //                   color: defaultTheme.palette.secondary.contrastText,
  //                 },
  //               }}
  //               variant='outlined'
  //               color='secondary'
  //               fullWidth
  //               onClick={() => setApproved(consortium)}
  //             >
  //               <Typography variant='button'>{translate('repasseconsorcioApp.consortium.approve')}</Typography>
  //             </Button>
  //           </ListItem>
  //         </List>
  //       </CardContent>
  //     </Card>
  //   )
  // }

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
      user: { firstName },
    } = consortium

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
            <Box sx={{ position: 'absolute', top: -15, left: 7 }}>
              <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '12px' }}>#{consortium?.id}</strong>
            </Box>
            <Box
              onClick={() => [setOpenAccountRegisterUpdateModal(true), setEditUser(consortium.user)]}
              sx={{ position: 'absolute', top: -10, right: 7, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }}
            >
              <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                {firstName}
              </Typography>
              <ArrowOutward style={{ fontSize: '16px', marginBottom: '3px' }} color='secondary' />
            </Box>
            <Typography sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
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
                {formatCurrency(minimumBidValue)}
              </Typography>
            </Box>
            <Typography variant='caption' color={defaultTheme.palette.text.secondary} sx={{ marginLeft: 12 }}>
              {translate('repasseconsorcioApp.consortium.consortiumValue')}
            </Typography>
            <Typography variant='h5' color={defaultTheme.palette.text.primary} sx={{ marginLeft: 12 }}>
              {formatCurrency(consortiumValue)}
            </Typography>
          </Box>

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
              onClick={() => setApproved(consortium)}
            >
              <Typography variant='button'>{translate('repasseconsorcioApp.consortium.approve')}</Typography>
            </Button>
          </ListItem>
        </CardContent>
      </Card>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} scrollableBoxRef={scrollableBoxRef}>
        <SegmentFilterChip filterSegmentType={filterSegmentType} setFilterSegmentType={setFilterSegmentType} loading={loading} />
        <SortingBox setCurrentSort={setCurrentSort} currentSort={currentSort} setOrder={setOrder} order={order} sortTypes={sortTypes} translateKey='repasseconsorcioApp.consortium' />
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
      {openAccountRegisterUpdateModal && <AccountRegisterUpdate setOpenAccountRegisterUpdateModal={setOpenAccountRegisterUpdateModal} editUser={editUser} />}
    </ThemeProvider>
  )
}
