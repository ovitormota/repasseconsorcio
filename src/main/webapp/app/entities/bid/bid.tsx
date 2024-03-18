import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row, Spinner } from 'reactstrap'
import { Translate, TextFormat, getSortState, translate } from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { getEntities, reset } from './bid.reducer'
import { IBid } from 'app/shared/model/bid.model'
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants'
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material'
import { defaultTheme } from 'app/shared/layout/themes'
import { Loading } from 'app/shared/components/Loading'
import InfiniteScroll from 'react-infinite-scroll-component'
import { formatCreated, formatCurrency } from 'app/shared/util/data-utils'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import { ConsortiumHistoryModal } from '../consortium/ConsortiumHistoryModal'
import { IConsortium } from 'app/shared/model/consortium.model'
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator'
import { AppBarComponent } from 'app/shared/layout/app-bar/AppBarComponent'
import { SortingBox } from 'app/shared/components/SortingBox'
import { TypographStyled } from 'app/shared/layout/table/TableComponents'

export const Bid = (props: RouteComponentProps<{ url: string }>) => {
  const { isSMScreen, isMDScreen } = useBreakpoints()
  const dispatch = useAppDispatch()
  const history = props.history
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

  const [paginationState, setPaginationState] = useState(overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'created'), props.location.search))
  const [sorting, setSorting] = useState(false)
  const [openConsortiumHistoryModal, setOpenConsortiumHistoryModal] = useState<boolean>(false)
  const [entityConsortium, setEntityConsortium] = useState<IConsortium | null>(null)

  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const updateSuccess = useAppSelector((state) => state.bid.updateSuccess)
  const totalItems = useAppSelector((state) => state.bid.totalItems)
  const bidList = useAppSelector((state) => state.bid.entities)
  const loading = useAppSelector((state) => state.bid.loading)
  const links = useAppSelector((state) => state.bid.links)
  const [order, setOrder] = useState(DESC)
  const [currentSort, setCurrentSort] = useState('value')
  const sortTypes = isMDScreen ? ['consortium.consortiumAdministrator.name', 'created', 'value', 'consortium.id', 'consortium.segmentType'] : ['created', 'value', 'consortium.id']

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

  useEffect(() => {
    if (sorting) {
      getAllEntities()
      setSorting(false)
    }
  }, [sorting])

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBarComponent loading={loading} onClick={() => setOpenConsortiumHistoryModal(true)} scrollableBoxRef={scrollableBoxRef}>
        <SortingBox setCurrentSort={setCurrentSort} currentSort={currentSort} setOrder={setOrder} order={order} sortTypes={sortTypes} translateKey='repasseconsorcioApp.bid.table.columns' />
      </AppBarComponent>
      {loading ? (
        <Loading />
      ) : (
        <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)', paddingTop: '60px' }} id='scrollableDiv' ref={scrollableBoxRef}>
          <InfiniteScroll
            dataLength={bidList?.length}
            next={handleLoadMore}
            hasMore={paginationState.activePage - 1 < links.next}
            scrollableTarget='scrollableDiv'
            pullDownToRefresh
            refreshFunction={getAllEntities}
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Typography color='secondary'>Puxe para atualizar</Typography>
                <Spinner color='warning' size='small' />
              </Box>
            }
            releaseToRefreshContent={
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Typography color='secondary'>Solte para atualizar</Typography>
                <Spinner color='warning' size='small' />
              </Box>
            }
            loader={
              <div className='loader' key={0}>
                Loading ...
              </div>
            }
          >
            <TableContainer sx={{ px: { xs: 0, sm: 2 } }}>
              <Table>
                <TableHead style={{ position: 'relative' }}>
                  <TableRow>
                    <TableCell>
                      <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.consortium.id')}</TypographStyled>
                    </TableCell>

                    {isMDScreen && (
                      <>
                        <TableCell>
                          <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.consortium.consortiumAdministrator.name')}</TypographStyled>
                        </TableCell>
                        <TableCell>
                          <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.consortium.segmentType')}</TypographStyled>
                        </TableCell>
                      </>
                    )}

                    <TableCell>
                      <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.value')}</TypographStyled>
                    </TableCell>
                    <TableCell>
                      <TypographStyled>{translate('repasseconsorcioApp.bid.table.columns.created')}</TypographStyled>
                    </TableCell>
                  </TableRow>
                  <hr className='hr-text' data-content='' style={{ position: 'absolute', width: '100%', top: '40px' }} />
                </TableHead>

                <TableBody>
                  {!!bidList?.length &&
                    bidList?.map((bid, index) => (
                      <TableRow key={index} onClick={() => [setOpenConsortiumHistoryModal(true), setEntityConsortium(bid.consortium)]}>
                        <TableCell>
                          <Chip label={'#' + bid?.consortium?.id} color='secondary' variant='outlined' />
                        </TableCell>
                        {isMDScreen && (
                          <>
                            <TableCell>{bid.consortium?.consortiumAdministrator.name}</TableCell>
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
          </InfiniteScroll>
          {!bidList?.length && <NoDataIndicator />}
        </Box>
      )}
      {openConsortiumHistoryModal && <ConsortiumHistoryModal setOpenConsortiumHistoryModal={setOpenConsortiumHistoryModal} entityConsortium={entityConsortium} />}
    </ThemeProvider>
  )
}

export default Bid
