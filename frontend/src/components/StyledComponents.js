import { styled } from "@mui/material/styles";
import { Box, Paper } from "@mui/material";

export const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 1200,
  margin: "0 auto",
  marginTop: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(4),
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const FlexBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
  },
}));

export const GridBox = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  },
}));
