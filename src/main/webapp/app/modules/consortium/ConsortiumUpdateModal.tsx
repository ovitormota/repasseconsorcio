import React, { useCallback, useEffect } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CheckBox, CloseOutlined } from '@mui/icons-material'
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import SelectPaginate from 'app/shared/components/select-paginate/SelectPaginate'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { NumericFormat } from 'react-number-format'
import { createEntity, reset } from '../../entities/consortium/consortium.reducer'
import { ModalUseTerms } from 'app/shared/components/ModalUseTerms'
import { useHistory } from 'react-router-dom'
import { addPercentage, formatCurrency } from 'app/shared/util/data-utils'

export const ConsortiumUpdateModal = ({ setOpenConsortiumUpdateModal }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const loading = useAppSelector((state) => state.consortium.loading)
  const updateSuccess = useAppSelector((state) => state.consortium.updateSuccess)

  const [installmentValue, setInstallmentValue] = React.useState<number>(null)
  const [minimumBidValue, setMinimumBidValue] = React.useState<number>(null)
  const [numberOfInstallments, setNumberOfInstallments] = React.useState<number>(null)
  const [consortiumValue, setConsortiumValue] = React.useState<number>(null)
  const [segmentType, setSegmentType] = React.useState<SegmentType>(null)
  const [consortiumAdministrator, setConsortiumAdministrator] = React.useState<IConsortiumAdministrator>(null)
  const [contemplationStatus, setContemplationStatus] = React.useState<boolean>(null)
  const [acceptTerms, setAcceptTerms] = React.useState<boolean>(false)
  const [modalUseTerms, setModalUseTerms] = React.useState<boolean>(false)
  const [adminstrationFee, setAdminstrationFee] = React.useState<number>(0)

  useEffect(() => {
    if (updateSuccess) {
      dispatch(reset())
      setOpenConsortiumUpdateModal(false)
      setModalUseTerms(false)
      history.push('/my-proposals')
    }
  }, [updateSuccess])

  useEffect(() => {
    if (acceptTerms) {
      saveEntity()
    }
  }, [acceptTerms])

  useEffect(() => {
    if (consortiumValue) {
      setAdminstrationFee(addPercentage(consortiumValue, 2) - consortiumValue)
    }
  }, [consortiumValue])

  const openModalUseTerms = (event) => {
    event.preventDefault()

    setModalUseTerms(true)
  }

  const saveEntity = () => {
    const entity = {
      installmentValue,
      minimumBidValue,
      numberOfInstallments,
      consortiumValue,
      segmentType,
      consortiumAdministrator,
      contemplationStatus,
    }

    dispatch(createEntity(entity))
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { md: 1 }, minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={() => setOpenConsortiumUpdateModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Translate contentKey='repasseconsorcioApp.consortium.home.createLabel'>Reset your password</Translate>
          <IconButton onClick={() => setOpenConsortiumUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form>
              <FormControl fullWidth sx={{ mb: -1, mt: 1 }}>
                <InputLabel id='consortium-segmentType-label'>{translate('repasseconsorcioApp.consortium.segmentType') + ' *'}</InputLabel>
                <Select
                  required
                  id='consortium-segmentType'
                  name='segmentType'
                  label={translate('repasseconsorcioApp.consortium.segmentType')}
                  fullWidth
                  color='secondary'
                  value={segmentType}
                  onChange={(e) => setSegmentType(e.target.value as SegmentType)}
                >
                  <MenuItem value='AUTOMOBILE'>{translate('repasseconsorcioApp.SegmentType.AUTOMOBILE')}</MenuItem>
                  <MenuItem value='REAL_ESTATE'>{translate('repasseconsorcioApp.SegmentType.REAL_ESTATE')}</MenuItem>
                  <MenuItem value='OTHER'>{translate('repasseconsorcioApp.SegmentType.OTHER')}</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <SelectPaginate
                  apiUrl='/api/consortium-administrators'
                  valueName='name'
                  value={consortiumAdministrator}
                  onChange={setConsortiumAdministrator}
                  placeholder={translate('repasseconsorcioApp.consortium.consortiumAdministrator') + ' *'}
                  isRequired={true}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel id='consortium-segmentType-label'>{translate('repasseconsorcioApp.consortium.contemplationStatus.title') + ' *'}</InputLabel>
                <Select
                  required
                  id='consortium-contemplationStatus'
                  name='contemplationStatus'
                  label={translate('repasseconsorcioApp.consortium.contemplationStatus.title')}
                  fullWidth
                  color='secondary'
                  value={contemplationStatus}
                  onChange={(e) => setContemplationStatus(e.target.value as boolean)}
                >
                  <MenuItem value='true'>{translate('repasseconsorcioApp.consortium.contemplationStatus.approved')}</MenuItem>
                  <MenuItem value='false'>{translate('repasseconsorcioApp.consortium.contemplationStatus.disapproved')}</MenuItem>
                </Select>
              </FormControl>

              <NumericFormat
                required
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'R$ '}
                label='Valor do Consórcio'
                allowNegative={false}
                fullWidth
                color='secondary'
                isAllowed={(values) => {
                  const { formattedValue, floatValue } = values
                  return formattedValue === '' || floatValue <= 500000
                }}
                helperText={consortiumValue > 0 ? `A taxa de administração para realizar a transferência dessa cota é ${formatCurrency(adminstrationFee)}` : ''}
                value={consortiumValue}
                onValueChange={(values) => setConsortiumValue(+values.floatValue)}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />

              <NumericFormat
                required
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'R$ '}
                label={translate('repasseconsorcioApp.consortium.installmentValue')}
                allowNegative={false}
                fullWidth
                color='secondary'
                isAllowed={(values) => {
                  const { formattedValue, floatValue } = values
                  return formattedValue === '' || floatValue <= 50000
                }}
                value={installmentValue}
                onValueChange={(values) => setInstallmentValue(+values.floatValue)}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />

              <NumericFormat
                required
                customInput={TextField}
                label={translate('repasseconsorcioApp.consortium.numberOfInstallments')}
                fullWidth
                color='secondary'
                isAllowed={(values) => {
                  const { formattedValue, floatValue } = values
                  return formattedValue === '' || floatValue <= 480
                }}
                value={numberOfInstallments}
                allowNegative={false}
                onChange={(e) => setNumberOfInstallments(+e.target.value)}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />

              <NumericFormat
                required
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'R$ '}
                label={translate('repasseconsorcioApp.consortium.minimumBidValue')}
                allowNegative={false}
                fullWidth
                color='secondary'
                isAllowed={(values) => {
                  const { formattedValue, floatValue } = values
                  return formattedValue === '' || floatValue <= consortiumValue
                }}
                value={minimumBidValue}
                onValueChange={(values) => setMinimumBidValue(+values.floatValue)}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />
            </form>
          )}
        </DialogContent>
        <form onSubmit={openModalUseTerms}>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenConsortiumUpdateModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
              <Translate contentKey='entity.action.cancel'>Cancel</Translate>
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              disabled={!segmentType || !consortiumAdministrator || !consortiumValue || !numberOfInstallments || !installmentValue || !minimumBidValue}
              sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}
            >
              <Translate contentKey='entity.action.register'>Register</Translate>
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {modalUseTerms && <ModalUseTerms isOpen={modalUseTerms} setOpen={setModalUseTerms} acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms} adminstrationFee={adminstrationFee} />}
    </ThemeProvider>
  )
}
