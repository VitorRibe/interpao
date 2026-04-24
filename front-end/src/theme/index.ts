import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#442a22', // primary from design
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7f5600', // secondary from design
      contrastText: '#ffffff',
    },
    error: {
      main: '#ba1a1a',
    },
    background: {
      default: '#faf9f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1c1c',
      secondary: '#504441',
    },
    divider: 'rgba(212, 195, 190, 0.3)', // outline-variant/30
  },
  typography: {
    fontFamily: '"Kumbh Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      fontWeight: 700,
    },
    h3: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      fontWeight: 700,
    },
    h4: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      fontWeight: 700,
    },
    h5: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      fontWeight: 700,
    },
    h6: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: '"Kumbh Sans", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Kumbh Sans", sans-serif',
    },
    body1: {
      fontFamily: '"Kumbh Sans", sans-serif',
    },
    body2: {
      fontFamily: '"Kumbh Sans", sans-serif',
    },
    button: { 
      fontFamily: '"Kumbh Sans", sans-serif',
      textTransform: 'uppercase', 
      fontWeight: 700,
      letterSpacing: '0.1em',
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
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(68, 42, 34, 0.1)',
            opacity: 0.9,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f4f3f2', // surface-container-low
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              border: 'none',
            },
            '&.Mui-focused fieldset': {
              border: 'none',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 2px rgba(68, 42, 34, 0.2)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 32px 64px -12px rgba(68, 42, 34, 0.06)',
          borderRadius: '12px',
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
