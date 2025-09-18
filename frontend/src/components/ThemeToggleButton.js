import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../contexts/ThemeContext";

const ThemeToggleButton = ({ sx = {} }) => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Tooltip title={mode === "light" ? "Modo escuro" : "Modo claro"}>
      <IconButton
        onClick={toggleColorMode}
        color="inherit"
        aria-label="alternar tema"
        sx={{
          ml: 1,
          ...sx,
        }}
      >
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;
