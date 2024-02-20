import React, { useEffect } from 'react';
import { Translate, translate } from 'react-jhipster';

import { CloseOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, ThemeProvider } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { NumericFormat } from 'react-number-format';
import { defaultTheme } from '../../../content/themes/index';
import { createEntity } from './bid.reducer';
import { IConsortium } from 'app/shared/model/consortium.model';
import { toast } from 'react-toastify';

interface IBidUpdateModalProps {
    setOpenBidUpdateModal: (open: boolean) => void;
    entityConsortium: IConsortium;
}

export const BidUpdateModal = ({ setOpenBidUpdateModal, entityConsortium }: IBidUpdateModalProps) => {
    const dispatch = useAppDispatch();

    const loading = useAppSelector(state => state.bid.loading);
    const updateSuccess = useAppSelector(state => state.bid.updateSuccess);
    const bidEntity = useAppSelector(state => state.bid.entity);

    const [bidValue, setBidValue] = React.useState<number>(null);

    useEffect(() => {
        if (updateSuccess) {
            setOpenBidUpdateModal(false);
        }
    }, [updateSuccess]);

    const saveEntity = event => {
        event.preventDefault();

        const entity = {
            ...bidEntity,
            value: bidValue,
            consortium: entityConsortium,
        };

        dispatch(createEntity(entity));
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Dialog
                open={true}
                sx={{ backgroundColor: defaultTheme.palette.background.default }}
                PaperProps={{
                    sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: 1, minWidth: { xs: '92vw', sm: '40vw' } },
                }}
                onClose={() => setOpenBidUpdateModal(false)}
            >
                <DialogTitle color="secondary" fontWeight={'700'} fontSize={'20px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Translate contentKey="repasseconsorcioApp.bid.home.createLabel">Create a new Bid</Translate>
                    <IconButton onClick={() => setOpenBidUpdateModal(false)}>
                        <CloseOutlined sx={{ color: defaultTheme.palette.text.secondary }} fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={saveEntity}>
                            <NumericFormat
                                required
                                customInput={TextField}
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix={'R$ '}
                                label={translate('repasseconsorcioApp.bid.value')}
                                id="bid-value"
                                fullWidth
                                color="secondary"
                                helperText={'Valor mínimo: R$ ' + entityConsortium.minimumBidValue}
                                onValueChange={values => setBidValue(+values.floatValue)}
                                sx={{ mt: 1 }}
                                InputProps={{
                                    style: { borderRadius: '8px' },
                                }}
                            />

                            <DialogActions sx={{ mt: 2, px: 0 }}>
                                <Button onClick={() => setOpenBidUpdateModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
                                    <Translate contentKey="entity.action.cancel">Cancel</Translate>
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    disabled={!bidValue || bidValue < entityConsortium.minimumBidValue}
                                    sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}
                                >
                                    <Translate contentKey="entity.action.save">Save</Translate>
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};
