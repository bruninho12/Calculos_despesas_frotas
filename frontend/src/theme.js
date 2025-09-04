import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c3e50",
      light: "#3498db",
      dark: "#2980b9",
      contrastText: "#fff",
    },
    secondary: {
      main: "#27ae60",
      light: "#2ecc71",
      dark: "#219a52",
      contrastText: "#fff",
    },
    error: {
      main: "#e74c3c",
      light: "#ff6b6b",
      dark: "#c0392b",
    },
    warning: {
      main: "#f39c12",
      light: "#f1c40f",
      dark: "#d35400",
    },
    info: {
      main: "#3498db",
      light: "#74b9ff",
      dark: "#2980b9",
    },
    success: {
      main: "#27ae60",
      light: "#2ecc71",
      dark: "#219a52",
    },
    background: {
      default: "#ecf0f1",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50",
      secondary: "#7f8c8d",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#2c3e50",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#2c3e50",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      color: "#2c3e50",
    },
    body1: {
      fontSize: "1rem",
      color: "#2c3e50",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#7f8c8d",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "0.8rem 1.5rem",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
        },
        contained: {
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
