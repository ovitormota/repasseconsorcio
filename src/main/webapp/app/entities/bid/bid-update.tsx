import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col, FormText } from 'reactstrap'
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { IUser } from 'app/shared/model/user.model'
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer'
import { IConsortium } from 'app/shared/model/consortium.model'
import { getEntities as getConsortiums } from 'app/entities/consortium/consortium.reducer'
import { getEntity, updateEntity, createEntity, reset } from './bid.reducer'
import { IBid } from 'app/shared/model/bid.model'
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils'
import { mapIdList } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const BidUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  const [isNew] = useState(!props.match.params || !props.match.params.id)

  const users = useAppSelector((state) => state.userManagement.users)
  const consortiums = useAppSelector((state) => state.consortium.entities)
  const bidEntity = useAppSelector((state) => state.bid.entity)
  const loading = useAppSelector((state) => state.bid.loading)
  const updating = useAppSelector((state) => state.bid.updating)
  const updateSuccess = useAppSelector((state) => state.bid.updateSuccess)

  const handleClose = () => {
    props.history.push('/meus-lances')
  }

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(props.match.params.id))
    }

    dispatch(getUsers({}))
    dispatch(getConsortiums({}))
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values) => {
    values.created = convertDateTimeToServer(values.created)

    const entity = {
      ...bidEntity,
      ...values,
      user: users.find((it) => it.id.toString() === values.userId.toString()),
      consortium: consortiums.find((it) => it.id.toString() === values.consortiumId.toString()),
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew
      ? {
          created: displayDefaultDateTime(),
        }
      : {
          ...bidEntity,
          created: convertDateTimeFromServer(bidEntity.created),
          userId: bidEntity?.user?.id,
          consortiumId: bidEntity?.consortium?.id,
        }

  return (
    <div>
      <Row className='justify-content-center'>
        <Col md='8'>
          <h2 id='repasseconsorcioApp.bid.home.createOrEditLabel' data-cy='BidCreateUpdateHeading'>
            <Translate contentKey='repasseconsorcioApp.bid.home.createOrEditLabel'>Create or edit a Bid</Translate>
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md='8'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name='id' required readOnly id='bid-id' label={translate('global.field.id')} validate={{ required: true }} /> : null}
              <ValidatedField label={translate('repasseconsorcioApp.bid.value')} id='bid-value' name='value' data-cy='value' type='text' />
              <ValidatedField label={translate('repasseconsorcioApp.bid.created')} id='bid-created' name='created' data-cy='created' type='datetime-local' placeholder='YYYY-MM-DD HH:mm' />
              <ValidatedField id='bid-user' name='userId' data-cy='user' label={translate('repasseconsorcioApp.bid.user')} type='select'>
                <option value='' key='0' />
                {users
                  ? users.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id='bid-consortium' name='consortiumId' data-cy='consortium' label={translate('repasseconsorcioApp.bid.consortium')} type='select'>
                <option value='' key='0' />
                {consortiums
                  ? consortiums.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id='cancel-save' data-cy='entityCreateCancelButton' to='/bid' replace color='info'>
                <FontAwesomeIcon icon='arrow-left' />
                &nbsp;
                <span className='d-none d-md-inline'>
                  <Translate contentKey='entity.action.back'>Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color='primary' id='save-entity' data-cy='entityCreateSaveButton' type='submit' disabled={updating}>
                <FontAwesomeIcon icon='save' />
                &nbsp;
                <Translate contentKey='entity.action.save'>Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  )
}

export default BidUpdate
