import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col, FormText } from 'reactstrap'
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { IUser } from 'app/shared/model/user.model'
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer'
import { getEntity, updateEntity, createEntity, reset } from './notification-token.reducer'
import { INotificationToken } from 'app/shared/model/notification-token.model'
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils'
import { mapIdList } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const NotificationTokenUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  const [isNew] = useState(!props.match.params || !props.match.params.id)

  const users = useAppSelector((state) => state.userManagement.users)
  const notificationTokenEntity = useAppSelector((state) => state.notificationToken.entity)
  const loading = useAppSelector((state) => state.notificationToken.loading)
  const updating = useAppSelector((state) => state.notificationToken.updating)
  const updateSuccess = useAppSelector((state) => state.notificationToken.updateSuccess)

  const handleClose = () => {
    props.history.push('/notification-token' + props.location.search)
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(props.match.params.id))
    }

    dispatch(getUsers({}))
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values) => {
    const entity = {
      ...notificationTokenEntity,
      ...values,
      user: users.find((it) => it.id.toString() === values.userId.toString()),
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...notificationTokenEntity,
          userId: notificationTokenEntity?.user?.id,
        }

  return (
    <div>
      <Row className='justify-content-center'>
        <Col md='8'>
          <h2 id='fleetSenseApp.notificationToken.home.createOrEditLabel' data-cy='NotificationTokenCreateUpdateHeading'>
            <Translate contentKey='fleetSenseApp.notificationToken.home.createOrEditLabel'>Create or edit a NotificationToken</Translate>
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md='8'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name='id' required readOnly id='notification-token-id' label={translate('global.field.id')} validate={{ required: true }} /> : null}
              <ValidatedField label={translate('fleetSenseApp.notificationToken.token')} id='notification-token-token' name='token' data-cy='token' type='text' />
              <ValidatedField id='notification-token-user' name='userId' data-cy='user' label={translate('fleetSenseApp.notificationToken.user')} type='select'>
                <option value='' key='0' />
                {users
                  ? users.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.login}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id='cancel-save' data-cy='entityCreateCancelButton' to='/notification-token' replace color='info'>
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

export default NotificationTokenUpdate
