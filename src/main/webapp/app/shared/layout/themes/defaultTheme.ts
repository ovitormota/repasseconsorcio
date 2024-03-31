import { createTheme } from '@mui/material'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFFFFF',
      light: 'rgba(255, 255, 255, 0.9)',
      contrastText: 'rgb(43,43,43)',
    },
    secondary: {
      main: '#7555D7',
      light: '#6B30BE',
      A100: 'rgba(117, 85, 215, 0.1)',
    },
    grey: {
      50: '#F6F6F6',
      100: '#E5E5E5',
      200: '#CCCCCC',
      300: '#B3B3B3',
      400: '#999999',
      500: '#808080',
      600: '#666666',
      700: '#4D4D4D',
      800: '#333333',
      900: '#1A1A1A',
    },
    background: {
      paper: '#F7F7F7',
      default: 'rgba(247, 247, 247, 0.9)',
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
          color: '#7555D7',
        },
        root: {
          borderRadius: '10px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          '&.MuiInputLabel-shrink': {
            color: '#7555D7',
            paddingLeft: '5px',
            paddingRight: '5px',
            fontWeight: '500',
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
          borderRadius: '10px',
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
          background: '#F7F7F7',
          borderBottom: '4px solid #FFFFFF',

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
          borderRadius: '10px',
          mb: '150px',
          cellSpacing: '0',
          paddingLeft: '1em',
          paddingRight: '1em',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.8rem',
          backgroundColor: 'rgba(117, 85, 215, 0.8)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: '#cccccc',
        },
      },
    },
  },
})
