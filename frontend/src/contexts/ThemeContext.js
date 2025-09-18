import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { lightTheme, darkTheme } from "../theme";

// Cria um contexto para o tema
const ThemeContext = createContext({
  mode: "light",
  toggleColorMode: () => {},
});

// Hook personalizado para usar o contexto do tema
export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Verifica se há preferência salva no localStorage, ou usa o modo do sistema
  const savedTheme = localStorage.getItem("themeMode");
  const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const defaultMode = savedTheme || (prefersDarkMode ? "dark" : "light");

  const [mode, setMode] = useState(defaultMode);

  // Memoriza o tema atual para evitar re-renderizações desnecessárias
  const theme = useMemo(
    () => createTheme(mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );

  // Função para alternar entre modo claro e escuro
  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  // Adiciona uma classe ao body para facilitar estilizações globais
  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(`${mode}-mode`);
  }, [mode]);

  // Valores disponibilizados pelo contexto
  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
