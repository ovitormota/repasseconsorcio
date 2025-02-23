import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { JhiItemCount, JhiPagination, Translate, getSortState } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Table } from 'reactstrap'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants'
import { getEntities } from './notification-token.reducer'

export const NotificationToken = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search))

  const notificationTokenList = useAppSelector((state) => state.notificationToken.entities)
  const loading = useAppSelector((state) => state.notificationToken.loading)
  const totalItems = useAppSelector((state) => state.notificationToken.totalItems)

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    )
  }

  const sortEntities = () => {
    getAllEntities()
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`)
    }
  }

  useEffect(() => {
    sortEntities()
  }, [paginationState.activePage, paginationState.order, paginationState.sort])

  useEffect(() => {
    const params = new URLSearchParams(props.location.search)
    const page = params.get('page')
    const sort = params.get(SORT)
    if (page && sort) {
      const sortSplit = sort.split(',')
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      })
    }
  }, [props.location.search])

  const sort = (p) => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    })
  }

  const handlePagination = (currentPage) =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    })

  const handleSyncList = () => {
    sortEntities()
  }

  const { match } = props

  return (
    <div>
      <div className='table-responsive'>
        {notificationTokenList && notificationTokenList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className='hand' onClick={sort('id')}>
                  <Translate contentKey='fleetSenseApp.notificationToken.id'>ID</Translate> <FontAwesomeIcon icon='sort' />
                </th>
                <th className='hand' onClick={sort('token')}>
                  <Translate contentKey='fleetSenseApp.notificationToken.token'>Token</Translate> <FontAwesomeIcon icon='sort' />
                </th>
                <th>
                  <Translate contentKey='fleetSenseApp.notificationToken.user'>User</Translate> <FontAwesomeIcon icon='sort' />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notificationTokenList.map((notificationToken, i) => (
                <tr key={`entity-${i}`} data-cy='entityTable'>
                  <td>
                    <Button tag={Link} to={`${match.url}/${notificationToken.id}`} color='link' size='sm'>
                      {notificationToken.id}
                    </Button>
                  </td>
                  <td>{notificationToken.token}</td>
                  <td>{notificationToken.user ? notificationToken.user.login : ''}</td>
                  <td className='text-right'>
                    <div className='btn-group flex-btn-group-container'>
                      <Button tag={Link} to={`${match.url}/${notificationToken.id}`} color='info' size='sm' data-cy='entityDetailsButton'>
                        <FontAwesomeIcon icon='eye' />{' '}
                        <span className='d-none d-md-inline'>
                          <Translate contentKey='entity.action.view'>View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${notificationToken.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color='primary'
                        size='sm'
                        data-cy='entityEditButton'
                      >
                        <FontAwesomeIcon icon='pencil-alt' />{' '}
                        <span className='d-none d-md-inline'>
                          <Translate contentKey='entity.action.edit'>Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${notificationToken.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color='danger'
                        size='sm'
                        data-cy='entityDeleteButton'
                      >
                        <FontAwesomeIcon icon='trash' />{' '}
                        <span className='d-none d-md-inline'>
                          <Translate contentKey='entity.action.delete'>Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className='alert alert-warning'>
              <Translate contentKey='fleetSenseApp.notificationToken.home.notFound'>No Notification Tokens found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={notificationTokenList && notificationTokenList.length > 0 ? '' : 'd-none'}>
          <Row className='justify-content-center'>
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </Row>
          <Row className='justify-content-center'>
            <JhiPagination activePage={paginationState.activePage} onSelect={handlePagination} maxButtons={5} itemsPerPage={paginationState.itemsPerPage} totalItems={totalItems} />
          </Row>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default NotificationToken
