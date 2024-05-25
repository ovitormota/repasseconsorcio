import React, { useEffect, useState } from 'react'
import { Translate, translate } from 'react-jhipster'

import { CloseOutlined } from '@mui/icons-material'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, ThemeProvider } from '@mui/material'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { ModalUseTerms } from 'app/shared/components/ModalUseTerms'
import { MyDropzone } from 'app/shared/components/MyDropzone'
import { defaultTheme } from 'app/shared/layout/themes'
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model'
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model'
import { showElement } from 'app/shared/util/data-utils'
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { NumericFormat } from 'react-number-format'
import { useHistory } from 'react-router-dom'
import { createEntity, reset } from '../../entities/consortium/consortium.reducer'
import { getEntities } from '../proposals/my-proposal.reducer'

export const ConsortiumUpdateModal = ({ setOpenConsortiumUpdateModal }) => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const loading = useAppSelector((state) => state.consortium.loading)
  const updateSuccess = useAppSelector((state) => state.consortium.updateSuccess)

  const [minimumBidValue, setMinimumBidValue] = React.useState<number>(null)
  const [consortiumValue, setConsortiumValue] = React.useState<number>(null)
  const [adminstrationFee, setAdminstrationFee] = React.useState<number>(0)
  const [modalUseTerms, setModalUseTerms] = React.useState<boolean>(false)
  const [segmentType, setSegmentType] = React.useState<SegmentType>(null)

  const [activeStep, setActiveStep] = React.useState(0)
  const [note, setNote] = React.useState<string>('')
  const [consortiumExtract, setConsortiumExtract] = React.useState<string>(null)
  const [amountsPaid, setAmountsPaid] = useState<number>(null)

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
    }
  }, [updateSuccess])

  useEffect(() => {
    if (minimumBidValue) {
      if (minimumBidValue <= 20000) {
        setAdminstrationFee(10)
      } else if (minimumBidValue > 20000 && minimumBidValue < 50000) {
        setAdminstrationFee(7)
      } else {
        setAdminstrationFee(5)
      }
    }
  }, [minimumBidValue])

  useEffect(() => {
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
  }, [])

  const saveEntity = () => {
    const entity = {
      amountsPaid,
      minimumBidValue,
      consortiumValue,
      contemplationStatus: false,
      segmentType,
      note,
      consortiumExtract,
    }

    dispatch(createEntity(entity)).then(() => {
      dispatch(
        getEntities({
          filterSegmentType: SegmentType.ALL,
          filterStatusType: ConsortiumStatusType.ALL,
          sort: 'id,desc',
          page: 0,
          size: ITEMS_PER_PAGE,
        })
      )
    })
  }

  const handleDisabledButton = (step) => {
    if (step === 0) {
      return !segmentType || !consortiumValue || !minimumBidValue || !amountsPaid
    }

    if (step === 1) {
      return !consortiumExtract
    }
  }

  const handleFileUpload = (uploadedFile) => {
    setConsortiumExtract(uploadedFile)
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
          {activeStep === 0 && 'Dados do consórcio'}
          {activeStep === 1 && 'Extrato do consórcio'}
          {activeStep === 2 && 'Informações adicionais'}
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

              <React.Fragment>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: '1 1 auto', mt: 1 }} />

                  {activeStep === 0 && (
                    <>
                      <Box sx={{ flex: 12, display: { sm: 'flex' }, alignItems: 'center', gap: 2, mt: { sm: 2 } }}>
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
                          <NumericFormat
                            required
                            customInput={TextField}
                            thousandSeparator='.'
                            decimalSeparator=','
                            prefix={'R$ '}
                            label={translate('repasseconsorcioApp.consortium.consortiumValue')}
                            allowNegative={false}
                            fullWidth
                            color='secondary'
                            placeholder='Valor total do consórcio'
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
                      </Box>

                      <Box sx={{ flex: 12, display: { sm: 'flex' }, alignItems: 'center', gap: 2, mt: { sm: 2 } }}>
                        <FormControl fullWidth sx={{ my: { xs: 2, sm: 0 } }}>
                          <NumericFormat
                            required
                            customInput={TextField}
                            thousandSeparator='.'
                            decimalSeparator=','
                            prefix={'R$ '}
                            label={translate('repasseconsorcioApp.consortium.amountsPaid')}
                            allowNegative={false}
                            fullWidth
                            color='secondary'
                            placeholder='Valor pago até o momento'
                            value={amountsPaid}
                            isAllowed={(values) => {
                              const { formattedValue, floatValue } = values
                              return formattedValue === '' || floatValue <= 500000
                            }}
                            onValueChange={(values) => setAmountsPaid(+values.floatValue)}
                            InputProps={{
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
                            label={translate('repasseconsorcioApp.consortium.minimumBidValue')}
                            allowNegative={false}
                            fullWidth
                            color='secondary'
                            value={minimumBidValue}
                            placeholder='Valor mínimo que deseja receber'
                            isAllowed={(values) => {
                              const { formattedValue, floatValue } = values
                              return formattedValue === '' || floatValue <= amountsPaid
                            }}
                            onValueChange={(values) => setMinimumBidValue(+values.floatValue)}
                            InputProps={{
                              style: { borderRadius: '10px' },
                            }}
                          />
                        </FormControl>
                      </Box>
                    </>
                  )}

                  {activeStep === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
                      <Typography variant='caption' color='gray'>
                        <ul>
                          <li>Para finalizar o cadastro, precisamos que você anexe o extrato do consórcio.</li>
                          <li>As informações devem estar legíveis e o arquivo deve estar em formato PDF.</li>
                          <li>Caso tenha alguma informação pessoal, vai ser retirada automaticamente pelo sistema antes de salvar para garantir a sua segurança.</li>
                        </ul>
                      </Typography>
                      <MyDropzone onFileUpload={handleFileUpload} consortiumExtract={consortiumExtract} />
                    </Box>
                  )}

                  {activeStep === 2 && (
                    <FormControl fullWidth sx={{ mb: { xs: 2, sm: 0 }, mt: 1 }}>
                      <TextField
                        placeholder={translate('repasseconsorcioApp.consortium.note')}
                        multiline
                        rows={4}
                        fullWidth
                        color='secondary'
                        InputProps={{
                          style: { borderRadius: '10px' },
                        }}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </FormControl>
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
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {modalUseTerms && <ModalUseTerms isOpen={modalUseTerms} setOpen={setModalUseTerms} saveEntity={saveEntity} adminstrationFee={adminstrationFee} />}
    </ThemeProvider>
  )
}
