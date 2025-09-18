import React from "react";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ThemeToggleButton from "./ThemeToggleButton";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  position: "relative",
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    gap: theme.spacing(2),
  },
}));

const HeaderContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    textAlign: "center",
  },
}));

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Container maxWidth="lg">
        <StyledToolbar>
          <HeaderContent>
            <LocalShippingIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontWeight: "bold" }}
              >
                Sistema de Gestão de Frotas
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
                Processamento e Análise de Dados de Frotas
              </Typography>
            </Box>
          </HeaderContent>
          <ThemeToggleButton />
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;
