import { createTheme } from '@mui/material'

export const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFFFFF',
      light: 'rgba(247,247,253)',
      contrastText: 'rgb(43,43,43)',
    },
    secondary: {
      main: '#5b61dc',
      A400: 'rgba(91, 97, 220, 0.05)',
      A100: 'rgba(247,247,253)',
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
      default: '#FFFFFF',
    },
    error: {
      main: '#EF5350',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#66BB6A',
    },
    info: {
      main: '#64B5F6',
    },
    warning: {
      main: '#FFB54F',
    },
    text: {
      primary: 'rgba(43,43,43, 1)',
      secondary: 'rgba(43,43,43, 0.5)',
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
        root: {
          color: 'rgba(43,43,43, 1)',
        },
        outlined: {
          '&.MuiInputLabel-shrink': {
            background: '#FFFFFF',
            color: '#515DE0',
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
          borderRadius: '1em',
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
          background: 'rgba(247,247,253)',
          ':hover': {
            cursor: 'pointer',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '0.6em !important',
          paddingBottom: '0 !important',
          background: '#FFFFFF',
          borderRadius: '1em',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',

          textAlign: 'center',
          fontSize: 'clamp(0.8rem, 1.8vw, 0.95em) !important',

          '&:first-of-type': {
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          },

          '&:last-of-type': {
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
          },
        },

        head: {
          background: 'transparent !important',

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
          ':hover': {
            cursor: 'pointer',
          },
        },
        head: {
          cursor: 'default !important',
          ':hover': {
            background: 'transparent !important',
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
          background: '#FFFFFF',
          color: '#5b61dc',
          border: '1px solid rgba(91, 97, 220, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
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
    MuiDialogContent: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          borderTopLeftRadius: '1em',
          borderTopRightRadius: '1em',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          background: '#FFFFFF',
          padding: '1.5em ',
          paddingTop: '0.5em !important',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '1em',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '0.7em 1em',
        },
      },
    },
  },
})
