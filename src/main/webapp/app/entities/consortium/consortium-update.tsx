import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col, FormText } from 'reactstrap'
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { IUser } from 'app/shared/model/user.model'
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { getEntities as getConsortiumAdministrators } from 'app/entities/consortium-administrator/consortium-administrator.reducer'
import { getEntity, updateEntity, createEntity, reset } from './consortium.reducer'
import { IConsortium } from 'app/shared/model/consortium.model'
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils'
import { mapIdList } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const ConsortiumUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  const [isNew] = useState(!props.match.params || !props.match.params.id)

  const users = useAppSelector((state) => state.userManagement.users)
  const consortiumAdministrators = useAppSelector((state) => state.consortiumAdministrator.entities)
  const consortiumEntity = useAppSelector((state) => state.consortium.entity)
  const loading = useAppSelector((state) => state.consortium.loading)
  const updating = useAppSelector((state) => state.consortium.updating)
  const updateSuccess = useAppSelector((state) => state.consortium.updateSuccess)

  const handleClose = () => {
    props.history.push('/consortium')
  }

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(props.match.params.id))
    }

    dispatch(getUsers({}))
    dispatch(getConsortiumAdministrators({}))
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values) => {
    values.created = convertDateTimeToServer(values.created)

    const entity = {
      ...consortiumEntity,
      ...values,
      user: users.find((it) => it.id.toString() === values.userId.toString()),
      consortiumAdministrator: consortiumAdministrators.find((it) => it.id.toString() === values.consortiumAdministratorId.toString()),
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
          segmentType: 'AUTOMOBILE',
          status: 'CLOSED',
          ...consortiumEntity,
          created: convertDateTimeFromServer(consortiumEntity.created),
          userId: consortiumEntity?.user?.id,
          // consortiumAdministratorId: consortiumEntity?.consortiumAdministrator?.id,
        }

  return (
    <div>
      <Row className='justify-content-center'>
        <Col md='8'>
          <h2 id='repasseconsorcioApp.consortium.home.createOrEditLabel' data-cy='ConsortiumCreateUpdateHeading'>
            <Translate contentKey='repasseconsorcioApp.consortium.home.createOrEditLabel'>Create or edit a Consortium</Translate>
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md='8'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name='id' required readOnly id='consortium-id' label={translate('global.field.id')} validate={{ required: true }} /> : null}
              <ValidatedField label={translate('repasseconsorcioApp.consortium.consortiumValue')} id='consortium-consortiumValue' name='consortiumValue' data-cy='consortiumValue' type='text' />
              <ValidatedField
                label={translate('repasseconsorcioApp.consortium.created')}
                id='consortium-created'
                name='created'
                data-cy='created'
                type='datetime-local'
                placeholder='YYYY-MM-DD HH:mm'
              />
              <ValidatedField label={translate('repasseconsorcioApp.consortium.minimumBidValue')} id='consortium-minimumBidValue' name='minimumBidValue' data-cy='minimumBidValue' type='text' />
              <ValidatedField
                label={translate('repasseconsorcioApp.consortium.numberOfInstallments')}
                id='consortium-numberOfInstallments'
                name='numberOfInstallments'
                data-cy='numberOfInstallments'
                type='text'
              />
              <ValidatedField label={translate('repasseconsorcioApp.consortium.installmentValue')} id='consortium-installmentValue' name='installmentValue' data-cy='installmentValue' type='text' />
              <ValidatedField label={translate('repasseconsorcioApp.consortium.segmentType')} id='consortium-segmentType' name='segmentType' data-cy='segmentType' type='select'>
                <option value='AUTOMOBILE'>{translate('repasseconsorcioApp.SegmentType.AUTOMOBILE')}</option>
                <option value='OTHER'>{translate('repasseconsorcioApp.SegmentType.OTHER')}</option>
                <option value='REAL_ESTATE'>{translate('repasseconsorcioApp.SegmentType.REAL_ESTATE')}</option>
              </ValidatedField>
              <ValidatedField label={translate('repasseconsorcioApp.consortium.status')} id='consortium-status' name='status' data-cy='status' type='select'>
                <option value='CLOSED'>{translate('repasseconsorcioApp.ConsortiumStatusType.CLOSED')}</option>
                <option value='OPEN'>{translate('repasseconsorcioApp.ConsortiumStatusType.OPEN')}</option>
                <option value='REGISTERED'>{translate('repasseconsorcioApp.ConsortiumStatusType.REGISTERED')}</option>
                <option value='WON'>{translate('repasseconsorcioApp.ConsortiumStatusType.WON')}</option>
              </ValidatedField>
              <ValidatedField id='consortium-user' name='userId' data-cy='user' label={translate('repasseconsorcioApp.consortium.user')} type='select'>
                <option value='' key='0' />
                {users
                  ? users.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id='consortium-consortiumAdministrator'
                name='consortiumAdministratorId'
                data-cy='consortiumAdministrator'
                label={translate('repasseconsorcioApp.consortium.consortiumAdministrator')}
                type='select'
              >
                <option value='' key='0' />
                {consortiumAdministrators
                  ? consortiumAdministrators.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id='cancel-save' data-cy='entityCreateCancelButton' to='/consortium' replace color='info'>
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

export default ConsortiumUpdate
