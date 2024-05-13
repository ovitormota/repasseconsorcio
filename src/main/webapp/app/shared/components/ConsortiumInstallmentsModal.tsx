import { CloseOutlined } from '@mui/icons-material'
import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider } from '@mui/material'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Translate, getSortState, translate } from 'react-jhipster'
import { TypographStyled } from '../layout/table/TableComponents'
import { defaultTheme } from '../layout/themes'
import { IConsortiumInstallments } from '../model/consortium-installments.model'
import { formatCreatedDate, formatCurrency } from '../util/data-utils'
import { overridePaginationStateWithQueryParams } from '../util/entity-utils'
import { ITEMS_PER_PAGE } from '../util/pagination.constants'
import { Loading } from './Loading'
import { NoDataIndicatorRelative } from './NoDataIndicator'

interface IConsortiumInstallmentsModalProps {
  consortiumInstallments: IConsortiumInstallments[]
  setOpenConsortiumInstallmentsModal: (open: boolean) => void
}

export const ConsortiumInstallmentsModal = ({ consortiumInstallments, setOpenConsortiumInstallmentsModal }: IConsortiumInstallmentsModalProps) => {
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

  const handleStatus = (status: string) => {
    return (
      <Chip
        label={translate(`repasseconsorcioApp.StatusConsortiumInstallments.${status}`)}
        color={status === 'REGISTERED' ? 'warning' : status === 'OPEN' ? 'success' : 'error'}
        sx={{ color: 'white', width: '90px' }}
      />
    )
  }

  const sortedInstallments = [...consortiumInstallments].sort((a, b) => new Date(a.installmentDate).getTime() - new Date(b.installmentDate).getTime())

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
          Parcelas do Consórcio
          <IconButton onClick={handleClose}>
            <CloseOutlined sx={{ color: defaultTheme.palette.secondary.main }} fontSize='small' />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 1 }}>
          <Box>
            <InfiniteScroll
              dataLength={sortedInstallments.length}
              next={handleLoadMore}
              hasMore={true}
              // hasMore={paginationState.activePage - 1 < links.next}
              scrollableTarget='scrollableDiv'
              loader={false && <Loading height='150px' />}
            >
              {sortedInstallments?.length ? (
                <TableContainer sx={{ px: { xs: 0, sm: 2 } }}>
                  <Table>
                    <TableHead style={{ position: 'relative' }}>
                      <TableRow>
                        <TableCell>
                          <TypographStyled>
                            <Translate contentKey='repasseconsorcioApp.consortium.numberOfInstallments'>Número de Parcelas</Translate>
                          </TypographStyled>
                        </TableCell>
                        <TableCell>
                          <TypographStyled>
                            <Translate contentKey='repasseconsorcioApp.consortium.installmentValue'>Valor da Parcela</Translate>
                          </TypographStyled>
                        </TableCell>
                        <TableCell>
                          <TypographStyled>
                            <Translate contentKey='repasseconsorcioApp.consortium.installmentDate'>Vencimento da Parcela</Translate>
                          </TypographStyled>
                        </TableCell>
                        <TableCell>
                          <TypographStyled>
                            <Translate contentKey='repasseconsorcioApp.consortium.statusConsortiumInstallments'>Status</Translate>
                          </TypographStyled>
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {sortedInstallments.map((installment, index) => (
                        <React.Fragment key={index}>
                          <TableRow>
                            <TableCell>{installment.numberOfInstallments}</TableCell>
                            <TableCell>{formatCurrency(installment.installmentValue)}</TableCell>
                            <TableCell>{formatCreatedDate(installment.installmentDate)}</TableCell>
                            <TableCell>{handleStatus(installment.status)}</TableCell>
                          </TableRow>
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <NoDataIndicatorRelative message='Nenhuma parcela encontrada' />
              )}
            </InfiniteScroll>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
