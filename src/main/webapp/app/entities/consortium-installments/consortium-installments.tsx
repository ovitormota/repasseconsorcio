import React, { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row, Table } from 'reactstrap'
import { Translate, getSortState } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getEntities, reset } from './consortium-installments.reducer'
import { IConsortiumInstallments } from 'app/shared/model/consortium-installments.model'
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const ConsortiumInstallments = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search))
  const [sorting, setSorting] = useState(false)

  const consortiumInstallmentsList = useAppSelector((state) => state.consortiumInstallments.entities)
  const loading = useAppSelector((state) => state.consortiumInstallments.loading)
  const totalItems = useAppSelector((state) => state.consortiumInstallments.totalItems)
  const links = useAppSelector((state) => state.consortiumInstallments.links)
  const entity = useAppSelector((state) => state.consortiumInstallments.entity)
  const updateSuccess = useAppSelector((state) => state.consortiumInstallments.updateSuccess)

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    )
  }

  const resetAll = () => {
    dispatch(reset())
    setPaginationState({
      ...paginationState,
      activePage: 1,
    })
    dispatch(getEntities({}))
  }

  useEffect(() => {
    resetAll()
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      resetAll()
    }
  }, [updateSuccess])

  useEffect(() => {
    getAllEntities()
  }, [paginationState.activePage])

  const handleLoadMore = () => {
    if ((window as any).pageYOffset > 0) {
      setPaginationState({
        ...paginationState,
        activePage: paginationState.activePage + 1,
      })
    }
  }

  useEffect(() => {
    if (sorting) {
      getAllEntities()
      setSorting(false)
    }
  }, [sorting])

  const sort = (p) => () => {
    dispatch(reset())
    setPaginationState({
      ...paginationState,
      activePage: 1,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    })
    setSorting(true)
  }

  const handleSyncList = () => {
    resetAll()
  }

  const { match } = props

  return (
    <div>
      <h2 id='consortium-installments-heading' data-cy='ConsortiumInstallmentsHeading'>
        <Translate contentKey='repasseconsorcioApp.consortiumInstallments.home.title'>Consortium Installments</Translate>
        <div className='d-flex justify-content-end'>
          <Button className='mr-2' color='info' onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon='sync' spin={loading} /> <Translate contentKey='repasseconsorcioApp.consortiumInstallments.home.refreshListLabel'>Refresh List</Translate>
          </Button>
          <Link to={`${match.url}/new`} className='btn btn-primary jh-create-entity' id='jh-create-entity' data-cy='entityCreateButton'>
            <FontAwesomeIcon icon='plus' />
            &nbsp;
            <Translate contentKey='repasseconsorcioApp.consortiumInstallments.home.createLabel'>Create new Consortium Installments</Translate>
          </Link>
        </div>
      </h2>
      <div className='table-responsive'>
        <InfiniteScroll
          pageStart={paginationState.activePage}
          loadMore={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          loader={<div className='loader'>Loading ...</div>}
          threshold={0}
          initialLoad={false}
        >
          {consortiumInstallmentsList && consortiumInstallmentsList.length > 0 ? (
            <Table responsive>
              <thead>
                <tr>
                  <th className='hand' onClick={sort('id')}>
                    <Translate contentKey='repasseconsorcioApp.consortiumInstallments.id'>ID</Translate> <FontAwesomeIcon icon='sort' />
                  </th>
                  <th className='hand' onClick={sort('numberOfInstallments')}>
                    <Translate contentKey='repasseconsorcioApp.consortiumInstallments.numberOfInstallments'>Number Of Installments</Translate> <FontAwesomeIcon icon='sort' />
                  </th>
                  <th className='hand' onClick={sort('installmentValue')}>
                    <Translate contentKey='repasseconsorcioApp.consortiumInstallments.installmentValue'>Installment Value</Translate> <FontAwesomeIcon icon='sort' />
                  </th>
                  <th>
                    <Translate contentKey='repasseconsorcioApp.consortiumInstallments.consortium'>Consortium</Translate> <FontAwesomeIcon icon='sort' />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {consortiumInstallmentsList.map((consortiumInstallments, i) => (
                  <tr key={`entity-${i}`} data-cy='entityTable'>
                    <td>
                      <Button tag={Link} to={`${match.url}/${consortiumInstallments.id}`} color='link' size='sm'>
                        {consortiumInstallments.id}
                      </Button>
                    </td>
                    <td>{consortiumInstallments.numberOfInstallments}</td>
                    <td>{consortiumInstallments.installmentValue}</td>
                    <td>{consortiumInstallments.consortium ? <Link to={`consortium/${consortiumInstallments.consortium.id}`}>{consortiumInstallments.consortium.id}</Link> : ''}</td>
                    <td className='text-right'>
                      <div className='btn-group flex-btn-group-container'>
                        <Button tag={Link} to={`${match.url}/${consortiumInstallments.id}`} color='info' size='sm' data-cy='entityDetailsButton'>
                          <FontAwesomeIcon icon='eye' />{' '}
                          <span className='d-none d-md-inline'>
                            <Translate contentKey='entity.action.view'>View</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${consortiumInstallments.id}/edit`} color='primary' size='sm' data-cy='entityEditButton'>
                          <FontAwesomeIcon icon='pencil-alt' />{' '}
                          <span className='d-none d-md-inline'>
                            <Translate contentKey='entity.action.edit'>Edit</Translate>
                          </span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${consortiumInstallments.id}/delete`} color='danger' size='sm' data-cy='entityDeleteButton'>
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
                <Translate contentKey='repasseconsorcioApp.consortiumInstallments.home.notFound'>No Consortium Installments found</Translate>
              </div>
            )
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default ConsortiumInstallments
