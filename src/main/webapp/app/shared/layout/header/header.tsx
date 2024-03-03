import { AccountBalance, Add, Checklist, Gavel, HomeOutlined, Login, LogoutOutlined, ManageAccounts, MoreVert, PriceCheck } from '@mui/icons-material'
import { ListItemIcon, Menu, MenuItem, ThemeProvider, Tooltip, styled } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate'
import { ConsortiumUpdateModal } from 'app/modules/consortium/ConsortiumUpdateModal'
import { HomeLogin } from 'app/modules/login/HomeLogin'
import Logout from 'app/modules/login/logout'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { defaultTheme } from 'app/shared/layout/themes'
import { showElement } from 'app/shared/util/data-utils'
import * as React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'

export const Header = () => {
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const account = useAppSelector((state) => state.authentication.account)
  const history = useHistory()
  const location = useLocation()

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const [openConsortiumUpdateModal, setOpenConsortiumUpdateModal] = React.useState(false)
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false)
  const [openAccountRegisterUpdateModal, setOpenAccountRegisterUpdateModal] = React.useState(false)
  const [openConsorciumAdministratorModal, setOpenConsorciumAdministratorModal] = React.useState(false)
  const [openLoginModal, setOpenLoginModal] = React.useState<boolean>(false)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleFab = () => {
    if (isAuthenticated) {
      setOpenConsortiumUpdateModal(true)
    } else {
      setOpenLoginModal(true)
    }
  }

  const setBorderColorByPath = (path: string[]) => {
    const matchingPath = path.find((p) => location.pathname === p)
    return matchingPath ? defaultTheme.palette.secondary.main : defaultTheme.palette.background.paper
  }

  const setIconColorByPath = (path: string[]) => {
    const matchingPath = path.find((p) => location.pathname === p)
    return matchingPath ? defaultTheme.palette.secondary.main : defaultTheme.palette.grey[600]
  }

  const setFontWeightByPath = (path: string[]) => {
    const matchingPath = path.find((p) => location.pathname === p)
    return matchingPath ? 600 : 500
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <AppBar
        position='fixed'
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
              <Tooltip title='Início' style={{ cursor: 'pointer' }} onClick={() => history.replace('/')}>
                <Box sx={{ width: '55%', height: '100%', maxWidth: '300px' }}>
                  <img src='content/images/logo-repasse-consorcio-text.png' alt='Logo' width='100%' height='100%' />
                </Box>
              </Tooltip>
            ) : (
              <React.Fragment>
                <Box sx={{ display: 'flex' }}>
                  <Tooltip title='Perfil'>
                    <IconButton onClick={handleOpenUserMenu} aria-controls={open ? 'account-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined}>
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
                  id='account-menu'
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
                      }
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
                      <ManageAccounts fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                    </ListItemIcon>
                    <Typography variant='subtitle2'>Meu Perfil</Typography>
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
                      <LogoutOutlined fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                    </ListItemIcon>
                    <Typography variant='subtitle2'>Sair</Typography>
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </Box>

          <Tooltip
            title={isAuthenticated ? 'Adicionar Proposta' : 'Entrar'}
            placement='top'
            onClick={() => handleFab()}
            sx={{
              background: defaultTheme.palette.primary.main,
              color: defaultTheme.palette.secondary.main,
              boxShadow: '0px 2px 2px #4059AD',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: defaultTheme.palette.warning.main,
                color: defaultTheme.palette.primary.main,
              },
            }}
          >
            <StyledFab>{isAuthenticated ? <Add sx={{ fontSize: 40 }} /> : <Login sx={{ fontSize: 30 }} />}</StyledFab>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated && (
            <Box>
              <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Tooltip title='Início' style={{ cursor: 'pointer' }} onClick={() => history.replace('/')}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      minWidth: { xs: '50px', md: '100px' },
                      borderTop: `2px solid ${setBorderColorByPath(['/'])}`,

                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                      <HomeOutlined style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/']) }} />
                    </IconButton>
                    <Typography variant='overline' sx={{ color: setIconColorByPath(['/']) }} fontSize={10} fontWeight={setFontWeightByPath(['/'])}>
                      Início
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title='Meus Lances' style={{ cursor: 'pointer' }}>
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: '50px', md: '100px' },
                      borderTop: `2px solid ${setBorderColorByPath(['/bid'])}`,

                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => history.replace('/bid')}
                    style={showElement(!isAdmin)}
                  >
                    <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                      <PriceCheck style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/bid']) }} />
                    </IconButton>
                    <Typography variant='overline' sx={{ color: setIconColorByPath(['/bid']) }} fontSize={10} fontWeight={setFontWeightByPath(['/bid'])}>
                      Lances
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title='Minhas Propostas' style={{ cursor: 'pointer' }}>
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: '50px', md: '100px' },
                      borderTop: `2px solid ${setBorderColorByPath(['/my-proposals'])}`,

                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => history.replace('/my-proposals')}
                    style={showElement(!isAdmin)}
                  >
                    <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                      <Gavel style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/my-proposals']) }} />
                    </IconButton>
                    <Typography variant='overline' sx={{ color: setIconColorByPath(['/my-proposals']) }} fontSize={10} fontWeight={setFontWeightByPath(['/my-proposals'])}>
                      Propostas
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title='Administradoras' style={{ cursor: 'pointer' }}>
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: '50px', md: '100px' },
                      borderTop: `2px solid ${setBorderColorByPath(['/consortium-administrator'])}`,

                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => history.replace('/consortium-administrator')}
                    style={showElement(isAdmin)}
                  >
                    <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                      <AccountBalance style={{ fontSize: 23 }} sx={{ color: setIconColorByPath(['/consortium-administrator']) }} />
                    </IconButton>
                    <Typography variant='overline' sx={{ color: setIconColorByPath(['/consortium-administrator']) }} fontSize={10} fontWeight={setFontWeightByPath(['/consortium-administrator'])}>
                      Administradoras
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title='Aprovações' style={{ cursor: 'pointer' }}>
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: { xs: '50px', md: '100px' },
                      borderTop: `2px solid ${setBorderColorByPath(['/proposal-approvals'])}`,

                      ':hover': {
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => history.replace('/proposal-approvals')}
                    style={showElement(isAdmin)}
                  >
                    <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                      <Checklist style={{ fontSize: 25 }} sx={{ color: setIconColorByPath(['/proposal-approvals']) }} />
                    </IconButton>
                    <Typography variant='overline' sx={{ color: setIconColorByPath(['/proposal-approvals']) }} fontSize={10} fontWeight={setFontWeightByPath(['/proposal-approvals'])}>
                      Aprovações
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title={'Menu'} style={{ cursor: 'pointer' }}>
                  <Box
                    sx={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: { xs: 'flex', md: 'none' },
                      minWidth: { xs: '50px', md: '100px' },
                      borderTop: `2px solid ${setBorderColorByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator'])}`,
                    }}
                  >
                    <IconButton
                      onClick={handleOpenNavMenu}
                      aria-controls={open ? 'admin-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                      color='secondary'
                      sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}
                    >
                      <MoreVert style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator']) }} />
                    </IconButton>
                    <Typography
                      variant='overline'
                      sx={{ color: setIconColorByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator']) }}
                      fontSize={10}
                      fontWeight={setFontWeightByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator'])}
                    >
                      Menu
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorElNav}
                id='admin-menu'
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
                    }
                  },
                }}
              >
                <MenuItem
                  component={Link}
                  to='/consortium-administrator'
                  sx={{
                    py: 2,
                    ':hover': {
                      color: defaultTheme.palette.secondary.main,
                    },
                  }}
                  style={showElement(isAdmin)}
                >
                  <ListItemIcon>
                    <AccountBalance fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                  </ListItemIcon>
                  <Typography variant='subtitle2'>Administradoras</Typography>
                </MenuItem>

                <MenuItem
                  sx={{
                    py: 2,
                    ':hover': {
                      color: defaultTheme.palette.secondary.main,
                    },
                  }}
                  component={Link}
                  to='/proposal-approvals'
                  style={showElement(isAdmin)}
                >
                  <ListItemIcon>
                    <Checklist fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                  </ListItemIcon>
                  <Typography variant='subtitle2'>Aprovações</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to='/bid'
                  style={showElement(!isAdmin)}
                  sx={{
                    py: 2,
                    ':hover': {
                      color: defaultTheme.palette.secondary.main,
                    },
                  }}
                >
                  <ListItemIcon>
                    <PriceCheck fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                  </ListItemIcon>
                  <Typography variant='subtitle2'>Lances</Typography>
                </MenuItem>

                <MenuItem
                  component={Link}
                  to='/my-proposals'
                  style={showElement(!isAdmin)}
                  sx={{
                    py: 2,
                    ':hover': {
                      color: defaultTheme.palette.secondary.main,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Gavel fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                  </ListItemIcon>
                  <Typography variant='subtitle2'>Propostas</Typography>
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
    </ThemeProvider>
  )
}

const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
})
