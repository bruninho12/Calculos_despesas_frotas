import React, { forwardRef } from "react";
import {
  Snackbar,
  Alert as MuiAlert,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  minWidth: 300,
  maxWidth: "100%",
  animation: "slideIn 0.3s ease-out",
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "100%",
    maxWidth: "calc(100vw - 32px)",
  },
}));

const getIcon = (type) => {
  switch (type) {
    case "success":
      return <CheckCircleIcon />;
    case "error":
      return <ErrorIcon />;
    case "warning":
      return <WarningIcon />;
    case "info":
    default:
      return <InfoIcon />;
  }
};

const getBackgroundColor = (type, theme) => {
  switch (type) {
    case "success":
      return theme.palette.success.light;
    case "error":
      return theme.palette.error.light;
    case "warning":
      return theme.palette.warning.light;
    case "info":
    default:
      return theme.palette.info.light;
  }
};

const getTextColor = (type, theme) => {
  switch (type) {
    case "success":
      return theme.palette.success.dark;
    case "error":
      return theme.palette.error.dark;
    case "warning":
      return theme.palette.warning.dark;
    case "info":
    default:
      return theme.palette.info.dark;
  }
};

const Notification = ({
  open,
  message,
  type = "info",
  onClose,
  position = { vertical: "top", horizontal: "center" },
  autoHideDuration = 5000,
  variant = "custom", // custom, standard
}) => {
  const theme = useTheme();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    if (onClose) onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={position}
    >
      {variant === "standard" ? (
        <Alert onClose={handleClose} severity={type}>
          {message}
        </Alert>
      ) : (
        <NotificationContainer
          sx={{
            bgcolor: getBackgroundColor(type, theme),
            color: getTextColor(type, theme),
            borderLeft: `4px solid ${theme.palette[type].main}`,
          }}
        >
          <Box sx={{ mr: 1.5, display: "flex", alignItems: "center" }}>
            {getIcon(type)}
          </Box>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {message}
          </Typography>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </NotificationContainer>
      )}
    </Snackbar>
  );
};

export default Notification;
