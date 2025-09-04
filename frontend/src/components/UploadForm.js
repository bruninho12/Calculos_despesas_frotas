import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";

const UploadBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

const InputGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

const FileInput = styled("input")({
  display: "none",
});

const UploadButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderStyle: "dashed",
  borderWidth: 2,
  textTransform: "none",
}));

const FileInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
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
          <label htmlFor="custos-upload">
            <FileInput
              id="custos-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleCustosChange}
            />
            <UploadButton
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              {custosFileName || "Selecione a planilha de custos"}
            </UploadButton>
          </label>
          {custosFileName && (
            <FileInfo>
              <VisibilityIcon color="primary" fontSize="small" />
              <Typography variant="body2">{custosFileName}</Typography>
            </FileInfo>
          )}
        </InputGroup>

        <InputGroup>
          <Typography variant="h6" color="primary">
            Relação de Frotas
          </Typography>
          <label htmlFor="frotas-upload">
            <FileInput
              id="frotas-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFrotasChange}
            />
            <UploadButton
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              {frotasFileName || "Selecione a relação de frotas"}
            </UploadButton>
          </label>
          {frotasFileName && (
            <FileInfo>
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
