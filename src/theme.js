// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D64933', // Rust Red
      light: '#e06e5a',
      dark: '#b13122',
    },
    secondary: {
      main: '#2B2D42', // Navy Blue
      light: '#4a4c61',
      dark: '#1a1c2e',
    },
    background: {
      default: '#F3F7F0', // Off-White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2B2D42', // Navy Blue
      secondary: '#5c5e6e',
    },
    accent: {
      main: '#F9C22E', // Golden Yellow
    },
  },
  typography: {
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Rubik", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2B2D42', // Navy Blue
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#c03e29',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

export default theme;
