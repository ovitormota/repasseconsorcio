import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { Translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntity, deleteEntity } from './bid.reducer'

export const BidDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const bidEntity = useAppSelector((state) => state.bid.entity)
  const updateSuccess = useAppSelector((state) => state.bid.updateSuccess)

  const handleClose = () => {
    props.history.push('/meus-lances')
  }

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const confirmDelete = () => {
    dispatch(deleteEntity(bidEntity.id))
  }

  return (
    <Modal isOpen toggle={handleClose}>
      <ModalHeader toggle={handleClose} data-cy='bidDeleteDialogHeading'>
        <Translate contentKey='entity.delete.title'>Confirm delete operation</Translate>
      </ModalHeader>
      <ModalBody id='repasseconsorcioApp.bid.delete.question'>
        <Translate contentKey='repasseconsorcioApp.bid.delete.question' interpolate={{ id: bidEntity.id }}>
          Are you sure you want to delete this Bid?
        </Translate>
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={handleClose}>
          <FontAwesomeIcon icon='ban' />
          &nbsp;
          <Translate contentKey='entity.action.cancel'>Cancel</Translate>
        </Button>
        <Button id='app-confirm-delete-bid' data-cy='entityConfirmDeleteButton' color='danger' onClick={confirmDelete}>
          <FontAwesomeIcon icon='trash' />
          &nbsp;
          <Translate contentKey='entity.action.delete'>Delete</Translate>
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default BidDeleteDialog
