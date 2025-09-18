import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  Typography,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ContrastIcon from "@mui/icons-material/Contrast";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AnimationIcon from "@mui/icons-material/Animation";
import FormatLineSpacingIcon from "@mui/icons-material/FormatLineSpacing";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useAccessibility } from "../contexts/AccessibilityContext";

const AccessibilityButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  zIndex: 1000,
  width: 50,
  height: 50,
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SettingItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5, 0),
}));

const SettingLabel = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const AccessibilityMenu = () => {
  const [open, setOpen] = useState(false);
  const {
    highContrast,
    largeText,
    reduceMotion,
    focusVisible,
    textSpacing,
    toggleSetting,
    resetSettings,
  } = useAccessibility();
  const theme = useTheme();

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Tooltip title="Configurações de Acessibilidade" arrow>
        <AccessibilityButton
          aria-label="Configurações de Acessibilidade"
          onClick={handleToggle}
          size="large"
        >
          <AccessibilityNewIcon />
        </AccessibilityButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleToggle}
        aria-labelledby="accessibility-dialog-title"
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle id="accessibility-dialog-title" sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessibilityNewIcon color="primary" />
            <Typography variant="h6" component="span">
              Configurações de Acessibilidade
            </Typography>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ajuste estas opções para melhorar sua experiência de navegação
            conforme suas necessidades.
          </Typography>

          <SettingItem>
            <SettingLabel>
              <ContrastIcon color={highContrast ? "primary" : "action"} />
              <Box>
                <Typography variant="body1">Alto Contraste</Typography>
                <Typography variant="caption" color="text.secondary">
                  Aumenta o contraste entre texto e fundo
                </Typography>
              </Box>
            </SettingLabel>
            <Switch
              checked={highContrast}
              onChange={() => toggleSetting("highContrast")}
              inputProps={{ "aria-label": "Alto Contraste" }}
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel>
              <TextFieldsIcon color={largeText ? "primary" : "action"} />
              <Box>
                <Typography variant="body1">Texto Grande</Typography>
                <Typography variant="caption" color="text.secondary">
                  Aumenta o tamanho do texto em toda a aplicação
                </Typography>
              </Box>
            </SettingLabel>
            <Switch
              checked={largeText}
              onChange={() => toggleSetting("largeText")}
              inputProps={{ "aria-label": "Texto Grande" }}
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel>
              <AnimationIcon color={reduceMotion ? "primary" : "action"} />
              <Box>
                <Typography variant="body1">Reduzir Animações</Typography>
                <Typography variant="caption" color="text.secondary">
                  Reduz ou remove animações e transições
                </Typography>
              </Box>
            </SettingLabel>
            <Switch
              checked={reduceMotion}
              onChange={() => toggleSetting("reduceMotion")}
              inputProps={{ "aria-label": "Reduzir Animações" }}
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel>
              <VisibilityIcon color={focusVisible ? "primary" : "action"} />
              <Box>
                <Typography variant="body1">Destaque de Foco</Typography>
                <Typography variant="caption" color="text.secondary">
                  Torna o foco mais visível em elementos interativos
                </Typography>
              </Box>
            </SettingLabel>
            <Switch
              checked={focusVisible}
              onChange={() => toggleSetting("focusVisible")}
              inputProps={{ "aria-label": "Destaque de Foco" }}
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel>
              <FormatLineSpacingIcon
                color={textSpacing ? "primary" : "action"}
              />
              <Box>
                <Typography variant="body1">Espaçamento de Texto</Typography>
                <Typography variant="caption" color="text.secondary">
                  Aumenta o espaçamento entre letras e linhas
                </Typography>
              </Box>
            </SettingLabel>
            <Switch
              checked={textSpacing}
              onChange={() => toggleSetting("textSpacing")}
              inputProps={{ "aria-label": "Espaçamento de Texto" }}
            />
          </SettingItem>
        </DialogContent>

        <DialogActions>
          <Button
            startIcon={<RestartAltIcon />}
            onClick={resetSettings}
            variant="outlined"
            sx={{ mr: "auto" }}
          >
            Restaurar Padrões
          </Button>
          <Button onClick={handleToggle} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AccessibilityMenu;
