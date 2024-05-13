import React, { useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col } from 'reactstrap'
import { Translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getEntity } from './consortium-installments.reducer'
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const ConsortiumInstallmentsDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const consortiumInstallmentsEntity = useAppSelector((state) => state.consortiumInstallments.entity)
  return (
    <Row>
      <Col md='8'>
        <h2 data-cy='consortiumInstallmentsDetailsHeading'>
          <Translate contentKey='repasseconsorcioApp.consortiumInstallments.detail.title'>ConsortiumInstallments</Translate>
        </h2>
        <dl className='jh-entity-details'>
          <dt>
            <span id='id'>
              <Translate contentKey='global.field.id'>ID</Translate>
            </span>
          </dt>
          <dd>{consortiumInstallmentsEntity.id}</dd>
          <dt>
            <span id='numberOfInstallments'>
              <Translate contentKey='repasseconsorcioApp.consortiumInstallments.numberOfInstallments'>Number Of Installments</Translate>
            </span>
          </dt>
          <dd>{consortiumInstallmentsEntity.numberOfInstallments}</dd>
          <dt>
            <span id='installmentValue'>
              <Translate contentKey='repasseconsorcioApp.consortiumInstallments.installmentValue'>Installment Value</Translate>
            </span>
          </dt>
          <dd>{consortiumInstallmentsEntity.installmentValue}</dd>
          <dt>
            <Translate contentKey='repasseconsorcioApp.consortiumInstallments.consortium'>Consortium</Translate>
          </dt>
          <dd>{consortiumInstallmentsEntity.consortium ? consortiumInstallmentsEntity.consortium.id : ''}</dd>
        </dl>
        <Button tag={Link} to='/consortium-installments' replace color='info' data-cy='entityDetailsBackButton'>
          <FontAwesomeIcon icon='arrow-left' />{' '}
          <span className='d-none d-md-inline'>
            <Translate contentKey='entity.action.back'>Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/consortium-installments/${consortiumInstallmentsEntity.id}/edit`} replace color='primary'>
          <FontAwesomeIcon icon='pencil-alt' />{' '}
          <span className='d-none d-md-inline'>
            <Translate contentKey='entity.action.edit'>Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  )
}

export default ConsortiumInstallmentsDetail
