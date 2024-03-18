import { createTheme } from '@mui/material'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFFFFF',
      light: 'rgba(244, 244, 244, 0.5)',
      contrastText: 'rgb(43,43,43)',
    },
    secondary: {
      main: '#6139AD',
      light: 'rgba(97, 57, 173, 0.5)',
      A100: 'rgba(97, 57, 173, 0.1)',
    },
    background: {
      paper: '#FFFFFF',
      default: 'rgba(244, 244, 244, 0.9)',
    },
    warning: {
      main: '#FFA500',
      light: 'rgba(255, 165, 0, 0.9)',
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
          color: '#6139AD',
        },
        root: {
          borderRadius: '1rem',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            color: '#6139AD',
            paddingLeft: '5px',
            paddingRight: '5px',
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
          borderRadius: '1rem',
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
            transition: 'all 0.3s ease',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: 'center',
          border: 'none !important',
          marginTop: '10px !important',
          padding: '1rem !important',
          fontSize: 'clamp(0.8rem, 1.8vw, 0.95em) !important',

          '&:first-child': {
            borderTopLeftRadius: '1rem',
            borderBottomLeftRadius: '1rem',
          },

          '&:last-child': {
            borderTopRightRadius: '1rem',
            borderBottomRightRadius: '1rem',
          },
        },

        body: {
          color: 'rgba(43, 43, 43, 0.7)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          borderBottom: '4px solid #F6F6F6',

          ':hover': {
            background: 'rgba(97, 57, 173, 0.1)',
            cursor: 'pointer',
          },
        },
        head: {
          borderBottom: 'none !important',
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
          borderRadius: '1rem',
          mb: '150px',
          cellSpacing: '0',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.8rem',
          backgroundColor: 'rgba(97, 57, 173, 0.8)',
        },
      },
    },
  },
})
