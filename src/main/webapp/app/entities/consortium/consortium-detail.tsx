import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './consortium.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const ConsortiumDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const consortiumEntity = useAppSelector(state => state.consortium.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="consortiumDetailsHeading">
          <Translate contentKey="repasseconsorcioApp.consortium.detail.title">Consortium</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.id}</dd>
          <dt>
            <span id="consortiumValue">
              <Translate contentKey="repasseconsorcioApp.consortium.consortiumValue">Consortium Value</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.consortiumValue}</dd>
          <dt>
            <span id="created">
              <Translate contentKey="repasseconsorcioApp.consortium.created">Created</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.created ? <TextFormat value={consortiumEntity.created} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="minimumBidValue">
              <Translate contentKey="repasseconsorcioApp.consortium.minimumBidValue">Minimum Bid Value</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.minimumBidValue}</dd>
          <dt>
            <span id="numberOfInstallments">
              <Translate contentKey="repasseconsorcioApp.consortium.numberOfInstallments">Number Of Installments</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.numberOfInstallments}</dd>
          <dt>
            <span id="installmentValue">
              <Translate contentKey="repasseconsorcioApp.consortium.installmentValue">Installment Value</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.installmentValue}</dd>
          <dt>
            <span id="segmentType">
              <Translate contentKey="repasseconsorcioApp.consortium.segmentType">Segment Type</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.segmentType}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="repasseconsorcioApp.consortium.status">Status</Translate>
            </span>
          </dt>
          <dd>{consortiumEntity.status}</dd>
          <dt>
            <Translate contentKey="repasseconsorcioApp.consortium.user">User</Translate>
          </dt>
          <dd>{consortiumEntity.user ? consortiumEntity.user.id : ''}</dd>
          <dt>
            <Translate contentKey="repasseconsorcioApp.consortium.consortiumAdministrator">Consortium Administrator</Translate>
          </dt>
          <dd>{consortiumEntity.consortiumAdministrator ? consortiumEntity.consortiumAdministrator.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/consortium" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/consortium/${consortiumEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ConsortiumDetail;
