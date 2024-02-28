import React, { useEffect } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, ThemeProvider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { IConsortium } from 'app/shared/model/consortium.model'
import { NumericFormat } from 'react-number-format'
import { defaultTheme } from 'app/shared/layout/themes'
import { createEntity, getEntity, getLatestEntity, reset } from './bid.reducer'
import { Loading } from 'app/shared/components/Loading'
import { formatCurrency, isEmptyObject } from 'app/shared/util/data-utils'

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

  const saveEntity = (event) => {
    event.preventDefault()

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
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: 1, minWidth: { xs: '92vw', sm: '80vw', md: '50vw' } },
        }}
        onClose={() => setOpenBidUpdateModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Translate contentKey='repasseconsorcioApp.bid.home.createLabel'>Create a new Bid</Translate>
          <IconButton onClick={() => setOpenBidUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.text.secondary }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Loading height='10vh' />
          ) : (
            <form onSubmit={saveEntity}>
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
                    <strong style={{ color: defaultTheme.palette.secondary.main }}>{isEmptyObject(bidEntity) ? formatCurrency(bidEntity?.value + 1) : formatCurrency(entityConsortium?.minimumBidValue + 1)}</strong>
                  </div>
                }
                onValueChange={(values) => setBidValue(+values.floatValue)}
                sx={{ mt: 1 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />

              <DialogActions sx={{ mt: 2, px: 0 }}>
                <Button onClick={() => setOpenBidUpdateModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
                  <Translate contentKey='entity.action.cancel'>Cancel</Translate>
                </Button>
                <Button type='submit' variant='contained' color='secondary' disabled={!bidValue || bidValue <= (isEmptyObject(bidEntity) ? bidEntity?.value + 1 : entityConsortium?.minimumBidValue + 1)} sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}>
                  <Translate contentKey='entity.action.save'>Save</Translate>
                </Button>
              </DialogActions>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
