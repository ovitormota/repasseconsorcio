import React, { useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col } from 'reactstrap'
import { Translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getEntity } from './notification-token.reducer'
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const NotificationTokenDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const notificationTokenEntity = useAppSelector((state) => state.notificationToken.entity)
  return (
    <Row>
      <Col md='8'>
        <h2 data-cy='notificationTokenDetailsHeading'>
          <Translate contentKey='fleetSenseApp.notificationToken.detail.title'>NotificationToken</Translate>
        </h2>
        <dl className='jh-entity-details'>
          <dt>
            <span id='id'>
              <Translate contentKey='global.field.id'>ID</Translate>
            </span>
          </dt>
          <dd>{notificationTokenEntity.id}</dd>
          <dt>
            <span id='token'>
              <Translate contentKey='fleetSenseApp.notificationToken.token'>Token</Translate>
            </span>
          </dt>
          <dd>{notificationTokenEntity.token}</dd>
          <dt>
            <Translate contentKey='fleetSenseApp.notificationToken.user'>User</Translate>
          </dt>
          <dd>{notificationTokenEntity.user ? notificationTokenEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to='/notification-token' replace color='info' data-cy='entityDetailsBackButton'>
          <FontAwesomeIcon icon='arrow-left' />{' '}
          <span className='d-none d-md-inline'>
            <Translate contentKey='entity.action.back'>Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/notification-token/${notificationTokenEntity.id}/edit`} replace color='primary'>
          <FontAwesomeIcon icon='pencil-alt' />{' '}
          <span className='d-none d-md-inline'>
            <Translate contentKey='entity.action.edit'>Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  )
}

export default NotificationTokenDetail
