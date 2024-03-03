import { createTheme } from '@mui/material'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#EFF2F1',
      light: 'rgba(244, 244, 244, 0.5)',
      contrastText: 'rgb(43,43,43)',
    },
    secondary: {
      main: '#4059AD',
      light: 'rgba(64, 89, 173, 0.5)',
      A100: 'rgba(64, 89, 173, 0.1)',
    },
    background: {
      paper: '#EFF2F1',
      default: 'rgba(244, 244, 244, 0.9)',
    },
    warning: {
      main: '#FFA951',
      light: 'rgba(255, 169, 81, 0.9)',
    },
    error: {
      main: '#FF5A5F',
      light: 'rgba(255, 90, 95, 0.9)',
    },
    success: {
      main: '#00C48C',
      light: 'rgba(0, 196, 140, 0.9)',
    },
    info: {
      main: '#00B8D9',
      light: 'rgba(0, 184, 217, 0.9)',
    },
    text: {
      primary: 'rgb(43,43,43)',
      secondary: 'rgba(43,43,43, 0.7)',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#4059AD',
        },
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            color: '#4059AD',
            background: '#EFF2F1',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '50%',
          margin: '-6px 2px',
          padding: '6px',
          borderRadius: '8px',
        },
        primary: {
          color: 'rgba(43,43,43, 0.7)',
          fontSize: 'clamp(0.85rem, 1.8vw, 0.95rem)',
        },
        secondary: {
          color: 'rgb(43,43,43)',
          fontSize: '14px',
          fontWeight: '500',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingLeft: '0',
          paddingRight: '0',
          paddingTop: '8px',
          paddingBottom: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ':hover': {
            scale: '1.03',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: 'rgba(64, 89, 173, 0.1)',
          fontWeight: '600',
        },
        body: {
          fontWeight: '500',
          color: 'rgba(43, 43, 43, 0.7)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.8rem',
          backgroundColor: 'rgba(64, 89, 173, 0.8)',
        },
      },
    },
  },
})
