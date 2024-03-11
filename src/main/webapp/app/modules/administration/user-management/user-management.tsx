// import React, { useState, useEffect } from 'react';
// import { Link, RouteComponentProps } from 'react-router-dom';
// import { Button, Table, Row, Badge } from 'reactstrap';
// import { Translate, TextFormat, JhiPagination, JhiItemCount, getSortState } from 'react-jhipster';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { APP_DATE_FORMAT } from 'app/config/constants';
// import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
// import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
// import { getUsersAsAdmin, updateUser } from './user-management.reducer';
// import { useAppDispatch, useAppSelector } from 'app/config/store';

// export const UserManagement = (props: RouteComponentProps<any>) => {
//   const dispatch = useAppDispatch();

//   const [pagination, setPagination] = useState(
//     overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
//   );

//   const getUsersFromProps = () => {
//     dispatch(
//       getUsersAsAdmin({
//         page: pagination.activePage - 1,
//         size: pagination.itemsPerPage,
//         sort: `${pagination.sort},${pagination.order}`,
//       })
//     );
//     const endURL = `?page=${pagination.activePage}&sort=${pagination.sort},${pagination.order}`;
//     if (props.location.search !== endURL) {
//       props.history.push(`${props.location.pathname}${endURL}`);
//     }
//   };

//   useEffect(() => {
//     getUsersFromProps();
//   }, [pagination.activePage, pagination.order, pagination.sort]);

//   useEffect(() => {
//     const params = new URLSearchParams(props.location.search);
//     const page = params.get('page');
//     const sortParam = params.get(SORT);
//     if (page && sortParam) {
//       const sortSplit = sortParam.split(',');
//       setPagination({
//         ...pagination,
//         activePage: +page,
//         sort: sortSplit[0],
//         order: sortSplit[1],
//       });
//     }
//   }, [props.location.search]);

//   const sort = p => () =>
//     setPagination({
//       ...pagination,
//       order: pagination.order === ASC ? DESC : ASC,
//       sort: p,
//     });

//   const handlePagination = currentPage =>
//     setPagination({
//       ...pagination,
//       activePage: currentPage,
//     });

//   const handleSyncList = () => {
//     getUsersFromProps();
//   };

//   const toggleActive = user => () =>
//     dispatch(
//       updateUser({
//         ...user,
//         activated: !user.activated,
//       })
//     );

//   const { match } = props;
//   const account = useAppSelector(state => state.authentication.account);
//   const users = useAppSelector(state => state.userManagement.users);
//   const totalItems = useAppSelector(state => state.userManagement.totalItems);
//   const loading = useAppSelector(state => state.userManagement.loading);

//   return (
//     <div>
//       <h2 id="user-management-page-heading" data-cy="userManagementPageHeading">
//         <Translate contentKey="userManagement.home.title">Users</Translate>
//         <div className="d-flex justify-content-end">
//           <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
//             <FontAwesomeIcon icon="sync" spin={loading} />{' '}
//             <Translate contentKey="userManagement.home.refreshListLabel">Refresh List</Translate>
//           </Button>
//           <Link to={`${match.url}/new`} className="btn btn-primary jh-create-entity">
//             <FontAwesomeIcon icon="plus" /> <Translate contentKey="userManagement.home.createLabel">Create a new user</Translate>
//           </Link>
//         </div>
//       </h2>
//       <Table responsive striped>
//         <thead>
//           <tr>
//             <th className="hand" onClick={sort('id')}>
//               <Translate contentKey="global.field.id">ID</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th className="hand" onClick={sort('login')}>
//               <Translate contentKey="userManagement.login">Login</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th className="hand" onClick={sort('email')}>
//               <Translate contentKey="userManagement.email">Email</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th />
//             <th className="hand" onClick={sort('langKey')}>
//               <Translate contentKey="userManagement.langKey">Lang Key</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th>
//               <Translate contentKey="userManagement.profiles">Profiles</Translate>
//             </th>
//             <th className="hand" onClick={sort('createdDate')}>
//               <Translate contentKey="userManagement.createdDate">Created Date</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th className="hand" onClick={sort('lastModifiedBy')}>
//               <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th id="modified-date-sort" className="hand" onClick={sort('lastModifiedDate')}>
//               <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>
//               <FontAwesomeIcon icon="sort" />
//             </th>
//             <th />
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user, i) => (
//             <tr id={user.login} key={`user-${i}`}>
//               <td>
//                 <Button tag={Link} to={`${match.url}/${user.login}`} color="link" size="sm">
//                   {user.id}
//                 </Button>
//               </td>
//               <td>{user.login}</td>
//               <td>{user.email}</td>
//               <td>
//                 {user.activated ? (
//                   <Button color="success" onClick={toggleActive(user)}>
//                     <Translate contentKey="userManagement.activated">Activated</Translate>
//                   </Button>
//                 ) : (
//                   <Button color="danger" onClick={toggleActive(user)}>
//                     <Translate contentKey="userManagement.deactivated">Deactivated</Translate>
//                   </Button>
//                 )}
//               </td>
//               <td>{user.langKey}</td>
//               <td>
//                 {user.authorities
//                   ? user.authorities.map((authority, j) => (
//                       <div key={`user-auth-${i}-${j}`}>
//                         <Badge color="info">{authority}</Badge>
//                       </div>
//                     ))
//                   : null}
//               </td>
//               <td>
//                 {user.createdDate ? <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid /> : null}
//               </td>
//               <td>{user.lastModifiedBy}</td>
//               <td>
//                 {user.lastModifiedDate ? (
//                   <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
//                 ) : null}
//               </td>
//               <td className="text-right">
//                 <div className="btn-group flex-btn-group-container">
//                   <Button tag={Link} to={`${match.url}/${user.login}`} color="info" size="sm">
//                     <FontAwesomeIcon icon="eye" />{' '}
//                     <span className="d-none d-md-inline">
//                       <Translate contentKey="entity.action.view">View</Translate>
//                     </span>
//                   </Button>
//                   <Button tag={Link} to={`${match.url}/${user.login}/edit`} color="primary" size="sm">
//                     <FontAwesomeIcon icon="pencil-alt" />{' '}
//                     <span className="d-none d-md-inline">
//                       <Translate contentKey="entity.action.edit">Edit</Translate>
//                     </span>
//                   </Button>
//                   <Button
//                     tag={Link}
//                     to={`${match.url}/${user.login}/delete`}
//                     color="danger"
//                     size="sm"
//                     disabled={account.login === user.login}
//                   >
//                     <FontAwesomeIcon icon="trash" />{' '}
//                     <span className="d-none d-md-inline">
//                       <Translate contentKey="entity.action.delete">Delete</Translate>
//                     </span>
//                   </Button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//       {totalItems ? (
//         <div className={users && users.length > 0 ? '' : 'd-none'}>
//           <Row className="justify-content-center">
//             <JhiItemCount page={pagination.activePage} total={totalItems} itemsPerPage={pagination.itemsPerPage} i18nEnabled />
//           </Row>
//           <Row className="justify-content-center">
//             <JhiPagination
//               activePage={pagination.activePage}
//               onSelect={handlePagination}
//               maxButtons={5}
//               itemsPerPage={pagination.itemsPerPage}
//               totalItems={totalItems}
//             />
//           </Row>
//         </div>
//       ) : (
//         ''
//       )}
//     </div>
//   );
// };

// export default UserManagement;

import React, { Fragment, useEffect, useState } from 'react'
import { Translate, getSortState } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'
import { Spinner } from 'reactstrap'

import { Add, Delete, EditOutlined } from '@mui/icons-material'
import { Avatar, Box, Button, Chip, IconButton, List, ListItem, ListItemIcon, ListItemText, ThemeProvider, Tooltip, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getUsersAsAdmin, updateUser } from './user-management.reducer'
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate'
import { IUser } from 'app/shared/model/user.model'
import { AccountRegister } from 'app/modules/account/register/AccountRegister'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { SortingBox } from 'app/shared/components/SortingBox'
import { StatusType } from 'app/shared/model/enumerations/status.model'
import { UserFilterChip } from 'app/shared/components/UserFilterChip'

export const UserManagement = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search))
  const [openAccountRegisterUpdateModal, setOpenAccountRegisterUpdateModal] = React.useState(false)
  const [openAccountRegisterModal, setOpenAccountRegisterModal] = React.useState(false)
  const [filterStatusType, setFilterStatusType] = useState(StatusType.ALL)
  const [editUser, setEditUser] = useState<IUser | null>(null)
  const [currentSort, setCurrentSort] = useState('firstName')
  const [order, setOrder] = useState(ASC)
  const sortTypes = ['firstName', 'email']

  const users = useAppSelector((state) => state.userManagement.users)
  const totalItems = useAppSelector((state) => state.userManagement.totalItems)
  const loading = useAppSelector((state) => state.userManagement.loading)
  const links = useAppSelector((state) => state.userManagement.links)
  const updateSuccess = useAppSelector((state) => state.userManagement.updateSuccess)

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
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} onClick={() => setOpenAccountRegisterModal(true)}>
        <UserFilterChip filterStatusType={filterStatusType} setFilterStatusType={setFilterStatusType} />
        <SortingBox setCurrentSort={setCurrentSort} currentSort={currentSort} setOrder={setOrder} order={order} sortTypes={sortTypes} translateKey='userManagement' />
      </AppBarComponent>
      {loading ? (
        <Loading />
      ) : (
        <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)' }} id='scrollableDiv'>
          <InfiniteScroll
            dataLength={users.length}
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
              {!!users?.length &&
                users?.map((user, index) => (
                  <Fragment key={user.id}>
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
                      onClick={() => [setOpenAccountRegisterUpdateModal(true), setEditUser(user)]}
                    >
                      <ListItemIcon sx={{ mr: 2 }}>
                        <Avatar alt={user?.firstName} src={user?.firstName} sx={{ width: { sx: 40, sm: 50 }, height: { sx: 40, sm: 50 } }} />
                      </ListItemIcon>
                      <ListItemText primary={user?.firstName + ' ' + user?.lastName} primaryTypographyProps={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem) !important' }} />
                      <ListItemText primary={user?.email} primaryTypographyProps={{ fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem) !important' }} sx={{ display: { xs: 'none', md: 'center' } }} />
                      <ListItemIcon>
                        <Tooltip title={user?.activated ? 'Inativar' : 'Ativar'} placement='top'>
                          <Chip label={user?.activated ? 'Ativo' : 'Inativo'} color={user?.activated ? 'success' : 'error'} variant='outlined' onClick={(event) => toggleActive(event, user)} />
                        </Tooltip>
                      </ListItemIcon>
                    </ListItem>
                  </Fragment>
                ))}
            </List>
          </InfiniteScroll>
          {!users?.length && <NoDataIndicator />}
          {openAccountRegisterModal && <AccountRegister setOpenAccountRegisterModal={setOpenAccountRegisterModal} />}
          {openAccountRegisterUpdateModal && <AccountRegisterUpdate setOpenAccountRegisterUpdateModal={setOpenAccountRegisterUpdateModal} editUser={editUser} />}
        </Box>
      )}
    </ThemeProvider>
  )
}

export default UserManagement
