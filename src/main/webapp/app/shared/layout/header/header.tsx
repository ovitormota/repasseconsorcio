import { AccountBalance, Add, Checklist, Gavel, HomeOutlined, Login, LogoutOutlined, ManageAccounts, MoreVert, PriceCheck } from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText, Menu, MenuItem, ThemeProvider, Tooltip, styled } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useAppSelector } from 'app/config/store';
import { ConsortiumAdministratorUpdateModal } from 'app/entities/consortium-administrator/ConsortiumAdministratorUpdateModal';
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate';
import { ConsortiumUpdateModal } from 'app/modules/consortium/ConsortiumUpdateModal';
import { HomeLogin } from 'app/modules/login/HomeLogin';
import Logout from 'app/modules/login/logout';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { defaultTheme } from '../../../../content/themes/index';
import { fontSize } from '@mui/system';

export const Header = () => {
    const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
    const account = useAppSelector(state => state.authentication.account);
    const history = useHistory();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [openConsortiumUpdateModal, setOpenConsortiumUpdateModal] = React.useState(false);
    const [openLogoutModal, setOpenLogoutModal] = React.useState(false);
    const [openAccountRegisterUpdateModal, setOpenAccountRegisterUpdateModal] = React.useState(false);
    const [openConsorciumAdministratorModal, setOpenConsorciumAdministratorModal] = React.useState(false);
    const [openLoginModal, setOpenLoginModal] = React.useState<boolean>(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleFab = () => {
        if (isAuthenticated) {
            setOpenConsortiumUpdateModal(true);
        } else {
            setOpenLoginModal(true);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <AppBar
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    color: defaultTheme.palette.background.paper,
                    background: defaultTheme.palette.background.paper,
                    height: '70px',
                }}
            >
                <Toolbar sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <Box>
                        {!isAuthenticated ? (
                            <Tooltip title="Início" style={{ cursor: 'pointer' }} onClick={() => history.replace('/')}>
                                <Box sx={{ width: '55%', height: '100%', maxWidth: '300px' }}>
                                    <img src="content/images/logo-repasse-consorcio-text.png" alt="Logo" width="100%" height="100%" />
                                </Box>
                            </Tooltip>
                        ) : (
                            <React.Fragment>
                                <Box sx={{ display: 'flex' }}>
                                    <Tooltip title="Perfil">
                                        <IconButton
                                            onClick={handleOpenUserMenu}
                                            aria-controls={open ? 'account-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                        >
                                            <Avatar
                                                src={account?.image || account?.firstName}
                                                alt={account?.firstName}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    backgroundColor: defaultTheme.palette.primary.main,
                                                    border: account?.image ? 'none' : '1px solid',
                                                    color: defaultTheme.palette.secondary.main,
                                                    borderColor: defaultTheme.palette.secondary.main,
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <Menu
                                    anchorEl={anchorElUser}
                                    id="account-menu"
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    onClick={handleCloseUserMenu}
                                    style={{ marginTop: '-55px' }}
                                    MenuListProps={{
                                        sx(theme) {
                                            return {
                                                p: 0,
                                                backgroundColor: theme.palette.background.paper,
                                                color: theme.palette.text.primary,
                                            };
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={() => setOpenAccountRegisterUpdateModal(true)}
                                        sx={{
                                            py: 2,
                                            ':hover': {
                                                color: defaultTheme.palette.secondary.main,
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <ManageAccounts fontSize="small" sx={{ color: defaultTheme.palette.secondary.main }} />
                                        </ListItemIcon>
                                        <Typography variant="subtitle2">Meu Perfil</Typography>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => setOpenLogoutModal(true)}
                                        sx={{
                                            py: 2,
                                            ':hover': {
                                                color: defaultTheme.palette.secondary.main,
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <LogoutOutlined fontSize="small" sx={{ color: defaultTheme.palette.secondary.main }} />
                                        </ListItemIcon>
                                        <Typography variant="subtitle2">Sair</Typography>
                                    </MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </Box>

                    <Tooltip
                        title={isAuthenticated ? 'Adicionar Proposta' : 'Entrar'}
                        placement="top"
                        onClick={() => handleFab()}
                        sx={{
                            color: defaultTheme.palette.warning.main,
                            backgroundColor: defaultTheme.palette.secondary.main,
                            cursor: 'pointer',

                            '&:hover': {
                                backgroundColor: defaultTheme.palette.warning.main,
                                color: defaultTheme.palette.secondary.main,
                            },
                        }}
                    >
                        <StyledFab>{isAuthenticated ? <Add sx={{ fontSize: 40 }} /> : <Login sx={{ fontSize: 30 }} />}</StyledFab>
                    </Tooltip>
                    <Box sx={{ flexGrow: 1 }} />

                    {isAuthenticated && (
                        <Box>
                            <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                                <Tooltip title="Início" style={{ cursor: 'pointer' }} onClick={() => history.replace('/')}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton color="secondary">
                                            <HomeOutlined style={{ fontSize: 30 }} />
                                        </IconButton>
                                        <Typography variant="overline" sx={{ color: defaultTheme.palette.common.black, mt: -1 }} fontSize={10}>
                                            Início
                                        </Typography>
                                    </Box>
                                </Tooltip>

                                <Tooltip title={'Menu'} style={{ cursor: 'pointer' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton
                                            onClick={handleOpenNavMenu}
                                            aria-controls={open ? 'admin-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            color="secondary"
                                        >
                                            <MoreVert style={{ fontSize: 30 }} />
                                        </IconButton>
                                        <Typography variant="overline" sx={{ color: defaultTheme.palette.common.black, mt: -1 }} fontSize={10}>
                                            Menu
                                        </Typography>
                                    </Box>
                                </Tooltip>
                            </Box>
                            <Menu
                                anchorEl={anchorElNav}
                                id="admin-menu"
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                onClick={handleCloseNavMenu}
                                style={{ marginTop: '-55px' }}
                                MenuListProps={{
                                    sx(theme) {
                                        return {
                                            p: 0,
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                        };
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => setOpenConsorciumAdministratorModal(true)}
                                    sx={{
                                        py: 2,
                                        ':hover': {
                                            color: defaultTheme.palette.secondary.main,
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <AccountBalance fontSize="small" sx={{ color: defaultTheme.palette.secondary.main }} />
                                    </ListItemIcon>
                                    <Typography variant="subtitle2">Administradoras</Typography>
                                </MenuItem>

                                <MenuItem
                                    sx={{
                                        py: 2,
                                        ':hover': {
                                            color: defaultTheme.palette.secondary.main,
                                        },
                                    }}
                                    component={Link}
                                    to="/proposal-approvals"
                                >
                                    <ListItemIcon>
                                        <Checklist fontSize="small" sx={{ color: defaultTheme.palette.secondary.main }} />
                                    </ListItemIcon>
                                    <Typography variant="subtitle2">Aprovações</Typography>
                                </MenuItem>

                                <MenuItem
                                    // onClick={() => setOpenLogoutModal(true)}
                                    sx={{
                                        py: 2,
                                        ':hover': {
                                            color: defaultTheme.palette.secondary.main,
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <PriceCheck fontSize="small" sx={{ color: defaultTheme.palette.secondary.main }} />
                                    </ListItemIcon>
                                    <Typography variant="subtitle2">Meus Lances</Typography>
                                </MenuItem>

                                <MenuItem
                                    // onClick={() => setOpenLogoutModal(true)}
                                    sx={{
                                        py: 2,
                                        ':hover': {
                                            color: defaultTheme.palette.secondary.main,
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <Gavel fontSize="small" sx={{ color: defaultTheme.palette.secondary.main }} />
                                    </ListItemIcon>
                                    <Typography variant="subtitle2">Minhas Propostas</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            {openLoginModal && <HomeLogin setOpenLoginModal={setOpenLoginModal} />}
            {openLogoutModal && <Logout setOpenLogoutModal={setOpenLogoutModal} />}
            {openAccountRegisterUpdateModal && <AccountRegisterUpdate setOpenAccountRegisterUpdateModal={setOpenAccountRegisterUpdateModal} />}
            {openConsortiumUpdateModal && <ConsortiumUpdateModal setOpenConsortiumUpdateModal={setOpenConsortiumUpdateModal} />}
            {openConsorciumAdministratorModal && (
                <ConsortiumAdministratorUpdateModal setOpenConsorciumAdministratorModal={setOpenConsorciumAdministratorModal} />
            )}
        </ThemeProvider>
    );
};

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});
