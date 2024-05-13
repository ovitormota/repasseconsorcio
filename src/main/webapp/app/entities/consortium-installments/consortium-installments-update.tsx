import React, { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Row, Col, FormText } from 'reactstrap'
import { isNumber, Translate, translate, ValidatedField, ValidatedForm } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { IConsortium } from 'app/shared/model/consortium.model'
import { getEntities as getConsortiums } from 'app/entities/consortium/consortium.reducer'
import { getEntity, updateEntity, createEntity, reset } from './consortium-installments.reducer'
import { IConsortiumInstallments } from 'app/shared/model/consortium-installments.model'
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils'
import { mapIdList } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'

export const ConsortiumInstallmentsUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  const [isNew] = useState(!props.match.params || !props.match.params.id)

  const consortiums = useAppSelector((state) => state.consortium.entities)
  const consortiumInstallmentsEntity = useAppSelector((state) => state.consortiumInstallments.entity)
  const loading = useAppSelector((state) => state.consortiumInstallments.loading)
  const updating = useAppSelector((state) => state.consortiumInstallments.updating)
  const updateSuccess = useAppSelector((state) => state.consortiumInstallments.updateSuccess)

  const handleClose = () => {
    props.history.push('/consortium-installments')
  }

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(props.match.params.id))
    }

    dispatch(getConsortiums({}))
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values) => {
    const entity = {
      ...consortiumInstallmentsEntity,
      ...values,
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
      ? {}
      : {
          ...consortiumInstallmentsEntity,
          consortiumId: consortiumInstallmentsEntity?.consortium?.id,
        }

  return (
    <div>
      <Row className='justify-content-center'>
        <Col md='8'>
          <h2 id='repasseconsorcioApp.consortiumInstallments.home.createOrEditLabel' data-cy='ConsortiumInstallmentsCreateUpdateHeading'>
            <Translate contentKey='repasseconsorcioApp.consortiumInstallments.home.createOrEditLabel'>Create or edit a ConsortiumInstallments</Translate>
          </h2>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col md='8'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name='id' required readOnly id='consortium-installments-id' label={translate('global.field.id')} validate={{ required: true }} /> : null}
              <ValidatedField
                label={translate('repasseconsorcioApp.consortiumInstallments.numberOfInstallments')}
                id='consortium-installments-numberOfInstallments'
                name='numberOfInstallments'
                data-cy='numberOfInstallments'
                type='text'
              />
              <ValidatedField
                label={translate('repasseconsorcioApp.consortiumInstallments.installmentValue')}
                id='consortium-installments-installmentValue'
                name='installmentValue'
                data-cy='installmentValue'
                type='text'
              />
              <ValidatedField id='consortium-installments-consortium' name='consortiumId' data-cy='consortium' label={translate('repasseconsorcioApp.consortiumInstallments.consortium')} type='select'>
                <option value='' key='0' />
                {consortiums
                  ? consortiums.map((otherEntity) => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id='cancel-save' data-cy='entityCreateCancelButton' to='/consortium-installments' replace color='info'>
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

export default ConsortiumInstallmentsUpdate
