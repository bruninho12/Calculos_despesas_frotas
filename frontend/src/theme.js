import { createTheme } from "@mui/material/styles";

// Configuração base compartilhada entre temas (com melhorias de acessibilidade)
const baseThemeSettings = {
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.3, // Melhoria de legibilidade
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.4, // Melhoria de legibilidade
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.5, // Melhoria de legibilidade
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.6, // Melhoria de legibilidade
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.6, // Melhoria de legibilidade
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.6, // Melhoria de legibilidade
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7, // Melhoria de legibilidade
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.7, // Melhoria de legibilidade
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
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
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
};

// Tema claro (com melhorias de acessibilidade e contraste)
export const lightTheme = {
  ...baseThemeSettings,
  palette: {
    mode: "light",
    primary: {
      main: "#1a4971", // Mais escuro para garantir contraste adequado
      light: "#2980b9",
      dark: "#164266",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2a753e", // Mais escuro para garantir contraste adequado
      light: "#2ecc71",
      dark: "#1e5b30",
      contrastText: "#ffffff",
    },
    error: {
      main: "#c0392b", // Mais escuro para garantir contraste adequado
      light: "#e74c3c",
      dark: "#922b20",
    },
    warning: {
      main: "#d35400", // Mais escuro para garantir contraste adequado
      light: "#e67e22",
      dark: "#a04000",
    },
    info: {
      main: "#2574a9", // Mais escuro para garantir contraste adequado
      light: "#3498db",
      dark: "#1a5276",
    },
    success: {
      main: "#218c53", // Mais escuro para garantir contraste adequado
      light: "#27ae60",
      dark: "#186a3b",
    },
    background: {
      default: "#f2f4f6",
      paper: "#ffffff",
    },
    text: {
      primary: "#2c3e50", // Contraste suficiente para fundo branco/claro
      secondary: "#505e6c", // Texto secundário mais escuro para garantir contraste
    },
    // Cores para modos de acessibilidade
    action: {
      active: "#2c3e50",
      focusOpacity: 0.2,
      focus: "rgba(26, 73, 113, 0.28)",
      activatedOpacity: 0.24,
    },
  },
};

// Tema escuro (com melhorias de acessibilidade e contraste)
export const darkTheme = {
  ...baseThemeSettings,
  palette: {
    mode: "dark",
    primary: {
      main: "#4dabf5", // Mais claro para garantir contraste em fundo escuro
      light: "#81c3f5",
      dark: "#2386c8",
      contrastText: "#000000", // Texto preto para garantir contraste com fundo azul claro
    },
    secondary: {
      main: "#4ade80", // Mais claro para garantir contraste em fundo escuro
      light: "#86efac",
      dark: "#22c55e",
      contrastText: "#000000", // Texto preto para garantir contraste
    },
    error: {
      main: "#f87171", // Mais claro para garantir contraste em fundo escuro
      light: "#fca5a5",
      dark: "#ef4444",
      contrastText: "#000000",
    },
    warning: {
      main: "#fcd34d", // Mais claro para garantir contraste em fundo escuro
      light: "#fde68a",
      dark: "#f59e0b",
      contrastText: "#000000",
    },
    info: {
      main: "#60a5fa", // Mais claro para garantir contraste em fundo escuro
      light: "#93c5fd",
      dark: "#3b82f6",
      contrastText: "#000000",
    },
    success: {
      main: "#4ade80", // Mais claro para garantir contraste em fundo escuro
      light: "#86efac",
      dark: "#22c55e",
      contrastText: "#000000",
    },
    background: {
      default: "#1a1c20", // Fundo menos escuro para melhor legibilidade
      paper: "#212529", // Fundo menos escuro para melhor legibilidade
    },
    text: {
      primary: "#f8f9fa", // Texto primário mais claro para garantir contraste
      secondary: "#ced4da", // Texto secundário mais claro para garantir contraste
    },
    // Cores para modos de acessibilidade
    action: {
      active: "#f8f9fa",
      focusOpacity: 0.3,
      focus: "rgba(77, 171, 245, 0.32)",
      activatedOpacity: 0.32,
    },
  },
  components: {
    ...baseThemeSettings.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    // Melhoria de contrastes em componentes específicos para modo escuro
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 700, // Mais negrito para melhor legibilidade
        },
        outlined: {
          borderWidth: "2px", // Borda mais espessa para melhor visibilidade
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: "#350d0d", // Fundo mais escuro
          "& .MuiAlert-icon": {
            color: "#f87171", // Ícone mais claro
          },
        },
        standardWarning: {
          backgroundColor: "#3d2a00", // Fundo mais escuro
          "& .MuiAlert-icon": {
            color: "#fcd34d", // Ícone mais claro
          },
        },
        standardInfo: {
          backgroundColor: "#0a2744", // Fundo mais escuro
          "& .MuiAlert-icon": {
            color: "#60a5fa", // Ícone mais claro
          },
        },
        standardSuccess: {
          backgroundColor: "#0d2d18", // Fundo mais escuro
          "& .MuiAlert-icon": {
            color: "#4ade80", // Ícone mais claro
          },
        },
      },
    },
  },
};

// Tema padrão para retrocompatibilidade
const theme = createTheme(lightTheme);

export default theme;
