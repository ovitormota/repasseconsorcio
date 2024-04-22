import React, { useEffect } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined, CopyAllRounded } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, ThemeProvider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { BidModalUseTerms } from 'app/shared/components/BidModalUseTerms'
import { Loading } from 'app/shared/components/Loading'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { addPercentage, formatCurrency, isNotEmptyObject } from 'app/shared/util/data-utils'
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { NumericFormat } from 'react-number-format'
import { getEntitiesByConsortium, reset } from './bid-by-consortium.reducer'
import { createEntity, getLatestEntity } from './bid.reducer'
import { getEntity } from '../consortium/consortium.reducer'
import { useHistory } from 'react-router-dom'

interface IBidUpdateModalProps {
  setOpenBidUpdateModal: (open: boolean) => void
  entityConsortium: IConsortium
}

export const BidUpdateModal = ({ setOpenBidUpdateModal, entityConsortium }: IBidUpdateModalProps) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const loading = useAppSelector((state) => state.bid.loading)
  const updateSuccess = useAppSelector((state) => state.bid.updateSuccess)
  const errorMessage = useAppSelector((state) => state.bid.errorMessage)
  const latestBidValue = useAppSelector((state) => state.bid.value)
  const [acceptTerms, setAcceptTerms] = React.useState<boolean>(false)
  const [modalUseTerms, setModalUseTerms] = React.useState<boolean>(false)
  const [copyMinimumBidValue, setCopyMinimumBidValue] = React.useState<boolean>(false)

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

    dispatch(createEntity(entity)).then(() => {
      history.replace(`/bid`)
    })
  }

  const setMinimumBidValue = () => {
    if (latestBidValue) {
      return addPercentage(latestBidValue)
    } else {
      return addPercentage(entityConsortium?.minimumBidValue)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenBidUpdateModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Translate contentKey='repasseconsorcioApp.bid.home.createLabel'>Create a new Bid</Translate>
          <IconButton onClick={() => setOpenBidUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Loading height='10vh' />
          ) : (
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
              value={copyMinimumBidValue ? setMinimumBidValue() : 0}
              helperText={
                <Box flexDirection='row' display='flex' alignItems='center' gap={1}>
                  {'O valor mínimo do lance é:'}
                  <Box onClick={() => setCopyMinimumBidValue(true)} sx={{ cursor: 'pointer' }}>
                    <strong style={{ color: defaultTheme.palette.secondary.main, fontSize: '14px' }}>{formatCurrency(setMinimumBidValue())}</strong>
                    <CopyAllRounded color='secondary' sx={{ fontSize: '16px', mb: '5px', ml: '3px', fontWeight: '600' }} />
                  </Box>
                </Box>
              }
              onValueChange={(values) => setBidValue(+values.floatValue)}
              sx={{ mt: 4 }}
              InputProps={{
                style: { borderRadius: '10px' },
              }}
            />
          )}
        </DialogContent>
        <form onSubmit={openModalUseTerms}>
          <DialogActions>
            <Button onClick={() => setOpenBidUpdateModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
              <Translate contentKey='entity.action.cancel'>Cancel</Translate>
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={!bidValue || bidValue < (latestBidValue ? addPercentage(latestBidValue) : addPercentage(entityConsortium?.minimumBidValue))}
              sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}
            >
              <Translate contentKey='entity.action.continue'>Continue</Translate>
            </Button>
          </DialogActions>
        </form>
        {modalUseTerms && <BidModalUseTerms isOpen={modalUseTerms} setOpen={setModalUseTerms} acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms} />}
      </Dialog>
    </ThemeProvider>
  )
}
