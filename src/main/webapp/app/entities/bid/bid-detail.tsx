import React, { useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col } from 'reactstrap'
import { Translate, TextFormat } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getEntity } from './bid.reducer'
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const BidDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const bidEntity = useAppSelector((state) => state.bid.entity)
  return (
    <Row>
      <Col md='8'>
        <h2 data-cy='bidDetailsHeading'>
          <Translate contentKey='repasseconsorcioApp.bid.detail.title'>Bid</Translate>
        </h2>
        <dl className='jh-entity-details'>
          <dt>
            <span id='id'>
              <Translate contentKey='global.field.id'>ID</Translate>
            </span>
          </dt>
          <dd>{bidEntity.id}</dd>
          <dt>
            <span id='value'>
              <Translate contentKey='repasseconsorcioApp.bid.value'>Value</Translate>
            </span>
          </dt>
          <dd>{bidEntity.value}</dd>
          <dt>
            <span id='created'>
              <Translate contentKey='repasseconsorcioApp.bid.created'>Created</Translate>
            </span>
          </dt>
          <dd>{bidEntity.created ? <TextFormat value={bidEntity.created} type='date' format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey='repasseconsorcioApp.bid.user'>User</Translate>
          </dt>
          <dd>{bidEntity.user ? bidEntity.user.id : ''}</dd>
          <dt>
            <Translate contentKey='repasseconsorcioApp.bid.consortium'>Consortium</Translate>
          </dt>
          <dd>{bidEntity.consortium ? bidEntity.consortium.id : ''}</dd>
        </dl>
        <Button tag={Link} to='/meus-lances' replace color='info' data-cy='entityDetailsBackButton'>
          <FontAwesomeIcon icon='arrow-left' />{' '}
          <span className='d-none d-md-inline'>
            <Translate contentKey='entity.action.back'>Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/meus-lances/${bidEntity.id}/edit`} replace color='primary'>
          <FontAwesomeIcon icon='pencil-alt' />{' '}
          <span className='d-none d-md-inline'>
            <Translate contentKey='entity.action.edit'>Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  )
}

export default BidDetail
