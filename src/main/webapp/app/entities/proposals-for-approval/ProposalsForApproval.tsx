import { OpenInNewRounded } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, List, ListItem, ThemeProvider, Typography } from '@mui/material'
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
import { getStatusColor, openPdfViewer, showElement } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { EditExtractConsortium } from './EditExtractConsortium'
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
  const [openConsortiumInstallmentsModal, setOpenConsortiumInstallmentsModal] = useState(false)
  const [openConsortiumExtractModal, setOpenConsortiumExtractModal] = useState(false)
  const [consortiumExtract, setConsortiumExtract] = React.useState<string>(null)

  const [onConsortium, setOnConsortium] = useState<IConsortium>(null)
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
    setOnConsortium(consortium)
    setOpenConsortiumExtractModal(true)
  }

  const handleSave = (event) => {
    event.preventDefault()

    if (consortiumExtract) {
      const updatedConsortium = {
        ...onConsortium,
        editedConsortiumExtract: consortiumExtract,
        status: ConsortiumStatusType.OPEN,
      }
      dispatch(partialUpdateEntity(updatedConsortium)).then(() => {
        setOpenConsortiumExtractModal(false)
        setConsortiumExtract(null)
        setOnConsortium(null)
      })
    }
  }

  const handleFileUpload = (uploadedFile) => {
    setConsortiumExtract(uploadedFile)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
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
              <Box onClick={() => openPdfViewer(consortium.consortiumExtract)}>
                <Typography variant='caption' fontStyle='italic' fontSize={13} color={defaultTheme.palette.text.secondary}>
                  Mais informações{' '}
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
                  {formatCurrency(minimumBidValue)}
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
      {/* {openConsortiumInstallmentsModal && <ConsortiumInstallmentsModal setOpenConsortiumInstallmentsModal={setOpenConsortiumInstallmentsModal} consortium={onConsortium} />} */}
      {openConsortiumExtractModal && (
        <EditExtractConsortium
          setOpenEditExtractConsortiumModal={setOpenConsortiumExtractModal}
          consortiumExtract={consortiumExtract}
          setConsortiumExtract={setConsortiumExtract}
          onConsortium={onConsortium}
          handleSave={handleSave}
        />
      )}
    </ThemeProvider>
  )
}
