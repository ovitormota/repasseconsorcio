import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { Translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntity, deleteEntity } from './consortium-installments.reducer'

export const ConsortiumInstallmentsDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const consortiumInstallmentsEntity = useAppSelector((state) => state.consortiumInstallments.entity)
  const updateSuccess = useAppSelector((state) => state.consortiumInstallments.updateSuccess)

  const handleClose = () => {
    props.history.push('/consortium-installments')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(consortiumInstallmentsEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy='consortiumInstallmentsDeleteDialogHeading'>
        <Translate contentKey='entity.delete.title'>Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id='repasseconsorcioApp.consortiumInstallments.delete.question'>
        <Translate contentKey='repasseconsorcioApp.consortiumInstallments.delete.question' interpolate={{ id: consortiumInstallmentsEntity.id }}>
          Are you sure you want to delete this ConsortiumInstallments?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={handleClose}>
          <FontAwesomeIcon icon='ban' />
          &nbsp;
          <Translate contentKey='entity.action.cancel'>Cancel</Translate>
        </Button>
        <Button id='app-confirm-delete-consortiumInstallments' data-cy='entityConfirmDeleteButton' color='danger' onClick={confirmDelete}>
          <FontAwesomeIcon icon='trash' />
          &nbsp;
          <Translate contentKey='entity.action.delete'>Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConsortiumInstallmentsDeleteDialog
