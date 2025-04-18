import React, { useEffect, useRef, useState } from 'react'
import { getSortState, translate } from 'react-jhipster'
import { RouteComponentProps } from 'react-router-dom'

import { Box, Chip, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, ThemeProvider, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Loading } from 'app/shared/components/Loading'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { TypographStyled } from 'app/shared/layout/table/TableComponents'
import { defaultTheme } from 'app/shared/layout/themes'
import { IConsortium } from 'app/shared/model/consortium.model'
import { formatCreated, formatCurrency } from 'app/shared/util/data-utils'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ConsortiumHistoryModal } from '../consortium/ConsortiumHistoryModal'
import { getEntities, reset } from './bid.reducer'
import { SkeletonTable } from 'app/shared/components/skeleton/SkeletonTable'

const Bid = (props: RouteComponentProps<{ url: string }>) => {
  const { isSMScreen, isMDScreen } = useBreakpoints()
  const dispatch = useAppDispatch()
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'created'), props.location.search))
  const [openConsortiumHistoryModal, setOpenConsortiumHistoryModal] = useState<boolean>(false)
  const [entityConsortium, setEntityConsortium] = useState<IConsortium | null>(null)

  const bidList = useAppSelector((state) => state.bid.entities)
  const loading = useAppSelector((state) => state.bid.loading)
  const links = useAppSelector((state) => state.bid.links)
  const [order, setOrder] = useState<'desc' | 'asc'>(DESC)
  const [currentSort, setCurrentSort] = useState('created')

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: currentSort + ',' + order,
      })
    )
  }

  useEffect(() => {
    getAllEntities()
  }, [paginationState.activePage, currentSort, order])

  const handleLoadMore = () => {
    setPaginationState({
      ...paginationState,
      activePage: paginationState.activePage + 1,
    })
  }

  const createHandleSort = (field: string) => () => {
    const isDesc = currentSort === field && order === DESC
    setCurrentSort(field)
    setOrder(isDesc ? 'asc' : 'desc')
    dispatch(reset())
    setPaginationState({
      ...paginationState,
      activePage: 1,
    })
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} onClick={() => setOpenConsortiumHistoryModal(true)} scrollableBoxRef={scrollableBoxRef}>
        <Box display='flex' alignItems='center' sx={{ width: '100%', justifyContent: { xs: 'flex-start', sm: 'center' } }}>
          <Typography color='secondary' fontWeight={'600'} fontSize={'18px'}>
            {translate('repasseconsorcioApp.bid.home.myBids')}
          </Typography>
        </Box>
      </AppBarComponent>

      <Box sx={{ overflow: 'auto', height: 'calc(100vh - 70px)', paddingY: '70px' }} id='scrollableDiv' ref={scrollableBoxRef}>
        <InfiniteScroll
          dataLength={bidList?.length}
          next={handleLoadMore}
          hasMore={paginationState.activePage - 1 < links.next}
          scrollableTarget='scrollableDiv'
          loader={loading && <Loading height='150px' />}
        >
          {bidList?.length ? (
            <TableContainer>
              <Table>
                <TableHead style={{ position: 'relative' }}>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel onClick={createHandleSort('consortium.id')} active={currentSort === 'consortium.id'} direction={order}>
                        <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.consortium.id')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>

                    {isMDScreen && (
                      <>
                        {/* <TableCell>
                          <TableSortLabel onClick={createHandleSort('consortium.consortiumAdministrator.name')} active={currentSort === 'consortium.consortiumAdministrator.name'} direction={order}>
                            <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.consortium.consortiumAdministrator.name')}</TypographStyled>
                          </TableSortLabel>
                        </TableCell> */}
                        <TableCell>
                          <TableSortLabel onClick={createHandleSort('consortium.segmentType')} active={currentSort === 'consortium.segmentType'} direction={order}>
                            <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.consortium.segmentType')}</TypographStyled>
                          </TableSortLabel>
                        </TableCell>
                      </>
                    )}

                    <TableCell>
                      <TableSortLabel onClick={createHandleSort('value')} active={currentSort === 'value'} direction={order}>
                        <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.value')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel onClick={createHandleSort('created')} active={currentSort === 'created'} direction={order}>
                        <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.created')}</TypographStyled>
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {bidList?.map((bid, index) => (
                    <TableRow key={index} onClick={() => [setOpenConsortiumHistoryModal(true), setEntityConsortium(bid.consortium)]}>
                      <TableCell>
                        <Chip label={'#' + bid?.consortium?.id} color='secondary' variant='outlined' />
                      </TableCell>
                      {isMDScreen && (
                        <>
                          {/* <TableCell>{bid.consortium?.consortiumAdministrator.name}</TableCell> */}
                          <TableCell>{translate(`repasseconsorcioApp.SegmentType.${bid.consortium?.segmentType}`)}</TableCell>
                        </>
                      )}
                      <TableCell>{formatCurrency(bid.value)}</TableCell>
                      <TableCell>{formatCreated(bid.created)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : !loading ? (
            <NoDataIndicator message='Nenhum lance encontrado' />
          ) : (
            <Loading />
          )}
        </InfiniteScroll>
      </Box>

      {openConsortiumHistoryModal && <ConsortiumHistoryModal setOpenConsortiumHistoryModal={setOpenConsortiumHistoryModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}

export default Bid
