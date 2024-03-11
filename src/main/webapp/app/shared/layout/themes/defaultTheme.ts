import { createTheme } from '@mui/material'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff',
      light: 'rgba(244, 244, 244, 0.5)',
      contrastText: 'rgb(43,43,43)',
    },
    secondary: {
      main: '#4059AD',
      light: 'rgba(64, 89, 173, 0.5)',
      A100: 'rgba(64, 89, 173, 0.1)',
    },
    background: {
      paper: '#ffffff',
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
            background: '#ffffff',
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
        root: {
          textAlign: 'center',
          border: 'none !important',
          padding: '20px !important',
          fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem) !important',

          '&:first-child': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          },

          '&:last-child': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
          },
        },
        head: {
          padding: '20px !important',
        },
        body: {
          color: 'rgba(43, 43, 43, 0.7)',
          margin: '10px !important',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          ':hover': {
            background: 'rgba(64, 89, 173, 0.1)',
            cursor: 'pointer',
          },
        },
        head: {
          background: 'transparent',
          cursor: 'default !important',
          ':hover': {
            background: 'transparent',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          mb: '150px',
          cellSpacing: '0',
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
