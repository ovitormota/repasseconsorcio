import React, { useEffect } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { defaultTheme } from 'app/shared/layout/themes'
import { createEntity } from '../../entities/consortium/consortium.reducer'
import { NumericFormat } from 'react-number-format'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import SelectPaginate from 'app/shared/components/select-paginate/SelectPaginate'

export const ConsortiumUpdateModal = ({ setOpenConsortiumUpdateModal }) => {
  const dispatch = useAppDispatch()

  const loading = useAppSelector((state) => state.consortium.loading)
  const updateSuccess = useAppSelector((state) => state.consortium.updateSuccess)

  const [installmentValue, setInstallmentValue] = React.useState<number>(null)
  const [minimumBidValue, setMinimumBidValue] = React.useState<number>(null)
  const [numberOfInstallments, setNumberOfInstallments] = React.useState<number>(null)
  const [consortiumValue, setConsortiumValue] = React.useState<number>(null)
  const [segmentType, setSegmentType] = React.useState<SegmentType>(null)
  const [consortiumAdministrator, setConsortiumAdministrator] = React.useState<IConsortiumAdministrator>(null)
  const [contemplationStatus, setContemplationStatus] = React.useState<boolean>(null)

  useEffect(() => {
    if (updateSuccess) {
      setOpenConsortiumUpdateModal(false)
    }
  }, [updateSuccess])

  const saveEntity = (event) => {
    event.preventDefault()

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
          sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: 1, minWidth: { xs: '92vw', sm: '80vw', md: '500px' } },
        }}
        onClose={() => setOpenConsortiumUpdateModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Translate contentKey='repasseconsorcioApp.consortium.home.createLabel'>Reset your password</Translate>
          <IconButton onClick={() => setOpenConsortiumUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={saveEntity}>
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
                type='tel'
                fullWidth
                color='secondary'
                value={consortiumValue}
                onValueChange={(values) => setConsortiumValue(+values.floatValue)}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />

              <TextField
                required
                id='numberOfInstallments'
                name='numberOfInstallments'
                label={translate('repasseconsorcioApp.consortium.numberOfInstallments')}
                type='number'
                fullWidth
                color='secondary'
                value={numberOfInstallments}
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
                label={translate('repasseconsorcioApp.consortium.installmentValue')}
                type='tel'
                fullWidth
                color='secondary'
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
                thousandSeparator='.'
                decimalSeparator=','
                prefix={'R$ '}
                label={translate('repasseconsorcioApp.consortium.minimumBidValue')}
                type='tel'
                fullWidth
                color='secondary'
                value={minimumBidValue}
                onValueChange={(values) => setMinimumBidValue(+values.floatValue)}
                sx={{ mt: 2 }}
                InputProps={{
                  style: { borderRadius: '8px' },
                }}
              />

              <DialogActions sx={{ mt: 2, px: 0 }}>
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
          )}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
