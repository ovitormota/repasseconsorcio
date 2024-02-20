import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ThemeProvider } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { Redirect } from 'react-router-dom';
import { defaultTheme } from '../../../content/themes/index';
import { Translate } from 'react-jhipster';

export const Logout = ({ setOpenLogoutModal }) => {
    const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            setOpenLogoutModal(false);
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        dispatch(logout());
        if (logoutUrl) {
            window.location.href = logoutUrl;
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Dialog
                open={true}
                sx={{ backgroundColor: defaultTheme.palette.background.default }}
                PaperProps={{
                    sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { sm: 2 }, minWidth: { xs: '92vw', sm: '40vw' } },
                }}
                onClose={() => setOpenLogoutModal(false)}
            >
                <DialogTitle color="secondary" fontWeight={'700'} fontSize={'20px'}>
                    <Translate contentKey="repasseconsorcioApp.logout.title">Logout</Translate>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Translate contentKey="repasseconsorcioApp.logout.message">Are you sure you want to logout?</Translate>
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ m: 2 }}>
                    <Button onClick={() => setOpenLogoutModal(false)} sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}>
                        <Translate contentKey="repasseconsorcioApp.logout.buttons.cancel">Cancel</Translate>
                    </Button>
                    <Button onClick={handleLogout} variant="contained" color="secondary" sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}>
                        <Translate contentKey="repasseconsorcioApp.logout.buttons.confirm">Logout</Translate>
                    </Button>
                </DialogActions>
            </Dialog>

            <Redirect to={'/'} />
        </ThemeProvider>
    );
};

export default Logout;
