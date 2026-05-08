import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#442a22',
      light: '#5d4037',
      dark: '#2c160e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7f5600',
      light: '#ffb632',
      dark: '#6d4a00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ba1a1a',
      light: '#ffdad6',
      dark: '#93000a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#faf9f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1c1c',
      secondary: '#504441',
    },
    divider: '#e3e2e1', // surface-container-highest
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    h2: { 
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    h3: { 
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    h4: { 
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    h5: { 
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    h6: { 
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    button: { 
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      textTransform: 'uppercase', 
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: 800,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(68, 42, 34, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #e3e2e1',
          borderRadius: '12px',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(212, 195, 190, 0.3)',
          borderRadius: '16px !important',
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '0',
          },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);

