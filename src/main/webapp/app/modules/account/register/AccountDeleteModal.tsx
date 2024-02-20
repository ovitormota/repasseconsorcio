import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { deleteUser } from 'app/modules/administration/user-management/user-management.reducer';
import React from 'react';
import { Translate } from 'react-jhipster';
import { defaultTheme } from '../../../../content/themes/index';

export const AccountDeleteModal = ({ setDeleteAccountModalOpen }) => {
    const account = useAppSelector(state => state.authentication.account);

    const dispatch = useAppDispatch();

    const handleClose = () => {
        setDeleteAccountModalOpen(false);
    };

    const handleValidSubmit = event => {
        event.preventDefault();
        dispatch(deleteUser(account?.login));
    };

    return (
        <React.Fragment>
            <Dialog
                open={true}
                sx={{ backgroundColor: defaultTheme.palette.background.default }}
                PaperProps={{ sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { sm: 0 }, minWidth: { xs: '92vw', sm: '40vw' } } }}
            >
                <DialogContent>
                    <DialogTitle color="secondary" fontWeight={'700'} fontSize={'20px'} sx={{ mb: 4 }}>
                        <Translate contentKey="userManagement.delete.question">Are you sure you want to delete this user?</Translate>
                    </DialogTitle>
                    <form onSubmit={handleValidSubmit}>
                        <DialogActions>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => handleClose()}
                                sx={{ fontWeight: '600', color: defaultTheme.palette.primary.main }}
                            >
                                <Translate contentKey="entity.action.cancel">Cancel</Translate>
                            </Button>
                            <Button type="submit" variant="outlined" color="secondary">
                                <Translate contentKey="userManagement.delete.button">Delete</Translate>
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};
