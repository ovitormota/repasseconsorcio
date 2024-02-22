import React, { Fragment } from 'react';
import { Translate } from 'react-jhipster';

import { CloseOutlined } from '@mui/icons-material';
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
} from '@mui/material';
import { IBid } from 'app/shared/model/bid.model';
import { defaultTheme } from '../../../content/themes/index';

interface IBidHistoryModalProps {
    setOpenBidHistoryModal: (open: boolean) => void;
    bidsHistory: IBid[];
}

export const BidHistoryModal = ({ setOpenBidHistoryModal, bidsHistory }: IBidHistoryModalProps) => {
    const formatCurrency = value => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const formatCreated = value => {
        const date = new Date(value);
        return date
            .toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(',', ' -');
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Dialog
                open={true}
                sx={{ backgroundColor: defaultTheme.palette.background.default }}
                PaperProps={{
                    sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: 1, minWidth: { xs: '92vw', sm: '40vw' } },
                }}
                onClose={() => setOpenBidHistoryModal(false)}
            >
                <DialogTitle color="secondary" fontWeight={'700'} fontSize={'20px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Translate contentKey="repasseconsorcioApp.bid.home.title">Bid</Translate>
                    <IconButton onClick={() => setOpenBidHistoryModal(false)}>
                        <CloseOutlined sx={{ color: defaultTheme.palette.text.secondary }} fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {bidsHistory?.map((bid, index) => (
                            <Fragment key={index}>
                                <ListItem
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        ':hover': {
                                            background: defaultTheme.palette.primary.main,
                                            cursor: 'pointer',
                                            transform: 'scale(1.01)',
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <Avatar alt={bid.user?.firstName} src={bid?.user?.image ?? bid.user?.firstName} sx={{ width: 50, height: 50 }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        secondary={formatCurrency(bid.value)}
                                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0 }}
                                    />
                                    <ListItemText primary={formatCreated(bid.created)} />
                                </ListItem>
                                {index !== bidsHistory.length - 1 && <Divider />}
                            </Fragment>
                        ))}
                    </List>

                    <DialogActions sx={{ mt: 2, px: 0 }}>
                        <Button onClick={() => setOpenBidHistoryModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
                            <Translate contentKey="entity.action.back">Voltar</Translate>
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};
