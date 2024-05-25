import { CloseOutlined } from '@mui/icons-material'
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, ThemeProvider, Typography } from '@mui/material'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getSortState, translate } from 'react-jhipster'
import { defaultTheme } from '../layout/themes'
import { IConsortium } from '../model/consortium.model'
import { StatusConsortiumInstallments } from '../model/enumerations/status-consortium-installments'
import { formatCreatedDate, formatCurrency, showElement } from '../util/data-utils'
import { overridePaginationStateWithQueryParams } from '../util/entity-utils'
import { ITEMS_PER_PAGE } from '../util/pagination.constants'
import { Loading } from './Loading'
import { NoDataIndicatorRelative } from './NoDataIndicator'

interface IConsortiumInstallmentsModalProps {
  consortium?: IConsortium
  setOpenConsortiumInstallmentsModal: (open: boolean) => void
}

export const ConsortiumInstallmentsModal = ({ consortium, setOpenConsortiumInstallmentsModal }: IConsortiumInstallmentsModalProps) => {
  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(location, ITEMS_PER_PAGE, 'id'), location.search))

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  const handleClose = () => {
    setOpenConsortiumInstallmentsModal(false)
  }

  const installmentPaid = [...consortium.consortiumInstallments].filter((installment) => installment.status === StatusConsortiumInstallments.PAID)?.[0]

  const installmentLate = [...consortium.consortiumInstallments].filter((installment) => installment.status === StatusConsortiumInstallments.LATE)?.[0]

  const installmentPending = [...consortium.consortiumInstallments].filter((installment) => installment.status === StatusConsortiumInstallments.PENDING)?.[0]

  return (
    <ThemeProvider theme={defaultTheme}>
      <Dialog
        open={true}
        sx={{ backgroundColor: defaultTheme.palette.background.default }}
        PaperProps={{
          sx: { borderRadius: '1em', background: defaultTheme.palette.secondary['A100'], minWidth: { xs: '92vw', sm: '80vw', md: '600px' } },
        }}
        onClose={handleClose}
      >
        <DialogTitle color='secondary' fontWeight={'600'} fontSize={'18px'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Informações adicionais
          <IconButton onClick={handleClose}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 1 }}>
          <Box>
            <InfiniteScroll dataLength={consortium?.consortiumInstallments.length} next={handleLoadMore} hasMore={true} scrollableTarget='scrollableDiv' loader={false && <Loading height='150px' />}>
              {consortium?.consortiumInstallments.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1, flexDirection: 'column' }}>
                  <Box
                    sx={{
                      m: 2,
                      mb: 0,
                      p: 2,
                      width: '95%',
                      borderRadius: '1em',
                      backgroundColor: defaultTheme.palette.secondary['A200'],
                      border: '1px solid',
                      borderColor: defaultTheme.palette.grey[100],
                    }}
                  >
                    <Typography color='secondary' fontSize={16} sx={{ mb: 1 }}>
                      Dados do plano
                    </Typography>
                    {/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Grupo:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {consortium.group}
                      </Typography>
                    </Typography> */}
                    {/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Cota:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {consortium.quota}
                      </Typography>
                    </Typography> */}
                    {/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Administradora:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {consortium.consortiumAdministrator.name}
                      </Typography>
                    </Typography> */}

                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Segmento:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {translate(`repasseconsorcioApp.SegmentType.${consortium.segmentType}`)}
                      </Typography>
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Status de contemplação:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {consortium.contemplationStatus ? 'Contemplado' : 'Não contemplado'}
                      </Typography>
                    </Typography>
                    {/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Taxa de administração:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {consortium.adminFee + '%'}
                      </Typography>
                    </Typography> */}
                  </Box>

                  <Box
                    sx={{
                      m: 2,
                      mb: 0,
                      p: 2,
                      width: '95%',
                      borderRadius: '1em',
                      backgroundColor: defaultTheme.palette.secondary['A200'],
                      border: '1px solid',
                      borderColor: defaultTheme.palette.grey[100],
                    }}
                  >
                    <Typography color='secondary' fontSize={16} sx={{ mb: 1 }}>
                      Parcelas
                    </Typography>

                    <Typography color='secondary' fontSize={12} sx={{ mb: 1 }} fontStyle='italic'>
                      Parcelas Pagas
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Quantidade de parcelas pagas:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {installmentPaid.numberOfInstallments}
                      </Typography>
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Valor total pago:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCurrency(installmentPaid.installmentValue)}
                      </Typography>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography color='secondary' fontSize={12} sx={{ mb: 1 }} fontStyle='italic'>
                      Parcelas em atraso
                    </Typography>

                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Quantidade de parcelas em atraso:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {installmentLate.numberOfInstallments}
                      </Typography>
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Valor total em atraso:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCurrency(installmentLate.installmentValue)}
                      </Typography>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography color='secondary' fontSize={12} sx={{ mb: 1 }} fontStyle='italic'>
                      Parcelas Pendentes
                    </Typography>

                    {/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Quantidade de parcelas pendentes:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {consortium.totalPlanMonths - (installmentPaid.numberOfInstallments + installmentLate.numberOfInstallments)}
                      </Typography>
                    </Typography> */}

                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Valor da próxima parcela:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCurrency(installmentPending.installmentValue)}
                      </Typography>
                    </Typography>

                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Data do próxima parcela:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCreatedDate(installmentPending.installmentDate)}
                      </Typography>
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      m: 2,
                      mb: 0,
                      p: 2,
                      width: '95%',
                      borderRadius: '1em',
                      backgroundColor: defaultTheme.palette.secondary['A200'],
                      border: '1px solid',
                      borderColor: defaultTheme.palette.grey[100],
                    }}
                  >
                    <Typography color='secondary' fontSize={16} sx={{ mb: 1 }}>
                      Valores do consórcio
                    </Typography>

                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Valor do crédito:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCurrency(consortium.consortiumValue)}
                      </Typography>
                    </Typography>
                    {/* <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Saldo devedor:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCurrency(consortium.outstandingBalance)}
                      </Typography>
                    </Typography> */}
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant='caption' color={defaultTheme.palette.text.secondary}>
                        Valor total pago até o momento:
                      </Typography>
                      <span className='divider' />
                      <Typography variant='caption' color={defaultTheme.palette.text.primary}>
                        {formatCurrency(consortium.amountsPaid)}
                      </Typography>
                    </Typography>
                  </Box>
                  <Box
                    display={showElement(!!consortium.note)}
                    sx={{
                      m: 2,
                      mb: 0,
                      p: 2,
                      width: '95%',
                      borderRadius: '1em',
                      backgroundColor: defaultTheme.palette.secondary['A200'],
                      border: '1px solid',
                      borderColor: defaultTheme.palette.grey[100],
                    }}
                  >
                    <Typography color='secondary' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      Observações
                    </Typography>
                    <Typography sx={{ whiteSpace: 'pre-line', pt: 2 }} fontSize='14px'>
                      {consortium.note}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <NoDataIndicatorRelative message='Nenhuma informação encontrada' />
              )}
            </InfiniteScroll>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
