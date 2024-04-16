import {
  AccountBalanceRounded,
  AddRounded,
  ChecklistRounded,
  GavelRounded,
  HomeRounded,
  LoginRounded,
  LogoutOutlined,
  ManageAccountsRounded,
  MoreVertRounded,
  PriceCheckRounded,
} from '@mui/icons-material'
import { Badge, ListItemIcon, Menu, MenuItem, ThemeProvider, Tooltip, styled } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { ConsortiumAdministratorUpdateModal } from 'app/entities/consortium-administrator/ConsortiumAdministratorUpdateModal'
import { getCountConsortiumsByProposalApprovals } from 'app/entities/proposals-for-approval/proposals-for-approval.reducer'
import { AccountRegister } from 'app/modules/account/register/AccountRegister'
import { AccountRegisterUpdate } from 'app/modules/account/register/AccountRegisterUpdate'
import { ConsortiumUpdateModal } from 'app/modules/consortium/ConsortiumUpdateModal'
import { HomeLogin } from 'app/modules/login/HomeLogin'
import Logout from 'app/modules/login/logout'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { AvatarWithSkeleton } from 'app/shared/components/AvatarWithSkeleton'
import { ImageWithSkeleton } from 'app/shared/components/ImageWithSkeleton'
import { Loading } from 'app/shared/components/Loading'
import { defaultTheme } from 'app/shared/layout/themes'
import { showElement } from 'app/shared/util/data-utils'
import { useBreakpoints } from 'app/shared/util/useBreakpoints'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'

export const Header = () => {
  const isAuthenticated = useAppSelector((state) => state.authentication.isAuthenticated)
  const loading = useAppSelector((state) => state.authentication.loading)
  const isAdmin = useAppSelector((state) => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]))
  const account = useAppSelector((state) => state.authentication.account)
  const count = useAppSelector((state) => state.proposalsForApproval.count)
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const [openConsortiumUpdateModal, setOpenConsortiumUpdateModal] = React.useState(false)
  const [openConsorciumAdministratorUpdateModal, setOpenConsorciumAdministratorUpdateModal] = React.useState(false)
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false)
  const [openAccountRegisterUpdateModal, setOpenAccountRegisterUpdateModal] = React.useState(false)
  const [openAccountRegisterModal, setOpenAccountRegisterModal] = React.useState(false)
  const [openLoginModal, setOpenLoginModal] = React.useState<boolean>(false)
  const { isMDScreen } = useBreakpoints()

  React.useEffect(() => {
    if (isAuthenticated && isAdmin) {
      dispatch(getCountConsortiumsByProposalApprovals())
    }
  }, [isAuthenticated, isAdmin])

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

  const handleDisplayFab = () => {
    if ((location.pathname === '/' || location.pathname === '/my-proposals') && !isAdmin) {
      return true
    }
    if (location.pathname === '/users' && isAdmin) {
      return true
    }
    if (location.pathname === '/consortium-administrator' && isAdmin) {
      return true
    }
    return false
  }

  const handleFab = () => {
    switch (location.pathname) {
      case '/':
        isAuthenticated ? setOpenConsortiumUpdateModal(true) : setOpenLoginModal(true)
        break
      case '/my-proposals':
        setOpenConsortiumUpdateModal(true)
        break
      case '/users':
        setOpenAccountRegisterModal(true)
        break
      case '/consortium-administrator':
        setOpenConsorciumAdministratorUpdateModal(true)
        break
      default:
        break
    }
  }

  const handleTooltipTextFab = () => {
    switch (location.pathname) {
      case '/':
        return isAuthenticated ? 'Adicionar Proposta' : 'Entrar'
      case '/users':
        return 'Adicionar Usuário'
      case '/consortium-administrator':
        return 'Adicionar Administradora'
      default:
        return ''
    }
  }

  const setBorderColorByPath = (path: string[]) => {
    const matchingPath = path.find((p) => location.pathname === p)
    return matchingPath ? defaultTheme.palette.secondary.main : defaultTheme.palette.primary.main
  }

  const setIconColorByPath = (path: string[]) => {
    const matchingPath = path.find((p) => location.pathname === p)
    return matchingPath ? defaultTheme.palette.secondary.main : defaultTheme.palette.grey[300]
  }

  const setFontWeightByPath = (path: string[]) => {
    const matchingPath = path.find((p) => location.pathname === p)
    return matchingPath ? 600 : 500
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {loading ? (
        <Loading />
      ) : (
        <AppBar
          position='fixed'
          sx={{
            top: 'auto',
            bottom: 0,
            color: defaultTheme.palette.primary.main,
            background: defaultTheme.palette.primary.main,
            boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.15)',
            height: '70px',
            borderRadius: '14px 14px 0 0',
          }}
        >
          <Toolbar sx={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', p: !isAuthenticated ? 2 : { xs: 0.5, sm: 1.5 } }}>
            <Box>
              {!isAuthenticated ? (
                <Tooltip title='Repasse Consórcio' style={{ cursor: 'pointer' }} onClick={() => history.replace('/')}>
                  <img src='content/images/logo-repasse.png' alt='Logo' width='45px' loading='eager' />
                </Tooltip>
              ) : (
                <React.Fragment>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='Meu Perfil'>
                      <IconButton onClick={handleOpenUserMenu} aria-controls={open ? 'account-menu' : undefined} aria-haspopup='true' aria-expanded={open ? 'true' : undefined}>
                        <AvatarWithSkeleton imageUrl={account?.imageUrl} firstName={account?.firstName} width={50} />
                      </IconButton>
                    </Tooltip>
                    <Box sx={{ color: defaultTheme.palette.grey[300], display: 'flex', flexDirection: 'column' }}>
                      <small>Olá,</small>
                      <span>{!isMDScreen ? account.firstName : account.firstName + ' ' + account.lastName}</span>
                    </Box>
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
                        <ManageAccountsRounded fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
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
              title={handleTooltipTextFab()}
              placement='top'
              onClick={() => handleFab()}
              style={showElement(handleDisplayFab())}
              sx={{
                background: defaultTheme.palette.primary.main,
                color: defaultTheme.palette.secondary.main,
                boxShadow: '0px 8px 10px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: defaultTheme.palette.secondary.main,
                  color: defaultTheme.palette.primary.main,
                },
              }}
            >
              <StyledFab>{isAuthenticated ? <AddRounded sx={{ fontSize: 40 }} /> : <LoginRounded sx={{ fontSize: 30 }} />}</StyledFab>
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
                        borderTop: `3px solid ${setBorderColorByPath(['/'])}`,

                        ':hover': {
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                        <HomeRounded style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/']) }} />
                      </IconButton>
                      <Typography variant='overline' sx={{ color: setIconColorByPath(['/']) }} fontSize={10} fontWeight={setFontWeightByPath(['/'])}>
                        Início
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title='Meus Lances' style={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: '50px', md: '100px' },
                        borderTop: `3px solid ${setBorderColorByPath(['/bid'])}`,

                        ':hover': {
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => history.replace('/bid')}
                      style={showElement(!isAdmin)}
                    >
                      <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                        <PriceCheckRounded style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/bid']) }} />
                      </IconButton>
                      <Typography variant='overline' sx={{ color: setIconColorByPath(['/bid']) }} fontSize={10} fontWeight={setFontWeightByPath(['/bid'])}>
                        Meus Lances
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title='Minhas Propostas' style={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: '50px', md: '100px' },
                        borderTop: `3px solid ${setBorderColorByPath(['/my-proposals'])}`,

                        ':hover': {
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => history.replace('/my-proposals')}
                      style={showElement(!isAdmin)}
                    >
                      <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                        <GavelRounded style={{ fontSize: 25 }} sx={{ color: setIconColorByPath(['/my-proposals']) }} />
                      </IconButton>
                      <Typography variant='overline' sx={{ color: setIconColorByPath(['/my-proposals']) }} fontSize={10} fontWeight={setFontWeightByPath(['/my-proposals'])}>
                        Minhas Propostas
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title='Administradoras' style={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: '50px', md: '100px' },
                        borderTop: `3px solid ${setBorderColorByPath(['/consortium-administrator'])}`,

                        ':hover': {
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => history.replace('/consortium-administrator')}
                      style={showElement(isAdmin)}
                    >
                      <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                        <AccountBalanceRounded style={{ fontSize: 23 }} sx={{ color: setIconColorByPath(['/consortium-administrator']) }} />
                      </IconButton>
                      <Typography variant='overline' sx={{ color: setIconColorByPath(['/consortium-administrator']) }} fontSize={10} fontWeight={setFontWeightByPath(['/consortium-administrator'])}>
                        Administradoras
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title='Aprovações' style={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: '50px', md: '100px' },
                        borderTop: `3px solid ${setBorderColorByPath(['/proposal-approvals'])}`,

                        ':hover': {
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => history.replace('/proposal-approvals')}
                      style={showElement(isAdmin)}
                    >
                      <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                        <Badge badgeContent={count} color='error'>
                          <ChecklistRounded style={{ fontSize: 25 }} sx={{ color: setIconColorByPath(['/proposal-approvals']) }} />
                        </Badge>
                      </IconButton>
                      <Typography variant='overline' sx={{ color: setIconColorByPath(['/proposal-approvals']) }} fontSize={10} fontWeight={setFontWeightByPath(['/proposal-approvals'])}>
                        Aprovações
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title='Usuários' style={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: { xs: '50px', md: '100px' },
                        borderTop: `3px solid ${setBorderColorByPath(['/users'])}`,

                        ':hover': {
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => history.replace('/users')}
                      style={showElement(isAdmin)}
                    >
                      <IconButton color='secondary' sx={{ width: '45px', height: '45px', mb: '-6px', mt: '2px' }}>
                        <ManageAccountsRounded style={{ fontSize: 25 }} sx={{ color: setIconColorByPath(['/users']) }} />
                      </IconButton>
                      <Typography variant='overline' sx={{ color: setIconColorByPath(['/users']) }} fontSize={10} fontWeight={setFontWeightByPath(['/users'])}>
                        Usuários
                      </Typography>
                    </Box>
                  </Tooltip>

                  <Tooltip title={'Menu'} style={{ cursor: 'pointer' }}>
                    <Box
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: { xs: 'flex', lg: 'none' },
                        minWidth: { xs: '50px', md: '100px' },
                        borderTop: `3px solid ${setBorderColorByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator', '/users'])}`,
                      }}
                    >
                      <IconButton
                        onClick={handleOpenNavMenu}
                        aria-controls={open ? 'admin-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                        color='secondary'
                        sx={{ width: '45px', height: '45px', mt: '-4px' }}
                      >
                        <Badge badgeContent={anchorElNav === null ? count : 0} color='error' sx={{ top: 5 }}>
                          <MoreVertRounded style={{ fontSize: 30 }} sx={{ color: setIconColorByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator', '/users']) }} />
                        </Badge>
                      </IconButton>

                      <Typography
                        variant='overline'
                        sx={{ color: setIconColorByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator', '/users']) }}
                        fontSize={10}
                        fontWeight={setFontWeightByPath(['/bid', '/my-proposals', '/proposal-approvals', '/consortium-administrator', '/users'])}
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
                      <AccountBalanceRounded fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
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
                      <Badge badgeContent={count} color='error'>
                        <ChecklistRounded fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                      </Badge>
                    </ListItemIcon>
                    <Typography variant='subtitle2'>Aprovações</Typography>
                  </MenuItem>

                  <MenuItem
                    component={Link}
                    to='/users'
                    style={showElement(isAdmin)}
                    sx={{
                      py: 2,
                      ':hover': {
                        color: defaultTheme.palette.secondary.main,
                      },
                    }}
                  >
                    <ListItemIcon>
                      <ManageAccountsRounded fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                    </ListItemIcon>
                    <Typography variant='subtitle2'>Usuários</Typography>
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
                      <PriceCheckRounded fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                    </ListItemIcon>
                    <Typography variant='subtitle2'>Meus Lances</Typography>
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
                      <GavelRounded fontSize='small' sx={{ color: defaultTheme.palette.secondary.main }} />
                    </ListItemIcon>
                    <Typography variant='subtitle2'>Minhas Propostas</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      )}
      {openLoginModal && <HomeLogin setOpenLoginModal={setOpenLoginModal} />}
      {openLogoutModal && <Logout setOpenLogoutModal={setOpenLogoutModal} />}
      {openAccountRegisterUpdateModal && <AccountRegisterUpdate setOpenAccountRegisterUpdateModal={setOpenAccountRegisterUpdateModal} editUser={account} />}
      {openAccountRegisterModal && <AccountRegister setOpenAccountRegisterModal={setOpenAccountRegisterModal} />}
      {openConsortiumUpdateModal && <ConsortiumUpdateModal setOpenConsortiumUpdateModal={setOpenConsortiumUpdateModal} />}
      {openConsorciumAdministratorUpdateModal && <ConsortiumAdministratorUpdateModal setOpenConsorciumAdministratorUpdateModal={setOpenConsorciumAdministratorUpdateModal} />}
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
