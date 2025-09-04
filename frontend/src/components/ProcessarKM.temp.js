import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// URL base para a API
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

// Styled Components modernizados
const StyledHeader = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  backgroundImage: "linear-gradient(135deg, #2a79b9 0%, #1e88e5 100%)",
  color: "white",
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
    zIndex: 1,
  },
}));

const UploadContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  marginBottom: theme.spacing(3),
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const UploadButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(3),
  borderStyle: "dashed",
  borderWidth: 2,
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  fontSize: "1.1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
    color: "white",
    borderColor: "transparent",
  },
}));

const FileInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

const ProcessButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: "none",
  fontSize: "1.1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
  },
}));

function ProcessarKM() {
  const [arquivo, setArquivo] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setArquivo(file);
      setMensagem(null);
    }
  };

  const handleSubmit = async () => {
    if (!arquivo) {
      setMensagem({ tipo: "error", texto: "Por favor, selecione um arquivo." });
      return;
    }

    setProcessando(true);
    const formData = new FormData();
    formData.append("arquivo", arquivo);

    try {
      const response = await fetch(`${API_BASE_URL}/processar-km`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMensagem({
          tipo: "success",
          texto: "Arquivo processado com sucesso!",
        });
        // Lógica adicional após processamento bem-sucedido
      } else {
        throw new Error("Erro ao processar arquivo");
      }
    } catch (error) {
      setMensagem({ tipo: "error", texto: "Erro ao processar o arquivo." });
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledHeader elevation={0}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: "bold",
            position: "relative",
            zIndex: 2,
          }}
        >
          <LocalShippingIcon sx={{ fontSize: 40 }} />
          Sistema de Gestão de Frotas
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 1,
            opacity: 0.9,
            position: "relative",
            zIndex: 2,
          }}
        >
          Processamento e Análise de Dados de Frotas
        </Typography>
      </StyledHeader>

      <UploadContainer>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="arquivo-input"
        />
        <label htmlFor="arquivo-input">
          <UploadButton
            component="span"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            {arquivo ? arquivo.name : "Selecione ou arraste o arquivo"}
          </UploadButton>
        </label>

        {arquivo && (
          <FileInfo>
            <CheckCircleIcon color="success" />
            <Typography>{arquivo.name}</Typography>
          </FileInfo>
        )}

        <ProcessButton
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!arquivo || processando}
          fullWidth
        >
          {processando ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Processar Planilha"
          )}
        </ProcessButton>
      </UploadContainer>

      {mensagem && (
        <Alert
          severity={mensagem.tipo}
          sx={{
            mt: 2,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          {mensagem.texto}
        </Alert>
      )}
    </Container>
  );
}

export default ProcessarKM;
