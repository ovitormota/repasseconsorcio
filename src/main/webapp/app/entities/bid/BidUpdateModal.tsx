import React, { useEffect } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, ThemeProvider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { ModalUseTerms } from 'app/shared/components/ModalUseTerms'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { addPercentage, formatCurrency, isEmptyObject } from 'app/shared/util/data-utils'
import { NumericFormat } from 'react-number-format'
import { createEntity, getLatestEntity, reset } from './bid.reducer'
import { BidModalUseTerms } from 'app/shared/components/BidModalUseTerms'

interface IBidUpdateModalProps {
  setOpenBidUpdateModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const BidUpdateModal = ({ setOpenBidUpdateModal, entityConsortium }: IBidUpdateModalProps) => {
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.bid.loading)
  const updateSuccess = useAppSelector((state) => state.bid.updateSuccess)
  const errorMessage = useAppSelector((state) => state.bid.errorMessage)
  const bidEntity = useAppSelector((state) => state.bid.entity)
  const [acceptTerms, setAcceptTerms] = React.useState<boolean>(false)
  const [modalUseTerms, setModalUseTerms] = React.useState<boolean>(false)

  const [bidValue, setBidValue] = React.useState<number>(null)

  useEffect(() => {
    if (entityConsortium?.id) {
      dispatch(getLatestEntity(entityConsortium.id))
    }
  }, [])

  useEffect(() => {
    if (errorMessage) {
      dispatch(getLatestEntity(entityConsortium.id))
    }
  }, [errorMessage])

  useEffect(() => {
    if (updateSuccess) {
      setOpenBidUpdateModal(false)
      dispatch(reset())
    }
  }, [updateSuccess])

  useEffect(() => {
    if (acceptTerms) {
      saveEntity()
    }
  }, [acceptTerms])

  const openModalUseTerms = (event) => {
    event.preventDefault()

    setModalUseTerms(true)
  }

  const saveEntity = () => {
    const entity = {
      value: bidValue,
      consortium: entityConsortium,
    }

    dispatch(createEntity(entity))
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: 1, minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenBidUpdateModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Translate contentKey='repasseconsorcioApp.bid.home.createLabel'>Create a new Bid</Translate>
          <IconButton onClick={() => setOpenBidUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Loading height='10vh' />
          ) : (
            <form onSubmit={openModalUseTerms}>
              <NumericFormat
                required
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'R$ '}
                label={translate('repasseconsorcioApp.bid.value')}
                id='bid-value'
                fullWidth
                color='secondary'
                helperText={
                  <div>
                    {'O valor mínimo do lance é '}
                    <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '14px' }}>
                      {isEmptyObject(bidEntity) ? formatCurrency(addPercentage(bidEntity?.value)) : formatCurrency(addPercentage(entityConsortium?.minimumBidValue))}
                    </strong>
                  </div>
                }
                onValueChange={(values) => setBidValue(+values.floatValue)}
                sx={{ mt: 1 }}
                InputProps={{
                  style: { borderRadius: '1rem' },
                }}
              />

              <DialogActions sx={{ mt: 2, px: 2 }}>
                <Button onClick={() => setOpenBidUpdateModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
                  <Translate contentKey='entity.action.cancel'>Cancel</Translate>
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  color='secondary'
                  disabled={!bidValue || bidValue < (isEmptyObject(bidEntity) ? addPercentage(bidEntity?.value) : addPercentage(entityConsortium?.minimumBidValue))}
                  sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}
                >
                  <Translate contentKey='entity.action.register'>Register</Translate>
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
        {modalUseTerms && <BidModalUseTerms isOpen={modalUseTerms} setOpen={setModalUseTerms} acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms} />}
      </Dialog>
    </ThemeProvider>
  )
}
