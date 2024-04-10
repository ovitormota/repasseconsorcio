import { createTheme } from '@mui/material'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#f5f5f5',
      light: 'rgba(247, 247, 247, 1)',
      contrastText: 'rgb(43,43,43)',
    },
    secondary: {
      main: '#5b61dc',
      // light: 'rgba(91, 97, 220, 1)',
      A400: 'rgba(91, 97, 220, 0.05)',
      A100: 'rgba(222,223,248)',
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
      paper: '#FFFFFF',
      default: 'rgba(247, 247, 247, 0.9)',
    },
    error: {
      main: '#FF8080',
    },
    success: {
      main: '#009688',
    },
    info: {
      main: '#ADD8E6',
    },
    warning: {
      main: '#FFB779',
    },
    text: {
      primary: '#363636',
      secondary: 'rgba(43,43,43, 0.7)',
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: '#515DE0',
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
            background: '#f5f5f5',
            color: '#515DE0',
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
          color: 'rgb(43,43,43, 0.7)',
          fontSize: '13.5px',
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
            background: '#FFFFFF !important',
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

        head: {
          fontWeight: '500',
          fontSize: 'clamp(0.8rem, 1.8vw, 0.95em) !important',
          padding: '8px',
          border: 'none !important',
        },

        body: {
          color: 'rgba(43, 43, 43)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',

          ':hover': {
            background: 'rgba(91, 97, 220, 0.1) !important',
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
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.8rem',
          backgroundColor: '#515DE0',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'rgba(91, 97, 220, 0.05)',
          color: '#5b61dc',
          border: '1px solid rgba(91, 97, 220, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(43, 43, 43, 0.5)',
          fontWeight: '500',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '1em',
          paddingRight: '1em',
        },
      },
    },
  },
})
