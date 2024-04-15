import React, { useEffect, useRef, useState } from 'react'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'

import { Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, ThemeProvider, Tooltip } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { AccountRegister } from 'app/modules/account/register/AccountRegister'
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate'
import { AvatarWithSkeleton } from 'app/shared/components/AvatarWithSkeleton'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { UserFilterChip } from 'app/shared/components/UserFilterChip'
import { SkeletonTable } from 'app/shared/components/skeleton/SkeletonTable'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { TypographStyled } from 'app/shared/layout/table/TableComponents'
import { defaultTheme } from 'app/shared/layout/themes'
import { StatusType } from 'app/shared/model/enumerations/status.model'
import { IUser } from 'app/shared/model/user.model'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getUsersAsAdmin, updateUser } from './user-management.reducer'

export const UserManagement = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()
  const scrollableBoxRef = useRef<HTMLDivElement>(null)
  const { isSMScreen } = useBreakpoints()

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, 20, 'id'), props.location.search))
  const [openAccountRegisterUpdateModal, setOpenAccountRegisterUpdateModal] = React.useState(false)
  const [openAccountRegisterModal, setOpenAccountRegisterModal] = React.useState(false)
  const [filterStatusType, setFilterStatusType] = useState(StatusType.ALL)
  const [editUser, setEditUser] = useState<IUser | null>(null)
  const [currentSort, setCurrentSort] = useState('firstName')
  const [sorting, setSorting] = useState(false)
  const [order, setOrder] = useState<'desc' | 'asc'>(ASC)

  const users = useAppSelector((state) => state.userManagement.users)
  const loading = useAppSelector((state) => state.userManagement.loading)
  const links = useAppSelector((state) => state.userManagement.links)

  const getAllEntities = () => {
    dispatch(
      getUsersAsAdmin({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${currentSort},${order}`,
        filterStatusType,
      })
    )
  }

  useEffect(() => {
    getAllEntities()
  }, [paginationState.activePage, filterStatusType, currentSort, order])

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  const toggleActive = (event, user) => {
    event.stopPropagation()
    event.preventDefault()
    dispatch(
      updateUser({
        ...user,
        activated: !user.activated,
      })
    ).then(() => {
      getAllEntities()
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
      <AppBarComponent loading={loading} onClick={() => setOpenAccountRegisterModal(true)} scrollableBoxRef={scrollableBoxRef}>
        <UserFilterChip filterStatusType={filterStatusType} setFilterStatusType={setFilterStatusType} loading={loading} />
      </AppBarComponent>

      <Box style={{ overflow: 'auto', height: 'calc(100vh - 70px)', paddingTop: '70px' }} id='scrollableDiv' ref={scrollableBoxRef}>
        <InfiniteScroll
          dataLength={users?.length}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          scrollableTarget='scrollableDiv'
          loader={loading && <Loading height='150px' />}
        >
          {users?.length ? (
            <TableContainer sx={{ mb: '150px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <Table>
                <TableHead style={{ position: 'relative' }}>
                  <TableRow>
                    <TableCell />
                    <TableCell>
                      <TableSortLabel active={currentSort === 'firstName'} direction={order} onClick={createHandleSort('firstName')}>
                        <TypographStyled>{translate('userManagement.firstName')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <TableSortLabel active={currentSort === 'email'} direction={order} onClick={createHandleSort('email')}>
                        <TypographStyled>{translate('userManagement.email')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel active={currentSort === 'activated'} direction={order} onClick={createHandleSort('activated')}>
                        <TypographStyled>{translate('userManagement.status')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {!!users?.length &&
                    users?.map((user, index) => (
                      <TableRow key={user.id} onClick={() => [setOpenAccountRegisterUpdateModal(true), setEditUser(user)]}>
                        <TableCell>
                          <AvatarWithSkeleton imageUrl={user.imageUrl} firstName={user.firstName} width={isSMScreen ? '50px' : '45px'} />
                        </TableCell>
                        <TableCell>{user?.firstName + ' ' + user?.lastName}</TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{user?.email}</TableCell>
                        <TableCell>
                          <Tooltip title={user?.activated ? 'Inativar' : 'Ativar'} placement='top' onClick={(event) => [event.stopPropagation(), toggleActive(event, user)]}>
                            <Chip label={user?.activated ? 'Ativo' : 'Inativo'} color={user?.activated ? 'success' : 'error'} variant='outlined' />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : !loading ? (
            <NoDataIndicator message='Nenhum usuário encontrado' />
          ) : (
            <Loading />
          )}
        </InfiniteScroll>
      </Box>
      {openAccountRegisterModal && <AccountRegister setOpenAccountRegisterModal={setOpenAccountRegisterModal} />}
      {openAccountRegisterUpdateModal && <AccountRegisterUpdate setOpenAccountRegisterUpdateModal={setOpenAccountRegisterUpdateModal} editUser={editUser} getAllEntities={getAllEntities} />}
    </ThemeProvider>
  )
}
