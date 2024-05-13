import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { AddCircleOutlineRounded, CloseOutlined, RemoveCircleOutlineRounded } from '@mui/icons-material'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, ThemeProvider, Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { ModalUseTerms } from 'app/shared/components/ModalUseTerms'
import SelectPaginate from 'app/shared/components/select-paginate/SelectPaginate'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortiumAdministrator } from 'app/shared/model/consortium-administrator.model'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { StatusConsortiumInstallments } from 'app/shared/model/enumerations/status-consortium-installments'
import { addPercentage, showElement } from 'app/shared/util/data-utils'
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { NumericFormat } from 'react-number-format'
import { useHistory } from 'react-router-dom'
import { createEntity, reset } from '../../entities/consortium/consortium.reducer'
import { getEntities } from '../proposals/my-proposal.reducer'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

export const ConsortiumUpdateModal = ({ setOpenConsortiumUpdateModal }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const loading = useAppSelector((state) => state.consortium.loading)
  const updateSuccess = useAppSelector((state) => state.consortium.updateSuccess)

  const [consortiumAdministrator, setConsortiumAdministrator] = React.useState<IConsortiumAdministrator>(null)
  const [contemplationStatus, setContemplationStatus] = React.useState<boolean>(null)
  const [minimumBidValue, setMinimumBidValue] = React.useState<number>(null)
  const [consortiumValue, setConsortiumValue] = React.useState<number>(null)
  const [adminstrationFee, setAdminstrationFee] = React.useState<number>(0)
  const [modalUseTerms, setModalUseTerms] = React.useState<boolean>(false)
  const [segmentType, setSegmentType] = React.useState<SegmentType>(null)
  const [acceptTerms, setAcceptTerms] = React.useState<boolean>(false)
  const [activeStep, setActiveStep] = React.useState(0)

  const [parcels, setParcels] = useState([{ numberOfInstallments: null, installmentValue: null, installmentDate: null, status: null }])

  const handleAddParcel = () => {
    setParcels([...parcels, { numberOfInstallments: null, installmentValue: null, installmentDate: null, status: null }])
  }

  const handleRemoveParcel = (index) => {
    const updatedParcels = [...parcels]
    updatedParcels.splice(index, 1)
    setParcels(updatedParcels)
  }

  const handleChange = (index, field, value) => {
    const updatedParcels = [...parcels]
    updatedParcels[index][field] = value
    setParcels(updatedParcels)
  }

  const steps = [0, 1, 2]

  const handleNext = () => {
    if (activeStep === 2) {
      return setModalUseTerms(true)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  useEffect(() => {
    if (updateSuccess) {
      dispatch(reset())
      setOpenConsortiumUpdateModal(false)
      setModalUseTerms(false)

      if (history.location.pathname === '/minhas-propostas') {
        dispatch(
          getEntities({
            filterSegmentType: SegmentType.ALL,
            filterStatusType: ConsortiumStatusType.ALL,
            sort: 'id,desc',
            page: 0,
            size: ITEMS_PER_PAGE,
          })
        )
      } else {
        history.push('/minhas-propostas')
      }
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

  const saveEntity = () => {
    const entity = {
      minimumBidValue,
      consortiumValue,
      segmentType,
      consortiumAdministrator,
      contemplationStatus,
      consortiumInstallments: parcels,
    }

    dispatch(createEntity(entity))
  }

  const handleDisabledButton = (step: number) => {
    if (step === 0) {
      return !segmentType || !consortiumAdministrator || !contemplationStatus
    }

    if (step === 1) {
      return !consortiumValue || !minimumBidValue
    }

    if (step === 2) {
      return parcels.some((parcel) => {
        // Verifica se algum dos campos necessários está vazio
        if (!parcel.numberOfInstallments || !parcel.installmentValue || !parcel.installmentDate || !parcel.status) {
          return true // Retorna true se algum campo estiver vazio
        }

        // Verifica se a data é válida
        const parsedDate = Date.parse(parcel.installmentDate)
        return isNaN(parsedDate) // Retorna true se a data não for válida
      })
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
        onClose={() => setOpenConsortiumUpdateModal(false)}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {activeStep === 0 && 'Informações do consórcio'}
          {activeStep === 1 && 'Valores do consórcio'}
          {activeStep === 2 && 'Parcelas do consórcio'}
          <IconButton onClick={() => setOpenConsortiumUpdateModal(false)}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Loading />
          ) : (
            <Box sx={{ width: '100%', mt: 3 }}>
              <Stepper activeStep={activeStep} sx={{ my: 1 }}>
                {steps.map((label) => (
                  <Step
                    key={label}
                    sx={{
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: 'success.main', // circle color (COMPLETED)
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: 'secondary.main', // circle color (ACTIVE)
                      },
                      '& .MuiStepIcon-root': {
                        color: 'grey.100', // circle color (INACTIVE)
                      },
                      '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                        color: 'common.white', // Just text label (ACTIVE)
                      },
                      '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                        fill: 'white', // circle's number (ACTIVE)
                      },
                    }}
                  >
                    <StepLabel />
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flex: '1 1 auto', mt: 3 }} />
                    {activeStep === 0 && (
                      <>
                        <Box sx={{ flex: 12, display: { sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                          <FormControl fullWidth sx={{ mb: { xs: 2, sm: 0 } }}>
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
                          <FormControl fullWidth>
                            <InputLabel id='consortium-segmentType-label'>{translate('repasseconsorcioApp.consortium.contemplationTypeStatus.title') + ' *'}</InputLabel>
                            <Select
                              required
                              id='consortium-contemplationStatus'
                              name='contemplationStatus'
                              label={translate('repasseconsorcioApp.consortium.contemplationTypeStatus.title')}
                              fullWidth
                              color='secondary'
                              value={contemplationStatus}
                              onChange={(e) => setContemplationStatus(e.target.value as boolean)}
                            >
                              <MenuItem value='true'>{translate('repasseconsorcioApp.consortium.contemplationTypeStatus.approved')}</MenuItem>
                              <MenuItem value='false'>{translate('repasseconsorcioApp.consortium.contemplationTypeStatus.disapproved')}</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>

                        <Box>
                          <SelectPaginate
                            apiUrl='/api/consortium-administrators'
                            valueName='name'
                            value={consortiumAdministrator}
                            onChange={setConsortiumAdministrator}
                            placeholder={translate('repasseconsorcioApp.consortium.consortiumAdministrator') + ' *'}
                            isRequired={true}
                          />
                        </Box>
                      </>
                    )}
                    {activeStep === 1 && (
                      <Box sx={{ flex: 12, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                        <FormControl fullWidth>
                          <NumericFormat
                            required
                            customInput={TextField}
                            thousandSeparator='.'
                            decimalSeparator=','
                            prefix={'R$ '}
                            label={translate('repasseconsorcioApp.consortium.consortiumValue')}
                            placeholder='Ex: 1000'
                            allowNegative={false}
                            fullWidth
                            color='secondary'
                            isAllowed={(values) => {
                              const { formattedValue, floatValue } = values
                              return formattedValue === '' || floatValue <= 500000
                            }}
                            value={consortiumValue}
                            onValueChange={(values) => setConsortiumValue(+values.floatValue)}
                            InputProps={{
                              style: { borderRadius: '10px' },
                            }}
                          />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: { xs: 2, sm: 0 } }}>
                          <NumericFormat
                            required
                            customInput={TextField}
                            thousandSeparator='.'
                            decimalSeparator=','
                            prefix={'R$ '}
                            label={translate('repasseconsorcioApp.consortium.minimumBidValue')}
                            placeholder='Ex: 500'
                            allowNegative={false}
                            fullWidth
                            color='secondary'
                            value={minimumBidValue}
                            isAllowed={(values) => {
                              const { formattedValue, floatValue } = values
                              return formattedValue === '' || floatValue <= 500000
                            }}
                            onValueChange={(values) => setMinimumBidValue(+values.floatValue)}
                            InputProps={{
                              style: { borderRadius: '10px' },
                            }}
                          />
                        </FormControl>
                      </Box>
                    )}
                    {activeStep === 2 && (
                      <form>
                        {parcels.map((parcel, index) => (
                          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, width: '100%' }}>
                              <Box sx={{ flex: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', gap: 2 }}>
                                  <FormControl fullWidth>
                                    <NumericFormat
                                      required
                                      customInput={TextField}
                                      label={translate('repasseconsorcioApp.consortium.numberOfInstallments')}
                                      placeholder='Ex: 180'
                                      allowNegative={false}
                                      color='secondary'
                                      maxLength={3}
                                      value={parcel.numberOfInstallments}
                                      isAllowed={(values) => {
                                        const { formattedValue, floatValue } = values
                                        return formattedValue === '' || floatValue <= 480
                                      }}
                                      onValueChange={(values) => handleChange(index, 'numberOfInstallments', +values.floatValue)}
                                      InputProps={{
                                        inputProps: { min: 1, max: 480 },
                                        style: { borderRadius: '10px' },
                                      }}
                                    />
                                  </FormControl>
                                  <FormControl fullWidth>
                                    <NumericFormat
                                      required
                                      customInput={TextField}
                                      thousandSeparator='.'
                                      decimalSeparator=','
                                      prefix={'R$ '}
                                      label={translate('repasseconsorcioApp.consortium.installmentValue')}
                                      placeholder='Ex: 300'
                                      allowNegative={false}
                                      color='secondary'
                                      value={parcel.installmentValue}
                                      isAllowed={(values) => {
                                        const { formattedValue, floatValue } = values
                                        return formattedValue === '' || floatValue <= 500000
                                      }}
                                      onValueChange={(values) => handleChange(index, 'installmentValue', +values.floatValue)}
                                      InputProps={{
                                        style: { borderRadius: '10px' },
                                      }}
                                    />
                                  </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', gap: 2 }}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='pt-br' localeText={{ clearButtonLabel: 'Limpar', todayButtonLabel: 'Hoje' }}>
                                    <DatePicker
                                      sx={{
                                        width: '100%',
                                        '& .MuiOutlinedInput-root': {
                                          borderRadius: '10px',
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: defaultTheme.palette.secondary.main,
                                          },
                                        },
                                        '& .MuiSvgIcon-root': {
                                          color: defaultTheme.palette.secondary.main,
                                        },
                                        '& .MuiButtonBase-root': {
                                          color: defaultTheme.palette.secondary.main,
                                        },
                                      }}
                                      label={translate('repasseconsorcioApp.consortium.installmentDate')}
                                      value={parcel.installmentDate}
                                      onChange={(newValue) => handleChange(index, 'installmentDate', newValue)}
                                    />
                                  </LocalizationProvider>

                                  <FormControl fullWidth>
                                    <InputLabel id='statusConsortiumInstallments-label'>{translate('repasseconsorcioApp.consortium.statusConsortiumInstallments')}</InputLabel>
                                    <Select
                                      required
                                      id='statusConsortiumInstallments'
                                      name='statusConsortiumInstallments'
                                      label={translate('repasseconsorcioApp.consortium.statusConsortiumInstallments')}
                                      fullWidth
                                      color='secondary'
                                      value={parcel.status}
                                      onChange={(values) => handleChange(index, 'status', values.target.value)}
                                    >
                                      <MenuItem value={StatusConsortiumInstallments.OPEN}>{translate('repasseconsorcioApp.StatusConsortiumInstallments.OPEN')}</MenuItem>
                                      <MenuItem value={StatusConsortiumInstallments.LATE}>{translate('repasseconsorcioApp.StatusConsortiumInstallments.LATE')}</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                              </Box>
                              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {index === parcels.length - 1 ? (
                                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                    <Tooltip title='Adicionar parcela' placement='right-start'>
                                      <IconButton color='secondary' onClick={handleAddParcel}>
                                        <AddCircleOutlineRounded />
                                      </IconButton>
                                    </Tooltip>
                                    {index !== 0 && (
                                      <Tooltip title='Remover parcela' placement='right-start'>
                                        <IconButton color='error' onClick={() => handleRemoveParcel(index)}>
                                          <RemoveCircleOutlineRounded />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                ) : (
                                  <Tooltip title='Remover parcela' placement='right-start'>
                                    <IconButton color='error' onClick={() => handleRemoveParcel(index)}>
                                      <RemoveCircleOutlineRounded />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                            {index !== parcels.length - 1 && <Divider sx={{ width: '100%', mt: 2, mb: 3 }} />}
                          </Box>
                        ))}
                      </form>
                    )}

                    <DialogActions sx={{ m: 0, p: 0, mt: 3 }}>
                      <Button sx={{ color: defaultTheme.palette.text.primary, fontSize: '12px' }} onClick={handleBack} style={showElement(activeStep !== 0)}>
                        Voltar
                      </Button>
                      <Button
                        color='secondary'
                        variant='contained'
                        disabled={handleDisabledButton(activeStep)}
                        sx={{ fontWeight: '600', color: defaultTheme.palette.background.paper }}
                        onClick={handleNext}
                      >
                        {activeStep === steps.length - 1 ? <Translate contentKey='entity.action.register'>Register</Translate> : 'Próximo'}
                      </Button>
                    </DialogActions>
                  </Box>
                </React.Fragment>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {modalUseTerms && <ModalUseTerms isOpen={modalUseTerms} setOpen={setModalUseTerms} acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms} adminstrationFee={adminstrationFee} />}
    </ThemeProvider>
  )
}
