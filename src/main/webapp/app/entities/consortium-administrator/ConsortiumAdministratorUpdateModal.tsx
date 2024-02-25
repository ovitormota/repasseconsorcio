import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';

import { CloseOutlined } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, ThemeProvider } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ImageUploader } from 'app/shared/components/ImageUploader';
import { defaultTheme } from '../../../content/themes/index';
import { createEntity } from './consortium-administrator.reducer';
import { toast } from 'react-toastify';

export const ConsortiumAdministratorUpdateModal = ({ setOpenConsorciumAdministratorModal }) => {
    const dispatch = useAppDispatch();

    const consortiumAdministratorEntity = useAppSelector(state => state.consortiumAdministrator.entity);
    const loading = useAppSelector(state => state.consortiumAdministrator.loading);
    const updating = useAppSelector(state => state.consortiumAdministrator.updating);
    const updateSuccess = useAppSelector(state => state.consortiumAdministrator.updateSuccess);

    const [consortiumName, setConsortiumName] = useState('');
    const [image, setImage] = useState(null);

    const handleClose = () => {
        setOpenConsorciumAdministratorModal(false);
    };

    useEffect(() => {
        if (updateSuccess) {
            handleClose();
        }
    }, [updateSuccess]);

    const saveEntity = event => {
        event.preventDefault();
        const entity = {
            ...consortiumAdministratorEntity,
            name: consortiumName,
            image,
        };
        dispatch(createEntity(entity));
    };

    const handleUpload = ({ base64Image }) => {
        setImage(base64Image);
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Dialog
                open={true}
                sx={{ backgroundColor: defaultTheme.palette.background.default }}
                PaperProps={{
                    sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { sm: 2 }, minWidth: { xs: '92vw', sm: '40vw' } },
                }}
                onClose={() => setOpenConsorciumAdministratorModal(false)}
            >
                <DialogTitle color="secondary" fontWeight={'700'} fontSize={'20px'} sx={{ my: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Translate contentKey="repasseconsorcioApp.consortiumAdministrator.home.title">Added new Consortium Administrator</Translate>
                    <IconButton onClick={() => setOpenConsorciumAdministratorModal(false)}>
                        <CloseOutlined sx={{ color: defaultTheme.palette.text.secondary }} fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={saveEntity}>
                            {/* <ImageUploader onUpload={handleUpload} currentImage={image} isUser={false} /> */}

                            <TextField
                                required
                                id="consortium-administrator-name"
                                name="numberOfInstallments"
                                label={translate('repasseconsorcioApp.consortiumAdministrator')}
                                type="text"
                                fullWidth
                                color="secondary"
                                value={consortiumName}
                                onChange={e => setConsortiumName(e.target.value)}
                                sx={{ mt: 2 }}
                                InputProps={{
                                    style: { borderRadius: '8px' },
                                }}
                            />

                            <DialogActions sx={{ mt: 3, px: 0 }}>
                                <Button
                                    onClick={() => setOpenConsorciumAdministratorModal(false)}
                                    sx={{ color: defaultTheme.palette.text.secondary, fontSize: '12px' }}
                                >
                                    <Translate contentKey="entity.action.cancel">Cancel</Translate>
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
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
