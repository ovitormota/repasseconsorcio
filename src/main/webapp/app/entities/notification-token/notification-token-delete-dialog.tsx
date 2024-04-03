import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { Translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntity, deleteEntity } from './notification-token.reducer'

export const NotificationTokenDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const notificationTokenEntity = useAppSelector((state) => state.notificationToken.entity)
  const updateSuccess = useAppSelector((state) => state.notificationToken.updateSuccess)

  const handleClose = () => {
    props.history.push('/notification-token' + props.location.search)
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(notificationTokenEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy='notificationTokenDeleteDialogHeading'>
        <Translate contentKey='entity.delete.title'>Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id='fleetSenseApp.notificationToken.delete.question'>
        <Translate contentKey='fleetSenseApp.notificationToken.delete.question' interpolate={{ id: notificationTokenEntity.token }}>
          Are you sure you want to delete this NotificationToken?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={handleClose}>
          <FontAwesomeIcon icon='ban' />
          &nbsp;
          <Translate contentKey='entity.action.cancel'>Cancel</Translate>
        </Button>
        <Button id='app-confirm-delete-notificationToken' data-cy='entityConfirmDeleteButton' color='danger' onClick={confirmDelete}>
          <FontAwesomeIcon icon='trash' />
          &nbsp;
          <Translate contentKey='entity.action.delete'>Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default NotificationTokenDeleteDialog
