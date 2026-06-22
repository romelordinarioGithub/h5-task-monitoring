import { unstable_createMuiStrictModeTheme as createTheme } from '@mui/material/styles';
import { appColors, designTokens } from './variables';
import '@fontsource/karla';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';

const palette = {
  primary: {
    main: designTokens.colors.navy,
    light: designTokens.colors.navySoft,
  },
  secondary: {
    main: designTokens.colors.purple,
  },
  error: {
    main: '#ef4444',
  },
  success: {
    main: '#21b36b',
  },
  background: {
    default: designTokens.colors.appBg,
    paper: designTokens.colors.surface,
  },
  text: {
    primary: designTokens.colors.text,
    secondary: designTokens.colors.muted,
  },
};

const appTheme = createTheme({
  palette: {
    ...palette,
  },
  typography: {
    fontFamily: ['Montserrat', 'ProximaNova', 'Arial', 'sans-serif'].join(','),
    fontSize: 12,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    body1: {
      color: appColors.black,
      lineHeight: 1.5,
    },
    button: {
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.35,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: designTokens.colors.appBg,
          color: designTokens.colors.text,
          fontFamily: 'Montserrat, ProximaNova, Arial, sans-serif',
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.5,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.border}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.lg,
          border: `1px solid ${designTokens.colors.border}`,
          boxShadow: designTokens.shadow.card,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.sm,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0,
          minHeight: 34,
          textTransform: 'none',
          transition:
            'background-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 4px ${designTokens.colors.purpleSoft}`,
          },
        },
        containedSecondary: {
          color: '#fff',
          background: `linear-gradient(135deg, ${designTokens.colors.purple} 0%, ${designTokens.colors.purpleDark} 100%)`,
          boxShadow: designTokens.shadow.sm,
          '&:hover': {
            background: `linear-gradient(135deg, ${designTokens.colors.purpleDark} 0%, ${designTokens.colors.purple} 100%)`,
            boxShadow: designTokens.shadow.sm,
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: designTokens.colors.border,
          color: designTokens.colors.text,
          '&:hover': {
            borderColor: designTokens.colors.purple,
            backgroundColor: designTokens.colors.purpleWash,
          },
        },
        text: {
          color: designTokens.colors.muted,
          '&:hover': {
            color: designTokens.colors.purple,
            backgroundColor: designTokens.colors.purpleWash,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.sm,
          '&.Mui-focusVisible': {
            boxShadow: `0 0 0 4px ${designTokens.colors.purpleSoft}`,
          },
        },
      },
    },
    // Overriding time picker and date picker field style
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiInputLabel-root': {
            color: designTokens.colors.muted,
            fontSize: 12,
            fontWeight: 500,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: designTokens.colors.purple,
          },
        },
      },
    },
    // Overriding outlined input
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: appColors.black,
          fontSize: 12,
          backgroundColor: designTokens.colors.inputBg,
          borderRadius: designTokens.radius.sm,
          '&:hover:not(.Mui-focused):not(.Mui-error):not(.Mui-disabled) .MuiOutlinedInput-notchedOutline':
            {
              border: `1px solid ${designTokens.colors.border}`,
            },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: `1px solid ${palette.secondary.main}`,
            boxShadow: `0 0 0 4px ${designTokens.colors.purpleSoft}`,
          },

          '& .MuiSvgIcon-root': {
            width: '0.70em',
            height: '0.70em',
          },

          // Overriding auto-complete
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #fff inset',
          },
          '&.Mui-disabled': {
            backgroundColor: '#eef1f7',
            color: '#8a94a8',
          },
        },
        notchedOutline: {
          transition: '0.2s',
          border: `1px solid ${designTokens.colors.border}`,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: designTokens.colors.muted,
          fontSize: 12,
          fontWeight: 500,
        },
        asterisk: { color: designTokens.colors.danger },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: designTokens.colors.border,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          lineHeight: 'normal',
        },
      },
    },
    MuiImageListItemBar: {
      styleOverrides: {
        subtitle: {
          textTransform: 'capitalize',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          lineHeight: 'normal',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          height: '56px',
          minHeight: '56px !important',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(9, 11, 29, 0.24)',
          backdropFilter: 'blur(2px)',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 'inherit',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          top: '64px !important',
          right: '12px !important',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: designTokens.radius.sm,
          transition: 'background-color 160ms ease, color 160ms ease',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          margin: '2px 6px',
          minHeight: 34,
          borderRadius: designTokens.radius.sm,
          fontSize: 12,
          color: designTokens.colors.text,
          '&:hover': {
            backgroundColor: designTokens.colors.purpleWash,
          },
          '&.Mui-selected': {
            backgroundColor: designTokens.colors.purpleSoft,
            color: designTokens.colors.purpleDark,
          },
          '&.Mui-selected:hover': {
            backgroundColor: designTokens.colors.purpleSoft,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
          backgroundColor: designTokens.colors.purple,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          color: designTokens.colors.muted,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 0,
          textTransform: 'none',
          '&.Mui-selected': {
            color: designTokens.colors.purple,
          },
          '&.Mui-focusVisible': {
            backgroundColor: designTokens.colors.purpleWash,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: designTokens.colors.border,
          color: designTokens.colors.text,
          fontSize: 12,
        },
        head: {
          color: '#94a0b8',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          backgroundColor: designTokens.colors.surfaceAlt,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 160ms ease, box-shadow 160ms ease',
          '&:hover': {
            backgroundColor: '#fbf9ff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          fontSize: 11,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          boxShadow: '0 0 0 2px #fff',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'transparent',
            backdropFilter: 'unset',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.radius.xl,
          border: '1px solid rgba(229, 231, 235, 0.75)',
          boxShadow: designTokens.shadow.md,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderColor: designTokens.colors.border,
          boxShadow: designTokens.shadow.md,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: designTokens.colors.navy,
          borderRadius: designTokens.radius.sm,
          fontSize: 11,
          fontWeight: 500,
          boxShadow: designTokens.shadow.sm,
        },
        arrow: {
          color: designTokens.colors.navy,
        },
      },
    },
  },
});

export default appTheme;
