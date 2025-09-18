import React from "react";
import { Box, Link } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledSkipLink = styled(Link)(({ theme }) => ({
  position: "absolute",
  top: -100,
  left: 0,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 3),
  zIndex: 9999,
  borderRadius: "0 0 4px 0",
  textDecoration: "none",
  boxShadow: theme.shadows[4],
  fontWeight: 500,
  "&:focus": {
    top: 0,
    outline: `3px solid ${theme.palette.secondary.main}`,
  },
}));

const SkipNavigation = () => {
  return (
    <Box>
      <StyledSkipLink href="#main-content">
        Pular para o conteúdo principal
      </StyledSkipLink>
    </Box>
  );
};

export default SkipNavigation;
