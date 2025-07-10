// theme.jsx
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4682b4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#607d8b", // Blue Grey for accent
    },
    background: {
      default: "#1a1a1a", // Dark industrial base
      paper: "#212121",   // Slightly lighter for components
    },
    text: {
      primary: "#e0e0e0", // Light gray for readability
      secondary: "#9e9e9e", // Subtle gray
    },
    error: {
      main: "#ef5350", // Soft red
    },
    warning: {
      main: "#ffb74d",
    },
    info: {
      main: "#29b6f6",
    },
    success: {
      main: "#66bb6a",
    },
    divider: "#424242",
  },
  typography: {
    fontFamily: `'Roboto Mono', 'Fira Code', 'Source Code Pro', monospace`,
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
    h3: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: "none",
        },
      },
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
