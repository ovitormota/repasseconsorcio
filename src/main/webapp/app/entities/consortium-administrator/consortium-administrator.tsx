import React, { useEffect, useRef, useState } from 'react'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'

import { Delete, EditOutlined } from '@mui/icons-material'
import { Avatar, Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { SkeletonTable } from 'app/shared/components/skeleton/SkeletonTable'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { TypographStyled } from 'app/shared/layout/table/TableComponents'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
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
  const [order, setOrder] = useState<'desc' | 'asc'>(ASC)
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

  useEffect(() => {
    if (sorting) {
      setSorting(false)
    }
  }, [sorting])

  const createHandleSort = (field: string) => () => {
    const isDesc = currentSort === field && order === DESC
    setCurrentSort(field)
    setOrder(isDesc ? 'asc' : 'desc')
    setSorting(true)
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} onClick={() => setOpenConsorciumAdministratorUpdateModal(true)} scrollableBoxRef={scrollableBoxRef}>
        <Box display='flex' alignItems='center' sx={{ width: '100%', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
          <Typography color='secondary' fontWeight={'600'} fontSize={'18px'}>
            {translate('repasseconsorcioApp.consortiumAdministrator.detail.title')}
          </Typography>
        </Box>
      </AppBarComponent>
      <Box style={{ overflow: 'auto', height: 'calc(100vh - 70px)', paddingTop: '70px' }} id='scrollableDiv' ref={scrollableBoxRef}>
        <InfiniteScroll
          dataLength={consortiumAdministratorList?.length}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          scrollableTarget='scrollableDiv'
          loader={loading && <Loading height='150px' />}
        >
          {consortiumAdministratorList?.length ? (
            <TableContainer>
              <Table>
                <TableHead style={{ position: 'relative' }}>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <TableSortLabel active={currentSort === 'name'} direction={order} onClick={createHandleSort('name')}>
                        <TypographStyled>{translate('repasseconsorcioApp.consortiumAdministrator.name')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
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
          ) : !loading ? (
            <NoDataIndicator message='Nenhum registro encontrado' />
          ) : (
            <Loading />
          )}
        </InfiniteScroll>
      </Box>
      {openConsorciumAdministratorUpdateModal && (
        <ConsortiumAdministratorUpdateModal setOpenConsorciumAdministratorUpdateModal={setOpenConsorciumAdministratorUpdateModal} consortiumAdministrator={consortiumAdministrator} />
      )}
    </ThemeProvider>
  )
}

export default ConsortiumAdministrator
