import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const StyledProgressContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2),
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[800] : "#f5f5f5",
  borderRadius: theme.shape.borderRadius,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 10px rgba(255, 255, 255, 0.1)"
      : "0 0 10px rgba(0, 0, 0, 0.05)",
  position: "relative",
  textAlign: "center",
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  "& .MuiLinearProgress-bar": {
    borderRadius: 5,
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(90deg, #2979ff, #00b0ff)"
        : "linear-gradient(90deg, #3498db, #2980b9)",
  },
}));

const ProgressText = styled(Typography)(({ animate, theme }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 500,
  color: theme.palette.mode === "dark" ? theme.palette.grey[400] : "#7f8c8d",
  fontSize: "0.9rem",
  animation: animate ? `${pulse} 1.5s infinite ease-in-out` : "none",
}));

const ProgressBar = ({
  progress,
  text,
  animate = false,
  showPercentage = true,
  isIndeterminate = false,
}) => {
  return (
    <StyledProgressContainer>
      <StyledLinearProgress
        variant={isIndeterminate ? "indeterminate" : "determinate"}
        value={isIndeterminate ? undefined : progress}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 1,
        }}
      >
        <ProgressText variant="body2" animate={animate}>
          {text ||
            (showPercentage
              ? `${Math.round(progress)}% Concluído`
              : "Processando...")}
        </ProgressText>
      </Box>
    </StyledProgressContainer>
  );
};

export default ProgressBar;
