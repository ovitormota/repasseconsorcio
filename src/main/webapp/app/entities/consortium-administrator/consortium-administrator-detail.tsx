import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, openFile, byteSize } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './consortium-administrator.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const ConsortiumAdministratorDetail = (props: RouteComponentProps<{ id: string }>) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getEntity(props.match.params.id));
    }, []);

    const consortiumAdministratorEntity = useAppSelector(state => state.consortiumAdministrator.entity);
    return (
        <Row>
            <Col md="8">
                <h2 data-cy="consortiumAdministratorDetailsHeading">
                    <Translate contentKey="repasseconsorcioApp.consortiumAdministrator.detail.title">ConsortiumAdministrator</Translate>
                </h2>
                <dl className="jh-entity-details">
                    <dt>
                        <span id="id">
                            <Translate contentKey="global.field.id">ID</Translate>
                        </span>
                    </dt>
                    <dd>{consortiumAdministratorEntity.id}</dd>
                    <dt>
                        <span id="name">
                            <Translate contentKey="repasseconsorcioApp.consortiumAdministrator">Name</Translate>
                        </span>
                    </dt>
                    <dd>{consortiumAdministratorEntity.name}</dd>
                    <dt>
                        <span id="image">
                            <Translate contentKey="repasseconsorcioApp.consortiumAdministrator.image">Image</Translate>
                        </span>
                    </dt>
                </dl>
                <Button tag={Link} to="/consortium-administrator" replace color="info" data-cy="entityDetailsBackButton">
                    <FontAwesomeIcon icon="arrow-left" />{' '}
                    <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.back">Back</Translate>
                    </span>
                </Button>
                &nbsp;
                <Button tag={Link} to={`/consortium-administrator/${consortiumAdministratorEntity.id}/edit`} replace color="primary">
                    <FontAwesomeIcon icon="pencil-alt" />{' '}
                    <span className="d-none d-md-inline">
                        <Translate contentKey="entity.action.edit">Edit</Translate>
                    </span>
                </Button>
            </Col>
        </Row>
    );
};

export default ConsortiumAdministratorDetail;
