// import { Avatar, Box, Button, Card, CardContent, Chip, List, ListItem, ListItemIcon, ListItemText, ThemeProvider } from '@mui/material';
// import { useAppDispatch, useAppSelector } from 'app/config/store';
// import { defaultTheme } from '../../../content/themes';
// import { getEntities, partialUpdateEntity } from 'app/entities/proposals-for-approval/proposals-for-approval.reducer';
// import { IConsortium } from 'app/shared/model/consortium.model';
// import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model';
// import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
// import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
// import React, { Fragment, useEffect, useState } from 'react';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { getSortState, translate } from 'react-jhipster';
// import { RouteComponentProps } from 'react-router-dom';

// export const ProposalsForApproval = (props: RouteComponentProps<{ url: string }>) => {
//     const dispatch = useAppDispatch();

//     const [paginationState, setPaginationState] = useState(
//         overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
//     );
//     const [openModalHandleBid, setOpenModalHandleBid] = useState(false);

//     const consortiumList = useAppSelector(state => state.proposalsForApproval.entities);
//     const links = useAppSelector(state => state.proposalsForApproval.links);

//     const getAllEntities = () => {
//         dispatch(
//             getEntities({
//                 page: paginationState.activePage - 1,
//                 size: paginationState.itemsPerPage,
//                 sort: `${paginationState.sort},${paginationState.order}`,
//             })
//         );
//     };

//     useEffect(() => {
//         getAllEntities();
//     }, [paginationState.activePage]);

//     const handleLoadMore = () => {
//         setPaginationState({
//             ...paginationState,
//             activePage: paginationState.activePage + 1,
//         });
//     };

//     const formatCurrency = value => {
//         return new Intl.NumberFormat('pt-BR', {
//             style: 'currency',
//             currency: 'BRL',
//         }).format(value);
//     };

//     const setApproved = (consortium: IConsortium) => {
//         const updatedConsortium = {
//             ...consortium,
//             status: ConsortiumStatusType.OPEN,
//         };

//         dispatch(partialUpdateEntity(updatedConsortium));
//     };

//     const getStatusColor = status => {
//         switch (status) {
//             case 'CLOSED':
//                 return 'error';
//             case 'OPEN':
//                 return 'success';
//             case 'REGISTERED':
//                 return 'warning';
//             case 'WON':
//                 return 'primary';
//             default:
//                 return 'default';
//         }
//     };

//     const ConsortiumCard = ({ consortium }: { consortium: IConsortium }) => {
// const {
//     consortiumAdministrator: { name, image },
//     segmentType,
//     consortiumValue,
//     numberOfInstallments,
//     minimumBidValue,
//     status,
// } = consortium;

//         return (
//             <Card
//                 variant="elevation"
//                 sx={{
//                     m: 1,
//                     width: '400px',
//                     minWidth: { xs: '90vw', sm: '400px' },
//                     ':hover': {
//                         backgroundColor: '#f5f5f5',
//                         cursor: 'pointer',
//                     },
//                 }}
//             >
//                 <CardContent>
//                     <List>
//                         <ListItem>
//                             <ListItemIcon sx={{ mr: 2 }}>
//                                 <Avatar alt={name} src={name} sx={{ width: 80, height: 60 }} />
//                             </ListItemIcon>
//                             <ListItemText
//                                 sx={{ display: 'flex', justifyContent: 'right', alignItems: 'flex-start', flexDirection: 'column-reverse' }}
//                                 primary={`${translate('repasseconsorcioApp.consortium.segmentType')}: ${translate(
//                                     `repasseconsorcioApp.SegmentType.${segmentType}`
//                                 )}`}
//                                 secondary={name}
//                             />
//                         </ListItem>

//                         <ListItem>
//                             <ListItemText
//                                 primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')}: `}
//                                 secondary={formatCurrency(consortiumValue)}
//                             />
//                         </ListItem>

//                         <ListItem>
//                             <ListItemText primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')}: `} secondary={numberOfInstallments} />
//                         </ListItem>

//                         <ListItem>
//                             <ListItemText
//                                 primary={`${translate('repasseconsorcioApp.consortium.minimumBidValue')}: `}
//                                 secondary={formatCurrency(minimumBidValue)}
//                             />
//                         </ListItem>

//                         <ListItem>
//                             <Button
//                                 sx={{
//                                     mb: -1,
//                                     background: '#F4A119',
//                                     boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
//                                     '&:hover': {
//                                         backgroundColor: defaultTheme.palette.secondary.main,
//                                         color: defaultTheme.palette.secondary.contrastText,
//                                     },
//                                 }}
//                                 fullWidth
//                                 onClick={() => setApproved(consortium)}
//                             >
//                                 {translate('repasseconsorcioApp.consortium.approve')}
//                             </Button>
//                         </ListItem>
// <Chip
//     label={translate(`repasseconsorcioApp.ConsortiumStatusType.${status}`)}
//     variant="outlined"
//     color={getStatusColor(status)}
//     sx={{
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         '&:hover': {
//             backgroundColor: defaultTheme.palette.secondary.main,
//             color: defaultTheme.palette.secondary.contrastText,
//             cursor: 'pointer',
//         },
//     }}
// />
//                     </List>
//                 </CardContent>
//             </Card>
//         );
//     };

//     return (
//         <ThemeProvider theme={defaultTheme}>
//             <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)' }} id="scrollableDiv">
//                 <InfiniteScroll
//                     dataLength={consortiumList.length}
//                     next={handleLoadMore}
//                     hasMore={paginationState.activePage - 1 < links.next}
//                     scrollableTarget="scrollableDiv"
//                     pullDownToRefresh
//                     refreshFunction={getAllEntities}
//                     pullDownToRefreshThreshold={50}
//                     pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>}
//                     releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>}
//                     loader={
//                         <div className="loader" key={0}>
//                             Loading ...
//                         </div>
//                     }
//                 >
//                     <List sx={{ pb: 5, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
//                         {consortiumList?.length ? (
//                             consortiumList?.map((consortium: IConsortium) => (
//                                 <Fragment key={consortium?.id}>
//                                     <ConsortiumCard consortium={consortium} />
//                                 </Fragment>
//                             ))
//                         ) : (
//                             <div className="alert alert-warning">No consortiums found</div>
//                         )}
//                     </List>
//                 </InfiniteScroll>
//             </Box>
//         </ThemeProvider>
//     );
// };

import { FilterListRounded, SortRounded, SwapVertRounded } from '@mui/icons-material';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    ThemeProvider,
    Tooltip,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { AuctionTimer } from 'app/shared/components/AuctionTimer';
import { Loading } from 'app/shared/components/Loading';
import { NoDataIndicator } from 'app/shared/components/NoDataIndicator';
import { IConsortium } from 'app/shared/model/consortium.model';
import { SegmentType } from 'app/shared/model/enumerations/segment-type.model';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import React, { Fragment, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getSortState, translate } from 'react-jhipster';
import { RouteComponentProps } from 'react-router-dom';
import { defaultTheme } from '../../../content/themes/index';
import { useBreakpoints } from 'app/shared/util/useBreakpoints';
import { getEntities, partialUpdateEntity } from './proposals-for-approval.reducer';
import { ConsortiumStatusType } from 'app/shared/model/enumerations/consortium-status-type.model';

export const ProposalsForApproval = (props: RouteComponentProps<{ url: string }>) => {
    const dispatch = useAppDispatch();
    const { isSMScreen, isMDScreen } = useBreakpoints();
    const history = props.history;

    const [paginationState, setPaginationState] = useState(
        overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'consortiumValue'), props.location.search)
    );
    const [filterSegmentType, setFilterSegmentType] = useState(SegmentType.ALL);
    const [currentSort, setCurrentSort] = useState('consortiumValue');
    const [order, setOrder] = useState(ASC);

    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const consortiumList = useAppSelector(state => state.consortium.entities);
    const loading = useAppSelector(state => state.consortium.loading);
    const links = useAppSelector(state => state.consortium.links);

    const getAllEntities = () => {
        dispatch(
            getEntities({
                page: paginationState.activePage - 1,
                size: paginationState.itemsPerPage,
                sort: `${currentSort},${order}`,
                filterSegmentType,
            })
        );
    };

    useEffect(() => {
        getAllEntities();
    }, [paginationState.activePage, filterSegmentType, currentSort, order]);

    const handleLoadMore = () => {
        setPaginationState({
            ...paginationState,
            activePage: paginationState.activePage + 1,
        });
    };

    const setApproved = (consortium: IConsortium) => {
        const updatedConsortium = {
            ...consortium,
            status: ConsortiumStatusType.OPEN,
        };

        dispatch(partialUpdateEntity(updatedConsortium));
    };

    const getStatusColor = status => {
        switch (status) {
            case 'CLOSED':
                return 'error';
            case 'OPEN':
                return 'success';
            case 'REGISTERED':
                return 'warning';
            case 'WON':
                return 'primary';
            default:
                return 'default';
        }
    };

    const formatCurrency = value => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const renderStatusRibbon = () => (
        <div className="ribbon">
            <a href="">{translate('repasseconsorcioApp.consortium.contemplationStatus.approved')}</a>
        </div>
    );

    const getSegmentType = () => {
        return [SegmentType.ALL, SegmentType.AUTOMOBILE, SegmentType.REAL_ESTATE, SegmentType.OTHER];
    };

    const SortingBox = () => {
        const sortTypes = ['consortiumAdministrator.name', 'numberOfInstallments', 'minimumBidValue', 'installmentValue', 'consortiumValue'];

        const handleSortChange = event => {
            const selectedSortType = event.target.value;
            setCurrentSort(selectedSortType);
        };

        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Select
                    value={currentSort}
                    onChange={handleSortChange}
                    IconComponent={SortRounded}
                    color="secondary"
                    sx={{
                        height: '35px',
                        padding: '0 10px 0 0',
                        fontSize: { xs: '14px', sm: '15px' },
                    }}
                >
                    {sortTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                            {translate(`repasseconsorcioApp.consortium.${type}`)}
                        </MenuItem>
                    ))}
                </Select>
                <IconButton color="secondary" onClick={() => setOrder(order === ASC ? DESC : ASC)} sx={{ ml: { xs: 0, sm: 1 } }}>
                    <SwapVertRounded />
                </IconButton>
            </Box>
        );
    };

    const SegmentFilter = () => {
        const handleSegmentChange = segment => {
            setFilterSegmentType(prevValue => (segment === prevValue ? SegmentType.ALL : segment));
        };

        return !isSMScreen ? (
            <Select
                value={filterSegmentType}
                IconComponent={FilterListRounded}
                onChange={event => handleSegmentChange(event.target.value)}
                sx={{ m: { xs: '3px', sm: 1 }, padding: '0 10px 0 0', height: '35px', fontSize: { xs: '14px', sm: '15px' } }}
            >
                {getSegmentType().map((segment, index) => (
                    <MenuItem key={index} value={segment}>
                        {translate(`repasseconsorcioApp.SegmentType.${segment}`)}
                    </MenuItem>
                ))}
            </Select>
        ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {getSegmentType().map((segment, index) => (
                    <Box key={index} onClick={() => handleSegmentChange(segment)} sx={{ m: { xs: '3px', sm: 1 }, p: 0 }}>
                        <Chip
                            label={translate(`repasseconsorcioApp.SegmentType.${segment}`)}
                            variant={segment === filterSegmentType ? 'filled' : 'outlined'}
                            color="secondary"
                            sx={{
                                '&:hover': {
                                    backgroundColor: defaultTheme.palette.secondary.main,
                                    color: defaultTheme.palette.secondary.contrastText,
                                    cursor: 'pointer',
                                },
                            }}
                        />
                    </Box>
                ))}
            </Box>
        );
    };

    const ConsortiumCard = ({ consortium }: { consortium: IConsortium }) => {
        const {
            consortiumAdministrator: { name, image },
            segmentType,
            consortiumValue,
            numberOfInstallments,
            installmentValue,
            created,
            contemplationStatus,
            minimumBidValue,
            status,
        } = consortium;
        return (
            <Card
                variant="elevation"
                sx={{
                    mx: { xs: 1.1, sm: 1.1 },
                    my: { xs: 1.1, sm: 1.1 },
                    width: '330px',
                    maxWidth: '90vw',
                    background: defaultTheme.palette.primary.light,
                    ':hover': {
                        backgroundColor: defaultTheme.palette.primary.main,
                        cursor: 'pointer',
                    },
                }}
                elevation={5}
            >
                <CardContent>
                    <List>
                        {contemplationStatus && renderStatusRibbon()}

                        <ListItem>
                            <ListItemIcon sx={{ mr: 1 }}>
                                <Avatar alt={name} src={name} sx={{ width: 50, height: 50 }} />
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    alignItems: 'flex-start',
                                    flexDirection: 'column-reverse',
                                    background: 'none !important',
                                }}
                                primary={`${translate('repasseconsorcioApp.consortium.segmentType')}: ${translate(
                                    `repasseconsorcioApp.SegmentType.${segmentType}`
                                )}`}
                                secondary={name}
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemText primary={`${translate('repasseconsorcioApp.consortium.numberOfInstallments')} `} secondary={numberOfInstallments} />
                            <ListItemText
                                primary={`${translate('repasseconsorcioApp.consortium.installmentValue')} `}
                                secondary={formatCurrency(installmentValue)}
                            />
                        </ListItem>

                        <ListItem>
                            <ListItemText
                                primary={`${translate('repasseconsorcioApp.consortium.consortiumValue')} `}
                                secondary={formatCurrency(consortiumValue)}
                                secondaryTypographyProps={{
                                    fontSize: '18px !important',
                                    fontWeight: '500',
                                }}
                            />
                            <ListItemText
                                primary={`${translate('repasseconsorcioApp.consortium.minimumBidValue')} `}
                                secondary={formatCurrency(minimumBidValue)}
                            />
                        </ListItem>

                        <ListItem>
                            <AuctionTimer created={created} />
                        </ListItem>

                        <ListItem>
                            <Button
                                sx={{
                                    mb: -1,
                                    background: defaultTheme.palette.secondary.main,
                                    color: defaultTheme.palette.secondary.contrastText,
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                    '&:hover': {
                                        backgroundColor: defaultTheme.palette.warning.main,
                                    },
                                }}
                                fullWidth
                                onClick={() => setApproved(consortium)}
                            >
                                {translate('repasseconsorcioApp.consortium.approve')}
                            </Button>
                        </ListItem>
                        <Chip
                            label={translate(`repasseconsorcioApp.ConsortiumStatusType.${status}`)}
                            variant="outlined"
                            color={getStatusColor(status)}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                '&:hover': {
                                    backgroundColor: defaultTheme.palette.secondary.main,
                                    color: defaultTheme.palette.secondary.contrastText,
                                    cursor: 'pointer',
                                },
                            }}
                        />
                    </List>
                </CardContent>
            </Card>
        );
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <AppBar
                position="fixed"
                sx={{
                    top: 0,
                    bottom: 'auto',
                    background: defaultTheme.palette.primary.main,
                    boxShadow: 'none',
                    height: '60px',
                }}
            >
                {!loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            gap: { xs: 1, sm: 10 },
                        }}
                    >
                        {isAuthenticated && isMDScreen && (
                            <Tooltip title="Início" style={{ cursor: 'pointer', position: 'absolute', left: 20, top: 10 }} onClick={() => history.replace('/')}>
                                <Box sx={{ width: '110px', height: '40px', maxWidth: '110px' }}>
                                    <img src="content/images/logo-repasse-consorcio-text.png" alt="Logo" width="100%" height="100%" />
                                </Box>
                            </Tooltip>
                        )}
                        <SegmentFilter />
                        {!!consortiumList?.length && <SortingBox />}
                    </Box>
                )}
            </AppBar>
            {loading ? (
                <Loading />
            ) : (
                <Box style={{ overflow: 'auto', height: 'calc(100vh - 60px)', marginTop: '60px' }} id="scrollableDiv">
                    <InfiniteScroll
                        dataLength={consortiumList.length}
                        next={handleLoadMore}
                        hasMore={paginationState.activePage - 1 < links.next}
                        scrollableTarget="scrollableDiv"
                        pullDownToRefresh
                        refreshFunction={getAllEntities}
                        pullDownToRefreshThreshold={50}
                        pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>}
                        releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>}
                        loader={
                            <div className="loader" key={0}>
                                Loading ...
                            </div>
                        }
                    >
                        <List sx={{ mb: '110px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                            {consortiumList?.length ? (
                                consortiumList?.map((consortium: IConsortium) => (
                                    <Fragment key={consortium?.id}>
                                        <ConsortiumCard consortium={consortium} />
                                    </Fragment>
                                ))
                            ) : (
                                <div className="alert alert-warning">No consortiums found</div>
                            )}
                        </List>
                    </InfiniteScroll>
                </Box>
            )}
        </ThemeProvider>
    );
};
