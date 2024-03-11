import React, { Fragment, useEffect, useState } from 'react'
import { Translate, getSortState } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { Spinner } from 'reactstrap'

import { Add, Delete, EditOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ConsortiumAdministratorUpdateModal } from './ConsortiumAdministratorUpdateModal'
import { deleteEntity, getEntities, reset } from './consortium-administrator.reducer'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { SortingBox } from 'app/shared/components/SortingBox'
import { get } from 'lodash'

export const ConsortiumAdministrator = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search))
  const [sorting, setSorting] = useState(false)
  const [openConsorciumAdministratorUpdateModal, setOpenConsorciumAdministratorUpdateModal] = useState<boolean>(false)
  const [consortiumAdministrator, setConsortiumAdministrator] = useState<IConsortiumAdministrator>(null)
  const [currentSort, setCurrentSort] = useState('name')
  const [order, setOrder] = useState(ASC)
  const sortTypes = ['name']

  const consortiumAdministratorList = useAppSelector((state) => state.consortiumAdministrator.entities)
  const loading = useAppSelector((state) => state.consortiumAdministrator.loading)
  const totalItems = useAppSelector((state) => state.consortiumAdministrator.totalItems)
  const links = useAppSelector((state) => state.consortiumAdministrator.links)
  const entity = useAppSelector((state) => state.consortiumAdministrator.entity)
  const updateSuccess = useAppSelector((state) => state.consortiumAdministrator.updateSuccess)

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: currentSort + ',' + order,
      })
    )
  }

  useEffect(() => {
    getAllEntities()
  }, [currentSort, order])

  const deleteConsortiumAdministrator = (consortiumAdministratorId: number) => {
    dispatch(deleteEntity(consortiumAdministratorId))
  }

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 2, sm: 3 } }}>
        <Typography color='secondary' fontWeight={'600'} fontSize={'18px'}>
          <Translate contentKey='repasseconsorcioApp.consortiumAdministrator.detail.title'>Consortium Administrators</Translate>
        </Typography>
        <Button startIcon={<Add style={{ fontSize: 18 }} />} sx={{ ml: 'auto' }} variant='contained' color='secondary' size='small' onClick={() => [setOpenConsorciumAdministratorUpdateModal(true), setConsortiumAdministrator(null)]}>
          <Translate contentKey='entity.action.add'>Add</Translate>
        </Button>
      </Box> */}
      <AppBarComponent loading={loading} onClick={() => setOpenConsorciumAdministratorUpdateModal(true)}>
        {/* <UserFilterChip filterStatusType={filterStatusType} setFilterStatusType={setFilterStatusType} /> */}
        <SortingBox setCurrentSort={setCurrentSort} currentSort={currentSort} setOrder={setOrder} order={order} sortTypes={sortTypes} translateKey='repasseconsorcioApp.consortiumAdministrator' />
      </AppBarComponent>
      {loading ? (
        <Loading />
      ) : (
        <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)' }} id='scrollableDiv'>
          <InfiniteScroll
            dataLength={consortiumAdministratorList.length}
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
              {!!consortiumAdministratorList?.length &&
                consortiumAdministratorList?.map((consortium, index) => (
                  <Fragment key={consortium.id}>
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
                      onClick={() => [setOpenConsorciumAdministratorUpdateModal(true), setConsortiumAdministrator(consortium)]}
                    >
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Avatar alt={consortium?.name} src={consortium?.name} sx={{ width: { sx: 40, sm: 50 }, height: { sx: 40, sm: 50 } }} />
                      </ListItemIcon>
                      <ListItemText primary={consortium?.name} primaryTypographyProps={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem) !important' }} />
                      <IconButton>
                        <EditOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
                      </IconButton>
                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation(), deleteConsortiumAdministrator(consortium.id)
                        }}
                      >
                        <Delete sx={{ color: defaultTheme.palette.error.main }} fontSize='small' />
                      </IconButton>
                    </ListItem>
                  </Fragment>
                ))}
            </List>
          </InfiniteScroll>
          {!consortiumAdministratorList?.length && <NoDataIndicator />}
          {openConsorciumAdministratorUpdateModal && (
            <ConsortiumAdministratorUpdateModal setOpenConsorciumAdministratorUpdateModal={setOpenConsorciumAdministratorUpdateModal} consortiumAdministrator={consortiumAdministrator} />
          )}
        </Box>
      )}
    </ThemeProvider>
  )
}

export default ConsortiumAdministrator
