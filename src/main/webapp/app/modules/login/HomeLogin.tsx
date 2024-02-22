import { CloseOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, ThemeProvider, Typography } from '@mui/material';
import { useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { useBreakpoints } from 'app/shared/util/useBreakpoints';
import React, { useEffect, useState } from 'react';
import { Translate, translate } from 'react-jhipster';
import { useDispatch } from 'react-redux';
import { defaultTheme } from '../../../content/themes/index';
import { AccountRegister } from '../account/register/AccountRegister';
import { RequestPassword } from './RequestPassword';

export const HomeLogin = ({ setOpenLoginModal }) => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [openRequestModal, setOpenRequestModal] = useState(false);
    const [openAccountRegisterModal, setOpenAccountRegisterModal] = useState(false);

    const loginError = useAppSelector(state => state.authentication.loginError);
    const loginSuccess = useAppSelector(state => state.authentication.loginSuccess);

    const { isMDScreen } = useBreakpoints();

    useEffect(() => {
        if (loginSuccess) {
            setOpenLoginModal(false);
        }
    }, [loginSuccess]);

    const handleLogin = () => {
        dispatch(login(username, password, rememberMe));
    };

    const handleSubmit = event => {
        event.preventDefault();
        handleLogin();
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Dialog
                open={true}
                sx={{ backgroundColor: defaultTheme.palette.background.default }}
                PaperProps={{
                    sx: { borderRadius: '1em', background: defaultTheme.palette.primary.main, p: { sm: 2 }, minWidth: { xs: '92vw', sm: '40vw' } },
                }}
                fullWidth
                onClose={() => isMDScreen && setOpenLoginModal(false)}
            >
                <DialogTitle color="secondary" fontWeight={'700'} fontSize={'20px'} align="center">
                    <Translate contentKey="login.title.login">Sign in</Translate>
                    <IconButton onClick={() => setOpenLoginModal(false)} sx={{ position: 'absolute', right: '10px', top: '10px' }}>
                        <CloseOutlined sx={{ color: defaultTheme.palette.text.secondary }} fontSize="small" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="username"
                            type="text"
                            label={translate('global.form.email.placeholder')}
                            variant="outlined"
                            required
                            fullWidth
                            color="secondary"
                            data-cy="username"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            InputProps={{
                                style: { borderRadius: '8px' },
                            }}
                            sx={{ mt: 3 }}
                        />

                        <TextField
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label={translate('global.form.password.label')}
                            variant="outlined"
                            required
                            fullWidth
                            color="secondary"
                            data-cy="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            InputProps={{
                                style: { borderRadius: '8px', marginRight: '8px' },
                                endAdornment: (
                                    <InputAdornment position="end" style={{ marginRight: '5px' }}>
                                        <IconButton edge="end" onClick={() => setShowPassword(!showPassword)} color="secondary">
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mt: 3, mb: 1 }}
                        />
                        {loginError ? (
                            <Alert severity="error" sx={{ mb: 1 }} variant="outlined">
                                <Translate contentKey="login.messages.error.authentication">
                                    <strong>Failed to sign in!</strong> Please check your credentials and try again.
                                </Translate>
                            </Alert>
                        ) : null}
                        <Typography color={defaultTheme.palette.primary.contrastText} fontWeight={'200'} align="right" style={{ fontSize: '13px' }}>
                            <Translate
                                contentKey="login.password.forgot"
                                interpolate={{
                                    aqui: (
                                        <span
                                            style={{ color: defaultTheme.palette.secondary.main, cursor: 'pointer', fontWeight: '600' }}
                                            onClick={() => setOpenRequestModal(true)}
                                        >
                                            aqui
                                        </span>
                                    ),
                                }}
                            />
                        </Typography>

                        <Button
                            type="submit"
                            fullWidth
                            variant={username && password ? 'contained' : 'outlined'}
                            size="large"
                            color="secondary"
                            sx={{ mt: 4, mb: 2, fontWeight: '600' }}
                        >
                            <Translate contentKey="login.form.button.login">Sign in</Translate>
                        </Button>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '10px' }}>
                            <div style={{ flexGrow: 1, background: defaultTheme.palette.primary.contrastText, height: '0.5px' }}></div>
                            <Typography color="textSecondary" fontWeight={'400'} sx={{ mx: 4 }}>
                                ou
                            </Typography>
                            <div style={{ flexGrow: 1, background: defaultTheme.palette.primary.contrastText, height: '0.5px' }}></div>
                        </div>

                        <Button
                            onClick={() => setOpenAccountRegisterModal(true)}
                            fullWidth
                            variant={username && password ? 'outlined' : 'contained'}
                            size="large"
                            color="secondary"
                            sx={{ fontWeight: '600', mt: 2 }}
                        >
                            <Translate contentKey="login.register.create">Create an account</Translate>
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {openRequestModal && <RequestPassword setOpenRequestModal={setOpenRequestModal} />}
            {openAccountRegisterModal && <AccountRegister setOpenAccountRegisterModal={setOpenAccountRegisterModal} />}
        </ThemeProvider>
    );
};
