import React, { useEffect, useRef, useState } from 'react'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'

import { Delete, EditOutlined } from '@mui/icons-material'
import { Avatar, Box, CircularProgress, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { SortingBox } from 'app/shared/components/SortingBox'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { TypographStyled } from 'app/shared/layout/table/TableComponents'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { get } from 'lodash'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ConsortiumAdministratorUpdateModal } from './ConsortiumAdministratorUpdateModal'
import { deleteEntity, getEntities } from './consortium-administrator.reducer'

export const ConsortiumAdministrator = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

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
      <AppBarComponent loading={loading} onClick={() => setOpenConsorciumAdministratorUpdateModal(true)} scrollableBoxRef={scrollableBoxRef}>
        <SortingBox setCurrentSort={setCurrentSort} currentSort={currentSort} setOrder={setOrder} order={order} sortTypes={sortTypes} translateKey='repasseconsorcioApp.consortiumAdministrator' />
      </AppBarComponent>
      {loading ? (
        <Loading />
      ) : (
        <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)', paddingTop: '60px' }} id='scrollableDiv' ref={scrollableBoxRef}>
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
            <TableContainer sx={{ px: { xs: 0, sm: 2 } }}>
              <Table>
                <TableHead style={{ position: 'relative' }}>
                  <TableRow>
                    <TableCell>{/* <TypographStyled>{translate('repasseconsorcioApp.consortiumAdministrator.image')}</TypographStyled> */}</TableCell>
                    <TableCell>
                      <TypographStyled>{translate('repasseconsorcioApp.consortiumAdministrator.name')}</TypographStyled>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <hr className='hr-text' data-content='' style={{ position: 'absolute', width: '100%', top: '40px' }} />
                </TableHead>

                <TableBody>
                  {!!consortiumAdministratorList?.length &&
                    consortiumAdministratorList?.map((consortium, index) => (
                      <TableRow key={index} onClick={() => [setOpenConsorciumAdministratorUpdateModal(true), setConsortiumAdministrator(consortium)]}>
                        <TableCell>
                          <Avatar alt={consortium?.name} src={get(consortium, 'name')} sx={{ margin: 'auto' }} />
                        </TableCell>
                        <TableCell>{consortium?.name}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => [setOpenConsorciumAdministratorUpdateModal(true), setConsortiumAdministrator(consortium)]}>
                            <EditOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
                          </IconButton>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation(), deleteConsortiumAdministrator(consortium.id)
                            }}
                          >
                            <Delete sx={{ color: defaultTheme.palette.error.main }} fontSize='small' />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
