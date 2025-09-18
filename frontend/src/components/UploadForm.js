import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UploadBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    gap: theme.spacing(3),
    padding: theme.spacing(3),
  },
}));

const InputGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
}));

const FileInput = styled("input")({
  display: "none",
});

const UploadButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  borderStyle: "dashed",
  borderWidth: 2,
  textTransform: "none",
  fontSize: "0.9rem",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(2),
    fontSize: "1rem",
  },
}));

const FileInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  "& .MuiTypography-root": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const UploadForm = ({
  onCustosSelect,
  onFrotasSelect,
  custosFileName,
  frotasFileName,
}) => {
  const handleCustosChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      onCustosSelect(event.target.files[0]);
    }
  };

  const handleFrotasChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      onFrotasSelect(event.target.files[0]);
    }
  };

  return (
    <Paper elevation={2}>
      <UploadBox>
        <InputGroup>
          <Typography variant="h6" color="primary">
            Planilha de Custos
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            id="custos-description"
            sx={{ mb: 1 }}
          >
            Formato aceito: Excel (.xlsx, .xls)
          </Typography>
          <label htmlFor="custos-upload">
            <FileInput
              id="custos-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleCustosChange}
              aria-describedby="custos-description"
              aria-label="Selecione a planilha de custos"
            />
            <UploadButton
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              aria-hidden="true"
              tabIndex="-1"
            >
              {custosFileName || "Selecione a planilha de custos"}
            </UploadButton>
          </label>
          {custosFileName && (
            <FileInfo role="status" aria-live="polite">
              <VisibilityIcon color="primary" fontSize="small" />
              <Typography variant="body2">{custosFileName}</Typography>
            </FileInfo>
          )}
        </InputGroup>

        <InputGroup>
          <Typography variant="h6" color="primary">
            Relação de Frotas
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            id="frotas-description"
            sx={{ mb: 1 }}
          >
            Formato aceito: Excel (.xlsx, .xls)
          </Typography>
          <label htmlFor="frotas-upload">
            <FileInput
              id="frotas-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFrotasChange}
              aria-describedby="frotas-description"
              aria-label="Selecione a relação de frotas"
            />
            <UploadButton
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              aria-hidden="true"
              tabIndex="-1"
            >
              {frotasFileName || "Selecione a relação de frotas"}
            </UploadButton>
          </label>
          {frotasFileName && (
            <FileInfo role="status" aria-live="polite">
              <VisibilityIcon color="primary" fontSize="small" />
              <Typography variant="body2">{frotasFileName}</Typography>
            </FileInfo>
          )}
        </InputGroup>
      </UploadBox>
    </Paper>
  );
};

export default UploadForm;
